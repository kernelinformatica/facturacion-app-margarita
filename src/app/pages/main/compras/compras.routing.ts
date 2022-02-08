import { Routes, RouterModule } from '@angular/router';
import { Compras } from '.';
import { ComprobanteCompra } from './comprobanteCompra';
import { PendingChangesGuard } from 'app/guards/PendingChangesGuard';


// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '',
        component: Compras,
        children: [
            { path: 'comprobante-compra', component: ComprobanteCompra, canDeactivate: [PendingChangesGuard] }
        ]
    }
];

export const routing = RouterModule.forChild(routes);
