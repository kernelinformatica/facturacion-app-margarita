import { Component } from '@angular/core';
import { LocalStorageService } from '../../../../services/localStorageService';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';

import { Rubro } from 'app/models/rubro';
import { RecursoService } from '../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';

@Component({
    selector: 'rubros',
    styleUrls: ['./rubros.scss'],
    templateUrl: './rubros.html'
})
export class Rubros {

    // Data de la tabla
    tableData;

    // Columnas de la tabla
    tableColumns;

    constructor(
        private router: Router,
        public utilsService: UtilsService,
        private recursoService: RecursoService
    ) {
        // Guardo las columnas de la tabla con sus respectivas anchuras
        this.tableColumns = [
            {
                nombre: 'codigo',
                key: 'codigoRubro',
                ancho: '15%'
            },
            {
                nombre: 'descripcion',
                key: 'descripcion',
                ancho: '30%'
            },
            {
                nombre: 'empresa',
                key: 'empresa',
                subkey: 'nombre',
                ancho: '22%'
            },
            {
                nombre: 'cuit empresa',
                key: 'empresa',
                subkey: 'cuit',
                ancho: '23%'
            }
        ]

        this.tableData = this.recursoService.getRecursoList(resourcesREST.rubros)();
    }

    onClickEdit = (rubro: Rubro) => {
        this.router.navigate(['/pages/tablas/rubros/editar', rubro.idRubro]);
    }

    onClickRemove = async(recurso: Rubro) => {
        this.utilsService.showModal(
            'Borrar rubro'
        )(
            '¿Estás seguro de borrar el rubro?'
        )(
           async () => {
                await this.recursoService.borrarRecurso(recurso.idRubro)(resourcesREST.rubros);

                this.tableData = this.recursoService.getRecursoList(resourcesREST.rubros)();
            }
        )({
            tipoModal: 'confirmation'
        });
    }

}
