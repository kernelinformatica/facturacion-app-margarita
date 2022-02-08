export class SisEstado {
    idSisEstados: number;
    descripcion: string

    constructor(sisEstado?: {
        idSisEstados: number;
        descripcion: string
    }) {
        if (sisEstado) {
            this.idSisEstados = sisEstado.idSisEstados;
            this.descripcion = sisEstado.descripcion
        } else {
            this.idSisEstados = null;
            this.descripcion = null
        }
    }
}