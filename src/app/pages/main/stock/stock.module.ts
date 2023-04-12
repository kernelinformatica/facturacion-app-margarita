import { NgModule } from "@angular/core";
import { routing } from './stock.routing';
import { Stock } from ".";

import { SharedModule } from "../SharedModule";
import { Productos } from "./productos";
import { NuevoProducto } from "app/pages/main/stock/productos/components/nuevoProducto";
import { EditarProducto } from "app/pages/main/stock/productos/components/editarProducto";
import { RecursoService } from "../../../services/recursoService";
import { AuthService } from "../../../services/authService";
import { UtilsService } from "../../../services/utilsService";
import { TablaProductos } from "./productos/components/tablaProductos";
import { ConsultaPorProducto } from "./consultaPorProducto";
import { ConsultaPorProductoService } from "./consultaPorProducto/consultaPorProductoService";
import { ConsultaGeneralService } from "./consultaGeneral/consultaGeneralService";
import { ConsultaGeneral } from "./consultaGeneral";
import { PendingChangesGuard } from "app/guards/PendingChangesGuard";
import { RemitosInternos } from "./remitosInternos";
import { NgbTabsetModule } from "@ng-bootstrap/ng-bootstrap";
import { ComprobanteService } from "app/services/comprobanteService";
import { TablaRemitosInternos } from "./remitosInternos/components/tablaRemitosInternos";
import { RemitosInternosService } from "./remitosInternos/remitosInternosService";
import { TablaRemitosInternosTraza } from "./remitosInternos/components/tablaRemitosInternosTraza";
import { PosicionStockGral } from './posicionStockGral';
import { PosicionStock } from "./posicionStock";
import { PasajesLogsService } from "./pasajesLogs/pasajesLogsService";
import { PasajesLogs } from "./pasajesLogs";

@NgModule({
    imports: [
        routing,
        SharedModule,
        NgbTabsetModule
    ],
    declarations: [
        Stock,
        Productos,
        NuevoProducto,
        EditarProducto,
        TablaProductos,
        ConsultaPorProducto,
        ConsultaGeneral,
        RemitosInternos,
        PasajesLogs,
        TablaRemitosInternos,
        TablaRemitosInternosTraza,
        PosicionStockGral,
        PosicionStock
    ],
    providers: [
        RecursoService,
        AuthService,
        UtilsService,
        ConsultaPorProductoService,
        ConsultaGeneralService,
        PendingChangesGuard,
        ComprobanteService,
        TablaRemitosInternos,
        RemitosInternosService,
        TablaRemitosInternosTraza,
        PasajesLogsService
    ],
    exports: [
        TablaProductos
    ]
})
export class StockModule {
}
