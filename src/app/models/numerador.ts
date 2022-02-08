
import { DateLikePicker } from "./dateLikePicker";
import { TipoComprobante } from "./tipoComprobante";
import { PtoVenta } from "./ptoVenta";
import { LetraCodigo } from "./letraCodigo";

export class Numerador {
    idCteNumerador: number;
    descripcion: string;
    fechaApertura: DateLikePicker;
    fechaCierre: DateLikePicker;
    ptoVenta: PtoVenta;
    numerador: string;
    letrasCodigos: LetraCodigo;
    auxNumero: string;
    cai: string;
    vtoCai: DateLikePicker;

    electronico: boolean;
    
    constructor(numerador?: {
        idCteNumerador: number;
        descripcion: string;
        ptoVenta: any;
        fechaApertura: any;
        fechaCierre: any;
        numerador: string;
        letrasCodigos: any;
        cai: string;
        vtoCai: any;
        electronico: boolean;
    }) {
        if (numerador) {
            this.idCteNumerador = numerador.idCteNumerador;
            this.descripcion = numerador.descripcion;
            this.ptoVenta = new PtoVenta(numerador.ptoVenta);
            this.fechaApertura = new DateLikePicker(new Date(numerador.fechaApertura));
            this.fechaCierre = new DateLikePicker(new Date(numerador.fechaCierre));
            this.numerador = numerador.numerador;
            this.letrasCodigos = new LetraCodigo(numerador.letrasCodigos)
            this.auxNumero = `${this.ptoVenta.ptoVenta.toString().padStart(4, '0')}-${this.numerador.toString().padStart(8, '0')}`;
            this.cai = numerador.cai;
            this.vtoCai = new DateLikePicker(new Date(numerador.vtoCai));
            
            this.electronico = numerador.electronico;
        } else {
            this.idCteNumerador = null;
            this.descripcion = null;
            this.ptoVenta = null;
            this.fechaApertura = null;
            this.fechaCierre = null;
            this.numerador = null;
            this.letrasCodigos = null;
            this.auxNumero = null;
            this.cai = null;
            this.vtoCai = null;

            this.electronico = null;
        }
    }
}