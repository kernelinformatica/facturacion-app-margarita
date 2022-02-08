import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdenesPagoRoutingModule } from './ordenes-pago-routing.module';
import { OrdenesPagoComponent } from './ordenes-pago.component';
import { PagoProveedoresComponent } from './pago-proveedores/pago-proveedores.component';
import { GenerarOpComponent } from './generar-op/generar-op.component';
import { ListaOpComponent } from './lista-op/lista-op.component';
import { NgbDropdownModule, NgbModule, NgbProgressbarModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../SharedModule';
import { NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap/dropdown/dropdown';
import { ComprobanteCompraService } from '../compras/comprobanteCompra/comprobanteCompraService';
import { BuscarClienteComponent } from './buscar-cliente/buscar-cliente.component';

@NgModule({
  imports: [
    CommonModule,
    OrdenesPagoRoutingModule,
    NgbTabsetModule,
    NgbProgressbarModule,
    SharedModule,
    NgbDropdownModule,
  ],
  declarations: [OrdenesPagoComponent, PagoProveedoresComponent, GenerarOpComponent, ListaOpComponent, BuscarClienteComponent],
  providers:[
    ComprobanteCompraService,

  ]
})
export class OrdenesPagoModule { }
