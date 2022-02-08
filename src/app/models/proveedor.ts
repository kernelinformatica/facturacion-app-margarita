import { PadronGral } from "./padronGral";
import { Padron } from "./padron";

export class Proveedor {
    idPadronProveedor: number;
    iibbRet: number;
    iibbPer: number;
    padronGral: PadronGral;

    padronAux: Padron;

    constructor(proveedor?: {
        idPadronProveedor: number;
        iibbRet: number;
        iibbPer: number;
        padronGral: any;
    }) {
        if (proveedor) {
            this.idPadronProveedor = proveedor.idPadronProveedor;
            this.iibbRet = proveedor.iibbRet;
            this.iibbPer = proveedor.iibbPer;
            this.padronGral = proveedor.padronGral ? new PadronGral(proveedor.padronGral) : new PadronGral();
        } else {
            this.idPadronProveedor = null;
            this.iibbRet = null;
            this.iibbPer = null;
            this.padronGral = new PadronGral();
        }
    }

}