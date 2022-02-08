import { CanjesContratosCereales } from "./canjesContratosCereales";

export class ParametrosCanje {
    idParametroCanje: string;
    interesDiario: number;
    diasLibres: number;
    canjeCereal: CanjesContratosCereales;

    constructor(parametrosCanje?: {
        idParametroCanje: string;
        interesDiario: number;
        diasLibres: number;
        canjeCereal: CanjesContratosCereales;
    }) {
        if (parametrosCanje) {
            this.idParametroCanje = parametrosCanje.idParametroCanje;
            this.interesDiario = parametrosCanje.interesDiario;
            this.diasLibres = parametrosCanje.diasLibres;
            this.canjeCereal = new CanjesContratosCereales(parametrosCanje.canjeCereal);
        } else {
            this.idParametroCanje = null;
            this.interesDiario = null;
            this.diasLibres = null;
            this.canjeCereal = new CanjesContratosCereales(null);
        }
    }

}