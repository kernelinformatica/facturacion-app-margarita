import { Component } from '@angular/core';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';

import { Rubro } from 'app/models/rubro';

import { FormaPago } from '../../../../models/formaPago';

import { Observable } from 'rxjs/Observable';
import { RecursoService } from '../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';

@Component({
    selector: 'formas-pago',
    styleUrls: ['./formasPago.scss'],
    templateUrl: './formasPago.html'
})
export class FormasPago {

    // Data de la tabla
    tableData: Observable<FormaPago[]>;

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
                ancho: '45%'
            },
            {
                nombre: 'tipo',
                key: 'tipo',
                subkey: 'descripcion',
                ancho: '45%'
            }
        ]

        this.tableData = this.recursoService.getRecursoList(resourcesREST.formaPago)();
    }

    onClickEdit = (recurso: FormaPago) => {
        // Si se puede editar
        if (recurso.editar) {
            this.router.navigate(['/pages/tablas/formas-pago/editar', recurso.idFormaPago]);
        } else {
            this.utilsService.showModal(
                'Aviso'
            )(
                'Esta forma de pago no se puede editar'
            )()();
        }
    }

    onClickRemove = async(recurso: FormaPago) => {
        if (recurso.editar) {
            this.utilsService.showModal(
                'Borrar forma de pago'
            )(
                '¿Estás seguro de borrarla'
            )(
               async () => {
                    const resp = await this.recursoService.borrarRecurso(recurso.idFormaPago)(resourcesREST.formaPago);

                    this.tableData = this.recursoService.getRecursoList(resourcesREST.formaPago)();
                }
            )({
                tipoModal: 'confirmation'
            });
        } else {
            this.utilsService.showModal(
                'Aviso'
            )(
                'Esta forma de pago no se puede borrar'
            )()();
        }
    }

}
