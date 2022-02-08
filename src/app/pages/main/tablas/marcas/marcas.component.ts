import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';
import { RecursoService } from 'app/services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { Observable } from 'rxjs/Observable';
import { Marca } from 'app/models/marca';

@Component({
    selector: 'marcas',
    styleUrls: ['./marcas.scss'],
    templateUrl: './marcas.html'
})
export class Marcas {

    // Data de la tabla
    tableData: Observable<Marca[]>;

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
                ancho: '15%'
            }
        ]

        this.tableData = this.recursoService.getRecursoList(resourcesREST.marcas)();
    }

    onClickEdit = (recurso: Marca) => {
        this.router.navigate(['/pages/tablas/marcas/editar', recurso.idMarcas]);
    }

    onClickRemove = async(recurso: Marca) => {
        this.utilsService.showModal(
            'Borrar marca'
        )(
            '¿Estás seguro de borrar la marca?'
        )(
           async () => {
                const resp = await this.recursoService.borrarRecurso(recurso.idMarcas)(resourcesREST.marcas);

                this.tableData = this.recursoService.getRecursoList(resourcesREST.marcas)();
            }
        )({
            tipoModal: 'confirmation'
        });
    }

}
