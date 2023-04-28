import { Component, Input, HostListener } from '@angular/core';

import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { RecursoService } from '../../../../../../services/recursoService';

import { BreadcrumbList, ListaPrecio } from '../../../../../../models/listaPrecio';
import { Rubro } from 'app/models/rubro';
import { SubRubro } from 'app/models/subRubro';
import { resourcesREST } from 'constantes/resoursesREST';
import { Moneda } from '../../../../../../models/moneda';
import { Producto } from '../../../../../../models/producto';
import { FiltroListaPrecios } from '../../../../../../models/filtroListaPrecio';
import { DetalleProducto } from '../../../../../../models/detalleProducto';

import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Padron } from 'app/models/padron';
import gruposParametros from 'constantes/gruposParametros';
import { PopupListaService } from 'app/pages/reusable/otros/popup-lista/popup-lista-service';
import { LocalStorageService } from 'app/services/localStorageService';

@Component({
    selector: 'nuevo-lista-precio',
    styleUrls: ['./nuevoListaPrecio.scss'],
    templateUrl: './nuevoListaPrecio.html',
})

export class NuevoListaPrecio {
    recurso: ListaPrecio = new ListaPrecio();
    recursoOriginal: ListaPrecio = new ListaPrecio();
    recursoBusqueda: ListaPrecio = new ListaPrecio();

    monedas: Observable<Moneda[]>;
    rubros: Observable<Rubro[]>;
    subRubros: Observable<SubRubro[]>;
    
    // Los filtros que después le mando al backend
    filtroListaPrecios: FiltroListaPrecios = new FiltroListaPrecios();

    // Columnas de la tabla
    columnasTabla;
    columnasTablaBusqueda;

    // Bandera que habilita los detalles una vez que se completo la data de la nueva lsita
    detallesActivos: boolean = false;

    padrones: { todos: Padron[]; filtrados: BehaviorSubject<Padron[]> } = { todos: [], filtrados: new BehaviorSubject([]) }
    padronEnfocadoIndex: number = -1;

    productos: { todos: Producto[]; filtrados: BehaviorSubject<Producto[]> } = { todos: [], filtrados: new BehaviorSubject([]) }
    productoEnfocadoIndex: number = -1;
    productoEnfocadoIndexHasta: number = -1;
    
    proveedores: { todos: Padron[]; filtrados: BehaviorSubject<Padron[]> } = { todos: [], filtrados: new BehaviorSubject([]) }
    proveedorEnfocadoIndex: number = -1;

    contadorCodigoLista: Observable<any>;

    textProdSearched;
    textProdSearchedBusqueda;

    actualizarPrecioVentaActivo = false;
    nuevoPorcentaje: number = 0;
    isLoading = true;
    detalleProductosSeleccionados: DetalleProducto[] = [];
    detalleProductosBusquedaSeleccionados: DetalleProducto[] = [];


    get breadcrumbList() {

        const breadcrumbList: BreadcrumbList[] = [];

        breadcrumbList.push({
            text: "Lista Precios",
            isActive: false,
            routerLink: "/pages/tablas/lista-precios"
        });

        breadcrumbList.push({
            text: "Agregar",
            isActive: false,
        });

        breadcrumbList.push({
            text:  this.recurso.codigoLista ? `${ this.recurso.codigoLista } - ${this.recurso.condiciones ? this.recurso.condiciones : "Nuevo"}` : "",
            isActive: true,
        });

        if(this.detallesActivos){
            breadcrumbList[breadcrumbList.length - 1].isActive = false;

            breadcrumbList.push({
                text: "ABM Artículos",
                isActive: true,
            });
        }

        return breadcrumbList;
    }

    get activateConfirm() {  
        const checkIfIncomplete = this.utilsService.checkIfIncomplete(this.recurso)(['idPadronCliente', 'idPadronRepresentante', 'activa'])();
        const isCollection = this.recurso.listaPrecioDetCollection.length > 0;
        return !checkIfIncomplete && isCollection; 
    }

    get isValidCotaInfPorc() {
        let isvalid = true;
        if(this.filtroListaPrecios.cotaInfPorce < -15 || this.filtroListaPrecios.cotaInfPorce > 0)
            isvalid = false;

        return isvalid;
    }

