import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultModal } from '../pages/reusable/modals/default-modal/default-modal.component';
import { AuthService } from './authService';
import { BaMenuService } from 'app/theme';
import { Routes } from '@angular/router';
import { LocalStorageService } from 'app/services/localStorageService';
import { environment } from 'environments/environment';

@Injectable()
export class LoginService {

    constructor(
        private modalService: NgbModal,
        private authService: AuthService,
        private baMenuService: BaMenuService,
        private localStorageService: LocalStorageService
    ) { }


    /**
     * Se loguea al backend y retorna la respuesta
     */
    login = (usuario) => (clave) => this.authService.login(usuario)(clave);

    /**
     * Guarda data importante del logueo y genera los menus, entre otras cosas
     */
    completeLogin = (respLogin) => {
        // Guardo datos importantes del login (TODO: Cambiar por LocalStorage)
        // debugger;


        
        this.localStorageService.setObject(environment.localStorage.usuario)({
            nombre: respLogin.datos.cuenta.nombre,
            apellido: respLogin.datos.cuenta.apellido,
            email: respLogin.datos.cuenta.email
        });

        this.localStorageService.setObject(environment.localStorage.acceso)(respLogin.datos.acceso);
       this.localStorageService.setObject(environment.localStorage.perfil)(respLogin.datos.perfil);
       
        // Guardo los menus PARSEADOS en el localStorage
        // this.localStorageService.setObject(environment.localStorage.menu)(<Routes>this.baMenuService.generatePagesMenu(respLogin.datos.perfil.sucursal.menuSucursal));
        this.localStorageService.setObject(environment.localStorage.menu)(<Routes>this.baMenuService.generatePagesMenu(respLogin.datos.perfil.sucursal.permisos));
       // debugger
       // this.authService.actualizaComproVentas(respLogin.datos.acceso.token);
    }


}
