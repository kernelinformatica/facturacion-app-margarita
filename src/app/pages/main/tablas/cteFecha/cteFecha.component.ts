import { Component } from '@angular/core';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';
import { Observable } from 'rxjs/Observable';
import { RecursoService } from '../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { CteFechas } from '../../../../models/cteFechas';

@Component({
    selector: 'cte-fecha',
    styleUrls: ['./cteFecha.scss'],
    templateUrl: './cteFecha.html'
})
export class CteFecha {

    // Data de la tabla
    tableData: Observable<CteFechas[]>;

    // Columnas de la tabla
    tableColumns;

    constructor(
        private recursoService: RecursoService,
        private router: Router,
        public utilsService: UtilsService
    ) {
        this.tableColumns = [
            // {
            //     nombre: 'id',
            //     key: 'idCteFechas',
            //     ancho: '8%'
            // },
            {
                nombre: 'Punto de Venta',
                key: 'puntoVenta',
                ancho: '10%'
            },
            {
                nombre: 'fecha Apertura',
                key: 'fechaApertura',
                ancho: '25%'
            },
            {
                nombre: 'fecha Cierre',
                key: 'fechaCierre',
                ancho: '25%'
            },
            {
                nombre: 'Comprobante',
                key: 'cteTipo',
                subkey: 'descripcion',
                ancho: '25%'
            },
            {
                nombre: '',
                key: 'cteTipo',
                subkey: 'descCorta',
                ancho: '5%'
            }
        ]

        this.tableData = this.recursoService.getRecursoList(resourcesREST.cteFecha)();
    }

    onClickEdit = (recurso: CteFechas) => {
        this.router.navigate(['/pages/tablas/cte-fecha/editar', recurso.idCteFechas]);
    }

    onClickRemove = async(recurso: CteFechas) => {
        this.utilsService.showModal(
            'Borrar fecha'
        )(
            '¿Estás seguro de borrar la fecha?'
        )(
           async () => {
                const resp = await this.recursoService.borrarRecurso(recurso.idCteFechas)(resourcesREST.cteFecha);

                this.tableData = this.recursoService.getRecursoList(resourcesREST.cteFecha)();
            }
        )({
            tipoModal: 'confirmation'
        });
    }

}
