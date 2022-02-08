export class Libro {
    idLibro: number;
    columnaNombre: string;

    constructor(libro?: {
        idLibro: number;
        columnaNombre: string;
    }) {
        if (libro) {
            this.idLibro = libro.idLibro;
            this.columnaNombre = libro.columnaNombre;
        } else {
            this.idLibro = null;
            this.columnaNombre = null;
        }
    }

}