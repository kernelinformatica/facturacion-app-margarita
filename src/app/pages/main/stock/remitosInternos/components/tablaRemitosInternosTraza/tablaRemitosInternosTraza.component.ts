import * as _ from 'lodash';
import { Component, Input } from '@angular/core';
import { RemitosInternosService } from '../../remitosInternosService';
import { UtilsService } from 'app/services/utilsService';
import { Comprobante } from 'app/models/comprobante';
import { Lote } from 'app/models/lote';

@Component({
    selector: 'tabla-remitos-internos-traza',
    templateUrl: './tablaRemitosInternosTraza.html',
    styleUrls: ['./tablaRemitosInternosTraza.scss']
})
    
export class TablaRemitosInternosTraza {
    // Datos de la tabla
    @Input() dataTable: Lote[] = [];
    // Comprobante
    @Input() comprobante: Comprobante;

    // Índice del producto que está en edición
    indexProdEnEdicion = null;

    constructor(
        private utilsService: UtilsService
    ) { };

    editItem = (ind) => {
        this.indexProdEnEdicion = ind;
        setTimeout(() => document.getElementById('idInputEditPendiente').focus())
    }
}
