import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormaPago } from 'app/models/formaPago';

@Component({
    selector: 'tabla-forma-pago-comp',
    templateUrl: './tablaFormaPagoComp.html',
    styleUrls: ['./tablaFormaPagoComp.scss'],
})
    
export class TablaFormaPagoComp {
    // Datos de la tabla
    @Input() dataTable;
    @Input() moneda;
    // Eventos de cambio que atrapo en EmisionRemito
    @Output() onAddSelecFormaPago = new EventEmitter<FormaPago>();
    @Output() onRemoveSelecFormaPago = new EventEmitter<FormaPago>();

    seleccionados: FormaPago[] = [];

    constructor() { }

    /**
     * Checkea si se puede seleccionar o no
     */
    checkIfSeleccionable = (fp: FormaPago) => 
        true 
        // this.seleccionados.some(fpSelec => fpSelec.listaPrecio.idListaPrecio !== fp.listaPrecio.idListaPrecio)

    /**
     * Evento change del checkbox
     */
    onChangeCheckbox = (e) => (fp: FormaPago) => {
       
        if (e && e.target) {
            const estado = e.target.checked;

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
