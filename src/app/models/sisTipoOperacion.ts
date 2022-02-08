import { SisComprobante } from "./sisComprobante";

export class SisTipoOperacion {
    idSisTipoOperacion: number;
    descripcion: string;
    modulo: string;
    canje: boolean;

    depositoDestino: boolean;
    depositoOrigen: boolean;

    constructor(sisTipoOperacion?: {
        idSisTipoOperacion: number;
        descripcion: string;
        modulo: string;
        canje: boolean;
        depositoDestino: boolean;
        depositoOrigen: boolean;
    }) {
        if (sisTipoOperacion) {
            this.idSisTipoOperacion = sisTipoOperacion.idSisTipoOperacion;
            this.descripcion = sisTipoOperacion.descripcion;
            this.modulo = sisTipoOperacion.modulo;
            this.canje = sisTipoOperacion.canje;
            this.depositoDestino = sisTipoOperacion.depositoDestino;
            this.depositoOrigen = sisTipoOperacion.depositoOrigen;
            
        } else {
            this.idSisTipoOperacion = null;
            this.descripcion = null;
            this.modulo = null;
            this.canje = null;
            
            this.depositoOrigen = null;
            this.depositoDestino = null;
        }
    }

}