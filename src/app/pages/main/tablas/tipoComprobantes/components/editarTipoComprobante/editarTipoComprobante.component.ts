import { Component, Input, HostListener } from '@angular/core';
import { LocalStorageService } from '../../../../../../services/localStorageService';
import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TipoComprobante } from '../../../../../../models/tipoComprobante';

import { RecursoService } from '../../../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { SisComprobante } from 'app/models/sisComprobante';
import { CteFechas } from 'app/models/cteFechas';
import { CodigoAfip } from 'app/models/codigoAfip';
import { SisLetra } from 'app/models/sisLetra';

@Component({
    selector: 'editar-tipo-comprobante',
    styleUrls: ['./editarTipoComprobante.scss'],
    templateUrl: './editarTipoComprobante.html',
})
export class EditarTipoComprobante {

    // Usuario que se va a editar
    recurso: TipoComprobante = new TipoComprobante();
    recursoOriginal: TipoComprobante = new TipoComprobante();
    sisComprobantes: Observable<SisComprobante[]>;
    codigosAfip: Observable<CodigoAfip[]>;
    sisLetras: Observable<SisLetra[]>;

    constructor(
        public utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute,
        private recursoService: RecursoService
    ) {
        this.route.params.subscribe(params =>
            this.recursoService.getRecursoList(resourcesREST.cteTipo)()
                .map((recursoList: TipoComprobante[]) =>
                    recursoList.find(recurso => recurso.idCteTipo === parseInt(params.idTipoComprobante))
                )
                .subscribe(recurso =>{
                    this.recurso = recurso;
                    this.recursoOriginal = Object.assign({}, recurso);
                })
        );
        this.sisComprobantes = this.recursoService.getRecursoList(resourcesREST.sisComprobantes)();
        this.codigosAfip = this.recursoService.getRecursoList(resourcesREST.sisCodigoAfip)();
        this.sisLetras = this.recursoService.getRecursoList(resourcesREST.sisLetra)();

    }

    
    ngOnInit() {
        this.recursoService.setEdicionFinalizada(false);
    }

    // Si NO finalizó la edición, y SI editó el recurso..
    @HostListener('window:beforeunload')
    canDeactivate = () => 
        this.recursoService.getEdicionFinalizada() ||
        this.recursoService.checkIfEquals(this.recurso, this.recursoOriginal);

    /**
     * Editar
     */
    onClickEditarTipoComprobante = async() => {
        try {
            // Edito el usuario seleccionado
            const resp = await this.recursoService.editarRecurso(this.recurso)();

            // Muestro mensaje de okey y redirecciono a la lista de tipos de comprobantes
            this.utilsService.showModal(
                resp.control.codigo
            )(
                resp.control.descripcion
            )(
                () => {
                    this.router.navigate(['/pages/tablas/tipos-comprobantes']);
                    this.recursoService.setEdicionFinalizada(true);
                }
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);

        }
    }
    
    

}
