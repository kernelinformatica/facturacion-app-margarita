export class Moneda {
    idMoneda: number;
    descripcion: string;

    constructor (moneda?: {
        idMoneda: number;
        descripcion: string;
    }) {
        if (moneda) {
            this.idMoneda = moneda.idMoneda
            this.descripcion = moneda.descripcion
        } else {
            // Selecciono por defecto la id = 1 (primera de la lista)
            this.idMoneda = 1
            this.descripcion = null
        }
    }

}
