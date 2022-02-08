import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';
import { RecursoService } from 'app/services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { Observable } from 'rxjs/Observable';
import { RelacionCanje } from 'app/models/relacionCanje';


@Component({
    selector: 'relaciones-canje',
    styleUrls: ['./relacionesCanje.scss'],
    templateUrl: './relacionesCanje.html'
})
export class RelacionesCanje {

    // Data de la tabla
    tableData: Observable<RelacionCanje[]>;

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
                nombre: 'Codigo Cosecha',
                key: 'codigoCosecha',
                ancho: '15%'
            },
            {
                nombre: 'Codigo Clase',
                key: 'codigoClase',
                ancho: '15%'
            },
            {
                nombre: 'Descripcion',
                key: 'descripcion',
                ancho: '15%'
            },
            {
                nombre: 'Factor',
                key: 'factor',
                ancho: '15%'
            },
            {
                nombre: 'Especie',
                key: 'idSisCanje',
                subkey: 'descripcion',
                ancho: '15%'
            }
        ]

        this.tableData = this.recursoService.getRecursoList(resourcesREST.relacionesCanje)();
    }

    onClickEdit = (recurso: RelacionCanje) => {
        this.router.navigate(['/pages/tablas/relaciones-canje/editar', recurso.idRelacionSisCanje]);
    }

    onClickRemove = async(recurso: RelacionCanje) => {
        this.utilsService.showModal(
            'Borrar relacion'
        )(
            '¿Estás seguro de borrar relacion de canje?'
        )(
           async () => {
                const resp = await this.recursoService.borrarRecurso(recurso.idRelacionSisCanje)(resourcesREST.relacionesCanje);

                this.tableData = this.recursoService.getRecursoList(resourcesREST.relacionesCanje)();
            }
        )({
            tipoModal: 'confirmation'
        });
    }

}
