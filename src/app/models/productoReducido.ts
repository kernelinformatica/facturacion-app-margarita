export class ProductoReducido {
    codProducto: string;
    descripcion: string;
    idProductos: number;

    constructor (productoReducido?: any) {

        if (productoReducido) {
            this.codProducto = productoReducido.codProducto;
            this.descripcion = productoReducido.descripcion;
            this.idProductos = productoReducido.idProductos;
        } else {
            this.codProducto = null;
            this.descripcion = null;
            this.idProductos = null;
        }

    }
}