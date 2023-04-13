import { Component } from '@angular/core';
import { RecursoService } from 'app/services/recursoService';
import { UtilsService } from 'app/services/utilsService';
import { BehaviorSubject, Observable } from 'rxjs';
import { ListaPasajesLogs } from 'app/models/listaPasajesLogs';
import { resourcesREST } from 'constantes/resoursesREST';

@Component({
    selector: 'pasajes-logs',
    styleUrls: ['./pasajesLogs.scss'],
    templateUrl: './pasajesLogs.html'
})
export class PasajesLogs {
    // Data de la tabla
    tableData: BehaviorSubject<ListaPasajesLogs[]> = new BehaviorSubject([]);;

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
                ancho: '20%',
                customClass: 'text-rigth',
                enEdicion: false
            },
            {
                nombre: 'Descripción',
                key: 'dato',
                ancho: '80%',
                customClass: 'text-left',
                enEdicion: false
            }
        ]

        this.recursoService.getRecursoList(resourcesREST.listaPasajesLogs)().subscribe(values => {
            values.map(element => {
                if (element.dato.toLowerCase().includes("no", 0)) {
                    element.class = 'text-danger font-weight-bold';
                }
            });

            this.tableData.next(values);
        });
    }
}
