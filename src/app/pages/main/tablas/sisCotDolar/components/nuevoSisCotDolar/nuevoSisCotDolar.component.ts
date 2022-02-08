import { Component, HostListener } from '@angular/core';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';
import { RecursoService } from '../../../../../../services/recursoService';
import { Marca } from 'app/models/marca';
import { SisCotDolar } from 'app/models/sisCotDolar';

@Component({
    selector: 'nuevo-cot-dolar',
    styleUrls: ['./nuevoSisCotDolar.scss'],
    templateUrl: './nuevoSisCotDolar.html',
})

export class NuevoSisCotDolar {
    recurso: SisCotDolar = new SisCotDolar();

    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.recursoService.setEdicionFinalizada(false);
    }

    @HostListener('window:beforeunload')
    canDeactivate = () => 
        this.recursoService.checkIfEquals(this.recurso, new SisCotDolar()) || 
        this.recursoService.getEdicionFinalizada();

    onClickCrear = async () => {
        try {

            const respMarcaCreada: any = await this.recursoService.setRecurso(this.recurso)();

            this.utilsService.showModal(
                respMarcaCreada.control.codigo
            )(
                respMarcaCreada.control.descripcion
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
