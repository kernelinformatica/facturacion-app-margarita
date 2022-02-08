import { BaThemeConfig } from "./../../../../theme/theme.config";
import { DisabledButtons } from "./../../../examples/ui/components/buttons/components/disabledButtons/disabledButtons.component";
import * as _ from "lodash";
import * as moment from "moment";
import { Component, HostListener, AfterViewInit } from "@angular/core";

import { UtilsService } from "app/services/utilsService";
import { Observable } from "rxjs/Observable";
import { Padron } from "../../../../models/padron";
import { RecursoService } from "app/services/recursoService";
import { resourcesREST } from "constantes/resoursesREST";

import { SisTipoOperacion } from "app/models/sisTipoOperacion";
import { TipoComprobante } from "app/models/tipoComprobante";
import { Moneda } from "../../../../models/moneda";
import { ProductoPendiente } from "app/models/productoPendiente";
import { BehaviorSubject, Subject } from "rxjs";
import { Cotizacion } from "../../../../models/cotizacion";
import { Comprobante } from "app/models/comprobante";
import { ComprobanteRelacionado } from "app/models/comprobanteRelacionado";
import { Deposito } from "app/models/deposito";
import { PopupListaService } from "app/pages/reusable/otros/popup-lista/popup-lista-service";
import { ComprobanteCompraService } from "./comprobanteCompraService";
import { FormaPago } from "app/models/formaPago";

import { DetalleFormaPago } from "app/models/detalleFormaPago";
import { NgbProgressbarConfig } from "@ng-bootstrap/ng-bootstrap";
import { DateLikePicker } from "../../../../models/dateLikePicker";
import gruposParametros from "constantes/gruposParametros";
import { ProductoReducido } from "../../../../models/productoReducido";
import { TablaCompra } from "../../../../models/tablaCompra";
import { Numerador } from "app/models/numerador";
import sisModulos from "constantes/sisModulos";
import { ComprobanteEncabezado } from "app/models/comprobanteEncabezado";
import { PtoVenta } from "app/models/ptoVenta";
import { SisLetra } from "app/models/sisLetra";
import { LetraCodigo } from "app/models/letraCodigo";
import { Router } from "@angular/router";
import { ComprobanteService } from "app/services/comprobanteService";
import { Alert } from "selenium-webdriver";
import { AuthService } from "app/services/authService";

@Component({
    selector: "comprobante-compra",
    templateUrl: "./comprobanteCompra.html",
    styleUrls: ["./comprobanteCompra.scss"],
    providers: [NgbProgressbarConfig],
})

/**
 * Form reutilizable
 */
export class ComprobanteCompra implements AfterViewInit {
    // Checkea cambios antes de salir
    @HostListener("window:beforeunload")
    canDeactivate() {
        return this.comprobanteCompraService.checkPendingChanges(
            this.comprobante
        )(this.factura)(this.proveedorSeleccionado)(
            this.comprobanteRelacionado
        );
    }

    /////////////////////////////////////////////
    /////////// Modelos Comprobante /////////////
    /////////////////////////////////////////////
    proveedorSeleccionado: Padron = new Padron();
    comprobante: Comprobante = new Comprobante();
    comprobanteRelacionado: ComprobanteRelacionado =
        new ComprobanteRelacionado();
    factura: Comprobante = new Comprobante();
    cotizacionDatos: {
        cotizacion: Cotizacion;
        total: number;
    } = { cotizacion: new Cotizacion(), total: 0 };
    cotizacionDolarEditada: number;
    // seteo el estado obligatorio por defecto en falso
    estadoRelacionadoObligatorio: Boolean = false;
    estadoEdicionCantidadProducto: Boolean = false;
    depositoSelec: Deposito;
    tipoOpSelect: SisTipoOperacion;
    precioOriginal = [];
    sisTiposOpDepositos: any[];
    depositosAMostrar: Deposito[] = [];
    allDepositos: Deposito[];
    filtro = {};
    agregarElemento = false;
    pesificado = false;
    dolarizadoAlVto = false;
    interesMensualCompra = 0.0;
    canjeInsumos = false;
    tipoCambio = "divisa";
    condicionesConfirmadas = false;
    // Indice del producto enfocado del popup
    proveedorEnfocadoIndex: number = -1;
    // Suma de todos los subtotales
    sumatoriaSubtotales: number = 0;
    // Fps seleccionadas
    formasPagoSeleccionadas: FormaPago[] = [];

    /////////////////////////////////////////////
    //////////// Listas desplegables ////////////
    /////////////////////////////////////////////
    tiposComprobantes: Observable<TipoComprobante[]>;
    tiposOperacion: Observable<SisTipoOperacion[]>;
    // monedas: Observable<Moneda[]>;
    monedas: Subject<Moneda[]> = new Subject();
    depositos: Observable<Deposito[]>;
    tiposComprobantesFactura: Observable<TipoComprobante[]>;
    tiposComprobantesRel: Observable<TipoComprobante[]>;
    tituloCardComprobante: String = "COMPROBANTE";
    proveedores: {
        filtrados: BehaviorSubject<Padron[]>;
    } = {
        filtrados: new BehaviorSubject([]),
    };

    letras: string[] = [];
    ajusteConfirmado = false;
    valorRealFactura: number = null;
    valorCalculadoFactura: number = null;

    // Si es 0, no se muestra el 'cargando'.
    valueGuardandoCompro = 0;

    /**
     * Blurs customs
     */

    customsBlurProduct = {
        calculateImporte: (item: ProductoPendiente, ev) => {
            if (this.estadoEdicionCantidadProducto == false) {
                item.importe = item.pendiente * Number(item.precio);
                this.utilsService.onBlurInputNumber(ev);
            }
        },
    };

    /////////////////////////////////////////////

    ////////////////// Tablas ///////////////////
    /////////////////////////////////////////////
    dataTablaFormasPago: Observable<FormaPago[]>;
    tablas: TablaCompra = new TablaCompra();

    ////////////////////////////////////////////
    //////////////// PopupLista ////////////////
    ////////////////////////////////////////////

    popupLista: any = {
        onClickListProv: (prove: Padron) => {
            this.proveedorSeleccionado = new Padron({ ...prove });

            // Focus siguiente elemento
            document.getElementById("tipoOperacionSelect")
                ? document.getElementById("tipoOperacionSelect").focus()
                : null;
        },
        getOffsetOfInputProveedor: () =>
            this.utilsService.getOffset(
                document.getElementById("inputProveedor")
            ),
    };

