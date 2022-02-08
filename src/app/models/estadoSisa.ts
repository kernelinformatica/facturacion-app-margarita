export class EstadoSisa {
    idSisPorcentajeSisa: number;
    codEstado: number;
    iva: number;
    ganancias: number;
    ivaArroz: number;
    gananciaArroz: number;
    percepIva: number;
    ctaIva: string;
    ctaGan: string;

    constructor(estadoSisa?: {
        idSisPorcentajeSisa: number;
        codEstado: number;
        iva: number;
        ganancias: number;
        ivaArroz: number;
        gananciaArroz: number;
        percepIva: number;
        ctaIva: string;
        ctaGan: string;
    }) {
        if (estadoSisa) {
            this.idSisPorcentajeSisa = estadoSisa.idSisPorcentajeSisa;
            this.codEstado = estadoSisa.codEstado;
            this.iva = estadoSisa.iva;
            this.ganancias = estadoSisa.ganancias;
            this.ivaArroz = estadoSisa.ivaArroz;
            this.gananciaArroz = estadoSisa.gananciaArroz;
            this.percepIva = estadoSisa.percepIva;
            this.ctaIva = estadoSisa.ctaIva;
            this.ctaGan = estadoSisa.ctaGan;
        } else {
            this.idSisPorcentajeSisa = null;
            this.codEstado = null;
            this.iva = null;
            this.ganancias = null;
            this.ivaArroz = null;
            this.gananciaArroz = null;
            this.percepIva = null;
            this.ctaIva = null;
            this.ctaGan = null;
        }
    }

}