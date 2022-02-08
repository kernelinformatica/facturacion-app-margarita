import { Component, Input } from '@angular/core';

import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Producto } from '../../../../../../models/producto';
import { IVA } from '../../../../../../models/IVA';

import { RecursoService } from '../../../../../../services/recursoService';
import { SubRubro } from '../../../../../../models/subRubro';
import { Unidad } from '../../../../../../models/unidad';
import { resourcesREST } from 'constantes/resoursesREST';
import { Rubro } from 'app/models/rubro';
import { ModeloCab } from 'app/models/modeloCab';
import { AuthService } from '../../../../../../services/authService';
import { Marca } from 'app/models/marca';
import { Cultivo } from 'app/models/cultivo';
import { Moneda } from 'app/models/moneda';

@Component({
    selector: 'nuevo-producto',
    styleUrls: ['./nuevoProducto.scss'],
    templateUrl: './nuevoProducto.html',
})

export class NuevoProducto {
    recurso: Producto = new Producto();
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
        private router: Router
    ) {
        this.rubros = this.recursoService.getRecursoList(resourcesREST.rubros)();
        this.unidadesCompra = this.recursoService.getRecursoList(resourcesREST.sisUnidad)();
        this.unidadesVenta = this.recursoService.getRecursoList(resourcesREST.sisUnidad)();
        this.ivas = this.recursoService.getRecursoList(resourcesREST.sisIVA)();
        this.modelosCab = this.recursoService.getRecursoList(resourcesREST.modeloCab)();
        this.marcas = this.recursoService.getRecursoList(resourcesREST.marcas)();
        this.monedas = this.recursoService.getRecursoList(resourcesREST.sisMonedas)();
        

        this.recursoService.getRecursoList(resourcesREST.cultivo)().toPromise()
            .then(cultivos => this.cultivos = cultivos);

        // nullizo los valores del recurso
        this.recurso.IVA = null;
        this.recurso.subRubro = null;
        this.recurso.unidadCompra = null;
        this.recurso.unidadVenta = null;
        this.recurso.modeloCab = null;
        this.recurso.marca = null;
        this.recurso.moneda = null;
    }
    
    ngOnInit() {
        this.recursoService.getProximoCodigoProducto().subscribe(
            proxCodigo => this.recurso.codProducto = proxCodigo
        );
    }

    onClickCrear = async () => {
        try {

            const resp: any = await this.recursoService.setRecurso(
                this.recurso
            )();


            this.utilsService.showModal(
                resp.control.codigo
            )(
                resp.control.descripcion
            )(
                () => this.router.navigate(['/pages/stock/productos'])
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
        })
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

}
