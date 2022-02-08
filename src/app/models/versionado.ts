export class Versionado {
    version: string;
    descripcion: string;

    constructor (versionado?: {
        version: string;
        descripcion: string;
    }) {
        if (versionado) {
            this.version = versionado.version;
            this.descripcion = versionado.descripcion;
        } else {
            this.version = null;
            this.descripcion = null;
        }
    }

}