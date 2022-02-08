import { Component } from '@angular/core';
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

@Component({
    selector: 'pesificacion',
    styleUrls: ['./pesificacion.scss'],
    templateUrl: './pesificacion.html'
})
export class Pesificacion {
    resourcesREST = resourcesREST;
    
    padrones: { todos: Padron[]; filtrados: BehaviorSubject<Padron[]> } = { todos: [], filtrados: new BehaviorSubject([]) }
    
    padronEnfocadoIndex: number = -1;
    productoEnfocadoIndex: number = -1;

    fechasFiltro: {
        emisionDesde: DateLikePicker,
        emisionHasta: DateLikePicker,
        vencimientoDesde: DateLikePicker,
        vencimientoHasta: DateLikePicker
    } = {
        emisionDesde: new DateLikePicker(),
        emisionHasta: new DateLikePicker(),
        vencimientoDesde: new DateLikePicker(),
        vencimientoHasta: new DateLikePicker()
    }

    padronSelec: Padron = new Padron();

    cotizacionActual;

    isLoading = false;

    compEncabezados: BehaviorSubject<ComprobanteEncabezado[]> = new BehaviorSubject([]);
    compDetalles: BehaviorSubject<ComprobanteDetalle[]> = new BehaviorSubject([]);

    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private comprobanteService: ComprobanteService,
        private popupListaService: PopupListaService
    ) {

        this.recursoService.getRecursoList(resourcesREST.padron)({ grupo: gruposParametros.cliente })
            .subscribe(padrones => {
                this.padrones.todos = padrones;
                // this.padrones.filtrados.next(padrones);
                this.padrones.filtrados.next([]);
            })

        this.recursoService.getCotizacionDatos().subscribe(cotizDatos => {
            this.cotizacionActual = cotizDatos.cotizacion;
        });
     }

    
    /**
     * On click buscar
     */
    onClickBuscar = () => {
        this.isLoading = true;

        // Busco los encabezados
        // Me suscribo a los cambios de los encabezados y en cada actualizacion de estos, actualizo también todos los detalles
        // Aprovecho a fijarme si la cantidad es 0. En ese caso, muestro mensaje
        this.comprobanteService.buscarComprobantesPesificacion(this.fechasFiltro)(this.padronSelec)
            
            .subscribe(encabezados => {

                // Actualizo encabezados
                this.compEncabezados.next(encabezados);
                encabezados && encabezados.length === 0 ?
                    this.utilsService.showModal('Aviso')('No se encontraron comprobantes con esas condiciones')()() : null;

                // Actualizo detalles
                this.compDetalles.next(
                    this.utilsService.flatMap(
                        (encabezado: ComprobanteEncabezado) => encabezado.detalle,
                        encabezados
                    )
                );
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
    }

    // Buscador cli/prov
    onChangeCliProv = (busqueda) => {
        if (busqueda && busqueda.length === 0) {
            this.padrones.filtrados.next([]);    
        } else {
            this.padrones.filtrados.next(
                this.comprobanteService.filtrarPadrones(this.padrones.todos, busqueda)
            );
        }

        this.padronEnfocadoIndex = -1;
    }

    onClickPopupPadron = (prove: Padron) => this.padronSelec = new Padron({...prove})

    
}