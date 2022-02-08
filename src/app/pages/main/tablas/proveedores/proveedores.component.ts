import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';
import { RecursoService } from 'app/services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { Observable } from 'rxjs/Observable';

import { Proveedor } from 'app/models/proveedor';

@Component({
    selector: 'proveedores',
    styleUrls: ['./proveedores.scss'],
    templateUrl: './proveedores.html'
})
export class Proveedores {

    // Data de la tabla
    tableData: Observable<Proveedor[]>;

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
                nombre: 'Codigo',
                key: 'padronGral',
                subkey: 'idPadronGral',
                ancho: '15%'
            },
            {
                nombre: 'Nombre',
                key: 'padronGral',
                subkey: 'nombre',
                customClass: 'text-left',
                ancho: '15%'
            },
            {
                nombre: 'Apellido',
                key: 'padronGral',
                subkey: 'apellido',
                customClass: 'text-left',
                ancho: '15%'
            },
            {
                nombre: 'Retencion Ing Br',
                key: 'iibbRet',
                ancho: '15%',
                // customClass: 'text-righ'
            },
            {
                nombre: 'Persepcion Ing Br',
                key: 'iibbPer',
                ancho: '15%'
            }
        ]

        this.tableData = this.recursoService.getRecursoList(resourcesREST.proveedores)();
    }

    onClickEdit = (recurso: Proveedor) => {
        this.router.navigate(['/pages/tablas/proveedores/editar', recurso.idPadronProveedor]);
    }

    onClickRemove = async(recurso: Proveedor) => {
        this.utilsService.showModal(
            'Borrar proveedor'
        )(
            '¿Estás seguro de borrar el proveedor?'
        )(
           async () => {
                const resp = await this.recursoService.borrarRecurso(recurso.idPadronProveedor)(resourcesREST.proveedores);

                this.tableData = this.recursoService.getRecursoList(resourcesREST.proveedores)();
            }
        )({
            tipoModal: 'confirmation'
        });
    }

}
