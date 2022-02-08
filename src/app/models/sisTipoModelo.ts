export class SisTipoModelo {
    idTipoModelo: number;
    descripcion: string

    constructor(sisTipoModelo?: {
        idTipoModelo: number;
        descripcion: string
    }) {
        if (sisTipoModelo) {
            this.idTipoModelo = sisTipoModelo.idTipoModelo;
            this.descripcion = sisTipoModelo.descripcion
        } else {
            this.idTipoModelo = null;
            this.descripcion = null
        }
    }

}