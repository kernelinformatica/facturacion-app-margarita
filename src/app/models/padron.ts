import { CondIva } from "app/models/condIva";

export class Padron {
    padronCodigo: any;
    padronApelli: string;
    padronNombre: string;
    codigoPostal: number;
    cuit: number;
    condIva: CondIva;
    padronDomicilio: string;
    padronNro: string;

    constructor(padron?: {
        padronCodigo: any;
        padronApelli: string;
        padronNombre: string;
        codigoPostal: number;
        cuit: number;
        condIva: CondIva;
        padronDomicilio: string;
        padronNro: string;
    }) {
        if (padron) {
            this.padronCodigo = padron.padronCodigo;
            this.padronApelli = padron.padronApelli;
            this.padronNombre = padron.padronNombre;
            this.codigoPostal = padron.codigoPostal;
            this.cuit = padron.cuit;
            this.condIva = new CondIva(padron.condIva);
            this.padronDomicilio = padron.padronDomicilio;
            this.padronNro = padron.padronNro;
        } else {
            // this.padronCodigo = null;
            // this.padronApelli = null;
            // this.padronNombre = null;
            // this.codigoPostal = null;
            // this.cuit = null;
            // this.condIva = new CondIva(null);
            this.padronCodigo = null;
            this.padronApelli = undefined;
            this.padronNombre = undefined;
            this.codigoPostal = undefined;
            this.cuit = undefined;
            // this.condIva = new CondIva(null);
            this.condIva = null;
            this.padronDomicilio = null;
            this.padronNro = null;
        }
    }

}