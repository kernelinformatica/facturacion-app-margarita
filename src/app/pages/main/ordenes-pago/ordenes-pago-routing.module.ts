import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenerarOpComponent } from './generar-op/generar-op.component';
import { ListaOpComponent } from './lista-op/lista-op.component';
import { OrdenesPagoComponent } from './ordenes-pago.component';
import { PagoProveedoresComponent } from './pago-proveedores/pago-proveedores.component';

const routes: Routes = [
  {
    path: '',
    component: OrdenesPagoComponent,
    children: [
      { path: 'pago-proveedores', component: PagoProveedoresComponent},
      { path: 'generar-op', component: GenerarOpComponent},
      { path: 'listar-ordenes-pago', component: ListaOpComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdenesPagoRoutingModule { }
