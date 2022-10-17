import * as _ from 'lodash';
import * as moment from 'moment';
import { Component, ViewChild, ElementRef, NgZone, ChangeDetectorRef, HostListener } from '@angular/core';

import { UtilsService } from 'app/services/utilsService';
import { Observable } from 'rxjs/Observable';
import { Padron } from '../../../../models/padron';
import { RecursoService } from 'app/services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';

import { SisTipoOperacion } from 'app/models/sisTipoOperacion';
import { TipoComprobante } from 'app/models/tipoComprobante';
import { Moneda } from '../../../../models/moneda';
import { ProductoPendiente } from 'app/models/productoPendiente';
import { BehaviorSubject, Subject } from 'rxjs';
import { Cotizacion } from '../../../../models/cotizacion';

import { Comprobante } from 'app/models/comprobante';

import { Deposito } from 'app/models/deposito';
import { PopupListaService } from 'app/pages/reusable/otros/popup-lista/popup-lista-service';
import { EmisionRemitosService } from './emisionRemitosService';
import { FormaPago } from '../../../../models/formaPago';
import { CondIva } from '../../../../models/condIva';
import { CteFechas } from '../../../../models/cteFechas';
import { DateLikePicker } from '../../../../models/dateLikePicker';
import { SisCanje } from '../../../../models/sisCanje';
import { ComprobanteRelacionado } from '../../../../models/comprobanteRelacionado';
import { Lote } from '../../../../models/lote';
import { DetalleFormaPago } from 'app/models/detalleFormaPago';
import { GlobalState } from 'app/global.state';
import { Numerador } from 'app/models/numerador';
import { Factura } from '../../../../models/factura';
import { ModeloFactura } from 'app/models/modeloFactura';
import gruposParametros from 'constantes/gruposParametros';
import { ProductoReducido } from '../../../../models/productoReducido';
import { Cliente } from '../../../../models/cliente';
import { SisSitIVA } from '../../../../models/sisSitIVA';
import { Router } from '../../../../../../node_modules/@angular/router';
import { Vendedor } from '../../../../models/vendedor';
import sisModulos from 'constantes/sisModulos';
import { ComprobanteEncabezado } from 'app/models/comprobanteEncabezado';
import { TypeScriptEmitter } from '@angular/compiler';
import { ListaPrecio } from 'app/models/listaPrecio';
import { PtoVenta } from 'app/models/ptoVenta';
import { FormControl } from '@angular/forms';
import { LetraCodigo } from 'app/models/letraCodigo';
import { Contrato } from 'app/models/contrato';
import { Contratos } from '../../contratos';
import { RelacionCanje } from 'app/models/relacionCanje';
import { ContratosService } from 'app/services/contratosService';
import { AuthService } from 'app/services/authService';
import { ComprobanteService } from 'app/services/comprobanteService';
import { ModeloDetalle } from 'app/models/modeloDetalle';



@Component({
    selector: 'emision-remitos',
    templateUrl: './emisionRemitos.html',
    styleUrls: ['./emisionRemitos.scss']
})

export class EmisionRemitos  {
    /////////////////////////////////////////////
    /////////// Objetos Seleccionados ///////////
    /////////////////////////////////////////////
    cliente: Padron = new Padron();
    comprobante: Comprobante = new Comprobante();
    comprobanteRelacionado: ComprobanteRelacionado = new ComprobanteRelacionado()
    comprobantePesificado = {
        puntoVenta: null,
        numero: null
    };
    comprobantePesificadoInterno = null;
    notaDeCredito;
    notaDeDebito;
    deposito: Deposito;
    tipoOperacion: SisTipoOperacion;
    sisCanje: SisCanje = new SisCanje();
    formasPagoSeleccionadas: FormaPago[] = [];
    numeroCteSelec: PtoVenta = new PtoVenta();
    factura: Comprobante = new Comprobante();
    dataVendedor: {
        vendedor: Vendedor,
        incluir: boolean
    } = {
        vendedor: new Vendedor(),
        incluir: false
    };
    listaPrecioSelect: ListaPrecio = new ListaPrecio();
    preservarPrevios: Boolean = false;
    contrato: Contrato = new Contrato();
    relacionCanje: RelacionCanje = new RelacionCanje();
    claveAutorizacion;

    /////////////////////////////////////////////
    //////////// Listas desplegables ////////////
    /////////////////////////////////////////////
    sisSitIvas: Observable<CondIva[]>;
    //tiposComprobantes: Observable<TipoComprobante[]>;
    tiposComprobantes: TipoComprobante[];
    tiposOperacion: Observable<SisTipoOperacion[]>;
    //monedas: Subject<Moneda[]> = new Subject();
    monedas: Moneda[] = [];
    depositos: Observable<Deposito[]>;
    productos: BehaviorSubject<ProductoReducido[]> = new BehaviorSubject([]);
    sisCanjes: Observable<SisCanje[]>;
    clientes: { todos: Padron[]; filtrados: BehaviorSubject<Padron[]> } = { todos: [], filtrados: new BehaviorSubject([]) }
    numerosCte: PtoVenta[] = [];
    tiposComprobantesRel: Observable<TipoComprobante[]>;
    tiposComprobantesFactura: Observable<TipoComprobante[]>;
    listasPreciosUsuario: Observable<ListaPrecio[]>;
    tituloCardComprobante : String = "COMPROBANTE";
    estadoRelacionadoObligatorio:  Boolean = false;
    contratos: Observable<Contrato[]>;
    relacionesCanje: Observable<RelacionCanje[]>;
    cbtesAfip = [
        {
            codigoAfip: 1,
            descripcion: "Fact. A"
        },
        {
            codigoAfip: 2,
            descripcion: "Nota Débito A"
        },
        {
            codigoAfip: 6,
            descripcion: "Fact. B"
        },
        {
            codigoAfip: 7,
            descripcion: "Nota Débito B"
        }
    ]
    relacionadoConfirmado = false;
    codigoAfipRelacionado: number;
    ptoVentaAfipRelacionado: number;
    numeroComprobanteAfipRelacionado: number;
    numeroAfipRelacionado: number;
    factCabAfipRelacionado: number;
    disableRest: boolean = false;
    esCanje: boolean = false;
    esPesificado: boolean = false;
    pesificado: boolean = false;
    marcaPesificado = false;
    pesificadoPersisteSn = false;
    percep2459: boolean = false;
    nroCopias: number = 3;
    /////////////////////////////////////////////
    ////////////////// Otros ////////////////////
    /////////////////////////////////////////////
    // Inhdice del producto enfocado del popup
    clienteEnfocadoIndex: number = -1;
    cotizacionDatos: {
        cotizacion: Cotizacion,
        total: number
    } = { cotizacion: new Cotizacion(), total: 0};
    
    disabledClienteCustom: boolean = false;
    // Suma de todos los subtotales
    sumatoriaSubtotales: number = 0;
    isAutorizada = false;
    cereales = [];
    estadosSisa = [];
    estadoSisa = null;
    diferidoVto = false;
    cereal = null;
    condicionesConfirmadas = false;
    /////////////////////////////////////////////
    ////////////////// Tablas ///////////////////
    /////////////////////////////////////////////
    dataTablaFormasPago: FormaPago[];

    tablas: {
        columnas: {
            columnasProductos: any[];
            columnasTrazabilidad: any[];
            columnasCanje: any[];
            columnasDetallesFp: any[];
            columnasFactura: any[];
            columnasRecargo: any[];
        },
        datos: {
            productosPend: ProductoPendiente[];
            subtotalesProductos: {
                idProducto: number,
                subtotal: number,
                subtotalIva: number,
                numeroComp: string,
                precioDesc: any,
                idFactDetalle: string
            }[];
            productosCanje: ProductoPendiente[];
            lotesTraza: Lote[];
            detallesFormaPago: DetalleFormaPago[];
            modelosFactura: ModeloFactura[];
            recargoCanjes;
        }
    } = { 
        columnas: { 
            columnasProductos: [],
            columnasTrazabilidad: [],
            columnasCanje: [],
            columnasDetallesFp: [],
            columnasFactura: [],
            columnasRecargo: []
        }, 
        datos: { 
            productosPend: [],
            subtotalesProductos: [],
            productosCanje: [],
            lotesTraza: [],
            detallesFormaPago: [],
            modelosFactura: [],
            recargoCanjes: []
        }
    };

    
    // Porcentaje de grabado
    grabandoPorcentaje = 0;
    
    @HostListener('window:beforeunload')
    canDeactivate() {
        return this.emisionRemitosService.checkPendingChanges(this.comprobante)(this.factura)(this.cliente)(this.comprobanteRelacionado);
    }

