import { Component, Input, HostListener } from '@angular/core';
import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormaPago } from '../../../../../../models/formaPago';
import { TipoFormaPago } from 'app/models/tipoFormaPago';
import { RecursoService } from '../../../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { ListaPrecio } from '../../../../../../models/listaPrecio';
import { ModeloCab } from '../../../../../../models/modeloCab';
import { ModeloDetalle } from '../../../../../../models/modeloDetalle';
import { PlanCuenta } from '../../../../../../models/planCuenta';
import { SisTipoModelo } from '../../../../../../models/sisTipoModelo';
import { SisModulo } from '../../../../../../models/sisModulo';
import { ModeloImputacion } from '../../modeloImputacion.component';
import { Libro } from 'app/models/libro';
import sisModulos from 'constantes/sisModulos';


@Component({
    selector: 'nuevo-modelo-imputacion',
    styleUrls: ['./nuevoModeloImputacion.scss'],
    templateUrl: './nuevoModeloImputacion.html',
})

export class NuevoModeloImputacion {
    recurso: ModeloCab = new ModeloCab();

    detalles: ModeloDetalle[] = [];

    detalleEnEdicion: ModeloDetalle = new ModeloDetalle();

    agregandoDetalle: boolean = false;
    editandoDetalle: boolean = false;

    addDetalleTitle = 'Agregar Detalle';

    // Desplegables
    signos = ['+', '-', '*', '/', '%'];
    debeHaber = ['S', 'R', '-'];
    contPlanCuentaList: Observable<PlanCuenta[]> = Observable.of([]);
    sisTipoModeloList: Observable<SisTipoModelo[]> = Observable.of([]);
    sisModulos: Observable<SisModulo[]> = Observable.of([]);
    libros: Observable<Libro[]> = Observable.of([]);

    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private router: Router
    ) {
        this.contPlanCuentaList = this.recursoService.getRecursoList(resourcesREST.contPlanCuenta)();
        this.sisTipoModeloList = this.recursoService.getRecursoList(resourcesREST.sisTipoModelo)();
        this.sisModulos = this.recursoService.getRecursoList(resourcesREST.sisModulos)()
            .map(
                sisModulos => sisModulos.filter(a => a.descripcion.toLowerCase() !== 'todos')
            )
    }

    ngOnInit() {
        this.recursoService.setEdicionFinalizada(false);
    }

    @HostListener('window:beforeunload')
    canDeactivate = () => 
        this.recursoService.checkIfEquals(this.recurso, new ModeloCab()) || 
        this.recursoService.getEdicionFinalizada();

    onClickCrear = async () => {
        try {
            // Agrego los detalles
            this.recurso.modeloDetalle = Object.assign([], this.detalles);
            const resp: any = await this.recursoService.setRecurso(this.recurso)();

            this.utilsService.showModal(
                resp.control.codigo
            )(
                resp.control.descripcion
            )(
                () => {
                    this.router.navigate(['/pages/tablas/modelo-imputacion']);
                    this.recursoService.setEdicionFinalizada(true);
                }
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
        }
    }

    onClickConfirmarDetalle = () => {
        
        if (this.editandoDetalle) {
            let copiaDetalles = Object.assign(
                [],
                this.detalles
            );

            // Remplazo el elemento editado
            copiaDetalles[
                copiaDetalles.findIndex(
                    det => det.idModeloDetalle === this.detalleEnEdicion.idModeloDetalle
                )
            ] = this.detalleEnEdicion;

            // Remplazo el array original
            this.detalles = Object.assign([], copiaDetalles);

        } else {
            // Le genero un id que uso acá en el FE nomas.
            this.detalleEnEdicion.idModeloDetalle = this.detalles.length + 1;
            // Lo agrego
            this.detalles.push(this.detalleEnEdicion);
        }

        // Limpio el detalle en edicion
        this.detalleEnEdicion = new ModeloDetalle();

        // Limpio los estados
        this.agregandoDetalle = false;
        this.editandoDetalle = false;
    }

    onRemoveDetalle = (det) => {
        this.detalles = this.detalles.filter(
            d => d.idModeloDetalle !== det.idModeloDetalle
        );

        // También borro el que esté actual si hay
        this.detalleEnEdicion = new ModeloDetalle();
        // Limpio los estados
        this.agregandoDetalle = false;
        this.editandoDetalle = false;
    }

    onEditDetalle = (det) => {
        this.addDetalleTitle = 'Editar Detalle';
        this.editandoDetalle = true;
        this.detalleEnEdicion = Object.assign({}, det);
    }

    onClickCancelarDetalle = () => {
        this.detalleEnEdicion = new ModeloDetalle();
        this.editandoDetalle = false;
        this.agregandoDetalle = false;
    }

    onClickAgregarDetalle = () => {
        
        this.addDetalleTitle = 'Agregar Detalle';
        this.editandoDetalle = false;
        this.agregandoDetalle = true;
        this.detalleEnEdicion = new ModeloDetalle();
    }

    // Detalles
    checkIfExisteDetallesCompra = () => 
        this.detalles.filter(
            det => 
                Number(det.idSisModulo) === 1 || 
                Number(det.idSisModulo) === 3
        ).length > 0;
    
    checkIfExisteDetallesVenta = () => 
        this.detalles.filter(
            det => 
                Number(det.idSisModulo) === 2 || 
                Number(det.idSisModulo) === 3
        ).length > 0;

    checkIfShowLiCompra = (liDet: ModeloDetalle) => {
        return Number(liDet.idSisModulo) === 2 ? 
            `detalle-li hiddenLi` : 'detalle-li'
    }
    checkIfShowLiVenta = (liDet: ModeloDetalle) => {
        return Number(liDet.idSisModulo) === 1 ? 
            `detalle-li hiddenLi` : 'detalle-li'
    }

    /**
     * Actualizo desplegable libros
     */
    onChangeSisModulo = (idSisModSelect: number) => {
        this.libros = this.recursoService.getRecursoList(resourcesREST.libros)({ idSisModulo: idSisModSelect });
    }
}
