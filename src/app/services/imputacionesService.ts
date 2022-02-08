import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/services/authService';

import { LocalStorageService } from './localStorageService';
import { ComprobanteEncabezado } from 'app/models/comprobanteEncabezado';
import { environment } from 'environments/environment';
import { ProductoPendiente } from 'app/models/productoPendiente';

@Injectable()
export class ImputacionesService {
    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService
    ) {
        
    }

    getImputacionesByComp = (compBusc: ComprobanteEncabezado) => 
        this.authService.getImputacionesByComp(
            this.localStorageService.getObject(environment.localStorage.acceso).token,
            compBusc
        ).map(resp => resp.array)
        // ).map(resp => resp.datos.detalle)
        

    /**
     * Dada una imputacion obtiene los productios pendientes
     */
    getProductosPendientes = (compEnca: any) => 
        this.authService.buscaPendientes(
            this.localStorageService.getObject(environment.localStorage.acceso).token,
            compEnca.idCteTipo,
            compEnca.numero,
            compEnca.idPadron,
            null,
            null,
            null,
            0
        )
        .map(
            respuesta => respuesta.arraydatos.map(
                prodPend => new ProductoPendiente(prodPend)
            )
        )

    getProductosPendientesProd = (compEnca: any, codigoProd: any) => 
        this.authService.buscaPendientesProd(
            this.localStorageService.getObject(environment.localStorage.acceso).token,
            compEnca.idCteTipo,
            compEnca.numero,
            compEnca.idPadron,
            null,
            null,
            null,
            0,
            codigoProd
        )
        .map(
            respuesta => respuesta.arraydatos.map(
                prodPend => new ProductoPendiente(prodPend)
            )
        )
    
        setImputaciones = (idFactDetalle, idFactDetalleImputa, cantidadImputada) => 
        this.authService.setImputaciones(
            this.localStorageService.getObject(environment.localStorage.acceso).token,
            idFactDetalle,
            idFactDetalleImputa,
            cantidadImputada
        ).map(resp => {
            console.log(resp);
            return resp;
        });
            
    

}
