import { Empresa } from "./empresa";

export class RubroGrupo {
    idRubrosGrupos: number;
    empresa: Empresa;
    descripcion: string;
    codRubrosGrupos: number;

    constructor (rubroGrupo?: {
        idRubrosGrupos: number;
    empresa: Empresa;
    descripcion: string;
    codRubrosGrupos: number;

    }) {
        if (rubroGrupo) {
            this.idRubrosGrupos = rubroGrupo.idRubrosGrupos;
            this.empresa = new Empresa(rubroGrupo.empresa);
            this.descripcion = rubroGrupo.descripcion;
            this.codRubrosGrupos = rubroGrupo.codRubrosGrupos;
        } else {
            this.idRubrosGrupos =null;
            this.empresa = null;
            this.descripcion =null;
            this.codRubrosGrupos = null;
        }
    }

}
