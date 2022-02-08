
import { Component, Input, HostListener, OnChanges, DoCheck } from '@angular/core';
import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormaPago } from '../../../../../../models/formaPago';
import { TipoFormaPago } from 'app/models/tipoFormaPago';
import { RecursoService } from '../../../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { ListaPrecio } from '../../../../../../models/listaPrecio';
import { PlanCuenta } from 'app/models/planCuenta';
import { DetalleFormaPago } from '../../../../../../models/detalleFormaPago';
import { THIS_EXPR } from '../../../../../../../../node_modules/@angular/compiler/src/output/output_ast';


@Component({
    selector: 'editar-forma-pago',
    styleUrls: ['./editarFormaPago.scss'],
    templateUrl: './editarFormaPago.html',
})

export class EditarFormaPago {
    recursoEditado: boolean = false;

    recurso: FormaPago = new FormaPago();
    recursoOriginal: FormaPago = new FormaPago();

    tiposFormaPago: Observable<TipoFormaPago[]>;
    listasPrecios: Observable<ListaPrecio[]>;

    contPlanCuentaList: Observable<PlanCuenta[]> = Observable.of([]);
    detalleEnEdicion: DetalleFormaPago = new DetalleFormaPago();

    // Estado del formulario para crear/editar detalles
    estadosFormDet = { hidden: 0, nuevo: 1, edicion: 2 };
    estadoActualFormDet = this.estadosFormDet.hidden;

    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.route.params.subscribe(params => 
            this.recursoService.getRecursoList(resourcesREST.formaPago)()
                .map((recursoList: FormaPago[]) =>
                    recursoList.find(recurso => recurso.idFormaPago === parseInt(params.idFormaPago))
                )
                .subscribe(recurso => {
                    this.recurso = recurso;
                    this.recursoOriginal = Object.assign({}, recurso);
                })
        );

        this.tiposFormaPago = this.recursoService.getRecursoList(resourcesREST.sisFormaPago)();
        this.listasPrecios = this.recursoService.getRecursoList(resourcesREST.listaPrecios)();
        this.contPlanCuentaList = this.recursoService.getRecursoList(resourcesREST.contPlanCuenta)();
    }

    
    ngOnInit() {
        this.recursoService.setEdicionFinalizada(false);
    }

    // Si NO finalizó la edición, y SI editó el recurso..
    @HostListener('window:beforeunload')
    canDeactivate = () => 
        this.recursoService.getEdicionFinalizada() ||
        this.recursoService.checkIfEquals(this.recurso, this.recursoOriginal);
    
    onClickCrear = async () => {
        try {
            const resp: any = await this.recursoService.editarRecurso(this.recurso)();

            this.utilsService.showModal(
                resp.control.codigo
            )(
                resp.control.descripcion
            )(
                () => {
                    this.router.navigate(['/pages/tablas/formas-pago']);
                    this.recursoService.setEdicionFinalizada(true);
                }
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
        }
    }

    /**
     * Agrego el detalle y después lo limpio
     */
    onClickConfirmarDetalle = () => {
        // this.recurso.detalles.push(this.detalleEnEdicion);
        // this.detalleEnEdicion = new DetalleFormaPago();
        // this.estadoActualFormDet = this.estadosFormDet.hidden;

        if (this.estadoActualFormDet === this.estadosFormDet.edicion) {
            let copiaDetalles = Object.assign(
                [],
                this.recurso.detalles
            );

            // Remplazo el elemento editado
            copiaDetalles[
                copiaDetalles.findIndex(
                    (det: DetalleFormaPago) => det.idFormaPagoDet === this.detalleEnEdicion.idFormaPagoDet
                )
            ] = this.detalleEnEdicion;

            // Remplazo el array original
            this.recurso.detalles = Object.assign([], copiaDetalles);

        } else {
            // Le genero un id que uso acá en el FE nomas.
            this.detalleEnEdicion.idFormaPagoDet = this.recurso.detalles.length + 1;

            // Lo agrego
            this.recurso.detalles.push(this.detalleEnEdicion);
        }

        // Limpio el detalle en edicion
        this.detalleEnEdicion = new DetalleFormaPago();

        // Oculto pantallita
        this.estadoActualFormDet = this.estadosFormDet.hidden;
    }

    /**
     * Limpia y oculta
     */
    onClickCancelarDetalle = () => {
        this.detalleEnEdicion = new DetalleFormaPago();
        this.estadoActualFormDet = this.estadosFormDet.hidden;
    }

    /**
     * Editar un detalle
     */
    onEditDetalle = (detalle: DetalleFormaPago) => {
        this.detalleEnEdicion = Object.assign({}, detalle);
        this.estadoActualFormDet = this.estadosFormDet.edicion;
    }
    /**
     * Eliminar un detalle
     */
    onRemoveDetalle = (det: DetalleFormaPago) => {
        // Lo saco de los detalles de la forma de pago
        this.recurso.detalles = this.recurso.detalles.filter(
            d => d.idFormaPagoDet !== det.idFormaPagoDet
        );

        // También borro el que esté actual si hay
        this.detalleEnEdicion = new DetalleFormaPago();

        // Oculto pantalla de edicion detalle
        this.estadoActualFormDet = this.estadosFormDet.hidden;
    }

    onClickAgregarDetalle = () => {
        this.detalleEnEdicion = new DetalleFormaPago();
        this.estadoActualFormDet = this.estadosFormDet.nuevo
    }

    compareWithTipoFormaPago = (tfp1: TipoFormaPago, tfp2: TipoFormaPago) => 
        tfp1 && tfp2 && tfp1.idSisFormaPago === tfp2.idSisFormaPago
    

}
