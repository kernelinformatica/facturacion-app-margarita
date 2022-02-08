import { LocalStorageService } from './../../../services/localStorageService';
import { environment } from '../../../../environments/environment';
import { Component } from '@angular/core';

import { GlobalState } from '../../../global.state';


@Component({
    selector: 'ba-page-top',
    templateUrl: './baPageTop.html',
    styleUrls: ['./baPageTop.scss']
})
export class BaPageTop {

    public isScrolled: boolean = false;
    public isMenuCollapsed: boolean = false;
    currentMenuSelected: string = '';
    public nombreUsuario ;
    public emailUsuario;
    public perfilUsuario;
    constructor(
        private _state: GlobalState,
        private localStorageService: LocalStorageService
    ) {

        this.nombreUsuario = this.localStorageService.getObject(environment.localStorage.usuario).nombre+" "+this.localStorageService.getObject(environment.localStorage.usuario).apellido;
       this.emailUsuario = this.localStorageService.getObject(environment.localStorage.usuario).email;
       this.perfilUsuario = this.localStorageService.getObject(environment.localStorage.perfil).descripcion;
        //this.nombreUsuario = this.localStorageService.getObject(environment.localStorage.usuario).nombre;
   
        this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
            this.isMenuCollapsed = isCollapsed;
        });

        // Actualizo el titulo
        this._state.subscribe('menu.activeLink', (activeLink) => {
            this.currentMenuSelected = activeLink.title;
        });
    }

    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }

    public scrolledChanged(isScrolled) {
        this.isScrolled = isScrolled;
    }
}