    get isValidCotaSupPorc() { 
        let isvalid = true;
        if(this.filtroListaPrecios.cotaSupPorce < 0 || this.filtroListaPrecios.cotaSupPorce > 15)
            isvalid = false;

        return isvalid;
    }

    // Permisos
    get permisoListaPrecio() { 
        var perfil = this.localStorageService.getObject(environment.localStorage.perfil);
        return perfil.idPerfil == 1; 
    }

    getColumnsTablas = () => {
        return [
            {
                nombre: 'codigo',
                key: 'producto',
                subkey: 'codProducto',
                ancho: '15%'
            },
            {
                nombre: 'descripcion',
                key: 'producto',
                customClass: 'text-left',
                subkey: 'descripcion',
                ancho: '20%'
            },
            {
                nombre: 'precio compra',
                key: 'ultimoPrecioCompra',
                customClass: 'text-right',
                ancho: '10%',
                threeDecimals: true
            },

            {
                nombre: 'precio venta',
                key: 'precio',
                customClass: 'text-right',
                ancho: '10%',
                enEdicion: null,
                threeDecimals: true
            },
            {
                nombre: 'inferior',
                key: 'cotaInf',
                customClass: 'text-right',
                ancho: '10%',
                enEdicion: null,
                threeDecimals: true
            },
            {
                nombre: 'superior',
                key: 'cotaSup',
                customClass: 'text-right',
                ancho: '10%',
                enEdicion: null,
                threeDecimals: true
            },
            {
                nombre: '% inferior',
                key: 'cotaInfPorce',
                customClass: 'text-right',
                ancho: '5%',
                enEdicion: null
            },
            {
                nombre: '% superior',
                key: 'cotaSupPorce',
                customClass: 'text-right',
                ancho: '5%',
                enEdicion: null
            },
            {
                nombre: 'observaciones',
                key: 'observaciones',
                ancho: '25%',
                enEdicion: null
            },
        ];
    }
    
    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute,
        private popupListaService: PopupListaService,
        private localStorageService: LocalStorageService
    ) {
        this.isLoading = true;

        this.monedas = this.recursoService.getRecursoList(resourcesREST.sisMonedas)();
        this.rubros = this.recursoService.getRecursoList(resourcesREST.rubros)();
        
        // 'enEdicion' alverga el id del recurso actualmente en edicion
        this.columnasTabla = this.getColumnsTablas();
        this.columnasTablaBusqueda = this.getColumnsTablas();


        this.recursoService.getRecursoList(resourcesREST.padron)({ grupo: gruposParametros.cliente })
            .subscribe(padrones => {
                this.padrones.todos = padrones;
                // this.padrones.filtrados.next(padrones);
                this.padrones.filtrados.next([]);
            })

        this.recursoService.getRecursoList(resourcesREST.productos)()
            .subscribe(productos => {
                this.productos.todos = productos;
                this.productos.filtrados.next(productos);
            })

        this.recursoService.getRecursoList(resourcesREST.padron)({
                grupo: gruposParametros.cliente
            }).subscribe(proveedores => {
                this.proveedores.todos = proveedores;
                this.proveedores.filtrados.next(proveedores);
            });

        this.recursoService.getProximoCodigoListaPrecio()
            .subscribe( codigoListaProximo => {
                this.recurso.codigoLista = codigoListaProximo;
                this.isLoading = false;
            })
    }

    ngOnInit() {
        this.recursoService.setEdicionFinalizada(false);
    }

    @HostListener('window:beforeunload')
    canDeactivate = () => 
        this.recursoService.checkIfEquals(this.recurso, new ListaPrecio()) || 
        this.recursoService.getEdicionFinalizada();

    /**
     * En realidad 'enEdicion' tiene siempre el mismo valor. Lo seteo en varias columnas para saber cual se puede editar
     * y cual no. 
     */
    onClickEditRecurso = (recurso: DetalleProducto) => {
        this.columnasTabla = this.columnasTabla.map(tabla => {
            let newTabla = tabla;
            if (newTabla.enEdicion !== undefined) {
                newTabla.enEdicion = recurso.idDetalleProducto
            }
            return newTabla;
        });
    }

    onClickEditRecursoBusqueda = (recurso: DetalleProducto) => {
        this.columnasTablaBusqueda = this.columnasTablaBusqueda.map(tabla => {
            let newTabla = tabla;
            if (newTabla.enEdicion !== undefined) {
                newTabla.enEdicion = recurso.idDetalleProducto
            }
            return newTabla;
        });
    }

    /**
     * Acá solo tengo que 'cerrar la edición' ya que los campos ya están bindeados y se cambian automáticamente
     */
    onClickConfirmEditRecurso = (recurso: DetalleProducto) => {
        // Todos los atributos 'enEdicion' distintos de undefined y también distintos de null o false, los seteo en false
        this.columnasTabla = this.columnasTabla.map(tabla => {
            let newTabla = tabla;
            if (newTabla.enEdicion !== undefined && newTabla.enEdicion) {
                newTabla.enEdicion = false;
            }
            return newTabla;
        })
    }

    onClickConfirmEditRecursoBusqueda = (recurso: DetalleProducto) => {
        // Todos los atributos 'enEdicion' distintos de undefined y también distintos de null o false, los seteo en false
        this.columnasTablaBusqueda = this.columnasTablaBusqueda.map(tabla => {
            let newTabla = tabla;
            if (newTabla.enEdicion !== undefined && newTabla.enEdicion) {
                newTabla.enEdicion = false;
            }
            return newTabla;
        })
    }

    /** 
     * Acá se elimina un producto de el array (Aclaración: NO se borra el producto de la BD, solamente se borra del array de acá)
     */
    onClickRemoveRecurso = (recurso: DetalleProducto) => {
        this.utilsService.showModal(
            'Borrar detalle'
        )(
            '¿Estás seguro de borrar este producto de la lista?'
        )(
            () => {
                // Borro el producto de el array
                this.recurso.listaPrecioDetCollection = this.recurso.listaPrecioDetCollection
                    .filter((detalleProd: DetalleProducto) => detalleProd.producto.idProductos !== recurso.producto.idProductos);
            }
        )({
            tipoModal: 'confirmation'
        });
    }

    onClickRemoveRecursoBusqueda = (recurso: DetalleProducto) => {
        this.utilsService.showModal(
            'Borrar detalle'
        )(
            '¿Estás seguro de borrar este producto de la lista?'
        )(
            () => {
                // Borro el producto de el array
                this.recursoBusqueda.listaPrecioDetCollection = this.recursoBusqueda.listaPrecioDetCollection
                    .filter((detalleProd: DetalleProducto) => detalleProd.producto.idProductos !== recurso.producto.idProductos);
            }
        )({
            tipoModal: 'confirmation'
        });
    }

    /**
     * Hace una consulta y trae todos los productos según los filtros seteados
     */
    onClickAgregar = async (e) => {

        this.isLoading = true;

        // El porcentajeCabecera está en la nueva lista creada, tengo que agregarlo a los filtros
        this.filtroListaPrecios.porcentajeCabecera = this.recurso.porc1;
        // También la moneda
        this.filtroListaPrecios.moneda = this.recurso.idMoneda;
        // Limpiar recursos de búsqueda
        this.recursoBusqueda.listaPrecioDetCollection = [];
        
        try {
            // Agrego los detalles a la lista de detalles de la lista de precios
            this.recursoService.getProductosByFiltro(this.filtroListaPrecios).subscribe((listaDetalles: DetalleProducto[]) => {
                // Agrego los porcentaje a cada detalle
                const cloneListaDet = listaDetalles.map(det => {
                    const cloneDet = Object.assign({}, det);

                    cloneDet.cotaInfPorce = this.filtroListaPrecios.cotaInfPorce;
                    cloneDet.cotaSupPorce = this.filtroListaPrecios.cotaSupPorce;

                    return cloneDet;
                })

                // Remuevo duplicados y guardo en el recurso
                this.recursoBusqueda.listaPrecioDetCollection = _.uniqWith(
                    this.recursoBusqueda.listaPrecioDetCollection.concat(cloneListaDet),
                    (a: DetalleProducto, b: DetalleProducto) => a.producto.idProductos === b.producto.idProductos
                );

                this.detalleProductosBusquedaSeleccionados.push(...this.recursoBusqueda.listaPrecioDetCollection);

                this.isLoading = false;
                this.getPrecioVenta();
            },  
            Error => {
                this.isLoading = false;
            });
        }
        catch(ex) {
            this.isLoading = false;
            this.utilsService.decodeErrorResponse(ex);
        }
    }

    /**
     * Limpia filtros y resultado de la búsqueda
     */
        onClickCancelarAgregarBusqueda() {
            this.recursoBusqueda.listaPrecioDetCollection = [];
        }
    
        /**
         * Agrega los artículos seleccionados en el grid de búsqueda a lista final para guardar
         */
        onClickAgregarBusqueda() {
            if (this.detalleProductosBusquedaSeleccionados.length > 0) {
                this.recurso.listaPrecioDetCollection.push(...this.detalleProductosBusquedaSeleccionados);
                this.detalleProductosSeleccionados.push(...this.detalleProductosBusquedaSeleccionados);
                this.recursoBusqueda.listaPrecioDetCollection = [];
                this.detalleProductosBusquedaSeleccionados = [];
            }
        }

    /**
     * Eliminar productos de la lista
     */
    onClickEliminar = (e) => {
        this.isLoading = true;
        // El porcentajeCabecera está en la nueva lista creada, tengo que agregarlo a los filtros
        this.filtroListaPrecios.porcentajeCabecera = this.recurso.porc1;
        try {
            // Elimino los elementos encontrados de la lista de detalles actual
            this.recursoService.getProductosByFiltro(this.filtroListaPrecios)
                .subscribe(
                    (detallesEncontrados: DetalleProducto[]) => {

                        this.recurso.listaPrecioDetCollection = _.filter(
                            this.recurso.listaPrecioDetCollection,
                            detProd => !_.some(
                                detallesEncontrados,
                                detProdEnc => detProd.producto.idProductos === detProdEnc.producto.idProductos
                            ));

                        this.isLoading = false;
                    },  
                    Error => {
                        this.isLoading = false;
                    });
        }
        catch(ex) {
            this.isLoading = false;
            this.utilsService.decodeErrorResponse(ex);
        }
    }

    /**
     * Confirmar la creacion de la lista
     */
    onClickConfirmar = async(e) => {
        try {
            this.isLoading = true;
            const resp: any = await this.recursoService.setRecurso(this.recurso)();
            if(resp){
                this.isLoading = false;
            }

            this.utilsService.showModal(resp.control.codigo)(resp.control.descripcion)
            (
                () => {
                    this.router.navigate(['/pages/tablas/lista-precios']);
                    this.recursoService.setEdicionFinalizada(true);
                }
            )();
        }
        catch(ex) {
            this.isLoading = false;
            this.utilsService.decodeErrorResponse(ex);
        }
        
    }

    /**
     * Div para aplicar nuevo porcentaje a precio venta de la lista
     */
    onClickActualizar = async () => {
        this.actualizarPrecioVentaActivo = true;
    }

    onClickAplicarNuevoPorc() {
        this.utilsService.showModal(
            'Aplicar nuevo porcentaje'
        )(
            '¿Estás seguro de aplicar el nuevo porcentaje al Precio Venta?'
        )(
            () => {
                this.recurso.listaPrecioDetCollection.forEach(detalleProducto => {
                    if(this.detalleProductosSeleccionados.findIndex(f => f.idDetalleProducto == detalleProducto.idDetalleProducto) >= 0) {
                        let newPrecio = parseFloat(detalleProducto.precio.toString()) + (detalleProducto.precio * this.nuevoPorcentaje / 100);
                        detalleProducto.precio = newPrecio;
                    }
                });
                //Falta mensaje que se actualizaron N artículos
                this.actualizarPrecioVentaActivo = false;
            }
        )({
            tipoModal: 'confirmation'
        });
    }

    onClickCancelarNuevoPorc() {
        this.actualizarPrecioVentaActivo = false;
    }

    /**
     * Habilita el resto del menu para seguir el proceso, o vuelto atrás
     */
    onClickTogglePaso = (e) => {
        this.detallesActivos = !this.detallesActivos;
        this.actualizarPrecioVentaActivo = false;
        this.recursoBusqueda.listaPrecioDetCollection = [];
        this.nuevoPorcentaje = 0;
    }

    /**
     * Control de Checkbox
     */
    onClickCheckRecurso = (detalleProducto: DetalleProducto, event: any) => {
        if(!event.target.checked) {
            //Eliminar de la lista de seleccionados
            var index = this.detalleProductosSeleccionados.findIndex(f => f.idDetalleProducto == detalleProducto.idDetalleProducto);
            this.detalleProductosSeleccionados.splice(index, 1);
        } else {
            //Agregar de la lista de selecconados
            this.detalleProductosSeleccionados.push(detalleProducto);
        }
    }

    onClickCheckRecursoBusqueda = (detalleProducto: DetalleProducto, event: any) => {
        if(!event.target.checked) {
            var index = this.detalleProductosBusquedaSeleccionados.findIndex(f => f.idDetalleProducto == detalleProducto.idDetalleProducto);
            this.detalleProductosBusquedaSeleccionados.splice(index, 1);
        } else {
            this.detalleProductosBusquedaSeleccionados.push(detalleProducto);
        }
    }    

    /**
     * Setea la fecha de compra calculandola dado un string en formato 'ddmm', parseando a 'dd/mm/aaaa'
     */
    onCalculateFecha = (e) => (keyFecha) => (objetoContenedor) => {
        if (!this[objetoContenedor][keyFecha] || typeof this[objetoContenedor][keyFecha] !== 'string') return;
        
        this[objetoContenedor][keyFecha] = this.utilsService.stringToDateLikePicker(this[objetoContenedor][keyFecha]);

        // Hago focus en el prox input
        (keyFecha==='fechaAlta') ? document.getElementById(`fechaVigenciaDesde`).focus() : null;
        (keyFecha==='vigenciaDesde') ? document.getElementById(`fechaVigenciaHasta`).focus() : null;
        (keyFecha==='vigenciaHasta') ? document.getElementById(`porcPrecioVenta`).focus() : null;

    }

    /**
     * 
     */
    onChangeCliProv = (busqueda) => {

        if (busqueda && busqueda.length === 0) {
            this.padrones.filtrados.next([]);    
        } else {
            this.padrones.filtrados.next(
                this.utilsService.filtrarPadrones(this.padrones.todos, busqueda)
            );
        }

        // Reseteo el indice
        this.padronEnfocadoIndex = -1;
    }

    /**
     * Event on click en la lista del popup de padrones
     */
    onClickPopupPadron = (idPadronName) => 
        (prove: Padron) => this.recurso[idPadronName] = prove.padronCodigo

    /**
     * Evento on enter en el input de buscar cliente
     */
    onEnterPopup = (idPadronName) => {
        this.padrones.filtrados.subscribe(provsLista => {
            const provSelect = provsLista && provsLista.length ? provsLista[this.padronEnfocadoIndex] : null;
            provSelect ? this.onClickPopupPadron(idPadronName)(provSelect) : null;
            this.padronEnfocadoIndex = -1;
        })
    }

    keyPressInputTexto = (e: any) => (upOrDown) => {
        e.preventDefault();
        // Hace todo el laburo de la lista popup y retorna el nuevo indice seleccionado
        this.padronEnfocadoIndex = 
            this.popupListaService.keyPressInputForPopup(upOrDown)(this.padrones.filtrados.value)(this.padronEnfocadoIndex)
    }


    /////////////////////////////
    // Buscador producto desde //
    /////////////////////////////
    onChangeProducto = (busqueda) => {
        if (busqueda && busqueda.length === 0) {
            this.productos.filtrados.next([]);    
        } else {
            this.productos.filtrados.next(
                this.productos.todos.filter(
                    (prov: Producto) =>   prov.codProducto.toString().includes(busqueda) ||
                                        prov.descripcion.toString().toLowerCase().includes(busqueda)
                )
            );
        }

        this.productoEnfocadoIndex = -1;
    }

    onClickPopupProducto = (prod: Producto) => {
        prod && prod.codProducto ?
            this.filtroListaPrecios.codProdDesde = prod.codProducto : null;

        // Focus siguiente elemento
        document.getElementById('prodHasta') ? document.getElementById('prodHasta').focus() : null

        // Reinicio la lista de productos filtrados
        this.productos.filtrados.next(this.productos.todos);
    }

    onEnterProducto = (e: any) => {
        e.preventDefault();

        const prodsLista = this.productos.filtrados.value;
        const prodSelect: any = prodsLista && prodsLista.length ? prodsLista[this.productoEnfocadoIndex] : null;

        prodSelect ? this.onClickPopupProducto(prodSelect) : null;

        this.productoEnfocadoIndex = -1;
    }

    /////////////////////////////
    // Buscador producto hasta //
    /////////////////////////////
    onChangeProductoHasta = (busqueda) => {
        if (busqueda && busqueda.length === 0) {
            this.productos.filtrados.next([]);    
        } else {
            this.productos.filtrados.next(
                this.productos.todos.filter(
                    (prov: Producto) =>   prov.codProducto.toString().includes(busqueda) ||
                                        prov.descripcion.toString().toLowerCase().includes(busqueda)
                )
            );
        }

        this.productoEnfocadoIndexHasta = -1;
    }

    onClickPopupProductoHasta = (prod: Producto) => {
        prod && prod.codProducto ?
            this.filtroListaPrecios.codProdHasta = prod.codProducto : null;

        // Focus siguiente elemento
        document.getElementById('proveedor') ? document.getElementById('proveedor').focus() : null

        // Reinicio la lista de productos filtrados
        this.productos.filtrados.next(this.productos.todos);
    }

    onEnterProductoHasta = (e: any) => {
        e.preventDefault();

        const prodsLista = this.productos.filtrados.value;
        const prodSelect: any = prodsLista && prodsLista.length ? prodsLista[this.productoEnfocadoIndexHasta] : null;

        prodSelect ? this.onClickPopupProductoHasta(prodSelect) : null;

        this.productoEnfocadoIndexHasta = -1;
    }

    /////////////////////////////
    // Buscador proveedor      //
    /////////////////////////////
    onChangeProveedor = (busqueda) => {
        if (busqueda && busqueda.length === 0) {
            this.proveedores.filtrados.next([]);    
        } else {
            this.proveedores.filtrados.next(
                this.proveedores.todos.filter(
                    (prov: Padron) =>   prov.padronCodigo.toString().includes(busqueda) ||
                                        prov.padronApelli.toString().toLowerCase().includes(busqueda)
                )
            );
        }

        this.proveedorEnfocadoIndex = -1;
    }

    onClickPopupProveedor = (prod: Padron) => {
        prod && prod.padronCodigo ?
            this.filtroListaPrecios.codProvedor = prod.padronCodigo : null;

        // Focus siguiente elemento
        document.getElementById('filtroRubro') ? document.getElementById('filtroRubro').focus() : null

        // Reinicio la lista de productos filtrados
        this.proveedores.filtrados.next(this.proveedores.todos);
    }

    onEnterProveedor = (e: any) => {
        e.preventDefault();

        const provsLista = this.proveedores.filtrados.value;
        const provSelect: any = provsLista && provsLista.length ? provsLista[this.proveedorEnfocadoIndex] : null;

        provSelect ? this.onClickPopupProveedor(provSelect) : null;

        this.proveedorEnfocadoIndex = -1;
    }

    /////////////////////////////
    // Buscador subRubros      //
    /////////////////////////////
    onChangeRubro = () => {
        this.filtroListaPrecios.subRubro.idSubRubro = null;
        if (this.filtroListaPrecios.rubro.idRubro) {
            this.subRubros = this.recursoService.getRecursoList(resourcesREST.subRubros)({
                idRubro: this.filtroListaPrecios.rubro.idRubro
            });
        }
    }

    getPrecioVenta() {
        this.recursoBusqueda.listaPrecioDetCollection.forEach(detalleProducto => {
            let newPrecio = detalleProducto.ultimoPrecioCompra + (detalleProducto.ultimoPrecioCompra * parseFloat(this.recurso.porc1) / 100);
            detalleProducto.precio = parseFloat(newPrecio.toFixed(3));
        });
    }
}
