import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import {
    Headers,
    Http,
    Request,
    RequestOptions,
    RequestOptionsArgs,
    RequestMethod,
    ResponseContentType,
} from "@angular/http";

// Libreria para encriptar en MD5 la clave
import * as crypto from "crypto-js";

// Operadores del observablke. Si no importo esto tira un error.
import "rxjs/add/operator/map";
import "rxjs/add/operator/timeout";
import "rxjs/add/operator/toPromise";

import { resourcesREST } from "constantes/resoursesREST";

import { FiltroListaPrecios } from "../models/filtroListaPrecio";
import { DetalleProducto } from "../models/detalleProducto";
import { Padron } from "../models/padron";
import { ProductoBuscaModelo } from "app/models/productoBuscaModelo";
import { Comprobante } from "app/models/comprobante";
import { ComprobanteRelacionado } from "../models/comprobanteRelacionado";

import { Cotizacion } from "app/models/cotizacion";
import { ProductoPendiente } from "app/models/productoPendiente";
import { ModeloFactura } from "app/models/modeloFactura";
import { Deposito } from "../models/deposito";
import { SisModulo } from "../models/sisModulo";
import { Producto } from "../models/producto";
import { SisEstado } from "../models/sisEstado";
import { TipoComprobante } from "app/models/tipoComprobante";
import { DateLikePicker } from "app/models/dateLikePicker";
import { UtilsService } from "./utilsService";
import { SisCanje } from "../models/sisCanje";
import { DetalleFormaPago } from "app/models/detalleFormaPago";
import { Rubro } from "../models/rubro";
import { SubRubro } from "../models/subRubro";
import { FormaPago } from "app/models/formaPago";
import { Factura } from "app/models/factura";
import { ModeloDetalle } from "../models/modeloDetalle";
import sisModulos from "constantes/sisModulos";
import { Lote } from "app/models/lote";
import sisTipoModelos from "../../constantes/sisTipoModelos";
import { SisTipoOperacion } from "../models/sisTipoOperacion";
import { Cliente } from "../models/cliente";
import { Vendedor } from "app/models/vendedor";
import { ListaPrecio } from "app/models/listaPrecio";
import { ComprobanteEncabezado } from "app/models/comprobanteEncabezado";
import { Observable } from "rxjs";
import { Contrato } from "app/models/contrato";
import { RelacionCanje } from "app/models/relacionCanje";
import { RecursoService } from "./recursoService";
import { LocalStorageService } from "./localStorageService";
import { Versionado } from "app/models/versionado";
import {
    FiltroComprobantePago,
    FiltroOrdenPago,
    GrabarOrdenesPago,
} from "app/models/comprobantes-pago";
import { filter } from "jszip";

@Injectable()
export class AuthService {
    constructor(
        private http: Http,
        public utilsService: UtilsService,
        private localStorageService: LocalStorageService
    ) {}

    /**
     * @description Método general para hacer una request
     * @argument pathParams
     * @argument method
     * @argument headers
     * @argument endPoint
     */
    private request(
        pathParams: string[],
        method: RequestMethod,
        headers: any,
        endPoint: string,
        body: any,
        queryParams: any,
        notJson = false,
        factElectronica = false
    ) {
    
        // Creo los headerss
        let auxHeaders: Headers = new Headers(headers);
        auxHeaders.append("Content-Type", "application/json");

        // Creo la url
        let url: string;

        // Si tiene pathParams los agrego a la url
        if (pathParams.length > 0) {
            // Creo string con los pathParams (parametros en la url)
            let pathParamString = pathParams
                .map((param) => {
                    return param;
                })
                .join("/");
            url = `${
                factElectronica
                    ? environment.facturacionRest.urlFactElectronica
                    : environment.facturacionRest.urlBase
            }/${endPoint}/${pathParamString}`;
        } else {
            // sin pathParams
            url = `${
                factElectronica
                    ? environment.facturacionRest.urlFactElectronica
                    : environment.facturacionRest.urlBase
            }/${endPoint}`;
        }

        // Creo el string que voy a adjuntar a la url al final, el mismo comienza con un ?
        let queryParamsString = "?";

        // Agrego los parámetors
        Object.keys(queryParams).forEach((keyQuery) => {
            queryParamsString = `${queryParamsString}&${keyQuery}=${queryParams[keyQuery]}`;
        });

        // Si se agregó algún parámetro, entonces lo adjunto a la url
        if (queryParamsString != "?") {
            url = `${url}${queryParamsString}`;
        }

        // opciones de consulta
        var opciones: RequestOptionsArgs = {
            url: url,
            method: method,
            search: null,
            headers: auxHeaders,
            body:
                Object.keys(body).length === 0 && body.constructor === Object
                    ? null
                    : JSON.stringify(body),
            responseType: notJson
                ? ResponseContentType.ArrayBuffer
                : ResponseContentType.Json,
        };

        var reqOptions = new RequestOptions(opciones);
        var req = new Request(reqOptions);

        return this.http
            .request(req)
            .timeout(environment.facturacionRest.timeoutDefault)
            .map((res) => {
                return notJson ? res : res.json();
            });
    }

    /**
     * Autoriza un comprobante de venta en AFIP
     */
    autorizarAfip = (token, tipo, idFactCab, idFactCabAsoc?) => {
        return this.request(
            [],
            RequestMethod.Post,
            { token },
            resourcesREST.facturacionElectronica.nombre,
            {
                idFactCab,
                idFactCabAsoc,
            },
            {
                tipo,
            }, // "tipo": "ultimoAutorizado" // solicitarCae
            false,
            true // Fact electronica activada
        );
    };

    /**
     * @description Se loguea y genera un token.
     * @argument usuario
     * @argument clave
     */
    login = (usuario: string) => (clave: string) => {
        return this.request(
            [usuario],
            RequestMethod.Post,
            {
                clave: crypto.MD5(clave),
                //clave: ' ' + clave
            },
            "usuarios",
            {},
            {}
        ).toPromise();
    };

   

