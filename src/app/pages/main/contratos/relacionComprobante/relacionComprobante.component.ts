import { Component } from '@angular/core';
import { resourcesREST } from 'constantes/resoursesREST';
import { UtilsService } from '../../../../services/utilsService';
import { ComprobanteEncabezado } from '../../../../models/comprobanteEncabezado';
import { BehaviorSubject, Observable } from 'rxjs';
import { DateLikePicker } from 'app/models/dateLikePicker';
import { Padron } from 'app/models/padron';
import { ContratosService } from 'app/services/contratosService';
import { Contrato } from 'app/models/contrato';
import { RecursoService } from 'app/services/recursoService';

@Component({
    selector: 'relacion-comprobante',
    styleUrls: ['./relacionComprobante.scss'],
    templateUrl: './relacionComprobante.html'
})
export class RelacionComprobante {
    resourcesREST = resourcesREST;

    compEncabezados: BehaviorSubject<ComprobanteEncabezado[]> = new BehaviorSubject([]);
    contratos: BehaviorSubject<Contrato[]> = new BehaviorSubject([]);

    compSeleccionado: ComprobanteEncabezado;
    contSeleccionado: Contrato;

    fechasFiltro: {
        desde: DateLikePicker,
        hasta: DateLikePicker
    } = {
        desde: new DateLikePicker(),
        hasta: new DateLikePicker()
    }

    padronSelect: Padron;

    estadoComprobante = 2;

    isLoading = false;

    constructor(
        public utilsService: UtilsService,
        private contratosService: ContratosService,
        private recursoService: RecursoService
    ) {
        

    }

    onClickRefrescar = () => {
        this.isLoading = true;

        this.contratosService.buscarComprobantesCanje(this.fechasFiltro, this.padronSelect, this.estadoComprobante)
            .subscribe(resp => {
                const encabezados = resp.arraydatos;

                // Actualizo encabezados
                this.compEncabezados.next(encabezados);
                
                encabezados && encabezados.length === 0 ?
                    this.utilsService.showModal('Aviso')('No se encontraron comprobantes con esas condiciones')()() &&
                    this.compEncabezados.next([])
                    : 
                    null;

                this.compSeleccionado = null;

                this.isLoading = false;

            })

        this.recursoService.getRecursoList(resourcesREST.contratos)({ idPadron: this.padronSelect.padronCodigo })
            .catch(err => {
                // Si hay algun error muestro el mensaje
                this.utilsService.decodeErrorResponse(err);
                this.contratos.next([]);
                return Observable.throw(err)
            })
            .subscribe((resp: any) => {
                // Actualizo contratos
                this.contratos.next(resp);

                resp && resp.length === 0 ?
                    this.utilsService.showModal('Aviso')('No se encontraron contratos para ese cliente')()() &&
                    this.contratos.next([])
                    : null;

                this.contSeleccionado = null;
            })
    }

    /**
     * Setea la fecha de compra calculandola dado un string en formato 'ddmm', parseando a 'dd/mm/aaaa'
     */
    onCalculateFecha = (e) => (keyFecha) => {
        if (!this.fechasFiltro[keyFecha] || typeof this.fechasFiltro[keyFecha] !== 'string') return;
        
        this.fechasFiltro[keyFecha] = this.utilsService.stringToDateLikePicker(this.fechasFiltro[keyFecha]);

        // Hago focus en el prox input y luego al boton buscar
        (keyFecha==='desde') ? document.getElementById("fechaHasta").focus() : 
            (keyFecha==='hasta') ? document.getElementById("btnBuscar").focus() : null;
    }

    onSelectCliente = (cli) => {

        this.padronSelect = cli;

        setTimeout(
            () => document.getElementById('btnBuscar').focus()
        )
    }

    /**
     * Formatea el numero pto-venta 4 caracteres y numero 8 caracteres
     */
    formatNumero = (numero) => 
        numero && numero.toString() && 
        numero.toString().substring(0, numero.toString().length - 8) ?
            `${numero.toString().substring(0, numero.toString().length - 8).padStart(4,0)} - ${numero.toString().substring(numero.toString().length - 8)}` :
            ''

    onClickRelacionar = () => {
        
        this.contratosService.relacionContrato(this.compSeleccionado, this.contSeleccionado)
            .subscribe((resp: any) => {
                this.utilsService.showModal(
                    resp.control.codigo
                )(
                    resp.control.descripcion
                )(
                )();
            })

    }

    onClickComprobante = (compBusc: ComprobanteEncabezado) => {
        this.compSeleccionado = compBusc; 
    }

    onClickContrato = (contBusc: Contrato) => {
        this.contSeleccionado = contBusc; 
    }
}
