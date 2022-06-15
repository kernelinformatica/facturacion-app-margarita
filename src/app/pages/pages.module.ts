import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './pages.routing';
import { NgaModule } from '../theme/nga.module';
import { AppTranslationModule } from '../app.translation.module';
import { Pages } from './pages.component';
import { DefaultModal } from './reusable/modals/default-modal/default-modal.component';
import { LocalStorageService } from 'app/services/localStorageService';
import { ConfirmationModal } from './reusable/modals/confirmation-modal/confirmation-modal.component';
import { PopupListaService } from 'app/pages/reusable/otros/popup-lista/popup-lista-service';
import { ComprobanteService } from '../services/comprobanteService';
import { UtilsService } from '../services/utilsService';
import { ListPopupService } from './reusable/otros/listFinder/components/listPopup/listPopupService';
import { ImprimirModal } from './reusable/modals/imprimir-modal/imprimir-modal.component';
import { VerificaClaveModal } from './reusable/modals/verifica-clave-modal/verifica-clave-modal';
import { RecursoService } from '../services/recursoService';
import { AuthService } from '../services/authService';
import { OrdenesPagoService } from 'app/services/ordenes-pago.service';




@NgModule({
    imports: [
        CommonModule,
        AppTranslationModule,
        NgaModule,
        routing
    ],
    declarations: [
        Pages,
        DefaultModal,
        ConfirmationModal,
        ImprimirModal,
        VerificaClaveModal
    ],
    entryComponents: [
        DefaultModal,
        ConfirmationModal,
        ImprimirModal,
        VerificaClaveModal
    ],
    providers: [
        LocalStorageService,
        PopupListaService,
        ComprobanteService,
        UtilsService,
        ListPopupService,
        RecursoService,
        AuthService,
        OrdenesPagoService
    ],
    exports: [
    ]
})
export class PagesModule { }
