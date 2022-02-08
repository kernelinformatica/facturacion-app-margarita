export class Cereales {
    cerealCodigo: string;
    nombre: string;

    constructor(cereal?: {
        cerealCodigo: string;
        nombre: string;
    }) {
        if (cereal) {
            this.cerealCodigo = cereal.cerealCodigo;
            this.nombre = cereal.nombre;
        } else {
            this.cerealCodigo = null;
            this.nombre = null;
        }
    }

}