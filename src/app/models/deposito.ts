export class Deposito {
    idDeposito: number;
    codigoDep: number;
    descripcion: string;
    domicilio: string;
    codigoPostal: string;

    constructor(deposito?: {
        idDeposito: number;
        codigoDep: number;
        descripcion: string;
        domicilio: string;
        codigoPostal: string;
    }) {
        if (deposito) {
            this.idDeposito = deposito.idDeposito
            this.codigoDep = deposito.codigoDep
            this.descripcion = deposito.descripcion
            this.domicilio = deposito.domicilio
            this.codigoPostal = deposito.codigoPostal
        } else {
            this.idDeposito = null
            this.codigoDep = null
            this.descripcion = null
            this.domicilio = null
            this.codigoPostal = null
        }
    }
}
