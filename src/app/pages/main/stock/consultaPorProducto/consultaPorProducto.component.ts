import { filter } from 'jszip';
import { Component } from '@angular/core';
import { UtilsService } from '../../../../services/utilsService';
import { Observable } from 'rxjs/Observable';
import { RecursoService } from '../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { PopupListaService } from '../../../reusable/otros/popup-lista/popup-lista-service';
import { Producto } from 'app/models/producto';
import { BehaviorSubject } from '../../../../../../node_modules/rxjs';
import { ConsultaPorProductoService } from './consultaPorProductoService';

@Component({
    selector: 'consulta-por-producto',
    styleUrls: ['./consultaPorProducto.scss'],
    templateUrl: './consultaPorProducto.html'
})

export class ConsultaPorProducto {

    // Filtros
    filtros: {
        fechaDesde: any,
        fechaHasta: any,
        codProducto: any,
        productoSelect: any,
        cteTipo: any,
        deposito: any
    } = {
        fechaDesde: null,
        fechaHasta: null,
        codProducto: null,
        productoSelect: null,
        cteTipo: null,
        deposito: null
    }

    // Info seleccionados
    info: {
        nombreProd: string
    } = {
        nombreProd: null
    }

    // Data de la tabla
    stockData = Observable.of([]);
    // importacion de comprobantes de ventas
    actualizaVentasStock  = Observable.of([]);
    // Desplegables
    cteTipos = Observable.of([]);
    depositos = Observable.of([]);
    
    // Indices
    productoEnfocadoIndex = -1;

    // Busquedas
    productos: { todos: Producto[]; filtrados: BehaviorSubject<Producto[]> } = { todos: [], filtrados: new BehaviorSubject([]) }

    isProdSelected = false;

    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private popupListaService: PopupListaService,
        private consultaPorProductoService: ConsultaPorProductoService
       
    ) {
        this.recursoService.getRecursoList(resourcesREST.productos)().subscribe(productos => {
            this.productos.todos = productos;
            this.productos.filtrados.next(productos);
        });

        this.cteTipos = this.recursoService.getRecursoList(resourcesREST.cteTipo)()
        this.depositos = this.recursoService.getRecursoList(resourcesREST.depositos)()
        debugger
    }

    /**
     * Autocompletar fechaHasta
     */
    onBlurFechaDesde = (e) => (!this.filtros.fechaDesde || typeof this.filtros.fechaDesde !== 'string') ?
        null : this.filtros.fechaDesde  = this.utilsService.stringToDateLikePicker(this.filtros.fechaDesde);

    onBlurFechaHasta = (e) => (!this.filtros.fechaHasta || typeof this.filtros.fechaHasta !== 'string') ?
        null : this.filtros.fechaHasta = this.utilsService.stringToDateLikePicker(this.filtros.fechaHasta);


  
    onClickConsultar = () => {
       this.filtros.fechaDesde = '2022-01-01';
    
        this.stockData = this.consultaPorProductoService.consultarStock(this.filtros);
        
    }
   
    ///// EVENTOS BUSQUEDA PRODUCTO /////

    keyPressInputTextoProd = (e: any) => (upOrDown) => {
        e.preventDefault();

        // Hace todo el laburo de la lista popup y retorna el nuevo indice seleccionado
        this.productoEnfocadoIndex = 
            this.popupListaService.keyPressInputForPopup(upOrDown)(this.productos.filtrados.value)(this.productoEnfocadoIndex)
    }

    /**
     * Evento on enter en el input de buscar cliente
     */
    onEnterInputProd = (e: any) => {
        e.preventDefault();
        
        const prodsLista = this.productos.filtrados.value;
        // Busco el producto
        const prodSelect: any = prodsLista && prodsLista.length ? prodsLista[this.productoEnfocadoIndex] : null;
        // Lo selecciono
        prodSelect ? this.onSelectProducto(prodSelect) : null;
        // Reseteo el index
        this.productoEnfocadoIndex = -1;
        // Vacio filtrados y focus lote input
        this.productos.filtrados.next([]);
        document.getElementById('inputLoteNro') ? document.getElementById('inputLoteNro').focus() : null
        
    }

    /**
     * Evento change del input del proovedor
     */
    onChangeInputProd = (valor) => {

        this.isProdSelected = false;

        this.productos.filtrados.next(
            this.consultaPorProductoService.filtrarProductos(this.productos.todos, valor)
        );
        // Reseteo el indice
        this.productoEnfocadoIndex = -1;
    }

    onBlurInputProd = (evento) => {

        if (!evento.target.value || evento.target.value.toString().length <= 0) return;

        // Busco si existe
        const prodExist = this.productos.todos.find(
            p => p.codProducto.toString() === evento.target.value.toString()
        )
        
        

        document.getElementById("card_producto").style.display = "none";   
        // Si existe actualizo el existente
        if (prodExist && prodExist.idProductos) {
            this.onSelectProducto(prodExist);
            document.getElementById("card_producto").style.display = "";
        } else {
            this.filtros.codProducto = null;
            this.filtros.productoSelect = null;
            this.info.nombreProd = null;
            
        }
        // Vacio filtrados
        this.productos.filtrados.next([]);
        // Hago focus en input producto
        document.getElementById("card_producto").style.display = "none";
        document.getElementById('inputLoteNro') ? document.getElementById('inputLoteNro').focus() : null
        

    }

    onSelectProducto = (prod: Producto) => {
        this.filtros.codProducto = prod.codProducto.toString();
        this.filtros.productoSelect = prod;
        this.info.nombreProd = prod.descripcion;
        this.isProdSelected = true;
    }

    descargarReporte = () => {
      var fil = this.filtros;
     this.filtros.fechaDesde = "2022-01-01";

        this.consultaPorProductoService.descargarReporte(this.filtros).subscribe(resp => {
            if (resp && resp['_body']) {
                this.utilsService.downloadBlob(resp['_body'], this.info.nombreProd)
            }
        }) 

    }
}




