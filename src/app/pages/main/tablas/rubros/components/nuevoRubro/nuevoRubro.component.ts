import { Component, Input, HostListener } from '@angular/core';

import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';
import { Rubro } from '../../../../../../models/rubro';

import { RecursoService } from 'app/services/recursoService';

@Component({
    selector: 'nuevo-rubro',
    styleUrls: ['./nuevoRubro.scss'],
    templateUrl: './nuevoRubro.html',
})

export class NuevoRubro {
    recurso: Rubro = new Rubro();

    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private router: Router
    ) { }

    ngOnInit() {
        this.recursoService.setEdicionFinalizada(false);
    }

    @HostListener('window:beforeunload')
    canDeactivate = () => 
        this.recursoService.checkIfEquals(this.recurso, new Rubro()) || 
        this.recursoService.getEdicionFinalizada();

    onClickCrear = async () => {
        try {
            const respRubroCreado: any = await this.recursoService.setRecurso(this.recurso)();
    
            this.utilsService.showModal(
                respRubroCreado.control.codigo
            )(
                respRubroCreado.control.descripcion
            )(
                () => {
                    this.router.navigate(['/pages/tablas/rubros']);
                    this.recursoService.setEdicionFinalizada(true);
                }
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);       
        }
    }

}
