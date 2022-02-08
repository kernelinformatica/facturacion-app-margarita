import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';
import { RecursoService } from '../../../../services/recursoService';
import { AuthService } from '../../../../services/authService';
import { LocalStorageService } from 'app/services/localStorageService';



@Component({
    selector: 'actualizacion-productos',
    styleUrls: ['./actualizacion-productos.scss'],
    templateUrl: './actualizacion-productos.html'
})
export class ActualizacionProductos {

    codProdDesde;
    codProdHasta;

    constructor(
        private router: Router,
        public utilsService: UtilsService,
        private recursoService: RecursoService,
        private authService: AuthService,
        private localStorageService: LocalStorageService
    ) {
        

    }

    actualizarProductos = () => {
        this.recursoService.actualizarProductosViejoANuevo(this.codProdDesde, this.codProdHasta).subscribe(response => {
            this.utilsService.showModal(response.codigo)(response.descripcion)()();
        })
    }
}