    /**
     * Toda la carga de data se hace en el mismo orden en el que está declarado arriba
     */
    constructor(
        private recursoService: RecursoService,
        private emisionRemitosService: EmisionRemitosService,
        public utilsService: UtilsService,
        private popupListaService: PopupListaService,
        private comprobanteService: ComprobanteService,
        private _state: GlobalState,
        private router: Router,
        private contratosService: ContratosService
    ) {

        ////////// Listas desplegables //////////
        this.sisSitIvas = this.recursoService.getRecursoList(resourcesREST.sisSitIva)();
        this.tiposOperacion = this.recursoService.getRecursoList(resourcesREST.sisTipoOperacion)({
            sisModulo: sisModulos.venta
        });
        this.tiposOperacion = this.tiposOperacion.map(tiposOp => tiposOp.filter(tipoOp => tipoOp.idSisTipoOperacion == 4 || tipoOp.idSisTipoOperacion == 10));
        // this.depositos = this.recursoService.getRecursoList(resourcesREST.depositos)({
        //     todos: 
        // });

        this.sisCanjes = this.recursoService.getRecursoList(resourcesREST.sisCanjes)();

        // this.listasPreciosUsuario = this.recursoService.getRecursoList(resourcesREST.listaPrecios)();

        ////////// Tablas //////////
        this.tablas.columnas.columnasProductos = emisionRemitosService.getColumnsProductos();
        this.tablas.columnas.columnasTrazabilidad = emisionRemitosService.getColumnsTrazabilidad();
        this.tablas.columnas.columnasCanje = emisionRemitosService.getColumnsCanje();
        this.tablas.columnas.columnasDetallesFp = emisionRemitosService.getColumnsDetallesFp();
        this.tablas.columnas.columnasFactura = emisionRemitosService.getColumnsFactura();
        this.tablas.columnas.columnasRecargo = emisionRemitosService.getColumnsRecargo();

        ////////// Otros //////////
        this.emisionRemitosService.getCotizacionDatos().subscribe(cotizDatos => this.cotizacionDatos.cotizacion = cotizDatos);

        this.tiposComprobantesFactura = this.recursoService.getRecursoList(resourcesREST.cteTipo)({
            'sisComprobante': 3
        });
    }

    

    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// Eventos Click /////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    onClickRemove = (prodSelect: ProductoPendiente) => {
        _.remove(
            this.tablas.datos.productosPend,
            (prod: ProductoPendiente) => 
                prod.idFactDetalle === prodSelect.idFactDetalle
        );

        // Actualizo nuevamente la lista de trazables
        this.actualizarTrazableLotes(prodSelect);

        // Actualizo datos de producto (total neto)
        this.actualizarDatosProductos();

