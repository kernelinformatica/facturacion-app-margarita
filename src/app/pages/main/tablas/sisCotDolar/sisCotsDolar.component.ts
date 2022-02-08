import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';
import { RecursoService } from 'app/services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { Observable } from 'rxjs/Observable';
import { SisCotDolar } from 'app/models/sisCotDolar';

@Component({
    selector: 'cot-dolar',
    styleUrls: ['./sisCotsDolar.scss'],
    templateUrl: './sisCotsDolar.html'
})
export class SisCotsDolar {

    // Data de la tabla
    tableData: Observable<SisCotDolar[]>;

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
                nombre: 'cotizacion',
                key: 'cotizacion',
                ancho: '30%'
            },
            {
                nombre: 'fecha',
                key: 'fechaCotizacion',
                ancho: '30%'
            }
        ]

        this.tableData = this.recursoService.getRecursoList(resourcesREST.sisCotDolar)()
            .map(
                resp => resp.sort(
                    (a,b) => this.utilsService.dateLikePickerToDate(a.fechaCotizacion) < this.utilsService.dateLikePickerToDate(b.fechaCotizacion) ? 1 : -1
                )
            )
    }

    onClickEdit = (recurso: SisCotDolar) => {
        this.router.navigate(['/pages/tablas/cot-dolar/editar', recurso.idSisCotDolar]);
    }

    onClickRemove = async(recurso: SisCotDolar) => {
        this.utilsService.showModal(
            'Borrar marca'
        )(
            '¿Estás seguro de borrar la cot dolar?'
        )(
           async () => {
                const resp = await this.recursoService.borrarRecurso(recurso.idSisCotDolar)(resourcesREST.sisCotDolar);

                this.tableData = this.recursoService.getRecursoList(resourcesREST.sisCotDolar)();
            }
        )({
            tipoModal: 'confirmation'
        });
    }

}
