import { ModeloDetalle } from "app/models/modeloDetalle";

export class ModeloCabSinDetalles {
    idModeloCab: number;
    idEmpresa: number;
    descripcion: string;
    modeloDetalle: ModeloDetalle[];

    constructor (modeloCabSinDetalles?: {
        idModeloCab: number;
        idEmpresa: number;
        descripcion: string;
        modeloDetalle: any[];
    }) {
        if (modeloCabSinDetalles) {
            this.idModeloCab = modeloCabSinDetalles.idModeloCab;
            this.idEmpresa = modeloCabSinDetalles.idEmpresa;
            this.descripcion = modeloCabSinDetalles.descripcion;
            this.modeloDetalle = modeloCabSinDetalles.modeloDetalle.map(modD => new ModeloDetalle(modD));
        } else {
            this.idModeloCab = null;
            this.idEmpresa = null;
            this.descripcion = null;
            this.modeloDetalle = null;
        }
    }

}