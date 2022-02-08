import { NgModule } from "@angular/core";
import { routing } from './ventas.routing';
import { Ventas } from ".";
import { NgbTabsetModule, NgbProgressbarModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../SharedModule";
import { RecursoService } from "app/services/recursoService";
import { AuthService } from "../../../services/authService";
import { UtilsService } from "../../../services/utilsService";

import { PendingChangesGuard } from "app/guards/PendingChangesGuard";

import { EmisionRemitos } from "./emisionRemitos";
import { EmisionRemitosService } from "./emisionRemitos/emisionRemitosService";
import { TablaEmisionRem } from "app/pages/main/ventas/emisionRemitos/components/tablaEmisionRem/tablaEmisionRem.component";
import { TablaFormaPago } from "app/pages/main/ventas/emisionRemitos/components/tablaFormaPago";
import { ContratosService } from "app/services/contratosService";
import { FilesService } from "app/services/filesService";

@NgModule({
    imports: [
        routing,
        NgbTabsetModule,
        SharedModule,
        NgbProgressbarModule
    ],
    declarations: [
        Ventas,
        TablaEmisionRem,
        TablaFormaPago,
        EmisionRemitos
    ],
    providers: [
        RecursoService,
        AuthService,
        UtilsService,
        EmisionRemitosService,
        ContratosService,
        PendingChangesGuard,
        FilesService
    ],
    exports: [
        TablaEmisionRem,
        TablaFormaPago
    ]
})
export class VentasModule {
}