    /**
     * Toda la carga de data se hace en el mismo orden en el que está declarado arriba
     */
    constructor(
        private recursoService: RecursoService,
        public comprobanteCompraService: ComprobanteCompraService,
        public comprobanteService: ComprobanteService,
        public utilsService: UtilsService,
        private popupListaService: PopupListaService,
        private router: Router,
        configProgressBar: NgbProgressbarConfig,
        private authService: AuthService
    ) {
        this.comprobante.numerador = new Numerador();

        ////////// Barra de progreso ///////////
        configProgressBar.max = 100;
        configProgressBar.striped = true;
        configProgressBar.animated = true;
        configProgressBar.type = "success";

        ////////// Listas desplegables  //////////
        this.tiposOperacion = this.recursoService.getRecursoList(
            resourcesREST.sisTipoOperacion
        )({
            sisModulo: 1,
        });

        // this.monedas = this.recursoService.getRecursoList(resourcesREST.sisMonedas)();
        // this.depositos = this.recursoService.getRecursoList(resourcesREST.depositos)();

        this.tiposComprobantesFactura = this.recursoService.getRecursoList(
            resourcesREST.cteTipo
        )({
            sisComprobante: 2,
        });

        this.dataTablaFormasPago = this.recursoService.getRecursoList(
            resourcesREST.formaPago
        )({
            codPadron: this.proveedorSeleccionado
                ? this.proveedorSeleccionado.padronCodigo
                : null,
            idSisModulo: sisModulos.compra,
        });

        ////////// Proveedores  //////////

        this.recursoService
            .getRecursoList(resourcesREST.padron)({
                grupo: gruposParametros.proveedor,
            })
            .subscribe((proveedores) => {
                // this.proveedores.todos = proveedores;
                this.proveedores.filtrados.next(proveedores);
            });

        ////////// Tablas //////////
        this.tablas.columnas.columnasProductos =
            comprobanteCompraService.getColumnsProductos();
        this.tablas.columnas.columnasTrazabilidad =
            comprobanteCompraService.getColumnsTrazabilidad();
        this.tablas.columnas.columnasFactura =
            comprobanteCompraService.getColumnsFactura();
        this.tablas.columnas.columnasDetallesFp =
            comprobanteCompraService.getColumnsDetallesFp();
        this.recursoService
            .getRecursoList(resourcesREST.tiposOpDepositos)()
            .subscribe((data) => {
                this.sisTiposOpDepositos = data;
                for (let i = 0; i < this.sisTiposOpDepositos.length; i++) {
                    if (
                        !this.filtro[
                            this.sisTiposOpDepositos[i].idSisTipoOperacion
                        ]
                    ) {
                        this.filtro[
                            this.sisTiposOpDepositos[i].idSisTipoOperacion
                        ] = [];
                    }
                    this.filtro[
                        this.sisTiposOpDepositos[i].idSisTipoOperacion
                    ].push(this.sisTiposOpDepositos[i].idDepositos);
                }
            });
        this.recursoService
            .getRecursoList(resourcesREST.depositos)({
                todos: 1,
            })
            .subscribe((data) => {
                this.allDepositos = data;
            });
        ////////// Otros //////////
        this.comprobanteCompraService
            .getCotizacionDatos()
            .subscribe((cotizDatos) => {
                this.cotizacionDatos.cotizacion = cotizDatos;
                this.cotizacionDolarEditada = cotizDatos.cotizacion;
            });
    }

    ngAfterViewInit() {
        // Focus en input proveedor
        document.getElementById("inputProveedor")
            ? document.getElementById("inputProveedor").focus()
            : null;
    }

    ///////////////////////////////// Eventos OnClick /////////////////////////////////
    onCLickAdd = (prodSelect: ProductoPendiente) => {
        this.agregarElemento = true;
        return true;
    }
    onClickRemove = (prodSelect: ProductoPendiente) => {
        _.remove(this.tablas.datos.productosPend, (prod: ProductoPendiente) => {
            // return prod.producto.idProductos === prodSelect.producto.idProductos && prod.numero === prodSelect.numero;
            return prod.idFactDetalle === prodSelect.idFactDetalle;
        });

        _.remove(this.precioOriginal, (obj) => {
            // return prod.producto.idProductos === prodSelect.producto.idProductos && prod.numero === prodSelect.numero;
            return obj.idFactDetalle === prodSelect.idFactDetalle;
        });

        // Actualizo totales y eso
        this.actualizarDatosProductos();
    };

    onClickEdit = (tipoColumnas) => (itemSelect: any) => {
        this.tablas.columnas[tipoColumnas] = this.tablas.columnas[
            tipoColumnas
        ].map((tabla) => {
            let newTabla = tabla;
            if (newTabla.enEdicion !== undefined) {
                // tipoColumnas === 'columnasProductos' ? newTabla.enEdicion = itemSelect.producto.idProductos :
                // tipoColumnas === 'columnasProductos' ? newTabla.enEdicion = `${itemSelect.producto.idProductos}-${itemSelect.numero}` :
                // tipoColumnas === 'columnasTrazabilidad' ? newTabla.enEdicion = `${itemSelect.producto.idProductos}-${itemSelect.numero}` :
                tipoColumnas === "columnasProductos"
                    ? (newTabla.enEdicion = `${itemSelect.idFactDetalle}-${itemSelect.numero}`)
                    : tipoColumnas === "columnasTrazabilidad"
                    ? (newTabla.enEdicion = `${itemSelect.idFactDetalle}-${itemSelect.numero}`)
                    : tipoColumnas === "columnasFactura"
                    ? (newTabla.enEdicion = itemSelect.cuentaContable)
                    : tipoColumnas === "columnasDetallesFp"
                    ? (newTabla.enEdicion = itemSelect.idFormaPagoDet)
                    : null;
            }
            return newTabla;
        });

        // Hago focus en el select de imputacion
        setTimeout(() => {
            const idItem = itemSelect.cuentaContable
                ? itemSelect.cuentaContable
                : itemSelect.idFormaPagoDet
                ? itemSelect.idFormaPagoDet
                : // itemSelect.producto && itemSelect.producto.idProductos ? itemSelect.producto.idProductos : '000';
                // itemSelect.producto && itemSelect.producto.idProductos ? `${itemSelect.producto.idProductos}-${itemSelect.numero}` : '000';
                itemSelect.producto && itemSelect.idFactDetalle
                ? `${itemSelect.idFactDetalle}-${itemSelect.numero}`
                : "000";

            const inputFocusClass = "editar-focus-" + idItem;

            const elementFocus: any =
                document.getElementsByClassName(inputFocusClass);
            elementFocus && elementFocus[0] ? elementFocus[0].focus() : null;
        });

        // Cuando edita alguna forma de pago, se sugiere el Total Cte en monto

        if (tipoColumnas && tipoColumnas === "columnasDetallesFp") {
            itemSelect.monto = this.utilsService.parseDecimalNumber(
                this.cotizacionDatos.total + this.sumatoriaSubtotales
            );
        }
    };

    actualizarSumatoriaSubto = () => {
        this.sumatoriaSubtotales =
            this.comprobante &&
            this.comprobante.tipo &&
            this.comprobante.tipo.comprobante &&
            this.comprobante.tipo.comprobante.incluyeIva
                ? _.sumBy(this.tablas.datos.modelosFactura, (fact) =>
                      Number(fact.importeTotal) ? Number(fact.importeTotal) : 0
                  )
                : 0;
    };

