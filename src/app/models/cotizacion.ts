

export class Cotizacion {
    idSisCotDolar: number;
    fechaCotizacion: Date;
    cotizacion: number;

    constructor(cotizacion?: {
        idSisCotDolar: number;
        fechaCotizacion: any;
        cotizacion: number;
    }) {
        if (cotizacion) {
            this.idSisCotDolar = cotizacion.idSisCotDolar
            var fechaLoca = new Date(cotizacion.fechaCotizacion);
            fechaLoca.setMinutes(fechaLoca.getMinutes() + fechaLoca.getTimezoneOffset());
            this.fechaCotizacion = fechaLoca
            this.cotizacion = cotizacion.cotizacion
        } else {
            this.idSisCotDolar = null
            this.fechaCotizacion = null
            this.cotizacion = null
        }
    }

}