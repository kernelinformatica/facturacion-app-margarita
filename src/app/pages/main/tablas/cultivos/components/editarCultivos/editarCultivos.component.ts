import { Component, Input, HostListener } from '@angular/core';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router, ActivatedRoute } from '@angular/router';
import { RecursoService } from 'app/services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';

import { Cultivo } from '../../../../../../models/cultivo';

@Component({
    selector: 'editar-cultivos',
    styleUrls: ['./editarCultivos.scss'],
    templateUrl: './editarCultivos.html',
})
export class EditarCultivos {
    recurso: Cultivo = new Cultivo();
    recursoOriginal: Cultivo = new Cultivo();

    constructor(
        public utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute,
        private recursoService: RecursoService
    ) {
        this.route.params.subscribe(params => 
            this.recursoService.getRecursoList(resourcesREST.cultivo)()
                .map((recursoList: Cultivo[]) =>
                    recursoList.find(recurso => recurso.idCultivo === parseInt(params.idCultivo))
                )
                .subscribe(recurso =>{
                    this.recurso = recurso;
                    this.recursoOriginal = Object.assign({}, recurso);
                })
        );
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
            const respuestaEdicion: any = await this.recursoService.editarRecurso(
                this.recurso
            )();
    
            this.utilsService.showModal(
                respuestaEdicion.control.codigo
            )(
                respuestaEdicion.control.descripcion
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
