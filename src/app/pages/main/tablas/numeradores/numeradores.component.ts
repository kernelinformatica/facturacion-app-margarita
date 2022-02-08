import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';
import { RecursoService } from '../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';

import { Numerador } from 'app/models/numerador';

@Component({
    selector: 'numeradores',
    styleUrls: ['./numeradores.scss'],
    templateUrl: './numeradores.html'
})
export class Numeradores {
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
                ancho: '22%'
            },
            {
                nombre: 'numero',
                key: 'auxNumero',
                ancho: '22%'
            },
            {
                nombre: 'numero',
                key: 'ptoVenta',
                subkey: 'sucursal',
                ancho: '22%'
            },
            {
                nombre: 'fecha apertura',
                key: 'fechaApertura',
                ancho: '22%'
            },
            {
                nombre: 'fecha cierre',
                key: 'fechaCierre',
                ancho: '22%'
            },
            {
                nombre: 'electronico',
                key: 'electronico',
                ancho: '22%'
            }
        ]
        this.tableData = this.recursoService.getRecursoList(resourcesREST.cteNumerador)();
    }

    onClickEdit = (rec: Numerador) => {
        this.router.navigate(['/pages/tablas/numeradores/editar', rec.idCteNumerador]);
    }

    onClickRemove = async(recurso: Numerador) => {
        this.utilsService.showModal(
            'Borrar numerador'
        )(
            '¿Estás seguro de borrarlo?'
        )(
           async () => {
                await this.recursoService.borrarRecurso(recurso.idCteNumerador)(resourcesREST.cteNumerador);

                this.tableData = this.recursoService.getRecursoList(resourcesREST.cteNumerador)();
            }
        )({
            tipoModal: 'confirmation'
        });
    }

}
