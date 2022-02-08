import { SisLetra } from "./sisLetra";
import { CodigoAfip } from "./codigoAfip";
import { Numerador } from "./numerador";
import { TipoComprobante } from "./tipoComprobante";

export class LetraCodigo {
    idCteTipoSisLetra: number;
    letra: SisLetra;
    codigoAfip: CodigoAfip;
    numeradores: Numerador[];
    cteTipo: TipoComprobante;

    constructor(letraCodigo?: {
        idCteTipoSisLetra: number;
        letra: any;
        codigoAfip: any;
        numeradores: any[];
        cteTipo: any;
    }) {
        if (letraCodigo) {
            this.idCteTipoSisLetra = letraCodigo.idCteTipoSisLetra;
            this.letra = new SisLetra(letraCodigo.letra)
            this.codigoAfip = new CodigoAfip(letraCodigo.codigoAfip)
            this.numeradores = letraCodigo.numeradores.map(n => new Numerador(n))
            this.cteTipo = new TipoComprobante(letraCodigo.cteTipo)
        } else {
            this.idCteTipoSisLetra = null;
            this.letra = null;
            this.codigoAfip = null;
            this.numeradores = null;
            this.cteTipo = null
        }
    }

}