import { Component, HostListener } from '@angular/core';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router, ActivatedRoute } from '@angular/router';
import { RecursoService } from '../../../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { SisCotDolar } from 'app/models/sisCotDolar';

@Component({
    selector: 'editar-cot-dolar',
    styleUrls: ['./editarSisCotDolar.scss'],
    templateUrl: './editarSisCotDolar.html',
})
export class EditarSisCotDolar {
    recurso: SisCotDolar = new SisCotDolar();
    recursoOriginal: SisCotDolar = new SisCotDolar();

    constructor(
        public utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute,
        private recursoService: RecursoService
    ) {
        this.route.params.subscribe(params =>
            this.recursoService.getRecursoList(resourcesREST.sisCotDolar)()
                .map((recursoList: SisCotDolar[]) =>
                    recursoList.find(recurso => recurso.idSisCotDolar === parseInt(params.idSisCotDolar))
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
                    this.router.navigate(['/pages/tablas/cot-dolar']);
                    this.recursoService.setEdicionFinalizada(true);
                }
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);

        }
    }

}
