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

import { Observable, BehaviorSubject } from 'rxjs';
import gruposParametros from 'constantes/gruposParametros';
import { PopupListaService } from 'app/pages/reusable/otros/popup-lista/popup-lista-service';
import { Vendedor } from 'app/models/vendedor';
import { PtoVenta } from 'app/models/ptoVenta';
import { AuthService } from 'app/services/authService';
import { ImputacionesService } from 'app/services/imputacionesService';
import { SisTipoOperacion } from 'app/models/sisTipoOperacion';
import { Numerador } from 'app/models/numerador';
import _ = require('lodash');

@Component({
    selector: 'consulta-imputaciones',
    styleUrls: ['./consultaImputaciones.scss'],
    templateUrl: './consultaImputaciones.html'
})
export class ConsultaImputaciones {
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
    idTipoFechaSeleccionada: number = 1;
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
    tipoComprobanteSelec: TipoComprobante = new TipoComprobante();
    productoSelec: Producto = new Producto();
    sisEstadoSelec: SisEstado = new SisEstado();
    padronSelec: Padron = new Padron();
    depositoSelec: Deposito = new Deposito();
    vendedorSelec: Vendedor = new Vendedor();
    sisTipoOpSelect: SisTipoOperacion = new SisTipoOperacion();

    compEncabezados: BehaviorSubject<ComprobanteEncabezado[]> = new BehaviorSubject([]);
    compDetalles: BehaviorSubject<ComprobanteDetalle[]> = new BehaviorSubject([]);
    
    // Los comprobantes imputados (del comprobante seleccionado en ese momento)
    imputaciones: BehaviorSubject<any[]> = new BehaviorSubject([]);

    // El comprobante seleccionado
    compSeleccionado: ComprobanteEncabezado;
    impuSeleccionado: ComprobanteEncabezado;

    isLoading = false;

    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private comprobanteService: ComprobanteService,
        private popupListaService: PopupListaService,
        private imputacionesService: ImputacionesService,
    ) {
        this.comprobante.numerador = new Numerador();
        this.comprobante.numerador.ptoVenta = new PtoVenta();// Es necesario

        this.sisModulos = this.recursoService.getRecursoList(resourcesREST.sisModulos)();
        this.sisEstados = this.recursoService.getRecursoList(resourcesREST.sisEstados)();
        // this.productos = this.recursoService.getRecursoList(resourcesREST.productos)();
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
    onChangeSisModulo = (moduloSelec: SisModulo) => 
        this.tipoComprobantes = this.recursoService.getRecursoList(resourcesREST.cteTipo)({
            'sisModulo': moduloSelec.idSisModulos
        })


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

    /**
     * Evento blur de pto venta y numero en comprobante
     * tipo: puntoVenta o numero
     * keyTipoe: comprobante, comprobanteRelacionado
     */
    onBlurNumeroAutocomp = (e) => (tipo: string) => (keyTipo: string) => 
        this[keyTipo][tipo] = this.utilsService.autocompNroComp(tipo)(this[keyTipo])


    // Buscador cli/prov
    onChangeCliProv = (busqueda) => {
        this.padronSelec = new Padron();
        if (busqueda && busqueda.length >= 2) {
            this.findPadrones(busqueda);
        }
        // Reseteo el indice
        this.padronEnfocadoIndex = -1;
    }


    buscandoPadron = false;
    findPadrones = _.throttle((busqueda) => {
        debugger
        this.buscandoPadron = true;
        this.padrones.filtrados.next([]);

        this.recursoService
            .getRecursoList(resourcesREST.padron)({
                grupo: gruposParametros.proveedor,
                elementos: busqueda,
            })
            .subscribe((proveedores) => {
                this.padrones.filtrados.next(proveedores);
                this.buscandoPadron = false;
            });
    }, 400);






    onClickPopupPadron = (prove: Padron) => this.padronSelec = new Padron({...prove})

    keyPressInputTexto = (e: any) => (upOrDown) => {
        e.preventDefault();
        // Hace todo el laburo de la lista popup y retorna el nuevo indice seleccionado
        this.padronEnfocadoIndex =
            this.popupListaService.keyPressInputForPopup(upOrDown)(
                this.padrones.filtrados.value
            )(this.padronEnfocadoIndex);
    };

    onEnterInputProv = (e: any) => {
        e.preventDefault();
        this.padrones.filtrados.subscribe((provsLista) => {
            // Busco el producto
            const provSelect =
                provsLista && provsLista.length
                    ? provsLista[this.padronEnfocadoIndex]
                    : null;
                // Lo selecciono
             provSelect ? this.popupLista.onClickListProv(provSelect) : null;
            // Reseteo el index
             this.padronEnfocadoIndex = -1;
        });
    };

    popupLista: any = {
        
        onClickListProv: (prove: Padron) => {
            this.padronSelec = new Padron({ ...prove });

        },
        getOffsetOfInputProveedor: () =>
            this.utilsService.getOffset( document.getElementById("padronSelec")
            ),
    };




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


    /**
     * On click buscar
     */
    onClickBuscar = () => {

        this.isLoading = true;

        // Limpio tablas
        this.compEncabezados.next([]);
        this.compDetalles.next([]);
        this.imputaciones.next([]);

        // Si fechaDesde es 

        this.comprobanteService.buscarComprobantes(this.comprobante)(this.fechasFiltro)(this.idTipoFechaSeleccionada)(this.sisModuloSelec)(this.tipoComprobanteSelec)(this.productoSelec)(this.sisEstadoSelec)(this.padronSelec)(this.depositoSelec)(this.vendedorSelec)(this.sisTipoOpSelect)(null)(null)(null)
            .subscribe(encabezados => {

                // Actualizo encabezados
                this.compEncabezados.next(encabezados);

                encabezados && encabezados.length === 0 ?
                    this.utilsService.showModal('Aviso')('No se encontraron comprobantes con esas condiciones')()() : null;

                this.isLoading = false;

            })
    }


    /**
     * Cuando se clickea un comprobante, se actualizan los detalles de abajo
     */
    actualizarImputaciones = (compBusc: ComprobanteEncabezado) => {
        
        this.imputacionesService.getImputacionesByComp(compBusc)
            .subscribe(
                resp => this.imputaciones.next(resp)
            )
    }

    /**
     * Actualiza:
     * - Detalles
     * - Imputaciones
     */
    onClickComprobante = (compBusc: ComprobanteEncabezado) => {

        this.compSeleccionado = compBusc;
        this.impuSeleccionado = null;

        this.imputacionesService.getProductosPendientes(compBusc)
            .subscribe(
                detalles => this.compDetalles.next(detalles)
            )

        this.actualizarImputaciones(compBusc);
    }

    /**
     * Actualizar detalles de abajo
     */
    onClickImputacion = (impu: any) => {

        this.impuSeleccionado = impu;

        this.imputacionesService.getProductosPendientes(impu)
            .subscribe(
                detalles => this.compDetalles.next(detalles)
            )
    }
}