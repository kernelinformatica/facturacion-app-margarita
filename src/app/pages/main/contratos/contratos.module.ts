import { NgModule } from "@angular/core";
import { routing } from './contratos.routing';
import { Contratos } from ".";
import { NgbTabsetModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../SharedModule";
import { FilesService } from "app/services/filesService";
import { AbmContratos } from "./abmContratos";
import { NuevoContrato } from "./abmContratos/nuevoContrato";
import { RecursoService } from "app/services/recursoService";
import { UtilsService } from "app/services/utilsService";
import { AuthService } from "app/services/authService";
import { EditarContrato } from "./abmContratos/editarContrato";
import { PendingChangesGuard } from "app/guards/PendingChangesGuard";
import { ContratosService } from "app/services/contratosService";
import { RelacionComprobante } from "./relacionComprobante";

@NgModule({
    imports: [
        routing,
        SharedModule,
        NgbTabsetModule
    ],
    declarations: [
        Contratos,
        AbmContratos,
        NuevoContrato,
        EditarContrato,
        RelacionComprobante
    ],
    providers: [
        FilesService,
        RecursoService,
        UtilsService,
        AuthService,
        PendingChangesGuard,
        ContratosService
    ],
    exports: []
})
export class ContratosModule {
}
