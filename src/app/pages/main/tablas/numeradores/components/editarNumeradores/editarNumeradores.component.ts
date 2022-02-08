import { Component, Input, HostListener } from '@angular/core';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router, ActivatedRoute } from '@angular/router';
import { RecursoService } from 'app/services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';

import { Numerador } from '../../../../../../models/numerador';
import { Observable } from '../../../../../../../../node_modules/rxjs';
import { TipoComprobante } from 'app/models/tipoComprobante';
import { PtoVenta } from 'app/models/ptoVenta';
import { LetraCodigo } from 'app/models/letraCodigo';

@Component({
    selector: 'editar-numeradores',
    styleUrls: ['./editarNumeradores.scss'],
    templateUrl: './editarNumeradores.html',
})
export class EditarNumeradores {
    recurso: Numerador = new Numerador();
    recursoOriginal: Numerador = new Numerador();
    ptoVentas: Observable<PtoVenta[]>;

    letrasCodigos: Observable<LetraCodigo[]>;

    tipCustomPtoVenta = false;

    constructor(
        public utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute,
        private recursoService: RecursoService
    ) {
        this.route.params.subscribe(params => 
            this.recursoService.getRecursoList(resourcesREST.cteNumerador)()
                .map((recursoList: Numerador[]) =>
                    recursoList.find(recurso => recurso.idCteNumerador === parseInt(params.idCteNumerador))
                )
                .subscribe(recurso =>{
                    this.recurso = recurso;
                    this.recursoOriginal = Object.assign({}, recurso);
                })
        );

        this.ptoVentas = this.recursoService.getRecursoList(resourcesREST.ptoVenta)();
        this.letrasCodigos = this.recursoService.getRecursoList(resourcesREST.letraCodigo)();
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
                    this.router.navigate(['/pages/tablas/numeradores']);
                    this.recursoService.setEdicionFinalizada(true);
                }
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
            
        }
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
