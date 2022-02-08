export class Parametro {
    descripcion: string;
    valor: string;
    tipoValor: string;

    constructor(parametro?: {
        descripcion: string;
        valor: string;
        tipoValor: string;
    }) {
        if (parametro) {
            this.descripcion = parametro.descripcion;
            this.valor = parametro.valor
            this.tipoValor = parametro.tipoValor
        } else {
            this.descripcion = null;
            this.valor = null
            this.tipoValor = null;
        }
    }

}