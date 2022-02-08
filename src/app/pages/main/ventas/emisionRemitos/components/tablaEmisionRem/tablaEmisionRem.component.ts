
import { Component, Input } from '@angular/core';
import { UtilsService } from 'app/services/utilsService';
import { BehaviorSubject, Observable } from 'rxjs';
import { PopupListaService } from 'app/pages/reusable/otros/popup-lista/popup-lista-service';
import { ProductoPendiente } from '../../../../../../models/productoPendiente';
import { ProductoReducido } from '../../../../../../models/productoReducido';
import { TestBed } from '@angular/core/testing';

@Component({
    selector: 'tabla-emision-rem',
    templateUrl: './tablaEmisionRem.html',
    styleUrls: ['./tablaEmisionRem.scss']
})

export class TablaEmisionRem {
    showTooltip = false;
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
    @Input() checkPrecio;
    @Input() claveAutorizacion = false;
    @Input() subtotales: {
        idProducto: number,
        subtotal: number,
        subtotalIva: number,
        numeroComp: string,
        idFactDetalle: string
    }[];

    /////////// BUSQUEDA ///////////
    textoBusqueda: string;
    // @Input() productosObservable: Observable<ProductoPendiente[]>;
    @Input() productosObservable: BehaviorSubject<ProductoReducido[]>;

    productosBusqueda: {
        todos: ProductoReducido[];
        filtrados: BehaviorSubject<ProductoReducido[]>;
    } = { todos: [], filtrados: new BehaviorSubject([]) }

    productoSeleccionado: ProductoReducido = new ProductoReducido();
    // Inhdice del producto enfocado del popup
    productoEnfocadoIndex: number = -1;

    @Input() onClickProductoLista;

    // Lo uso para ver si la fecha fue seteada
    @Input() comprobante;

    @Input() tablaSubtotales = false;

    constructor(
        public utilsService: UtilsService,
        private popupListaService: PopupListaService
    ) { }

    ngOnInit() {
        // Cargo todos los productos pendientes posibles
        if (this.productosObservable) {
            this.productosObservable.subscribe(prodsPendPosibles => {
                this.productosBusqueda.todos = prodsPendPosibles;
                this.productosBusqueda.filtrados.next(prodsPendPosibles);
            });
        }

        console.log(this.remove);
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
     * @param valueKey
     */
    parseKey(valueKey, key?) {
        const tipoDato: any = typeof valueKey;

        if (tipoDato === 'boolean') {
            return valueKey ? 'Si' : 'No';
        } else if (tipoDato === 'object') {
            // Me fijo el nombre de la clase del objeto
            if (
                valueKey &&
                (
                    valueKey.constructor.name === 'DateLikePicker' ||
                    valueKey.year && valueKey.month && valueKey.day
                )
            ) {
                return `${valueKey.day < 10 ? '0' : ''}${valueKey.day}/${valueKey.month < 10 ? '0' : ''}${valueKey.month}/${valueKey.year}`
            }
        };

        // Si es numero, retorna la key nomas
        // return valueKey
        // return typeof valueKey === 'number' ?
        //     this.utilsService.parseDecimal(valueKey) : 
        //     valueKey


        return (key && key === 'precio' || typeof valueKey !== 'number') ?
            valueKey :
            this.utilsService.parseDecimal(valueKey)
    }

    /**
     * Retorna el subtotal requerido
     */
    getSubtotal = (item: ProductoPendiente) => (key) => {

        if (this.subtotales && this.subtotales.length > 0) {
            const subtotalBuscado = this.subtotales
                .find(
                    st => st.idFactDetalle === item.idFactDetalle
                );

            if (key === 'precioDesc') {
                // debugger;
                return subtotalBuscado && subtotalBuscado[key] ?
                    this.utilsService.toThreeDecimals(subtotalBuscado[key]) : 0
            } else {
                return this.utilsService.parseDecimal(
                    subtotalBuscado && subtotalBuscado[key] ?
                        subtotalBuscado[key] : 0
                )
            }

        } else {
            return null
        }

    }


    /**
     * Evento change del input de codProducto
     */
    onChangeInputItemAdd = (textoBuscado) => {
        this.productosBusqueda.filtrados.next(
            this.productosBusqueda.todos.filter(
                prodPend => prodPend.codProducto.toString().includes(textoBuscado) ||
                    prodPend.descripcion.toString().toLowerCase().includes(textoBuscado)
            )
        );
    }

    /**
     * Busca el producto y limpia la lista
     */
    onBlurInputItemAdd = (eventInput: any) => {
        // Busco si ingresó un cód producto
        const codIngre = eventInput && eventInput.currentTarget ? eventInput.currentTarget.value : null;
        
        // Si lo ingresó, lo busco en la lista de filtrados
        if (codIngre) {
            // Busco el producto en la lista
            const prodBuscado = this.productosBusqueda.filtrados.getValue().find(
                (p: ProductoReducido) => p.codProducto === codIngre
            );

            // Si lo encontré, lo selecciono. Sinó, no.
            if(prodBuscado) {
                this.onClickProductoListaLocal(prodBuscado);
            } else {
                this.utilsService.showModal('Error')('No existe un artículo con ese código')()()
            } 
         }


        setTimeout(()=>this.productosBusqueda.filtrados.next([]), 100);

        // También reseteo el indice de busqueda
        this.productoEnfocadoIndex = -1;
    }

    leftProduct = (event) => event.target.value ? this.utilsService.showModal("Error")("No existe un producto con ese codigo") : null

    tiraError = () => this.utilsService.showModal("Error")("No existe un producto con ese codigo")
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
        (subkey === 'fechaElab') ? document.getElementById("fecha-fechaVto").focus() : null;

        // Confirmo edicion despues de hacer blur en el último campo
        (subkey === 'fechaVto') ? this.confirmEdit(item) : null;
    }

