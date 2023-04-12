import { Component } from '@angular/core';
import { RecursoService } from 'app/services/recursoService';
import { UtilsService } from 'app/services/utilsService';
import { Observable } from 'rxjs';
import { ListaPasajesLogs } from 'app/models/listaPasajesLogs';
import { resourcesREST } from 'constantes/resoursesREST';

@Component({
    selector: 'pasajes-logs',
    styleUrls: ['./pasajesLogs.scss'],
    templateUrl: './pasajesLogs.html'
})
export class PasajesLogs {
    // Data de la tabla
    tableData: Observable<ListaPasajesLogs[]>;

    // Columnas de la tabla
    tableColumns;

    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
    ) {
        this.tableColumns = [
            {
                nombre: 'Fecha y Hora',
                key: 'fechayhora',
                ancho: '30%',
                customClass: 'text-rigth',
                enEdicion: false
            },
            {
                nombre: 'Dato',
                key: 'dato',
                ancho: '70%',
                customClass: 'text-left',
                enEdicion: false
            }
        ]

        this.tableData = this.recursoService.getRecursoList(resourcesREST.listaPasajesLogs)();
    }
}
