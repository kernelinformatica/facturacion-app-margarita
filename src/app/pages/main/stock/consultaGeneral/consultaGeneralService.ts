import { Injectable } from "@angular/core";
import { Producto } from "app/models/producto";
import { AuthService } from "../../../../services/authService";
import { LocalStorageService } from "app/services/localStorageService";
import { environment } from "environments/environment";
import { Stock } from "../../../../models/stock";

@Injectable()
export class ConsultaGeneralService {
    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService
    ) { }

    filtrarProductos = (lista, textoBuscado) =>
        lista.filter(
            (prov: Producto) =>   prov.codProducto.toString().includes(textoBuscado) ||
                                prov.descripcion.toString().toLowerCase().includes(textoBuscado)
        );


    consultarStock = (filtros: any) =>
        this.authService.getBuscaStock(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            filtros
        )('general').map(
            resp => resp.arraydatos.map(
                (stockItem) => new Stock(stockItem)
            )
        )

    descargarReporte = (filtros: any) => 
        this.authService.descargaStock(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            filtros
        )('general')
}
