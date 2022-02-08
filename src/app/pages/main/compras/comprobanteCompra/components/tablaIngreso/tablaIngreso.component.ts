import { Component, Input } from "@angular/core";
import { UtilsService } from "../../../../../../services/utilsService";
import { ProductoPendiente } from "../../../../../../models/productoPendiente";
import { BehaviorSubject } from "rxjs";
import { RecursoService } from "../../../../../../services/recursoService";
import { resourcesREST } from "constantes/resoursesREST";

import { PopupListaService } from "../../../../../reusable/otros/popup-lista/popup-lista-service";
import sisModulos from "constantes/sisModulos";
import sisTipoModelos from "constantes/sisTipoModelos";
import { ProductoReducido } from "../../../../../../models/productoReducido";

@Component({
    selector: "tabla-ingreso",
    templateUrl: "./tablaIngreso.html",
    styleUrls: ["./tablaIngreso.scss"],
})
export class TablaIngreso {
    showTooltip = false;
    // Datos de mierda que me da paja sacar por miedo a romper todo
    sortBy = "nombre";
    filterQuery = "";
    rowsOnPage = 10;
    sortOrder = "asc";
    // Fin datos de mierda

    // Reusabilidad tabla
    @Input() enableAddItem = false;

    // Inputs
    @Input() columns;
    @Input() data;
    @Input() edit;
    @Input() add;
    @Input() remove;
    @Input() confirmEdit;

    // Lo uso para habilitar/deshabilitar input de ingreso new prod
    @Input() comprobante;

    /////////// BUSQUEDA ///////////
    textoBusqueda: string;
    productosBusqueda: {
        todos: ProductoReducido[];
        filtrados: BehaviorSubject<ProductoReducido[]>;
    } = { todos: [], filtrados: new BehaviorSubject([]) };

    productoSeleccionado: ProductoReducido = new ProductoReducido();
    // Inhdice del producto enfocado del popup
    productoEnfocadoIndex: number = -1;

    @Input() onClickProductoLista;
    @Input() customsBlur = null;
    @Input() customLoseFocus = null;

    prodFocus = false;

    // Indica si es o no es la tabla de subtotales
    @Input() tablaSubtotales = false;

    constructor(
        public utilsService: UtilsService,
        private recursoService: RecursoService,
        private popupListaService: PopupListaService
    ) {
        recursoService
            .getRecursoList(resourcesREST.productosReducidos)({
                tipo: "reducida",
            })
            .subscribe((prods) => {
                // debugger;
                this.productosBusqueda.todos = prods;
                this.productosBusqueda.filtrados.next(prods);
            });
    }
    

    toInt(num: string) {
        return +num;
    }

    sortByWordLength = (a: any) => {
        return a.city.length;
    };

    /**
     * Obtiene el style a partir de una columna
     * @param col
     */
    getStyleFromCol(col) {
        let styles = {
            width: col.ancho,
            "border-top": "none",
        };
        //console.log(col.decimal);
        return styles;
    }

    /**
     * Este método checkea el tipo de dato de la key y la parsea de acuerdo a el. Por ejemplo, si es boolean retrona 'si' en 'true' y 'no' en 'false'
     * @param key
     */
    parseKey(key) {
        const tipoDato: any = typeof key;

        // debugger;

        if (tipoDato === "boolean") {
            return key ? "Si" : "No";
        }

        if (tipoDato === "object") {
            // Me fijo el nombre de la clase del objeto
            if (
                key &&
                (key.constructor.name === "DateLikePicker" ||
                    (key.year && key.month && key.day))
            ) {
                return `${key.day < 10 ? "0" : ""}${key.day}/${
                    key.month < 10 ? "0" : ""
                }${key.month}/${key.year}`;
            }
        }

        if (tipoDato === "number") {
            return key.toLocaleString();
        }

        return key;
    }

    /**
     * Evento change del input de codProducto
     */
    onChangeInputItemAdd = (textoBuscado) => {
        if (textoBuscado) {
            this.productosBusqueda.filtrados.next(
                this.productosBusqueda.todos.filter(
                    (prodPend) =>
                        prodPend.codProducto
                            .toString()
                            .includes(textoBuscado.toString().toLowerCase()) ||
                        prodPend.descripcion
                            .toString()
                            .toLowerCase()
                            .includes(textoBuscado.toString().toLowerCase())
                    // prodPend => prodPend.producto.codProducto.toString().includes(
                    //     textoBuscado.toString().toLowerCase()
                    // ) ||
                    // prodPend.producto.descripcion.toString().toLowerCase().includes(
                    //     textoBuscado.toString().toLowerCase()
                    // )
                )
            );
        }
    };

    /**
     * Busca el producto y limpia la lista
     */
    onBlurInputItemAdd = (eventInput: any) => {
        // Busco si ingresó un cód producto
        const codIngre =
            eventInput && eventInput.currentTarget
                ? eventInput.currentTarget.value
                : null;

        // Si lo ingresó, lo busco en la lista de filtrados
        if (codIngre) {
            // Busco el producto en la lista
            const prodBuscado = this.productosBusqueda.filtrados
                .getValue()
                .find((p: ProductoReducido) => p.codProducto === codIngre);

            // Si lo encontré, lo selecciono. Sinó, no.
            prodBuscado ? this.onClickProductoListaLocal(prodBuscado) : null;
        }

        setTimeout(() => this.productosBusqueda.filtrados.next([]), 100);

        // También reseteo el indice de busqueda
        this.productoEnfocadoIndex = -1;
        this.prodFocus = false;
    };

