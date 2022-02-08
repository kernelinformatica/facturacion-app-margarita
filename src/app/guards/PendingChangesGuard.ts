import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UtilsService } from '../services/utilsService';

export interface ComponentCanDeactivate {
    canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {

    constructor(
        public utilsService: UtilsService
    ) { }

    canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
        if (component.canDeactivate()) {
            return true
        } else {
            return this.utilsService.showModal(
                '¿Desea salir sin guardar?'
            )(
                `Los cambios que implementaste no se van a guardar.`
            )(
                // () => resultado = true
            )(
                {
                    tipoModal: 'confirmation',
                    textos: {
                        afirmativeText: 'Abandonar',
                        negativeText: 'Cancelar'
                    }
                }
            ).then(resp => {
                return resp
            })
        }
        // return component.canDeactivate() ?
        //   true :
    }
}