export class ProductoReducido {
    codProducto: string;
    codProductoOriginal: string;
    descripcion: string;
    idProductos: number;

    constructor (productoReducido?: any) {

        if (productoReducido) {
            this.codProducto = productoReducido.codProducto;
            this.codProductoOriginal = productoReducido.codProductoOriginal;
            this.descripcion = productoReducido.descripcion;
            this.idProductos = productoReducido.idProductos;
        } else {
            this.codProducto = null;
            this.codProductoOriginal = null;
            this.descripcion = null;
            this.idProductos = null;
        }

    }
}