    onClickConfirmCondiciones = () => {
        this.condicionesConfirmadas = true;
    };

    onClickCancelarCondiciones = () => {
        this.condicionesConfirmadas = false;
    };

    onClickConfirmAjuste = () => {
        const totalActual =
            this.cotizacionDatos.total + this.sumatoriaSubtotales;
        if (
            this.valorRealFactura &&
            totalActual > 0 &&
            this.valorRealFactura > 0
        ) {
            if (
                this.comprobante.moneda.idMoneda == 1 &&
                Math.abs(this.valorRealFactura - totalActual) < 10
            ) {
                this.tablas.datos.productosPend[0].importe +=
                    this.valorRealFactura - totalActual;
                this.tablas.datos.detallesFormaPago[0].monto +=
                    this.valorRealFactura - totalActual;
                this.actualizarDatosProductos(true);
                this.refreshMontoDetallesFormaPago(true);
                this.ajusteConfirmado = true;
                this.utilsService.showModal("Éxito")(
                    "El ajuste se realizó correctamente"
                )()();
            } else if (
                this.comprobante.moneda.idMoneda == 2 &&
                Math.abs(
                    this.valorRealFactura / this.cotizacionDolarEditada -
                        totalActual
                ) < 0.2
            ) {
                this.tablas.datos.productosPend[0].importe +=
                    this.valorRealFactura / this.cotizacionDolarEditada -
                    totalActual;
                this.tablas.datos.detallesFormaPago[0].monto +=
                    this.valorRealFactura / this.cotizacionDolarEditada -
                    totalActual;
                this.actualizarDatosProductos(true);
                this.refreshMontoDetallesFormaPago(true);
                this.ajusteConfirmado = true;
                this.utilsService.showModal("Éxito")(
                    "El ajuste se realizó correctamente"
                )()();
            } else {
                this.utilsService.showModal("Error")(
                    "La diferencia de totales es muy grande, contacte al gerente"
                )()();
            }
        } else {
            this.utilsService.showModal("Error")(
                "Complete todos los campos e ingrese productos para ajustar"
            )()();
        }
    };

    onClickCancelarAjuste = () => {
        this.ajusteConfirmado = false;
    };
   
    onClickConfirmEdit = (tipoColumnas) => (itemSelect: any) => {
        // Todos los atributos 'enEdicion' distintos de undefined y también distintos de null o false, los seteo en false
        this.tablas.columnas[tipoColumnas] = this.tablas.columnas[
            tipoColumnas
        ].map((tabla) => {
            let newTabla = tabla;
            if (newTabla.enEdicion !== undefined && newTabla.enEdicion) {
                // Seteo en false asi sale de edicion
                newTabla.enEdicion = false;
            }
            return newTabla;
        });

        // Hago la sumatoria de los subtotales de la factura
        if (tipoColumnas === "columnasFactura") {
            if (this.comprobante.moneda.idMoneda === 2) {
                itemSelect.importeArs =
                    itemSelect.importeTotal * this.cotizacionDolarEditada;
            }
            // Actualizo el Total Comprobante sumando todos los precios nuevamente (no le sumo directamente el precio editado porque no es un precio nuevo, sino que ya está y debería sumarle la diferencia editada nomás)
            this.actualizarSumatoriaSubto();
            this.refreshMontoDetallesFormaPago();
        }

        if (tipoColumnas === "columnasProductos") {
            // Cuando edita alguna cantidad, la cantidad no puede ser superior a la que esta cargada originalmente (salvo que sea = 0)

            /*if (this.estadoRelacionadoObligatorio == true) {
                if (itemSelect.pendiente > itemSelect.original) {
                    alert("Atención !!! No se puede modificar la cantidad del comprobante: El valor ingresado no puede ser mayor al valor Original")
                    itemSelect.pendiente = itemSelect.original;
                    itemSelect.importe = itemSelect.original * Number(itemSelect.precio)
                    this.estadoEdicionCantidadProducto = true;
                }
            } else {
               
            }*/

            this.estadoEdicionCantidadProducto = false;
            // Actualizo el importe si y solo si esta editando productos, y si el importe viene modificado
            // Si el importe es 0, es la primer edicion por lo que calculo el importe
            if (itemSelect.importe === 0) {
                itemSelect.importe =
                    itemSelect.pendiente * Number(itemSelect.precio);
            } else {
                // Si el importe es igual al importe previo, entonces el importe NO se editó, por lo que seguramte se editó la cantidad o el precio y debo recalcular el importe
                if (itemSelect.importe === itemSelect.auxPreviusImporte) {
                    itemSelect.importe =
                        itemSelect.pendiente * Number(itemSelect.precio);
                }
            }
            // Guardo el importe para usarlo en la proxima edicion
            itemSelect.auxPreviusImporte = itemSelect.importe;
            // Refresco detalles forma pago casos particulares [SOLO si la grilla es la de articulos]
            this.refreshMontoDetallesFormaPago();
        }

        // Actualizo datos del producto (si NO son las facturas lo que se edita)
        if (
            tipoColumnas !== "columnasFactura" &&
            tipoColumnas !== "columnasDetallesFp"
        ) {
            this.actualizarDatosProductos();
        }
    };

    /**
     * Busca los productos pendientes de acuerdo al comprobante relacionado
     */
    onClickBuscarPendientes = () =>
        this.comprobanteCompraService
            .buscarPendientes(this.proveedorSeleccionado)(
                this.comprobanteRelacionado
            )(this.comprobante)(this.tipoOpSelect)
            .subscribe(
                (prodsPend) => {
                    // Agrego los productos
                    // this.tablas.datos.productosPend = _.uniqWith(
                    //     this.tablas.datos.productosPend.concat(prodsPend),
                    //     (a:ProductoPendiente,b:ProductoPendiente) =>    a.producto.idProductos === b.producto.idProductos &&
                    //                                                     a.numero === b.numero
                    // );

                    // Borro los prods agregados anteriormente y los remplazo por estos que vienen acá
                    this.tablas.datos.productosPend = prodsPend;
                    for (
                        let i = 0;
                        i < this.tablas.datos.productosPend.length;
                        i++
                    ) {
                        this.precioOriginal.push({
                            idFactDetalle:
                                this.tablas.datos.productosPend[i]
                                    .idFactDetalle,
                            precio: this.tablas.datos.productosPend[i].precio,
                        });
                    }
                    this.tablas.datos.productosPend.forEach((item, index) => {
                        item.item = index;
                    });
                    console.log(this.tablas.datos.productosPend);

                    // Actualizo datos de los productos
                    this.actualizarDatosProductos();
                    this.refreshMontoDetallesFormaPago();
                },
                (error) => this.utilsService.decodeErrorResponse(error)
            );

