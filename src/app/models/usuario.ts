import { Perfil } from "./perfil";
import { ListaPrecio } from "./listaPrecio";
import { PtoVenta } from "./ptoVenta";

export class Usuario {
    idUsuario: number;
    email: string;
    nombre: string;
    apellido: string;
    usuario: string;
    clave: string;
    telefono: string;
    perfil: Perfil;
    listaPrecios: ListaPrecio[];
    ptoVentas: PtoVenta[];
    observaciones: string;
    constructor (usuario?: {
        id: number,
        email: string, 
        nombre:string, 
        apellido:string,
        usuario:string,
        clave:string,
        telefono: string,
        perfil: {
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
        },
        listaPrecios: any[],
        ptoVentas: any[],
        observaciones: string
    }) {
        if (usuario) {
            this.idUsuario = usuario.id;
            this.email = usuario.email;
            this.nombre = usuario.nombre;
            this.apellido = usuario.apellido;
            this.usuario = usuario.usuario;
            this.clave = usuario.clave;
            this.telefono = usuario.telefono;
            this.perfil = new Perfil(usuario.perfil);
            this.listaPrecios = usuario.listaPrecios.map(l => new ListaPrecio(l));
            this.ptoVentas = usuario.ptoVentas.map(l => new PtoVenta(l));
            this.observaciones = usuario.observaciones;
            
        } else {
            this.idUsuario = null;
            this.email = null;
            this.nombre = null;
            this.apellido = null;
            this.usuario = null;
            this.clave = null;
            this.telefono = null;
            this.perfil = new Perfil();
            this.listaPrecios = [];
            this.ptoVentas = [];
            this.observaciones = null;
        }
    }

    /**
     * Los admin no pueden editar lp
     */
    addOrRemoveLista = (lp: ListaPrecio) => this.listaPrecios &&
        this.perfil.descripcion !== 'Administrador' &&
        this.listaPrecios.some(cteLet => cteLet.idListaPrecio === lp.idListaPrecio) ?
            this.listaPrecios = this.listaPrecios.filter(cteLet => cteLet.idListaPrecio !== lp.idListaPrecio) :
            this.listaPrecios = this.listaPrecios.concat(lp)

    existLista = (letra: ListaPrecio) => this.listaPrecios &&
        this.listaPrecios.some(cteLet => cteLet.idListaPrecio === letra.idListaPrecio)

}