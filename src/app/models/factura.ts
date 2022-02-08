import { TipoComprobante } from "./tipoComprobante";
import { DateLikePicker } from "app/models/dateLikePicker";
import { SisLetra } from "./sisLetra";

export class Factura {
    tipo: TipoComprobante;
    puntoVenta: number;
    numero: number;
    fechaContable: DateLikePicker;
    fechaVto: DateLikePicker;
    letra: SisLetra;

    constructor(factura?: {
        tipo: any;
        puntoVenta: number;
        numero: number;
        fechaContable: any;
        fechaVto: any;

        letra?: any;
    }) {
        if (factura) {
            this.tipo = new TipoComprobante(factura.tipo)
            this.puntoVenta = factura.puntoVenta
            this.numero = factura.numero
            this.fechaContable = factura.fechaContable
            this.fechaVto = factura.fechaVto
            this.letra = new SisLetra(factura.letra);
        } else {
            this.tipo = new TipoComprobante()
            this.puntoVenta = null
            this.numero = null
            this.fechaContable = new DateLikePicker()
            this.fechaVto = new DateLikePicker()
            this.letra = null;
        }
    }

}