import { Component, HostListener } from '@angular/core';

import { LocalStorageService } from '../../../../../../services/localStorageService';
import { Usuario } from '../../../../../../models/usuario';
import { Sucursal } from 'app/models/sucursal';
import { Perfil } from '../../../../../../models/perfil';
import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';
import { isString } from 'util';
import { RecursoService } from '../../../../../../services/recursoService';

// Libreria para encriptar en MD5 la clave
import * as crypto from 'crypto-js';
import { resourcesREST } from 'constantes/resoursesREST';
import { Observable } from 'rxjs/Observable';
import { ListaPrecio } from 'app/models/listaPrecio';
import { PtoVenta } from 'app/models/ptoVenta';

@Component({
    selector: 'nuevo-usuario',
    styleUrls: ['./nuevoUsuario.scss'],
    templateUrl: './nuevoUsuario.html',
})
// export class NuevoUsuario implements PendingChangeComponent {
export class NuevoUsuario {
    sucursales: Observable<Sucursal[]>;
    perfiles: Observable<Perfil[]>;
    recurso: Usuario = new Usuario();
    listasPrecios: Observable<ListaPrecio[]>;
    ptoVentas: Observable<PtoVenta[]>;
    prefijoEmpresa: string;
  
    constructor(
        public utilsService: UtilsService,
        private router: Router,
        private recursoService: RecursoService,
        private localStorageService: LocalStorageService
    ) {
        this.sucursales = recursoService.getRecursoList(resourcesREST.sucursales)();
        this.listasPrecios = this.recursoService.getRecursoList(resourcesREST.listaPrecios)();
        this.ptoVentas = this.recursoService.getRecursoList(resourcesREST.ptoVenta)();
        this.prefijoEmpresa = "12"//this.localStorageService.getObject(environment.localStorage.empresa).prefijoEmpresa;
    }

    ngOnInit() {
        this.recursoService.setEdicionFinalizada(false);
    }

    @HostListener('window:beforeunload')
    canDeactivate = () => 
        this.recursoService.checkIfEquals(this.recurso, new Usuario()) || 
        this.recursoService.getEdicionFinalizada();
    
    /**
     * Se dispara cuando se cambia la sucursal en el dropdown
     * @param event 
     */
    changeSucursal(event) {        
        this.perfiles = this.recursoService.getRecursoList(
            resourcesREST.perfiles
        )({
            sucursal: this.recurso.perfil.sucursal.idSucursal
        });
    }
    
    /**
     * Finaliza la creacion del user
     */
    onClickCrearUsuario = async () => {
        
        try {
            // Creo el usuario nuevo
            const resp: any = await this.recursoService.setRecurso(
                this.recurso
            )({
                clave: crypto.MD5(this.recurso.clave),
                token: this.localStorageService.getObject(environment.localStorage.acceso).token
            });

            // Muestro mensaje de okey y redirecciono a la lista de usuarios
            this.utilsService.showModal(
                resp.control.codigo
            )(
                resp.control.descripcion
            )(
                () => {
                    this.router.navigate(['/pages/tablas/usuarios']);
                    this.recursoService.setEdicionFinalizada(true);
                }
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
        }
    }

    
    compareWithSucursal(item1: Sucursal, item2: Sucursal) {
        return item1.idSucursal === item2.idSucursal;
    }

    compareWithPerfil(item1: Perfil, item2: Perfil) {
        return item1.idPerfil === item2.idPerfil;
    }

    onNgValuePtoVenta = (ptoV) => new Array(ptoV);
}
