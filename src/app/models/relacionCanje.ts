import { SisCanje } from "./sisCanje";

export class RelacionCanje {
    idRelacionSisCanje: number;
    codigoCosecha: number;
    codigoClase: number;
    descripcion: string;
    factor: number;
    idSisCanje: SisCanje

    constructor(relacionCanje?: {
        idRelacionSisCanje: number;
        codigoCosecha: number;
        codigoClase: number;
        descripcion: string;
        factor: number;
        idSisCanje: any;
    }) {
        if (relacionCanje) {
            this.idRelacionSisCanje = relacionCanje.idRelacionSisCanje;
            this.codigoCosecha = relacionCanje.codigoCosecha;
            this.codigoClase = relacionCanje.codigoClase;
            this.descripcion = relacionCanje.descripcion;
            this.factor = relacionCanje.factor;
            this.idSisCanje = new SisCanje(relacionCanje.idSisCanje)
        } else {
            this.idRelacionSisCanje = null;
            this.codigoCosecha = null;
            this.codigoClase = null;
            this.descripcion = null;
            this.factor = null;
            this.idSisCanje = new SisCanje()
        }
    }

}