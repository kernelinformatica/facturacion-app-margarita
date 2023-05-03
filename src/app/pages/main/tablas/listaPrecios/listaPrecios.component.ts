import { Component } from '@angular/core';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';
import { Observable } from 'rxjs/Observable';
import { RecursoService } from '../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';

import { ListaPrecio } from '../../../../models/listaPrecio';
import { LocalStorageService } from 'app/services/localStorageService';

@Component({
    selector: 'lista-precios',
    styleUrls: ['./listaPrecios.scss'],
    templateUrl: './listaPrecios.html'
})
export class ListaPrecios {

    // Data de la tabla
    tableData: Observable<ListaPrecio[]>;

    // Columnas de la tabla
    tableColumns;

    // Permisos
    get permisoListaPrecio() {
        var perfil = this.localStorageService.getObject(environment.localStorage.perfil);
        return perfil.idPerfil == 1;
    }

    constructor(
        private recursoService: RecursoService,
        private router: Router,
        public utilsService: UtilsService,
        private localStorageService: LocalStorageService
    ) {
        this.tableColumns = [
            {
                nombre: 'codigo',
                key: 'codigoLista',
                ancho: '22%',

            },
            {
                nombre: 'condiciones',
                key: 'condiciones',
                ancho: '22%'
            },
            {
                nombre: 'desde',
                key: 'vigenciaDesde',
                ancho: '22%'
            },
            {
                nombre: 'hasta',
                key: 'vigenciaHasta',
                ancho: '22%'
            }
        ]

        this.tableData = this.recursoService.getRecursoList(resourcesREST.listaPrecios)();
    }

    onClickEdit = (recurso: ListaPrecio) => {
        this.router.navigate(['/pages/tablas/lista-precios/editar', recurso.idListaPrecio]);
    }

    onClickRemove = async(recurso: ListaPrecio) => {
        this.utilsService.showModal(
            'Borrar lista de precio'
        )(
            '¿Estás seguro de borrar la lista de precios?'
        )(
           async () => {
                const resp = await this.recursoService.borrarRecurso(recurso.idListaPrecio)(resourcesREST.listaPrecios);

                this.tableData = this.recursoService.getRecursoList(resourcesREST.listaPrecios)();
            }
        )({
            tipoModal: 'confirmation'
        });
    }

}
