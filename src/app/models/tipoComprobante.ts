import { SisComprobante } from "./sisComprobante";
import { Numerador } from "./numerador";
import { CodigoAfip } from "./codigoAfip";
import { SisLetra } from "./sisLetra";

export class TipoComprobante {
    idCteTipo: number;
    codigoComp: number;
    descCorta: string;
    descripcion: string;
    cursoLegal: boolean;
    surenu: string;
    observaciones: string;
    comprobante: SisComprobante;
    //numerador: any[];
    requiereFormaPago: boolean;

    letrasCodigos: any[];

    constructor (tipoComprobante?: {
        idCteTipo: number;
        codigoComp: number;
        descCorta: string;
        descripcion: string;
        cursoLegal: boolean;
        surenu: string;
        observaciones: string;
        comprobante: any;
        numerador: Numerador[];
        requiereFormaPago: boolean;
        letrasCodigos: any[];
    }) {
        if (tipoComprobante) {
            this.idCteTipo = tipoComprobante.idCteTipo;
            this.codigoComp = tipoComprobante.codigoComp;
            this.descCorta = tipoComprobante.descCorta;
            this.descripcion = tipoComprobante.descripcion;
            this.cursoLegal = tipoComprobante.cursoLegal;
            this.surenu = tipoComprobante.surenu;
            this.observaciones = tipoComprobante.observaciones;
            this.comprobante = new SisComprobante(tipoComprobante.comprobante);
            // this.numerador = tipoComprobante.numerador.map(n => new Numerador(n));
            this.requiereFormaPago = tipoComprobante.requiereFormaPago;

            this.letrasCodigos = tipoComprobante.letrasCodigos.map(lc => ({
                letra: new SisLetra(lc.letra),
                codigoAfip: new CodigoAfip(lc.codigoAfip),
                numeradores: lc.numeradores.map(n => new Numerador(n)),
                isEditing: false
            }));
            // debugger;
        } else {
            this.idCteTipo = null;
            this.codigoComp = null;
            this.descCorta = null;
            this.descripcion = null;
            this.cursoLegal = null;
            this.surenu = null;
            this.observaciones = null;
            this.comprobante = null;
            // this.numerador = null;
            this.requiereFormaPago = null;

            this.letrasCodigos = [];
        }
    }

    addOrRemoveLetra = (letra: SisLetra) => this.letrasCodigos &&
        this.letrasCodigos.some(lc => lc.letra.idSisLetra === letra.idSisLetra) ?
            this.letrasCodigos = this.letrasCodigos.filter(lc => lc.letra.idSisLetra !== letra.idSisLetra) :
            this.letrasCodigos = this.letrasCodigos.concat({
                letra,
                codigoAfip: null,
                isEditing: true
            })

    existLetra = (letra: SisLetra) => this.letrasCodigos &&
        this.letrasCodigos.some(lc => lc.letra.idSisLetra === letra.idSisLetra)

}
