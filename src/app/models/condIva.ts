export class CondIva {
    condiva: number;
    descripcion: string;
    codAfip: number;
    descCorta: string;
    codOncca: number

    constructor(condIva?: {
        condiva: number;
        descripcion: string;
        codAfip: number;
        descCorta: string;
        codOncca: number;
    }) {
        if (condIva) {
            this.condiva = condIva.condiva;
            this.descripcion = condIva.descripcion;
            this.codAfip = condIva.codAfip;
            this.descCorta = condIva.descCorta;
            this.codOncca = condIva.codOncca
        } else {
            this.condiva = null;
            this.descripcion = null;
            this.codAfip = null;
            this.descCorta = null;
            this.codOncca = null
        }
    }

}