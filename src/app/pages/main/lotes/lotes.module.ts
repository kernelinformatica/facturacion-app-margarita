import { NgModule } from "@angular/core";
import { routing } from './lotes.routing';
import { Lotes } from ".";
import { NgbTabsetModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../SharedModule";
import { RecursoService } from "app/services/recursoService";
import { AuthService } from "../../../services/authService";
import { UtilsService } from "../../../services/utilsService";

import { ConsultaLotes } from "./consultaLotes";
import { ConsultaLotesService } from "./consultaLotes/consultaLotesService";

@NgModule({
    imports: [
        routing,
        SharedModule,
        NgbTabsetModule
    ],
    declarations: [
        Lotes,
        ConsultaLotes
    ],
    providers: [
        RecursoService,
        AuthService,
        UtilsService,
        ConsultaLotesService
    ],
    exports: []
})
export class LotesModule {
}
