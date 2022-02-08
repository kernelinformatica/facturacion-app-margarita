import { Sucursal } from "./sucursal";

export class Perfil {
    idPerfil: number;
    descripcion: string;
    sucursal: Sucursal;

    constructor (perfil?: {
        idPerfil: number,
        descripcion: string,
        sucursal: {
            idSucursal: number,
            nombre: string,
            domicilio: string,
            codigoPostal: string,
            menuSucursal: any,
            empresa: any
        }   
    }) {
        if (perfil) {
            this.idPerfil = perfil.idPerfil;
            this.descripcion = perfil.descripcion;
            this.sucursal = new Sucursal(perfil.sucursal);
        } else {
            this.idPerfil = null;
            this.descripcion = null;
            this.sucursal = new Sucursal();
        }
    }

}