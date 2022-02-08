import { Component, HostListener } from '@angular/core';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';
import { RecursoService } from '../../../../../../services/recursoService';
import { Proveedor } from 'app/models/proveedor';
import { Padron } from 'app/models/padron';
import { Observable } from 'rxjs';
import { Categoria } from 'app/models/categoria';
import { resourcesREST } from 'constantes/resoursesREST';
import { SisSitIVA } from 'app/models/sisSitIVA';

@Component({
    selector: 'nuevo-proveedor',
    styleUrls: ['./nuevoProveedor.scss'],
    templateUrl: './nuevoProveedor.html',
})

export class NuevoProveedor {
    recurso: Proveedor = new Proveedor();

    categorias: Observable<Categoria[]>;
    sisSitIVAs: Observable<SisSitIVA[]>;

    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private router: Router
    ) {
        this.categorias = this.recursoService.getRecursoList(resourcesREST.categorias)();
        this.sisSitIVAs = this.recursoService.getRecursoList(resourcesREST.sisSitIva)();
    }

    ngOnInit() {
        this.recursoService.setEdicionFinalizada(false);
    }

    @HostListener('window:beforeunload')
    canDeactivate = () => 
        this.recursoService.checkIfEquals(this.recurso, new Proveedor()) || 
        this.recursoService.getEdicionFinalizada();

    onClickCrearProveedor = async () => {
        try {

            const resp: any = await this.recursoService.setRecurso(this.recurso)();

            this.utilsService.showModal(
                resp.control.codigo
            )(
                resp.control.descripcion
            )(
                () => {
                    this.router.navigate(['/pages/tablas/proveedores']);
                    this.recursoService.setEdicionFinalizada(true);
                }
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
        }
    }

    onSelectPadron = (padronSelect: Padron) => {
        this.recurso.padronAux = padronSelect;

        setTimeout(
            () => document.getElementById('idCategoria').focus()
        )
    }
}
