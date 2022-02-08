import { Component, HostListener } from '@angular/core';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';
import { RecursoService } from '../../../../../../services/recursoService';
import { Marca } from 'app/models/marca';

@Component({
    selector: 'nuevo-marca',
    styleUrls: ['./nuevoMarca.scss'],
    templateUrl: './nuevoMarca.html',
})

export class NuevoMarca {
    recurso: Marca = new Marca();

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
        this.recursoService.checkIfEquals(this.recurso, new Marca()) || 
        this.recursoService.getEdicionFinalizada();

    onClickCrearMarca = async () => {
        try {

            const respMarcaCreada: any = await this.recursoService.setRecurso(this.recurso)();

            this.utilsService.showModal(
                respMarcaCreada.control.codigo
            )(
                respMarcaCreada.control.descripcion
            )(
                () => {
                    this.router.navigate(['/pages/tablas/marcas']);
                    this.recursoService.setEdicionFinalizada(true);
                }
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
        }
    }

}
