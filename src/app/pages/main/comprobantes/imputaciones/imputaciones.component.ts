import { Component } from '@angular/core';
import { RecursoService } from '../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { SisModulo } from '../../../../models/sisModulo';
import { UtilsService } from '../../../../services/utilsService';
import { ComprobanteService } from '../../../../services/comprobanteService';
import { Producto } from '../../../../models/producto';
import { SisEstado } from 'app/models/sisEstado';
import { Padron } from 'app/models/padron';
import { Deposito } from '../../../../models/deposito';
import { TipoComprobante } from '../../../../models/tipoComprobante';
import { Comprobante } from '../../../../models/comprobante';
import { DateLikePicker } from '../../../../models/dateLikePicker';
import { ComprobanteEncabezado } from '../../../../models/comprobanteEncabezado';
import { ComprobanteDetalle } from '../../../../models/comprobanteDetalle';
import { ImputacionesService } from '../../../../services/imputacionesService';
import { Observable, BehaviorSubject } from 'rxjs';
import gruposParametros from 'constantes/gruposParametros';
import { PopupListaService } from 'app/pages/reusable/otros/popup-lista/popup-lista-service';
import { Vendedor } from 'app/models/vendedor';
import { PtoVenta } from 'app/models/ptoVenta';
import { SisTipoOperacion } from 'app/models/sisTipoOperacion';
import { Numerador } from 'app/models/numerador';
import { ProductoPendiente } from 'app/models/productoPendiente';

@Component({
    selector: 'modimputaciones',
    styleUrls: ['./imputaciones.scss'],
    templateUrl: './imputaciones.html'
})
export class ModificaImputaciones {
    resourcesREST = resourcesREST;
    
    sisModulos: Observable<SisModulo[]>;
    tipoComprobantes: Observable<TipoComprobante[]>;
    sisEstados: Observable<SisEstado[]>;
    depositos: Observable<Deposito[]>;
    vendedores: Observable<Vendedor[]>;
    sisTipoOperaciones: Observable<SisTipoOperacion[]>;
    
    productos: { todos: Producto[]; filtrados: BehaviorSubject<Producto[]> } = { todos: [], filtrados: new BehaviorSubject([]) }
    padrones: { todos: Padron[]; filtrados: BehaviorSubject<Padron[]> } = { todos: [], filtrados: new BehaviorSubject([]) }
    
    padronEnfocadoIndex: number = -1;
    productoEnfocadoIndex: number = -1;

    // Lo uso cuando busca específicamente por nro y pto venta
    comprobante: Comprobante = new Comprobante();
    
    fechasFiltro: {
        desde: DateLikePicker,
        hasta: DateLikePicker
    } = {
        desde: new DateLikePicker(),
        hasta: new DateLikePicker()
    }
    sisModuloSelec: SisModulo = new SisModulo();
    tipoComprobanteSelecImputador: TipoComprobante = new TipoComprobante();
    tipoComprobanteSelecImputado: TipoComprobante = new TipoComprobante();
    ptoVentaSelecImputado: string = null;
    nroSelecImputado: string = null;
    ptoVentaSelecImputador: string = null;
    nroSelecImputador: string = null;
    productoHasta: Producto = new Producto();
    focusProductoHasta = false;
    productoSelec: Producto = new Producto();
    sisEstadoSelec: SisEstado = new SisEstado();
    padronSelec: Padron = new Padron();
    depositoSelec: Deposito = new Deposito();
    vendedorSelec: Vendedor = new Vendedor();
    sisTipoOpSelect: SisTipoOperacion = new SisTipoOperacion();

    compEncabezados: BehaviorSubject<ComprobanteEncabezado[]> = new BehaviorSubject([]);
    compDetalles: BehaviorSubject<ComprobanteDetalle[]> = new BehaviorSubject([]);
    enableEdit = false;
    enableEditIndex = null;
    imputadores: BehaviorSubject<ProductoPendiente[]> = new BehaviorSubject([]);
    imputados: BehaviorSubject<ProductoPendiente[]> = new BehaviorSubject([]);
    imputador: ProductoPendiente = new ProductoPendiente();
    imputado: ProductoPendiente = new ProductoPendiente();
    cantidadImputada: number;
    estadoAfip: string = 'Todas'; 

