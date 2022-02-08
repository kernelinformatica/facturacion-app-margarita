import { Vendedor } from "app/models/vendedor";
import { PadronGral } from "./padronGral";

export class Cliente {
    idCliente: number;
    padronGral: PadronGral;
    vendedor: Vendedor;

    auxNombreCompleto: string;

    auxCategoria: string;
    
    constructor(cliente?: {
        idCliente: number;
        padronGral: PadronGral;
        vendedor: Vendedor
    }) {
        if (cliente) {
            this.idCliente = cliente.idCliente;
            this.padronGral = new PadronGral(cliente.padronGral);
            this.vendedor = new Vendedor(cliente.vendedor);

            this.auxNombreCompleto = `${this.padronGral.apellido}${
                this.padronGral.nombre && this.padronGral.nombre.length > 0 ? ', ': ''
            } ${this.padronGral.nombre}`;

            this.auxCategoria = `${this.padronGral.categoria.descripcion}`;
        } else {
            this.idCliente = null;
            this.padronGral = new PadronGral();
            this.vendedor = new Vendedor();

            this.auxNombreCompleto = null;
            this.auxCategoria = null;
        }
    }

}