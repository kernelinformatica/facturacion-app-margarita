import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RecursoService } from '../../../../services/recursoService';
import { PopupListaService } from '../popup-lista/popup-lista-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ListPopupService } from './components/listPopup/listPopupService';

@Component({
    selector: 'list-finder',
    styleUrls: ['./listFinder.scss'],
    templateUrl: './listFinder.html'
})
export class ListFinder {

    @Input() title = '';
    @Input() items = Observable.of([])
    @Input() keysToShow = [];
    @Input() defectValue = '';
    @Input() idToFocusLater = '';

    @Output() onSelectItem = new EventEmitter<any>();


    searchedText = '';

    itemsPlain = {
        all: [],
        filtered: new BehaviorSubject([])
    }

    focusIndex = -1;

    isOpenList = false;

    constructor(
        private listPopupService: ListPopupService
    ) {

    }

    ngOnInit() {
        this.items.subscribe(observedItems => {
            this.itemsPlain.all = observedItems;
            this.itemsPlain.filtered.next(observedItems);
        });


    }

    ngOnChanges() {
        // Muestro el valor por defecto
        if (this.defectValue) {
            this.searchedText = this.listPopupService.parseItem(this.defectValue)(this.keysToShow);
        }
    }

    /**
     * Change event input (when inputeas algo)
     */
    onChangeSearch = (value) => {
        // Filtro por busqueda
        this.itemsPlain.filtered.next(
            this.listPopupService.filterItems(
                this.itemsPlain.all
            )(
                value
            )(
                this.keysToShow
            )
        );

        // Reseteo el indice
        this.focusIndex = -1;
    }

    /**
     * When press UP or DOWN
     */
    keyPressInput = (e: any) => (upOrDown) => {

        e.preventDefault();
        // Hace todo el laburo de la lista popup y retorna el nuevo indice seleccionado
        this.focusIndex = this.listPopupService.keyPressInputForPopup(
            upOrDown
        )(
            this.itemsPlain.filtered.value.length
        )(
            this.focusIndex
        )(
            this.keysToShow
        );
    }

    _onSelectItemList = (item) => {
        // Emito el evento click del componente padre
        this.onSelectItem.emit(item);
        // Vacio filtrados y focus lote input
        this.itemsPlain.filtered.next([]);
        // Muestro el elemento seleccionado
        this.searchedText = this.listPopupService.parseItem(item)(this.keysToShow);
        // Hago focus en el elemento siguiente
        this.idToFocusLater && this.idToFocusLater.length > 0 && document.getElementById(this.idToFocusLater) ?
            document.getElementById(this.idToFocusLater).focus() : null;

    }

    /**
     * Evento on enter en el input de buscar cliente
     */
    onEnterInput = (e: any) => {
        e.preventDefault();
        // Busco el producto
        const itemList = this.itemsPlain.filtered.value;
        const itemSelect: any = itemList && itemList.length ? itemList[this.focusIndex] : null;
        // Lo selecciono
        itemSelect ? this._onSelectItemList(itemSelect) : null;
        // Reseteo el index
        this.focusIndex = -1;
        // Vacio filtrados y focus lote input
        this.itemsPlain.filtered.next([])
    }
}
