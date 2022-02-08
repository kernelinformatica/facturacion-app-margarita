export class SisLetra {
    idSisLetra: number;
    letra: string

    constructor(sisLetra?: {
        idSisLetra: number;
        letra: string
    }) {
        if (sisLetra) {
            this.idSisLetra = sisLetra.idSisLetra;
            this.letra = sisLetra.letra
        } else {
            this.idSisLetra = null;
            this.letra = null
        }
    }
}