import { Component } from '@angular/core';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { Usuario } from 'app/models/usuario';
import { UtilsService } from '../../../../services/utilsService';
import { RecursoService } from 'app/services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';

@Component({
    selector: 'maps',
    styleUrls: ['./usuarios.scss'],
    templateUrl: './usuarios.html'
})
export class Usuarios {

    // Data de la tabla
    dataUsuarios;

    // Columnas de la tabla
    tableColumns;

    constructor(
        private router: Router,
        public utilsService: UtilsService,
        private recursoService: RecursoService
    ) {
        // Guardo las columnas de la tabla con sus respectivas anchuras
        /* nombre: 'NRO COMP',
        key: 'nroComprobante',
        ancho: '5%',
        type: 'number',
        customClass: 'text-right'
      },*/
        this.tableColumns = [
            {
                nombre: 'ID',
                key: 'idUsuario',
                type: 'number',
                ancho: '5%',
                customClass: 'text-right'
            },
            {
                nombre: 'usuario',
                key: 'usuario',
                type: 'text',
                ancho: '30%',
                customClass: 'text-left',
            },
            {
                nombre: 'nombre',
                key: 'nombre',
                type: 'text',
                ancho: '30%',
                customClass: 'text-left',
            },
            {
                nombre: 'apellido',
                key: 'apellido',
                ancho: '30%',
                type: 'text',
                customClass: 'text-left',

            },
            {
                nombre: 'email',
                key: 'email',
                ancho: '30%',
                type: 'text',
                customClass: 'text-left',
                

            },
            /*{
                nombre: 'perfil',
                type: 'number',
                key: 'perfil.descripcion',
                ancho: '30%',
                customClass: 'text-left',
            },
            {
                nombre: 'sucursal',
                type: 'number',
                key: 'perfil.sucursal.nombre',
                ancho: '30%',
                customClass: 'text-left',
            },*/
        ]
        // Obtengo la lista de usuarios
        this.dataUsuarios = this.recursoService.getRecursoList(resourcesREST.usuarios)();
    }

    /**
     * Redireciona a la pagina de editar
     */
    onClickEdit = (usuario) => {
        // Redirecciono al dashboard
        this.router.navigate(['/pages/tablas/usuarios/editar', usuario.idUsuario]);
    }

    /**
     * Borra el usuario y muestra un mensajito avisando tal accion
     */
    onClickRemove = async(usuario) => {
        
        // Pregunto si está seguro
        this.utilsService.showModal(
            'Borrar usuario'
        )(
            '¿Estás seguro de borrar el usuario?'
        )(
           async () => {
                // Borro usuario
                const resp = await this.recursoService.borrarRecurso(usuario.idUsuario)(resourcesREST.usuarios);
                
                // Obtengo la lista de usuarios actualizada
                this.dataUsuarios = this.recursoService.getRecursoList(resourcesREST.usuarios)();
            }
        )({
            tipoModal: 'confirmation'
        });
    }

}
