import { LetraCodigo } from "./letraCodigo";

export class FiltroComprobantePago {
    autorizada: string;
    codProductoDesde: string;
    codProductoHasta: string;
    comprobanteModulo: number;
    comprobanteNumero: number;
    comprobanteTipo: number;
    fechaDesde: string;
    fechaHasta: string;
    idDeposito: number;
    idEstado: number;
    idProducto: number;
    idSisTipoOperacion: number;
    idVendedor: number;
    padCodigo: number;
    pendiente: number;
    moneda: number;
    despacho: string;
    listaPrecios: number;

    constructor() {
        this.autorizada = "Todas";
        this.codProductoDesde = "null";
        this.codProductoHasta = "null";
        this.comprobanteModulo = 1;
        this.comprobanteNumero = 0;
        this.comprobanteTipo = 73;
        this.fechaDesde = "1900-01-01";
        this.fechaHasta = "2100-01-01";
        this.idDeposito = 0;
        this.idEstado = 0;
        this.idProducto = 0;
        this.idSisTipoOperacion = 1;
        this.idVendedor = 0;
        this.padCodigo = null;
        this.pendiente = 1;
        this.moneda = 13;
        this.despacho = "";
        this.listaPrecios = 0;
    }
}
export interface ItemComprobantePago {
    autorizada: string;
    canjeInsumos: boolean;
    comprobante: string;
    cotDolar: number;
    cuit: string;
    // detalle: Array<DetalleComprobante>;
    dolarizadoAlVto: boolean;
    fechaEmi: string;
    fechaVence: string;
    formaPago: Array<FormaPagoComprobante>;
    idCteTipo: number;
    idFactCab: number;
    idPadron: number;
    idmoneda: number;
    idFormaPago: number;
    importeNeto: number;
    importePendiente:number;
    importeTotal: number;
    imputa: Array<any>;
    imputada: string;
    interesMensualCompra: number;
    kilosCanje: number;
    master: Array<any>;
    modulo: string;
    moneda: string;
    nombre: string;
    numero: number;
    permiteBorrado: string;
    pesificado: boolean;
    pie: Array<PieComprobantePago>;
    tipoCambio: string;
    tipoOperacion: string;
    suPagoUsd?: number;
    suPagoPesos?: number;
}
export class FormaPago {
    descripcion: string;
    editar: boolean;
    formaPagoDet: Array<FormaPagoDet>;
    idFormaPago: number;
    listaPrecios: Array<any>;
    tipo: {
        descripcion: string;
        idSisFormaPago: number;
    };

    constructor() {
        this.descripcion = "";
        this.editar = false;
        this.formaPagoDet = [];
        this.idFormaPago = 0;
        this.listaPrecios = [];
        this.tipo = {
            descripcion: "",
            idSisFormaPago: 0,
        };
    }
}

export class FormaPagoDet {
    cantDias: number;
    ctaContable: string;
    detalle: string;
    idFormaPagoDet: number;
    planCuenta: {
        planCuentas: number;
        planDescripcion: string;
    };
    porcentaje: number;
    constructor() {
        this.cantDias = 0;
        this.ctaContable = "";
        this.detalle = "";
        this.idFormaPagoDet = 0;
        this.planCuenta = {
            planCuentas: 0,
            planDescripcion: "",
        };
        this.porcentaje = 0;
    }
}

export interface FormaPagoComprobante {
    ctaContable: string;
    detalle: string;
    diasPago: number;
    fechaPago: string;
    idFactCab: number;
    idFactFormaPago: number;
    idFormaPago: number;
    importe: number;
    porcentaje: number;
}

// export interface DetalleComprobante {
//     articulo: string;
//     codProducto: string;
//     comprobante: string;
//     deposito: number;
//     descuento: string;
//     dolar: number;
//     factCab: number;
//     fechaEmision: string;
//     importe: number;
//     ivaPorc: number;
//     moneda: string;
//     numero: number;
//     original: number;
//     pendiente: number;
//     porCalc: number;
//     precio: number;
//     precioDesc: number;
//     unidadDescuento: string;
// }

interface PieComprobantePago {
    baseImponible: number;
    ctaContable: string;
    detalle: string;
    idConceptos: number;
    idFactCab: number;
    idFactPie: number;
    idSisTipoModelo: number;
    operador: string;
    porcentaje: number;
}

export interface FiltroOrdenPago {
    idEmpresa: number;
    idFacCab: number;
    idPadron: number;
    fechaDesde: string;
    fechaHasta: string;
}

