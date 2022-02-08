import { Component } from '@angular/core';
import { Routes } from '@angular/router';

import { BaMenuService } from '../theme';
import { AppState } from 'app/app.service';
import { LocalStorageService } from '../services/localStorageService';
import { RecursoService } from '../services/recursoService';
import { environment } from 'environments/environment';
import { debug } from 'util';

@Component({
    selector: 'pages',
    template: `
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <ba-sidebar></ba-sidebar>
    <ba-page-top></ba-page-top>
    <div class="al-main">
      <div class="al-content">
        <ba-content-top></ba-content-top>
        <router-outlet></router-outlet>
      </div>
    </div>
 <ba-back-top position="100"></ba-back-top>`
})
// <ul class="al-share clearfix">
//           <li><i class="socicon socicon-facebook"></i></li>
//           <li><i class="socicon socicon-twitter"></i></li>
//           <li><i class="socicon socicon-google"></i></li>
//           <li><i class="socicon socicon-github"></i></li>
//         </ul>
// <div class="al-footer-right" translate>{{'general.created_with'}} <i class="ion-heart"></i></div>
export class Pages {

    constructor(
        private _menuService: BaMenuService,
        private appState: AppState,
        private localStorageService: LocalStorageService,
        private recursoService: RecursoService
    ) {
    }

    ngOnInit() {
        // Ahora el menu se obtiene del localStorage, donde es almacenada cuando el user se loguea
        //this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
        this._menuService.updateMenuByRoutes(
            this.localStorageService.getObject(environment.localStorage.menu)
        );

        this.disabledFormEnter();
    }

    disabledFormEnter = () => {
        window.addEventListener(
            'keydown',
            function (e: any) {
                if (e.keyIdentifier == 'U+000A' || e.keyIdentifier == 'Enter' || e.keyCode == 13) {
                    if (e.target.nodeName == 'INPUT' && e.target.type == 'text') {
                        e.preventDefault(); return false;
                    }
                }
            },
            true
        );
    }

    /*private checkVersionado = () => {
      let isVersionActualizada: Boolean = true;
      this.recursoService.getVersion().subscribe(datos => {
        isVersionActualizada = (datos.version === environment.versionLocal.numero);
        if(!isVersionActualizada && environment.versionLocal.descripcion === 'Produccion') {
          window.alert("La aplicación que está utilizando fue actualizada recientemente, se cargará nuevamente la página para que los cambios se apliquen.");
          location.reload(true);
        }
      });
    }*/
}


/*
TODO: Viejo template, se le sacó el <ba-page-top> y  el <ba-content-top> al de arriba!
template: `
    <ba-sidebar></ba-sidebar>
    <ba-page-top></ba-page-top>
    <div class="al-main">
      <div class="al-content">
        <ba-content-top></ba-content-top>
        <router-outlet></router-outlet>
      </div>
    </div>
    <footer class="al-footer clearfix">
      <div class="al-footer-right" translate>{{'general.created_with'}} <i class="ion-heart"></i></div>
      <div class="al-footer-main clearfix">
        <div class="al-copy">&copy; <a href="http://www.kernelinformatica.com.ar" translate>{{'general.akveo'}}</a> 2018</div>
        <ul class="al-share clearfix">
          <li><i class="socicon socicon-facebook"></i></li>
          <li><i class="socicon socicon-twitter"></i></li>
          <li><i class="socicon socicon-google"></i></li>
          <li><i class="socicon socicon-github"></i></li>
        </ul>
      </div>
    </footer>
    <ba-back-top position="200"></ba-back-top>
    `



    /*Sin <ba-page-top> y el sin el <ba-content-top>
     template: `
    <ba-sidebar></ba-sidebar>

    <div class="al-main">
      <div class="al-content">

        <router-outlet></router-outlet>
      </div>
    </div>
    <footer class="al-footer clearfix">

      <div class="al-footer-main clearfix">
        <div class="al-copy">&copy; <a href="http://www.kernelinformatica.com.ar" translate>{{'general.akveo'}}</a> 2018</div>

      </div>
    </footer>
    <ba-back-top position="200"></ba-back-top>
    */


