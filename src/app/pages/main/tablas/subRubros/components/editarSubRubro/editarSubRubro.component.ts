import { Component, Input, HostListener } from '@angular/core';
import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router, ActivatedRoute } from '@angular/router';


import { SubRubro } from '../../../../../../models/subRubro';

import { Rubro } from 'app/models/rubro';
import { RecursoService } from '../../../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';

@Component({
    selector: 'editar-sub-rubro',
    styleUrls: ['./editarSubRubro.scss'],
    templateUrl: './editarSubRubro.html',
})
export class EditarSubRubro {
    recurso: SubRubro = new SubRubro();
    recursoOriginal: SubRubro = new SubRubro();

    constructor(
        public utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute,
        private recursoService: RecursoService
    ) {
        this.route.params.subscribe(params =>
            this.recursoService.getRecursoList(resourcesREST.subRubros)()
                .map((recursoList: SubRubro[]) =>
                    recursoList.find(recurso => recurso.idSubRubro === parseInt(params.idSubRubro))
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
            const respuestaEdicion: any = await this.recursoService.editarRecurso(this.recurso)();

            this.utilsService.showModal(
                respuestaEdicion.control.codigo
            )(
                respuestaEdicion.control.descripcion
            )(
                () => {
                    this.router.navigate(['/pages/tablas/sub-rubros']);
                    this.recursoService.setEdicionFinalizada(true);
                }
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);

        }
    }

}