    isLoading = false;
    isLoadingImputadores = false;
    isLoadingImputados = false;

    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private comprobanteService: ComprobanteService,
        private popupListaService: PopupListaService,
        private imputacionesService: ImputacionesService
    ) {
        // Es necesario
        this.comprobante.numerador = new Numerador();
        this.comprobante.numerador.ptoVenta = new PtoVenta();

        this.sisModulos = this.recursoService.getRecursoList(resourcesREST.sisModulos)();
        this.sisEstados = this.recursoService.getRecursoList(resourcesREST.sisEstados)();
        this.recursoService.getRecursoList(resourcesREST.productos)()
            .subscribe(productos => {
                this.productos.todos = productos;
                this.productos.filtrados.next([]);
            })

        this.recursoService.getRecursoList(resourcesREST.padron)({ grupo: gruposParametros.cliente })
            .subscribe(padrones => {
                this.padrones.todos = padrones;
                // this.padrones.filtrados.next(padrones);
                this.padrones.filtrados.next([]);
            })
        
        this.depositos = this.recursoService.getRecursoList(resourcesREST.depositos)();
        this.vendedores = this.recursoService.getRecursoList(resourcesREST.vendedor)();
        this.sisTipoOperaciones = this.recursoService.getRecursoList(resourcesREST.sisTipoOperacion)();
    }

    /**
     * Cuando se cambia un módulo se actualiza la lista de tiposComprobantes
     */
    onChangeSisModulo = (moduloSelec: SisModulo) => {

        this.tipoComprobantes = this.recursoService.getRecursoList(resourcesREST.cteTipo)({
            'sisModulo': moduloSelec.idSisModulos
        });

        // this.sisTipoOperaciones
    }

    /**
     * On click buscar
     */
    onClickBuscar = () => {
        this.isLoading = true;
        this.isLoadingImputadores = true;
        this.isLoadingImputados = true;
        this.imputado = new ProductoPendiente();
        this.imputador = new ProductoPendiente();
        // Busco los encabezados
        // Me suscribo a los cambios de los encabezados y en cada actualizacion de estos, actualizo también todos los detalles
        // Aprovecho a fijarme si la cantidad es 0. En ese caso, muestro mensaje
        //console.log(this.comprobante, this.fechasFiltro, this.sisModuloSelec, this.tipoComprobanteSelec, this.productoSelec, this.sisEstadoSelec, this.padronSelec, this.depositoSelec, this.vendedorSelec, this.sisTipoOpSelect, this.estadoAfip);
        let compEncImputador = new ComprobanteEncabezado({idFactCab: 0, numero: this.ptoVentaSelecImputado && this.nroSelecImputado ? Number(this.ptoVentaSelecImputado + this.nroSelecImputado) : 0, idPadron: this.padronSelec.padronCodigo ? this.padronSelec.padronCodigo : 0,nombre: null ,cuit: null,cotDolar: 0, modulo: this.sisModuloSelec.descripcion, comprobante: "RE", moneda: null, imputada: null, fechaEmi: null, fechaVence: null, fechaConta: null, detalle: [], idCteTipo: this.tipoComprobanteSelecImputador.idCteTipo, importeNeto: 0, importeTotal: 0, autorizada: null, tipoOperacion: this.sisTipoOpSelect.descripcion, permiteBorrado: false, pesificado: false, dolarizadoAlVto: false, interesMensualCompra: 0.00, canjeInsumos: false, tipoCambio: 'divisa', master: null});
        let compEncImputado = new ComprobanteEncabezado({idFactCab: 0, numero: this.ptoVentaSelecImputador + this.nroSelecImputador ? Number(this.ptoVentaSelecImputador + this.nroSelecImputador) : 0, idPadron: this.padronSelec.padronCodigo ? this.padronSelec.padronCodigo : 0,nombre: null ,cuit: null,cotDolar: 0, modulo: this.sisModuloSelec.descripcion, comprobante: "FV", moneda: null, imputada: null, fechaEmi: null, fechaVence: null, fechaConta: null,detalle: [], idCteTipo: this.tipoComprobanteSelecImputado.idCteTipo, importeNeto: 0, importeTotal: 0, autorizada: null, tipoOperacion: this.sisTipoOpSelect.descripcion, permiteBorrado: false, pesificado: false, dolarizadoAlVto: false, interesMensualCompra: 0.00, canjeInsumos: false, tipoCambio: 'divisa', master: null});
        /*this.comprobanteService.buscarComprobantes(this.comprobante)(this.fechasFiltro)(this.sisModuloSelec)(this.tipoComprobanteSelecImputador)(this.productoSelec)(this.sisEstadoSelec)(this.padronSelec)(this.depositoSelec)(this.vendedorSelec)(this.sisTipoOpSelect)(this.estadoAfip)
            
            .subscribe(encabezados => {
                // Actualizo encabezados
                this.compEncabezados.next(encabezados);

                encabezados && encabezados.length === 0 ?
                    this.utilsService.showModal('Aviso')('No se encontraron comprobantes con esas condiciones')()() : null;

                // Actualizo detalles
                this.compDetalles.next(
                    this.utilsService.flatMap(
                        (encabezado: ComprobanteEncabezado) => encabezado.detalle,
                        encabezados
                    )
                );
                


            })*/

        this.imputacionesService.getProductosPendientesProd(compEncImputador, this.productoSelec.codProducto).subscribe(datos => {
            this.imputadores.next(datos);
            datos && datos.length === 0 ?
                    this.utilsService.showModal('Aviso')('No se encontraron comprobantes imputadores con esas condiciones')()() : null;

            this.isLoadingImputadores = false;
        });
        this.imputacionesService.getProductosPendientesProd(compEncImputado, this.productoSelec.codProducto).subscribe(datos => {
            this.imputados.next(datos);
            datos && datos.length === 0 ?
                    this.utilsService.showModal('Aviso')('No se encontraron comprobantes para imputar con esas condiciones')()() : null;
            this.isLoadingImputados = false;
        });

    }


    /**
     * Formatea el numero pto-venta 4 caracteres y numero 8 caracteres
     */
    formatNumero = (numero) => 
        numero && numero.toString() && 
        numero.toString().substring(0, numero.toString().length - 8) ?
            `${numero.toString().substring(0, numero.toString().length - 8).padStart(4,0)} - ${numero.toString().substring(numero.toString().length - 8)}` :
            ''
    

    /**
     * Setea la fecha de compra calculandola dado un string en formato 'ddmm', parseando a 'dd/mm/aaaa'
     */
    onCalculateFecha = (e) => (keyFecha) => {
        if (!this.fechasFiltro[keyFecha] || typeof this.fechasFiltro[keyFecha] !== 'string') return;
        
        this.fechasFiltro[keyFecha] = this.utilsService.stringToDateLikePicker(this.fechasFiltro[keyFecha]);

        // Hago focus en el prox input y luego al boton buscar
        (keyFecha==='desde') ? document.getElementById("fechaHasta").focus() : 
            (keyFecha==='hasta') ? document.getElementById("btnBuscar").focus() : null;
        

    }

    onClickPopupProductoHasta = (prod: Producto) => 
    this.productoHasta = new Producto({...prod})

    onFocusHasta() {
        this.focusProductoHasta = true;
    }

    onBlurHasta() {
        this.focusProductoHasta = false;
    }


    onBlurPtoVentaImputado = (e) => this.ptoVentaSelecImputado ?
        this.ptoVentaSelecImputado = this.ptoVentaSelecImputado.padStart(4, '0') : null

    onBlurPtoVentaImputador = (e) => this.ptoVentaSelecImputador ?
        this.ptoVentaSelecImputador = this.ptoVentaSelecImputador.padStart(4, '0') : null

    onBlurNumeradorImputado = (e) => this.nroSelecImputado ?
        this.nroSelecImputado = this.nroSelecImputado.padStart(8, '0') : null

    onBlurNumeradorImputador = (e) => this.nroSelecImputador ?
        this.nroSelecImputador = this.nroSelecImputador.padStart(8, '0') : null

    /**
     * On click buscar
     */
    /*onClickReporte = (tipo) => {
        this.comprobanteService.generarReportes(tipo)(this.comprobante)(this.fechasFiltro)(this.sisModuloSelec)(this.tipoComprobanteSelec)(this.productoSelec)(this.sisEstadoSelec)(this.padronSelec)(this.depositoSelec)(this.vendedorSelec)(this.sisTipoOpSelect)(this.estadoAfip)
            .subscribe(resp => {
                if (resp) {
                    this.utilsService.downloadBlob(resp['_body'], tipo);
                }
            })

    }*/

    // Buscador cli/prov
    onChangeCliProv = (busqueda) => {
        if (busqueda && busqueda.length === 0) {
            this.padrones.filtrados.next([]);    
        } else {
            this.padrones.filtrados.next(
                this.comprobanteService.filtrarPadrones(this.padrones.todos, busqueda)
            );
        }

        this.padronEnfocadoIndex = -1;
    }

    onClickPopupPadron = (prove: Padron) => this.padronSelec = new Padron({...prove})

    // Buscador producto
    onChangeProducto = (busqueda) => {
        if (busqueda && busqueda.length === 0) {
            this.productos.filtrados.next([]);    
        } else {
            this.productos.filtrados.next(
                this.comprobanteService.filtrarProductos(this.productos.todos, busqueda)
            );
        }

        this.productoEnfocadoIndex = -1;
    }

    onClickPopupProducto = (prod: Producto) => 
        this.productoSelec = new Producto({...prod})

    autorizarComprobante = (compBusc: ComprobanteEncabezado) => {
        // Activo spinner
        compBusc.isBeingAuthorized = true;

        this.comprobanteService.autorizarAfip(compBusc.idFactCab)
            .subscribe(respAfip => {
                compBusc.isBeingAuthorized = false;

                this.utilsService.showImprimirModal(
                    'OK'
                )(
                    `${respAfip.control.descripcion}. 
                    CAI: ${respAfip.datos.cai}`
                )(
                    () => this.recursoService.downloadComp(compBusc)
                )(
                    compBusc
                );

                this.onClickBuscar();

            })
    }

    /**
     * Onclick borrar comprobante
     */
    borrarComprobante = (comp: ComprobanteEncabezado) => {

        this.utilsService.showModal(
            'Borrar comprobante'
        )(
            '¿Estás seguro de borrarlo?'
        )(
            () => {
                this.comprobanteService.borrarComprobante(comp).subscribe((resp: any) => {

                    const theBody = this.utilsService.parseBody(resp);
        
                    this.utilsService.showModal(
                        theBody.control.codigo
                    )(
                        theBody.control.descripcion
                    )(
                        () => {
                            // Actualizo grilla
                            this.onClickBuscar();
                        }
                    )();
                })
            }
        )({
            tipoModal: 'confirmation'
        });
    }

    enableEditMethod(e, i, idFactDetalle) {
        setTimeout(()=>{ // Ponemos el focus al final de la cola de trabajos
                         // Esto nos asegura que el elemento a focusear ya existe
            document.getElementById("focus").focus();
        },0);
        const indexModificar = this.imputadores.value.findIndex(element => element.idFactDetalle === idFactDetalle)
        this.pendienteEditor = this.imputadores.value[indexModificar].pendiente.toString();
        this.enableEdit = true;
        this.enableEditIndex = i;
        console.log(i, e);
    }

    cancel() {
        console.log('cancel');
        this.enableEditIndex = null;
    }
    pendienteEditor: any;
    saveSegment(i, idFactDetalle) {
        const indexModificar = this.imputadores.value.findIndex(element => element.idFactDetalle === idFactDetalle)
        this.imputadores.value[indexModificar].pendiente = Number(this.pendienteEditor);
        this.pendienteEditor = null;
        this.cantidadImputada = this.imputadores.value[i].pendiente;
        this.enableEditIndex = null;
    }
    setImputador(i, idFactDetalle) {
        const indexModificar = this.imputadores.value.findIndex(element => element.idFactDetalle === idFactDetalle)
        if(this.imputado) {
            if(this.imputadores.value[indexModificar].idFactDetalle != this.imputado.idFactDetalle
                && this.imputadores.value[indexModificar].comprobante != this.imputado.comprobante)
                this.imputador = this.imputadores.value[indexModificar];
                this.cantidadImputada = this.imputadores.value[indexModificar].pendiente;
        } else {
            this.imputador = this.imputadores.value[indexModificar];
            this.cantidadImputada = this.imputadores.value[indexModificar].pendiente;
        }
    }

    setImputado(i, idFactDetalle) {
        const indexModificar = this.imputados.value.findIndex(element => element.idFactDetalle === idFactDetalle)
        if(this.imputador) {
            if(this.imputados.value[indexModificar].idFactDetalle != this.imputador.idFactDetalle
                && this.imputados.value[indexModificar].comprobante != this.imputador.comprobante)
                this.imputado = this.imputados.value[indexModificar];
        } else {
            this.imputado = this.imputados.value[indexModificar];
        }
    }

    onClickCancelar() {
        this.fullClear();
    }

    fullClear() {
        this.imputador = new ProductoPendiente();
        this.imputado = new ProductoPendiente();
    }

    isDisabledConfirm() {
        const isSameType = (!(this.imputado && this.imputador && this.cantidadImputada) || this.imputado.comprobante == this.imputador.comprobante);
        const isDifferentProduct = (!(this.imputado && this.imputador && this.cantidadImputada) || this.imputado.producto.codProducto != this.imputador.producto.codProducto);
        const cantidadSupera = (!(this.imputado && this.imputador && this.cantidadImputada) || Math.abs(this.cantidadImputada) > this.imputado.pendiente);
        //console.log(this.cantidadImputada, this.imputado.pendiente, Math.abs(this.cantidadImputada) > this.imputado.pendiente);
        //console.log(isSameType, isDifferentProduct, cantidadSupera);

        return isSameType || isDifferentProduct || cantidadSupera;
    }

    onClickConfirmar() {
        if(this.imputado && this.imputador && this.cantidadImputada) {
            this.imputacionesService.setImputaciones(this.imputador.idFactDetalle, this.imputado.idFactDetalle, this.cantidadImputada).subscribe(data => {
                if(data.control.codigo == 'OK') {
                    this.utilsService.showModal('Éxito')('La imputación se grabó correctamente')()();
                } else {
                    this.utilsService.showModal('Aviso')('No se pudo grabar la imputación')()();
                }
            });
            this.fullClear();
        }
    }
}