    /**
     * Agrega el producto seleccionado a la lista de productosPendientes
     */
    onClickProductoLista = (prodSelec: ProductoReducido) => {
        // Busco el producto seleccionado

        this.comprobanteCompraService
            .buscarProducto(
                prodSelec.idProductos,
                this.comprobante.moneda.idMoneda
            )
            .subscribe((prodEnc) => {
                const auxProdSelect = Object.assign({}, prodEnc);

                // Seteo el nro del comprobante actual
                auxProdSelect.numero = this.utilsService.numeroObjectToString(
                    this.comprobante.numerador
                );

                // Checkeo que no exista
                const existeProd = this.tablas.datos.productosPend.find(
                    (prod) => prod.idFactDetalle === auxProdSelect.idFactDetalle
                    // prod => prod.producto.idProductos === auxProdSelect.producto.idProductos &&
                    //         prod.numero === auxProdSelect.numero
                );
                if (!existeProd) {
                    this.precioOriginal.push({
                        idFactDetalle: auxProdSelect.idFactDetalle,
                        precio: auxProdSelect.precio,
                    });
                    this.tablas.datos.productosPend.push(
                        this.cotizacionDolarEditada > 0 &&
                            auxProdSelect.producto.moneda.descripcion ===
                                "u$s" &&
                            this.comprobante.moneda.idMoneda === 1
                            ? {
                                  ...auxProdSelect,
                                  precio:
                                      (this.cotizacionDolarEditada *
                                          this.precioOriginal[
                                              this.precioOriginal.length - 1
                                          ].precio) /
                                      this.cotizacionDatos.cotizacion
                                          .cotizacion,
                              }
                            : auxProdSelect
                    );
                    this.actualizarDatosProductos();
                }

                // Despues de agregar el producto procedo a ponerlo en edición
                this.onClickEdit("columnasProductos")(auxProdSelect);
            });
    };

    onClickCancelar = () =>
        this.utilsService.showModal("Aviso")("¿Cancelar comprobante?")(() => {
            // Blanqueo los campos
            const auxFecha = this.comprobante.fechaComprobante;
            this.comprobante = new Comprobante();
            this.comprobante.fechaComprobante = auxFecha;
            this.comprobanteRelacionado = new ComprobanteRelacionado();
            this.proveedorSeleccionado = new Padron();
            this.tablas.datos.productosPend = [];
            this.precioOriginal = [];
            this.condicionesConfirmadas = false;
            this.pesificado = false;
            this.dolarizadoAlVto = false;
            this.ajusteConfirmado = false;
            this.valorRealFactura = null;
            this.valorCalculadoFactura = null;
            this.interesMensualCompra = 0.0;
            this.canjeInsumos = false;
            this.tipoCambio = "divisa";
            this.tablas.datos.modelosFactura = [];
            // this.cotizacionDatos = { cotizacion: new Cotizacion(), total: 0 };
            this.depositoSelec = new Deposito();
            this.tablas.datos.detallesFormaPago = [];
            this.cotizacionDolarEditada =
                this.cotizacionDatos.cotizacion.cotizacion;
        })({
            tipoModal: "confirmation",
        });

    /**
     * Valida que la fecha ingresada esté en el intervalo permitido por el numerador
     */
    fechaComprobanteInvalida = () =>
        this.comprobante.numerador &&
        this.comprobante.numerador.fechaApertura &&
        this.comprobante.numerador.fechaCierre &&
        !moment(
            this.utilsService.dateLikePickerToDate(
                this.comprobante.fechaComprobante
            )
        ).isBetween(
            moment(
                this.utilsService.dateLikePickerToDate(
                    this.comprobante.numerador.fechaApertura
                )
            ),
            moment(
                this.utilsService.dateLikePickerToDate(
                    this.comprobante.numerador.fechaCierre
                )
            ),
            "days",
            "[]"
        );

    /**
     * Valida y graba el comprobante
     */
    onClickConfirmar = () =>
        this.utilsService.showModal("Aviso")("¿Confirmar comprobante?")(() => {
            if (this.fechaComprobanteInvalida()) {
                // Y le aviso

                this.utilsService.showModal("Error de fecha")(
                    `Fecha inválida para este punto de venta (Intervalo permitido: ${moment(
                        this.utilsService.dateLikePickerToDate(
                            this.comprobante.numerador.fechaApertura
                        )
                    ).format("DD-MM-YYYY")} al ${moment(
                        this.utilsService.dateLikePickerToDate(
                            this.comprobante.numerador.fechaCierre
                        )
                    ).format("DD-MM-YYYY")})`
                )()();

                return;
            } else {
                // Spinner bar
                this.valueGuardandoCompro = 50;
   
                // Actualizo las facturas antes de confirmar
                this.comprobanteCompraService
                    .buscaModelos(
                        this.tablas.datos.productosPend,
                        this.comprobante.moneda
                            ? this.comprobante.moneda.idMoneda
                            : null,
                        this.proveedorSeleccionado.padronCodigo
                    )
                    .subscribe((modelProds) => {
                        // this.tablas.datos.modelosFactura = modelProds;
                        this.actualizarSumatoriaSubto();
                        this.comprobanteCompraService
                            .confirmarYGrabarComprobante(this.comprobante)(
                                this.comprobanteRelacionado
                            )(this.proveedorSeleccionado)(
                                this.tablas.datos.productosPend
                            )(this.tablas.datos.modelosFactura)(
                                this.cotizacionDolarEditada > 0
                                    ? {
                                          ...this.cotizacionDatos,
                                          cotizacion: {
                                              ...this.cotizacionDatos
                                                  .cotizacion,
                                              cotizacion:
                                                  this.cotizacionDolarEditada,
                                          },
                                      }
                                    : this.cotizacionDatos
                            )(this.depositoSelec)(
                                this.tablas.datos.detallesFormaPago
                            )(this.factura)(this.tipoOpSelect)(this.pesificado)(
                                this.dolarizadoAlVto
                            )(this.interesMensualCompra)(this.canjeInsumos)(
                                this.tipoCambio
                            )
                            .catch((err) => {
                                // Saco spinner
                                this.valueGuardandoCompro = 0;
                                return Observable.throw(null);
                            })
                            .subscribe((respuesta: any) => {
                                // Saco spinner
                                this.valueGuardandoCompro = 0;

                                // Modal para imprimir
                                const compCreado = new ComprobanteEncabezado();
                                compCreado.idFactCab =
                                    respuesta.datos.idFactCab;
                                compCreado.numero = Number(
                                    `${
                                        this.comprobante.numerador.ptoVenta
                                            .ptoVenta
                                    }${this.comprobante.numerador.ptoVenta.ptoVenta
                                        .toString()
                                        .padStart(8, "0")}`
                                );

                                this.utilsService.showImprimirModal(
                                    respuesta.control.codigo
                                )(respuesta.control.descripcion)(() =>
                                    this.recursoService.downloadComp(compCreado)
                                )(compCreado);
                                this.llamarFunction(compCreado.idFactCab);
                                // this.utilsService.showModal(respuesta.control.codigo)(respuesta.control.descripcion)()();

                                // Blanqueo los campos
                                const auxFecha =
                                    this.comprobante.fechaComprobante;
                                this.comprobante = new Comprobante();
                                this.comprobante.fechaComprobante = auxFecha;
                                this.comprobanteRelacionado =
                                    new ComprobanteRelacionado();
                                this.proveedorSeleccionado = new Padron();
                                this.tablas.datos.productosPend = [];
                                this.precioOriginal = [];
                                this.condicionesConfirmadas = false;
                                this.pesificado = false;
                                this.dolarizadoAlVto = false;
                                this.interesMensualCompra = 0.0;
                                this.canjeInsumos = false;
                                this.ajusteConfirmado = false;
                                this.valorRealFactura = null;
                                this.valorCalculadoFactura = null;
                                this.tipoCambio = "divisa";
                                this.tablas.datos.modelosFactura = [];
                                // this.cotizacionDatos = { cotizacion: new Cotizacion(), total: 0 };
                                this.cotizacionDatos.total = 0;
                                this.sumatoriaSubtotales = 0;
                                // this.depositoSelec = new Deposito()
                                this.depositoSelec = null;
                                this.tablas.datos.detallesFormaPago = [];
                                this.cotizacionDolarEditada =
                                    this.cotizacionDatos.cotizacion.cotizacion;
                                // Refresco formas pago
                                this.dataTablaFormasPago =
                                    this.recursoService.getRecursoList(
                                        resourcesREST.formaPago
                                    )({
                                        codPadron: this.proveedorSeleccionado
                                            ? this.proveedorSeleccionado
                                                  .padronCodigo
                                            : null,
                                        idSisModulo: sisModulos.compra,
                                    });
                                // this.dataTablaFormasPago = null;

                                // this.tipoOpSelect = new SisTipoOperacion();
                                this.tipoOpSelect = null;

                                // Focus en input proveedor (TODO SET TIME OUT)
                                document.getElementById("inputProveedor")
                                    ? document
                                          .getElementById("inputProveedor")
                                          .focus()
                                    : null;
                            });
                    });
            }
        })({
            tipoModal: "confirmation",
        });

