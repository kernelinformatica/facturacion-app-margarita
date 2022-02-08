import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';
import { RecursoService } from '../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';

import { Cliente } from 'app/models/cliente';

@Component({
    selector: 'clientes',
    styleUrls: ['./clientes.scss'],
    templateUrl: './clientes.html'
})
export class Clientes {
    tableData;
    tableColumns;

    constructor(
        private router: Router,
        public utilsService: UtilsService,
        private recursoService: RecursoService
    ) {
        this.tableColumns = [
            {
                nombre: 'cliente',
                key: 'auxNombreCompleto',
                ancho: '20%'
            },
            {
                nombre: 'categoria',
                key: 'auxCategoria',
                ancho: '15%'
            },
            {
                nombre: 'cuit',
                key: 'padronGral',
                subkey: 'cuit',
                ancho: '20%'
            },
            {
                nombre: 'vendedor',
                key: 'vendedor',
                subkey: 'auxNombreCompleto',
                ancho: '20%'
            },
            {
                nombre: 'categoria',
                key: 'vendedor',
                subkey: 'auxCategoria',
                ancho: '15%'
            },
        ]
        this.tableData = this.recursoService.getRecursoList(resourcesREST.cliente)();

        this.tableData.subscribe(re => console.log(re))
    }

    onClickEdit = (rec: Cliente) => {
        this.router.navigate(['/pages/tablas/clientes/editar', rec.idCliente]);
    }

    onClickRemove = async(recurso: Cliente) => {
        this.utilsService.showModal(
            'Borrar cliente asociado'
        )(
            '¿Estás seguro de borrarlo?'
        )(
           async () => {
                await this.recursoService.borrarRecurso(recurso.idCliente)(resourcesREST.cliente);

                this.tableData = this.recursoService.getRecursoList(resourcesREST.cliente)();
            }
        )({
            tipoModal: 'confirmation'
        });
    }

}
