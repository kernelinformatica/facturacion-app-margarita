import { TipoComprobante } from "./tipoComprobante";
import { DateLikePicker } from "./dateLikePicker";

export class CteFechas {
    idCteFechas: number;
    puntoVenta: number;
    fechaApertura: DateLikePicker;
    fechaCierre: DateLikePicker;
    cteTipo: TipoComprobante;

    constructor(cteFechas?: {
        idCteFechas: number;
        idCteTipo: number;
        puntoVenta: number;
        fechaApertura: string;
        fechaCierre: string;
        cteTipo: any;
    }) {
        if (cteFechas) {
            this.idCteFechas = cteFechas.idCteFechas;
            this.puntoVenta = cteFechas.puntoVenta;
            // this.fechaApertura = new Date(cteFechas.fechaApertura);
            // this.fechaCierre = new Date(cteFechas.fechaCierre);
            this.fechaApertura = new DateLikePicker(new Date(cteFechas.fechaApertura));
            this.fechaCierre = new DateLikePicker(new Date(cteFechas.fechaCierre));
            this.cteTipo = new TipoComprobante(cteFechas.cteTipo);
        } else {
            this.idCteFechas = null;
            this.puntoVenta = null;
            this.fechaApertura = new DateLikePicker();
            this.fechaCierre = new DateLikePicker();
            this.cteTipo = new TipoComprobante();
        }
    }

}