import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ListPopupService } from './listPopupService';

@Component({
    selector: 'list-popup',
    styleUrls: [('./listPopup.scss')],
    templateUrl: './listPopup.html'
})

/**
 * COMPONENTE REUTILIZABLE
 *
 */
export class ListPopup {
    // Items a iterar y filtrar
    @Input() items;
    // Key a mostrar
    @Input() keysToShow: string[];
    // Evento click de cada item de la lista
    // @Input() onClickItem;
    @Output() onClickItem = new EventEmitter<any>();
    // Posicion padre
    @Input() fatherPosition: {top: number, left: number};

    constructor(private listPopupService: ListPopupService) { }

    _onClickItem(item) {
        this.onClickItem.emit(item);
    }



    getPosicionLista = () => {
        return {top: (this.fatherPosition.top + 22) + 'px', left: this.fatherPosition.left + 'px'}
    }




}
