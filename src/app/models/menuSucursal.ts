export class MenuSucursal {
    idMenu: string;
    idPadre: string;
    nombre: string;
    icono: string;
    orden: number;
    nombreForm: string;

    constructor (menuSucursal?: {
        idMenu: string,
        idPadre: string,
        nombre: string,
        icono: string,
        orden: number,
        nombreForm: string
    }) {
        if (menuSucursal) {
            this.idMenu = menuSucursal.idMenu;
            this.idPadre = menuSucursal.idPadre;
            this.nombre = menuSucursal.nombre;
            this.icono = menuSucursal.icono;
            this.orden = menuSucursal.orden;
            this.nombreForm = menuSucursal.nombreForm;
        } else {
            this.idMenu = null;
            this.idPadre = null;
            this.nombre = null;
            this.icono = null;
            this.orden = null;
            this.nombreForm = null;
        }
    }

}