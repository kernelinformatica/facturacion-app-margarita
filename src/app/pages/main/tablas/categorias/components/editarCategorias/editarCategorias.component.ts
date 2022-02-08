import { Component, Input, HostListener } from '@angular/core';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router, ActivatedRoute } from '@angular/router';
import { RecursoService } from 'app/services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';

import { Categoria } from '../../../../../../models/categoria';
import { Observable } from '../../../../../../../../node_modules/rxjs';
import { SisCategoria } from 'app/models/sisCategoria';

@Component({
    selector: 'editar-categorias',
    styleUrls: ['./editarCategorias.scss'],
    templateUrl: './editarCategorias.html',
})
export class EditarCategorias {
    recurso: Categoria = new Categoria();
    recursoOriginal: Categoria = new Categoria();

    sisCategorias: Observable<SisCategoria[]>;

    constructor(
        public utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute,
        private recursoService: RecursoService
    ) {
        this.route.params.subscribe(params => 
            this.recursoService.getRecursoList(resourcesREST.categorias)()
                .map((recursoList: Categoria[]) =>
                    recursoList.find(recurso => recurso.idCategoria === parseInt(params.idCategoria))
                )
                .subscribe(recurso =>{
                    this.recurso = recurso;
                    this.recursoOriginal = Object.assign({}, recurso);
                })
        );

        this.sisCategorias = this.recursoService.getRecursoList(resourcesREST.sisCategoria)();
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