    onCalculateFechaPago = (e) => (key) => (item) => {
        if (!item[key] || typeof item[key] !== 'string') return;

        item[key] = this.utilsService.stringToDateLikePicker(item[key]);
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

    checkIfEnEdicion = (col) => (item) =>
        col.enEdicion && col.enEdicion === item.idFactDetalle


    // Checkea si pongo el 'tick' para finalizar la edicion.
    checkIfShowTick(item) {
        if (this.columns) {
            return this.columns.some(col => {

                return col.enEdicion && (
                    (item && item.idFactDetalle && col.enEdicion === item.idFactDetalle) ||
                    (item.nroLote && col.enEdicion === item.nroLote) ||
                    (item.idFormaPagoDet && col.enEdicion === item.idFormaPagoDet) ||
                    (item.cuentaContable && col.enEdicion === item.cuentaContable)
                )

            });
        };
    }

    // Cheackea si esta en edicion
    checkIfEditOn = (item) => (col) => col.enEdicion && (
        (item && item.idFactDetalle && col.enEdicion === item.idFactDetalle) ||
        (item.nroLote && col.enEdicion === item.nroLote) ||
        (item.idFormaPagoDet && col.enEdicion === item.idFormaPagoDet) ||
        (item.cuentaContable && col.enEdicion === item.cuentaContable)
    )




    /**
     * Retorna la clase del input que se va a poner en edicio y enfocar primero, cuando se apreta en editar
     */
    getClassInputEditable = (item) => (col) => {
        if (item) {
            // Agarro el id dependiendo el tipo de archivo. Como lo uso en lotes trazables y en detalles formas pagos y productos pendientes, solo me fijo esos dos
            const idItem = item.nroLote ? item.nroLote :
                item.idFormaPagoDet ? item.idFormaPagoDet :
                    item.cuentaContable ? item.cuentaContable :
                        item && item.idFactDetalle ? item.idFactDetalle : '000';

            // 'form-control edit-input input-edit-' + item.producto.idProductos
            return `form-control edit-input${col.editarFocus ? ` editar-focus-${idItem}` : ''}`
        }
    }

    getPositionTooltip = () => {
        const fatherPosition = this.getOffsetOfAddInput();

        return {
            top: (fatherPosition.top - 3) + 'px',
            left: (fatherPosition.left + 60) + 'px'
        }
    }

    /**
     * Retorna true si PUEDE agregar un producto. 
     * Retorna false si NO PUEDE agregar un producto.
     */
    canAddProduct = () => {
        if(this.comprobante && this.comprobante.tipo && this.comprobante.tipo.idCteTipo && this.comprobante.tipo.idCteTipo == 77) {
            return this.comprobante.fechaComprobante &&
            this.comprobante.fechaComprobante.year && 
            this.comprobante.moneda && 
            this.comprobante.moneda.idMoneda &&
            this.claveAutorizacion
        } else {
            return this.comprobante.fechaComprobante &&
            this.comprobante.fechaComprobante.year && 
            this.comprobante.moneda && 
            this.comprobante.moneda.idMoneda
        }
    }
        

    checkIncluyeNetoAndIva = (col) => {
        const fafa = (
            col.key === 'subtotal' ||
            (
                col.key === 'importeTotal' &&
                col.nombre === 'importe'
            ) ||
            col.key === 'subtotalIva'
        ) &&
            this.comprobante.tipo &&
            this.comprobante.tipo.comprobante &&
            (
                (
                    !this.tablaSubtotales &&
                    !this.comprobante.tipo.comprobante.incluyeNeto
                ) ||
                (
                    this.tablaSubtotales &&
                    !this.comprobante.tipo.comprobante.incluyeIva
                ) || (
                    col.key === 'subtotalIva' &&
                    !this.comprobante.tipo.comprobante.incluyeIva
                )

            )

        return fafa
    }

    /**
     * 
     */
    onBlurInput = (e, col) => col.decimal &&
        this.utilsService.onBlurInputNumber(e)

}