
import { Component, Input } from '@angular/core';
import { UtilsService } from 'app/services/utilsService';
import { BehaviorSubject, Observable } from 'rxjs';
import { PopupListaService } from 'app/pages/reusable/otros/popup-lista/popup-lista-service';
import { ProductoPendiente } from '../../../../../../models/productoPendiente';

@Component({
    selector: 'tabla-productos',
    templateUrl: './tablaProductos.html',
    styleUrls: ['./tablaProductos.scss']
})
    
export class TablaProductos {
    // Datos de mierda que me da paja sacar por miedo a romper todo
    sortBy = 'nombre';
    filterQuery = "";
    rowsOnPage = 10;
    sortOrder = "asc";
    // Fin datos de mierda

    // Reusabilidad tabla
    @Input() enableAddItem = false;

    
    @Input() columns;
    @Input() data;
    @Input() edit;
    @Input() remove;
    @Input() confirmEdit;

    @Input() subtotales: {
        idProducto: number,
        subtotal: number,
        subtotalIva: number
    }[];

    /////////// BUSQUEDA ///////////
    textoBusqueda: string;
    @Input() productosObservable: Observable<ProductoPendiente[]>;
    productosBusqueda: {
        todos: ProductoPendiente[];
        filtrados: BehaviorSubject<ProductoPendiente[]>;
    } = {todos: [], filtrados: new BehaviorSubject([])}

    productoSeleccionado: ProductoPendiente = new ProductoPendiente();
    // Inhdice del producto enfocado del popup
    productoEnfocadoIndex: number = -1;

    @Input() onClickProductoLista;
    
    // Lo uso para ver si la fecha fue seteada
    @Input() comprobante;


    @Input() filtros;

    @Input() onFilter;

    constructor(
        public utilsService: UtilsService,
        private popupListaService: PopupListaService
    ) {
    
    }

    ngOnInit() {
        // Cargo todos los productos pendientes posibles
        if (this.productosObservable) {
            this.productosObservable.subscribe(prodsPendPosibles => {
                this.productosBusqueda.todos = prodsPendPosibles;
                this.productosBusqueda.filtrados.next(prodsPendPosibles);
            });
        }
    }

    
    toInt(num: string) {
        return +num;
    }

    sortByWordLength = (a: any) => {
        return a.city.length;
    }

    /**
     * Obtiene el style a partir de una columna
     * @param col
     */
    getStyleFromCol(col) {
        let styles = {
            'width': col.ancho,
            'border-top': 'none'
        };
        return styles;
    }

    /**
     * Este método checkea el tipo de dato de la key y la parsea de acuerdo a el. Por ejemplo, si es boolean retorna 'si' en 'true' y 'no' en 'false'
     * @param key
     */
    parseKey(key) {
        const tipoDato:any = typeof key;

        if (tipoDato === 'boolean') {
            return key ? 'Si' : 'No';
        } else if (tipoDato === 'object'){
            // Me fijo el nombre de la clase del objeto
            if (
                key && 
                (
                    key.constructor.name === 'DateLikePicker' ||
                    key.year && key.month && key.day
                )
            ) {
                return `${key.day<10 ? '0' : ''}${key.day}/${key.month<10 ? '0' : ''}${key.month}/${key.year}`
            }
        };
        
        return key;
    }


    /**
     * Evento change del input de codProducto
     */
    onChangeInputItemAdd = (textoBuscado) => {
        this.productosBusqueda.filtrados.next(
            this.productosBusqueda.todos.filter(
                prodPend => prodPend.producto.codProducto.toString().includes(textoBuscado) || 
                            prodPend.producto.descripcion.toString().toLowerCase().includes(textoBuscado)
            )
        );
    }
    
    /**
     * El blur es cuando se hace un leave del input (caundo se apreta click afuera por ejemplo).
     * Acá lo que hago es poner un array vacio como próx valor de los filtrados, cosa que la lista desaparezca porque no hay nada
     */
    onBlurInputItemAdd = () => {
        setTimeout(()=>this.productosBusqueda.filtrados.next([]), 100);
        // También reseteo el indice de busqueda
        this.productoEnfocadoIndex = -1;
    }

    /**
     * Retorna el offset del input add
     */
    getOffsetOfAddInput = () => {
        return this.utilsService.getOffset(document.getElementById('addInput')); 
    }