        // Actualizo la grilla de Factura
        this.fetchFacturas();

    }

    onClickEdit = (tipoColumnas) => (itemSelect: any) => { 
        
        this.tablas.columnas[tipoColumnas] = this.tablas.columnas[tipoColumnas].map(tabla => {
            let newTabla = tabla;
            if (newTabla.enEdicion !== undefined) {
                tipoColumnas === 'columnasProductos' ? newTabla.enEdicion = itemSelect.idFactDetalle :
                tipoColumnas === 'columnasTrazabilidad' ? newTabla.enEdicion = itemSelect.nroLote :
                tipoColumnas === 'columnasFactura' ? newTabla.enEdicion = itemSelect.cuentaContable :
                tipoColumnas === 'columnasDetallesFp' ? newTabla.enEdicion = itemSelect.idFormaPagoDet : null
            }
            return newTabla;
        });

        // Hago focus en el select de imputacion
        setTimeout(() => {
            const idItem =  itemSelect.nroLote ? itemSelect.nroLote : 
                            itemSelect.idFormaPagoDet ? itemSelect.idFormaPagoDet : 
                            itemSelect.producto && itemSelect.idFactDetalle ? itemSelect.idFactDetalle : '000';

            const inputFocusClass = 'editar-focus-'+idItem;
            const elementFocus: any = document.getElementsByClassName(inputFocusClass);
            elementFocus && elementFocus[0] ? elementFocus[0].focus() : null
        });
        

        // Cuando edita alguna forma de pago, se sugiere el Total Cte en monto
        if (tipoColumnas && tipoColumnas === 'columnasDetallesFp') {
            itemSelect.monto = this.utilsService.parseDecimalNumber(this.cotizacionDatos.total + this.sumatoriaSubtotales);
        }
        

    }

    changeClave = () => {
        console.log(this.comprobante.numerador.ptoVenta.ptoVenta,
            Number(this.comprobante.numerador.numerador),
            this.cliente.padronCodigo);
        const clave = this.utilsService.generarClaveNC(
            this.comprobante.numerador.ptoVenta.ptoVenta,
            Number(this.comprobante.numerador.numerador),
            this.cliente.padronCodigo);
        this.isAutorizada = clave == this.claveAutorizacion;
    }
    //dario
    onClickConfirmEdit = (tipoColumnas) => (itemSelect: any) => { 
        if (true/*this.estadoRelacionadoObligatorio == true*/){
            if(itemSelect.pendienteOg) {
                if (Number(itemSelect.pendiente) > Number(itemSelect.pendienteOg)) {
                    alert("Atención !!! No se puede modificar la cantidad del comprobante: El valor ingresado no puede ser mayor al valor Original")
                    itemSelect.pendiente = itemSelect.pendienteOg;
                } 
            }
        }

        // Me fijo si es valida la data ignresada
        const estado = this.emisionRemitosService.validarAntesDeConfirmar(tipoColumnas)(itemSelect, this.comprobante.moneda.idMoneda, this.cotizacionDatos.cotizacion.cotizacion, this.esPesificado, this.esCanje);
        
        // Hago la sumatoria de los subtotales de la factura
        if (tipoColumnas === 'columnasFactura') {
            // Actualizo el Total Comprobante sumando todos los precios nuevamente (no le sumo directamente el precio editado porque no es un precio nuevo, sino que ya está y debería sumarle la diferencia editada nomás)
            this.actualizarSumatoriaSubto();

        }

        if (estado === 'ok') {
            // Actualizo datos dle producto (si NO son las facturas lo que se edita, o las forma de pago)
            if (
                tipoColumnas !== 'columnasFactura' && 
                tipoColumnas !== 'columnasDetallesFp'
            ) this.actualizarDatosProductos(itemSelect);
                
            // Todos los atributos 'enEdicion' distintos de undefined y también distintos de null o false, los seteo en false
            this.tablas.columnas[tipoColumnas] = this.tablas.columnas[tipoColumnas].map(tabla => {
                let newTabla = tabla;
                if (newTabla.enEdicion !== undefined && newTabla.enEdicion) {
                    // Seteo en false asi sale de edicion
                    newTabla.enEdicion = false;
                }
                return newTabla;
            })
    
        } else {
            // Si NO es valida, entonces muestro mensajito
            this.utilsService.showModal('Error')(estado)()();
        }
        
    }

    buscarCerealesCanje = () => {
        this.emisionRemitosService.getCerealesCanje().subscribe(data => {
            this.cereales = data.cereales;
        })
    }

    buscaEstadosSisa = (idPadron) => {
        this.emisionRemitosService.getEstadosSisa(idPadron).subscribe(data => {
            this.estadosSisa = data.estadosSisa;
            this.estadosSisa.forEach(estado => {
                if(estado.isCurrent) {
                    this.estadoSisa = estado;
                }
            });
        })
    }
    
    /**
     * Agrega el producto seleccionado a la lista de productosPendientes
     */
    onClickProductoLista = (prodSelec: ProductoReducido) => {
        if(prodSelec) {
            /*const dia = 24 * 60 * 60 * 1000;
            *///const diferenciaFechas = Math.round((new Date(this.comprobante.fechaVto.year, this.comprobante.fechaVto.month, this.comprobante.fechaVto.day).getTime() - new Date().getTime()) / dia);
            this.emisionRemitosService.buscarProducto(prodSelec.idProductos)(
                this.listaPrecioSelect.idListaPrecio
            )(this.comprobante.moneda.idMoneda)(this.tipoOperacion.idSisTipoOperacion)(this.comprobante.tipo.idCteTipo)(this.comprobante.fechaVto.getFechaFormateada())(this.esCanje)(this.cereal)(this.esPesificado)
                .subscribe(prodEnc => {
    
                    const auxProdSelect = Object.assign({}, prodEnc);
                    // Seteo el nro del comprobante actual
                    auxProdSelect.numero = this.utilsService.numeroObjectToString(this.comprobante.numerador)
                    const existeProd = this.tablas.datos.productosPend.find(prod=>prod.numero === auxProdSelect.numero && prod.comprobante === auxProdSelect.comprobante && prod.producto.codProducto == auxProdSelect.producto.codProducto);
                    if (!existeProd) {
                        // this.tablas.datos.productosPend.push(prodEnc);
                        this.tablas.datos.productosPend.push(auxProdSelect);
                        this.actualizarDatosProductos();
                    } else {
                        this.utilsService.showModal("Error")("Ese producto ya fue ingresado de forma directa en este comprobante")()();
                    }
            
                    // Despues de agregar el producto prosedo a ponerlo en edición
                    this.onClickEdit('columnasProductos')(auxProdSelect);
            
                    // Actualizo grilla trazable lotes
                    this.actualizarTrazableLotes();
                });
        }
    }


    limpiarFormulario = (noBorrar?) => {
        // Blanqueo los campos
        const auxFecha = this.comprobante.fechaComprobante;
        this.comprobante = new Comprobante();
        this.comprobante.fechaComprobante = auxFecha;
        this.comprobanteRelacionado = new ComprobanteRelacionado();
        this.comprobantePesificado = {
            puntoVenta: null,
            numero: null
        };
        this.comprobantePesificadoInterno = null;
        this.cliente = new Padron();
        this.tablas.datos.productosPend = [];
        this.tablas.datos.modelosFactura = [];
        // this.cotizacionDatos = { cotizacion: new Cotizacion(), total: 0 };
        this.deposito = null
        this.tablas.datos.detallesFormaPago = [];
        this.tipoOperacion = null;
        this.disableRest = false;
        this.esCanje = false;
        this.isAutorizada = false;
        this.claveAutorizacion = null;
        this.percep2459 = false;
        this.esPesificado = false;
        this.cliente.condIva = null
        this.marcaPesificado = false;
        this.pesificadoPersisteSn = false;
        if (!noBorrar || !noBorrar.includes('cotizacion')) {
            
            this.cotizacionDatos = { cotizacion: new Cotizacion(), total: 0};
        }
        this.sumatoriaSubtotales = 0;
    }

    onClickCancelar = () => 
        {
            this.utilsService.showModal('Aviso')('¿Cancelar emision de remito?')(
                () => {
                    this.limpiarFormulario(['cotizacion']);
                }
            )({
                tipoModal: 'confirmation',
            });
        }

    /**
     * Valida y graba el comprobante
     */
    onClickConfirmar = () =>
        this.emisionRemitosService.existsProductsWithoutCantidad(this.tablas.datos.productosPend) ?
            this.utilsService.showModal('Problema')('Los productos deben tener una cantidad asignada')()()
            :
            this.utilsService.showModal('Confirmar')('¿Confirmar emision de comprobante?')(
                () => {
                    this.actualizarSumatoriaSubto();

                    // Si SI hay intervalo y la fecha SE SALE de el, entonces..
                    if (
                        this.fechaComprobanteInvalida()
                    ) { 
                        this.utilsService.showModal('Error de fecha')(
                            `Fecha inválida para este punto de venta (Intervalo permitido: ${
                                moment(
                                    this.utilsService.dateLikePickerToDate(this.comprobante.numerador.fechaApertura)
                                ).format('DD-MM-YYYY')
                            } al ${
                                moment(
                                    this.utilsService.dateLikePickerToDate(this.comprobante.numerador.fechaCierre)
                                ).format('DD-MM-YYYY')
                            })`
                        )()()
                    
                    } else {
                        // Activo poircentaje grabado spinbner
                        this.grabandoPorcentaje = 30;

                        this.emisionRemitosService.confirmarYEmitirRemito(this.comprobante)
                            (this.comprobanteRelacionado)
                            (this.cliente)
                            (this.tablas.datos.productosPend)
                            (this.cotizacionDatos)
                            (this.sisCanje)
                            (this.formasPagoSeleccionadas)
                            (this.factura)
                            (this.tablas.datos.modelosFactura)
                            (this.tablas.datos.detallesFormaPago)
                            (this.deposito)
                            (this.tablas.datos.lotesTraza)
                            (this.tipoOperacion)
                            (this.dataVendedor)
                            (this.tablas.datos.subtotalesProductos)
                            (this.listaPrecioSelect)
                            (this.contrato)
                            (this.relacionCanje)
                            (this.cereal)
                            (this.diferidoVto)
                            (this.pesificado)
                            (this.marcaPesificado)
                            (this.pesificadoPersisteSn)
                            (this.comprobantePesificadoInterno)
                            .catch(err => {
                                this.grabandoPorcentaje = 0;
                                this.utilsService.showErrorWithBody(err)
                                return Observable.throw(null)
                            })
                            .subscribe((respuesta: any) => {
                                this.grabandoPorcentaje = 60;
                                // Autorizo en AFIP
                                if (this.comprobante.tipo.cursoLegal) {
                                    this.emisionRemitosService.autorizarAfip(
                                        respuesta.datos.idFactCab,
                                        this.factCabAfipRelacionado
                                    )
                                        .catch(err => {
                                            this.blanquearCampos();
                                            this.grabandoPorcentaje = 0;
                                            this.utilsService.showErrorWithBody(
                                                err, 
                                                true,
                                                // Recargo pantalla (TODO: Podría limpiar campo por campo, pero es mas simple y menos costozo recargar la página)
                                                () => console.log("hola")/*window.location.reload()*/
                                            );


                                            return Observable.throw(null)
                                        })
                                        .subscribe(respAfip => {
                                            if (respAfip && respAfip.datos) {
                                                this.grabandoPorcentaje = 0;
                                                // Modal para imprimir
                                                const compCreado = new ComprobanteEncabezado();
                                                compCreado.idFactCab = respuesta.datos.idFactCab;
                                                compCreado.numero = Number(
                                                    `${this.comprobante.numerador.ptoVenta.ptoVenta}${this.comprobante.numerador.ptoVenta.ptoVenta.toString().padStart(8, '0')}`
                                                );
                    
                                                this.utilsService.showImprimirModalAceptar(
                                                    respuesta.control.codigo
                                                )(
                                                    `${respuesta.control.descripcion}. 
                                                    CAI: ${respAfip.datos.cai}`
                                                )(
                                                    () => {
                                                        this.recursoService.downloadComp(compCreado, null, this.nroCopias, this.esCanje);
                                                        /*if(this.comprobante.tipo.idCteTipo == 75 && this.tipoOperacion.idSisTipoOperacion == 5) {
                                                            this.recursoService.downloadComp(compCreado, "contratoCanje");
                                                            this.recursoService.downloadComp(compCreado, "documentoCanje");
                                                        }*/
                                                        this.blanquearCampos();
                                                    }
                                                )(
                                                    compCreado
                                                )(() => {
                                                    this.blanquearCampos();
                                                });
                    
                                                if(!this.comprobante.tipo.comprobante.usaContrato) {
                                                    // // Blanqueo los campos
                                                }
                                            }
                                        })
                                } else {
                                    this.grabandoPorcentaje = 0;
                                    
                                    // Modal para imprimir
                                    const compCreado = new ComprobanteEncabezado();
                                    compCreado.idFactCab = respuesta.datos.idFactCab;
                                    compCreado.numero = Number(
                                        `${this.comprobante.numerador.ptoVenta.ptoVenta}${this.comprobante.numerador.ptoVenta.ptoVenta.toString().padStart(8, '0')}`
                                    );
        
                                    this.utilsService.showImprimirModalAceptar(
                                        respuesta.control.codigo
                                    )(
                                        `${respuesta.control.descripcion}`
                                    )(
                                        () => {
                                            this.recursoService.downloadComp(compCreado, null, this.nroCopias)
                                            this.blanquearCampos();
                                        }
                                    )(
                                        compCreado
                                    )(() => {
                                        this.blanquearCampos();
                                    });
                                    
                                    if(!this.comprobante.tipo.comprobante.usaContrato) {
                                        // // Blanqueo los campos
                                        
                                    }
                                    
                                }

                                // Genero un contrato nuevo
                                if(this.comprobante.tipo.comprobante.usaContrato) {
                                    this.blanquearCampos();
                                    /*this.contratosService.generarContratoByComprobante(this.cliente, this.getCantidadCanjeReferencia(), this.sisCanje)
                                    .catch(err => {
                                        // Si falla queda por generar el contrato Pendiente. Le aviso al usuario
                                        this.utilsService.showErrorWithBody(err);

                                        return Observable.of({
                                            arraydatos: []
                                        });
                                    })
                                    .subscribe(
                                        resp => {
                                            // Blanqueo los campos
                                            this.blanquearCampos();
                                        }
                                    )*/
                                }
                            })
                    }
                })({ tipoModal: 'confirmation' })

    /**
     * Blanquea todos los campos (cuando confirma se usa)
     */
    blanquearCampos = () => {
        const auxFecha = this.comprobante.fechaComprobante;
        this.comprobante = new Comprobante();
        this.comprobante.fechaComprobante = auxFecha;
        this.comprobanteRelacionado = new ComprobanteRelacionado();
        this.comprobantePesificado = {
            puntoVenta: null,
            numero: null
        }; 
        this.comprobantePesificadoInterno = null;
        this.cliente = new Padron();

        this.cliente.condIva = new CondIva(); setTimeout(() => { this.cliente.condIva = new CondIva() }, 1000); // TODO: Fix horrible, sacar

        this.tablas.datos.productosPend = [];
        this.tablas.datos.modelosFactura = [];
        this.deposito = new Deposito()
        this.tablas.datos.detallesFormaPago = [];
        this.tablas.datos.lotesTraza = [];
        this.condicionesConfirmadas = false;
        this.diferidoVto = false;
        this.cereal = null;
        this.esCanje = false;
        this.isAutorizada = false;
        this.claveAutorizacion = null;
        this.esPesificado = false;
        this.percep2459 = false;
        this.nroCopias = 3;
        this.disableRest = false;
        // Limpio formas pago
        this.dataTablaFormasPago = null;
        this.formasPagoSeleccionadas = [];
        this.codigoAfipRelacionado = null;
        this.numeroAfipRelacionado = null;
        this.factCabAfipRelacionado = null;
        this.relacionadoConfirmado = false;
        this.ptoVentaAfipRelacionado = null;
        this.numeroComprobanteAfipRelacionado = null;
        // Limpio lista pre
        this.listaPrecioSelect = null;
        this.marcaPesificado = false;
        this.pesificadoPersisteSn = false;
        // Reinicio radio buttons
        this.listasPreciosUsuario.subscribe(
            resp => resp.forEach(
                (lp, ind) => {
                    const e = document.getElementById('lp-radio-' + ind) as HTMLInputElement;
                    e.checked = false;
                }
            )
        )
        

        // Limpio vendedor
        this.dataVendedor.vendedor = new Vendedor();
        this.dataVendedor.incluir = false;

        // Limpio cotizacion datos
        this.cotizacionDatos.total = 0;
        this.sumatoriaSubtotales = 0;

        // Limpio subtotales
        this.tablas.datos.subtotalesProductos = [];

        // Limpio datos canje
        this.sisCanje = new SisCanje();

        // Focus en input proveedor (TODO SET TIME OUT)
        document.getElementById('clienteSeleccionado') ? document.getElementById('clienteSeleccionado').focus() : null
    }

    /**
     * Busca los productos pendientes de acuerdo al comprobante relacionado
     */
    onClickBuscarPendientes = () => 
        this.emisionRemitosService.buscarPendientes(this.cliente)(this.comprobanteRelacionado)(this.comprobante)(this.tipoOperacion)(this.listaPrecioSelect)(this.comprobante.fechaVto.getFechaFormateada())(this.cereal)(this.esCanje)(this.esPesificado)
            .subscribe(prodsPend => {
                // Agrego los productos
                if(this.preservarPrevios) {
                    this.tablas.datos.productosPend = [...this.tablas.datos.productosPend, ...prodsPend];
                    if(this.tipoOperacion.idSisTipoOperacion == 5 && this.comprobante.tipo.idCteTipo == 75) {
                        this.tablas.datos.recargoCanjes = [...prodsPend];
                    }
                } else {
                    this.tablas.datos.productosPend = prodsPend;
                    if(this.tipoOperacion.idSisTipoOperacion == 5 && this.comprobante.tipo.idCteTipo == 75) {
                        this.tablas.datos.recargoCanjes = [...prodsPend];
                    }
                }


                // Array de observables
                const actualizacionObser = prodsPend.map(pp => this.actualizarSubtotales(pp, { fromBuscaPendiente: true }))

                // DESPUES de actualizar todos los subtotales, ahí actualizo datos productos
                Promise.all(actualizacionObser).then(fa => {
                    // Actualizo datos de los productos
                    this.actualizarDatosProductos();
                })


            });

    /**
     * Event on click en la lista del popup de cliente
     */
    onClickPopupCliente = (prove: Padron) => {
        // Limpio primero el formulario
        this.limpiarFormulario(['cotizacion']);
        // Despue sseteo el cliente seleccionado
        this.cliente = new Padron({...prove});
        // debugger;
        // Deshabilito la posibilidad de hacer un cliente custom
        this.disabledClienteCustom = true;

        // Focus siguiente elemento
        document.getElementById('tipoOperacionSelect') ? document.getElementById('tipoOperacionSelect').focus() : null;

        this.contratos = this.recursoService.getRecursoList(resourcesREST.contratos)({ idPadron: prove.padronCodigo });
    }
    
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// Eventos Blur ////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    
    /**
     * El blur es cuando se hace un leave del input (caundo se apreta click afuera por ejemplo).
     * Acá lo que hago es poner un array vacio como próx valor de los filtrados, cosa que la lista desaparezca porque no hay nada
     * También retorno el cliente seleccionado en el input
     * También checkeo si ya seleccionó cte y pto venta y fecha, y si es así entonces hago la consulta de formas de pago
     */
    onBlurInputCliente = (e) => {
        // Al hacer blur (apreta TAB) está intentando agarrar por padronCodigo, asi que lo busco
        const clienteExistente = this.clientes.filtrados.value
            .find(cli => cli.padronCodigo === Number(this.cliente.padronCodigo));

        // Vacio filtrados
        this.clientes.filtrados.next([]);

        // Actualizo cliente seleccionado
        try {
            if (clienteExistente && clienteExistente.padronCodigo && clienteExistente.padronApelli) {
                // Antes de todo, checkeo que tenga cuit. Si NO tiene cuit, no puede continuar
                if (!clienteExistente.cuit || clienteExistente.cuit <= 0) {
                    // Muestra mensaje cuit no tiene
                    this.utilsService.showModal('Aviso')('Debe seleccionar un cliente que tenga un cuit')()();
                    this.cliente = new Padron();
                    
                } else {
                    // Actualizo listas precios
                    this.listasPreciosUsuario = this.recursoService.getRecursoList(resourcesREST.listaPrecios)({
                        codPadron: clienteExistente.padronCodigo
                    });

                    // Limpio primero el formulario
                    this.limpiarFormulario(['cotizacion']);
                    // Despue sseteo el cliente seleccionado
                    this.cliente = clienteExistente;
        
                    // Lo busco en la base de facturacion
                    this.emisionRemitosService.checkIfClientExistInFacturacion(clienteExistente).then(vendedorAsociado => {
    
                        // Viene en un array pero siempre trae 1 (si lo encuetra, si no lo encuentra trae 0 o null)
                        if (vendedorAsociado) {
                            // Si lo encuentra todo ok, no le pido que lo cree. Solo me guardo el vendedor asociado
                            this.dataVendedor = {
                                vendedor: vendedorAsociado,
                                incluir: true
                            }
                        } else {
                            // Si NO lo encuentra, le pido que lo cree
                            /*this.utilsService.showModal('Aviso')('Cliente no existente. ¿Desea crearlo?')(()=>{
                                this.router.navigate(
                                    ['/pages/tablas/clientes/nuevo'],
                                    { 
                                        queryParams: { 
                                            codPadronCliente: clienteExistente.padronCodigo
                                        } 
                                    }
                                );
                            })({tipoModal:'confirmation'}, () => {
                                this.dataVendedor = {
                                    vendedor: new Vendedor(),
                                    incluir: false
                                };
                            })*/
                            this.emisionRemitosService.llenarPadron(this.cliente);
                        }
        
                        // Deshabilito los input del customcliente
                        this.disabledClienteCustom = true;
        
                        // Hago foco en dropdown tipo
                        document.getElementById('tipoOperacionSelect') ? document.getElementById('tipoOperacionSelect').focus() : null;
                    });
                }


            } else {
                this.cliente.padronCodigo = null;
            }
        }
        catch(err) {
            // Muestro error
            if (err && err.nombre && err.descripcion) {
                this.utilsService.showModal(err.nombre)(err.descripcion)()();
            }
            // Vacio cliente seleccionado
            this.cliente = new Padron();
        }

    }

    
    /**
     * Evento que se dispara cuando se selecciona una fecha de emision
     */
    onModelChangeFechaComp(e, d) {
        // Actualizo fecha (sobretodo si el formato es 'ddmm')
        this.comprobante.fechaComprobante = this.utilsService.stringToDateLikePicker(this.comprobante.fechaComprobante);
    }   

    /**
     * Evento que se dispara cuando se selecciona una fecha de vencimiento
     */
    onModelChangeFechaVto(e, d) {
        // Actualizo fecha (sobretodo si el formato es 'ddmm')
        this.comprobante.fechaVto = this.utilsService.stringToDateLikePicker(this.comprobante.fechaVto);
        if(!this.comprobante.fechaComprobante) {
            this.comprobante.fechaVto = null;
            this.utilsService.showModal("Error")("Ingrese primero la fecha de emisión")()();
        } else if (!(this.comprobante.fechaVto.year > this.comprobante.fechaComprobante.year || (this.comprobante.fechaVto.year == this.comprobante.fechaComprobante.year && this.comprobante.fechaVto.month > this.comprobante.fechaComprobante.month) || (this.comprobante.fechaVto.year == this.comprobante.fechaComprobante.year && this.comprobante.fechaVto.month == this.comprobante.fechaComprobante.month && this.comprobante.fechaVto.day >= this.comprobante.fechaComprobante.day))) {
            this.comprobante.fechaVto = null;
            this.utilsService.showModal("Error")("La fecha de vencimiento debe ser igual o posterior a la de emisión")()();
        }
    }   

    /**
     * Setea la fecha de compra calculandola dado un string en formato 'ddmm', parseando a 'dd/mm/aaaa'
     * También hago otras cosas
     */
    onBlurFechaComprobante = (e) => {

        // Actualizo fecha (sobretodo si el formato es 'ddmm')
        this.comprobante.fechaComprobante = this.utilsService.stringToDateLikePicker(this.comprobante.fechaComprobante);
            // Actualizo grilla trazable lotes
            this.actualizarTrazableLotes();

            // Hago foco en el primer checbkox de la sformas de pago (el timeout es necesario para que espere a que se haga la consulta)
            // en gral esta consulta dura poquito (entre 10 y 40 milisegundos). Por eso con 150 milisegundos de espera es mas que suficiente
            setTimeout(() => {
                // Hago focus al siguiente elemento de lps
                const primerCheckBoxFp: any = document.getElementById('lp-radio-0');
                if (primerCheckBoxFp) {
                    // primerCheckBoxFp.checked = true;
                    primerCheckBoxFp.focus();
                }   
            }, 150)
    }

    onBlurFechaVencimiento = (e) => {

        // Actualizo fecha (sobretodo si el formato es 'ddmm')
        this.comprobante.fechaVto = this.utilsService.stringToDateLikePicker(this.comprobante.fechaVto);
        if(!this.comprobante.fechaComprobante) {
            this.comprobante.fechaVto = null;
            this.utilsService.showModal("Error")("Ingrese primero la fecha de emisión")()();
        } else if (!(this.comprobante.fechaVto.year > this.comprobante.fechaComprobante.year || (this.comprobante.fechaVto.year == this.comprobante.fechaComprobante.year && this.comprobante.fechaVto.month > this.comprobante.fechaComprobante.month) || (this.comprobante.fechaVto.year == this.comprobante.fechaComprobante.year && this.comprobante.fechaVto.month == this.comprobante.fechaComprobante.month && this.comprobante.fechaVto.day >= this.comprobante.fechaComprobante.day))) {
            this.comprobante.fechaVto = null;
            this.utilsService.showModal("Error")("La fecha de vencimiento debe ser igual o posterior a la de emisión")()();
        } else {
            // Actualizo grilla trazable lotes
            this.actualizarTrazableLotes();

            // Hago foco en el primer checbkox de la sformas de pago (el timeout es necesario para que espere a que se haga la consulta)
            // en gral esta consulta dura poquito (entre 10 y 40 milisegundos). Por eso con 150 milisegundos de espera es mas que suficiente
            setTimeout(() => {
                // Hago focus al siguiente elemento de lps
                const primerCheckBoxFp: any = document.getElementById('lp-radio-0');
                if (primerCheckBoxFp) {
                    // primerCheckBoxFp.checked = true;
                    primerCheckBoxFp.focus();
                }   
            }, 150)
        }
    }

    /**
     * Evento blur de pto venta y numero en comprobante
     * tipo: puntoVenta o numero
     * keyTipoe: comprobante, comprobanteRelacionado
     */
    onBlurNumeroAutocomp = (e) => (tipo: string) => (keyTipo: string) => 
        this[keyTipo][tipo] = this.emisionRemitosService.autocompNroComp(tipo)(this[keyTipo]);
    

    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// Otras Eventos ///////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    /**
     * Actualizo el deposito seleccionado que me viene de tablaIngreso
     */
    onSelectDeposito = (depSelect: Deposito) => {
        this.deposito = depSelect;
    }

    /**
     * Evento de cuando se apreta felcha arriba o feclah abajo en input de busca cliente
     */
    keyPressInputTexto = (e: any) => (upOrDown) => {
        e.preventDefault();
        // Hace todo el laburo de la lista popup y retorna el nuevo indice seleccionado
        this.clienteEnfocadoIndex = 
            this.popupListaService.keyPressInputForPopup(upOrDown)(this.clientes.filtrados.value)(this.clienteEnfocadoIndex)
    }

    /**
     * Evento on enter en el input de buscar cliente
     */
    onEnterInputProv = (e: any) => {
        e.preventDefault();
        this.clientes.filtrados.subscribe(provsLista => {
            // Busco el producto
            const provSelect = provsLista && provsLista.length ? provsLista[this.clienteEnfocadoIndex] : null;
            // Lo selecciono
            provSelect ? this.onClickPopupCliente(provSelect) : null;
            // Reseteo el index
            this.clienteEnfocadoIndex = -1;
        })
    }

    
    /**
     * Evento change del input del proovedor
     * _.throttle(onChangeInputCliente, 300)
     */
    onChangeInputCliente = (busqueda) => {
        // Limpio los clientes
        this.clientes.filtrados.next([]);
        this.cliente = new Padron();

        if (busqueda && busqueda.length >= 2) {
            this.findClientes(busqueda)
        }

        // Reseteo el indice
        this.clienteEnfocadoIndex = -1;
    }

    buscandoCliente = false;

    findClientes = _.throttle(
        (busqueda) => {
            this.buscandoCliente = true;

            this.recursoService.getRecursoList(resourcesREST.padron)({
                grupo: gruposParametros.cliente,
                elementos: busqueda
            }).subscribe(clientes => {
                this.clientes.filtrados.next(clientes);
                this.buscandoCliente = false;
            })
        },
        400
    )
    

    /**
     * Agrega o elimina una forma pago de las seleccionadas. Tambien muestra detalle de la lista correspondiente
     */
    handleFormaPagoSelec = (fp: FormaPago) => (tipoOperacion: string) => {
        // Agrego o elimino
        if (tipoOperacion === 'add') {
            if(fp.descripcion == "Canje" || fp.descripcion == "Dólar Abierto") {
                this.formasPagoSeleccionadas = [];
                this.formasPagoSeleccionadas.push(fp);
                this.disableRest = true;
                if(this.comprobante && this.comprobante.tipo && this.comprobante.tipo.idCteTipo && this.comprobante.tipo.idCteTipo == 75) {
                    this.esCanje = true;
                    this.diferidoVto = true;
                    if(fp.idFormaPago == 12) {
                        this.percep2459 = true;
                    }
                }
            } else if (fp.descripcion == "Pesificado") {
                this.formasPagoSeleccionadas = [];
                this.formasPagoSeleccionadas.push(fp);
                this.disableRest = true;
                if(this.comprobante && this.comprobante.tipo && this.comprobante.tipo.idCteTipo && this.comprobante.tipo.idCteTipo == 75) {
                    this.esPesificado = true;
                }
            } else {
                // Primero los borro (si quedaorn de anbtes)
                this.formasPagoSeleccionadas = this.formasPagoSeleccionadas.filter(fpSelec => fpSelec.idFormaPago !== fp.idFormaPago);
                // Ahora los agrego
                this.formasPagoSeleccionadas.push(fp)
            }
        } else {
            this.formasPagoSeleccionadas = this.formasPagoSeleccionadas.filter(fpSelec => fpSelec.idFormaPago !== fp.idFormaPago);
            this.disableRest = false;
            this.esCanje = false;
            this.isAutorizada = false;
            this.claveAutorizacion = null;
            this.diferidoVto = false;
            this.esPesificado = false;
            this.percep2459 = false;
        }


        // Ahora mappeo los detalles de las formas de pago seleccionadas para mostrarlos en la grilla de el medio
        this.tablas.datos.detallesFormaPago = this.formasPagoSeleccionadas
            .map(
                fp => Object.assign([], fp.detalles)
                    .map(det => {
                        const auxDet: DetalleFormaPago = Object.assign({}, det);
                        auxDet.formaPagoDescrip = fp.descripcion;
                        // Seteo fechaPago
                        auxDet.fechaPago = new DateLikePicker(
                            moment(
                                this.utilsService.dateLikePickerToDate(
                                    this.comprobante.fechaVto
                                )
                            ).add(auxDet.cantDias, 'days').toDate()
                        )
                        // 
                        return auxDet;
                    })
            )
            .reduce((a, b) => [...a].concat([...b]), []); // Aca aplasto el array bidimensional a uno de una dimensión
    }

    /**
     * Actualizo subtotales
     */
    actualizarSubtotales = (prod: ProductoPendiente, options = { fromBuscaPendiente: false }) => {
        // Si busca pendientes..
        // if (prod.importe === 0 && this.tablas.datos.subtotalesProductos.length <= 0) {

        if (options.fromBuscaPendiente && prod.importe === 0) {
            this.tablas.datos.subtotalesProductos.push({
                idProducto: prod.producto.idProductos,
                subtotal: 0,
                subtotalIva: 0,
                numeroComp: prod.comprobante,
                precioDesc: 0,
                idFactDetalle: prod.idFactDetalle
            });
        } else {
            // Obtengo el nuevo subtotal
            return this.emisionRemitosService.getCalculoSubtotales(prod)
                .toPromise()
                .then(nuevoSubtotal => {
                    
                    // Checkeo si hay uno viejo
                    const viejoSubtotal = this.tablas.datos.subtotalesProductos
                        .find(
                            s => prod.idFactDetalle === s.idFactDetalle
                        );
    
                    // Si hay uno viejo, lo edito. Si NO hay uno viejo, pusheo directamente el nuevo
                    if (viejoSubtotal) {
                        viejoSubtotal.subtotal = nuevoSubtotal.subtotal;
                        viejoSubtotal.subtotalIva = nuevoSubtotal.subtotalIva;
                        viejoSubtotal.precioDesc = nuevoSubtotal.precioDesc;
                    } else {
                        this.tablas.datos.subtotalesProductos.push(nuevoSubtotal);
                    }
                })
        }

    }
    
    /**
     * Actualiza el total en cotizacion y otros
     */
    actualizarDatosProductos = (itemSelect?) => {
       if (this.estadoRelacionadoObligatorio == true){
       
            if (itemSelect > 0){

                if (itemSelect.pendiente > itemSelect.original){
                    alert("Atención !!! No se puede modificar la cantidad del comprobante: El valor ingresado no puede ser mayor al valor Original")
                    itemSelect.pendiente = itemSelect.original
                }

            }

       }
        // Si viene un item es porque viene de onClickConfirm
        if (itemSelect) {
            // Actualizo subtotal, y dsps las facturas


            this.actualizarSubtotales(itemSelect).then(resp => {
                this.fetchFacturas();
                this.actualizarTotalNeto();
            })
        } else {
            this.fetchFacturas()
            this.actualizarTotalNeto()
        }


    }

    actualizarTotalNeto = () => {
        // Es la suma de la columna subtotal (que ya tiene aplicado el descuento)
        this.cotizacionDatos.total = 
            this.comprobante.tipo.comprobante.incluyeNeto ?
                _.sumBy(
                    this.tablas.datos.productosPend,
                    (prod) => {
                        // Busco el subtotal
                        const subtotalBuscado = this.tablas.datos.subtotalesProductos
                            .find(
                                st => st.idFactDetalle === prod.idFactDetalle
                            );
                        
                        return subtotalBuscado && subtotalBuscado.subtotal ? subtotalBuscado.subtotal : 0;
                    }
                ) : 0;

        
        
    }

    actualizarSumatoriaSubto = () => {
        this.sumatoriaSubtotales = 
            this.comprobante && this.comprobante.tipo && this.comprobante.tipo.comprobante &&
            this.comprobante.tipo.comprobante.incluyeIva ? 
                _.sumBy(
                    this.tablas.datos.modelosFactura,
                    (fact) => Number(fact.importeTotal) ? Number(fact.importeTotal) : 0
                ) : 0
    }

    /**
     * Actualiza la grilla de Trazable Lotes
     */
    actualizarTrazableLotes = (prodToDelete?) => {
        // Agrego los lotes de los productos trazables a la grilla de trazabilidad lotes
        if (this.tablas.datos.productosPend.length > 0) {
            this.emisionRemitosService.buscaLotes(
                this.tablas.datos.productosPend
            )(
                this.comprobante
            ).subscribe(
                lotes => {
                    const nuevosLotes = lotes.filter(
                        lotNew => !this.tablas.datos.lotesTraza.some(  
                            lotOld => lotOld.idLote === lotNew.idLote
                        )
                    );

                    this.tablas.datos.lotesTraza = this.tablas.datos.lotesTraza.concat(nuevosLotes);

                    // Si se borró algún producto, borro sus lotes correspondientes
                    if (prodToDelete) {
                        this.tablas.datos.lotesTraza = this.tablas.datos.lotesTraza.filter(
                            // TODO: Fijarse si está filtrando bien acá. Quizás filtrar por idFactDetalle
                            lot => lot.idProducto === prodToDelete.producto.idProducto
                        )
                    }
                }
            )
        } else {
            this.tablas.datos.lotesTraza = [];
        }

    }
 /* verificoRelacionadoObligatorio = Si comprobantes relacionadoObligatorio esta en true, no dejo que se puedan agregar articulos porque 
      se toman desde los comprobantes relacionados ya cargados (ejemplo remitos)
    */
   verificoRelacionadoObligatorio = (val: Boolean) => {
        
        if (val == true) {
            return false;
        } else {
            return true;
        }

    }

    /**
     * Trae data que depende del tipo comprobante relacionado
     * También limpia varios campos
     */
    onChangeTipoComprobante = (cteTipoSelect: TipoComprobante) => {
        this.tiposComprobantesRel = this.recursoService.getRecursoList(resourcesREST.cteTipo)({
            'sisModulo': sisModulos.venta,
            'idCteTipo': cteTipoSelect.idCteTipo,
            'sisTipoOperacion': this.tipoOperacion.idSisTipoOperacion
        });
        //muestro titulo
        this.tituloCardComprobante = "COMPROBANTE: "+cteTipoSelect.comprobante.descripcion;

        // Si trae observaciones, las seteo en el nuevo comprobante que se está creando
        this.comprobante.observaciones = cteTipoSelect.comprobante && cteTipoSelect.comprobante.observaciones ?
            cteTipoSelect.comprobante.observaciones : null;

        this.comprobante.numerador = null;
        this.comprobante.moneda = null;
        this.comprobante.letraCodigo = null;
        this.disableRest = false;
        
        if (cteTipoSelect.comprobante.relacionadoObligatorio == undefined  || cteTipoSelect.comprobante.relacionadoObligatorio == false ){
            this.estadoRelacionadoObligatorio  = false;
        }else{
            this.estadoRelacionadoObligatorio  = true;
        }
        
        // Blanqueo todo lo que le sigue
        this.comprobanteRelacionado = new ComprobanteRelacionado();
        this.tablas.datos.productosPend = [];
        this.tablas.datos.modelosFactura = [];
        this.tablas.datos.detallesFormaPago = [];
        this.tablas.datos.lotesTraza = [];

        // Limpio formas pago
        this.dataTablaFormasPago = null;
        this.formasPagoSeleccionadas = [];

        // Limpio lista pre
        this.listaPrecioSelect = null;
        
        // Reinicio radio buttons
        this.listasPreciosUsuario.subscribe(
            resp => resp.forEach(
                (lp, ind) => {
                    const e = document.getElementById('lp-radio-' + ind) as HTMLInputElement;
                    e.checked = false;
                }
            )
        )

        // Limpio cotizacion datos
        this.cotizacionDatos.total = 0;
        this.sumatoriaSubtotales = 0;

        // Limpio subtotales
        this.tablas.datos.subtotalesProductos = [];

        // Limpio datos canje
        this.sisCanje = new SisCanje();
        this.nroCopias = 3;

        if(this.comprobante.tipo.idCteTipo == 75) {
            this.buscarCerealesCanje();
            this.buscaEstadosSisa(this.cliente.padronCodigo);
        }
        // Actualizo monedas
        this.monedas = cteTipoSelect.comprobante.monedas;
    }
    

   

    /**
     * Busca facturas
     */
    fetchFacturas = () => {
        // Busco las facturas de los productos
        if (this.cliente && this.tipoOperacion && this.tablas.datos.productosPend && this.tablas.datos.productosPend.length > 0) {
            this.emisionRemitosService.buscaModelos(
                this.tablas.datos.productosPend,
                this.tablas.datos.subtotalesProductos,
                this.comprobante.moneda ? this.comprobante.moneda.idMoneda : null,
                this.cliente.padronCodigo,
                this.tipoOperacion.idSisTipoOperacion,
                this.comprobante.tipo.idCteTipo,
                this.estadoSisa,
                this.percep2459
            ).subscribe(modelProds => {
                this.tablas.datos.modelosFactura = modelProds;
                this.actualizarSumatoriaSubto();

            })
        } else {
            this.tablas.datos.modelosFactura = [];
            this.sumatoriaSubtotales = 0;
        }
    }

    /**
     * Cuyando cambia el tipo operacion se actualizan los tipos comprobantes
     */
    onChangeTipoOperacion = (tipoOpSelect: SisTipoOperacion) => {
        this.recursoService.getRecursoList(resourcesREST.cteTipo)({
            'sisTipoOperacion': tipoOpSelect.idSisTipoOperacion,
            'sisSitIva' : this.cliente.condIva.descCorta
        }).subscribe(data => {
            this.tiposComprobantes = data;
        });


        this.depositos = this.recursoService.getRecursoList(resourcesREST.depositos)({
            todos: tipoOpSelect.depositoOrigen
        });
        if(tipoOpSelect.idSisTipoOperacion == 4) {
            this.emisionRemitosService.buscarFacturasAnticipadas(this.cliente.padronCodigo)
            .subscribe(encabezados => {
                if(encabezados.control.codigo == "OK" && encabezados.arraydatos.length > 0) {
                    let descripcion = "";
                    encabezados.arraydatos.forEach(encabezado => {
                        encabezado.detalle.forEach(detalle => {
                            descripcion += detalle.articulo + " - " + detalle.pendiente + " unidades \n";
                        })
                    });
                    this.utilsService.showModal("Este cliente tiene facturas anticipadas pendientes")(descripcion)()();
                }
            })
        }
        // Limpio grilla articulos y afines
        this.tablas.datos.productosPend = [];
        this.tablas.datos.modelosFactura = [];
        this.tablas.datos.detallesFormaPago = [];
        this.tablas.datos.lotesTraza = [];

        this.comprobante = new Comprobante();
        this.comprobanteRelacionado = new ComprobanteRelacionado();

        // Limpio cotizacion datos
        this.cotizacionDatos.total = 0;
        this.sumatoriaSubtotales = 0;
    }

    /**
     * Checkea si el resto a pagar es valido
     */
    isRestoPagarValid = () => {

        /**
         * El importe no es valido si es CERO y No se permite importe cero
         */
        const importeCeroValido = this.comprobante && this.comprobante.tipo && this.comprobante.tipo.comprobante &&
            (
                (this.cotizacionDatos.total + this.sumatoriaSubtotales) === 0 &&
                this.comprobante.tipo.comprobante.permiteImporteCero
            )

        return importeCeroValido || this.calcRestoPagar() === '0.00'
    }

    /**
     * Calcula el resto pagar
     */
    calcRestoPagar = () => {
        const sumMontos = _.sumBy(
            this.tablas.datos.detallesFormaPago,
            (fPago) => Number(fPago.monto) ? Number(fPago.monto) : 0
        )

        // Los paréntesis son ilustrativos, ya sabemos que la suma es asociativa y conmutativa
        const restoPagar = this.utilsService.toLocateString(Number(
            (this.cotizacionDatos.total + this.sumatoriaSubtotales) - sumMontos
        ).toFixed(2))
        // const restoPagar = Number(
        //     (this.cotizacionDatos.total + this.sumatoriaSubtotales) - sumMontos
        // ).toFixed(2);

        return (
            restoPagar === '-0.00' || 
            restoPagar === '-0.01' || 
            restoPagar === '0.01'
        ) ? '0.00' : restoPagar
    }


    compareIvaSelect = (i1, i2) => {
        // if (i1 & i2)
        //     debugger;
    }

    onBlurCuit = (ev) => {
        // Si el cuit NO es valido
        if (
            this.cliente.cuit &&
            this.cliente.cuit.toString() &&
            !this.utilsService.validarCuit(this.cliente.cuit.toString())
        ) {
            this.utilsService.showModal('Error')('Cuit no válido')
                (
                    () => {
                        this.cliente.cuit = null;
                        document.getElementById('cuitCliente') ? 
                            document.getElementById('cuitCliente').focus() : null
                    }
                )();
        }
    }

    disabledConfirmar = () => {

        const noPermiteImporteCero = this.cotizacionDatos && this.comprobante.tipo && this.comprobante.tipo.comprobante &&
            (
                this.cotizacionDatos.total + this.sumatoriaSubtotales === 0 &&
                !this.comprobante.tipo.comprobante.permiteImporteCero
            )

        const datosNoValidos = !this.emisionRemitosService.checkIfDatosValidosComprobante(this.comprobante)
            (this.cliente)
            (this.tablas.datos.productosPend)
            (this.tablas.datos.modelosFactura)
            (this.deposito)
            (this.tablas.datos.lotesTraza);

        const formaPagoNoValido = 
            (
                this.comprobante && this.comprobante.tipo && this.comprobante.tipo.requiereFormaPago 
                &&
                (
                    !this.tablas.datos.detallesFormaPago ||
                    this.tablas.datos.detallesFormaPago.length <= 0 ||
                    !this.isRestoPagarValid()
                )
            )
        
        const relacionadoNoValido = 
                    (
                        this.comprobante && this.comprobante.tipo && (this.comprobante.tipo.idCteTipo == 77 || this.comprobante.tipo.idCteTipo == 76)  && (!this.relacionadoConfirmado || !this.factCabAfipRelacionado)
                    )

        return datosNoValidos || formaPagoNoValido || noPermiteImporteCero || relacionadoNoValido
    }

    compareFnMonedas = (m1: Moneda, m2: Moneda) =>
        m1 && m2 ? m1.idMoneda === m2.idMoneda : m1 === m2

    /**
     * Actualia formas de pago y productos seleccionables
     */
    onChangeListaPrecio = (lp: ListaPrecio) => {

        this.listaPrecioSelect = lp;

        // Tabla forma de pago actualizo
        this.dataTablaFormasPago = lp && lp.formasPago ? lp.formasPago : null
        
        // Obtengo los productos que puede agregar a la venta
        this.recursoService.getRecursoList(resourcesREST.productosReducidos)({
            'tipo': 'reducida',
            'listaPrecio': lp.idListaPrecio,
            'aptoCanje': this.tipoOperacion.canje,
            'idDeposito': this.deposito ? this.deposito.idDeposito : null
        }).subscribe(prods => {
            this.productos.next(prods);
        });

        // Y limpio los productos que tenga agregado actualmente
        // this.tablas.datos.productosPend = [];

        // Si ya hay productos, los filtro por la lp seleccionada
        if (this.tablas.datos.productosPend && this.tablas.datos.productosPend.length > 0) {

            this.onClickBuscarPendientes()

            // this.tablas.datos.productosPend = this.tablas.datos.productosPend
            //     .filter(
            //         pp => pp.idListaPrecio === lp.idListaPrecio
            //     )
        }
    }

    fechaComprobanteInvalida = () => this.comprobante.numerador && 
        this.comprobante.numerador.fechaApertura &&
        this.comprobante.numerador.fechaCierre &&
        !moment(
            this.utilsService.dateLikePickerToDate(this.comprobante.fechaComprobante)
        ).isBetween(
            moment(
                this.utilsService.dateLikePickerToDate(this.comprobante.numerador.fechaApertura)
            ),
            moment(
                this.utilsService.dateLikePickerToDate(this.comprobante.numerador.fechaCierre)
            ),
            'days', 
            '[]'
        )

    onBlurPtoVentaCteRel = (e) => 
        this.utilsService.onBlurInputNumber(e) &&
            this.comprobanteRelacionado.puntoVenta ?
                this.comprobanteRelacionado.puntoVenta = this.comprobanteRelacionado.puntoVenta
                    .padStart(4, '0') : null;

    onBlurNumeradorCteRel = (e) => 
        this.utilsService.onBlurInputNumber(e) &&
            this.comprobanteRelacionado.numero ?
                this.comprobanteRelacionado.numero = this.comprobanteRelacionado.numero
                    .padStart(8, '0') : null;

    onBlurPtoVentaCtePes = (e) => 
                    this.utilsService.onBlurInputNumber(e) &&
                        this.comprobantePesificado &&
                        this.comprobantePesificado.puntoVenta ?
                            this.comprobantePesificado.puntoVenta = this.comprobantePesificado.puntoVenta
                                .padStart(4, '0') : null;
            
    onBlurNumeradorCtePes = (e) => 
                    this.utilsService.onBlurInputNumber(e) &&
                        this.comprobantePesificado &&
                        this.comprobantePesificado.numero ?
                            this.comprobantePesificado.numero = this.comprobantePesificado.numero
                                .padStart(8, '0') : null;

    onChangeLetra = (letraSelect: LetraCodigo) => 
        this.comprobante.numerador = (letraSelect && letraSelect.numeradores && letraSelect.numeradores.length > 0) ?
            letraSelect.numeradores[0] : null;


    onChangeContrato = (cont: Contrato) => {
        this.sisCanje = cont ? cont.sisCanje : null

        this.relacionesCanje = this.recursoService.getRecursoList(resourcesREST.relacionesCanje)({
            idSisCanje: this.sisCanje.idSisCanje
        })
    }

    onChangeProductoCanje = (sisCanje: SisCanje) => {
        
        this.relacionesCanje = this.recursoService.getRecursoList(resourcesREST.relacionesCanje)({
            idSisCanje: sisCanje.idSisCanje
        })
    }

    compareWithCanje = (a: SisCanje, b: SisCanje) => a.idSisCanje === b.idSisCanje
    compareWithContrato = (a: Contrato, b: Contrato) => a.idContratos === b.idContratos

    onClickConfirmCondiciones = () => {
        this.condicionesConfirmadas = true;
    }

    onClickCancelarCondiciones = () => {
        this.condicionesConfirmadas = false;
    }

    onClickConfirmRelacionado = () => {
        if(this.numeroComprobanteAfipRelacionado && this.ptoVentaAfipRelacionado) {
            const stringNumeroComprobante = this.numeroComprobanteAfipRelacionado.toString();
            this.numeroAfipRelacionado = Number(this.ptoVentaAfipRelacionado.toString() + _.padStart(stringNumeroComprobante, 8, "0"));
            this.emisionRemitosService.getComprobanteAfip(this.codigoAfipRelacionado, this.numeroAfipRelacionado)
            .subscribe(response => {
                this.utilsService.showModal(response.control.codigo)(response.control.descripcion)()();
                if(response.control.codigo == "OK") {
                    this.relacionadoConfirmado = true;
                    this.factCabAfipRelacionado = Number(response.control.descripcionLarga);
                }
            })
        } else {
            this.utilsService.showModal("Error")("Complete ambos campos para la búsqueda de comprobante")
        }
    }

    onClickCancelarRelacionado = () => {
        this.relacionadoConfirmado = false;
    }

    onClickBuscarPesificado = () => {
        this.emisionRemitosService.buscarComprobantesPesificacion(this.comprobantePesificado.puntoVenta + this.comprobantePesificado.numero).subscribe(response => {
            if(response) {
                this.utilsService.showModal("OK")("Comprobante encontrado")()();
                console.log(response);
                let valorTotal21 = 0;
                let valorTotal105 = 0;
                this.marcaPesificado = true;
                this.pesificadoPersisteSn = true;
                this.comprobantePesificadoInterno = response.numero;
                if(response.cotDolar < this.cotizacionDatos.cotizacion.cotizacion) {
                    this.comprobante.tipo = this.tiposComprobantes[this.tiposComprobantes.findIndex(value => value.idCteTipo === 76)];
                    this.comprobante.letraCodigo = this.comprobante.tipo.letrasCodigos[0];
                    this.onChangeLetra(this.comprobante.letraCodigo);
                    //this.onChangeTipoComprobante(this.comprobante.tipo);
                    this.monedas = this.comprobante.tipo.comprobante.monedas;
                    this.comprobante.moneda = this.monedas[this.monedas.findIndex(value => value.idMoneda === 1)];
                    response.detalle.forEach(value => {
                        if(value.ivaPorc == 21) {
                            valorTotal21 = valorTotal21 + (value.importe * (this.cotizacionDatos.cotizacion.cotizacion - response.cotDolar));
                        } else {
                            valorTotal105 = valorTotal105 + (value.importe * (this.cotizacionDatos.cotizacion.cotizacion - response.cotDolar));
                        }
                    });
                    if(response.diferidoVto) {
                        valorTotal21 = valorTotal21 + valorTotal21 * 0.21;
                        valorTotal105 = valorTotal105 + valorTotal105 * 0.105;
                    }
                    this.tablas.datos.productosPend.push(new ProductoPendiente({
                        item:0,
                        comprobante: '',
                        numero: "0",
                        original: 0,
                        pendiente: 1,
                        precio: valorTotal21 + valorTotal105,
                        dolar: 1,
                        moneda: " ",
                        porCalc: 0,
                        ivaPorc: 0,
                        deposito: 0,
                        idFactDetalleImputa: null,
                        idFactCabImputada: null,
                        descuento: 0,
                        tipoDescuento: "%",
                        cantBultos: 0,
                        despacho: "",
                        observaciones: "",
                        itemImputada: 0,
                        producto: {
                            idProductos: 1845,
                            codProducto: "999999",
                            codigoBarra: " ",
                            descripcionCorta: "AJUSTE X TC FAC. " + this.comprobantePesificado.puntoVenta + this.comprobantePesificado.numero + " - dolar " + response.cotDolar.toString(),
                            descripcion: "AJUSTE X TC FAC. " + this.comprobantePesificado.puntoVenta + this.comprobantePesificado.numero + " - dolar " + response.cotDolar.toString(),
                            aptoCanje: false,
                            stock: false,
                            trazable: false,
                            traReceta: false,
                            traInforma: false,
                            gtin: " ",
                            puntoPedido: "0.00",
                            costoReposicion: "0.00",
                            precioVentaProv: "0.00",
                            observaciones: " ",
                            IVA: {
                                idIVA: 1,
                                porcIVA: 21 
                            },
                            subRubro: null,
                            rubro: null,
                            unidadCompra: null,
                            unidadVenta: null,
                            editar: false,
                            modeloCab: null,
                            marca: null,
                            cultivos: [],
                            moneda: null
                        },
                        codigoListaPrecio: null,
                        idListaPrecio: null,
                        importe: valorTotal21 + valorTotal105,
                        idFactDetalle: "abc",
                        modeloCab: null,
                        diferenciaPrecio: 0,
                        recargo: 0,
                        recargoTotal: 0,
                        diasLibres: 0,
                        diasResultantes: 0,
                        cotaInferior: 0,
                        cotaSuperior: 0,
                    }))
                    this.tablas.datos.productosPend[0].imputacion.seleccionada = new ModeloDetalle({
                        idModeloDetalle: 585,
                        orden: 2,
                        descripcion: "IVA",
                        dh: "S",
                        prioritario: false,
                        operador: "*",
                        valor: 21,
                        ctaContable: "200281",
                        planCuenta: {
                            planCuentas: null,
                            planDescripcion: null
                        },
                        sisModulo: 2,
                        tipoModelo: 2,
                        libro: {
                            idLibro: 29
                        }
                    });
                    this.tablas.datos.productosPend[0].imputacion.seleccionada.idSisTipoModelo = 2;
                    this.tablas.datos.subtotalesProductos.push({
                        idProducto: 1845,
                        subtotal: valorTotal21 + valorTotal105,
                        subtotalIva: valorTotal21 + valorTotal105 + valorTotal21 * 0.21 + valorTotal105 * 0.21,
                        numeroComp: "000000000000",
                        precioDesc: 0,
                        idFactDetalle: "abc"
                    });
                    this.tablas.datos.modelosFactura.push({
                        cuentaContable: "200281",
                        descripcion: "IVA",
                        importeTotal: valorTotal21 * 0.21,
                        porcentaje: 21,
                        idSisTipoModelo: 2,
                        baseImponible: valorTotal21,
                        operador: "*",
                        idLibro: 29,
                    })
                    this.tablas.datos.modelosFactura.push({
                        cuentaContable: "200283",
                        descripcion: "IVA 10,5",
                        importeTotal: valorTotal105 * 0.105,
                        porcentaje: 10.5,
                        idSisTipoModelo: 2,
                        baseImponible: valorTotal105,
                        operador: "*",
                        idLibro: 29,
                    })
                    this.tablas.datos.lotesTraza = [];
                    this.actualizarSumatoriaSubto();
                    this.actualizarTotalNeto();
                    //this.actualizarDatosProductos();
                } else if(response.cotDolar > this.cotizacionDatos.cotizacion.cotizacion) {
                    this.comprobante.tipo = this.tiposComprobantes[this.tiposComprobantes.findIndex(value => value.idCteTipo === 77)];
                    this.comprobante.letraCodigo = this.comprobante.tipo.letrasCodigos[0];
                    this.onChangeLetra(this.comprobante.letraCodigo);
                    //this.onChangeTipoComprobante(this.comprobante.tipo);
                    this.comprobante.moneda = this.monedas[this.monedas.findIndex(value => value.idMoneda === 1)];
                    response.detalle.forEach(value => {
                        if(value.ivaPorc == 21) {
                            valorTotal21 = valorTotal21 + (value.importe * (response.cotDolar - this.cotizacionDatos.cotizacion.cotizacion));
                        } else {
                            valorTotal105 = valorTotal105 + (value.importe * (response.cotDolar - this.cotizacionDatos.cotizacion.cotizacion));
                        }
                    });
                    if(response.diferidoVto) {
                        valorTotal21 = valorTotal21 + valorTotal21 * 0.21;
                        valorTotal105 = valorTotal105 + valorTotal105 * 0.105;
                    }
                    this.tablas.datos.productosPend.push(new ProductoPendiente({
                        item: 0,
                        comprobante: '',
                        numero: "0",
                        original: 0,
                        pendiente: 1,
                        precio: valorTotal21 + valorTotal105,
                        dolar: 1,
                        moneda: " ",
                        porCalc: 0,
                        ivaPorc: 0,
                        deposito: 0,
                        idFactDetalleImputa: null,
                        idFactCabImputada: null,
                        descuento: 0,
                        tipoDescuento: "%",
                        cantBultos: 0,
                        despacho: "",
                        observaciones: "",
                        itemImputada: 0,
                        producto: {
                            idProductos: 1845,
                            codProducto: "999999",
                            codigoBarra: " ",
                            descripcionCorta: "AJUSTE X TC FAC. " + this.comprobantePesificado.puntoVenta + this.comprobantePesificado.numero + " - dolar " + response.cotDolar.toString(),
                            descripcion: "AJUSTE X TC FAC. " + this.comprobantePesificado.puntoVenta + this.comprobantePesificado.numero + " - dolar " + response.cotDolar.toString(),
                            aptoCanje: false,
                            stock: false,
                            trazable: false,
                            traReceta: false,
                            traInforma: false,
                            gtin: " ",
                            puntoPedido: "0.00",
                            costoReposicion: "0.00",
                            precioVentaProv: "0.00",
                            observaciones: " ",
                            IVA: {
                                idIVA: 1,
                                porcIVA: 21 
                            },
                            subRubro: null,
                            rubro: null,
                            unidadCompra: null,
                            unidadVenta: null,
                            editar: false,
                            modeloCab: null,
                            marca: null,
                            cultivos: [],
                            moneda: null
                        },
                        codigoListaPrecio: null,
                        idListaPrecio: null,
                        importe: valorTotal21 + valorTotal105,
                        idFactDetalle: "abc",
                        modeloCab: null,
                        diferenciaPrecio: 0,
                        recargo: 0,
                        recargoTotal: 0,
                        diasLibres: 0,
                        diasResultantes: 0,
                        cotaInferior: 0,
                        cotaSuperior: 0,
                    }))
                    this.tablas.datos.productosPend[0].imputacion.seleccionada = new ModeloDetalle({
                        idModeloDetalle: 585,
                        orden: 2,
                        descripcion: "IVA",
                        dh: "S",
                        prioritario: false,
                        operador: "*",
                        valor: 21,
                        ctaContable: "200281",
                        planCuenta: {
                            planCuentas: null,
                            planDescripcion: null
                        },
                        sisModulo: 2,
                        tipoModelo: 2,
                        libro: {
                            idLibro: 29
                        }
                    });
                    this.tablas.datos.productosPend[0].imputacion.seleccionada.idSisTipoModelo = 2;
                    this.tablas.datos.subtotalesProductos.push({
                        idProducto: 1845,
                        subtotal: valorTotal21 + valorTotal105,
                        subtotalIva: valorTotal21 + valorTotal105 + valorTotal21 * 0.21 + valorTotal105 * 0.21,
                        numeroComp: "000000000000",
                        precioDesc: 0,
                        idFactDetalle: "abc"
                    });
                    this.tablas.datos.modelosFactura.push({
                        cuentaContable: "200281",
                        descripcion: "IVA",
                        importeTotal: valorTotal21 * 0.21,
                        porcentaje: 21,
                        idSisTipoModelo: 2,
                        baseImponible: valorTotal21,
                        operador: "*",
                        idLibro: 29,
                    })
                    this.tablas.datos.modelosFactura.push({
                        cuentaContable: "200283",
                        descripcion: "IVA 10,5",
                        importeTotal: valorTotal105 * 0.105,
                        porcentaje: 10.5,
                        idSisTipoModelo: 2,
                        baseImponible: valorTotal105,
                        operador: "*",
                        idLibro: 29,
                    })
                    this.tablas.datos.lotesTraza = [];
                    this.actualizarSumatoriaSubto();
                    this.actualizarTotalNeto();
                } else {
                    this.utilsService.showModal("ERROR")("Las cotizaciones son iguales")()();
                }
            } else {
                this.utilsService.showModal("ERROR")("No se encontró el comprobante")()();
            }
        })
    }


    getCantidadCanjeReferencia = () => 
        this.comprobante && this.comprobante.tipo && 
            this.comprobante.tipo.comprobante && this.comprobante.tipo.comprobante.usaRelacion ? 
            (
                this.relacionCanje && this.tablas.datos.productosPend && this.tablas.datos.productosPend.length > 0 ?
                    _.sumBy(
                        this.tablas.datos.productosPend,
                        prod => Number(prod.pendiente)
                    ) * this.relacionCanje.factor 
                    :
                    0
            )
            :
            this.utilsService.parseDecimalNumber(
                Number(this.utilsService.parseDecimal(this.cotizacionDatos.total)) /
                this.sisCanje.precio 
            )
    
    
}
