import { DateLikePicker } from "./dateLikePicker";

export class SisCotDolar {
    idSisCotDolar: number;
    fechaCotizacion: DateLikePicker;
    cotizacion: number;

    constructor(sisCotDolar?: {
        idSisCotDolar: number;
        fechaCotizacion: Date;
        cotizacion: number;
    }) {
        if (sisCotDolar) {
            this.idSisCotDolar = sisCotDolar.idSisCotDolar;
            var fechaLoca = new Date(sisCotDolar.fechaCotizacion);
            fechaLoca.setMinutes(fechaLoca.getMinutes() + fechaLoca.getTimezoneOffset());
            this.fechaCotizacion = new DateLikePicker(new Date(fechaLoca));
            this.cotizacion = sisCotDolar.cotizacion
        } else {
            this.idSisCotDolar = null;
            this.fechaCotizacion = new DateLikePicker(new Date());
            this.cotizacion = null
        }
    }

}