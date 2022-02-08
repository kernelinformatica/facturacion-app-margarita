import { ProductoPendiente } from "app/models/productoPendiente";
import { ModeloFactura } from "app/models/modeloFactura";
import { DetalleFormaPago } from "app/models/detalleFormaPago";

// Modelo auxiliar para comprobanteCompra
export class TablaCompra {
    columnas: {
        columnasProductos: any[];
        columnasTrazabilidad: any[];
        columnasFactura: any[];
        columnasDetallesFp: any[];
    };
    datos: {
        productosPend: ProductoPendiente[];
        modelosFactura: any[];
        detallesFormaPago: DetalleFormaPago[]
    };

    constructor(tablaCompra?: {
        columnas: {
            columnasProductos: any[];
            columnasTrazabilidad: any[];
            columnasFactura: any[];
            columnasDetallesFp: any[];
        },
        datos: {
            productosPend: ProductoPendiente[];
            modelosFactura: ModeloFactura[];
            detallesFormaPago: DetalleFormaPago[]
        }
    }) {
        if (tablaCompra) {
            this.columnas = tablaCompra.columnas;
            this.datos = tablaCompra.datos;
        } else {
            this.columnas = {
                columnasProductos: [],
                columnasTrazabilidad: [],
                columnasFactura: [],
                columnasDetallesFp: []
            };
            this.datos = {
                productosPend: [],
                modelosFactura: [],
                detallesFormaPago: []
            };
        }
        
    }

}