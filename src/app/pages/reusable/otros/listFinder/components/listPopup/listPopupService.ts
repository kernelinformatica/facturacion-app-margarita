import { Injectable } from "@angular/core";
import { UtilsService } from "app/services/utilsService";

@Injectable()
export class ListPopupService {

    constructor(public utilsService: UtilsService) { }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////// Servicios popup ////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////

    keyPressInputForPopup = (upOrDown) => (lengthFilteredItems) => (indexFocusItem) => (keysToShow) => {
        if (
            lengthFilteredItems > 0 &&
            !(upOrDown === 'down' && indexFocusItem === lengthFilteredItems - 1) &&
            !(upOrDown === 'up' && indexFocusItem === 0)
        ) {

            // Primero actualizo el indice
            const newIndex = indexFocusItem + (upOrDown === 'down' ? 1 : -1);

            // Busco item activo
            let activeItem = document.getElementsByClassName('active-pop-elem');
            // Le borro la clase
            activeItem && activeItem[0] && activeItem[0].className ?
                activeItem[0].className = activeItem[0].className.replace(
                    'active-pop-elem',
                    ''
                ) : null

            // Agarro el elemento dom de la lista
            const liPopup: HTMLCollectionOf<any> = document.getElementsByClassName('li-popup-'+newIndex);

            // Lo selecciono y enfoco (si agarró algo)
            liPopup && liPopup[0] && liPopup[0].className ?
                liPopup[0].className += ' active-pop-elem' : null;

            // Si el item seleccionado es mayor a 9 (porque entran 10 en la lista), scrolleo un poco
            if (indexFocusItem >= 9) {
                const ulLista: HTMLCollectionOf<Element> = document.getElementsByClassName('ul-lista-popup');
                // Aca es 25 porque el alto de los <li> es 25
                const cantScroll = 25;

                ulLista[0].scrollTop += upOrDown === 'down' ? cantScroll : (cantScroll*-1);
            }

            return newIndex;
        } else {

            return indexFocusItem;
        }
    }

    getOffsetOfInputCliente = (idElemento) => this.utilsService.getOffset(document.getElementById(idElemento))

    /**
     * Fijarme length keysToShow
     */
    filterItems = (lista) => (textoBuscado) => (keysToShow) =>
        lista.filter(
            (item: any) =>  item[keysToShow[0]].toString().toLowerCase().includes(textoBuscado.toLowerCase()) ||
                            item[keysToShow[1]].toString().toLowerCase().includes(textoBuscado.toLowerCase())
        );


    /**
     * Muestra el item de acuerdo a las keys pasadas
     */
    parseItem = (item) => (keysToShow) => {
        const val = keysToShow
            .map(key => {
                const deepKey = key.includes('.') ? key.split('.') : null;
                return  deepKey ? item[deepKey[0]][deepKey[1]] ? item[deepKey[0]][deepKey[1]] : ''
                        :
                        item[key] ? item[key] : ''
            })
            .join(', ');

        return val && val !== ', ' ? val : ''
    }

}
