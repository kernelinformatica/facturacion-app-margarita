import { Routes, RouterModule } from '@angular/router';
import { Ventas } from '.';
import { EmisionRemitos } from './emisionRemitos';
import { PendingChangesGuard } from "app/guards/PendingChangesGuard";


// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '',
        component: Ventas,
        children: [
            { path: 'emision-remito', component: EmisionRemitos, canDeactivate: [PendingChangesGuard] },
        ]
    }
];

export const routing = RouterModule.forChild(routes);