export interface ItemListOrdenPago {
    IngresosBrutos: number;
    SubtOp: number;
    TotDifCotizacion: number;
    TotIvaDifCotizacion: number;
    TotalCompra: number;
    cuit: string;
    detalle: Array<DetalleOP>;
    fechaAutorizacion: string;
    fechaEmision: string;
    formaPago: Array<FormaPagoOP>;
    idCteTipo: number;
    idOPCab: number;
    imputa: Array<any>;
    master: Array<any>;
    nombre: string;
    numero: number;
    pie: Array<PieOrdenPago>;
}

interface PieOrdenPago {
    alicuota: number;
    detalle: string;
    idImpuesto: number;
    idOPCab: number;
    idOPPie: number;
    importeBase: number;
    importeImpuesto: number;
    numeroRetencion: number;
}

export interface FormaPagoOP {
    detalle: string;
    fechaAcreditacion: string;
    idFormaPago: number;
    idOPCab: number;
    idOPFormaPago: number;
    importe: number;
    numero: number;
}

interface DetalleOP {
    cotDolarFact: number;
    difCotizacion: number;
    idFactCab: number;
    idFormaPago: number;
    idIVA: number;
    idOPCab: number;
    idOPDetalle: number;
    importePesificado: number;
    item: number;
    ivaDifCotizacion: number;
    pagadoDolar: number;
}

export class TotalesPagoProveedores {
    importeDolar: number;
    importePesos: number;
    dolarOPAplicadas: number;
    pesosOPAplicadas: number;
    saldoPesos: number;
    saldoDolar: number;
    constructor() {
        this.importeDolar = 0;
        this.importePesos = 0;
        this.dolarOPAplicadas = 0;
        this.pesosOPAplicadas = 0;
        this.saldoPesos = 0;
        this.saldoDolar = 0;
    }
}

export class TotalesOrdenesPago {
    importeDolar: number;
    importePesificado: number;
    pendienteUsd: number;
    pendientePesos: number;
    suPagoUsd: number;
    suPagoPesos: number;
    totalDifCotizacion: number;
    constructor() {
        this.importeDolar = 0;
        this.importePesificado = 0;
        this.pendienteUsd = 0;
        this.pendientePesos = 0;
        this.suPagoUsd = 0;
        this.suPagoPesos = 0;
        this.totalDifCotizacion = 0;
    }
}

export interface CotizacionDolar {
    cotizacion: number;
    fechaCotizacion: string;
    idSisCotDolar: number;
}
export class PagoProveedoresTable {
    importeDolar: number;
    importePesificado: number;
    pendienteUsd: number;
    pendientePesos: number;
    suPagoUsd: number;
    suPagoPesos: number;
    totalDifCotizacion: number;
    constructor() {
        this.importeDolar = 0;
        this.importePesificado = 0;
        this.pendienteUsd = 0;
        this.pendientePesos = 0;
        this.suPagoUsd = 0;
        this.suPagoPesos = 0;
        this.totalDifCotizacion = 0;
    }
}

export class GrabarOrdenesPago {
    idFactCab: number;
    idCteTipo: number;
    numero: number;
    fechaEmision: string;
    idPadron: number;
    idMoneda: number;
    nombre: string;
    cuit: string;
    codigoPostal: string;
    cotDolar: number;
    idSisTipoOperacion: number;
    idSisOperacionComprobante: number;
    idUsuario: number;
    fechaAutorizacion: string;
    numeroReciboCaja: number;
    pagoCerrado: number;
    // id de comprobante generado
    idNumero: number;

    // Booleanos para ver que se guarda y que no
    ordenPagoCabecera: boolean;
    ordenPagoDetalle: boolean;
    ordenPagoFormaPago: boolean;
    ordenPagoPie: boolean;
    grillaComprobantes: Array<GrillaComprobantes>;
    grillaSubTotales: Array<GrillaSubTotales>;
    grillaFormaPago: Array<GrillaFormaPago>;
    constructor() {
        this.idFactCab = 0;
        this.idCteTipo = 0;
        this.numero = 0;
        this.fechaEmision = "";
        this.idPadron = 0;
        this.idMoneda = 0;
        this.nombre = "";
        this.cuit = "";
        this.codigoPostal = "";
        this.cotDolar = 0;
        this.idSisTipoOperacion = 0;
        this.idSisOperacionComprobante = 0;
        this.idUsuario = 0;
        this.fechaAutorizacion = "";
        this.numeroReciboCaja = 0;
        this.pagoCerrado = 0;
        this.idNumero = 0;
        this.ordenPagoCabecera = false;
        this.ordenPagoDetalle = false;
        this.ordenPagoFormaPago = false;
        this.ordenPagoPie = false;
        this.grillaComprobantes = [];
        this.grillaSubTotales = [new GrillaSubTotales(), new GrillaSubTotales()];
        this.grillaFormaPago = [];
    }
}

