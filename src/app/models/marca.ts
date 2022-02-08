
export class Marca {
    idMarcas: number;
    descripcion: string

    constructor(marca?: {
        idMarcas: number;
        descripcion: string
    }) {
        if (marca) {
            this.idMarcas = marca.idMarcas;
            this.descripcion = marca.descripcion
        } else {
            this.idMarcas = null;
            this.descripcion = null
        }
    }

}