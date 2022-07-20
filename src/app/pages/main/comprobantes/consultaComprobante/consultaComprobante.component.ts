import { saveAs } from 'file-saver';
import { FilesService } from 'app/services/filesService';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { RecursoService } from '../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { SisModulo } from '../../../../models/sisModulo';
import { UtilsService } from '../../../../services/utilsService';
import { ComprobanteService } from '../../../../services/comprobanteService';
import { Producto } from '../../../../models/producto';
import { SisEstado } from 'app/models/sisEstado';
import { Padron } from 'app/models/padron';
import { Deposito } from '../../../../models/deposito';
import { TipoComprobante } from '../../../../models/tipoComprobante';
import { Comprobante } from '../../../../models/comprobante';
import { DateLikePicker } from '../../../../models/dateLikePicker';
import { ComprobanteEncabezado } from '../../../../models/comprobanteEncabezado';
import { ComprobanteDetalle } from '../../../../models/comprobanteDetalle';

import { Observable, BehaviorSubject } from 'rxjs';
import gruposParametros from 'constantes/gruposParametros';
import { PopupListaService } from 'app/pages/reusable/otros/popup-lista/popup-lista-service';
import { Vendedor } from 'app/models/vendedor';
import { PtoVenta } from 'app/models/ptoVenta';
import { SisTipoOperacion } from 'app/models/sisTipoOperacion';
import { Numerador } from 'app/models/numerador';
import _ = require('lodash');
@Component({
    selector: 'consulta-comprobante',
    styleUrls: ['./consultaComprobante.scss'],
    templateUrl: './consultaComprobante.html'
})
export class ConsultaComprobante {
    resourcesREST = resourcesREST;
    sisModulos: Observable<SisModulo[]>;
    tipoComprobantes: Observable<TipoComprobante[]>;
    sisEstados: Observable<SisEstado[]>;
    depositos: Observable<Deposito[]>;
    vendedores: Observable<Vendedor[]>;
    sisTipoOperaciones: Observable<SisTipoOperacion[]>;
    productos: { todos: Producto[]; filtrados: BehaviorSubject<Producto[]> } = { todos: [], filtrados: new BehaviorSubject([]) }
    padrones: { todos: Padron[]; filtrados: BehaviorSubject<Padron[]> } = { todos: [], filtrados: new BehaviorSubject([]) }
    validatingForm: FormGroup;
    padronEnfocadoIndex: number = -1;
    productoEnfocadoIndex: number = -1;
    EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    EXCEL_EXTENSION = '.xlsx';
    // Lo uso cuando busca específicamente por nro y pto venta
    comprobante: Comprobante = new Comprobante();
    
    fechasFiltro: {
        desde: DateLikePicker,
        hasta: DateLikePicker
    } = {
        desde: new DateLikePicker(),
        hasta: new DateLikePicker()
    }

    sisModuloSelec: SisModulo = new SisModulo();
    tipoComprobanteSelec: TipoComprobante = new TipoComprobante();
    productoSelec: Producto = new Producto();
    productoDesde: Producto = new Producto();
    productoHasta: Producto = new Producto();
    focusProductoHasta = false;
    focusProductoDesde = false;
    focusProductoSelec = false;
    sisEstadoSelec: SisEstado = new SisEstado();
    padronSelec: Padron = new Padron();
    depositoSelec: Deposito = new Deposito();
    vendedorSelec: Vendedor = new Vendedor();
    sisTipoOpSelect: SisTipoOperacion = new SisTipoOperacion();
    totalNetoComp: number = 0;
    totalComp: number = 0;
    idTipoFechaSeleccionada: number = 0;
    compEncabezados: BehaviorSubject<ComprobanteEncabezado[]> = new BehaviorSubject([]);
    compDetalles: BehaviorSubject<ComprobanteDetalle[]> = new BehaviorSubject([]);

    
    estadoAfip: string = 'Todas'; 

