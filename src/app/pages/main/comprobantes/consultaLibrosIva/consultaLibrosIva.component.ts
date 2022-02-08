import { Component } from '@angular/core';
import { RecursoService } from '../../../../services/recursoService';
import { UtilsService } from '../../../../services/utilsService';
import { Observable } from 'rxjs';
import { Libro } from 'app/models/libro';
import { resourcesREST } from 'constantes/resoursesREST';
import { SisModulo } from 'app/models/sisModulo';
import { DateLikePicker } from 'app/models/dateLikePicker';
import { AuthService } from 'app/services/authService';
import { ComprobanteService } from 'app/services/comprobanteService';

@Component({
    selector: 'consulta-libros-iva',
    styleUrls: ['./consultaLibrosIva.scss'],
    templateUrl: './consultaLibrosIva.html'
})
export class ConsultaLibrosIva {
    sisModulos: Observable<SisModulo[]>;
    
    fecDesde: DateLikePicker = new DateLikePicker();
    fecHasta: DateLikePicker = new DateLikePicker();
    sisModulo: SisModulo;
    
    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private comprobanteService: ComprobanteService
    ) {
        this.sisModulos = this.recursoService.getRecursoList(resourcesREST.sisModulos)();
    }

    onImprimir = () => {
        this.comprobanteService.imprimirLibrosIva(this.sisModulo, this.fecDesde, this.fecHasta)
            .subscribe(resp => {
                if (resp) {
                    this.utilsService.downloadBlob(resp['_body'], 'libros-iva');
                }
            })
    }

}