    ///////////////////////////////// Eventos (Distintos de onclick) /////////////////////////////////

    /**
     * Actualiza el total en cotizacion y los modelosFactura
     */
    llamarFunction = (idFactCab) => {
        this.comprobanteService.mandaMailPdf(idFactCab);
    };
    actualizarDatosProductos = (evitarSubtotal?) => {
        // Si tipoComprobante no incluye neto, el total es 0
        this.cotizacionDatos.total = this.comprobante.tipo.comprobante
            .incluyeNeto
            ? _.sumBy(this.tablas.datos.productosPend, (prod) =>
                  Number(prod.importe) ? Number(prod.importe) : 0
              )
            : 0;

        // Busco las facturas de los productos
        if (!evitarSubtotal) {
            if (
                this.tablas.datos.productosPend &&
                this.tablas.datos.productosPend.length > 0
            ) {
                this.comprobanteCompraService
                    .buscaModelos(
                        this.tablas.datos.productosPend,
                        this.comprobante.moneda
                            ? this.comprobante.moneda.idMoneda
                            : null,
                        this.proveedorSeleccionado.padronCodigo
                    )
                    .subscribe((modelProds) => {
                        this.tablas.datos.modelosFactura = modelProds;
                        this.tablas.datos.modelosFactura =
                            this.tablas.datos.modelosFactura.map((element) => {
                                return (element = {
                                    ...element,
                                    importeArs:
                                        this.comprobante.moneda.idMoneda === 2
                                            ? element.importeTotal *
                                              this.cotizacionDolarEditada
                                            : element.importeTotal,
                                });
                            });
                        this.actualizarSumatoriaSubto();
                    });
            } else {
                this.tablas.datos.modelosFactura = [];
                this.sumatoriaSubtotales = 0;
            }
        }
    };

    /**
     * Evento change del input del proovedor
     */
    onChangeInputProveedor = (busqueda) => {
        this.proveedorSeleccionado = new Padron();

        if (busqueda && busqueda.length >= 2) {
            this.findProveedores(busqueda);
        }

        // Reseteo el indice
        this.proveedorEnfocadoIndex = -1;
    };

    buscandoProveedor = false;

    findProveedores = _.throttle((busqueda) => {
        this.buscandoProveedor = true;
        this.proveedores.filtrados.next([]);

        this.recursoService
            .getRecursoList(resourcesREST.padron)({
                grupo: gruposParametros.proveedor,
                elementos: busqueda,
            })
            .subscribe((proveedores) => {
                this.proveedores.filtrados.next(proveedores);
                this.buscandoProveedor = false;
            });
    }, 400);

    /**
     * El blur es cuando se hace un leave del input (caundo se apreta click afuera por ejemplo).
     * Acá lo que hago es poner un array vacio como próx valor de los filtrados, cosa que la lista desaparezca porque no hay nada
     * También retorno el proveedor seleccionado en el input
     */
    onBlurInputProv = (e) => {
        // Actualizo proveedor seleccionado
        try {
            if (
                this.proveedorSeleccionado &&
                this.proveedorSeleccionado.padronCodigo
            ) {
                this.proveedorSeleccionado =
                    this.proveedores.filtrados.value.find(
                        (prov) =>
                            prov.padronCodigo ===
                            Number(this.proveedorSeleccionado.padronCodigo)
                    );

                // Lo busco en la base de facturacion
                this.comprobanteCompraService
                    .checkIfProvExistInFacturacion(this.proveedorSeleccionado)
                    .then((resp) => {
                        // Si pasa, todo ok
                        // debugger;
                    })
                    .catch((err) => {
                        // Si NO lo encuentra, le pido que lo cree
                        this.utilsService.showModal("Aviso")(
                            "Proveedor no existente en nuestra base. ¿Desea crearlo?"
                        )(() => {
                            this.router.navigate(
                                ["/pages/tablas/proveedores/nuevo"],
                                {
                                    queryParams: {
                                        // codPadronCliente: clienteExistente.padronCodigo
                                    },
                                }
                            );
                        })({ tipoModal: "confirmation" }, () => {
                            // this.dataVendedor = {
                            //     vendedor: new Vendedor(),
                            //     incluir: false
                            // };
                        });
                    });
            }

            // Vacio filtrados
            this.proveedores.filtrados.next([]);
        } catch (err) {
            // Muestro error
            if (err && err.nombre && err.descripcion) {
                this.utilsService.showModal(err.nombre)(err.descripcion)()();
            }
            // Vacio proveedor seleccionado
            this.proveedorSeleccionado = new Padron();
        }
    };

