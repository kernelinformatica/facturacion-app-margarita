import { Sucursal } from "./sucursal";

export class PtoVenta {
    idPtoVenta: number;
    ptoVenta: any;
    sucursal: string;

    constructor(numero?: {
        idPtoVenta: number;
        ptoVenta: any;
        sucursal: string;
    }) {
        if (numero) {
            this.idPtoVenta = numero.idPtoVenta;
            this.ptoVenta = numero.ptoVenta;
            this.sucursal = numero.sucursal;
        } else {
            this.idPtoVenta = null;
            this.ptoVenta = null;
            this.sucursal = null;
        }
    }
}