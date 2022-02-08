import { Rubro } from "./rubro";

export class SubRubro {
    idSubRubro: number;
    descripcion: string;
    rubro: Rubro;
    codigoSubRubro: string;

    constructor (subRubro?: {
        idSubRubro: number;
        descripcion: string;
        rubro: any;
        codigoSubRubro: string;
    }) {
        if (subRubro) {
            this.idSubRubro = subRubro.idSubRubro;
            this.descripcion = subRubro.descripcion;
            this.rubro = new Rubro(subRubro.rubro);
            this.codigoSubRubro = subRubro.codigoSubRubro;
        } else {
            this.idSubRubro = null;
            this.descripcion = null;
            // this.rubro = new Rubro();
            this.rubro = null;
            this.codigoSubRubro = null;
        }
    }

}