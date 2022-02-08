
export class FactPie {
    idFactPie: number;
    detalle: string;
    porcentaje: number;
    importe: number;
    ctaContable: string;
    idConceptos: number;
    idFactCab: number

    constructor(factPie?: {
        idFactPie: number;
        detalle: string;
        porcentaje: number;
        importe: number;
        ctaContable: string;
        idConceptos: number;
        idFactCab: number
    }) {
        if (factPie) {
            this.idFactPie = factPie.idFactPie;
            this.detalle = factPie.detalle;
            this.porcentaje = factPie.porcentaje;
            this.importe = factPie.importe;
            this.ctaContable = factPie.ctaContable;
            this.idConceptos = factPie.idConceptos;
            this.idFactCab = factPie.idFactCab
        } else {
            this.idFactPie = null;
            this.detalle = null;
            this.porcentaje = null;
            this.importe = null;
            this.ctaContable = null;
            this.idConceptos = null;
            this.idFactCab = null
        }
    }

}