    /**
     * Retorna el offset del input add
     */
    getOffsetOfAddInput = () => {
        return this.utilsService.getOffset(document.getElementById("addInput"));
    };

    /**
     * Setea la fecha de compra calculandola dado un string en formato 'ddmm', parseando a 'dd/mm/aaaa'
     */
    onCalculateFecha = (e) => (key) => (subkey) => (item) => {
        // if (!item[key][subkey] || typeof item[key][subkey] !== 'string') {
        //     item[key][subkey] = '';
        //     return;
        // }
        if (!item[key][subkey]) {
            return;
        }

        item[key][subkey] = this.utilsService.stringToDateLikePicker(
            item[key][subkey]
        );

        // Hago focus en el prox input
        subkey === "fechaElab"
            ? document.getElementById("fecha-fechaVto").focus()
            : null;

        // Confirmo edicion despues de hacer blur en el último campo
        subkey === "fechaVto" ? this.confirmEdit(item) : null;
    };

    /**
     * Evento de cuando se apreta felcha arriba o feclah abajo en input de busca producto
     */
    keyPressInputTexto = (e: any) => (upOrDown) => {
        e.preventDefault();
        // Hace todo el laburo de la lista popup y retorna el nuevo indice seleccionado
        this.productoEnfocadoIndex =
            this.popupListaService.keyPressInputForPopup(upOrDown)(
                this.productosBusqueda.filtrados.value
            )(this.productoEnfocadoIndex);
    };

    /**
     * Evento on enter en el input de buscar productos
     */
    onEnterInputBuscProd = (e: any) => {
        e.preventDefault();
        this.productosBusqueda.filtrados.subscribe((prodsLista) => {
            // Busco el producto
            const prodSelect =
                prodsLista && prodsLista.length
                    ? prodsLista[this.productoEnfocadoIndex]
                    : null;
            // Lo selecciono
            prodSelect ? this.onClickProductoListaLocal(prodSelect) : null;
            // Reseteo el indice del prod buscado
            this.productoEnfocadoIndex = -1;
        });
    };

    /**
     * Funcionalidad extra en onclickproductolsita
     */
    onClickProductoListaLocal = (prodSelect) => {
        this.textoBusqueda = "";
        this.onClickProductoLista(prodSelect);
    };

    /**
     * Retorna la clase del input que se va a poner en edicio y enfocar primero, cuando se apreta en editar
     */
    getClassInputEditable = (item) => (col) => {
        if (item) {
            const idItem = item.cuentaContable
                ? item.cuentaContable
                : item.idFormaPagoDet
                ? item.idFormaPagoDet
                : // item.producto && item.producto.idProductos ? `${item.producto.idProductos}-${item.numero}` : '000'
                item.producto && item.idFactDetalle
                ? `${item.idFactDetalle}-${item.numero}`
                : "000";

            return `form-control edit-input${
                col.editarFocus ? ` editar-focus-${idItem}` : ""
            }`;
        }
    };

    // Checkea si pongo el 'tick' para finalizar la edicion.
    checkIfShowTick(item) {
        if (this.columns) {
            return this.columns.some((col) => {
                return (
                    col.enEdicion &&
                    ((item.cuentaContable &&
                        col.enEdicion === item.cuentaContable) ||
                        (item.idFormaPagoDet &&
                            col.enEdicion === item.idFormaPagoDet))
                );
            });
        }
    }

    // Cheackea si esta en edicion
    checkIfEditOn = (item) => (col) =>
        col.enEdicion &&
        // (item.producto && item.producto.idProductos && col.enEdicion === item.producto.idProductos) ||
        // (item.producto && item.producto.idProductos && col.enEdicion === `${item.producto.idProductos}-${item.numero}`) ||
        ((item.producto &&
            item.idFactDetalle &&
            col.enEdicion === `${item.idFactDetalle}-${item.numero}`) ||
            (item.cuentaContable && col.enEdicion === item.cuentaContable) ||
            (item.idFormaPagoDet && col.enEdicion === item.idFormaPagoDet));

    getPositionTooltip = () => {
        const fatherPosition = this.getOffsetOfAddInput();

        return {
            top: fatherPosition.top - 2 + "px",
            left: fatherPosition.left + 115 + "px",
        };
    };

    /**
     * Retorna la function blur de una columna dada (si esta tiene custom blur)
     */
    // getFunctionBlurOfColumn = (col) => {
    //     if (col && col.customBlur) {
    //         return this.customsBlur[col.customBlur];
    //     }
    // }

    force2decimals = (item) => (col) =>
        item && col && col.decimal
            ? (item[col.key] = parseFloat(item[col.key]).toFixed(2))
            : item[col.key];

    public modelChanged(event) {
        event.value = parseFloat(event.value).toFixed(2);
    }
    // agregar un elemento a la lista duplicando el registro al que se hizo click y creando una copia 
    // rescribiendo el indice 
    agregarElemento(item, idMaximo) {
        debugger
        let xMax = Math.max.apply(null, this.data.map(function(o) { return o.item; }));
        let temp = JSON.parse(JSON.stringify(item))
        temp.item = xMax+1
        this.data.push(JSON.parse(JSON.stringify(temp)));
    }

    borrarItem(item, index) {
        (this.data as Array<any>).splice(index, 1);
    }
   
}
