import { Routes, RouterModule } from '@angular/router';
import { Comprobantes } from '.';
import { ConsultaComprobante } from './consultaComprobante';
import { ConsultaImputaciones } from './consultaImputaciones';
import { ConsultaLibrosIva } from './consultaLibrosIva';
import { ModificaImputaciones } from './imputaciones';
import { ConsultaComprobanteAnticipado } from './consultaComprobanteAnticipado';
import { Pesificacion } from './pesificacion';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '',
        component: Comprobantes,
        children: [
            { path: 'consulta', component: ConsultaComprobante },
            { path: 'imputaciones', component: ConsultaImputaciones },
            { path: 'libros-iva', component: ConsultaLibrosIva },
            { path: 'modiImputaciones', component: ModificaImputaciones},
            { path: 'consulta-comprobante-anticipado', component: ConsultaComprobanteAnticipado },
            { path: 'proceso-pesificacion', component: Pesificacion }
        ]
    }
];

export const routing = RouterModule.forChild(routes);
