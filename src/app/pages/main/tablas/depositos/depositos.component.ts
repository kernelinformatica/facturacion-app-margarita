import { Component } from '@angular/core';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';
import { Observable } from 'rxjs/Observable';
import { RecursoService } from '../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { Deposito } from '../../../../models/deposito';

@Component({
    selector: 'depositos',
    styleUrls: ['./depositos.scss'],
    templateUrl: './depositos.html'
})
export class Depositos {

    // Data de la tabla
    tableData: Observable<Deposito[]>;

    // Columnas de la tabla
    tableColumns;

    constructor(
        private recursoService: RecursoService,
        private router: Router,
        public utilsService: UtilsService
    ) {
        this.tableColumns = [
            {
                nombre: 'codigo',
                key: 'codigoDep',
                ancho: '22%'
            },
            {
                nombre: 'descripcion',
                key: 'descripcion',
                ancho: '22%'
            },
            {
                nombre: 'domicilio',
                key: 'domicilio',
                ancho: '22%'
            },
            {
                nombre: 'codigo postal',
                key: 'codigoPostal',
                ancho: '22%'
            }
        ]

        this.tableData = this.recursoService.getRecursoList(resourcesREST.depositos)();
    }

    onClickEdit = (recurso: Deposito) => {
        this.router.navigate(['/pages/tablas/depositos/editar', recurso.idDeposito]);
    }

    onClickRemove = async(recurso: Deposito) => {
        this.utilsService.showModal(
            'Borrar deposito'
        )(
            '¿Estás seguro de borrar el deposito?'
        )(
           async () => {
                const resp = await this.recursoService.borrarRecurso(recurso.idDeposito)(resourcesREST.depositos);

                this.tableData = this.recursoService.getRecursoList(resourcesREST.depositos)();
            }
        )({
            tipoModal: 'confirmation'
        });
    }

}
