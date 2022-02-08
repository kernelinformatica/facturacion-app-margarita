import { Cereales } from './cereales';

export class CanjesContratosCereales {
    idCanjeContratoCereal: number;
    ctaContable: string;
    cerealCodigo: Cereales;

    constructor(ccc?: {
        idCanjeContratoCereal: number;
        ctaContable: string;
        cerealCodigo: Cereales;
    }) {
        if (ccc) {
            this.idCanjeContratoCereal = ccc.idCanjeContratoCereal;
            this.ctaContable = ccc.ctaContable;
            this.cerealCodigo = ccc.cerealCodigo;
        } else {
            this.idCanjeContratoCereal = null;
            this.ctaContable = null;
            this.cerealCodigo = null;
        }
    }

}