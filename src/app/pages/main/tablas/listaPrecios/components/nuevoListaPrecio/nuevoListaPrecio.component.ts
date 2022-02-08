import { Component, Input, HostListener } from '@angular/core';

import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { RecursoService } from '../../../../../../services/recursoService';

import { ListaPrecio } from '../../../../../../models/listaPrecio';
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

@Component({
    selector: 'nuevo-lista-precio',
    styleUrls: ['./nuevoListaPrecio.scss'],
    templateUrl: './nuevoListaPrecio.html',
})

export class NuevoListaPrecio {
    recurso: ListaPrecio = new ListaPrecio();
    monedas: Observable<Moneda[]>;
    rubros: Observable<Rubro[]>;
    subRubros: Observable<SubRubro[]>;
    
    // Los filtros que después le mando al backend
    filtroListaPrecios: FiltroListaPrecios = new FiltroListaPrecios();

    // Columnas de la tabla
    columnasTabla;

    // Bandera que habilita los detalles una vez que se completo la data de la nueva lsita
    detallesActivos: boolean = false;

    padrones: { todos: Padron[]; filtrados: BehaviorSubject<Padron[]> } = { todos: [], filtrados: new BehaviorSubject([]) }
    padronEnfocadoIndex: number = -1;

    productos: { todos: Producto[]; filtrados: BehaviorSubject<Producto[]> } = { todos: [], filtrados: new BehaviorSubject([]) }
    productoEnfocadoIndex: number = -1;
    productoEnfocadoIndexHasta: number = -1;
    
    proveedores: { todos: Padron[]; filtrados: BehaviorSubject<Padron[]> } = { todos: [], filtrados: new BehaviorSubject([]) }
    proveedorEnfocadoIndex: number = -1;

    textProdSearched;

    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private router: Router,
        private popupListaService: PopupListaService
    ) {
        this.monedas = this.recursoService.getRecursoList(resourcesREST.sisMonedas)();
        this.rubros = this.recursoService.getRecursoList(resourcesREST.rubros)();
        this.subRubros = this.recursoService.getRecursoList(resourcesREST.subRubros)();
        
        // 'enEdicion' alverga el id del recurso actualmente en edicion
        this.columnasTabla = [
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
                nombre: 'precio',
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
                ancho: '5%',
                enEdicion: null,
                threeDecimals: true
            },
            {
                nombre: 'superior',
                key: 'cotaSup',
                customClass: 'text-right',
                ancho: '5%',
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
            }
        ];

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
    onClickEdit = (recurso: DetalleProducto) => { 
        this.columnasTabla = this.columnasTabla.map(tabla => {
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
    onClickConfirmEdit = (recurso: DetalleProducto) => { 
        // Todos los atributos 'enEdicion' distintos de undefined y también distintos de null o false, los seteo en false
        this.columnasTabla = this.columnasTabla.map(tabla => {
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
    onClickRemove = (recurso: DetalleProducto) => { 
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

    /**
     * Hace una consulta y trae todos los productos según los filtros seteados
     */
    onClickAgregar = async (e) => {
        // El porcentajeCabecera está en la nueva lista creada, tengo que agregarlo a los filtros
        this.filtroListaPrecios.porcentajeCabecera = this.recurso.porc1;
        // También la moneda
        this.filtroListaPrecios.moneda = this.recurso.idMoneda;
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
                this.recurso.listaPrecioDetCollection = _.uniqWith(
                    this.recurso.listaPrecioDetCollection.concat(cloneListaDet),
                    (a:DetalleProducto,b:DetalleProducto) => a.producto.idProductos === b.producto.idProductos
                );
            })
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
        }
    }

    /**
     * Eliminar productos de la lista
     */
    onClickEliminar = (e) => {
        // El porcentajeCabecera está en la nueva lista creada, tengo que agregarlo a los filtros
        this.filtroListaPrecios.porcentajeCabecera = this.recurso.porc1;
        try {
            // Elimino los elementos encontrados de la lista de detalles actual
            this.recursoService.getProductosByFiltro(this.filtroListaPrecios).subscribe((detallesEncontrados: DetalleProducto[]) => {

                this.recurso.listaPrecioDetCollection = _.filter(
                    this.recurso.listaPrecioDetCollection,
                    detProd => !_.some(
                        detallesEncontrados, 
                        detProdEnc => detProd.producto.idProductos === detProdEnc.producto.idProductos
                    )
                );
            })
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
        }
    }

    /**
     * Confirmar la creacion de la lista
     */
    onClickConfirmar = async(e) => {
        try {
            const resp: any = await this.recursoService.setRecurso(this.recurso)();

            this.utilsService.showModal(
                resp.control.codigo
            )(
                resp.control.descripcion
            )(
                () => {
                    this.router.navigate(['/pages/tablas/lista-precios']);
                    this.recursoService.setEdicionFinalizada(true);
                }
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
        }
        
    }


    /**
     * Habilita el resto del menu para seguir el proceso, o vuelto atrás
     */
    onClickTogglePaso = (e) => {
        this.detallesActivos = !this.detallesActivos;
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
}
