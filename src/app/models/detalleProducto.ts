import { Producto } from "./producto";

export class DetalleProducto {
    idDetalleProducto: number;
    cotaInf: number;
    cotaSup: number;
    precio: number;
    producto: Producto;
    observaciones: string;

    cotaInfPorce: number;
    cotaSupPorce: number;

    constructor (detalleProducto?: {
        cotaInf: number;
        cotaSup: number;
        precio: number;
        idProducto: any;
        observaciones: string;

        cotaInfPorce: number;
        cotaSupPorce: number;
    }) {
        if (detalleProducto) {
            this.idDetalleProducto = detalleProducto.idProducto.idProductos;
            this.cotaInf = detalleProducto.cotaInf;
            this.cotaSup = detalleProducto.cotaSup;
            this.precio = detalleProducto.precio;
            this.producto = new Producto(detalleProducto.idProducto);
            this.observaciones = detalleProducto.observaciones;

            this.cotaInfPorce = detalleProducto.cotaInfPorce;
            this.cotaSupPorce = detalleProducto.cotaSupPorce;
        } else {
            this.idDetalleProducto = null;
            this.cotaInf = null;
            this.cotaSup = null;
            this.precio = null;
            this.producto = new Producto();
            this.observaciones = null;

            this.cotaInfPorce = null;
            this.cotaSupPorce = null;
        }
    }

}