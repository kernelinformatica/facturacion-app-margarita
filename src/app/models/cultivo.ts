export class Cultivo {
    idCultivo: number;
    descripcion: string;
    cosecha: string

    constructor(cultivo?: {
        idCultivo: number;
        descripcion: string;
        cosecha: string
    }) {
        if (cultivo) {
            this.idCultivo = cultivo.idCultivo;
            this.descripcion = cultivo.descripcion;
            this.cosecha = cultivo.cosecha
        } else {
            this.idCultivo = null;
            this.descripcion = null;
            this.cosecha = null
        }
    }

}