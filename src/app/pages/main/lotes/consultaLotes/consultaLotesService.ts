import { Injectable } from "@angular/core";
import { Padron } from "app/models/padron";
import { Producto } from "app/models/producto";
import { AuthService } from "../../../../services/authService";
import { LocalStorageService } from "app/services/localStorageService";
import { environment } from "environments/environment";
import { Lote } from "../../../../models/lote";

@Injectable()
export class ConsultaLotesService {
    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService
    ) { }

    filtrarProveedores = (lista, textoBuscado) => 
        lista.filter(
            (prov: Padron) =>   prov.padronCodigo.toString().includes(textoBuscado) ||
                                prov.padronApelli.toString().toLowerCase().includes(textoBuscado)
        );    

    filtrarProductos = (lista, textoBuscado) => 
        lista.filter(
            (prov: Producto) =>   prov.codProducto.toString().includes(textoBuscado) ||
                                prov.descripcion.toString().toLowerCase().includes(textoBuscado)
        );    


    consultarLotes = (filtros: any) => 

        this.authService.getBuscaLote(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            filtros
        ).map(
            resp => resp.arraydatos.map(
                lot => new Lote(lot)
            )
        )

    

}