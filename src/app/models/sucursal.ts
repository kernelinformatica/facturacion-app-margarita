import { MenuSucursal } from "./menuSucursal";
import { Empresa } from "./empresa";

export class Sucursal {
    idSucursal: number;
    nombre: string;
    domicilio: string;
    codigoPostal: string;
    menuSucursal: any;
    empresa: Empresa;

    constructor (sucursal?: {
        idSucursal: number,
        nombre: string,
        domicilio: string,
        codigoPostal: string,
        menuSucursal: any,
        empresa: any
    }) {
        if (sucursal) {
            this.idSucursal = sucursal.idSucursal;
            this.nombre = sucursal.nombre;
            this.domicilio = sucursal.domicilio;
            this.codigoPostal = sucursal.codigoPostal;
            this.menuSucursal = new MenuSucursal(sucursal.menuSucursal);
            this.empresa = new Empresa(sucursal.empresa);
        } else {
            this.idSucursal = null;
            this.nombre = null;
            this.domicilio = null;
            this.codigoPostal = null;
            this.menuSucursal = new MenuSucursal();
            this.empresa = new Empresa();
        }
    }

}