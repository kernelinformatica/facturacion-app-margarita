import * as _ from 'lodash';
import { Component, HostListener } from '@angular/core';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';
import { RecursoService } from '../../../../../../services/recursoService';
import { CteFechas } from '../../../../../../models/cteFechas';
import { TipoComprobante } from '../../../../../../models/tipoComprobante';
import { Observable } from '../../../../../../../../node_modules/rxjs';
import { resourcesREST } from 'constantes/resoursesREST';

@Component({
    selector: 'nuevo-cte-fecha',
    styleUrls: ['./nuevoCteFecha.scss'],
    templateUrl: './nuevoCteFecha.html',
})

export class NuevoCteFecha {
    recurso: CteFechas = new CteFechas();

    cteTipos: Observable<TipoComprobante[]>;

    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private router: Router
    ) {
        this.cteTipos = this.recursoService.getRecursoList(resourcesREST.cteTipo)();
    }

    ngOnInit() {
        this.recursoService.setEdicionFinalizada(false);
    }

    @HostListener('window:beforeunload')
    canDeactivate = () => {
        return _.isEqual(
            _.omit(
                Object.assign({}, this.recurso),
                ['fechaApertura', 'fechaCierre']
            ),
            _.omit(
                Object.assign({}, new CteFechas()),
                ['fechaApertura', 'fechaCierre']
            )
        ) || 
        this.recursoService.getEdicionFinalizada();
    }

    onClickCrear = async (e) => {
        try {

            const resp: any = await this.recursoService.setRecurso(
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
