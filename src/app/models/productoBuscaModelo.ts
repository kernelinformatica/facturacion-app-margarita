export class ProductoBuscaModelo {
    idProducto: number;
    precio: number;
    cantidad: number;
    subTotal: number;
    // numeroComp: string;

    constructor(productoBuscaModelo?: {
        idProducto: number;
        precio: number;
        cantidad: number;
        subTotal?: number;
        // numeroComp?: string;
    }) {
        if (productoBuscaModelo) {
            this.idProducto = productoBuscaModelo.idProducto
            this.precio = productoBuscaModelo.precio
            this.cantidad = productoBuscaModelo.cantidad
            // this.subTotal = productoBuscaModelo.subTotal ? productoBuscaModelo.subTotal : null;
            this.subTotal = productoBuscaModelo.subTotal;
            // this.numeroComp = productoBuscaModelo.numeroComp ? productoBuscaModelo.numeroComp : null;
        } else {
            this.idProducto = null
            this.precio = null
            this.cantidad = null
            this.subTotal = null
            // this.numeroComp = null
        }
    }

}