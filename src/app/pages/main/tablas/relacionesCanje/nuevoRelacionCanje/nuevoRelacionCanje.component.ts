import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { resourcesREST } from 'constantes/resoursesREST';
import { RecursoService } from 'app/services/recursoService';
import { UtilsService } from 'app/services/utilsService';
import { RelacionCanje } from 'app/models/relacionCanje';
import { SisCanje } from 'app/models/sisCanje';

@Component({
    selector: 'nuevo-relacion-canje',
    styleUrls: ['./nuevoRelacionCanje.scss'],
    templateUrl: './nuevoRelacionCanje.html',
})

export class NuevoRelacionCanje {
    recurso: RelacionCanje = new RelacionCanje();

    sisCanjes: Observable<SisCanje[]>;

    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private router: Router
    ) {
        this.sisCanjes = this.recursoService.getRecursoList(resourcesREST.sisCanjes)();
    }

    ngOnInit() {
        this.recursoService.setEdicionFinalizada(false);
    }

    @HostListener('window:beforeunload')
    canDeactivate = () => 
        this.recursoService.checkIfEquals(this.recurso, new RelacionCanje()) || 
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
                    this.router.navigate(['/pages/tablas/relaciones-canje']);
                    this.recursoService.setEdicionFinalizada(true);
                }
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
        }
    }
}
