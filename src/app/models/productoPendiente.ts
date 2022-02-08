import { Producto } from "./producto";
import { ModeloDetalle } from "app/models/modeloDetalle";
import { DateLikePicker } from "./dateLikePicker";
import { ModeloCab } from "./modeloCab";

export class ProductoPendiente {
    item: number;
    comprobante: string;
    numero: string;
    original: number;
    pendiente: number;
    precio: number;
    dolar: number;
    moneda: string;
    porCalc: number;
    ivaPorc: number;
    deposito: number;
    idFactDetalleImputa: number;
    idFactCabImputada: number;
    descuento: number;
    tipoDescuento: string;
    cantBultos: number;
    despacho: string;
    observaciones: string;
    itemImputada: number;
    producto: Producto;
    pendienteOg: number;
   

    // Imputacion
    imputacion: {
        todas: ModeloDetalle[],
        seleccionada: ModeloDetalle;    
    } = {
        todas:[],
        seleccionada:null
    };

    // Datos traza
    trazabilidad: {
        gln: number, 
        lote: string,
        serie: string,
        fechaElab: DateLikePicker,
        fechaVto: DateLikePicker,
        item: number,
    }

    importe: number;
    auxPreviusImporte: number;
    codigoListaPrecio: string;
    idListaPrecio: number;
    idFactDetalle: string;
    modeloCab: ModeloCab;
    tipoComprobante: string;
    diferenciaPrecio: number;
    recargo: number;
    recargoTotal: number;
    diasLibres: number;
    diasResultantes: number;
    cotaInferior: number;
    cotaSuperior: number;

    constructor(productoPendiente?: {
        item: number;
        comprobante: string;
        numero: any;
        original: number;
        pendiente: number;
        precio: number;
        dolar: number;
        moneda: string;
        porCalc: number;
        ivaPorc: number;
        deposito: number;
        idFactDetalleImputa: number;
        idFactCabImputada: number;
        descuento: number;
        tipoDescuento: string;
        cantBultos: number;
        despacho: string;
        observaciones: string;
        itemImputada: number;
        producto: any;
        codigoListaPrecio: string;
        idListaPrecio: number;
        importe?: number;
        idFactDetalle?: string;
        modeloCab?: any;
        diferenciaPrecio?: number;
        recargo?: number;
        recargoTotal?: number;
        diasLibres?: number;
        diasResultantes?: number;
        cotaInferior?: number;
        cotaSuperior?: number;
    }) {
        if (productoPendiente) {
            this.comprobante = productoPendiente.comprobante;
            // this.numero = productoPendiente.numero;

            this.numero = productoPendiente.numero ?
                productoPendiente.numero.toString().padStart(12, '0') : null;
            this.item = productoPendiente.item;
            this.original = productoPendiente.original;
            this.pendiente = productoPendiente.pendiente;
            this.pendienteOg = productoPendiente.pendiente;
            this.precio = productoPendiente.precio;
            this.dolar = productoPendiente.dolar;
            this.moneda = productoPendiente.moneda;
            this.porCalc = productoPendiente.porCalc;
            this.ivaPorc = productoPendiente.ivaPorc;
            this.deposito = productoPendiente.deposito;
            this.idFactDetalleImputa = productoPendiente.idFactDetalleImputa;
            this.idFactCabImputada = productoPendiente.idFactCabImputada;
            this.descuento = productoPendiente.descuento;
            this.tipoDescuento = productoPendiente.tipoDescuento;
            this.cantBultos = productoPendiente.cantBultos;
            this.despacho = productoPendiente.despacho;
            this.observaciones = productoPendiente.observaciones;
            this.itemImputada = productoPendiente.itemImputada;
            this.producto = new Producto(productoPendiente.producto);
            this.diferenciaPrecio = productoPendiente.diferenciaPrecio;
            this.recargo = productoPendiente.recargo;
            this.recargoTotal = productoPendiente.recargoTotal;
            this.diasLibres = productoPendiente.diasLibres;
            this.diasResultantes = productoPendiente.diasResultantes;
            this.cotaInferior = productoPendiente.cotaInferior;
            this.cotaSuperior = productoPendiente.cotaSuperior;
            // Imputacion
            this.imputacion.todas = this.producto.modeloCab.modeloDetalle;
            // Busco el seleccionado por defecto
            if (this.imputacion && this.imputacion.todas && this.imputacion.todas.length > 0) {
                const impuSelect = this.imputacion.todas.find(modelD => modelD.prioritario);
                this.imputacion.seleccionada = impuSelect ? impuSelect : new ModeloDetalle();
            }

            // Vienen sin datos de trazabilidad
            this.trazabilidad = {
                gln: null,
                lote: null,
                serie: null,
                fechaElab: null,
                fechaVto: null,
                item: null
            };

            this.importe = productoPendiente.importe ? productoPendiente.importe : 0;
            this.auxPreviusImporte = 0;

            this.codigoListaPrecio = productoPendiente.codigoListaPrecio;
            this.idListaPrecio = productoPendiente.idListaPrecio;

            this.idFactDetalle = productoPendiente.idFactDetalle ? 
                productoPendiente.idFactDetalle : this.generateId()

            this.modeloCab = productoPendiente.modeloCab ? new ModeloCab(productoPendiente.modeloCab) : null
        } else {
            this.item = null;
            this.comprobante = null;
            this.numero = null;
            this.original = null;
            this.pendiente = null;
            this.precio = null;
            this.dolar = null;
            this.moneda = null;
            this.porCalc = null;
            this.ivaPorc = null;
            this.deposito = null;
            this.idFactDetalleImputa = null;
            this.idFactCabImputada = null;
            this.descuento = null;
            this.tipoDescuento = null;
            this.cantBultos = null;
            this.despacho = null;
            this.observaciones = null;
            this.itemImputada = null;
            this.producto = new Producto();

            this.imputacion.todas = [];
            this.imputacion.seleccionada = new ModeloDetalle();

            this.trazabilidad = {
                gln: null, 
                lote: null,
                serie: null,
                fechaElab: null,
                fechaVto: null,
                item: null
            };

            this.importe = null;
            this.auxPreviusImporte = null;

            this.codigoListaPrecio = null;
            this.idListaPrecio = null;

            this.idFactDetalle = this.generateId();

            this.modeloCab = null;
            this.recargo = null;
            this.recargoTotal = null;
            this.diasLibres = null;
            this.diasResultantes = null;
            this.cotaInferior = null;
            this.cotaSuperior = null;
        }
    }

    generateId = function () {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return '_' + Math.random().toString(36).substr(2, 9);
    };

}