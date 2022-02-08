import { Component, OnInit } from '@angular/core';
import { resourcesREST } from 'constantes/resoursesREST';
import gruposParametros from 'constantes/gruposParametros';
import * as _ from 'lodash';
import { ComprobanteCompraService } from '../../compras/comprobanteCompra/comprobanteCompraService';
import { PopupListaService } from 'app/pages/reusable/otros/popup-lista/popup-lista-service';
import { RecursoService } from 'app/services/recursoService';
import { Padron } from 'app/models/padron';
import { BehaviorSubject } from 'rxjs';
import { UtilsService } from 'app/services/utilsService';
import { Router } from '@angular/router';
import { OrdenesPagoService } from 'app/services/ordenes-pago.service';
@Component({
  selector: 'app-buscar-cliente',
  templateUrl: './buscar-cliente.component.html',
  styleUrls: ['./buscar-cliente.component.scss']
})
export class BuscarClienteComponent implements OnInit {
  proveedores: {
    filtrados: BehaviorSubject<Padron[]>;
  } = {
      filtrados: new BehaviorSubject([])
    }
  proveedorSeleccionado: Padron = new Padron();
  proveedorEnfocadoIndex: number = -1;
  constructor(
    public comprobanteCompraService: ComprobanteCompraService,
    private popupListaService: PopupListaService,
    private recursoService: RecursoService,
    public utilsService: UtilsService,
    private router: Router,
    public ordenesPagoService: OrdenesPagoService,

  ) { }

  ngOnInit() {
  }

  onBlurInputProv = (e) => {
    try {
      if (this.proveedorSeleccionado && this.proveedorSeleccionado.padronCodigo) {
        this.proveedorSeleccionado = this.proveedores.filtrados.value.find(
          prov => prov.padronCodigo === Number(this.proveedorSeleccionado.padronCodigo)
        );

        this.ordenesPagoService.proveedorSeleccionado = JSON.parse(JSON.stringify(this.proveedorSeleccionado))
        console.log('proveedor en service', this.ordenesPagoService.proveedorSeleccionado);
      }
      this.proveedores.filtrados.next([]);
    }
    catch (err) {
      if (err && err.nombre && err.descripcion) {
        this.utilsService.showModal(err.nombre)(err.descripcion)()();
      }
      this.proveedorSeleccionado = new Padron();
    }

  }
  onChangeInputProveedor = (busqueda) => {
    this.proveedorSeleccionado = new Padron();

    if (busqueda && busqueda.length >= 2) {
      this.findProveedores(busqueda)
    }

    this.proveedorEnfocadoIndex = -1;
  }
  onEnterInputProv = (e: any) => {
    e.preventDefault();
    this.proveedores.filtrados.subscribe(provsLista => {
      const provSelect = provsLista && provsLista.length ? provsLista[this.proveedorEnfocadoIndex] : null;
      provSelect ? this.popupLista.onClickListProv(provSelect) : null;
      this.proveedorEnfocadoIndex = -1;
    })
  }
  keyPressInputTexto = (e: any) => (upOrDown) => {
    e.preventDefault();
    this.proveedorEnfocadoIndex =
      this.popupListaService.keyPressInputForPopup(upOrDown)(this.proveedores.filtrados.value)(this.proveedorEnfocadoIndex)
  }

  buscandoProveedor = false;

  findProveedores = _.throttle(
    (busqueda) => {

      this.buscandoProveedor = true;
      this.proveedores.filtrados.next([]);
      this.recursoService.getRecursoList(resourcesREST.padron)({
        grupo: gruposParametros.proveedor,
        elementos: busqueda
      }).subscribe(proveedores => {
        this.proveedores.filtrados.next(proveedores);
        this.buscandoProveedor = false;
      })
    },
    400
  )

  popupLista: any = {
    onClickListProv: (prove: Padron) => {
      this.proveedorSeleccionado = new Padron({ ...prove });
      document.getElementById('tipoOperacionSelect') ? document.getElementById('tipoOperacionSelect').focus() : null;
    },
    getOffsetOfInputProveedor: () => this.utilsService.getOffset(document.getElementById('inputProveedor'))
  }
}
