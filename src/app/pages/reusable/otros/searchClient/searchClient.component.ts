import * as _ from 'lodash';
import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PopupListaService } from '../popup-lista/popup-lista-service';
import { Padron } from 'app/models/padron';
import { BehaviorSubject } from 'rxjs';
import { RecursoService } from 'app/services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import gruposParametros from 'constantes/gruposParametros';
import { UtilsService } from 'app/services/utilsService';

/**
 * Componente reutilizable para buscar clientes usando lazyload.
 */
@Component({
    selector: 'search-client',
    styleUrls: [('./searchClient.component.scss')],
    templateUrl: './searchClient.component.html'
})

export class SearchClient implements OnChanges {
    
    @Output() selectItem = new EventEmitter<Padron>();

    // Le paso un id padron inicial (se usa en los editar de los abm)
    @Input() idPadronInit;
    @Input() idNextElementToFocus;
    
    filtrados: BehaviorSubject<Padron[]> = new BehaviorSubject([]);
    cliente: Padron = new Padron();
    
    indEnfocado: number = -1;
    buscandoCliente = false;
    
    @Input() grupo = 'cliente';
    @Input() isRequired = true;

    constructor(
        private popupListaService: PopupListaService,
        private recursoService: RecursoService,
        public utilsService: UtilsService
    ) { }

    ngOnChanges(changes: SimpleChanges) {

        if (
            changes.idPadronInit && 
            changes.idPadronInit.currentValue
        ) {
            this.cliente.padronCodigo = changes.idPadronInit.currentValue
        }
        
    }

    findClientes = _.throttle(
        (busqueda) => {
            this.buscandoCliente = true;

            this.recursoService.getRecursoList(resourcesREST.padron)({
                // grupo: gruposParametros.cliente,
                grupo: gruposParametros[this.grupo],
                elementos: busqueda
            }).subscribe(clientes => {
                this.filtrados.next(clientes);
                this.buscandoCliente = false;
            })
        },
        400
    )

    /**
     * Evento change del input
     */
    onChangeInputCliente = (busqueda) => {
        // Limpio los clientes
        this.filtrados.next([]);
        this.cliente = new Padron();

        if (busqueda && busqueda.length >= 2) {
            this.findClientes(busqueda)
        }

        // Reseteo el indice
        this.indEnfocado = -1;
    }


    /**
     * Evento de cuando se apreta felcha arriba o feclah abajo en input de busca cliente
     */
    keyPressInputTexto = (e: any) => (upOrDown) => {
        e.preventDefault();
        // Hace todo el laburo de la lista popup y retorna el nuevo indice seleccionado
        this.indEnfocado = 
            this.popupListaService.keyPressInputForPopup(upOrDown)(this.filtrados.value)(this.indEnfocado)
    }
 
    /**
     * Evento on enter en el input de buscar cliente
     */
    onEnterInput = (e: any) => {
        e.preventDefault();
        this.filtrados.subscribe(cliLista => {
            // Busco el producto
            const cliSelect = cliLista && cliLista.length ? cliLista[this.indEnfocado] : null;
            // Lo selecciono
            cliSelect ? this.onClickPopupCliente(cliSelect) : null;
            // Reseteo el index
            this.indEnfocado = -1;
        })
    }

 
    /**
     * Event on click en la lista del popup de cliente
     */
    onClickPopupCliente = (cli: Padron) => {
        this.selectItem.emit(cli);
        this.cliente = cli;
    }
}
