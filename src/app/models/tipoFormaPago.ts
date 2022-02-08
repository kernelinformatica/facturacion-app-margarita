
export class TipoFormaPago {
    idSisFormaPago: number;
    descripcion: string;

    constructor (tipoFormaPago?: {
        descripcion: string;
        idSisFormaPago: number;
    }) {
        if (tipoFormaPago) {
            this.idSisFormaPago = tipoFormaPago.idSisFormaPago;
            this.descripcion = tipoFormaPago.descripcion;
        } else {
            this.idSisFormaPago = null;
            this.descripcion = null;
        }
    }

}