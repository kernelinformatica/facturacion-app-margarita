import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';
import { RecursoService } from '../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';

import { Categoria } from 'app/models/categoria';

@Component({
    selector: 'categorias',
    styleUrls: ['./categorias.scss'],
    templateUrl: './categorias.html'
})
export class Categorias {
    tableData;
    tableColumns;

    constructor(
        private router: Router,
        public utilsService: UtilsService,
        private recursoService: RecursoService
    ) {
        this.tableColumns = [
            {
                nombre: 'codigo',
                key: 'codigo',
                ancho: '20%'
            },
            {
                nombre: 'descripcion',
                key: 'descripcion',
                ancho: '35%'
            },
            {
                nombre: 'categoria',
                key: 'sisCategoria',
                subkey: 'descripcion',
                ancho: '35%'
            }

        ];
        this.tableData = this.recursoService.getRecursoList(resourcesREST.categorias)();
    }

    onClickEdit = (rec: Categoria) => {
        this.router.navigate(['/pages/tablas/categorias/editar', rec.idCategoria]);
    }

    onClickRemove = async(recurso: Categoria) => {
        this.utilsService.showModal(
            'Borrar categoria'
        )(
            '¿Estás seguro de borrarlo?'
        )(
           async () => {
                await this.recursoService.borrarRecurso(recurso.idCategoria)(resourcesREST.categorias);

                this.tableData = this.recursoService.getRecursoList(resourcesREST.categorias)();
            }
        )({
            tipoModal: 'confirmation'
        });
    }

}
