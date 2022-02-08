export class SisCategoria {
    idSisCategoria: number;
    descripcion: string

    constructor(sisCategoria?: {
        idSisCategoria: number;
        descripcion: string
    }) {
        if (sisCategoria) {
            this.idSisCategoria = sisCategoria.idSisCategoria;
            this.descripcion = sisCategoria.descripcion
        } else {
            this.idSisCategoria = null;
            this.descripcion = null
        }
    }

}