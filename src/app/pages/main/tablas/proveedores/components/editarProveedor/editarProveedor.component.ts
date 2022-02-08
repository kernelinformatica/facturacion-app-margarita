import { Component, HostListener } from '@angular/core';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router, ActivatedRoute } from '@angular/router';
import { RecursoService } from '../../../../../../services/recursoService';
import { Proveedor } from 'app/models/proveedor';
import { Padron } from 'app/models/padron';
import { Observable } from 'rxjs';
import { Categoria } from 'app/models/categoria';
import { resourcesREST } from 'constantes/resoursesREST';
import { SisSitIVA } from 'app/models/sisSitIVA';

@Component({
    selector: 'editar-proveedor',
    styleUrls: ['./editarProveedor.scss'],
    templateUrl: './editarProveedor.html',
})

export class EditarProveedor {
    recurso: Proveedor = new Proveedor();
    recursoOriginal: Proveedor = new Proveedor();

    categorias: Observable<Categoria[]>;
    sisSitIVAs: Observable<SisSitIVA[]>;

    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.route.params.subscribe(params =>
            this.recursoService.getRecursoList(resourcesREST.proveedores)()
                .map((recursoList: Proveedor[]) =>
                    recursoList.find(recurso => recurso.idPadronProveedor === parseInt(params.idPadronProveedor))
                )
                .subscribe(recurso =>{
                    this.recurso = recurso;
                    this.recursoOriginal = Object.assign({}, recurso);
                })
        );

        this.categorias = this.recursoService.getRecursoList(resourcesREST.categorias)();
        this.sisSitIVAs = this.recursoService.getRecursoList(resourcesREST.sisSitIva)();
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

    /**
     * Parsea datos del padron del proveedor, y los retorna
     */
    parsePadron = () => this.recurso && this.recurso.padronGral ?
        `${this.recurso.padronGral.apellido} [${this.recurso.padronGral.idPadronGral}]` : ''
}
