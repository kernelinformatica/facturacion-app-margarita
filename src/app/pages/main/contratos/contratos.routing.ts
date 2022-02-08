import { Routes, RouterModule } from '@angular/router';
import { Contratos } from '.';
import { AbmContratos } from './abmContratos';
import { NuevoContrato } from './abmContratos/nuevoContrato';
import { EditarContrato } from './abmContratos/editarContrato';
import { PendingChangesGuard } from 'app/guards/PendingChangesGuard';
import { RelacionComprobante } from './relacionComprobante';


// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '',
        component: Contratos,
        children: [
            { path: 'abm', component: AbmContratos },
            { path: 'abm/nuevo', component: NuevoContrato },
            { path: 'abm/editar/:idContratos', component: EditarContrato, canDeactivate: [PendingChangesGuard] },
            { path: 'relacion-comprobante', component: RelacionComprobante },
        ]
    }
];

export const routing = RouterModule.forChild(routes);
