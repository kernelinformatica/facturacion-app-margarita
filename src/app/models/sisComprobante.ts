import { SisModulo } from "./sisModulo";
import { Moneda } from "./moneda";
import sisCategorias from "constantes/sisCategorias";

export class SisComprobante {
    idSisComprobantes: number;
    descripcion: string;
    orden: number;
    modulo: SisModulo;
    incluyeNeto: boolean;
    incluyeIva: boolean;
    referencia: string;
    difCotizacion: boolean;
    idSisOperacionComprobante: number;
    relacionadosMultiples: boolean;
    monedas: Moneda[];
    usaContrato: boolean;
    permiteImporteCero: boolean;
    usaRelacion: boolean;
    relacionadoObligatorio: boolean;
    observaciones: string;

    constructor(sisComprobante?: {
        idSisComprobantes: number;
        descripcion: string;
        orden: number;
        modulo: SisModulo;
        incluyeNeto: boolean;
        incluyeIva: boolean;
        referencia: string;
        idSisOperacionComprobante: number;
        difCotizacion: boolean;
        relacionadosMultiples: boolean;
        monedas: any[];
        usaContrato: boolean;
        permiteImporteCero: boolean;
        usaRelacion: boolean;
        relacionadoObligatorio: boolean;
        observaciones: string;
    }) {
        if (sisComprobante) {
            this.idSisComprobantes = sisComprobante.idSisComprobantes;
            this.descripcion = sisComprobante.descripcion;
            this.orden = sisComprobante.orden;
            this.modulo = new SisModulo(sisComprobante.modulo);
            this.incluyeNeto = sisComprobante.incluyeNeto;
            this.incluyeIva = sisComprobante.incluyeIva;
            this.referencia = sisComprobante.referencia;
            this.idSisOperacionComprobante = sisComprobante.idSisOperacionComprobante;
            this.difCotizacion = sisComprobante.difCotizacion;
            this.relacionadosMultiples = sisComprobante.relacionadosMultiples;
            this.monedas = sisComprobante.monedas.map(m => new Moneda(m));
            this.usaContrato = sisComprobante.usaContrato;
            this.permiteImporteCero = sisComprobante.permiteImporteCero;
            this.usaRelacion = sisComprobante.usaRelacion;
            this.relacionadoObligatorio = sisComprobante.relacionadoObligatorio;
            this.observaciones = sisComprobante.observaciones;
        } else {
            this.idSisComprobantes = null;
            this.descripcion = null;
            this.orden = null;
            this.modulo = null;
            this.incluyeNeto = null;
            this.incluyeIva = null;
            this.referencia = null;
            this.idSisOperacionComprobante = null;
            this.difCotizacion = null;
            this.relacionadosMultiples = null;
            this.monedas = [];
            this.usaContrato = null;
            this.permiteImporteCero = null;
            this.relacionadoObligatorio = null;
            this.observaciones = null;

        }
    }

}