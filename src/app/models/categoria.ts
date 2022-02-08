import { SisCategoria } from "app/models/sisCategoria";

export class Categoria {
    idCategoria: number;
    codigo: string;
    descripcion: string;
    sisCategoria: SisCategoria

    constructor(categoria?: {
        idCategoria: number;
        codigo: string;
        descripcion: string;
        sisCategoria: SisCategoria
    }) {
        if (categoria) {
            this.idCategoria = categoria.idCategoria;
            this.codigo = categoria.codigo;
            this.descripcion = categoria.descripcion;
            this.sisCategoria = new SisCategoria(categoria.sisCategoria)
        } else {
            this.idCategoria = null;
            this.codigo = null;
            this.descripcion = null;
            this.sisCategoria = new SisCategoria()
        }
    }

}