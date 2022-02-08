import { DateLikePicker } from "./dateLikePicker";

export class SisCanje {
    idSisCanje: number;
    descripcion: string;
    precio: number;
    // fechaVto: Date;
    fechaVto: DateLikePicker;
    interes: number

    constructor(sisCanje?: {
        idSisCanje: number;
        descripcion: string;
        precio: number;
        fechaVto: Date;
        interes: number
    }) {
        if (sisCanje) {
            this.idSisCanje = sisCanje.idSisCanje;
            this.descripcion = sisCanje.descripcion;
            this.precio = sisCanje.precio;
            // this.fechaVto = new Date(sisCanje.fechaVto);
            this.fechaVto = new DateLikePicker(new Date(sisCanje.fechaVto)); // TODO: Ver bien este tema de las fechas. Si o si tengo que crearlas aca como DateLikePicker para que me tome el ngModel y refleje los cambios. Pero esto genera inconsiceinteicas zarpadas
            this.interes = sisCanje.interes
        } else {
            this.idSisCanje = null;
            this.descripcion = null;
            this.precio = null;
            this.fechaVto = new DateLikePicker();
            this.interes = null
        }
    }
}