    /**
     * @description Obtiene una lista de productos filtrados
     * @argument token
     * @argument filtros Lo filtro
     */
    getProductosByFiltro = (token: string) => (filtros: FiltroListaPrecios) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.filtroListaPrecios.nombre,
            {
                codProdDesde:
                    filtros.codProdDesde !== "" ? filtros.codProdDesde : null,
                codProdHasta:
                    filtros.codProdHasta !== "" ? filtros.codProdHasta : null,
                codProvedor: filtros.codProvedor,
                rubro: filtros.rubro.idRubro,
                subRubro: filtros.subRubro.idSubRubro,
                porcentajeCabecera: filtros.porcentajeCabecera,
                // cotaInfPorce: filtros.cotaInfPorce,
                // cotaSupPorce: filtros.cotaSupPorce,
                porcentajeInf: filtros.cotaInfPorce,
                porcentajeSup: filtros.cotaSupPorce,
                idMoneda: filtros.moneda.idMoneda,
            },
            {}
        );
    };

    /**
     * @description Obtiene productos pendientes
     * @argument token
     * @argument filtros Lo filtro
     */
    getProductosPendientes =
        (token: string) =>
        (proveedor: Padron) =>
        (comproRel: ComprobanteRelacionado) =>
        (comprobante: Comprobante) =>
        (tipoOpSelect: SisTipoOperacion) =>
        (listaPrecioSelect: ListaPrecio) =>
        (modulo) =>
        (diferenciaFechas?) =>
        (codigoCereal?) =>
        (esCanje?) =>
        (esPesificado?) => {
            return this.request(
                [],
                RequestMethod.Post,
                {
                    token: token,
                },
                resourcesREST.buscaPendientes.nombre,
                {
                    cteTipo: comproRel.tipo.idCteTipo,
                    facNumero: comproRel.todosLosPendientes
                        ? 0
                        : Number(comproRel.puntoVenta + comproRel.numero),
                    codigoProv: proveedor ? Number(proveedor.padronCodigo) : 0,
                    // pendiente : comproRel.todosLosPendientes ? 1 : 0,
                    pendiente: 1,
                    idProducto: 0,
                    idDeposito: 0,
                    despacho: "",
                    idMoneda:
                        comprobante && comprobante.moneda
                            ? comprobante.moneda.idMoneda
                            : 1,
                    idSisOperacionComprobante:
                        comprobante &&
                        comprobante.tipo &&
                        comprobante.tipo.comprobante
                            ? comprobante.tipo.comprobante
                                  .idSisOperacionComprobante
                            : null,
                    letra:
                        comprobante.letraCodigo && comprobante.letraCodigo.letra
                            ? comprobante.letraCodigo.letra.letra
                            : null,
                    idSisTipoOperacion:
                        tipoOpSelect && tipoOpSelect.idSisTipoOperacion
                            ? tipoOpSelect.idSisTipoOperacion
                            : 0,
                    // tipoOpSelect.idSisTipoOperacion : null,
                    idListaPrecio:
                        listaPrecioSelect && listaPrecioSelect.idListaPrecio
                            ? listaPrecioSelect.idListaPrecio
                            : 0,
                    modulo,
                    diferenciaFechas,
                    codigoCereal,
                    esCanje,
                    esPesificado,
                },
                {}
            );
        };

    /**
     * @description NUEVO, dpss reemplazar el getProductosPendientes por ESTE
     * @argument token
     * @argument filtros Lo filtro
     */
    buscaPendientes = (
        token,
        idCteTipo,
        facNumero,
        codigoProv,
        idMoneda,
        idSisOperacionComprobante,
        letra,
        idSisTipoOperacion
    ) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.buscaPendientes.nombre,
            {
                cteTipo: idCteTipo,
                facNumero,
                codigoProv,
                pendiente: 0,
                idProducto: 0,
                idDeposito: 0,
                despacho: "",
                idMoneda,
                idSisOperacionComprobante,
                letra,
                idSisTipoOperacion,
                idListaPrecio: 0,
                modulo: sisModulos.todos,
            },
            {}
        );
    };

    buscaPendientesProd = (
        token,
        idCteTipo,
        facNumero,
        codigoProv,
        idMoneda,
        idSisOperacionComprobante,
        letra,
        idSisTipoOperacion,
        codProd
    ) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.buscaPendientes.nombre,
            {
                cteTipo: idCteTipo,
                facNumero,
                codigoProv,
                pendiente: idCteTipo == 75 ? 0 : 1,
                idProducto: codProd ? codProd : "0",
                idDeposito: 0,
                despacho: "",
                idMoneda,
                idSisOperacionComprobante,
                letra,
                idSisTipoOperacion,
                idListaPrecio: 0,
                modulo: sisModulos.todos,
            },
            {}
        );
    };

    buscaComprobanteAfip = (
        token,
        codigoAfipRelacionado,
        numeroAfipRelacionado
    ) => {
        return this.request(
            [],
            RequestMethod.Get,
            {
                token: token,
            },
            resourcesREST.buscaComprobantes.nombre +
                "?&codigoAfipRelacionado=" +
                codigoAfipRelacionado +
                "&numeroAfipRelacionado=" +
                numeroAfipRelacionado,
            {
                codigoAfipRelacionado: codigoAfipRelacionado,
                numeroAfipRelacionado: numeroAfipRelacionado,
            },
            {}
        );
    };

    /**
     * Devuelve la cotizacion
     */
    getCotizacion = (token) => {
        return this.request(
            [],
            RequestMethod.Get,
            {
                token: token,
            },
            resourcesREST.buscaCotizacion.nombre,
            {},
            {}
        );
    };

    getAllCereales = (token) => {
        return this.request(
            [],
            RequestMethod.Get,
            {
                token: token,
            },
            resourcesREST.buscaCereales.nombre,
            {},
            {}
        );
    };

    getParametroPesificado = (token) => {
        return this.request(
            [],
            RequestMethod.Get,
            {
                token: token,
            },
            resourcesREST.buscaParametrosPesificado.nombre,
            {},
            {}
        );
    };

    modificarParametroPesificado = (token, interesMensual) =>
        this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.buscaParametrosPesificado.nombre,
            {
                interesMensual,
            },
            {}
        );

    /**
     * Busca los modelos de la tab facturacion
     */
    buscaModelos = (
        token,
        productos: ProductoBuscaModelo[],
        idSisModulo,
        idMoneda,
        idPadron,
        idSisTipoOperacion?,
        tipoComprobante?,
        estadoSisa?,
        esCanje?
    ) =>
        this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.buscaModelo.nombre,
            {
                modulo: idSisModulo,
                productos: productos,
                idMoneda,
                idProveedor: idSisTipoOperacion ? null : idPadron,
                idCliente: idSisTipoOperacion ? idPadron : null,
                idSisTipoOperacion: idSisTipoOperacion,
                tipoComprobante: tipoComprobante,
                porcentajeSisa: estadoSisa ? estadoSisa.percepIva : null,
                esCanje: esCanje,
            },
            {}
        );

    abmCerealesCanje = (
        token,
        codigoFuncion,
        ctaContable,
        cerealCodigo,
        idCanjeContratoCereal,
        idEmpresa
    ) =>
        this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.buscaCerealesCanje.nombre,
            {
                codigoFuncion,
                ctaContable,
                cerealCodigo,
                idParametrosCanje: idCanjeContratoCereal,
                idEmpresa,
            },
            {}
        );

    abmParametrosCanje = (
        token,
        codigoFuncion,
        interesDiario,
        diasLibres,
        cerealCodigo,
        ctaContableSisa,
        idEmpresa,
        idParametrosCanje
    ) =>
        this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.buscaParametrosCanje.nombre,
            {
                codigoFuncion,
                interesDiario,
                diasLibres,
                ctaContableSisa,
                cerealCodigo,
                idParametrosCanje,
                idEmpresa,
            },
            {}
        );

    /**
     * Graba un comprobante de comprobanteCompra
     */
    grabaComprobante =
        (token) =>
        (comprobante: Comprobante) =>
        (comproRelac: ComprobanteRelacionado) =>
        (provSelec: Padron) =>
        (productosPend: ProductoPendiente[]) =>
        (modelosFactura: ModeloFactura[]) =>
        (cotizacionDatos: { cotizacion: Cotizacion; total: number }) =>
        (depositoSelec: Deposito) =>
        (detallesFormaPago: DetalleFormaPago[]) =>
        // (factura: Factura) =>
        (factura: Comprobante) =>
        (tipoOpSelect: SisTipoOperacion) =>
        (pesificado: boolean) =>
        (dolarizadoAlVto: boolean) =>
        (interesMensualCompra: number) =>
        (canjeInsumos: boolean) =>
        (tipoCambio: string) => {
            return this.request(
                [],
                RequestMethod.Post,
                {
                    token: token,
                },
                "grabaComprobante",
                {
                    cai: " ",
                    caiVto: this.utilsService.formatearFecha("yyyy-mm-dd")(
                        comprobante.fechaComprobante
                    ),
                    codBarra: " ",
                    codigoPostal: " ",
                    cotDolar: cotizacionDatos.cotizacion.cotizacion,
                    cuit: provSelec.cuit.toString(),
                    factCabecera: true,
                    factDet: true,
                    factFormaPago: true,
                    factImputa: true,
                    factPie: modelosFactura.length > 0,
                    fechaEmision: this.utilsService.formatearFecha(
                        "yyyy-mm-dd"
                    )(comprobante.fechaComprobante),
                    fechaVencimiento: this.utilsService.formatearFecha(
                        "yyyy-mm-dd"
                    )(comprobante.fechaVto),
                    fechaConta: this.utilsService.formatearFecha("yyyy-mm-dd")(
                        comprobante.fechaContable
                    ),
                    fechaDolar: this.utilsService.formatearFecha("yyyy-mm-dd")(
                        cotizacionDatos.cotizacion.fechaCotizacion
                    ),
                    // fechaDolar: cotizacionDatos.cotizacion.fechaCotizacion,
                    //fecha de vto de la factura no cambia por alguna razon
                    fechaVencimientoFact: factura
                        ? this.utilsService.formatearFecha("yyyy-mm-dd")(
                              comprobante.fechaVto
                          )
                        : null,
                    fechaContaFact: factura
                        ? this.utilsService.formatearFecha("yyyy-mm-dd")(
                              factura.fechaContable
                          )
                        : null,
                    grabaFactura:
                        factura && factura.tipo && factura.tipo.idCteTipo
                            ? true
                            : false,
                    grillaArticulos: productosPend.map((prod, index) => {
                        return {
                            idProducto: prod.producto.idProductos,
                            articulo: prod.producto.descripcion
                                ? prod.producto.descripcion
                                : "",
                            pendiente: prod.pendiente,
                            precio: prod.precio,
                            // precio: Number(prod.producto.costoReposicion),
                            porCalc: prod.porCalc ? prod.porCalc : 0,
                            descuento: prod.descuento,
                            ivaPorc: prod.ivaPorc,
                            cantidadBulto: prod.cantBultos,
                            despacho: prod.despacho ? prod.despacho : " ",
                            trazable: prod.producto.trazable,
                            idDeposito: depositoSelec.idDeposito,
                            observacionDetalle: prod.producto.observaciones
                                ? prod.producto.observaciones
                                : " ",
                            imputacion:
                                prod.imputacion.seleccionada.ctaContable,
                            idFactDetalleImputa: prod.idFactDetalleImputa
                                ? prod.idFactDetalleImputa
                                : null,
                            itemImputada: prod.itemImputada,
                            importe: prod.importe,
                            precioDesc: prod.precio,
                            unidadDescuento: " ",
                            // idLibro: prod.modeloCab && prod.modeloCab.modeloDetalle ? prod.modeloCab.modeloDetalle[0].idLibro : null
                            idLibro:
                                prod.imputacion && prod.imputacion.seleccionada
                                    ? prod.imputacion.seleccionada.idLibro
                                    : null,
                            prodIndice: prod.item,
                        };
                    }),
                    grillaSubTotales: modelosFactura.map((mod) => {
                        return {
                            cuenta: mod.cuentaContable,
                            descripcionPie: mod.descripcion,
                            importe: Number(mod.importeTotal),
                            totalComprobante: cotizacionDatos.total,
                            porcentaje: mod.porcentaje ? mod.porcentaje : 0,
                            idSisTipoModelo: mod.idSisTipoModelo
                                ? mod.idSisTipoModelo
                                : 0,
                            baseImponible: mod.baseImponible
                                ? mod.baseImponible
                                : 0,
                            operador: mod.operador ? mod.operador : null,
                            idLibro: mod.idLibro ? mod.idLibro : null,
                        };
                    }),
                    grillaTrazabilidad: productosPend
                        .filter((prodPend) => prodPend.producto.trazable)
                        .map((prodTraza, index) => {
                            return {
                                gln: prodTraza.trazabilidad.gln,
                                nroLote: prodTraza.trazabilidad.lote,
                                serie: prodTraza.trazabilidad.serie,
                                fechaElab: this.utilsService.formatearFecha(
                                    "yyyy-mm-dd"
                                )(prodTraza.trazabilidad.fechaElab),
                                fechaVto: this.utilsService.formatearFecha(
                                    "yyyy-mm-dd"
                                )(prodTraza.trazabilidad.fechaVto),
                                vigencia: true,
                                idProducto: prodTraza.producto.idProductos,
                                posItem: prodTraza.item,
                            };
                        }),
                    grillaFormaPago: detallesFormaPago.map((detFp) => {
                        return {
                            plazo: detFp.cantDias ? detFp.cantDias : 0,
                            interes: detFp.porcentaje ? detFp.porcentaje : 0,
                            monto: detFp.monto ? Number(detFp.monto) : 0,
                            detalle: detFp.detalle ? detFp.detalle : " ",
                            observaciones: detFp.observaciones
                                ? detFp.observaciones
                                : " ",
                            cuentaContable:
                                detFp &&
                                detFp.planCuenta &&
                                detFp.planCuenta.planCuentas
                                    ? detFp.planCuenta.planCuentas
                                    : " ",
                            idFormaPagoDet: detFp.idFormaPagoDet,
                        };
                    }),

                    idCteTipo: comprobante.tipo.idCteTipo,
                    idPadron: provSelec.padronCodigo,
                    idMoneda: comprobante.moneda.idMoneda,

                    idSisTipoOperacion: tipoOpSelect.idSisTipoOperacion,

                    idNumero:
                        comprobante.numerador && comprobante.numerador.ptoVenta
                            ? comprobante.numerador.idCteNumerador
                            : null,

                    idFactCab: null,
                    idModulo: sisModulos.compra,
                    listaPrecio: null,
                    letraFact: factura ? "A" : null,
                    letra: comprobante.letraCodigo
                        ? comprobante.letraCodigo.letra.letra
                        : null,
                    lote:
                        productosPend.some(
                            (prodPend) => prodPend.producto.trazable
                        ) &&
                        comprobante.tipo.comprobante.idSisComprobantes !== 4,
                    nombre: provSelec.padronApelli,
                    numero: Number(
                        comprobante.numerador.ptoVenta.ptoVenta +
                            comprobante.numerador.numerador
                    ),
                    numeroFact:
                        factura &&
                        factura.numerador &&
                        factura.numerador.ptoVenta
                            ? Number(
                                  factura.numerador.ptoVenta.ptoVenta +
                                      factura.numerador.numerador
                              )
                            : null,
                    observaciones: comprobante.observaciones,
                    precioReferenciaCanje: 0,
                    productoCanje: " ",
                    produmo: true,
                    relComprobante: comproRelac.tipo.idCteTipo,
                    relPuntoVenta: comproRelac.puntoVenta,
                    relNumero: comproRelac.numero,
                    sisSitIva: provSelec.condIva.descCorta,
                    interesCanje: 0,
                    tipoFact:
                        factura && factura.tipo ? factura.tipo.idCteTipo : null,
                    codigoAfip: comprobante.letraCodigo
                        ? comprobante.letraCodigo.codigoAfip.codigoAfip
                        : null,
                    codigoAfipFact: factura.letraCodigo
                        ? factura.letraCodigo.codigoAfip.codigoAfip
                        : null,
                    idSisOperacionComprobante: comprobante.tipo.comprobante
                        .idSisOperacionComprobante
                        ? comprobante.tipo.comprobante.idSisOperacionComprobante
                        : null,
                    pesificado: pesificado ? pesificado : false,
                    dolarizadoAlVto: dolarizadoAlVto ? dolarizadoAlVto : false,
                    interesMensualCompra: interesMensualCompra
                        ? interesMensualCompra
                        : 0,
                    canjeInsumos: canjeInsumos ? canjeInsumos : false,
                    tipoCambio: tipoCambio ? tipoCambio : "divisa",
                },
                {}
            );
        };

    /**
     * Emitir remito
     */
    emitirRemito =
        (token) =>
        (comprobante: Comprobante) =>
        (comproRelac: ComprobanteRelacionado) =>
        (clienteSelect: Padron) =>
        // (clienteSelect: Cliente) =>
        (productosPend: ProductoPendiente[]) =>
        (modelosFactura: ModeloFactura[]) =>
        (cotizacionDatos: { cotizacion: Cotizacion; total: number }) =>
        (depositoSelec: Deposito) =>
        (sisCanje: SisCanje) =>
        (formasPagoSeleccionadas: FormaPago[]) =>
        // (factura: Factura) =>
        (factura: Comprobante) =>
        (detallesFormaPago: DetalleFormaPago[]) =>
        (lotesTraza: Lote[]) =>
        (tipoOpSelect: SisTipoOperacion) =>
        (dataVendedor: any) =>
        (subtotalesProductos: any) =>
        (listaPrecioSelec: ListaPrecio) =>
        (contrato: Contrato) =>
        (relacionCanje: RelacionCanje) =>
        (cereal?) =>
        (diferidoVto?) =>
        (marcaPesificado?) =>
        (pesificadoPersisteSn?) =>
        (nroCompPesificado?) => {
            return this.request(
                [],
                RequestMethod.Post,
                {
                    token: token,
                },
                "grabaComprobante",
                {
                    cai: " ",
                    caiVto: this.utilsService.formatearFecha("yyyy-mm-dd")(
                        comprobante.fechaComprobante
                    ),
                    codBarra: " ",
                    codigoPostal: " ",
                    cotDolar: cotizacionDatos.cotizacion.cotizacion,
                    cuit: clienteSelect.cuit.toString(),
                    factCabecera: true,
                    factDet: true,
                    factFormaPago: true,
                    factImputa: true,
                    factPie: modelosFactura.length > 0,
                    fechaEmision: this.utilsService.formatearFecha(
                        "yyyy-mm-dd"
                    )(comprobante.fechaComprobante),
                    fechaVencimiento: this.utilsService.formatearFecha(
                        "yyyy-mm-dd"
                    )(comprobante.fechaVto),
                    fechaConta: this.utilsService.formatearFecha("yyyy-mm-dd")(
                        comprobante.fechaContable
                    ),
                    fechaDolar: cotizacionDatos.cotizacion.fechaCotizacion,
                    cereal: cereal,
                    diferidoVto: diferidoVto,
                    marcaPesificado: marcaPesificado ? marcaPesificado : false,
                    pesificadoPersisteSn: pesificadoPersisteSn
                        ? pesificadoPersisteSn
                        : false,
                    nroCompPesificado: nroCompPesificado,
                    grabaFactura:
                        factura && factura.tipo && factura.tipo.idCteTipo
                            ? true
                            : false,
                    grillaArticulos: productosPend.map((prod) => {
                        const subtotalBuscado = subtotalesProductos.find(
                            (st) => {
                                return (
                                    st.idProducto ===
                                        prod.producto.idProductos &&
                                    st.numeroComp === prod.numero
                                );
                            }
                        );
                        const subtotalProd =
                            // this.utilsService.parseDecimal(
                            subtotalBuscado && subtotalBuscado["subtotal"]
                                ? subtotalBuscado["subtotal"]
                                : 0;
                        // );
                        const precioDescProd =
                            // this.utilsService.parseDecimal(
                            subtotalBuscado && subtotalBuscado["precioDesc"]
                                ? subtotalBuscado["precioDesc"]
                                : 0;
                        // );

                        return {
                            idProducto: prod.producto.idProductos,
                            articulo: prod.producto.descripcion
                                ? prod.producto.descripcion
                                : "",
                            pendiente: prod.pendiente,
                            precio: prod.precio,
                            porCalc: prod.porCalc ? prod.porCalc : 0,
                            descuento: prod.descuento,
                            ivaPorc: prod.ivaPorc,
                            cantidadBulto: prod.cantBultos,
                            despacho: prod.despacho ? prod.despacho : " ",
                            trazable: prod.producto.trazable,
                            idDeposito: depositoSelec.idDeposito,
                            observacionDetalle: prod.producto.observaciones
                                ? prod.producto.observaciones
                                : " ",
                            imputacion:
                                prod.imputacion.seleccionada.ctaContable,
                            idFactDetalleImputa: prod.idFactDetalleImputa
                                ? prod.idFactDetalleImputa
                                : null,
                            itemImputada: prod.itemImputada,
                            importe: Number(subtotalProd)
                                ? Number(subtotalProd)
                                : 0,
                            precioDesc: precioDescProd,
                            unidadDescuento: prod.tipoDescuento
                                ? prod.tipoDescuento
                                : "-",
                            comprobanteRel: prod.numero ? prod.numero : null,
                            // idLibro: prod.modeloCab && prod.modeloCab.modeloDetalle ? prod.modeloCab.modeloDetalle[0].idLibro : null
                            idLibro:
                                prod.imputacion && prod.imputacion.seleccionada
                                    ? prod.imputacion.seleccionada.idLibro
                                    : null,
                        };
                    }),
                    grillaSubTotales: modelosFactura.map((mod) => {
                        return {
                            cuenta: mod.cuentaContable,
                            descripcionPie: mod.descripcion,
                            importe: Number(mod.importeTotal),
                            totalComprobante: cotizacionDatos.total,
                            porcentaje: mod.porcentaje ? mod.porcentaje : 0,
                            idSisTipoModelo: mod.idSisTipoModelo
                                ? mod.idSisTipoModelo
                                : 0,
                            baseImponible: mod.baseImponible
                                ? mod.baseImponible
                                : 0,
                            operador: mod.operador ? mod.operador : null,
                            idLibro: mod.idLibro ? mod.idLibro : null,
                        };
                    }),
                    grillaTrazabilidad: lotesTraza.map((theLote) => {
                        return {
                            nroLote: theLote.nroLote,
                            serie: theLote.serie,
                            fechaElab: this.utilsService.formatearFecha(
                                "yyyy-mm-dd"
                            )(theLote.fechaElab),
                            fechaVto: this.utilsService.formatearFecha(
                                "yyyy-mm-dd"
                            )(theLote.fechaVto),
                            vigencia: true,
                            idProducto: theLote.idProducto,
                            posItem: theLote.item,
                        };
                    }),
                    grillaFormaPago: detallesFormaPago.map((detFp) => {
                        return {
                            plazo: detFp.cantDias ? detFp.cantDias : 0,
                            interes: detFp.porcentaje ? detFp.porcentaje : 0,
                            monto: detFp.monto ? Number(detFp.monto) : 0,
                            detalle: detFp.detalle ? detFp.detalle : " ",
                            observaciones: detFp.observaciones
                                ? detFp.observaciones
                                : " ",
                            cuentaContable:
                                detFp &&
                                detFp.planCuenta &&
                                detFp.planCuenta.planCuentas
                                    ? detFp.planCuenta.planCuentas
                                    : " ",
                            idFormaPagoDet: detFp.idFormaPagoDet,
                        };
                    }),

                    idSisTipoOperacion: tipoOpSelect.idSisTipoOperacion,

                    idNumero: comprobante.numerador
                        ? comprobante.numerador.idCteNumerador
                        : null,

                    idCteTipo: comprobante.tipo.idCteTipo,
                    idPadron: clienteSelect.padronCodigo,
                    idMoneda: comprobante.moneda.idMoneda,
                    idModeloCab: null,
                    idModulo: sisModulos.venta,
                    listaPrecio: listaPrecioSelec
                        ? listaPrecioSelec.idListaPrecio
                        : productosPend[0].idListaPrecio,
                    letra: comprobante.letraCodigo
                        ? comprobante.letraCodigo.letra.letra
                        : null,
                    lote:
                        productosPend.some(
                            (prodPend) => prodPend.producto.trazable
                        ) &&
                        comprobante.tipo.comprobante.idSisComprobantes !== 4,
                    nombre: clienteSelect.padronApelli,
                    numero: Number(
                        `${comprobante.numerador.ptoVenta.ptoVenta}${comprobante.numerador.numerador}`
                    ),
                    observaciones: comprobante.observaciones,
                    precioReferenciaCanje:
                        sisCanje && sisCanje.precio ? sisCanje.precio : 0,
                    productoCanje:
                        sisCanje && sisCanje.descripcion
                            ? sisCanje.descripcion
                            : " ",
                    produmo: true,
                    sisSitIva: clienteSelect.condIva.descCorta,
                    interesCanje:
                        sisCanje && sisCanje.interes ? sisCanje.interes : 0,
                    idVendedor: dataVendedor.incluir
                        ? dataVendedor.vendedor.idVendedor
                        : null,
                    idFactCab: null,
                    fechaVencimientoFact: factura
                        ? this.utilsService.formatearFecha("yyyy-mm-dd")(
                              comprobante.fechaVto
                          )
                        : null,
                    fechaContaFact: factura
                        ? this.utilsService.formatearFecha("yyyy-mm-dd")(
                              factura.fechaComprobante
                          )
                        : null,
                    letraFact: factura ? "A" : null,
                    numeroFact:
                        factura &&
                        factura.numerador &&
                        factura.numerador.ptoVenta
                            ? Number(
                                  `${factura.numerador.ptoVenta.ptoVenta}${factura.numerador.numerador}`
                              )
                            : null,
                    tipoFact:
                        factura && factura.tipo ? factura.tipo.idCteTipo : null,
                    idNumeroFact:
                        factura && factura.numerador
                            ? factura.numerador.idCteNumerador
                            : null,
                    codigoAfip: comprobante.letraCodigo
                        ? comprobante.letraCodigo.codigoAfip.codigoAfip
                        : null,
                    codigoAfipFact: factura.letraCodigo
                        ? factura.letraCodigo.codigoAfip.codigoAfip
                        : null,
                    idSisOperacionComprobante: comprobante.tipo.comprobante
                        .idSisOperacionComprobante
                        ? comprobante.tipo.comprobante.idSisOperacionComprobante
                        : null,

                    kilosCanje:
                        comprobante &&
                        comprobante.tipo &&
                        comprobante.tipo.comprobante &&
                        comprobante.tipo.comprobante.usaRelacion
                            ? relacionCanje &&
                              productosPend &&
                              productosPend.length > 0
                                ? _.sumBy(productosPend, (prod) =>
                                      Number(prod.pendiente)
                                  ) * relacionCanje.factor
                                : 0
                            : cotizacionDatos && sisCanje
                            ? Math.round(
                                  Number(
                                      this.utilsService.parseDecimal(
                                          Number(
                                              this.utilsService.parseDecimal(
                                                  cotizacionDatos.total
                                              )
                                          ) / sisCanje.precio
                                      )
                                  )
                              )
                            : null,
                    idContrato: contrato ? contrato.idContratos : null,
                    observacionesCanje: sisCanje ? sisCanje.descripcion : null,
                    idRelacionSisCanje: relacionCanje
                        ? relacionCanje.idRelacionSisCanje
                        : null,
                },
                {}
            );
        };

    descargarComprobante =
        (token) =>
        (idFactCab) =>
        (nombrePdf?) =>
        (nroCopias?) =>
        (esCanje?) => {
            return this.request(
                [],
                RequestMethod.Post,
                {
                    token: token,
                },
                `descargarPdf`,
                {
                    idFactCab: idFactCab,
                    nombrePdf: nombrePdf,
                    nroCopias,
                    esCanje,
                },
                {},
                true
            );
        };

    /** */
    getSisSitIva = (token) => (provSelec: Padron) => {
        return this.request(
            [],
            RequestMethod.Get,
            {
                token: token,
            },
            `sisSitIva/${provSelec.condIva.descCorta}`,
            {},
            {}
        );
    };

    llenarPadron = (token) => (provSelec: Padron) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            `padron`,
            {
                padronCodigo: provSelec.padronCodigo,
            },
            {}
        );
    };

    /**
     * @description Obtiene productos pendientes
     * @argument token
     * @argument filtros Lo filtro
     */
    reporteComprobantes =
        (tipo) =>
        (token: string) =>
        (comprobante: Comprobante) =>
        (fechasFiltro: { desde: DateLikePicker; hasta: DateLikePicker }) =>
        (sisModuloSelec: SisModulo) =>
        (tipoComprobanteSelec: TipoComprobante) =>
        (productoSelec: Producto) =>
        (sisEstadoSelec: SisEstado) =>
        (padronSelec: Padron) =>
        (depositoSelec: Deposito) =>
        (vendedorSelec: Vendedor) =>
        (sisTipoOpSelect: SisTipoOperacion) =>
        (estadoAfip: string) =>
        (productoDesde: string) =>
        (productoHasta: string) =>
        (idTipoFechaSeleccionada: Number) => {
            /*console.log(tipo, token, comprobante, fechasFiltro.desde, fechasFiltro.hasta, sisModuloSelec,
                                                            tipoComprobanteSelec, tipoComprobanteSelec, productoSelec, sisEstadoSelec, padronSelec,
                                                            depositoSelec, vendedorSelec, sisTipoOpSelect, estadoAfip);*/
            return this.request(
                [],
                RequestMethod.Post,
                {
                    token: token,
                },
                resourcesREST.descargarListado.nombre,
                {
                    comprobanteModulo:
                        sisModuloSelec && sisModuloSelec.idSisModulos
                            ? sisModuloSelec.idSisModulos
                            : 0,
                    comprobanteTipo:
                        tipoComprobanteSelec && tipoComprobanteSelec.idCteTipo
                            ? tipoComprobanteSelec.idCteTipo
                            : 0,
                    comprobanteNumero:
                        comprobante &&
                        comprobante.numerador.ptoVenta.ptoVenta &&
                        comprobante.numerador.numerador
                            ? `${comprobante.numerador.ptoVenta.ptoVenta}${comprobante.numerador.numerador}`
                            : 0,
                    fechaDesde: this.utilsService.formatearFecha("yyyy-mm-dd")(
                        fechasFiltro.desde
                    ),
                    fechaHasta: this.utilsService.formatearFecha("yyyy-mm-dd")(
                        fechasFiltro.hasta
                    ),
                    idProducto:
                        productoSelec && productoSelec.idProductos
                            ? productoSelec.idProductos
                            : 0,
                    padCodigo:
                        padronSelec && padronSelec.padronCodigo
                            ? padronSelec.padronCodigo
                            : 0,
                    idDeposito:
                        depositoSelec && depositoSelec.idDeposito
                            ? depositoSelec.idDeposito
                            : 0,
                    idEstado:
                        sisEstadoSelec && sisEstadoSelec.idSisEstados
                            ? sisEstadoSelec.idSisEstados
                            : 0,

                    idVendedor:
                        vendedorSelec && vendedorSelec.idVendedor
                            ? vendedorSelec.idVendedor
                            : 0,
                    idSisTipoOperacion:
                        sisTipoOpSelect && sisTipoOpSelect.idSisTipoOperacion
                            ? sisTipoOpSelect.idSisTipoOperacion
                            : 0,
                    autorizada: estadoAfip ? estadoAfip : "Todas",
                    productoDesde: productoDesde,
                    productoHasta: productoHasta,
                    idTipoFechaSeleccionada: idTipoFechaSeleccionada,
                },
                {
                    tipo,
                },
                true
            );
        };


        reporteComprobantesExcel =
        (tipo) =>
        (token: string) =>
        (comprobante: Comprobante) =>
        (fechasFiltro: { desde: DateLikePicker; hasta: DateLikePicker }) =>
        (sisModuloSelec: SisModulo) =>
        (tipoComprobanteSelec: TipoComprobante) =>
        (productoSelec: Producto) =>
        (sisEstadoSelec: SisEstado) =>
        (padronSelec: Padron) =>
        (depositoSelec: Deposito) =>
        (vendedorSelec: Vendedor) =>
        (sisTipoOpSelect: SisTipoOperacion) =>
        (estadoAfip: string) =>
        (productoDesde: string) =>
        (productoHasta: string) =>
        (idTipoFechaSeleccionada: Number) => {
            /*console.log(tipo, token, comprobante, fechasFiltro.desde, fechasFiltro.hasta, sisModuloSelec,
                                                            tipoComprobanteSelec, tipoComprobanteSelec, productoSelec, sisEstadoSelec, padronSelec,
                                                            depositoSelec, vendedorSelec, sisTipoOpSelect, estadoAfip);*/
            return this.request(
                [],
                RequestMethod.Post,
                {
                    token: token,
                },
                resourcesREST.descargarExcel.nombre,
                {
                    comprobanteModulo:
                        sisModuloSelec && sisModuloSelec.idSisModulos
                            ? sisModuloSelec.idSisModulos
                            : 0,
                    comprobanteTipo:
                        tipoComprobanteSelec && tipoComprobanteSelec.idCteTipo
                            ? tipoComprobanteSelec.idCteTipo
                            : 0,
                    comprobanteNumero:
                        comprobante &&
                        comprobante.numerador.ptoVenta.ptoVenta &&
                        comprobante.numerador.numerador
                            ? `${comprobante.numerador.ptoVenta.ptoVenta}${comprobante.numerador.numerador}`
                            : 0,
                    fechaDesde: this.utilsService.formatearFecha("yyyy-mm-dd")(
                        fechasFiltro.desde
                    ),
                    fechaHasta: this.utilsService.formatearFecha("yyyy-mm-dd")(
                        fechasFiltro.hasta
                    ),
                    idProducto:
                        productoSelec && productoSelec.idProductos
                            ? productoSelec.idProductos
                            : 0,
                    padCodigo:
                        padronSelec && padronSelec.padronCodigo
                            ? padronSelec.padronCodigo
                            : 0,
                    idDeposito:
                        depositoSelec && depositoSelec.idDeposito
                            ? depositoSelec.idDeposito
                            : 0,
                    idEstado:
                        sisEstadoSelec && sisEstadoSelec.idSisEstados
                            ? sisEstadoSelec.idSisEstados
                            : 0,

                    idVendedor:
                        vendedorSelec && vendedorSelec.idVendedor
                            ? vendedorSelec.idVendedor
                            : 0,
                    idSisTipoOperacion:
                        sisTipoOpSelect && sisTipoOpSelect.idSisTipoOperacion
                            ? sisTipoOpSelect.idSisTipoOperacion
                            : 0,
                    autorizada: estadoAfip ? estadoAfip : "Todas",
                    productoDesde: productoDesde,
                    productoHasta: productoHasta,
                    idTipoFechaSeleccionada: idTipoFechaSeleccionada,
                },
                {
                    tipo,
                },
                true
            );
        };





    reportePosStock =
        (token: string) => (fechaDesde) => (fechaHasta) => (codProducto) => {
            return this.request(
                [],
                RequestMethod.Post,
                {
                    token: token,
                },
                resourcesREST.buscaPosicionStock.nombre +
                    "/particular/imprimir",
                {
                    fechaDesde:
                        this.utilsService.formatearFecha("yyyy-mm-dd")(
                            fechaDesde
                        ),
                    fechaHasta:
                        this.utilsService.formatearFecha("yyyy-mm-dd")(
                            fechaHasta
                        ),
                    codProducto,
                },
                {},
                true
            );
        };

    /**
     * @description Obtiene productos pendientes
     * @argument token
     * @argument filtros Lo filtro
     */
    buscaComprobantes =
        (token: string) =>
        (comprobante: Comprobante) =>
        (fechasFiltro: { desde: DateLikePicker; hasta: DateLikePicker }) =>
        (idTipoFechaSeleccionada: Number) =>
        (sisModuloSelec: SisModulo) =>
        (tipoComprobanteSelec: TipoComprobante) =>
        (productoSelec: Producto) =>
        (sisEstadoSelec: SisEstado) =>
        (padronSelec: Padron) =>
        (depositoSelec: Deposito) =>
        (vendedorSelec: Vendedor) =>
        (sisTipoOpSelect: SisTipoOperacion) =>
        (estadoAfip: string) =>
        (productoDesde?: string) =>
        (productoHasta?: string) => {
            return this.request(
                [],
                RequestMethod.Post,
                {
                    token: token,
                },
                resourcesREST.buscaComprobantes.nombre,
                {
                    comprobanteModulo:
                        sisModuloSelec && sisModuloSelec.idSisModulos
                            ? sisModuloSelec.idSisModulos
                            : 0,
                    comprobanteTipo:
                        tipoComprobanteSelec && tipoComprobanteSelec.idCteTipo
                            ? tipoComprobanteSelec.idCteTipo
                            : 0,
                    comprobanteNumero:
                        comprobante &&
                        comprobante.numerador.ptoVenta.ptoVenta &&
                        comprobante.numerador.numerador
                            ? `${comprobante.numerador.ptoVenta.ptoVenta}${comprobante.numerador.numerador}`
                            : 0,
                    buscarPorFecha: idTipoFechaSeleccionada,
                    fechaDesde: this.utilsService.formatearFecha("yyyy-mm-dd")(
                        fechasFiltro.desde
                    ),
                    fechaHasta: this.utilsService.formatearFecha("yyyy-mm-dd")(
                        fechasFiltro.hasta
                    ),
                    idProducto:
                        productoSelec && productoSelec.idProductos
                            ? productoSelec.idProductos
                            : 0,
                    padCodigo:
                        padronSelec && padronSelec.padronCodigo
                            ? padronSelec.padronCodigo
                            : 0,
                    idDeposito:
                        depositoSelec && depositoSelec.idDeposito
                            ? depositoSelec.idDeposito
                            : 0,
                    idEstado:
                        sisEstadoSelec && sisEstadoSelec.idSisEstados
                            ? sisEstadoSelec.idSisEstados
                            : 0,
                    idVendedor:
                        vendedorSelec && vendedorSelec.idVendedor
                            ? vendedorSelec.idVendedor
                            : 0,
                    idSisTipoOperacion:
                        sisTipoOpSelect && sisTipoOpSelect.idSisTipoOperacion
                            ? sisTipoOpSelect.idSisTipoOperacion
                            : 0,
                    autorizada: estadoAfip ? estadoAfip : "Todas",
                    codProductoDesde: productoDesde ? productoDesde : null,
                    codProductoHasta: productoHasta ? productoHasta : null,
                },
                {}
            );
        };

    buscaComprobantesPesificacion =
        (token: string) => (fechasFiltro) => (padronSelec: Padron) => {
            return this.request(
                [],
                RequestMethod.Post,
                {
                    token: token,
                },
                resourcesREST.buscaComprobantes.nombre + "/pesificacion",
                {
                    fechaEmisionDesde: this.utilsService.formatearFecha(
                        "yyyy-mm-dd"
                    )(fechasFiltro.emisionDesde),
                    fechaEmisionHasta: this.utilsService.formatearFecha(
                        "yyyy-mm-dd"
                    )(fechasFiltro.emisionHasta),
                    padCodigo:
                        padronSelec && padronSelec.padronCodigo
                            ? padronSelec.padronCodigo
                            : 0,
                    fechaVencimientoDesde: this.utilsService.formatearFecha(
                        "yyyy-mm-dd"
                    )(fechasFiltro.vencimientoDesde),
                    fechaVencimientoHasta: this.utilsService.formatearFecha(
                        "yyyy-mm-dd"
                    )(fechasFiltro.vencimientoHasta),
                },
                {}
            );
        };

    buscaComprobantePesificacion = (token: string) => (numeroComprobante) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.buscaComprobantes.nombre + "/pesificacion",
            {
                numeroComprobante,
            },
            {}
        );
    };
    getImportarVentas = (token: string) => {
        debugger
        return this.request(
            [token],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.actualizarVentasStock.nombre,
            {},
            {}
        ); 
    };

    /**
     * @description Obtiene productos pendientes
     * @argument token
     * @argument filtros Lo filtro
     */
    buscaComprobantesAnticipado =
        (token: string) =>
        (comprobante: Comprobante) =>
        (fechasFiltro: { desde: DateLikePicker; hasta: DateLikePicker }) =>
        (sisModuloSelec: SisModulo) =>
        (tipoComprobanteSelec: TipoComprobante) =>
        (tipoComprobanteSelec2: TipoComprobante) =>
        (productoSelec: Producto) =>
        (sisEstadoSelec: SisEstado) =>
        (padronSelec: Padron) =>
        (depositoSelec: Deposito) =>
        (vendedorSelec: Vendedor) =>
        (sisTipoOpSelect: SisTipoOperacion) =>
        (estadoAfip: string) =>
        (productoDesde?: string) =>
        (productoHasta?: string) => {
            return this.request(
                [],
                RequestMethod.Post,
                {
                    token: token,
                },
                resourcesREST.buscaComprobantesAnticipados.nombre,
                {
                    comprobanteModulo:
                        sisModuloSelec && sisModuloSelec.idSisModulos
                            ? sisModuloSelec.idSisModulos
                            : 0,
                    comprobanteTipo:
                        tipoComprobanteSelec && tipoComprobanteSelec.idCteTipo
                            ? tipoComprobanteSelec.idCteTipo
                            : 0,
                    comprobanteTipo2:
                        tipoComprobanteSelec2 && tipoComprobanteSelec2.idCteTipo
                            ? tipoComprobanteSelec2.idCteTipo
                            : 0,
                    comprobanteNumero:
                        comprobante &&
                        comprobante.numerador.ptoVenta.ptoVenta &&
                        comprobante.numerador.numerador
                            ? `${comprobante.numerador.ptoVenta.ptoVenta}${comprobante.numerador.numerador}`
                            : 0,
                    fechaDesde: this.utilsService.formatearFecha("yyyy-mm-dd")(
                        fechasFiltro.desde
                    ),
                    fechaHasta: this.utilsService.formatearFecha("yyyy-mm-dd")(
                        fechasFiltro.hasta
                    ),
                    idProducto:
                        productoSelec && productoSelec.idProductos
                            ? productoSelec.idProductos
                            : 0,
                    padCodigo:
                        padronSelec && padronSelec.padronCodigo
                            ? padronSelec.padronCodigo
                            : 0,
                    idDeposito:
                        depositoSelec && depositoSelec.idDeposito
                            ? depositoSelec.idDeposito
                            : 0,
                    idEstado:
                        sisEstadoSelec && sisEstadoSelec.idSisEstados
                            ? sisEstadoSelec.idSisEstados
                            : 0,
                    idVendedor:
                        vendedorSelec && vendedorSelec.idVendedor
                            ? vendedorSelec.idVendedor
                            : 0,
                    idSisTipoOperacion:
                        sisTipoOpSelect && sisTipoOpSelect.idSisTipoOperacion
                            ? sisTipoOpSelect.idSisTipoOperacion
                            : 0,
                    autorizada: estadoAfip ? estadoAfip : "Todas",
                    codProductoDesde: productoDesde ? productoDesde : null,
                    codProductoHasta: productoHasta ? productoHasta : null,
                },
                {}
            );
        };

    getPosicionStockGral =
        (token: string) =>
        (fechasFiltro: { desde: DateLikePicker; hasta: DateLikePicker }) =>
        (productoDesde?: string) =>
        (productoHasta?: string) => {
            return this.request(
                [],
                RequestMethod.Post,
                {
                    token: token,
                },
                resourcesREST.buscaPosicionStock.nombre,
                {
                    fechaDesde: this.utilsService.formatearFecha("yyyy-mm-dd")(
                        fechasFiltro.desde
                    ),
                    fechaHasta: this.utilsService.formatearFecha("yyyy-mm-dd")(
                        fechasFiltro.hasta
                    ),
                    codProductoDesde: productoDesde ? productoDesde : null,
                    codProductoHasta: productoHasta ? productoHasta : null,
                },
                {}
            );
        };

    getPosicionStock =
        (token: string) =>
        (fechasFiltro: { desde: DateLikePicker; hasta: DateLikePicker }) =>
        (producto: string) => {
            return this.request(
                [],
                RequestMethod.Post,
                {
                    token: token,
                },
                resourcesREST.buscaPosicionStock.nombre + "/particular",
                {
                    fechaDesde: this.utilsService.formatearFecha("yyyy-mm-dd")(
                        fechasFiltro.desde
                    ),
                    fechaHasta: this.utilsService.formatearFecha("yyyy-mm-dd")(
                        fechasFiltro.hasta
                    ),
                    codProducto: producto ? producto : null,
                },
                {}
            );
        };

    buscaComprobantesPadronAnticipada = (token: string) => (padron) => {
        let fechaAntes = new Date();
        if (new Date().getMonth() > 0) {
            fechaAntes = new Date(
                new Date().getFullYear(),
                new Date().getMonth() - 1,
                1
            );
        } else {
            fechaAntes = new Date(new Date().getFullYear() - 1, 11, 1);
        }
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.buscaComprobantes.nombre,
            {
                comprobanteModulo: 2,
                comprobanteTipo: 75,
                comprobanteNumero: 0,
                fechaDesde: this.utilsService.formatearFecha("yyyy-mm-dd")(
                    new DateLikePicker(fechaAntes)
                ),
                fechaHasta: this.utilsService.formatearFecha("yyyy-mm-dd")(
                    new DateLikePicker(new Date())
                ),
                idProducto: 0,
                padCodigo: padron,
                idDeposito: 0,
                idEstado: 1,
                idVendedor: 0,
                idSisTipoOperacion: 10,
                autorizada: "Todas",
                codProductoDesde: null,
                codProductoHasta: null,
            },
            {}
        );
    };

    buscaComprobantesCanje = (
        token: string,
        fechasFiltro: { desde: DateLikePicker; hasta: DateLikePicker },
        padronSelec: Padron,
        estadoComprobante
    ) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.buscaComprobantes.nombre,
            {
                comprobanteModulo: sisModulos.venta,
                comprobanteTipo: 0,
                comprobanteNumero: 0,
                fechaDesde: this.utilsService.formatearFecha("yyyy-mm-dd")(
                    fechasFiltro.desde
                ),
                fechaHasta: this.utilsService.formatearFecha("yyyy-mm-dd")(
                    fechasFiltro.hasta
                ),
                idProducto: 0,
                padCodigo:
                    padronSelec && padronSelec.padronCodigo
                        ? padronSelec.padronCodigo
                        : 0,
                idDeposito: 0,
                idEstado: 0,
                idVendedor: 0,
                idSisTipoOperacion: 5,
                autorizada: "Todas",
                contratoRelacionado: estadoComprobante,
            },
            {}
        );
    };
    
    
    actualizarProductosViejoANuevo = (
        token: string,
        codigoProductoDesde,
        codigoProductoHasta
    ) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.actualizaProductos.nombre,
            {
                codigoProductoDesde,
                codigoProductoHasta,
            },
            {}
        );
    };

    /**
     * @description Obtiene las formas de pago
     * @argument token
     */
    getBuscaFormaPago = (token: string) => (cliente?: Padron) => (fecha: any) =>
        this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.buscaListaPrecio.nombre,
            {
                activa: true,
                todas: true,
                fecha: this.utilsService.formatearFecha("yyyy-mm-dd")(fecha),
                idPadronDesde: cliente ? cliente.padronCodigo : null,
                idPadronHasta: cliente ? cliente.padronCodigo : null,
            },
            {}
        )
            // TODO: Workaround hasta próx testeo
            .map((resp) => {
                return {
                    arraydatos: resp.arraydatos[0].formasPago,
                };
            });

    /**
     * @description
     * @argument token
     */
    getBuscaCteFecha = (token: string) => (comprobante: Comprobante) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.buscaCteFecha.nombre,
            {
                idCteTipo: comprobante.tipo.idCteTipo,
                puntoVenta: comprobante.numerador.ptoVenta.ptoVenta,
            },
            {}
        );
    };

    /**
     * @description Obtiene subtotales (se usa en emision remitos)
     * @argument token
     */
    getCalculoSubtotales = (token: string) => (prodPend: ProductoPendiente) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.calculoSubtotales.nombre,
            {
                precio: prodPend.precio,
                cantidad: prodPend.pendiente,
                iva: prodPend.ivaPorc,
                descuento: prodPend.descuento,
                tipoDescuento: prodPend.tipoDescuento,
            },
            {}
        );
    };

    /**
     * @description Obtiene los loties de un producto dado
     * @argument token
     */
    getBuscaLote =
        (token: string) =>
        (filtros: {
            idPadron: string;
            nroLote: string;
            codProducto: string;
            fechaVtoHasta: any;
        }) => {
            return this.request(
                [],
                RequestMethod.Post,
                {
                    token: token,
                },
                resourcesREST.buscaLote.nombre,
                {
                    nroLote: filtros.nroLote ? filtros.nroLote : " ",
                    serie: " ",
                    fechaVtoDesde: "2000-01-01",
                    fechaVtoHasta: this.utilsService.formatearFecha(
                        "yyyy-mm-dd"
                    )(filtros.fechaVtoHasta),
                    vigencia: 1,
                    codProducto: filtros.codProducto
                        ? filtros.codProducto
                        : null,
                    idPadron: filtros.idPadron ? filtros.idPadron : 0,
                    idCteTipo: 0,
                    facNumero: 0,
                    stock: 1,
                },
                {}
            );
        };

    getCereales = (token: string) => {
        return this.request(
            [],
            RequestMethod.Get,
            {
                token: token,
            },
            resourcesREST.buscaCerealesCanje.nombre,
            {},
            {}
        );
    };

    getParametrosCanje = (token: string) => {
        return this.request(
            [],
            RequestMethod.Get,
            {
                token: token,
            },
            resourcesREST.buscaParametrosCanje.nombre,
            {},
            {}
        );
    };

    getEstadosSisa = (token: string) => (idPadron) => {
        return this.request(
            [],
            RequestMethod.Get,
            {
                token: token,
            },
            resourcesREST.buscaEstadosSisa.nombre + "?&idPadron=" + idPadron,
            {},
            {}
        );
    };

    /**
     * @description Obtiene los lotes de varios productos
     * @argument token
     */
    getBuscaLotes =
        (token: string) =>
        (productos: ProductoPendiente[]) =>
        (comprobante: Comprobante) => {
            return this.request(
                [],
                RequestMethod.Post,
                {
                    token: token,
                },
                resourcesREST.buscaLotes.nombre,
                {
                    nroLote: " ",
                    serie: " ",
                    fechaVtoDesde: "2000-01-01",
                    fechaVtoHasta: this.utilsService.formatearFecha(
                        "yyyy-mm-dd"
                    )(comprobante.fechaComprobante),
                    vigencia: 1,
                    productos: productos.map((prod) => {
                        return {
                            idProducto: prod.producto.idProductos,
                        };
                    }),
                    idPadron: 0,
                    idCteTipo: 0,
                    facNumero: 0,
                    stock: 1,
                },
                {}
            );
        };

    /**
     * @description Obtiene los stock
     * @argument token
     */
    getBuscaStock =
        (token: string) =>
        (filtros: {
            fechaDesde: any;
            fechaHasta: any;
            codProducto: any;
            productoSelect: Producto;
            productoSelect2?: Producto;
            cteTipo?: TipoComprobante;
            deposito?: Deposito;
            rubro?: Rubro;
            subrubro: SubRubro;
        }) =>
        (tipo: string) => {
            return this.request(
                [tipo],
                RequestMethod.Post,
                {
                    token: token,
                },
                resourcesREST.buscaStock.nombre,
                {
                    fechaDesde: this.utilsService.formatearFecha("yyyy-mm-dd")(
                        filtros.fechaDesde
                    ),
                    fechaHasta: this.utilsService.formatearFecha("yyyy-mm-dd")(
                        filtros.fechaHasta
                    ),
                    idProductoDesde:
                        filtros.productoSelect && tipo === "general"
                            ? filtros.productoSelect.idProductos
                            : 0, 
                    idProductoHasta: filtros.productoSelect2
                        ? filtros.productoSelect2.idProductos
                        : 0,
                    idProducto:
                        filtros.productoSelect && tipo === "producto"
                            ? filtros.productoSelect.idProductos
                            : 0,
                    idDeposito: filtros.deposito
                        ? filtros.deposito.idDeposito
                        : 0,
                    idCteTipo: filtros.cteTipo ? filtros.cteTipo.idCteTipo : 0,
                    idRubro: filtros.rubro ? filtros.rubro.idRubro : 0,
                    idSubRubro: filtros.subrubro ? filtros.subrubro.idSubRubro : 0,
                    tipoEstado: 0,
                },
                {}
            );
        };
        /*actualizaComproVentas = (token: string) =>
         {
        alert("Realizando pasaje de comprobantes de ventas. Token: "+token)
           return this.request(
                [],
                RequestMethod.Post,
                {
                    token: token,
                },
                resourcesREST.actualizarVentasStock.nombre,
                {
                   
                },
                {}
            );
        };*/ 

        /*
        *@description actualiza pasaje de ventas
        * @argument token
        */ 
        

    /**
     * @description Cescarga los stock
     * @argument token
     */
    descargaStock =
        (token: string) =>
        (filtros: {
            fechaDesde: any;
            fechaHasta: any;
            codProducto: any;
            productoSelect: Producto;
            productoSelect2?: Producto;
            cteTipo?: TipoComprobante;
            deposito?: Deposito;
            rubro?: Rubro;
            subrubro: SubRubro;
        }) =>
        (tipo: string) => {
            return this.request(
                [],
                RequestMethod.Post,
                {
                    token: token,
                },
                resourcesREST.descargarStock.nombre,
                {
                    fechaDesde: this.utilsService.formatearFecha("yyyy-mm-dd")(
                        filtros.fechaDesde
                    ),
                    fechaHasta: this.utilsService.formatearFecha("yyyy-mm-dd")(
                        filtros.fechaHasta
                    ),
                    idProductoDesde:
                        filtros.productoSelect && tipo === "general"
                            ? filtros.productoSelect.idProductos
                            : 0,
                    idProductoHasta: filtros.productoSelect2
                        ? filtros.productoSelect2.idProductos
                        : 0,
                    idProducto:
                        filtros.productoSelect && tipo === "producto"
                            ? filtros.productoSelect.idProductos
                            : 0,
                    idDeposito: filtros.deposito  ? filtros.deposito.idDeposito : 0,
                    idCteTipo: filtros.cteTipo ? filtros.cteTipo.idCteTipo : 0,
                    idRubro: filtros.rubro ? filtros.rubro.idRubro : 0,
                    idSubRubro: filtros.subrubro ? filtros.subrubro.idSubRubro : 0,
                    tipoEstado: 0,
                },
                {
                    tipo,
                },
                true
            );
        };
    getProximoCodigoProducto = (token) =>
        this.request(
            [],
            RequestMethod.Get,
            {
                token: token,
            },
            resourcesREST.proximoCodigo.nombre,
            {},
            {}
        );

    /**
     * @description Obtiene un producto por su ID
     * @argument token
     * @argument idProducto
     */
    getBuscarProducto =
        (token: string) =>
        (idProducto: any) =>
        (idListaPrecio?) =>
        (idMoneda) =>
        (idSisTipoOperacion?) =>
        (idCteTipo?) =>
        (diferenciaFechas?) =>
        (esCanje?) =>
        (codigoCereal?) =>
        (esPesificado?) => {
            return this.request(
                [idProducto],
                RequestMethod.Get,
                {
                    token: token,
                },
                resourcesREST.buscaPendientes.nombre,
                {},
                idListaPrecio
                    ? {
                          idSisTipoModelo: sisTipoModelos.neto,
                          modulo: sisModulos.venta,
                          listaPrecio: idListaPrecio,
                          idMoneda: idMoneda,
                          idSisTipoOperacion: idSisTipoOperacion,
                          idCteTipo: idCteTipo,
                          diferenciaFechas: diferenciaFechas,
                          esCanje: esCanje,
                          codigoCereal: codigoCereal,
                          esPesificado: esPesificado,
                      }
                    : {
                          idSisTipoModelo: sisTipoModelos.neto,
                          modulo: sisModulos.compra,
                          idMoneda: idMoneda,
                      }
            );
        };

    getImputacionesByComp = (token, compBusc: ComprobanteEncabezado) =>
        this.request(
            [],
            RequestMethod.Get,
            {
                token: token,
            },
            resourcesREST.imputaciones.nombre,
            {},
            {
                idFactCab: compBusc.idFactCab,
            }
        );

    setImputaciones = (
        token,
        idFactDetalle,
        idFactDetalleImputa,
        cantidadImputada
    ) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.imputaciones.nombre,
            {},
            {
                idFactDetalle: idFactDetalle,
                idFactDetalleImputa: idFactDetalleImputa,
                cantidadImputada: cantidadImputada,
            }
        );
    };

    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////              MÉTODOS REUTILIZABLES          ///////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    /**
     * @description Obtiene una lista de un recurso especificado
     * @argument token
     * @argument resource Ejemplos: 'cteTipo', 'rubros'
     * @argument queryParams Query params para setearle a la consulta
     */
    getResourceList =
        (token: string) =>
        (nombreRecurso: string) =>
        (params?) =>
        (tipoParam?) =>
            this.request(
                params && tipoParam && tipoParam === "path" ? params : [],
                RequestMethod.Get,
                {
                    token: token,
                },
                nombreRecurso,
                {},
                params && tipoParam && tipoParam === "query" ? params : {}
            );

    /**
     * @description Borrar un recurso a partir de us id
     * @argument token
     * @argument idRecurso
     */
    removeRecurso = (idRecurso: any) => (token) => (nombreRecurso) => {
        return this.request(
            [idRecurso.toString()],
            RequestMethod.Delete,
            {
                token: token,
            },
            nombreRecurso,
            {},
            {}
        ).toPromise();
    };

    /**
     * @description Registra un recurso cualquiera
     * @argument recurso
     * @argument headers Json que en general tiene el token (en usuario suele tener la clave)
     * @argument nombreRecurso
     */
    registrarRecurso = (recurso: any) => (headers) => (nombreRecurso) => {
        return this.request(
            [],
            RequestMethod.Post,
            headers,
            nombreRecurso,
            this.generarBodyRegistrarRecurso(recurso)(nombreRecurso),
            {}
        ).toPromise();
    };

    /**
     * @description Editar un recurso cualquiera
     * @argument recurso
     * @argument headers
     * @argument nombreRecurso
     */
    editarRecurso = (recurso: any) => (headers) => (nombreRecurso) => {
        return this.request(
            [],
            RequestMethod.Put,
            headers,
            nombreRecurso,
            this.generarBodyEditarRecurso(recurso)(nombreRecurso),
            {}
        ).toPromise();
    };

    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////             MÉTODOS DE SOPORTE              ///////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    /**
     * Genero y retorno el body para enviar a una consulta POST de registrar un recurso
     */
    generarBodyRegistrarRecurso = (recurso: any) => (nombreRecurso) => {
        if (nombreRecurso === resourcesREST.usuarios.nombre) {
            return {
                nombre: recurso.nombre,
                usuario: recurso.usuario,
                apellido: recurso.apellido,
                telefono: recurso.telefono,
                perfil: recurso.perfil.idPerfil,
                mail: recurso.email,
                observaciones: recurso.observaciones,
                listaPrecios: recurso.listaPrecios.map((l) => ({
                    idListaPrecio: l.idListaPrecio,
                })),
                idPtoVenta:
                    recurso.ptoVentas && recurso.ptoVentas.length === 1
                        ? recurso.ptoVentas[0].idPtoVenta
                        : null,
            };
        }

        if (nombreRecurso === resourcesREST.subRubros.nombre) {
            return {
                idRubro: recurso.rubro.idRubro,
                codigo: recurso.codigoSubRubro,
                descripcion: recurso.descripcion,
            };
        }

        if (nombreRecurso === resourcesREST.rubros.nombre) {
            return {
                codigo: recurso.codigoRubro,
                descripcion: recurso.descripcion,
            };
        }

        if (nombreRecurso === resourcesREST.cteTipo.nombre) {
            return {
                codigoComp: recurso.codigoComp,
                descCorta: recurso.descCorta,
                descripcion: recurso.descripcion,
                cursoLegal: recurso.cursoLegal ? true : false,
                requiereFormaPago: recurso.requiereFormaPago ? true : false,
                surenu: recurso.surenu,
                observaciones: recurso.observaciones
                    ? recurso.observaciones
                    : "",
                idSisComprobante: recurso.comprobante.idSisComprobantes,
                letras: recurso.letrasCodigos.map((lc) => ({
                    idSisLetra: lc.letra.idSisLetra,
                    codigoAfip: lc.codigoAfip.idSisCodigoAfip,
                })),
            };
        }

        if (nombreRecurso === resourcesREST.formaPago.nombre) {
            return {
                tipo: recurso.tipo.idSisFormaPago,
                descripcion: recurso.descripcion,
                // idListaPrecio: recurso.listaPrecio.idListaPrecio,
                formaPagoDet: recurso.detalles.map((det: DetalleFormaPago) => ({
                    cantDias: det.cantDias ? det.cantDias : 0,
                    porcentaje: det.porcentaje ? det.porcentaje : 0,
                    detalle: det.detalle ? det.detalle : "",
                    ctaContable: det.planCuenta
                        ? det.planCuenta.planCuentas
                        : "",
                })),
                listaPrecios: recurso.listaPrecios.map((lp) => ({
                    idListaPrecio: lp.idListaPrecio,
                })),
            };
        }

        if (nombreRecurso === resourcesREST.productos.nombre) {
            return {
                codProducto: recurso.codProducto,
                codProductoOriginal: recurso.codProductoOriginal,
                codigoBarra: recurso.codigoBarra,
                descripcionCorta: recurso.descripcionCorta,
                descripcion: recurso.descripcion,
                modeloImputacion: recurso.modeloCab.idModeloCab,
                aptoCanje: recurso.aptoCanje,
                stock: recurso.stock,
                trazable: recurso.trazable,
                traReceta: recurso.traReceta,
                traInforma: recurso.traInforma,
                gtin: recurso.gtin,
                puntoPedido: recurso.puntoPedido,
                costoReposicion: recurso.costoReposicion,
                precioVentaProv: recurso.precioVentaProv,
                observaciones: recurso.observaciones,
                idSubRubro: recurso.subRubro.idSubRubro,
                idIva: recurso.IVA.idIVA,
                idUnidadCompra: recurso.unidadCompra.idUnidad,
                idUnidadVenta: recurso.unidadVenta.idUnidad,
                idMarca: recurso.marca ? recurso.marca.idMarcas : null,
                cultivos: recurso.cultivos.map((cul) => ({
                    idCultivo: cul.idCultivo,
                })),
                idMoneda: recurso.moneda.idMoneda,
            };
        }

        if (nombreRecurso === resourcesREST.depositos.nombre) {
            return {
                codigoDep: recurso.codigoDep,
                descripcion: recurso.descripcion,
                domicilio: recurso.domicilio,
                codigoPostal: recurso.codigoPostal,
            };
        }

        if (nombreRecurso === resourcesREST.listaPrecios.nombre) {
            return {
                codLista: recurso.codigoLista,
                fechaAlta: `${recurso.fechaAlta.year}-${recurso.fechaAlta.month}-${recurso.fechaAlta.day}`,
                vigenciaDesde: `${recurso.vigenciaDesde.year}-${recurso.vigenciaDesde.month}-${recurso.vigenciaDesde.day}`,
                vigenciaHasta: `${recurso.vigenciaHasta.year}-${recurso.vigenciaHasta.month}-${recurso.vigenciaHasta.day}`,
                activa: recurso.activa ? true : false,
                idPadronCliente: recurso.idPadronCliente,
                idPadronRepresentante: recurso.idPadronRepresentante,
                porc1: recurso.porc1,
                condiciones: recurso.condiciones,
                idMoneda: recurso.idMoneda.idMoneda,
                preciosDet: recurso.listaPrecioDetCollection.map(
                    (detalle: DetalleProducto) => {
                        return {
                            precio: detalle.precio,
                            cotaInf: detalle.cotaInf,
                            cotaSup: detalle.cotaSup,
                            observaciones: detalle.observaciones
                                ? detalle.observaciones
                                : null,
                            idProducto: detalle.producto.idProductos,
                            cotaInfPorc: detalle.cotaInfPorce
                                ? detalle.cotaInfPorce
                                : 0,
                            cotaSupPorc: detalle.cotaSupPorce
                                ? detalle.cotaSupPorce
                                : 0,
                        };
                    }
                ),
            };
        }

        if (nombreRecurso === resourcesREST.modeloImputacion.nombre) {
            return {
                descripcion: recurso.descripcion,
                modeloDetalle: recurso.modeloDetalle.map((det) => ({
                    ctaContable: det.planCuenta
                        ? det.planCuenta.planCuentas
                        : null,
                    orden: det.orden,
                    descripcionDetalle: det.descripcion,
                    dh: det.dh,
                    prioritario: det.prioritario ? true : false,
                    valor: det.valor,
                    operador: det.operador,
                    idSisTipoModelo: det.idSisTipoModelo,
                    modulo: det.idSisModulo ? det.idSisModulo : null,
                    idLibro: det.idLibro ? det.idLibro : null,
                })),
            };
        }

        if (nombreRecurso === resourcesREST.cteFecha.nombre) {
            return {
                puntoVenta: recurso.puntoVenta,
                fechaApertura: this.utilsService.formatearFecha("yyyy-mm-dd")(
                    recurso.fechaApertura
                ),
                fechaCierre: this.utilsService.formatearFecha("yyyy-mm-dd")(
                    recurso.fechaCierre
                ),
                idCteTipo:
                    recurso && recurso.cteTipo ? recurso.cteTipo.idCteTipo : -1,
            };
        }

        if (nombreRecurso === resourcesREST.cteNumerador.nombre) {
            return {
                descripcion: recurso.descripcion,
                fechaApertura: this.utilsService.formatearFecha("yyyy-mm-dd")(
                    recurso.fechaApertura
                ),
                fechaCierre: this.utilsService.formatearFecha("yyyy-mm-dd")(
                    recurso.fechaCierre
                ),
                numerador: recurso.numerador,
                idCteTipoSisLetra: recurso.letrasCodigos.idCteTipoSisLetra,
                idPtoVenta:
                    recurso.ptoVenta && recurso.ptoVenta.idPtoVenta
                        ? recurso.ptoVenta.idPtoVenta
                        : null,
                ptoVenta:
                    recurso.ptoVenta && !recurso.ptoVenta.idPtoVenta
                        ? recurso.ptoVenta.ptoVenta
                        : null,
                cai: recurso.cai,
                vtoCai: this.utilsService.formatearFecha("yyyy-mm-dd")(
                    recurso.vtoCai
                ),
                electronico: recurso.electronico,
            };
        }

        if (nombreRecurso === resourcesREST.categorias.nombre) {
            return {
                codigo: recurso.codigo,
                descripcion: recurso.descripcion,
                idSisCategoria: recurso.sisCategoria.idSisCategoria,
            };
        }

        if (nombreRecurso === resourcesREST.cliente.nombre) {
            return {
                padronCodigoVendedor: recurso.vendedor.padronGral.idPadronGral,
                padronCodigoCliente: recurso.padronGral.idPadronGral,
                idCategoriaCliente: recurso.padronGral.categoria.idCategoria,
                idCategoriaVendedor:
                    recurso.vendedor.padronGral.categoria.idCategoria,
                porcentaje: 0,
            };
        }

        if (nombreRecurso === resourcesREST.cultivo.nombre) {
            return {
                descripcion: recurso.descripcion,
                cosecha: recurso.cosecha,
            };
        }

        if (nombreRecurso === resourcesREST.marcas.nombre) {
            return {
                descripcion: recurso.descripcion,
            };
        }

        if (nombreRecurso === resourcesREST.proveedores.nombre) {
            console.log(recurso);
            return {
                idPadron: recurso.padronAux.padronCodigo,
                nombre: recurso.padronAux.padronNombre,
                apellido: recurso.padronAux.padronApelli,
                cuit: recurso.padronAux.cuit,
                domicilio: recurso.padronAux.padronDomicilio,
                nro: recurso.padronAux.padronNro,
                localidad: recurso.padronAux.codigoPostal,
                idCategoria: recurso.padronGral.categoria.idCategoria,
                idSisSitIVA: recurso.padronGral.sisSitIVA
                    ? recurso.padronGral.sisSitIVA.idSisSitIVA
                    : null,
                iibbRet: recurso.iibbRet,
                iibbPer: recurso.iibbPer,
            };
        }

        if (nombreRecurso === resourcesREST.relacionesCanje.nombre) {
            return {
                codigoCosecha: recurso.codigoCosecha,
                codigoClase: recurso.codigoClase,
                descripcion: recurso.descripcion,
                factor: recurso.factor,
                idSisCanje: recurso.idSisCanje.idSisCanje,
            };
        }

        if (nombreRecurso === resourcesREST.sisCotDolar.nombre) {
            return {
                fechaCoti: this.utilsService.formatearFecha("yyyy-mm-dd")(
                    recurso.fechaCotizacion
                ),
                cotizacion: recurso.cotizacion,
            };
        }
    };

    /**
     * Genero y retorno el body para enviar a una consulta POST de editar un recurso
     */
    generarBodyEditarRecurso = (recurso: any) => (nombreRecurso) => {
        if (nombreRecurso === resourcesREST.usuarios.nombre) {
            return {
                idUsuario: recurso.idUsuario,
                usuario: recurso.usuario,
                apellido: recurso.apellido,
                nombre: recurso.nombre,
                telefono: recurso.telefono,
                observaciones: recurso.observaciones,
                perfil: recurso.perfil.idPerfil,
                mail: recurso.email,
                listaPrecios: recurso.listaPrecios.map((l) => ({
                    idListaPrecio: l.idListaPrecio,
                })),
                idPtoVenta:
                    recurso.ptoVentas && recurso.ptoVentas.length === 1
                        ? recurso.ptoVentas[0].idPtoVenta
                        : null,
            };
        }

        if (nombreRecurso === resourcesREST.subRubros.nombre) {
            return {
                idSubRubro: recurso.idSubRubro,
                codigo: recurso.codigoSubRubro,
                descripcion: recurso.descripcion,
            };
        }

        if (nombreRecurso === resourcesREST.rubros.nombre) {
            return {
                idRubro: recurso.idRubro,
                codigo: recurso.codigoRubro,
                descripcion: recurso.descripcion,
            };
        }

        if (nombreRecurso === resourcesREST.cteTipo.nombre) {
            return {
                idCteTipo: recurso.idCteTipo,
                codigoComp: recurso.codigoComp,
                descCorta: recurso.descCorta,
                descripcion: recurso.descripcion,
                cursoLegal: recurso.cursoLegal ? true : false,
                requiereFormaPago: recurso.requiereFormaPago ? true : false,
                surenu: recurso.surenu,
                observaciones: recurso.observaciones
                    ? recurso.observaciones
                    : "",
                idSisComprobante: recurso.comprobante.idSisComprobantes,
                letras: recurso.letrasCodigos.map((lc) => ({
                    idSisLetra: lc.letra.idSisLetra,
                    codigoAfip: lc.codigoAfip.idSisCodigoAfip,
                })),
            };
        }

        if (nombreRecurso === resourcesREST.formaPago.nombre) {
            return {
                idFormaPago: recurso.idFormaPago,
                tipo: recurso.tipo.idSisFormaPago,
                descripcion: recurso.descripcion,
                // idListaPrecio: recurso.listaPrecio.idListaPrecio,
                formaPagoDet: recurso.detalles.map((det: DetalleFormaPago) => ({
                    cantDias: det.cantDias ? det.cantDias : 0,
                    porcentaje: det.porcentaje ? det.porcentaje : 0,
                    detalle: det.detalle ? det.detalle : "",
                    ctaContable: det.planCuenta
                        ? det.planCuenta.planCuentas
                        : "",
                })),
                listaPrecios: recurso.listaPrecios.map((lp) => ({
                    idListaPrecio: lp.idListaPrecio,
                })),
            };
        }

        if (nombreRecurso === resourcesREST.productos.nombre) {
            return {
                idProducto: recurso.idProductos,
                codProducto: recurso.codProducto,
                codProductoOriginal: recurso.codProductoOriginal,
                codigoBarra: recurso.codigoBarra,
                descripcionCorta: recurso.descripcionCorta,
                descripcion: recurso.descripcion,
                modeloImputacion: recurso.modeloCab.idModeloCab,
                aptoCanje: recurso.aptoCanje,
                stock: recurso.stock,
                trazable: recurso.trazable,
                traReceta: recurso.traReceta,
                traInforma: recurso.traInforma,
                gtin: recurso.gtin,
                puntoPedido: recurso.puntoPedido,
                costoReposicion: recurso.costoReposicion,
                precioVentaProv: recurso.precioVentaProv,
                observaciones: recurso.observaciones,
                idSubRubro: recurso.subRubro.idSubRubro,
                idIva: recurso.IVA.idIVA,
                idUnidadCompra: recurso.unidadCompra.idUnidad,
                idUnidadVenta: recurso.unidadVenta.idUnidad,
                idMarca: recurso.marca ? recurso.marca.idMarcas : null,
                cultivos: recurso.cultivos.map((cul) => ({
                    idCultivo: cul.idCultivo,
                })),
                idMoneda: recurso.moneda.idMoneda,
            };
        }

        if (nombreRecurso === resourcesREST.depositos.nombre) {
            return {
                idDeposito: recurso.idDeposito,
                codigoDep: recurso.codigoDep,
                descripcion: recurso.descripcion,
                domicilio: recurso.domicilio,
                codigoPostal: recurso.codigoPostal,
            };
        }

        if (nombreRecurso === resourcesREST.listaPrecios.nombre) {
            return {
                idLista: recurso.idListaPrecio,
                fechaAlta: `${recurso.fechaAlta.year}-${recurso.fechaAlta.month}-${recurso.fechaAlta.day}`,
                vigenciaDesde: `${recurso.vigenciaDesde.year}-${recurso.vigenciaDesde.month}-${recurso.vigenciaDesde.day}`,
                vigenciaHasta: `${recurso.vigenciaHasta.year}-${recurso.vigenciaHasta.month}-${recurso.vigenciaHasta.day}`,
                condiciones: recurso.condiciones,
                preciosDet: recurso.listaPrecioDetCollection.map(
                    (detalle: DetalleProducto) => {
                        return {
                            precio: detalle.precio,
                            cotaInf: detalle.cotaInf,
                            cotaSup: detalle.cotaSup,
                            observaciones: detalle.observaciones
                                ? detalle.observaciones
                                : null,
                            idProducto: detalle.producto.idProductos,
                            cotaInfPorc: detalle.cotaInfPorce
                                ? detalle.cotaInfPorce
                                : 0,
                            cotaSupPorc: detalle.cotaSupPorce
                                ? detalle.cotaInfPorce
                                : 0,
                        };
                    }
                ),
                idPadronCliente: recurso.idPadronCliente,
                idPadronRepresentante: recurso.idPadronRepresentante,
                porc1: recurso.porc1,
            };
        }

        if (nombreRecurso === resourcesREST.modeloImputacion.nombre) {
            return {
                idModeloCab: recurso.idModeloCab,
                descripcion: recurso.descripcion,
                modeloDetalle: recurso.modeloDetalle.map((det) => ({
                    ctaContable: det.planCuenta
                        ? det.planCuenta.planCuentas
                        : null,
                    orden: det.orden,
                    descripcionDetalle: det.descripcion,
                    dh: det.dh,
                    prioritario: det.prioritario ? true : false,
                    valor: det.valor ? det.valor : 0,
                    operador: det.operador,
                    idSisTipoModelo: det.idSisTipoModelo,
                    modulo: det.idSisModulo ? det.idSisModulo : null,
                    idLibro: det.idLibro ? det.idLibro : null,
                })),
            };
        }

        if (nombreRecurso === resourcesREST.cteFecha.nombre) {
            return {
                idCteFecha: recurso.idCteFechas,
                puntoVenta: recurso.puntoVenta,
                fechaApertura: this.utilsService.formatearFecha("yyyy-mm-dd")(
                    recurso.fechaApertura
                ),
                fechaCierre: this.utilsService.formatearFecha("yyyy-mm-dd")(
                    recurso.fechaCierre
                ),
                idCteTipo:
                    recurso && recurso.cteTipo ? recurso.cteTipo.idCteTipo : -1,
            };
        }

        if (nombreRecurso === resourcesREST.cteNumerador.nombre) {
            return {
                idCteNumerador: recurso.idCteNumerador,
                descripcion: recurso.descripcion,
                fechaApertura: this.utilsService.formatearFecha("yyyy-mm-dd")(
                    recurso.fechaApertura
                ),
                fechaCierre: this.utilsService.formatearFecha("yyyy-mm-dd")(
                    recurso.fechaCierre
                ),
                numerador: recurso.numerador,
                idCteTipoSisLetra: recurso.letrasCodigos.idCteTipoSisLetra,
                idPtoVenta:
                    recurso.ptoVenta && recurso.ptoVenta.idPtoVenta
                        ? recurso.ptoVenta.idPtoVenta
                        : null,
                ptoVenta:
                    recurso.ptoVenta && !recurso.ptoVenta.idPtoVenta
                        ? recurso.ptoVenta.ptoVenta
                        : null,
                cai: recurso.cai,
                vtoCai: this.utilsService.formatearFecha("yyyy-mm-dd")(
                    recurso.vtoCai
                ),
                electronico: recurso.electronico,
            };
        }

        if (nombreRecurso === resourcesREST.categorias.nombre) {
            return {
                idCategoria: recurso.idCategoria,
                codigo: recurso.codigo,
                descripcion: recurso.descripcion,
                idSisCategoria: recurso.sisCategoria.idSisCategoria,
            };
        }

        if (nombreRecurso === resourcesREST.cliente.nombre) {
            return {
                padronCodigoVendedor: recurso.vendedor.padronGral.idPadronGral,
                padronCodigoCliente: recurso.padronGral.idPadronGral,
                idCategoriaCliente: recurso.padronGral.categoria.idCategoria,
                idCategoriaVendedor:
                    recurso.vendedor.padronGral.categoria.idCategoria,
                porcentaje: 0,
            };
        }

        if (nombreRecurso === resourcesREST.cultivo.nombre) {
            return {
                idCultivo: recurso.idCultivo,
                descripcion: recurso.descripcion,
                cosecha: recurso.cosecha,
            };
        }

        if (nombreRecurso === resourcesREST.marcas.nombre) {
            return {
                idMarca: recurso.idMarcas,
                descripcion: recurso.descripcion,
            };
        }

        if (nombreRecurso === resourcesREST.proveedores.nombre) {
            return {
                idPadronProveedor: recurso.idPadronProveedor,
                nombre: recurso.padronGral.nombre,
                apellido: recurso.padronGral.apellido,
                cuit: recurso.padronGral.cuit,
                domicilio: recurso.padronGral.domicilio,
                nro: recurso.padronGral.nro,
                localidad: recurso.padronGral.localidad,
                idCategoria: recurso.padronGral.categoria.idCategoria,
                idSisSitIVA: recurso.padronGral.sisSitIVA.idSisSitIVA,
                iibbRet: recurso.iibbRet,
                iibbPer: recurso.iibbPer,
            };
        }

        if (nombreRecurso === resourcesREST.relacionesCanje.nombre) {
            return {
                idRelacionesCanje: recurso.idRelacionSisCanje,
                codigoCosecha: recurso.codigoCosecha,
                codigoClase: recurso.codigoClase,
                descripcion: recurso.descripcion,
                factor: recurso.factor,
                idSisCanje: recurso.idSisCanje.idSisCanje,
            };
        }

        if (nombreRecurso === resourcesREST.sisCotDolar.nombre) {
            return {
                idSisCotDolar: recurso.idSisCotDolar,
                fechaCoti: this.utilsService.formatearFecha("yyyy-mm-dd")(
                    recurso.fechaCotizacion
                ),
                cotizacion: recurso.cotizacion,
            };
        }
    };

    /**
     * Graba un contrato (POST Abm), y guarda el docx
     */
    grabarContrato = (fileDocx, contrato: Contrato, token) => {
        let formData = new FormData();

        formData.append(
            "file",
            new Blob([fileDocx], {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            })
        );

        formData.append("contratoNro", contrato.contratoNro);
        formData.append("idPadron", contrato.idPadron.toString());
        formData.append(
            "fechaNacimiento",
            this.utilsService.formatearFecha("yyyy-mm-dd")(
                contrato.fechaNacimiento
            )
        );
        formData.append("nacionalidad", contrato.nacionalidad);
        formData.append("profesion", contrato.profesion);
        formData.append("documento", contrato.documento);
        formData.append("padre", contrato.padre);
        formData.append("madre", contrato.madre);
        formData.append("kilos", contrato.kilos.toString());
        formData.append("cosecha", contrato.cosecha.toString());
        formData.append("observaciones", contrato.observaciones);
        formData.append("idSisCanje", contrato.sisCanje.idSisCanje.toString());
        formData.append(
            "fechaVto",
            this.utilsService.formatearFecha("yyyy-mm-dd")(contrato.fechaVto)
        );
        formData.append("padronNombre", contrato.padronNombre.toString());
        formData.append("padronApelli", contrato.padronApelli.toString());

        const options = new RequestOptions({ headers: new Headers({ token }) });

        return this.http
            .post(
                `${environment.facturacionRest.urlBase}/contratos`,
                formData,
                options
            )
            .map((res) => res.json())
            .catch((error) => Observable.throw(error));
    };

    /**
     * Genera un contrato a partir de un nuevo comprobante
     */
    generarContratoByComprobante = (
        cliente: Padron,
        kilosCanjeReferencia: number,
        sisCanje: SisCanje,
        token
    ) => {
        return this.http
            .post(
                `${environment.facturacionRest.urlBase}/contratos/generar`,
                {
                    idPadron: cliente.padronCodigo,
                    kilos: kilosCanjeReferencia,
                    documento: cliente.cuit,
                    idSisCanje: sisCanje.idSisCanje,
                    fechaVto: this.utilsService.formatearFecha("yyyy-mm-dd")(
                        sisCanje.fechaVto
                    ),
                    padronNombre: cliente.padronNombre,
                    padronApelli: cliente.padronApelli,
                },
                new RequestOptions({ headers: new Headers({ token }) })
            )
            .map((res) => res.json())
            .catch((error) => Observable.throw(error));
    };

    /**
     * Edita un contrato (PUT Abm), y guarda/reemplaza el docx
     */
    editarContrato = (fileDocx, contrato: Contrato, token) => {
        let formData = new FormData();
        formData.append(
            "file",
            fileDocx
                ? new Blob([fileDocx], {
                      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  })
                : null
        );

        formData.append("idContrato", contrato.idContratos.toString());
        formData.append("contratoNro", contrato.contratoNro);
        formData.append("idPadron", contrato.idPadron.toString());
        formData.append(
            "fechaNacimiento",
            this.utilsService.formatearFecha("yyyy-mm-dd")(
                contrato.fechaNacimiento
            )
        );
        formData.append("nacionalidad", contrato.nacionalidad);
        formData.append("profesion", contrato.profesion);
        formData.append("documento", contrato.documento);
        formData.append("padre", contrato.padre);
        formData.append("madre", contrato.madre);
        formData.append("kilos", contrato.kilos.toString());
        formData.append("cosecha", contrato.cosecha.toString());
        formData.append("observaciones", contrato.observaciones);
        formData.append("idSisCanje", contrato.sisCanje.idSisCanje.toString());
        formData.append(
            "fechaVto",
            this.utilsService.formatearFecha("yyyy-mm-dd")(contrato.fechaVto)
        );
        formData.append("editaArchivo", fileDocx ? "1" : "0");
        formData.append("padronNombre", contrato.padronNombre.toString());
        formData.append("padronApelli", contrato.padronApelli.toString());

        const options = new RequestOptions({ headers: new Headers({ token }) });

        return this.http
            .put(
                `${environment.facturacionRest.urlBase}/contratos`,
                formData,
                options
            )
            .map((res) => res.json())
            .catch((error) => Observable.throw(error));
    };

    downloadContrato = (token, idContrato) => {
        const options = new RequestOptions({
            headers: new Headers({ token }),
            responseType: ResponseContentType.ArrayBuffer,
        });

        return this.http.post(
            `${environment.facturacionRest.urlBase}/descargarContrato?idContrato=${idContrato}`,
            null,
            options
        );
    };

    /**
     * Borrar un comprobante
     */
    borrarComprobante = (token, idFactCab) =>
       //agregar la clave para borrado  token, idFactCab, clave
        this.http.delete(
            `${environment.facturacionRest.urlBase}/borraComprobante/${idFactCab}`,
            new RequestOptions({
                headers: new Headers({ token }),
            })
        );

    imprimirLibrosIva = (token, modulo, fecDesde, fecHasta) =>
        this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            `descargarLibroIva`,
            {
                modulo,
                fechaDesde:
                    this.utilsService.formatearFecha("yyyy-mm-dd")(fecDesde),
                fechaHasta:
                    this.utilsService.formatearFecha("yyyy-mm-dd")(fecHasta),
            },
            {},
            true
        );

    /**
     * Relaciona un comprobante con un contrato
     */
    relacionContrato = (token, idComprobante, idContrato) =>
        this.http.post(
            `${environment.facturacionRest.urlBase}/relacionContrato`,
            {
                idComprobante,
                idContrato,
            },
            new RequestOptions({
                headers: new Headers({ token }),
            })
        );

    grabaRemitoInterno = (
        token,
        tipoOperacion: SisTipoOperacion,
        comprobante: Comprobante,
        depositoDestino: Deposito,
        depositoOrigen: Deposito,
        productosPend: ProductoPendiente[],
        lotesTraza: Lote[]
    ) =>
        this.http.post(
            `${environment.facturacionRest.urlBase}/grabaComprobante`,
            {
                idSisTipoOperacion: tipoOperacion.idSisTipoOperacion,
                idSisOperacionComprobante: comprobante.tipo.comprobante
                    .idSisOperacionComprobante
                    ? comprobante.tipo.comprobante.idSisOperacionComprobante
                    : null,
                idDepositoDestino: depositoDestino.idDeposito,
                nombre: `${depositoDestino.descripcion} (Cod: ${depositoDestino.codigoDep})`,
                direccion: depositoDestino.domicilio,
                codigoPostal: depositoDestino.codigoPostal,
                idCteTipo: comprobante.tipo.idCteTipo,
                idModulo: sisModulos.interno,
                codigoAfip: comprobante.letraCodigo
                    ? comprobante.letraCodigo.codigoAfip.codigoAfip
                    : null,
                letra: comprobante.letraCodigo
                    ? comprobante.letraCodigo.letra.letra
                    : null,
                numero: Number(
                    comprobante.numerador.ptoVenta.ptoVenta +
                        comprobante.numerador.numerador
                ),
                idNumero:
                    comprobante.numerador && comprobante.numerador.ptoVenta
                        ? comprobante.numerador.idCteNumerador
                        : null,
                cai: " ",
                codBarra: " ",
                cotDolar: 0,
                cuit: " ",
                caiVto: this.utilsService.formatearFecha("yyyy-mm-dd")(
                    new Date()
                ),
                fechaEmision: this.utilsService.formatearFecha("yyyy-mm-dd")(
                    new Date()
                ),
                fechaVencimiento: this.utilsService.formatearFecha(
                    "yyyy-mm-dd"
                )(new Date()),
                fechaConta: this.utilsService.formatearFecha("yyyy-mm-dd")(
                    new Date()
                ),
                fechaDolar: this.utilsService.formatearFecha("yyyy-mm-dd")(
                    new Date()
                ),
                fechaVencimientoFact: this.utilsService.formatearFecha(
                    "yyyy-mm-dd"
                )(new Date()),
                fechaContaFact: this.utilsService.formatearFecha("yyyy-mm-dd")(
                    new Date()
                ),
                idPadron: 0,
                idMoneda: 1,
                numeroFact: 0,
                precioReferenciaCanje: 0,
                productoCanje: " ",
                sisSitIva: " ",
                interesCanje: 0,
                factCabecera: true,
                factDet: true,
                factFormaPago: false,
                factImputa: true,
                factPie: false,
                grabaFactura: false,
                produmo: true,
                lote: true,
                grillaArticulos: productosPend.map((prod) => ({
                    idProducto: prod.producto.idProductos,
                    articulo: prod.producto.descripcion
                        ? prod.producto.descripcion
                        : "",
                    pendiente: prod.pendiente,
                    precio: prod.precio,
                    porCalc: prod.porCalc ? prod.porCalc : 0,
                    descuento: prod.descuento,
                    ivaPorc: prod.ivaPorc,
                    cantidadBulto: prod.cantBultos,
                    despacho: prod.despacho ? prod.despacho : " ",
                    trazable: prod.producto.trazable,
                    idDeposito: depositoOrigen.idDeposito,
                    observacionDetalle: prod.producto.observaciones
                        ? prod.producto.observaciones
                        : " ",
                    imputacion: prod.imputacion.seleccionada.ctaContable,
                    idFactDetalleImputa: prod.idFactDetalleImputa
                        ? prod.idFactDetalleImputa
                        : null,
                    itemImputada: prod.itemImputada,
                    importe: prod.importe,
                    precioDesc: prod.precio,
                    unidadDescuento: " ",
                    idLibro:
                        prod.imputacion && prod.imputacion.seleccionada
                            ? prod.imputacion.seleccionada.idLibro
                            : null,
                })),
                grillaTrazabilidad: lotesTraza.map((theLote) => {
                    return {
                        nroLote: theLote.nroLote,
                        serie: theLote.serie,
                        fechaElab: this.utilsService.formatearFecha(
                            "yyyy-mm-dd"
                        )(theLote.fechaElab),
                        fechaVto: this.utilsService.formatearFecha(
                            "yyyy-mm-dd"
                        )(theLote.fechaVto),
                        vigencia: true,
                        idProducto: theLote.idProducto,
                        posItem: theLote.item,
                    };
                }),
                grillaSubTotales: [],
                grillaFormaPago: [],
            },
            new RequestOptions({
                headers: new Headers({ token }),
            })
        );

    /**
     * @description Get productos pendientes refactoreado
     * @argument token
     * @argument filtros Lo filtro
     */
    //    getProductosPendientesNew = (
    //         token: string,
    //         proveedor: Padron,
    //         comproRel: ComprobanteRelacionado,
    //         comprobante: Comprobante,
    //         tipoOpSelect: SisTipoOperacion,
    //         listaPrecioSelect: ListaPrecio,
    //         modulo
    //     ) =>
    // this.request(
    //     [],
    //     RequestMethod.Post,
    //     {
    //         token: token,
    //     },
    //     resourcesREST.buscaPendientes.nombre,
    //     {
    //         cteTipo : comproRel.tipo.idCteTipo,
    //         facNumero : comproRel.todosLosPendientes ? 0 : Number(comproRel.puntoVenta + comproRel.numero),
    //         codigoProv : proveedor ? Number(proveedor.padronCodigo) : 0,
    //         pendiente : 1,
    //         idProducto : 0,
    //         idDeposito : 0,
    //         despacho : "",
    //         idMoneda: comprobante && comprobante.moneda ?
    //             comprobante.moneda.idMoneda : 1,
    //         idSisOperacionComprobante:
    //             comprobante && comprobante.tipo && comprobante.tipo.comprobante ?
    //                 comprobante.tipo.comprobante.idSisOperacionComprobante : null,
    //         letra: comprobante.letraCodigo && comprobante.letraCodigo.letra ? comprobante.letraCodigo.letra.letra : null,
    //         idSisTipoOperacion: tipoOpSelect && tipoOpSelect.idSisTipoOperacion ? tipoOpSelect.idSisTipoOperacion : null,
    //         idListaPrecio: listaPrecioSelect && listaPrecioSelect.idListaPrecio ? listaPrecioSelect.idListaPrecio : 0,
    //         modulo
    //     },
    //     {}
    // )

    /**
     * @description Get version actual de la db
     * @argument token
     */

    /*getVersion = (token) => {

        // Creo los headers
        let auxHeaders: Headers = new Headers({token: token});
        auxHeaders.append('Content-Type', 'application/json');

        // Creo la url
        let url: string;
        url = `${environment.facturacionRest.urlBase}/version`;
        let notJson = false;
        // opciones de consulta
        var opciones: RequestOptionsArgs = {
            url: url,
            method: RequestMethod.Get,
            search: null,
            headers: auxHeaders,
            body: {},
            responseType: notJson ? ResponseContentType.ArrayBuffer : ResponseContentType.Json
        };

        var reqOptions = new RequestOptions(opciones);
        var req = new Request(reqOptions);

        return this.http.request(req).timeout(environment.facturacionRest.timeoutDefault).map(
            res => {
                return notJson ? res : res.json()
            }
        );
        
        return this.request(
            [],
            RequestMethod.Get,
            {
                token: token,
            },
            `version`,
            {},
            {}
        )
}*/

    mandaMailPdf = (token) => (idFactCab) => {
        this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            `mandaMailPdf`,
            {
                idFactCab: idFactCab,
            },
            {},
            true
        ).subscribe(() => console.log("buendia"));
    };

    /**
     * @description Obtiene Comprobantes FACTURAS, NOTAS DE CREDITO Y DEBITO
     * @argument token
     */

    buscarComprobantesOrdenesPago = (token, filters: FiltroComprobantePago) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            "buscarComprobantesOrdenesPago",
            filters,
            {}
        ).toPromise();
    };

    /**
     * @description Obtiene las ordenes de Pago filtradas por número de comprobante
     * @argument token
     */

    buscarOrdenesPago = (token, filters: FiltroOrdenPago) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            "buscarOrdenesPago",
            {
                idEmpresa: filters.idEmpresa,
                idFacCab: filters.idFacCab,
                idPadron: filters.idPadron,
                fechaDesde: this.utilsService.formatearFecha("yyyy-mm-dd")(
                    filters.fechaDesde
                ),
                fechaHasta: this.utilsService.formatearFecha("yyyy-mm-dd")(
                    filters.fechaHasta
                ),
            },
            {}
        ).toPromise();
    };

    /**
     * @description Graba las orden de Pago
     * @argument token
     * @argument dataOP
     */

    grabaOrdenesDePago = (token, dataOP: GrabarOrdenesPago) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            "grabaOrdenesDePago",
            dataOP,
            {}
        ).toPromise();
    };

    cotizacionDolar = (token) => {
        return this.request(
            [],
            RequestMethod.Get,
            {
                token: token,
            },
            "sisCotDolar",
            {},
            {}
        ).toPromise();
    };

    obtenerFormaPago = (token) => {
        return this.request(
            [],
            RequestMethod.Get,
            {
                token: token,
            },
            "formaPago",
            {},
            {}
        ).toPromise();
    };

    obtenerTipoOrdenPago = (
        token,
        params: {
            sisModulo: number;
            idCteTipo: number;
            sisTipoOperacion: number;
        } = {
            sisModulo: 1,
            idCteTipo: 85,
            sisTipoOperacion: 14,
        }
    ) => {
        return this.request(
            [],
            RequestMethod.Get,
            {
                token: token,
            },
            "cteTipo",
            {},
            params
        ).toPromise();
    };

    obtenerMonedas = (token) => {
        return this.request(
            [],
            RequestMethod.Get,
            {
                token: token,
            },
            "sisMonedas",
            {},
            {}
        ).toPromise();
    };

    obtenerPdf = (
        token,
        data: {
            idOpCab: number;
            nroCopias?: number;
        }
    ) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            "descargarOrdenPagoPdf",
            {
                idOpCab: data.idOpCab,
                nroCopias: data.nroCopias,
                nombrePdf: null,
            },
            {},
            true
        );
    };

    obtenerTiposOrdenCompra = (token) => {
        return this.request(
            [],
            RequestMethod.Get,
            {
                token: token,
            },
            "cteTipo",
            {},
            { sisTipoOperacion: 14 }
        ).toPromise();
    };

    borrarComprobanteOrdenPago = (token, idOp: number) => {
        return this.request(
            [idOp.toString()],
            RequestMethod.Delete,
            {
                token: token,
            },
            "borraComprobanteOrdenPago",
            {},
            {}
        ).toPromise();
    };
}
