export class SisModulo {
    idSisModulos: number;
    descripcion: string

    constructor(sisModulo?: {
        idSisModulos: number;
        descripcion: string
    }) {
        if (sisModulo) {
            this.idSisModulos = sisModulo.idSisModulos;
            this.descripcion = sisModulo.descripcion
        } else {
            this.idSisModulos = null;
            this.descripcion = null
        }
    }

}