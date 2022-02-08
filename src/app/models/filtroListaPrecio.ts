import { Rubro } from "./rubro";
import { SubRubro } from "./subRubro";
import { Moneda } from "./moneda";

export class FiltroListaPrecios {
    codProdDesde: string;
    codProdHasta: string;
    codProvedor: number;
    rubro: Rubro;
    subRubro: SubRubro;
    // porcentajeCabecera: number;
    porcentajeCabecera: string;
    cotaInfPorce: number;
    cotaSupPorce: number;
    moneda: Moneda;

    constructor(filtroListaPrecios?: {
        codProdDesde: string;
        codProdHasta: string;
        codProvedor: number;
        rubro: any;
        subRubro: any;
        // porcentajeCabecera: number;
        porcentajeCabecera: string;
        cotaInfPorce: number;
        cotaSupPorce: number;
        moneda : any;
    }) {
        if (filtroListaPrecios) {
            this.codProdDesde = filtroListaPrecios.codProdDesde;
            this.codProdHasta = filtroListaPrecios.codProdHasta;
            this.codProvedor = filtroListaPrecios.codProvedor;
            this.rubro = new Rubro(filtroListaPrecios.rubro);
            this.subRubro = new SubRubro(filtroListaPrecios.subRubro);
            this.porcentajeCabecera = filtroListaPrecios.porcentajeCabecera;
            this.cotaInfPorce = filtroListaPrecios.cotaInfPorce;
            this.cotaSupPorce = filtroListaPrecios.cotaSupPorce;
            this.moneda = new Moneda(filtroListaPrecios.moneda);
        } else {
            this.codProdDesde = null;
            this.codProdHasta = null;
            this.codProvedor = null;
            this.rubro = new Rubro();
            this.subRubro = new SubRubro();
            // this.porcentajeCabecera = null;
            this.porcentajeCabecera = Number(0).toFixed(2);
            this.cotaInfPorce = null;
            this.cotaSupPorce = null;
            this.moneda = new Moneda();
        }
    }
}