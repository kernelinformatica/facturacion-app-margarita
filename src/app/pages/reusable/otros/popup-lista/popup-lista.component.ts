import { Component, Input, Inject } from '@angular/core';
import { WINDOW } from '../../../../services/windowService';

@Component({
    selector: 'popup-lista',
    styleUrls: [('./popup-lista.component.scss')],
    templateUrl: './popup-lista.component.html'
})

/**
 * COMPONENTE REUTILIZABLE
 * 
 */
export class PopupLista {
    // Items a iterar y filtrar
    @Input() items;
    // Key a mostrar
    @Input() keysToShow: string[];
    // Evento click de cada item de la lista
    @Input() onClickItem;
    // Posicion padre
    @Input() fatherPosition: {top: number, left: number};

    // itemsReduced = [];
    itemsReduced = null;
    itemsCompleted = [];

    // constructor(@Inject(WINDOW) private window: Window) { }
    constructor(@Inject(WINDOW) private window: any) { }

    ngOnInit() {
        this.items.subscribe(resp => {
            if (resp && resp.length > 30) {
                this.itemsReduced = resp.slice(0,30);
                this.itemsCompleted = resp;
    
                // Activo el infite scroll
                this.processInfiniteScroll();
            } else {
                this.itemsReduced = resp;
            }
        });
    }

    processInfiniteScroll = () => {
        this.window.addEventListener('scroll', (event) => {
            const sidenavBody = document.getElementsByClassName('list-group ul-lista-popup');

            if (sidenavBody && sidenavBody[0]){

                const posicionFinal = sidenavBody[0].scrollHeight - sidenavBody[0].clientHeight;
                const scrollTop = sidenavBody[0].scrollTop;

                if (posicionFinal - scrollTop <= 0) {
                    const nuevoIndex = (this.itemsReduced.length + 30) <= this.itemsCompleted.length ? (this.itemsReduced.length + 30) : this.itemsCompleted.length;

                    const nuevaTanda = this.itemsCompleted.slice(0, nuevoIndex);

                    this.itemsReduced = nuevaTanda;
                }
            };
        }, true)
    }

    /**
     * Muestra el item de acuerdo a las keys pasadas
     */
    parseItem = (item) => {
        return this.keysToShow
            .map(key => {
                const deepKey = key.includes('.') ? key.split('.') : null;
                // Si tiene deepKey entonces voy profundo en el json (ejemplo: producto.descripcion)
                return deepKey ? item[deepKey[0]][deepKey[1]] : item[key];
            })
            .join(', ');
    }

    getPosicionLista = () => {
        return {top: (this.fatherPosition.top + 22) + 'px', left: this.fatherPosition.left + 'px'}
    }

    onMouseDown = (item) => {
        this.onClickItem(item)
        this.itemsReduced = []
    }
}
