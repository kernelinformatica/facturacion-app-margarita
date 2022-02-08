import { Injectable } from "@angular/core";
import { AuthService } from "./authService";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { LocalStorageService } from "./localStorageService";
import { UtilsService } from "./utilsService";
import { BoundCallbackObservable } from "rxjs/observable/BoundCallbackObservable";
import { FilesService } from "./filesService";
import { DateLikePicker } from "app/models/dateLikePicker";
import { Padron } from "app/models/padron";
import { ComprobanteEncabezado } from "app/models/comprobanteEncabezado";
import { Contrato } from "app/models/contrato";
import { Comprobante } from "app/models/comprobante";
import { SisCanje } from "app/models/sisCanje";



@Injectable()
export class ContratosService {
    
    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService,
        private utilsService: UtilsService,
        private filesService: FilesService
    ) { }

    /**
    * Graba el contrato
    */
    grabarContrato = (file, recurso, callbackRouter) => {
        let reader = new FileReader();

        reader.onload = (
            p => (e) => {

                // Acá haces la request AJAX

                // Por ejemplo, yo hago esta:
                this.authService.grabarContrato(
                    e.target.result,
                    recurso,
                    this.localStorageService.getObject(environment.localStorage.acceso).token
                )
                .catch(err => {
                    this.utilsService.showErrorWithBody(err);

                    return Observable.of({
                        arraydatos: []
                    });
                })
                .subscribe(resp => {
                    this.utilsService.showModal(
                        resp.control.codigo
                    )(
                        resp.control.descripcion
                    )(
                        () => {
                            callbackRouter()
                        }
                    )();
                })
            }
        )(file);

        reader.readAsArrayBuffer(file);
    }

    /**
    * Edita el contrato
    */
    editarContrato = (file, recurso, callbackRouter) => {
        var reader = new FileReader();

        const completarEdicion = (result) => {
            this.authService.editarContrato(
                result,
                recurso,
                this.localStorageService.getObject(environment.localStorage.acceso).token
            )
            .catch(err => {
                this.utilsService.showErrorWithBody(err);

                return Observable.of({
                    arraydatos: []
                });
            })
            .subscribe(resp => {
                this.utilsService.showModal(
                    resp.control.codigo
                )(
                    resp.control.descripcion
                )(
                    () => {
                        callbackRouter()
                    }
                )();
            })
        }

        if (file) {
            reader.onload = (
                p => (e) => {
                    completarEdicion(e.target.result)
                }
            )(file);
    
            reader.readAsArrayBuffer(file);
        } else {
            completarEdicion(null)
        }

    }


    generarContrato = (file) => {
        var reader = new FileReader();

        reader.onload = (
            p => (e) => {
                this.filesService.generateDoc(e.target.result, {
                    test: 'testVar'
                })
            }
        )(file);

        reader.readAsArrayBuffer(file);
    }


    downloadContrato = (idContrato) => {
        return this.authService.downloadContrato(
            this.localStorageService.getObject(environment.localStorage.acceso).token,
            idContrato
        )
    }

    buscarComprobantesCanje = (fechasFiltro: { desde: DateLikePicker, hasta: DateLikePicker }, padronSelect: Padron, estadoComprobante) => 
        this.authService.buscaComprobantesCanje(
            this.localStorageService.getObject(environment.localStorage.acceso).token,
            fechasFiltro,
            padronSelect,
            estadoComprobante
        )


    /**
     * Relaciona un comprobante con un contrato
     */
    relacionContrato = (comprobante: ComprobanteEncabezado, contrato: Contrato) => 
        this.authService.relacionContrato(
            this.localStorageService.getObject(environment.localStorage.acceso).token,
            comprobante.idFactCab,
            contrato.idContratos
        ).catch(err => {
            this.utilsService.decodeErrorResponse(err);
            return Observable.throw(null)
        })



    /**
    * Genera un contrato nuevo al crear un nuevo comprobante venta
    */
    generarContratoByComprobante = (cliente: Padron, kilosCanjeReferencia: number, sisCanje: SisCanje) => {
        return this.authService.generarContratoByComprobante(
            cliente,
            kilosCanjeReferencia,
            sisCanje,
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )
    }
}