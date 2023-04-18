import { Component } from '@angular/core';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';

import { Rubro } from 'app/models/rubro';


import { Observable } from 'rxjs/Observable';
import { RecursoService } from '../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { ModeloCab } from '../../../../models/modeloCab';

@Component({
    selector: 'modelo-imputacion',
    styleUrls: ['./modeloImputacion.scss'],
    templateUrl: './modeloImputacion.html'
})
export class ModeloImputacion {

    // Data de la tabla
    tableData: Observable<ModeloCab[]>;

    // Columnas de la tabla
    tableColumns;

    constructor(
        private recursoService: RecursoService,
        private router: Router,
        public utilsService: UtilsService
    ) {
        // Guardo las columnas de la tabla con sus respectivas anchuras
        this.tableColumns = [
            {
                nombre: 'descripcion',
                key: 'descripcion',
                ancho: '15%',
                customClass: 'text-left'
            },
            {
                nombre: 'detalle',
                key: 'detalleInfo',
                ancho: '75%',
                customClass: 'text-left'
            }

        ]

        this.tableData = this.recursoService.getRecursoList(resourcesREST.modeloImputacion)();
    }

    onClickEdit = (recurso: ModeloCab) => {
        this.router.navigate(['/pages/tablas/modelo-imputacion/editar', recurso.idModeloCab]);
    }

    onClickRemove = async(recurso: ModeloCab) => {
        this.utilsService.showModal(
            'Borrar modelo de imputación'
        )(
            '¿Estás seguro de borrarlo'
        )(
            async () => {
                const resp = await this.recursoService.borrarRecurso(recurso.idModeloCab)(resourcesREST.modeloImputacion);

                this.tableData = this.recursoService.getRecursoList(resourcesREST.modeloImputacion)();
            }
        )({
            tipoModal: 'confirmation'
        });
    }

}
