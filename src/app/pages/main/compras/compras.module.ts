import { NgModule } from "@angular/core";
import { routing } from './compras.routing';
import { Compras } from ".";
import { NgbTabsetModule, NgbProgressbarModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../SharedModule";
import { RecursoService } from "app/services/recursoService";
import { AuthService } from "../../../services/authService";
import { UtilsService } from "../../../services/utilsService";
import { TablaIngreso } from "app/pages/main/compras/comprobanteCompra/components/tablaIngreso";
import { ComprobanteCompra } from "app/pages/main/compras/comprobanteCompra";
import { ComprobanteCompraService } from "app/pages/main/compras/comprobanteCompra/comprobanteCompraService";
import { TablaFormaPagoComp } from "app/pages/main/compras/comprobanteCompra/components/tablaFormaPagoComp";
import { EmisionRemitosService } from "../ventas/emisionRemitos/emisionRemitosService";
import { PendingChangesGuard } from "app/guards/PendingChangesGuard";
import { ComprobanteService } from "app/services/comprobanteService";

@NgModule({
    imports: [
        routing,
        NgbTabsetModule,
        NgbProgressbarModule,
        SharedModule
    ],
    declarations: [
        Compras,
        ComprobanteCompra,
        TablaIngreso,
        TablaFormaPagoComp
    ],
    providers: [
        RecursoService,
        AuthService,
        UtilsService,
        ComprobanteCompraService,
        EmisionRemitosService,
        PendingChangesGuard,
        ComprobanteService
    ],
    exports: [
        TablaIngreso,
        TablaFormaPagoComp
    ]
})
export class ComprasModule {
}