    /**
     * Setea la fecha de compra calculandola dado un string en formato 'ddmm', parseando a 'dd/mm/aaaa'
     */
    onCalculateFecha = (e) => (key) => (subkey) => (item) => {
        if (!item[key][subkey] || typeof item[key][subkey] !== 'string') return;
        
        item[key][subkey] = this.utilsService.stringToDateLikePicker(item[key][subkey]);

        // Hago focus en el prox input
        (subkey==='fechaElab') ? document.getElementById("fecha-fechaVto").focus() : null;

        // Confirmo edicion despues de hacer blur en el último campo
        (subkey === 'fechaVto') ? this.confirmEdit(item) : null;
    }


    /**
     * Evento de cuando se apreta felcha arriba o feclah abajo en input de busca producto
     */
    keyPressInputTexto = (e: any) => (upOrDown) => {
        e.preventDefault();
        // Hace todo el laburo de la lista popup y retorna el nuevo indice seleccionado
        this.productoEnfocadoIndex = 
            this.popupListaService.keyPressInputForPopup(upOrDown)(this.productosBusqueda.filtrados.value)(this.productoEnfocadoIndex)
    }

    /**
     * Evento on enter en el input de buscar productos
     */
    onEnterInputBuscProd = (e: any) => {
        e.preventDefault();
        this.productosBusqueda.filtrados.subscribe(prodsLista => {
            // Busco el producto
            const prodSelect = prodsLista && prodsLista.length ? prodsLista[this.productoEnfocadoIndex] : null;
            // Lo selecciono
            prodSelect ? this.onClickProductoListaLocal(prodSelect) : null;
            // Reseteo el indice del prod buscado
            this.productoEnfocadoIndex = -1;
        })
    }

    /**
     * Funcionalidad extra en onclickproductolsita
     */
    onClickProductoListaLocal = (prodSelect) => {
        this.textoBusqueda = '';
        this.onClickProductoLista(prodSelect)
    }

    /**
     * Retorna el subtotal requerido
     */
    getSubtotal = (item: ProductoPendiente) => (key) => {
        const subtotalBuscado = this.subtotales
            .find(st => st.idProducto === item.producto.idProductos);
            
        return subtotalBuscado && subtotalBuscado[key] ? 
            subtotalBuscado[key] : 0
    }


    // Checkea si NO esta en edicion
    // checkIfEnEdicion = (col) => (item) => 
    //     !col.enEdicion || col.enEdicion !== item.producto.idProductos

    checkIfEnEdicion = (col) => (item) => 
        col.enEdicion && col.enEdicion === item.producto.idProductos
    
        
    // Checkea si pongo el 'tick' para finalizar la edicion.
    checkIfShowTick(item) {
        if (this.columns) {
            return this.columns.some(col=>{
                
                return col.enEdicion && (
                    (item.producto && item.producto.idProductos && col.enEdicion === item.producto.idProductos) ||
                    (item.nroLote && col.enEdicion === item.nroLote) ||
                    (item.idFormaPagoDet && col.enEdicion === item.idFormaPagoDet)
                )

            });
        };
    }

    // Cheackea si esta en edicion
    checkIfEditOn = (item) => (col) => col.enEdicion && (
        (item.producto && item.producto.idProductos && col.enEdicion === item.producto.idProductos) ||
        (item.nroLote && col.enEdicion === item.nroLote) ||
        (item.idFormaPagoDet && col.enEdicion === item.idFormaPagoDet)
    )
    
    

    /**
     * Retorna la clase del input que se va a poner en edicio y enfocar primero, cuando se apreta en editar
     */
    getClassInputEditable = (item) => (col) => {
        if (item){
            // Agarro el id dependiendo el tipo de archivo. Como lo uso en lotes trazables y en detalles formas pagos y productos pendientes, solo me fijo esos dos
            const idItem =  item.nroLote ? item.nroLote : 
                            item.idFormaPagoDet ? item.idFormaPagoDet : 
                            item.producto && item.producto.idProductos ? item.producto.idProductos : '000';

            // 'form-control edit-input input-edit-' + item.producto.idProductos
            return `form-control edit-input${col.editarFocus ? ` editar-focus-${idItem}` : '' }`
        }    
    }
}
