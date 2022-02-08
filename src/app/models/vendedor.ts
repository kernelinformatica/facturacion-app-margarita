import { PadronGral } from "app/models/padronGral";

export class Vendedor {
    idVendedor: number;
    porcentaje: number;
    padronGral: PadronGral;

    auxNombreCompleto: string;
    auxCategoria: string;

    constructor(vendedor?: {
        idVendedor: number;
        porcentaje: number;
        padronGral: PadronGral;
    }) {
        if (vendedor) {
            this.idVendedor = vendedor.idVendedor;
            this.porcentaje = vendedor.porcentaje;
            this.padronGral = new PadronGral(vendedor.padronGral);

            this.auxNombreCompleto = `${this.padronGral.apellido ? this.padronGral.apellido : ''}${this.padronGral.apellido && this.padronGral.nombre ? ', ':''}${this.padronGral.nombre ? this.padronGral.nombre : ''}`
            
            this.auxCategoria = `${this.padronGral.categoria.descripcion}`;
        } else {
            this.idVendedor = null;
            this.porcentaje = null;
            this.padronGral = new PadronGral();

            this.auxNombreCompleto = null;
            this.auxCategoria = null;
        }
    }

}