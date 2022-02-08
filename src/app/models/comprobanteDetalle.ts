export class ComprobanteDetalle {
    comprobante: string;
    numero: number;
    fechaEmision: string;
    codProducto: string;
    articulo: string;
    original: number;
    pendiente: number;
    precio: number;
    dolar: number;
    moneda: string;
    porCalc: number;
    ivaPorc: number;
    deposito: number
    importe: number;
    precioDesc: number;
    unidadDescuento: string;
    descuento: string;

    constructor(comprobanteDetalle?: {
        comprobante: string;
        numero: number;
        fechaEmision: string;
        codProducto: string;
        articulo: string;
        original: number;
        pendiente: number;
        precio: number;
        dolar: number;
        moneda: string;
        porCalc: number;
        ivaPorc: number;
        deposito: number;
        importe: number;
        precioDesc: number;
        unidadDescuento: string;
        descuento: string;
    }) {
        if (comprobanteDetalle) {
            this.comprobante = comprobanteDetalle.comprobante;
            this.numero = comprobanteDetalle.numero;
            this.fechaEmision = comprobanteDetalle.fechaEmision;
            this.codProducto = comprobanteDetalle.codProducto;
            this.articulo = comprobanteDetalle.articulo;
            this.original = comprobanteDetalle.original;
            this.pendiente = comprobanteDetalle.pendiente;
            this.precio = comprobanteDetalle.precio;
            this.dolar = comprobanteDetalle.dolar;
            this.moneda = comprobanteDetalle.moneda;
            this.porCalc = comprobanteDetalle.porCalc;
            this.ivaPorc = comprobanteDetalle.ivaPorc;
            this.deposito = comprobanteDetalle.deposito
            this.importe = comprobanteDetalle.importe;
            this.precioDesc = comprobanteDetalle.precioDesc;
            this.unidadDescuento = comprobanteDetalle.unidadDescuento;
            this.descuento = comprobanteDetalle.descuento;
        } else {
            this.comprobante = null;
            this.numero = null;
            this.fechaEmision = null;
            this.codProducto = null;
            this.articulo = null;
            this.original = null;
            this.pendiente = null;
            this.precio = null;
            this.dolar = null;
            this.moneda = null;
            this.porCalc = null;
            this.ivaPorc = null;
            this.deposito = null;
            this.importe = null;
            this.precioDesc = null;
            this.unidadDescuento = null;
            this.descuento = null;
        }
    }

}