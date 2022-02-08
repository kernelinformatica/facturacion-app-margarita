import * as _ from 'lodash';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductoReducido } from 'app/models/productoReducido';
import { RemitosInternosService } from '../../remitosInternosService';
import { ProductoPendiente } from 'app/models/productoPendiente';
import { UtilsService } from 'app/services/utilsService';
import { Comprobante } from 'app/models/comprobante';

@Component({
    selector: 'tabla-remitos-internos',
    templateUrl: './tablaRemitosInternos.html',
    styleUrls: ['./tablaRemitosInternos.scss']
})
    
export class TablaRemitosInternos {
    // Datos de la tabla
    @Input() dataTable: ProductoPendiente[] = [];
    // Productos para buscar en buscador
    @Input() productosReducidos: BehaviorSubject<ProductoReducido[]>;
    // Comprobante
    @Input() comprobante: Comprobante;

    @Output() emitActualizarTraza = new EventEmitter<ProductoReducido>();

    // Índice del producto que está en edición
    indexProdEnEdicion = null;

    constructor(
        private remitosInternosService: RemitosInternosService,
        private utilsService: UtilsService
    ) { };

    /**
     * Cuando se selecciona el producto reducido se hace una consulta buscando el producto completo
     */
    onSelectItem = (prod: ProductoReducido) => {
        
        this.remitosInternosService.buscarProducto(prod.idProductos)
            .then(
                (prod: ProductoPendiente) => {

                    let auxProd = Object.assign(prod);

                    auxProd.numero = this.utilsService.numeroObjectToString(this.comprobante.numerador)

                    this.dataTable.push(auxProd);

                    // Busco el índice del producto
                    const ind = this.dataTable.indexOf(auxProd);
                    // Lo pongo en edición
                    this.editItem(ind);

                    // Actualizo trazables
                    this.emitActualizarTraza.emit(auxProd)
                }
            )
    }

    editItem = (ind) => {
        this.indexProdEnEdicion = ind;
        setTimeout(() => document.getElementById('idInputEditPendiente').focus())
    }

    /**
     * Saca un producto de los agregados
     */
    remove = (prod: ProductoReducido) => {
        _.remove(
            this.dataTable,
            (prod: ProductoPendiente) => 
                prod.idFactDetalle === prod.idFactDetalle
        );

        // Actualizo trazables
        this.emitActualizarTraza.emit(prod)
    }
}
