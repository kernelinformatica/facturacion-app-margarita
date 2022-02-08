import { Component, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { resourcesREST } from 'constantes/resoursesREST';
import { RelacionCanje } from 'app/models/relacionCanje';
import { RecursoService } from 'app/services/recursoService';
import { UtilsService } from 'app/services/utilsService';
import { SisCanje } from 'app/models/sisCanje';

@Component({
    selector: 'editar-relacion-canje',
    styleUrls: ['./editarRelacionCanje.scss'],
    templateUrl: './editarRelacionCanje.html',
})

export class EditarRelacionCanje {
    recurso: RelacionCanje = new RelacionCanje();
    recursoOriginal: RelacionCanje = new RelacionCanje();

    sisCanjes: Observable<SisCanje[]>;

    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.route.params.subscribe(params =>
            this.recursoService.getRecursoList(resourcesREST.relacionesCanje)()
                .map((recursoList: RelacionCanje[]) =>
                    recursoList.find(recurso => recurso.idRelacionSisCanje === parseInt(params.idRelacionSisCanje))
                )
                .subscribe(recurso =>{
                    this.recurso = recurso;
                    this.recursoOriginal = Object.assign({}, recurso);
                })
        );

        this.sisCanjes = this.recursoService.getRecursoList(resourcesREST.sisCanjes)();
    }

    ngOnInit() {
        this.recursoService.setEdicionFinalizada(false);
    }

    // Si NO finalizó la edición, y SI editó el recurso..
    @HostListener('window:beforeunload')
    canDeactivate = () => 
        this.recursoService.getEdicionFinalizada() ||
        this.recursoService.checkIfEquals(this.recurso, this.recursoOriginal);

    onClickEditar = async() => {
        try {
            const respuestaEdicion: any = await this.recursoService.editarRecurso(this.recurso)();

            this.utilsService.showModal(
                respuestaEdicion.control.codigo
            )(
                respuestaEdicion.control.descripcion
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
