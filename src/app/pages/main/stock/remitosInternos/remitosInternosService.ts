import { Injectable } from "@angular/core";
import { AuthService } from "app/services/authService";
import { LocalStorageService } from "app/services/localStorageService";
import { environment } from "environments/environment";
import { ProductoPendiente } from "app/models/productoPendiente";
import { SisTipoOperacion } from "app/models/sisTipoOperacion";
import { Comprobante } from "app/models/comprobante";
import { Deposito } from "app/models/deposito";
import { ComprobanteRelacionado } from "app/models/comprobanteRelacionado";
import { ListaPrecio } from "app/models/listaPrecio";
import sisModulos from "constantes/sisModulos";
import { UtilsService } from "app/services/utilsService";
import { Observable } from "rxjs";
import { Lote } from "app/models/lote";

@Injectable()
export class RemitosInternosService {
    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService,
        private utilsService: UtilsService
    ) { }

    /**
     * Busca un producto
     */
    buscarProducto = (idProducto) => {
      /*busca por stock*/
      
      const idMonedaPeso = 1;

      return this.authService.getBuscarProducto(
          this.localStorageService.getObject(environment.localStorage.acceso).token
      )(idProducto)()(idMonedaPeso)()()()()()()
          .map(
              respProdEnc => respProdEnc && respProdEnc.arraydatos && respProdEnc.arraydatos.length > 0 ?
                  new ProductoPendiente(respProdEnc.arraydatos[0]) : null
          )
          .toPromise()

   
    // busca pro producto  
    
                


            /**
            * Retorna todos los productos de la empresa actual
            */
           







    }

    grabaRemitoInterno = (
        tipoOperacion: SisTipoOperacion,
        comprobante: Comprobante,
        depositoDestino: Deposito,
        depositoOrigen: Deposito,
        productosPend: ProductoPendiente[],
        lotesTraza: Lote[]
    ) => 
        this.authService.grabaRemitoInterno(
            this.localStorageService.getObject(environment.localStorage.acceso).token,
            tipoOperacion, 
            comprobante,
            depositoDestino,
            depositoOrigen,
            productosPend,
            lotesTraza
        )
            .map(
                resp => 
                    resp && resp['_body'] ?
                        (typeof resp['_body'] === 'object') ?
                            resp['_body'] : JSON.parse(resp['_body']) : 
                            null
            )
            .catch((err, caught) => {
                // debugger;
                this.utilsService.showErrorWithBody(err);
                return Observable.of(null);
            })
 
    buscarPendientes = (
        comprobante: Comprobante,
        comprobanteRel: ComprobanteRelacionado
    ) => {
    
        return this.authService.getProductosPendientes(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(null)(comprobanteRel)(comprobante)(null)(null)(sisModulos.interno)()()()()
            .catch(
                err => {
                    this.utilsService.showErrorWithBody(err);

                    return Observable.of({
                        arraydatos: []
                    });
                }
            )
            .map(
                respuesta => respuesta.arraydatos.map(
                    prodPend => new ProductoPendiente(prodPend)
                )
            );
    
    }

    buscaLotes = (productos: ProductoPendiente[], comprobante: Comprobante) => 
        this.authService.getBuscaLotes(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(productos)(comprobante).map(
            resp => resp.arraydatos.map(
                lote => new Lote(lote)
            )
        )
            
}