    isLoading = false;
    datePipe: any;

    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private comprobanteService: ComprobanteService,
        private popupListaService: PopupListaService,
        
    ) {
        this.validatingForm = new FormGroup({
            modalFormAvatarPassword: new FormControl('', Validators.required)
        });
           
        // Es necesario
        this.comprobante.numerador = new Numerador();
        this.comprobante.numerador.ptoVenta = new PtoVenta();

        this.sisModulos = this.recursoService.getRecursoList(resourcesREST.sisModulos)();
        this.sisEstados = this.recursoService.getRecursoList(resourcesREST.sisEstados)();
        this.recursoService.getRecursoList(resourcesREST.productos)()
            .subscribe(productos => {
                this.productos.todos = productos;
                this.productos.filtrados.next([]);
            })

        this.recursoService.getRecursoList(resourcesREST.padron)({ grupo: gruposParametros.cliente })
            .subscribe(padrones => {
                this.padrones.todos = padrones;
                this.padrones.filtrados.next([]);
            })
        
        this.depositos = this.recursoService.getRecursoList(resourcesREST.depositos)();
        this.vendedores = this.recursoService.getRecursoList(resourcesREST.vendedor)();
        this.sisTipoOperaciones = this.recursoService.getRecursoList(resourcesREST.sisTipoOperacion)();
    }
    get modalFormAvatarPassword() {
        return this.validatingForm.get('modalFormAvatarPassword');
    } 

    /**
     * Cuando se cambia un módulo se actualiza la lista de tiposComprobantes
     */
    onChangeSisModulo = (moduloSelec: SisModulo) => {

        this.tipoComprobantes = this.recursoService.getRecursoList(resourcesREST.cteTipo)({
            'sisModulo': moduloSelec.idSisModulos
        });

        // this.sisTipoOperaciones
    }
    onChangeFiltroFechas = () => {
    /*Al seleccionar el combo de tipo de fecha para el filtro*/ 
    }
    
   
    onClickBuscar = () => {
        this.isLoading = true;

        // Busco los encabezados
        // Me suscribo a los cambios de los encabezados y en cada actualizacion de estos, actualizo también todos los detalles
        // Aprovecho a fijarme si la cantidad es 0. En ese caso, muestro mensaje
        this.comprobanteService.buscarComprobantes(this.comprobante)
        (this.fechasFiltro)
        (this.idTipoFechaSeleccionada)
        (this.sisModuloSelec)
        (this.tipoComprobanteSelec)
        (this.productoSelec)
        (this.sisEstadoSelec)
        (this.padronSelec)
        (this.depositoSelec)
        (this.vendedorSelec)
        (this.sisTipoOpSelect)
        (this.estadoAfip)
        (this.productoDesde.codProducto)
        (this.productoHasta.codProducto).subscribe(encabezados => {
       
                // Actualizo encabezados
                this.compEncabezados.next(encabezados);
                encabezados && encabezados.length === 0 ?
                    this.utilsService.showModal('Aviso')('No se encontraron comprobantes con esas condiciones')()() : null;
                    this.isLoading = false;
                // Actualizo detalles
                this.compDetalles.next(
                    this.utilsService.flatMap(
                        (encabezado: ComprobanteEncabezado) => encabezado.detalle,
                        encabezados
                    )
                );
                this.totalComp = 0;
                this.totalNetoComp = 0;
              
                for(let i = 0; i < this.compEncabezados.value.length; i++) {
                    this.totalComp = this.totalComp + this.compEncabezados.value[i].importeTotal;
                    this.totalNetoComp = this.totalNetoComp + this.compEncabezados.value[i].importeNeto;
                }
                this.isLoading = false;
            })
            

    }


    /**
     * Formatea el numero pto-venta 4 caracteres y numero 8 caracteres
     */
    formatNumero = (numero) => 
        numero && numero.toString() && 
        numero.toString().substring(0, numero.toString().length - 8) ?
            `${numero.toString().substring(0, numero.toString().length - 8).padStart(4,0)} - ${numero.toString().substring(numero.toString().length - 8)}` :
            ''
    

    /**
     * Setea la fecha de compra calculandola dado un string en formato 'ddmm', parseando a 'dd/mm/aaaa'
     */
    onCalculateFecha = (e) => (keyFecha) => {
        if (!this.fechasFiltro[keyFecha] || typeof this.fechasFiltro[keyFecha] !== 'string') return;
        
        this.fechasFiltro[keyFecha] = this.utilsService.stringToDateLikePicker(this.fechasFiltro[keyFecha]);

        // Hago focus en el prox input y luego al boton buscar
        (keyFecha==='desde') ? document.getElementById("fechaHasta").focus() : 
            (keyFecha==='hasta') ? document.getElementById("btnBuscar").focus() : null;
        

    }

    onBlurPtoVenta = (e) => this.comprobante && this.comprobante.numerador && this.comprobante.numerador.ptoVenta ?
        this.comprobante.numerador.ptoVenta.ptoVenta = this.comprobante.numerador.ptoVenta.ptoVenta.padStart(4, '0') : null

    onBlurNumerador = (e) => this.comprobante && this.comprobante.numerador ?
        this.comprobante.numerador.numerador = this.comprobante.numerador.numerador.padStart(8, '0') : null

    /**
     * On click buscar
     */
    onClickReporte = (tipo) => {
     
        this.comprobanteService.generarReportes(tipo)(this.comprobante)(this.fechasFiltro)(this.sisModuloSelec)(this.tipoComprobanteSelec)(this.productoSelec)(this.sisEstadoSelec)(this.padronSelec)(this.depositoSelec)(this.vendedorSelec)(this.sisTipoOpSelect)(this.estadoAfip)(this.productoDesde.codProducto)(this.productoHasta.codProducto)(this.idTipoFechaSeleccionada)
            .subscribe(resp => {
                if (resp) {

                    this.utilsService.downloadBlob(resp['_body'], tipo);
                }
            })

    }
    onClickReporteExcel = (tipo) => {
        debugger
        this.comprobanteService.generarReportesExcel(tipo)(this.comprobante)(this.fechasFiltro)(this.sisModuloSelec)(this.tipoComprobanteSelec)(this.productoSelec)(this.sisEstadoSelec)(this.padronSelec)(this.depositoSelec)(this.vendedorSelec)(this.sisTipoOpSelect)(this.estadoAfip)(this.productoDesde.codProducto)(this.productoHasta.codProducto)(this.idTipoFechaSeleccionada)
            .subscribe(resp => {
                if (resp) {

                    this.utilsService.downloadBlob(resp['_body'], tipo);
                }
            })

    }

    keyPressInputTexto = (e: any) => (upOrDown) => {
        e.preventDefault();
        // Hace todo el laburo de la lista popup y retorna el nuevo indice seleccionado
        this.padronEnfocadoIndex =
            this.popupListaService.keyPressInputForPopup(upOrDown)(
                this.padrones.filtrados.value
            )(this.padronEnfocadoIndex);
    };



    public exportarAExcel(json: any[], excelFileName: string): void {
       /* const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        this.grabarArchivoExcel(excelBuffer, excelFileName);*/ 
      }
         private grabarArchivoExcel(buffer: any, fileName: string): void {
        /*const data: Blob = new Blob([buffer], {
          type: this.EXCEL_TYPE
        });
        const today = new Date();
        const date = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate() + '_';
        const time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
        const name = fileName + date + time;*/ 
        
       // FileSaver.saveAs(data, name + this.EXCEL_EXTENSION);
      }
 

    onEnterInputProv = (e: any) => {
        e.preventDefault();
        this.padrones.filtrados.subscribe((provsLista) => {
            // Busco el producto
            const provSelect =
                provsLista && provsLista.length
                    ? provsLista[this.padronEnfocadoIndex]
                    : null;
                // Lo selecciono
             provSelect ? this.popupLista.onClickListProv(provSelect) : null;
            // Reseteo el index
             this.padronEnfocadoIndex = -1;
        });
    };
    popupLista: any = {
        
        onClickListProv: (prove: Padron) => {
            this.padronSelec = new Padron({ ...prove });

        },
        getOffsetOfInputProveedor: () =>
            this.utilsService.getOffset( document.getElementById("padronSelec")
            ),
    };
    // Buscador cli/prov
    onChangeCliProv = (busqueda) => {
        this.padronSelec = new Padron();
        if (busqueda && busqueda.length >= 2) {
            this.findPadrones(busqueda);
        }
        // Reseteo el indice
        this.padronEnfocadoIndex = -1;
        
    }


    buscandoPadron = false;
    findPadrones = _.throttle((busqueda) => {
        debugger
        this.buscandoPadron = true;
        this.padrones.filtrados.next([]);

        this.recursoService
            .getRecursoList(resourcesREST.padron)({
                grupo: gruposParametros.proveedor,
                elementos: busqueda,
            })
            .subscribe((proveedores) => {
                this.padrones.filtrados.next(proveedores);
                this.buscandoPadron = false;
            });
    }, 400);






    onClickPopupPadron = (prove: Padron) => this.padronSelec = new Padron({...prove})







    // Buscador producto
    onChangeProducto = (busqueda) => {
        if (busqueda && busqueda.length === 0) {
            this.productos.filtrados.next([]);    
        } else {
            this.productos.filtrados.next(
                this.comprobanteService.filtrarProductos(this.productos.todos, busqueda)
            );
        }

        this.productoEnfocadoIndex = -1;
    }

    onClickPopupProducto = (prod: Producto) => 
        this.productoSelec = new Producto({...prod})

    onClickPopupProductoDesde = (prod: Producto) => 
        this.productoDesde = new Producto({...prod})

    onClickPopupProductoHasta = (prod: Producto) => 
        this.productoHasta = new Producto({...prod})

    onFocusHasta() {
        this.focusProductoHasta = true;
    }

    onBlurHasta() {
        this.focusProductoHasta = false;
    }

    onFocusDesde() {
        this.focusProductoDesde = true;
    }

    onBlurDesde() {
        this.focusProductoDesde = false;
    }

    onFocusSelec() {
        this.focusProductoSelec = true;
    }

    onBlurSelec() {
        this.focusProductoSelec = false;
    }

    autorizarComprobante = (compBusc: ComprobanteEncabezado) => {
        // Activo spinner
        compBusc.isBeingAuthorized = true;

        this.comprobanteService.autorizarAfip(compBusc.idFactCab)
            .subscribe(respAfip => {
                compBusc.isBeingAuthorized = false;

                this.utilsService.showImprimirModal(
                    'OK'
                )(
                    `${respAfip.control.descripcion}. 
                    CAI: ${respAfip.datos.cai}`
                )(
                    () => this.recursoService.downloadComp(compBusc)
                )(
                    compBusc
                );

                this.onClickBuscar();

            })
    }


    /**
     * Onclick borrar comprobante
     */
    pideClaveAntesdeBorrarComprobante = (comp: ComprobanteEncabezado)=> {
       /*
        this.utilsService.showModal(
            'Seguridad'
        )(
            'Esta operación require autorización'
        )(
            () => {
                this.comprobanteService.borrarComprobante(comp).subscribe((resp: any) => {
                    const theBody = this.utilsService.parseBody(resp);
                    this.utilsService.showModal(
                        theBody.control.codigo
                    )(
                        theBody.control.descripcion
                    )(
                        () => {
                            // Actualizo grilla
                            this.onClickBuscar();
                        }
                    )();
                }) 
            } 
        )({
            tipoModal: 'verificaClave'
        });
        */
       this.borrarComprobante(comp);
    }
   
   
    borrarComprobante = (comp: ComprobanteEncabezado) => {

        this.utilsService.showModal(
            'Borrar comprobante'
        )(
            '¿Estás seguro de borrarlo?'
        )(
            () => {
              
                this.comprobanteService.borrarComprobante(comp).subscribe((resp: any) => {
                    const theBody = this.utilsService.parseBody(resp);
                    this.utilsService.showModal(
                        theBody.control.codigo
                    )(
                        theBody.control.descripcion
                    )(
                        () => {
                            // Actualizo grilla
                            this.onClickBuscar();
                        }
                    )();
                })
            }
        )({
            tipoModal: 'confirmation'
        });
    }

}