export class GrillaComprobantes {
    idDetalle: number;
    item: number;
    pagadoDolar: number;
    importePesificado: number;
    idFormaPago: number;
    cotDolarFact: number;
    difContizacion: number;
    idIva: number;
    ivaDifContizacion: number;
    idFactCabComp: number;
    constructor() {
        this.idDetalle = 0;
        this.item = 0;
        this.pagadoDolar = 0;
        this.importePesificado = 0;
        this.idFormaPago = 0;
        this.cotDolarFact = 0;
        this.difContizacion = 0;
        this.idIva = 0;
        this.ivaDifContizacion = 0;
        this.idFactCabComp = 0;
    }
}

export class GrillaSubTotales {
    idImpuesto: number;
    detalle: string;
    alicuota: number;
    importeBase: number;
    importeImpuesto: number;
    numeroRetencion: number;
    operador: string;
    constructor() {
        this.idImpuesto = 0;
        this.detalle = "";
        this.alicuota = 0;
        this.importeBase = 0;
        this.importeImpuesto = 0;
        this.numeroRetencion = 0;
        this.operador = "";
    }
}

export class GrillaFormaPago {
    idOpFormaPago: number;
    idOPCab: number;
    idFormaPago: number;
    importe: number;
    fechaAcreditacion: string;
    numero: number;
    detalle: string;
    constructor() {
        this.idOpFormaPago = 0;
        this.idOPCab = 0;
        this.idFormaPago = -1;
        this.importe = 0;
        this.fechaAcreditacion = "";
        this.numero = 0;
        this.detalle = "";
    }
}

export interface UsuarioOperador {
    descripcion: string;
    idPerfil: number;
    sucursal: Sucursal;
}

export interface CuentaOperador {
    apellido: string;
    clave: string;
    email: string;
    id: number;
    listaPrecios: any;
    nombre: string;
    perfil: any;
    ptoVentas: any;
    telefono: string;
    usuario: string;
    usuarioSybase: string;
}

export interface Sucursal {
    codigoPostal: string;
    domicilio: string;
    empresa: Empresa;
    idSucursal: number;
    nombre: string;
    permisos: Array<Permisos>;
}

export interface Empresa {
    cuit: string;
    descripcion: string;
    domicilio: string;
    idEmpresa: number;
    iibb: string;
    logo: string;
    nombre: string;
    prefijoEmpresa: string;
}

export interface Permisos {
    alta: boolean;
    baja: boolean;
    idPermiso: number;
    menu: any;
    modificacion: boolean;
}

export interface TipoOrdenCompra {
    codigoComp: number;
    comprobante: ComprobanteTipoOrdenCompra;
    cursoLegal: boolean;
    descCorta: string;
    descripcion: string;
    idCteTipo: number;
    letrasCodigos: Array<LetraCodigoTipoOrdenCompra>;
    observaciones: string;
    requiereFormaPago: boolean;
    surenu: string;
}

export interface ComprobanteTipoOrdenCompra {
    descripcion: string;
    idSisComprobantes: number;
    modulo: { idSisModulos: number, descripcion: string };
    monedas: Array<any>;
}

export interface LetraCodigoTipoOrdenCompra {
    codigoAfip: {
        idSisCodigoAfip: number,
        codigoAfip: number,
        descripcion: string
    };
    cteTipo: {
        codigoComp: number,
        comprobante: any,
        cursoLegal: boolean,
        descCorta: string,
        descripcion: string,
        idCteTipo: number,
        letrasCodigos: Array<any>,
        observaciones: string,
        requiereFormaPago: boolean,
        surenu: string,
    };
    idCteTipoSisLetra: number;
    letra: { idSisLetra: number, letra: string };
    numeradores: Array<NumeradorOC>;
}

export interface NumeradorOC {
    descripcion: string;
    electronico: boolean;
    fechaApertura: string;
    fechaCierre: string;
    idCteNumerador: number;
    letrasCodigos: any;
    numerador: number;
    ptoVenta: { idPtoVenta: number, ptoVenta: number, sucursal: string };
    vtoCai: string;
}

export interface Moneda {
    descripcion: string;
    idMoneda: number;
}