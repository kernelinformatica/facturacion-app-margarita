export class SisSitIVA {
    idSisSitIVA: number;
    descripcion: string;
    descCorta: string;
    letra: string

    constructor(sisSitIVA?: {
        idSisSitIVA: number;
        descripcion: string;
        descCorta: string;
        letra: string
    }) {
        if (sisSitIVA) {
            this.idSisSitIVA = sisSitIVA.idSisSitIVA;
            this.descripcion = sisSitIVA.descripcion;
            this.descCorta = sisSitIVA.descCorta;
            this.letra = sisSitIVA.letra
        } else {
            this.idSisSitIVA = null;
            this.descripcion = null;
            this.descCorta = null;
            this.letra = null
        }
    }

}