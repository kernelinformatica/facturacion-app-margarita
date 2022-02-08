import { SisCanje } from "./sisCanje";
import { DateLikePicker } from "./dateLikePicker";

export class Contrato {
    idContratos: number;
    contratoNro: string;
    idPadron: number;
    fechaNacimiento: DateLikePicker;
    nacionalidad: string;
    profesion: string;
    documento: string;
    padre: string;
    madre: string;
    observaciones: string;
    kilos: number;
    cosecha: number;
    sisCanje: SisCanje;
    fechaVto: DateLikePicker;
    contratoDet: any[];
    isDownloading: boolean;

    padronNombre: string;
    padronApelli: string;
    kilosCumplidos: number;
    
    constructor(contrato?: {
        idContratos: number;
        contratoNro: string;
        idPadron: number;
        fechaNacimiento: any;
        nacionalidad: string;
        profesion: string;
        documento: string;
        padre: string;
        madre: string;
        observaciones: string;
        kilos: number;
        cosecha: number;
        sisCanje: any;
        fechaVto: any;
        contratoDet: any;
        padronNombre: string;
        padronApelli: string;   
        kilosCumplidos: number;   
    }) {
        if (contrato) {
            this.idContratos = contrato.idContratos;
            this.contratoNro = contrato.contratoNro;
            this.idPadron = contrato.idPadron;
            this.fechaNacimiento = new DateLikePicker(new Date(contrato.fechaNacimiento));
            this.nacionalidad = contrato.nacionalidad;
            this.profesion = contrato.profesion;
            this.documento = contrato.documento;
            this.padre = contrato.padre;
            this.madre = contrato.madre;
            this.observaciones = contrato.observaciones;
            this.kilos = contrato.kilos;
            this.cosecha = contrato.cosecha;
            this.sisCanje = new SisCanje(contrato.sisCanje);
            this.fechaVto = new DateLikePicker(new Date(contrato.fechaVto));
            this.contratoDet = contrato.contratoDet;

            this.isDownloading = false;

            this.padronNombre = contrato.padronNombre;
            this.padronApelli = contrato.padronApelli;
            this.kilosCumplidos = contrato.kilosCumplidos;
        } else {
            this.idContratos = null;
            this.contratoNro = null;
            this.idPadron = null;
            this.fechaNacimiento = null;
            this.nacionalidad = null;
            this.profesion = null;
            this.documento = null;
            this.padre = null;
            this.madre = null;
            this.observaciones = null;
            this.kilos = null;
            this.cosecha = null;
            this.sisCanje = null;
            this.fechaVto = null;
            this.contratoDet = [];

            this.isDownloading = false;

            this.padronNombre = null;
            this.padronApelli = null;
            this.kilosCumplidos = null;
        }
    }
}
