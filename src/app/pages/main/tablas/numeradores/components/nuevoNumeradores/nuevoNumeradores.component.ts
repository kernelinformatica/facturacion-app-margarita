import { Router } from '@angular/router';
import { UtilsService } from '../../../../../../services/utilsService';
import { RecursoService } from 'app/services/recursoService';
import { Component, Input, HostListener } from '@angular/core';

import { Numerador } from '../../../../../../models/numerador';
import { TipoComprobante } from '../../../../../../models/tipoComprobante';
import { Observable } from '../../../../../../../../node_modules/rxjs';
import { resourcesREST } from 'constantes/resoursesREST';

import { DateLikePicker } from 'app/models/dateLikePicker';
import { PtoVenta } from 'app/models/ptoVenta';
import { LetraCodigo } from 'app/models/letraCodigo';

@Component({
    selector: 'nuevo-numeradores',
    styleUrls: ['./nuevoNumeradores.scss'],
    templateUrl: './nuevoNumeradores.html',
})

export class NuevoNumeradores {
    recurso: Numerador = new Numerador();
    ptoVentas: Observable<PtoVenta[]>;
    letrasCodigos: Observable<LetraCodigo[]>;

    tipCustomPtoVenta = false;
    
    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private router: Router
    ) {
        this.ptoVentas = this.recursoService.getRecursoList(resourcesREST.ptoVenta)();
        this.letrasCodigos = this.recursoService.getRecursoList(resourcesREST.letraCodigo)();
    }

    ngOnInit() {
        this.recursoService.setEdicionFinalizada(false);
        this.recurso.electronico = false;
    }

    @HostListener('window:beforeunload')
    canDeactivate = () => 
        this.recursoService.checkIfEquals(this.recurso, new Numerador()) || 
        this.recursoService.getEdicionFinalizada();
    
    onClickElectronico() {
       
        if (this.recurso.electronico == null){
            this.recurso.electronico = false;
        }else{
            this.recurso.electronico = true;
        }
       
    }
    onClickCrear = async () => {
        try {

            const resp: any = await this.recursoService.setRecurso(this.recurso)();
    
            this.utilsService.showModal(
                resp.control.codigo
            )(
                resp.control.descripcion
            )(
                () => {
                    this.router.navigate(['/pages/tablas/numeradores']);
                    this.recursoService.setEdicionFinalizada(true);
                }
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);       
        }
    }

    onItemChangedFecha(e, keyFecha) {
        this.recurso[keyFecha] = new DateLikePicker(null, e)
    }

    customPtoVenta = false;
    /**
     * Altera entre select e input
     */
    onClickCustomPtoVenta = () => {
        this.customPtoVenta = !this.customPtoVenta;
        this.recurso.ptoVenta = new PtoVenta();
    }
}
