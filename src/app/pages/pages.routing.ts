import { Routes, RouterModule } from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
    {
        path: 'login',
        loadChildren: 'app/pages/main/login/login.module#LoginModule'
    },

    {
        path: 'register',
        loadChildren: 'app/pages/main/register/register.module#RegisterModule'
    },
    {
        path: 'pages',
        component: Pages,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', loadChildren: './main/dashboard/dashboard.module#DashboardModule' },
            { path: 'tablas', loadChildren: './main/tablas/tablas.module#TablasModule' },
            { path: 'ventas', loadChildren: './main/ventas/ventas.module#VentasModule' },
            { path: 'compras', loadChildren: './main/compras/compras.module#ComprasModule' },
            { path: 'stock', loadChildren: './main/stock/stock.module#StockModule' },
            { path: 'comprobantes', loadChildren: './main/comprobantes/comprobantes.module#ComprobantesModule' },
            { path: 'lotes', loadChildren: './main/lotes/lotes.module#LotesModule' },
            { path: 'contratos', loadChildren: './main/contratos/contratos.module#ContratosModule' },
            { path: 'ordenesPagoCompras', loadChildren: './main/ordenes-pago/ordenes-pago.module#OrdenesPagoModule' },

            // Paginas de ejemplos para desarrollo
            // { path: 'editors', loadChildren: './examples/editors/editors.module#EditorsModule' },
            // { path: 'components', loadChildren: './examples/components/components.module#ComponentsModule' },
            // { path: 'charts', loadChildren: './examples/charts/charts.module#ChartsModule' },
            // { path: 'ui', loadChildren: './examples/ui/ui.module#UiModule' },
            // { path: 'forms', loadChildren: './examples/forms/forms.module#FormsModule' },
            // { path: 'tables', loadChildren: './examples/tables/tables.module#TablesModule' },
            // { path: 'maps', loadChildren: './examples/maps/maps.module#MapsModule' }
        ]
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
