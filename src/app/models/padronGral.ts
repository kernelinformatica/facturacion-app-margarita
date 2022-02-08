import { Categoria } from "app/models/categoria";
import { IVA } from "./IVA";
import { SisSitIVA } from "app/models/sisSitIVA";

export class PadronGral {
    idPadronGral: number;
    nombre: string;
    apellido: string;
    cuit: string;
    domicilio: string;
    nro: string;
    localidad: string;
    categoria: Categoria;
    sisSitIVA: SisSitIVA;

    constructor(padronGral?: {
        idPadronGral: number;
        nombre: string;
        apellido: string;
        cuit: string;
        domicilio: string;
        nro: string;
        localidad: string;
        categoria: Categoria;
        sisSitIVA: SisSitIVA;
    }) {
        if (padronGral) {
            this.idPadronGral = padronGral.idPadronGral;
            this.nombre = padronGral.nombre;
            this.apellido = padronGral.apellido;
            this.cuit = padronGral.cuit;
            this.domicilio = padronGral.domicilio;
            this.nro = padronGral.nro;
            this.localidad = padronGral.localidad;
            this.categoria = padronGral.categoria;
            this.sisSitIVA = new SisSitIVA(padronGral.sisSitIVA);
        } else {
            this.idPadronGral = null;
            this.nombre = null;
            this.apellido = null;
            this.cuit = null;
            this.domicilio = null;
            this.nro = null;
            this.localidad = null;
            this.categoria = null;
            // this.sisSitIVA = new SisSitIVA();
            this.sisSitIVA = null;
        }
    }

}