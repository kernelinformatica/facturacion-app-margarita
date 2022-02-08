import { Injectable } from "@angular/core";
import {
    CotizacionDolar,
    FiltroComprobantePago,
    FiltroOrdenPago,
    GrabarOrdenesPago,
    ItemComprobantePago,
} from "app/models/comprobantes-pago";
import { environment } from "environments/environment";
import { AuthService } from "./authService";
import { LocalStorageService } from "./localStorageService";
import { Padron } from "app/models/padron";
import { UtilsService } from "./utilsService";

@Injectable()
export class OrdenesPagoService {
    public ordenesSeleccionadas: ItemComprobantePago[];
    public proveedorSeleccionado: Padron;
    public cotizacionDolar: CotizacionDolar[] = [];
    public ordenesDePago: ItemComprobantePago[] = [];
    constructor(
        private authService: AuthService,
        private utilsService: UtilsService,
        private localStorageService: LocalStorageService
    ) { }

    buscarComprobantesOrdenesPago(filters: FiltroComprobantePago) {
        return this.authService.buscarComprobantesOrdenesPago(
            this.localStorageService.getObject(environment.localStorage.acceso)
                .token,
            filters
        );
    }

    buscarOrdenesPago(filters: FiltroOrdenPago) {
        return this.authService.buscarOrdenesPago(
            this.localStorageService.getObject(environment.localStorage.acceso)
                .token,
            filters
        );
    }

    getCotizacionDolar() {
        this.authService
            .cotizacionDolar(
                this.localStorageService.getObject(
                    environment.localStorage.acceso
                ).token
            )
            .then((resp: any) => {
                this.cotizacionDolar = (
                    resp.arraydatos as Array<any>
                ).reverse();
            })
            .catch((error) => this.utilsService.decodeErrorResponse(error));
    }

    getMonedas() {
        return this.authService.obtenerMonedas(this.localStorageService.getObject(environment.localStorage.acceso).token);
    }

    grabaOrdenesDePago(dataOp: GrabarOrdenesPago) {
        return this.authService.grabaOrdenesDePago(this.localStorageService.getObject(environment.localStorage.acceso).token, dataOp);
    }

    getFormaPago() {
        return this.authService.obtenerFormaPago(
            this.localStorageService.getObject(environment.localStorage.acceso)
                .token
        );
    }

    getTipoOrdenPago() {
        return this.authService.obtenerTipoOrdenPago(this.localStorageService.getObject(environment.localStorage.acceso).token);
    }

    obtenerPdf(data: {
        idOpCab: number,
        nroCopias?: number,
    }){
        return this.authService.obtenerPdf(this.localStorageService.getObject(environment.localStorage.acceso).token, data)
    }

    obtenerTiposOrdenCompra(){
        return this.authService.obtenerTiposOrdenCompra(this.localStorageService.getObject(environment.localStorage.acceso).token)
    }

    borrarComprobanteOrdenPago(idOp:number){
        return this.authService.borrarComprobanteOrdenPago(this.localStorageService.getObject(environment.localStorage.acceso).token,idOp)
    }
}
