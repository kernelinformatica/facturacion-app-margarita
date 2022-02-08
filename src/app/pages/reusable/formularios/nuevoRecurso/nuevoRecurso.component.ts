import { Component, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { UtilsService } from 'app/services/utilsService';
import { AuthService } from '../../../../services/authService';

// Funciones de lodash
import * as _ from 'lodash';



@Component({
    selector: 'nuevo-recurso',
    styleUrls: ['./nuevoRecurso.scss'],
    templateUrl: './nuevoRecurso.html',
})

/** Ver genericos. Por ahora le mando por Input el recurso que quiero ya creado (en nullos) y lo relleno acá y lo creo en la bd */
export class NuevoRecurso {
    // Titulo
    @Input() titulo: string = '';

    // Recurso a llenar
    @Input() recurso: any = null;

    // Las keys del recurso separadas en arrays de 3 (ejemplo: [[a,b,c],[d,e,f],...])
    chunkKeys;

    constructor(
        private authService: AuthService,
        public utilsService: UtilsService,
        private router: Router
    ) { }

    ngOnInit() {

        const keys = Object.keys(this.recurso);

        this.chunkKeys = _.chunk(keys, 3);
    }






















    onClickCrear = async () => {
        try {

            // const respRubroCreado: any = await this.authService.registrarRubro(
            //     this.recurso
            // );

            // this.utilsService.showModal(
            //     respRubroCreado.control.codigo
            // )(
            //     respRubroCreado.control.descripcion
            // )(
            //     () => this.router.navigate(['/pages/tablas/rubros'])
            // )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
        }
    }

}
