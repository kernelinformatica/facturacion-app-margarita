export class CodigoAfip {
    idSisCodigoAfip: number;
    codigoAfip: number;
    descripcion: string

    constructor(codigoAfip?: {
        idSisCodigoAfip: number;
        codigoAfip: number;
        descripcion: string
    }) {
        if (codigoAfip) {
            this.idSisCodigoAfip = codigoAfip.idSisCodigoAfip;
            this.codigoAfip = codigoAfip.codigoAfip;
            this.descripcion = codigoAfip.descripcion
        } else {
            this.idSisCodigoAfip = null;
            this.codigoAfip = null;
            this.descripcion = null
        }
    }

}


/*

export class CodigoAfip {
    compDescri: string;
    compDescri2: string;
    compCurso: string;
    compDgi: number

    constructor(codigoAfip?: {
        compDescri: string;
        compDescri2: string;
        compCurso: string;
        compDgi: number
    }) {
        if (codigoAfip) {
            this.compDescri = codigoAfip.compDescri;
            this.compDescri2 = codigoAfip.compDescri2;
            this.compCurso = codigoAfip.compCurso;
            this.compDgi = codigoAfip.compDgi
        } else {
            this.compDescri = null;
            this.compDescri2 = null;
            this.compCurso = null;
            this.compDgi = null
        }
    }

}

*/