    /**
     * Setea la fecha de compra calculandola dado un string en formato 'ddmm', parseando a 'dd/mm/aaaa'
     */
    onCalculateFecha = (e) => (keyFecha) => (objetoContenedor) => {
        // Si selecciona en el datePicker (el evento es una fecha de datelikepiker)
        if (e && e.day && e.month) {
            const fechaLikePicker = new DateLikePicker(null, e);

            if (keyFecha === "fechaComprobante") {
                this[objetoContenedor][keyFecha] = fechaLikePicker;
            }
        }

        if (
            !this[objetoContenedor][keyFecha] ||
            (typeof this[objetoContenedor][keyFecha] !== "string" &&
                !this[objetoContenedor][keyFecha].day &&
                !this[objetoContenedor][keyFecha].month)
        )
            return;

        // La guardo
        this[objetoContenedor][keyFecha] =
            this.utilsService.stringToDateLikePicker(
                this[objetoContenedor][keyFecha]
            );

        // Hago focus en el prox input
        // (keyFecha==='fechaComprobante') || (keyFecha==='fechaContable') ?
        //     document.getElementById(`fechaVto${this.utilsService.upperFirstLetter(objetoContenedor)}`).focus() : null;
    };

    /**
     * Evento blur de pto venta y numero en comprobante
     * tipo: puntoVenta o numero
     * keyTipoe: comprobante, comprobanteRelacionado
     */
    onBlurNumeroAutocomp = (e) => (tipo: string) => (keyTipo: string) =>
        (this[keyTipo][tipo] = this.comprobanteCompraService.autocompNroComp(
            tipo
        )(this[keyTipo]));

    /**
     * Actualizo el deposito seleccionado que me viene de tablaIngreso
     */
    onSelectDeposito = (depSelect: Deposito) => {
        this.depositoSelec = depSelect;
    };

    /**
     * Evento de cuando se apreta felcha arriba o feclah abajo en input de busca proveedor
     */
    keyPressInputTexto = (e: any) => (upOrDown) => {
        e.preventDefault();
        // Hace todo el laburo de la lista popup y retorna el nuevo indice seleccionado
        this.proveedorEnfocadoIndex =
            this.popupListaService.keyPressInputForPopup(upOrDown)(
                this.proveedores.filtrados.value
            )(this.proveedorEnfocadoIndex);
    };

    /**
     * Evento on enter en el input de buscar proveedor
     */
    onEnterInputProv = (e: any) => {
        e.preventDefault();
        this.proveedores.filtrados.subscribe((provsLista) => {
            // Busco el producto
            const provSelect =
                provsLista && provsLista.length
                    ? provsLista[this.proveedorEnfocadoIndex]
                    : null;
            // Lo selecciono
            provSelect ? this.popupLista.onClickListProv(provSelect) : null;
            // Reseteo el index
            this.proveedorEnfocadoIndex = -1;
        });
    };

    /**
     * Agrega o elimina una forma pago de las seleccionadas. Tambien muestra detalle de la lista correspondiente
     */
    handleFormaPagoSelec = (fp: FormaPago) => (tipoOperacion: string) => {
        // Agrego o elimino
        if (tipoOperacion === "add") {
            // Primero los borro (si quedaorn de anbtes)
            this.formasPagoSeleccionadas = this.formasPagoSeleccionadas.filter(
                (fpSelec) => fpSelec.idFormaPago !== fp.idFormaPago
            );
            // Ahora los agrego
            this.formasPagoSeleccionadas.push(fp);
        } else {
            this.formasPagoSeleccionadas = this.formasPagoSeleccionadas.filter(
                (fpSelec) => fpSelec.idFormaPago !== fp.idFormaPago
            );
        }

        // Ahora mappeo los detalles de las formas de pago seleccionadas para mostrarlos en la grilla de el medio
        this.tablas.datos.detallesFormaPago = this.formasPagoSeleccionadas

            .map((fp) =>
                Object.assign([], fp.detalles).map((det) => {
                    const auxDet: DetalleFormaPago = Object.assign({}, det);
                    auxDet.formaPagoDescrip = fp.descripcion;

                    return auxDet;
                })
            )
            .reduce((a, b) => [...a].concat([...b]), []); // Aca aplasto el array bidimensional a uno de una dimensión

        // Caso especial: La forma de pago seleccionada es contado, por lo que detalles va a ser length === 1. Entonces le sugieron que el monto a pagar sea el mismo que el resto a pagar
        this.refreshMontoDetallesFormaPago();
    };

    /**
     * Refresca el monto. Es un caso particular
     */
    refreshMontoDetallesFormaPago = (noCambiarOriginal?) => {
        if (
            this.tablas.datos.detallesFormaPago &&
            this.tablas.datos.detallesFormaPago.length === 1
        ) {
            // Esto es un horror, pero me da paja mejorarlo
            setTimeout(() => {
                const auxDetalleMutado = Object.assign(
                    {},
                    this.tablas.datos.detallesFormaPago[0]
                );

                auxDetalleMutado.monto =
                    this.cotizacionDatos.total + this.sumatoriaSubtotales;
                const nuevosDetalles = [auxDetalleMutado];
                this.tablas.datos.detallesFormaPago = nuevosDetalles;
                if (!noCambiarOriginal) {
                    this.valorCalculadoFactura = 0;
                    this.tablas.datos.detallesFormaPago.forEach((detalle) => {
                        this.valorCalculadoFactura += detalle.monto;
                    });
                }
                // debugger;
            }, 1000);
        }
    };

