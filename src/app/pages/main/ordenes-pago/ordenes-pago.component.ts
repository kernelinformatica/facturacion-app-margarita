import { Component, OnInit } from '@angular/core';
import { OrdenesPagoService } from 'app/services/ordenes-pago.service';

@Component({
  selector: 'app-ordenes-pago',
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./ordenes-pago.component.scss']
})
export class OrdenesPagoComponent implements OnInit {

  constructor(
    private ordenesPagoService:OrdenesPagoService,
  ) { }

  ngOnInit() {
    this.ordenesPagoService.getCotizacionDolar()
  }

}
