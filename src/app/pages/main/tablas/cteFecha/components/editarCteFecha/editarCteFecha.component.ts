import * as _ from 'lodash';
import { Component, Input, HostListener } from '@angular/core';
import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { RecursoService } from '../../../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { CteFechas } from '../../../../../../models/cteFechas';
import { TipoComprobante } from 'app/models/tipoComprobante';

@Component({
    selector: 'editar-cte-fecha',
    styleUrls: ['./editarCteFecha.scss'],
    templateUrl: './editarCteFecha.html',
})

export class EditarCteFecha {
    recurso: CteFechas = new CteFechas();
    recursoOriginal: CteFechas = new CteFechas();

    cteTipos: Observable<TipoComprobante[]>;

    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        // Busco el recurso por id
        this.route.params.subscribe(params => 
            this.recursoService.getRecursoList(resourcesREST.cteFecha)()
                .map(
                    (recursoList: CteFechas[]) => recursoList.find(recurso => recurso.idCteFechas === parseInt(params.idCteFechas))
                )
                .subscribe(recurso =>{
                    this.recurso = recurso;
                    this.recursoOriginal = Object.assign({}, recurso);
                    
                    
                })
        );

        this.cteTipos = this.recursoService.getRecursoList(resourcesREST.cteTipo)();

    }

    
    ngOnInit() {
        this.recursoService.setEdicionFinalizada(false);
    }

    // Si NO finalizó la edición, y SI editó el recurso..
    @HostListener('window:beforeunload')
    canDeactivate = () => 
        this.recursoService.getEdicionFinalizada() ||
        _.isEqual(
            _.omit(
                Object.assign({}, this.recurso),
                ['fechaApertura', 'fechaCierre']
            ),
            _.omit(
                Object.assign({}, this.recursoOriginal),
                ['fechaApertura', 'fechaCierre']
            )
        )


    onClickEditar = async () => {
        try {

            const resp: any = await this.recursoService.editarRecurso(
                this.recurso
            )();

            this.utilsService.showModal(
                resp.control.codigo
            )(
                resp.control.descripcion
            )(
                () => {
                    this.router.navigate(['/pages/tablas/cte-fecha']);
                    this.recursoService.setEdicionFinalizada(true);
                }
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
        }
    }

    /**
     * Setea la fecha de compra calculandola dado un string en formato 'ddmm', parseando a 'dd/mm/aaaa'
     */
    onCalculateFecha = (e) => (keyFecha) => (objetoContenedor) => {
        if (!this[objetoContenedor][keyFecha] || typeof this[objetoContenedor][keyFecha] !== 'string') return;
        
        this[objetoContenedor][keyFecha] = this.utilsService.stringToDateLikePicker(this[objetoContenedor][keyFecha]);

        // Hago focus en el prox input
        (keyFecha==='fechaApertura') ? document.getElementById(`fechaCierre`).focus() : null;
        (keyFecha==='fechaApertura') ? this.recurso.fechaCierre = null : null;
        (keyFecha==='fechaCierre') ? document.getElementById(`idTipoCompr`).focus() : null;
    }

}
