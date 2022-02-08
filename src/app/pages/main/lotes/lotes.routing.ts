import { Routes, RouterModule } from '@angular/router';
import { Lotes } from '.';
import { ConsultaLotes } from './consultaLotes';



// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '',
        component: Lotes,
        children: [
            { path: 'consulta', component: ConsultaLotes },
        ]
    }
];

export const routing = RouterModule.forChild(routes);
