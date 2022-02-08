import { Component, Output, EventEmitter, Input } from '@angular/core';
import { PopupListaService } from '../popup-lista/popup-lista-service';
import { BehaviorSubject } from 'rxjs';
import { UtilsService } from 'app/services/utilsService';
import { ProductoReducido } from 'app/models/productoReducido';

/**
 * Componente reutilizable para buscar productos usando lazyload
 */
@Component({
    selector: 'search-producto',
    styleUrls: [('./searchProducto.component.scss')],
    templateUrl: './searchProducto.component.html'
})

export class SearchProducto {
    
    @Output() selectItem = new EventEmitter<ProductoReducido>();
    @Input() idNextElementToFocus;
    @Input() productosReducidos: BehaviorSubject<ProductoReducido[]>;

    @Input() disableInput = false;
    
    todos: ProductoReducido[] = [];
    filtrados: BehaviorSubject<ProductoReducido[]> = new BehaviorSubject([]);

    itemSelect: ProductoReducido = new ProductoReducido();
    indEnfocado: number = -1;

    constructor(
        private popupListaService: PopupListaService,
        public utilsService: UtilsService
    ) { }
    

    ngOnInit() {
        // Me subscribo a los cambios de los productos reducidos y voy actualizando los filtrados y los totales
        this.productosReducidos
            .subscribe(prods => {
                this.todos = prods;
                this.filtrados.next(prods);
            })
    }

    /**
     * Evento change del input
     */
    onChangeInputSearch = (busqueda) => {
        // Limpio los clientes
        this.filtrados.next([]);
        this.itemSelect = new ProductoReducido();

        if (busqueda && busqueda.length >= 2) {
            
            this.filtrados.next(
                this.todos.filter(
                    (prodPend: ProductoReducido) => prodPend.codProducto.toString().includes(
                        busqueda.toString().toLowerCase()
                    ) ||
                    prodPend.descripcion.toString().toLowerCase().includes(
                        busqueda.toString().toLowerCase()
                    )
                )
            );

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
     * Evento on enter en el input de buscar
     */
    onEnterInput = (e: any) => {
        e.preventDefault();
        this.filtrados.subscribe(prodLista => {
            // Busco el producto
            const itemSelect = prodLista && prodLista.length ? prodLista[this.indEnfocado] : null;
            // Lo selecciono
            itemSelect ? this.onClickPopup(itemSelect) : null;
            // Reseteo el index
            this.indEnfocado = -1;
        })
    }

 
    /**
     * Event on click en la lista del popup
     */
    onClickPopup = (pro: ProductoReducido) => {
        this.selectItem.emit(pro);
        this.itemSelect = pro;
    }
}
