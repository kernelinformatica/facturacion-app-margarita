import { ComprobanteDetalle } from "./comprobanteDetalle";

export class ComprobanteEncabezado {
    idFactCab: number;
    numero: number;
    idPadron: number;
    nombre: string;
    cuit: string;
    cotDolar: number;
    modulo: string;
    comprobante: string;
    moneda: string;
    imputada: string;
    fechaEmi: string;
    fechaVence: string;
    fechaConta: string;
    detalle: ComprobanteDetalle[];
    // Desplegable de detalles
    showDetalles: boolean;
    isDownloading;
    isBeingAuthorized;
    idCteTipo: number;
    importeNeto: number;
    importeTotal: number;
    autorizada: string;
    tipoOperacion: string;
    permiteBorrado: boolean;
    pesificado: boolean;
    dolarizadoAlVto: boolean;
    interesMensualCompra: number;
    canjeInsumos: boolean;
    tipoCambio: string;
    master;

    constructor(comprobanteEncabezado?: {
        idFactCab: number;
        numero: number;
        idPadron: number;
        nombre: string;
        cuit: string;
        cotDolar: number;
        modulo: string;
        comprobante: string;
        moneda: string;
        imputada: string;
        fechaEmi: string;
        fechaVence: string;
        fechaConta: string;
        detalle: any[];
        idCteTipo: number;
        importeNeto: number;
        importeTotal: number;
        autorizada: string;
        tipoOperacion: string;
        permiteBorrado: boolean;
        pesificado: boolean;
        dolarizadoAlVto: boolean;
        interesMensualCompra: number;
        canjeInsumos: boolean;
        tipoCambio: string;
        master;
    }) {
        if (comprobanteEncabezado) {
            this.idFactCab = comprobanteEncabezado.idFactCab;
            this.numero = comprobanteEncabezado.numero;
            this.idPadron = comprobanteEncabezado.idPadron;
            this.nombre = comprobanteEncabezado.nombre;
            this.cuit = comprobanteEncabezado.cuit;
            this.cotDolar = comprobanteEncabezado.cotDolar;
            this.modulo = comprobanteEncabezado.modulo;
            this.comprobante = comprobanteEncabezado.comprobante;
            this.moneda = comprobanteEncabezado.moneda;
            this.imputada = comprobanteEncabezado.imputada;
            this.fechaEmi = comprobanteEncabezado.fechaEmi;
            this.fechaVence = comprobanteEncabezado.fechaVence;
            this.fechaConta = comprobanteEncabezado.fechaConta;
            this.detalle = comprobanteEncabezado.detalle.map(det => new ComprobanteDetalle(det));
            this.showDetalles = false;
            this.isDownloading = false;
            this.isBeingAuthorized = false;
            this.idCteTipo = comprobanteEncabezado.idCteTipo;
            this.importeNeto = comprobanteEncabezado.importeNeto;
            this.importeTotal = comprobanteEncabezado.importeTotal;
            this.autorizada = comprobanteEncabezado.autorizada;
            this.tipoOperacion = comprobanteEncabezado.tipoOperacion;
            this.permiteBorrado = comprobanteEncabezado.permiteBorrado;
            this.pesificado = comprobanteEncabezado.pesificado;
            this.dolarizadoAlVto = comprobanteEncabezado.dolarizadoAlVto;
            this.interesMensualCompra = comprobanteEncabezado.interesMensualCompra;
            this.canjeInsumos = comprobanteEncabezado.canjeInsumos;
            this.tipoCambio = comprobanteEncabezado.tipoCambio;
            this.master = comprobanteEncabezado.master;
        } else {
            this.idFactCab = null;
            this.numero = null;
            this.idPadron = null;
            this.nombre = null;
            this.cuit = null;
            this.cotDolar = null;
            this.modulo = null;
            this.comprobante = null;
            this.moneda = null;
            this.imputada = null;
            this.fechaEmi = null;
            this.fechaVence = null;
            this.fechaConta = null;
            this.detalle = null;
            this.showDetalles = false;
            this.isDownloading = false;
            this.isBeingAuthorized = false;
            this.idCteTipo = null;
            this.importeNeto = null;
            this.importeTotal = null;
            this.autorizada = null;
            this.tipoOperacion = null;
            this.permiteBorrado = null;
            this.pesificado = null;
            this.dolarizadoAlVto = null;
            this.interesMensualCompra = null;
            this.canjeInsumos = null;
            this.tipoCambio = null;
            this.master = null;
        }
    }

}