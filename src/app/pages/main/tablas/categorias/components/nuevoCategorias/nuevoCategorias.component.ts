import { Router } from '@angular/router';
import { UtilsService } from '../../../../../../services/utilsService';
import { RecursoService } from 'app/services/recursoService';
import { Component, Input, HostListener } from '@angular/core';

import { Categoria } from '../../../../../../models/categoria';
import { SisCategoria } from '../../../../../../models/sisCategoria';
import { Observable } from '../../../../../../../../node_modules/rxjs';
import { resourcesREST } from 'constantes/resoursesREST';

@Component({
    selector: 'nuevo-categorias',
    styleUrls: ['./nuevoCategorias.scss'],
    templateUrl: './nuevoCategorias.html',
})

export class NuevoCategorias {
    recurso: Categoria = new Categoria();

    sisCategorias: Observable<SisCategoria[]>;

    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private router: Router
    ) {
        this.sisCategorias = this.recursoService.getRecursoList(resourcesREST.sisCategoria)();
    }

    ngOnInit() {
        this.recursoService.setEdicionFinalizada(false);
    }

    @HostListener('window:beforeunload')
    canDeactivate = () => 
        this.recursoService.checkIfEquals(this.recurso, new Categoria()) || 
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
                    this.router.navigate(['/pages/tablas/categorias']);
                    this.recursoService.setEdicionFinalizada(true);
                }
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);       
        }
    }

}
