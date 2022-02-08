import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';
import { RecursoService } from '../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';

import { Cultivo } from 'app/models/cultivo';
import { FilesService } from 'app/services/filesService';

@Component({
    selector: 'cultivos',
    styleUrls: ['./cultivos.scss'],
    templateUrl: './cultivos.html'
})
export class Cultivos {
    tableData;
    tableColumns;

    constructor(
        private router: Router,
        public utilsService: UtilsService,
        private recursoService: RecursoService
    ) {
        this.tableColumns = [
            {
                nombre: 'descripcion',
                key: 'descripcion',
                ancho: '45%'
            },
            {
                nombre: 'cosecha',
                key: 'cosecha',
                ancho: '45%'
            },
        ]
        this.tableData = this.recursoService.getRecursoList(resourcesREST.cultivo)();
    }

    onClickEdit = (rec: Cultivo) => {
        this.router.navigate(['/pages/tablas/cultivos/editar', rec.idCultivo]);
    }

    onClickRemove = async(recurso: Cultivo) => {
        this.utilsService.showModal(
            'Borrar cultivo'
        )(
            '¿Estás seguro de borrarlo?'
        )(
           async () => {
                await this.recursoService.borrarRecurso(recurso.idCultivo)(resourcesREST.cultivo);

                this.tableData = this.recursoService.getRecursoList(resourcesREST.cultivo)();
            }
        )({
            tipoModal: 'confirmation'
        });
    }

}
