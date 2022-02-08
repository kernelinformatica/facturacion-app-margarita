import { Vendedor } from "app/models/vendedor";
import { PadronGral } from "./padronGral";

export class ClienteModPost {
    clienteSelect;
    vendedorSelect;
    categVend;
    categCli;

    constructor(clienteModPost?: any) {
        this.clienteSelect = clienteModPost.clienteSelect;
        this.vendedorSelect = clienteModPost.vendedorSelect;
        this.categVend = clienteModPost.categVend;
        this.categCli = clienteModPost.categCli;
    }

}