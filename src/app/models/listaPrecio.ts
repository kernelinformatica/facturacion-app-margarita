import { DetalleProducto } from "./detalleProducto";
import { Moneda } from "./moneda";
import { DateLikePicker } from "./dateLikePicker";
import { FormaPago } from "./formaPago";

export class ListaPrecio {
    idListaPrecio: number;
    codigoLista: number;
    fechaAlta: DateLikePicker;
    vigenciaDesde: DateLikePicker;
    vigenciaHasta: DateLikePicker;
    activa: boolean;
    idPadronCliente: number;
    idPadronRepresentante: number;
    // porc1: number;
    porc1: string;
    condiciones: string;
    idMoneda: Moneda;
    listaPrecioDetCollection: DetalleProducto[];
    formasPago: FormaPago[];

    constructor(listaPrecio?: {
        idListaPrecio: number;
        codigoLista: number;
        fechaAlta: string;
        vigenciaDesde: string;
        vigenciaHasta: string;
        activa: boolean;
        idPadronCliente: number;
        idPadronRepresentante: number;
        porc1: number;
        condiciones: string;
        idMoneda: any;
        listaPrecioDetCollection: any[];
        formasPago: any[];
    }) {
        if (listaPrecio) {
            this.idListaPrecio = listaPrecio.idListaPrecio;
            this.codigoLista = listaPrecio.codigoLista;

            this.fechaAlta = new DateLikePicker(new Date(listaPrecio.fechaAlta));
            this.vigenciaDesde = new DateLikePicker(new Date(listaPrecio.vigenciaDesde));
            this.vigenciaHasta = new DateLikePicker(new Date(listaPrecio.vigenciaHasta));

            this.activa = listaPrecio.activa;
            this.idPadronCliente = listaPrecio.idPadronCliente;
            this.idPadronRepresentante = listaPrecio.idPadronRepresentante;
            // this.porc1 = listaPrecio.porc1;
            this.porc1 = Number(listaPrecio.porc1).toFixed(2);
            this.condiciones = listaPrecio.condiciones;
            this.idMoneda = new Moneda(listaPrecio.idMoneda);
            this.listaPrecioDetCollection = listaPrecio.listaPrecioDetCollection.map(detalle => new DetalleProducto(detalle));
            this.formasPago = listaPrecio.formasPago.map(fp => new FormaPago(fp));
            
        } else {
            this.idListaPrecio = null;
            this.codigoLista = null;
            this.fechaAlta = new DateLikePicker();
            this.vigenciaDesde = new DateLikePicker();
            this.vigenciaHasta = new DateLikePicker();
            this.activa = null;
            this.idPadronCliente = null;
            this.idPadronRepresentante = null;
            // this.porc1 = null;
            this.porc1 = Number(0).toFixed(2);
            this.condiciones = null;
            // this.idMoneda = new Moneda();
            this.idMoneda = null;
            this.listaPrecioDetCollection = [];
            this.formasPago = [];
        }
    }

}
