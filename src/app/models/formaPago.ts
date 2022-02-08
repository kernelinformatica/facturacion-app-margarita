import { TipoFormaPago } from "app/models/tipoFormaPago";
import { ListaPrecio } from "./listaPrecio";
import { DetalleFormaPago } from "app/models/detalleFormaPago";

export class FormaPago {
    idFormaPago: number;
    descripcion: string;
    editar: boolean;
    tipo: TipoFormaPago;
    // listaPrecio: ListaPrecio;
    detalles: DetalleFormaPago[];

    listaPrecios: ListaPrecio[];

    constructor (formaPago?: {
        idFormaPago: number;
        descripcion: string;
        editar: boolean;
        tipo: any;
        // listaPrecio: any;
        formaPagoDet: any[]

        listaPrecios: any[]
    }) {
        if (formaPago) {
            this.idFormaPago = formaPago.idFormaPago;
            this.descripcion = formaPago.descripcion;
            this.editar = formaPago.editar;
            this.tipo = new TipoFormaPago(formaPago.tipo);
            // this.listaPrecio = new ListaPrecio(formaPago.listaPrecio);
            this.detalles = formaPago.formaPagoDet.map(det => new DetalleFormaPago(det))
            this.listaPrecios = formaPago.listaPrecios ? formaPago.listaPrecios.map(lp => new ListaPrecio(lp)) : []
        } else {
            this.idFormaPago = null;
            this.descripcion = null;
            this.editar = null;
            this.tipo = new TipoFormaPago();
            // this.listaPrecio = new ListaPrecio();
            this.detalles = [];
            this.listaPrecios = [];
        }
    }

    addOrRemoveLista = (lp: ListaPrecio) => this.listaPrecios &&
        this.listaPrecios.some(cteLet => cteLet.idListaPrecio === lp.idListaPrecio) ?
            this.listaPrecios = this.listaPrecios.filter(cteLet => cteLet.idListaPrecio !== lp.idListaPrecio) :
            this.listaPrecios = this.listaPrecios.concat(lp)

    existLista = (lp: ListaPrecio) => 
        this.listaPrecios &&
            this.listaPrecios.some(cteLet => cteLet.idListaPrecio === lp.idListaPrecio)
    

}