    /* verificoRelacionadoObligatorio = Si comprobantes relacionadoObligatorio esta en true, no dejo que se puedan agregar articulos porque 
      se toman desde los comprobantes relacionados ya cargados (ejemplo remitos)
    */
    verificoRelacionadoObligatorio = (val: Boolean) => {
        if (val == true) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * Evento cuando cambio cteTipo en comprobante
     */
    onChangeCteTipo = (cteTipoSelect: TipoComprobante) => {
        this.tiposComprobantesRel = this.recursoService.getRecursoList(
            resourcesREST.cteTipo
        )({
            sisModulo: sisModulos.compra,
            idCteTipo: cteTipoSelect.idCteTipo,
            sisTipoOperacion: this.tipoOpSelect.idSisTipoOperacion,
        });
        this.tituloCardComprobante =
            "COMPROBANTE: " + cteTipoSelect.descripcion;
        this.comprobante.numerador = new Numerador();
        if (cteTipoSelect.comprobante.relacionadoObligatorio == true) {
            this.estadoRelacionadoObligatorio = true;
        } else {
            this.estadoRelacionadoObligatorio = false;
        }

        // Actualizo total cotizacion (si no incluye neto, es 0)
        // this.cotizacionDatos.total =
        //     this.comprobante.tipo.comprobante.incluyeNeto ?
        //         _.sumBy(
        //             this.tablas.datos.productosPend,
        //             (prod) => Number(prod.importe) ? Number(prod.importe) : 0
        //         ) : 0;

        // // Actualizo sumatoria subtotales
        // this.actualizarSumatoriaSubto();

        // Blanqueo todo lo que le sigue
        this.comprobanteRelacionado = new ComprobanteRelacionado();
        this.tablas.datos.productosPend = [];
        this.precioOriginal = [];
        this.tablas.datos.modelosFactura = [];
        this.tablas.datos.detallesFormaPago = [];
        this.pesificado = false;
        this.condicionesConfirmadas = false;
        this.dolarizadoAlVto = false;
        this.interesMensualCompra = 0.0;
        this.canjeInsumos = false;
        this.tipoCambio = "divisa";
        // Limpio formas pago
        // this.dataTablaFormasPago = null;
        // this.formasPagoSeleccionadas = [];

        // Limpio cotizacion datos
        this.cotizacionDatos.total = 0;
        this.sumatoriaSubtotales = 0;

        // Actualizo monedas
        this.monedas.next(cteTipoSelect.comprobante.monedas);
    };

    // HARD Codign Exxxxtreme
    compareFnMonedas = (m1: Moneda, m2: Moneda) =>
        m1 && m2 ? m1.idMoneda === m2.idMoneda : m1 === m2;
    // m1 ? m1.idMoneda === 1 : false

    /**
     * Busca facturas
     */
    fetchFacturas = () => {
        // Busco las facturas de los productos
        this.comprobanteCompraService
            .buscaModelos(
                this.tablas.datos.productosPend,
                this.comprobante.moneda
                    ? this.comprobante.moneda.idMoneda
                    : null,
                this.proveedorSeleccionado.padronCodigo
            )
            .subscribe((modelProds) => {
                this.tablas.datos.modelosFactura = modelProds;
                this.tablas.datos.modelosFactura =
                    this.tablas.datos.modelosFactura.map((element) => {
                        return (element = {
                            ...element,
                            importeArs:
                                this.comprobante.moneda.idMoneda === 2
                                    ? element.importeTotal *
                                      this.cotizacionDolarEditada
                                    : element.importeTotal,
                        });
                    });
                this.actualizarSumatoriaSubto();
            });
    };

    /**
     * Cuyando cambia el tipo operacion se actualizan los tipos comprobantes
     */
    onChangeTipoOperacion = (tipoOpSelect: SisTipoOperacion) => {
        this.depositosAMostrar = [];
        this.tiposComprobantes = this.recursoService.getRecursoList(
            resourcesREST.cteTipo
        )({
            sisTipoOperacion: tipoOpSelect.idSisTipoOperacion,
            sisSitIva:
                this.proveedorSeleccionado && this.proveedorSeleccionado.condIva
                    ? this.proveedorSeleccionado.condIva.descCorta
                    : null,
        });
        //this.depositosAMostrar = this.depositosFiltrados.map(tiposOpDepositos => tiposOpDepositos.idSisTipoOperacion == tipoOpSelect.idSisTipoOperacion);
        for (let i = 0; i < this.allDepositos.length; i++) {
            if (
                _.includes(
                    this.filtro[tipoOpSelect.idSisTipoOperacion],
                    this.allDepositos[i].idDeposito
                )
            ) {
                this.depositosAMostrar.push(this.allDepositos[i]);
            }
        }
        if (this.depositosAMostrar.length === 0) {
            this.depositosAMostrar = this.allDepositos;
        }
        /*this.depositos = this.recursoService.getRecursoList(resourcesREST.depositos)({
            todos: tipoOpSelect.depositoDestino
        });*/

        this.limpioComprobanteYGrilla();
    };

    limpioComprobanteYGrilla = () => {
        // Limpio grillas y datos comprobante
        this.comprobante = new Comprobante();
        this.comprobanteRelacionado = new ComprobanteRelacionado();
        this.tablas.datos.productosPend = [];
        this.precioOriginal = [];
        this.pesificado = false;
        this.condicionesConfirmadas = false;
        this.dolarizadoAlVto = false;
        this.interesMensualCompra = 0.0;
        this.canjeInsumos = false;
        this.tipoCambio = "divisa";
        this.tablas.datos.modelosFactura = [];
        this.cotizacionDatos.total = 0;
        this.sumatoriaSubtotales = 0;
        this.depositoSelec = null;
        this.tablas.datos.detallesFormaPago = [];
        this.cotizacionDolarEditada =
            this.cotizacionDatos.cotizacion.cotizacion;

        // Refresco formas pago
        this.dataTablaFormasPago = this.recursoService.getRecursoList(
            resourcesREST.formaPago
        )({
            codPadron: this.proveedorSeleccionado
                ? this.proveedorSeleccionado.padronCodigo
                : null,
            idSisModulo: sisModulos.compra,
        });
    };

    /**
     * Checkea si el resto a pagar es valido
     */
    isRestoPagarValid = () => {
        if (this.comprobante.tipo.requiereFormaPago) {
            /*
             * El importe no es valido si es CERO y No se permite importe cero
             */
            const importeCeroValido =
                this.comprobante &&
                this.comprobante.tipo &&
                this.comprobante.tipo.comprobante &&
                this.cotizacionDatos.total + this.sumatoriaSubtotales === 0 &&
                this.comprobante.tipo.comprobante.permiteImporteCero;
            return (
                importeCeroValido ||
                this.calcRestoPagar() === "0.00" ||
                this.calcRestoPagar() === "0"
            );
        } else {
            return true;
        }
    };

    /**
     * Calcula el resto pagar
     */
    calcRestoPagar = () => {
        const sumMontos = _.sumBy(
            this.tablas.datos.detallesFormaPago,
            (fPago) => (Number(fPago.monto) ? Number(fPago.monto) : 0)
        );
        // Los paréntesis son ilustrativos, ya sabemos que la suma es asociativa y conmutativa
        let restoPagar = this.utilsService.toLocateString2(
            Number(
                this.cotizacionDatos.total +
                    this.sumatoriaSubtotales -
                    sumMontos
            ).toFixed(2)
        );
        /*console.log(restoPagar);
        restoPagar = parseFloat(restoPagar);
        console.log(restoPagar);*/
        return restoPagar === "-0.00" ? "0.00" : restoPagar;
    };

    // onBlurNumeroCteRelacionado = (evento) => {
    //     this.onBlurNumeroAutocomp(evento)('numero')('comprobanteRelacionado')

    //     // Focus en input para agregar producto
    //     document.getElementById('addInput') ? document.getElementById('addInput').focus() : null
    // }

    onBlurOrEnterFechaVtoComp = ($event) => {
        this.onCalculateFecha($event)("fechaVto")("comprobante");

        // Hago foco en el primer checbkox de la sformas de pago (el timeout es necesario para que espere a que se haga la consulta)
        // en gral esta consulta dura poquito (entre 10 y 40 milisegundos). Por eso con 150 milisegundos de espera es mas que suficiente
        setTimeout(() => {
            // Hago focus al siguiente elemento (la lista de forma pagos, primer elemento)
            const primerCheckBoxFp: any = document.getElementById("fp-check-0");
            if (primerCheckBoxFp) {
                // primerCheckBoxFp.checked = true;
                primerCheckBoxFp.focus();
            }
        }, 150);
    };

    /**
     * En seleccionado por defectp giardp ptoventa y numerador
     */
    onChangePtoVentaNro = (selectNumerador: Numerador) => {
        // this.comprobante.fechaComprobante = new DateLikePicker(
        //     new Date(selectNumerador.fechaApertura)
        // );
    };

    // ngIfNumeradorComprobante = () => {
    //     if (
    //         !(
    //             this.comprobante &&
    //             this.comprobante.letraCodigo &&
    //             this.comprobante.letraCodigo.numeradores &&
    //             this.comprobante.letraCodigo.numeradores.length > 0
    //         )
    //     ) {
    //         if (!this.comprobante.numerador || !this.comprobante.numerador.ptoVenta) {
    //             if (!this.comprobante.numerador) {
    //                 this.comprobante.numerador = new Numerador();
    //             }
    //             this.comprobante.numerador.ptoVenta = new PtoVenta();
    //         }
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    // ngIfNumeradorFactura = () => {
    //     if (
    //         !(
    //             this.factura &&
    //             this.factura.letraCodigo &&
    //             this.factura.letraCodigo.numeradores &&
    //             this.factura.letraCodigo.numeradores.length > 0
    //         )
    //     ) {
    //         if (!this.factura.numerador) {
    //             this.factura.numerador = new Numerador();
    //         }
    //         if (!this.factura.numerador.ptoVenta) {
    //             this.factura.numerador.ptoVenta = new PtoVenta();
    //         }
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    onBlurPtoVenta = (e) =>
        this.utilsService.onBlurInputNumber(e) &&
        this.comprobante.numerador &&
        this.comprobante.numerador.ptoVenta
            ? (this.comprobante.numerador.ptoVenta.ptoVenta =
                  this.comprobante.numerador.ptoVenta.ptoVenta.padStart(4, "0"))
            : null;

    onBlurNumerador = (e) =>
        this.utilsService.onBlurInputNumber(e) &&
        this.comprobante.numerador &&
        this.comprobante.numerador.numerador
            ? (this.comprobante.numerador.numerador =
                  this.comprobante.numerador.numerador.padStart(8, "0"))
            : null;

    onBlurPtoVentaCteRel = (e) =>
        this.utilsService.onBlurInputNumber(e) &&
        this.comprobanteRelacionado.puntoVenta
            ? (this.comprobanteRelacionado.puntoVenta =
                  this.comprobanteRelacionado.puntoVenta.padStart(4, "0"))
            : null;

    onBlurNumeradorCteRel = (e) =>
        this.utilsService.onBlurInputNumber(e) &&
        this.comprobanteRelacionado.numero
            ? (this.comprobanteRelacionado.numero =
                  this.comprobanteRelacionado.numero.padStart(8, "0"))
            : null;

    onChangeLetra = (letraSelect: LetraCodigo) =>
        (this.comprobante.numerador =
            letraSelect &&
            letraSelect.numeradores &&
            letraSelect.numeradores.length > 0
                ? letraSelect.numeradores[0]
                : null);

    /**
     * Deshabilita btn grabar de acuerdo a diferentes parámetors
     */
    isDisabledConfirm = () => {
        // const auxPermiteImporteCero = this.comprobante.tipo && this.comprobante.tipo.comprobante ?
        //     this.comprobante.tipo.comprobante.permiteImporteCero : false;

        const datosNoValidos =
            !this.comprobanteCompraService.checkIfDatosValidosComprobante(
                this.comprobante
            )(this.proveedorSeleccionado)(this.tablas.datos.productosPend)(
                this.tablas.datos.modelosFactura
            )(this.depositoSelec);

        // Si permite importe cero, la forma de pago NO se controla (por eso retorno false)

        const formaPagoNoValido =
            this.comprobante &&
            this.comprobante.tipo &&
            this.comprobante.tipo.requiereFormaPago &&
            (!this.tablas.datos.detallesFormaPago ||
                this.tablas.datos.detallesFormaPago.length <= 0);

        const restoPagarNoValido =
            this.tablas.datos.detallesFormaPago &&
            this.tablas.datos.detallesFormaPago.length > 0 &&
            !this.isRestoPagarValid();

        const noPermiteImporteCero =
            this.cotizacionDatos &&
            this.comprobante.tipo &&
            this.comprobante.tipo.comprobante &&
            this.cotizacionDatos.total + this.sumatoriaSubtotales === 0 &&
            !this.comprobante.tipo.comprobante.permiteImporteCero;

        const condicionesComercializacionNoValidas =
            this.comprobante &&
            this.comprobante.tipo &&
            this.comprobante.tipo.comprobante &&
            this.comprobante.tipo.comprobante.idSisComprobantes == 4
                ? !this.condicionesConfirmadas
                : false;
        return (
            datosNoValidos ||
            restoPagarNoValido ||
            formaPagoNoValido ||
            noPermiteImporteCero ||
            condicionesComercializacionNoValidas
        );
    };

    onChangeCotDolar = () => {
        if (
            this.tablas.datos.productosPend &&
            this.tablas.datos.productosPend.length > 0 &&
            this.cotizacionDolarEditada > 0 &&
            this.comprobante.moneda.idMoneda != 2
        ) {
            let tablaProductos: ProductoPendiente[] =
                this.tablas.datos.productosPend.map((element, i) => {
                    if (
                        element.moneda === "u$s" ||
                        element.producto.moneda.descripcion === "u$s"
                    ) {
                        let nuevoPrecio =
                            (this.cotizacionDolarEditada *
                                this.precioOriginal[i].precio) /
                            this.cotizacionDatos.cotizacion.cotizacion;
                        return {
                            ...element,
                            precio: nuevoPrecio,
                            importe: nuevoPrecio * element.pendiente,
                        };
                    } else {
                        return element;
                    }
                });
            this.tablas.datos.productosPend = tablaProductos;
            this.actualizarDatosProductos();
        }
        if (this.comprobante.moneda.idMoneda === 2) {
            for (let i = 0; i < this.tablas.datos.modelosFactura.length; i++) {
                this.tablas.datos.modelosFactura[i].importeArs =
                    this.tablas.datos.modelosFactura[i].importeTotal *
                    this.cotizacionDolarEditada;
            }
        }
    };

    public onMonedaChange = (event) => {
        if (event.idMoneda === 2) {
            this.tablas.columnas.columnasFactura =
                this.comprobanteCompraService.getColumnsFacturaDolares();
        } else {
            this.tablas.columnas.columnasFactura =
                this.comprobanteCompraService.getColumnsFactura();
        }
    };
}
