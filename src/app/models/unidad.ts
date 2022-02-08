export class Unidad {
    idUnidad: number;
    descripcion: string;

    constructor (unidad?: {
        idUnidad: number;
        descripcion: string;
    }) {
        if (unidad) {
            this.idUnidad = unidad.idUnidad;
            this.descripcion = unidad.descripcion;
        } else {
            this.idUnidad = null;
            this.descripcion = null;
        }
    }

}