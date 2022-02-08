export class TiposOpDepositos {
    idTipoOpDeposito: number;
    idSisTipoOperacion: number;
    idDepositos: number;

    constructor (tiposOpDepositos?: {
        idTipoOpDeposito: number;
        idSisTipoOperacion: number;
        idDepositos: number;
    }) {
        if (tiposOpDepositos) {
            this.idTipoOpDeposito = tiposOpDepositos.idTipoOpDeposito;
            this.idSisTipoOperacion = tiposOpDepositos.idSisTipoOperacion;
            this.idDepositos = tiposOpDepositos.idDepositos;
        } else {
            this.idTipoOpDeposito = null;
            this.idSisTipoOperacion = null;
            this.idDepositos = null;
        }
    }

}