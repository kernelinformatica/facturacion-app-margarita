import { ModeloDetalle } from "app/models/modeloDetalle";

export class ModeloCab {
    idModeloCab: number;
    idEmpresa: number;
    descripcion: string;
    modeloDetalle: ModeloDetalle[];

    detalleInfo: string;

    constructor (modeloCab?: {
        idModeloCab: number;
        idEmpresa: number;
        descripcion: string;
        modeloDetalle: any[];
    }) {
        if (modeloCab) {
            this.idModeloCab = modeloCab.idModeloCab;
            this.idEmpresa = modeloCab.idEmpresa;
            this.descripcion = modeloCab.descripcion;
            this.modeloDetalle = modeloCab.modeloDetalle.map(modD => new ModeloDetalle(modD));

            this.detalleInfo = this.modeloDetalle
                .map(modD => modD.descripcion)
                .join(', ');

        } else {
            this.idModeloCab = null;
            this.idEmpresa = null;
            this.descripcion = null;
            this.modeloDetalle = null;
        }
    }

}