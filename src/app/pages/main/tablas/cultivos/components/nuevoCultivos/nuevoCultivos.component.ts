import { Router } from '@angular/router';
import { UtilsService } from '../../../../../../services/utilsService';
import { RecursoService } from 'app/services/recursoService';
import { Component, Input, HostListener } from '@angular/core';

import { Cultivo } from '../../../../../../models/cultivo';

@Component({
    selector: 'nuevo-cultivos',
    styleUrls: ['./nuevoCultivos.scss'],
    templateUrl: './nuevoCultivos.html',
})

export class NuevoCultivos {
    recurso: Cultivo = new Cultivo();

    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private router: Router
    ) { }

    ngOnInit() {
        this.recursoService.setEdicionFinalizada(false);
    }

    @HostListener('window:beforeunload')
    canDeactivate = () => 
        this.recursoService.checkIfEquals(this.recurso, new Cultivo()) || 
        this.recursoService.getEdicionFinalizada();

    onClickCrear = async () => {
        try {
            const resp: any = await this.recursoService.setRecurso(this.recurso)();
    
            this.utilsService.showModal(
                resp.control.codigo
            )(
                resp.control.descripcion
            )(
                () => {
                    this.router.navigate(['/pages/tablas/cultivos']);
                    this.recursoService.setEdicionFinalizada(true);
                }
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);       
        }
    }

}
