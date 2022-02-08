import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';
import { RecursoService } from '../../../../services/recursoService';
import { AuthService } from '../../../../services/authService';
import { LocalStorageService } from 'app/services/localStorageService';



@Component({
    selector: 'autorizacion',
    styleUrls: ['./autorizacion.scss'],
    templateUrl: './autorizacion.html'
})
export class Autorizacion {

    ptoVentaNC;
    nroNC;
    nroSocioNC;

    constructor(
        private router: Router,
        public utilsService: UtilsService,
        private recursoService: RecursoService,
        private authService: AuthService,
        private localStorageService: LocalStorageService
    ) {
        

    }

    generarClave = () => {
        const clave = this.utilsService.generarClaveNC(this.ptoVentaNC, this.nroNC, this.nroSocioNC);
        this.utilsService.showModal("Clave para emisión")("Su clave es: " + clave)()();
    }
}