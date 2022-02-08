export class IVA {
    idIVA: number;
    porcIVA: number;

    constructor (IVA?: {
        idIVA: number;
        porcIVA: number;
    }) {
        if (IVA) {
            this.idIVA = IVA.idIVA;
            this.porcIVA= IVA.porcIVA;
        } else {
            this.idIVA = null;
            this.porcIVA= null;
        }
    }

}