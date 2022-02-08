import { Component, Input, HostListener } from '@angular/core';

import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Producto } from '../../../../../../models/producto';
import { IVA } from '../../../../../../models/IVA';

import { RecursoService } from '../../../../../../services/recursoService';
import { SubRubro } from '../../../../../../models/subRubro';
import { Unidad } from '../../../../../../models/unidad';
import { resourcesREST } from 'constantes/resoursesREST';
import { Rubro } from 'app/models/rubro';
import { ModeloCab } from '../../../../../../models/modeloCab';
import { Marca } from '../../../../../../models/marca';
import { Cultivo } from 'app/models/cultivo';
import { Moneda } from 'app/models/moneda';

@Component({
    selector: 'editar-producto',
    styleUrls: ['./editarProducto.scss'],
    templateUrl: './editarProducto.html',
})

export class EditarProducto {
    recurso: Producto = new Producto();
    recursoOriginal: Producto = new Producto();

    ivas: Observable<IVA[]>;
    rubros: Observable<Rubro[]>;
    subRubros: Observable<SubRubro[]>;
    unidadesCompra: Observable<Unidad[]>;
    unidadesVenta: Observable<Unidad[]>;
    modelosCab: Observable<ModeloCab[]>;
    marcas: Observable<Marca[]>;
    
    cultivos: Cultivo[] = [];

    monedas: Observable<Moneda[]>;

    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.rubros = this.recursoService.getRecursoList(resourcesREST.rubros)();
        this.unidadesCompra = this.recursoService.getRecursoList(resourcesREST.sisUnidad)();
        this.unidadesVenta = this.recursoService.getRecursoList(resourcesREST.sisUnidad)();
        this.ivas = this.recursoService.getRecursoList(resourcesREST.sisIVA)();
        this.modelosCab = this.recursoService.getRecursoList(resourcesREST.modeloCab)();
        this.marcas = this.recursoService.getRecursoList(resourcesREST.marcas)();
        this.monedas = this.recursoService.getRecursoList(resourcesREST.sisMonedas)();

        this.recursoService.getRecursoList(resourcesREST.cultivo)().toPromise()
            .then(cultivos => this.cultivos = cultivos)

        // Busco el recurso por id
        this.route.params.subscribe(params =>
            this.recursoService.getRecursoList(resourcesREST.productos)()
                .map((recursoList: Producto[]) =>
                    recursoList.find(recurso => recurso.idProductos === parseInt(params.idProductos))
                )
                .subscribe(recurso =>{
                    this.recurso = recurso;
                    this.recursoOriginal = Object.assign({}, recurso);
                    
                    this.subRubros = this.recursoService.getRecursoList(resourcesREST.subRubros)({
                        idRubro: this.recurso.subRubro.rubro.idRubro
                    });
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
    

    onClickEditar = async () => {
        try {

            const resp: any = await this.recursoService.editarRecurso(
                this.recurso
            )();

            this.utilsService.showModal(
                resp.control.codigo
            )(
                resp.control.descripcion
            )(
                () => {
                    this.router.navigate(['/pages/stock/productos']);
                    this.recursoService.setEdicionFinalizada(true);
                }
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
        }
    }

    compareWithModeloImpu = (mod1: ModeloCab, mod2: ModeloCab) => mod1 && mod2 ? mod1.idModeloCab === mod2.idModeloCab : mod1 === mod2
    
    /**
     * Cuanbdo cambia Rubro, actualizo SubRubros
     */
    onChangeRubro = (rubroSelect: Rubro) => {
        this.subRubros = this.recursoService.getRecursoList(resourcesREST.subRubros)({
            'idRubro': rubroSelect.idRubro
        });

        // this.recursoEditado = true;
    }

    compareWithSubRubro = (r1, r2: SubRubro) => {
        if (r1 && r2 && this.recurso && this.recurso.subRubro) {
            return r2.idSubRubro === this.recurso.subRubro.idSubRubro
        };
    }

    
    onConditionCultivo = (cult: Cultivo) => 
        this.recurso.cultivos.length > 0 && 
        this.recurso.cultivos.some(recCult => recCult.idCultivo === cult.idCultivo);
    

    /**
     * Agrega/quita un cultivo de los cultivos del producto
     */
    onClickCultivo = (cult: Cultivo) => () =>
        this.recurso.cultivos.some(recCult => recCult.idCultivo === cult.idCultivo) ?
        this.recurso.cultivos = this.recurso.cultivos.filter(recCult => recCult.idCultivo !== cult.idCultivo) :
        this.recurso.cultivos = this.recurso.cultivos.concat(cult)

    compareRubro = (a, b) => a && b && a.idRubro && b.idRubro && a.idRubro === b.idRubro
}
