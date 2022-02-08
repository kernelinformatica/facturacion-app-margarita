export class ModeloFactura {
    cuentaContable: string;
    descripcion: string;
    importeTotal: number;
    porcentaje: number;
    idSisTipoModelo: number;
    baseImponible: number;
    operador: string;
    idLibro: number;

    constructor(modeloFactura?: {
        cuentaContable: string;
        descripcion: string;
        importeTotal: number;
        porcentaje: number;
        idSisTipoModelo: number;
        baseImponible: number;
        operador: string;
        idLibro: number;
    }) {
        if (modeloFactura) {
            this.cuentaContable = modeloFactura.cuentaContable
            this.descripcion = modeloFactura.descripcion
            this.importeTotal = modeloFactura.importeTotal
            this.porcentaje = modeloFactura.porcentaje
            this.idSisTipoModelo = modeloFactura.idSisTipoModelo
            this.baseImponible = modeloFactura.baseImponible
            this.operador = modeloFactura.operador
            this.idLibro = modeloFactura.idLibro
        } else {
            this.cuentaContable = null
            this.descripcion = null
            this.importeTotal = null
            this.porcentaje = null
            this.idSisTipoModelo = null
            this.baseImponible = null
            this.operador = null
            this.idLibro = null
        }
    }
}