import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/services/authService';

import { LocalStorageService } from './localStorageService';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { UtilsService } from './utilsService';
import { resourcesREST } from 'constantes/resoursesREST';

// import dynamicClass from 'app/services/dynamicClassService';
import {dynamicClass} from 'app/services/dynamicClassService';
import { FiltroListaPrecios } from '../models/filtroListaPrecio';
import { DetalleProducto } from '../models/detalleProducto';
import { BehaviorSubject } from '../../../node_modules/rxjs';
import { ComprobanteEncabezado } from 'app/models/comprobanteEncabezado';
import { Versionado } from 'app/models/versionado';

@Injectable()
export class RecursoService {

    private edicionFinalizada: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    
    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService,
        public utilsService: UtilsService
    ) {
        // Inicializo en false cada vez que ingresa
        // this.edicionFinalizada.next(false);
    }
    
    /**
     * Cambia el estado de la edicion finalizada
     */
    setEdicionFinalizada = (val) => this.edicionFinalizada.next(val);

    /**
     * Retorna el valor de la edicion, si finalizó o no para este recurso
     */
    getEdicionFinalizada = () => this.edicionFinalizada.value

    /**
     * Obtiene la lista de un recurso mappeada a su clase
     * @param recursoRest Json con nombre y Clase del modelo a mappear
     * @param queryOrPathParams? Si es un array, son path. Si es un Objecto, son querys
     */
    getRecursoList = (recursoRest) => (queryOrPathParams?) => {
        // Si es un object (json), es queryParam, sino es pathParam
        const tipoParam = Array.isArray(queryOrPathParams) ? 'path' : 'query';

        const lista: Observable<any[]> = this.authService.getResourceList(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            recursoRest.nombre
        )(queryOrPathParams)(tipoParam).map(list => {
            return list.arraydatos.map(resource => {
                /*if(recursoRest.nombre == 'sisTipoOperacion') {
                    if(resource && resource.modulo && resource.modulo.idSisModulos == 2) {
                        console.log(resource);
                        if(resource.idSisTipoOperacion == 4 || resource.idSisTipoOperacion == 10) {
                            console.log("no entré");
                            return new recursoRest.Clase(resource);
                        }
                    } else {
                        return new recursoRest.Clase(resource);
                    }
                } else {
                    return new recursoRest.Clase(resource);
                }*/
                return new recursoRest.Clase(resource);
            })
        });

        return lista;
    }


    /**
     * Registra en la BD un nuevo recurso
     * @param recurso El recurso a registrar
     * @param headers Opcionalmente se le pueden setear los headers que se quiera
     */
    setRecurso = (recurso: any) => (headers?) => 
        this.authService.registrarRecurso(
            recurso
        )(
            headers ? headers : {
                token: this.localStorageService.getObject(environment.localStorage.acceso).token
            }
        )(
            this.utilsService.getNameRestOfResource(recurso)
        );
    

    /**
     * Edita un recurso existente
     * @param recurso El recurso
     * @param headers Opcionalmente se le pueden setear los headers que se quiera
    */
    editarRecurso = (recurso: any) => (headers?) => {
        return this.authService.editarRecurso(
            recurso
        )(
            headers ? headers : {
                token: this.localStorageService.getObject(environment.localStorage.acceso).token
            }
        )(
            this.utilsService.getNameRestOfResource(recurso)
        )
        // .then(() => this.toggleEdicionFinalizada()) // Finaliza la edición
    }

    /**
     * Borra un recurso dado su id
     */
    borrarRecurso = (idRecurso) => (recursoRest) => {
        return this.authService.removeRecurso(
            idRecurso
        )(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            recursoRest.nombre
        ).catch(
            (err) => {
                this.utilsService.showErrorWithBody(err, true);
                return null;
            }
        )
    }


    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////                CASOS PARTICULARES           ///////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    /**
     * Obtengo una lista de productos filtrada
     */
    getProductosByFiltro = (filtros: FiltroListaPrecios) => {
        return this.authService.getProductosByFiltro(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(filtros)
            .map(respuesta => respuesta.arraydatos.map(detalleProd => new DetalleProducto(detalleProd)) )
            .catch(err => {
                // Si hay algun error muestro el mensaje
                this.utilsService.decodeErrorResponse(err);
                return Observable.throw(err)
            });
    }

    getProximoCodigoProducto = () => this.authService
        .getProximoCodigoProducto(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )
        .map(resp => resp.datos.proximoCodigo)

    /**
     * Checkea si edito un recurso
     */
    checkIfEquals = (recurso, recursoOriginal) => {
        return _.isEqual(
            Object.assign({}, recurso),
            Object.assign({}, recursoOriginal)
        )
    }

    getParametrosCanje = () => this.authService.getParametrosCanje(this.localStorageService.getObject(environment.localStorage.acceso).token)
        .map(respuesta => {
            return respuesta.arraydatos;
        })

    abmParametrosCanje = (codigoFuncion, interesDiario, diasLibres, cerealCodigo, ctaContableSisa, idEmpresa, idParametrosCanje) => this.authService.abmParametrosCanje(this.localStorageService.getObject(environment.localStorage.acceso).token, codigoFuncion, interesDiario, diasLibres, cerealCodigo, ctaContableSisa, idEmpresa, idParametrosCanje)
        .map(respuesta => {
            return respuesta.control
        }).catch(error => {
            console.log(error._body.control);
            return Promise.resolve(error._body.control);
        });

    getCereales = () => this.authService.getCereales(this.localStorageService.getObject(environment.localStorage.acceso).token)
        .map(respuesta => {
            return {
                cereales: respuesta.arraydatos
            }
        })

    abmCereales = (codigoFuncion, ctaContable, cerealCodigo, idCanjeContratoCereal, idEmpresa) => this.authService.abmCerealesCanje(this.localStorageService.getObject(environment.localStorage.acceso).token, codigoFuncion, ctaContable, cerealCodigo, idCanjeContratoCereal, idEmpresa)
        .map(respuesta => {
            return respuesta.control
        }).catch(error => {
            console.log(error._body.control);
            return Promise.resolve(error._body.control);
        });


    getAllCereales = () => this.authService.getAllCereales(this.localStorageService.getObject(environment.localStorage.acceso).token)
        .map(
            response => {
                return response.arraydatos;
            }
        )

    getParametroPesificado = () => this.authService.getParametroPesificado(this.localStorageService.getObject(environment.localStorage.acceso).token)
        .map(respuesta => {
            return respuesta
        }).catch(error => {
            console.log(error._body.control);
            return Promise.resolve(error._body.control);
        });

    modificarParametroPesificado = (interesMensual) => this.authService.modificarParametroPesificado(this.localStorageService.getObject(environment.localStorage.acceso).token, interesMensual)
        .map(respuesta => {
            return respuesta.control
        }).catch(error => {
            console.log(error._body.control);
            return Promise.resolve(error._body.control);
        });

    actualizarProductosViejoANuevo = (codProdDesde, codProdHasta) => this.authService.actualizarProductosViejoANuevo(this.localStorageService.getObject(environment.localStorage.acceso).token, codProdDesde, codProdHasta)
        .map(respuesta => {
            return respuesta.control
        }).catch(error => {
            console.log(error._body.control);
            return Promise.resolve(error._body.control);
        });

    getCotizacionDatos = () => this.authService.getCotizacion(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        ).map(responseCotiz => responseCotiz.datos);

    getPosicionStockGral = (fechasFiltro) => (productoDesde) => (productoHasta) =>
        this.authService.getPosicionStockGral(this.localStorageService.getObject(environment.localStorage.acceso).token)(fechasFiltro)(productoDesde)(productoHasta)
            .catch(
                err => this.utilsService.decodeErrorResponse(err)
            )
            .map(
                respuesta => respuesta.arraydatos.map(posStock => posStock)
            )

    getPosicionStock = (fechasFiltro) => (producto) =>
            this.authService.getPosicionStock(this.localStorageService.getObject(environment.localStorage.acceso).token)(fechasFiltro)(producto)
                .catch(
                    err => this.utilsService.decodeErrorResponse(err)
                )
                .map(
                    respuesta => respuesta.arraydatos.map(posStock => posStock)
                )

    generarReportesPosStock = (fechaDesde) => (fechaHasta) => (codProducto) => 
                this.authService.reportePosStock(this.localStorageService.getObject(environment.localStorage.acceso).token)(fechaDesde)(fechaHasta)(codProducto)
    /**
     * Descargar pdf del comprobante
     */
    downloadComp = (compBusc: ComprobanteEncabezado, nombrePdf?, nroCopias?, esCanje?) => {

        compBusc.isDownloading = true;

        this.authService.descargarComprobante(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            compBusc.idFactCab
        )(nombrePdf)(nroCopias)(esCanje)
            .subscribe(resp => {
                const bodyResp = resp['_body'];

                var newBlob = new Blob([bodyResp], {type: "application/pdf"})
                
                // IE
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveOrOpenBlob(newBlob);
                    return;
                } 
                
                const data = window.URL.createObjectURL(newBlob);

                var link = document.createElement('a');
                link.href = data;
                // link.download="fileBody.pdf";
                link.download=`${compBusc.numero}.pdf`;
                link.click();

                // Firefox
                setTimeout(function(){
                    // For Firefox it is necessary to delay revoking the ObjectURL
                    window.URL.revokeObjectURL(data);
                }, 100);

                compBusc.isDownloading = false;
            });
            
    }

    //getVersion = () => this.authService.getVersion(this.localStorageService.getObject(environment.localStorage.acceso).token).map(response => new Versionado(response.datos));

}
