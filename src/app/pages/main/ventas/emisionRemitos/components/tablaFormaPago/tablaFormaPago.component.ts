import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { FormaPago } from 'app/models/formaPago';
import { ListaPrecio } from 'app/models/listaPrecio';

@Component({
    selector: 'tabla-forma-pago',
    templateUrl: './tablaFormaPago.html',
    styleUrls: ['./tablaFormaPago.scss']
})
    
export class TablaFormaPago {
    // Datos de la tabla
    @Input() dataTable;
    @Input() disableRest = false;

    // Eventos de cambio que atrapo en EmisionRemito
    @Output() onAddSelecFormaPago = new EventEmitter<FormaPago>();
    @Output() onRemoveSelecFormaPago = new EventEmitter<FormaPago>();

    seleccionados: FormaPago[] = [];
    seleccionado: string = null;

    constructor() { }

    /**
     * Evento change del checkbox
     */
    onChangeCheckbox = (e) => (fp: FormaPago) => {
        if (e && e.target) {
            const estado = e.target.checked;
            this.seleccionado = estado ? fp.descripcion : null;
            // Actualizo la lista de seleccioandos del componete emisionRemitos
            estado ? 
                this.onAddSelecFormaPago.emit(fp) :
                this.onRemoveSelecFormaPago.emit(fp);

            // También actualizo la lista seleccionados de este componente (lo necesito para checkear si los checkbox son seleccionables o no)
            estado ? 
                this.seleccionados.push(fp) :
                this.seleccionados = this.seleccionados.filter(fpSelec => fpSelec.idFormaPago !== fp.idFormaPago);
        }
    }

    /**
     * Focusea el input de buscar producto, si y solo si es el último checkbox el bluseado
     */
    onBlurCheckbox = (isLast) => 
        isLast && document.getElementById('addInput') ? 
            document.getElementById('addInput').focus() : null
        
    
}
