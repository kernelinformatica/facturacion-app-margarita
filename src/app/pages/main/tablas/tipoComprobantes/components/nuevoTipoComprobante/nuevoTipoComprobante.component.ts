import { Component, Input, HostListener } from '@angular/core';

import { LocalStorageService } from '../../../../../../services/localStorageService';
import { Usuario } from '../../../../../../models/usuario';
import { Sucursal } from 'app/models/sucursal';
import { Perfil } from '../../../../../../models/perfil';
import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';
import { TipoComprobante } from '../../../../../../models/tipoComprobante';
import { RecursoService } from '../../../../../../services/recursoService';
import { Observable } from 'rxjs/Observable';
import { SisComprobante } from '../../../../../../models/sisComprobante';
import { resourcesREST } from 'constantes/resoursesREST';
import { CodigoAfip } from 'app/models/codigoAfip';
import { SisLetra } from 'app/models/sisLetra';


@Component({
    selector: 'nuevo-tipo-comprobante',
    styleUrls: ['./nuevoTipoComprobante.scss'],
    templateUrl: './nuevoTipoComprobante.html',
})
export class NuevoTipoComprobante {
    recurso: TipoComprobante = new TipoComprobante();
    sisComprobantes: Observable<SisComprobante[]>;

    codigosAfip: Observable<CodigoAfip[]>;
    sisLetras: Observable<SisLetra[]>;

    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private router: Router
    ) {
        this.sisComprobantes = this.recursoService.getRecursoList(resourcesREST.sisComprobantes)();
        this.codigosAfip = this.recursoService.getRecursoList(resourcesREST.sisCodigoAfip)();
        this.sisLetras = this.recursoService.getRecursoList(resourcesREST.sisLetra)();
    }

    ngOnInit() {
        this.recursoService.setEdicionFinalizada(false);
    }

    @HostListener('window:beforeunload')
    canDeactivate = () => 
        this.recursoService.checkIfEquals(this.recurso, new TipoComprobante()) || 
        this.recursoService.getEdicionFinalizada();

    /**
     * Crear
     */
    onClickCrearTipoComprobante = async () => {
        try {
            const resp = await this.recursoService.setRecurso(this.recurso)();

            // Muestro mensaje de okey y redirecciono a la lista de tipos comprobantes
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

    /**
     * Checkea que surEnu sea D o H
     * Callback de checkIfIncomplete
     */
    checkSurEnu = (recur) => (recur.surenu !== 'D' && recur.surenu !== 'H' && recur.surenu !== 'd' && recur.surenu !== 'h');

}
