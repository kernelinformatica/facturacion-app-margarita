import { ElementRef } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FiltroOrdenPago, ItemComprobantePago, ItemListOrdenPago } from 'app/models/comprobantes-pago';
import { OrdenesPagoService } from 'app/services/ordenes-pago.service';
import { UtilsService } from 'app/services/utilsService';
import { BuscarClienteComponent } from '../buscar-cliente/buscar-cliente.component';
import { PagoProveedoresComponent } from '../pago-proveedores/pago-proveedores.component';

@Component({
  selector: 'app-lista-op',
  templateUrl: './lista-op.component.html',
  styleUrls: ['./lista-op.component.scss']
})
export class ListaOpComponent implements OnInit {
  @ViewChild(BuscarClienteComponent) buscarClienteComponent: BuscarClienteComponent

  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  listaOP: ItemListOrdenPago[] = [];
  filters: FiltroOrdenPago = {
    idEmpresa: 2,
    idFacCab: 1760,
    idPadron: null,
    fechaDesde: '2020-01-01',
    fechaHasta: '2021-05-10'
  }

  totales: {
    totalComprobante: number,
    totalDifCot: number,
    totalIvaDifCot: number,
    totalSubtotalOP: number,
    totalImpuestos: number,
    totalOrdenesPago: number
  } = {
      totalComprobante: 0,
      totalDifCot: 0,
      totalIvaDifCot: 0,
      totalSubtotalOP: 0,
      totalImpuestos: 0,
      totalOrdenesPago: 0
    }
  headTitleList = ["Comprobante Fecha", "Número OP", "Total Comprobante", "Total Dif cotización", "Iva por Dif Cotiz", "Subtotal OP", "Total Impuestos", "Total Orden Pago"]
  public ordenesSeleccionadas: Array<ItemListOrdenPago> = [];

  constructor(
    public ordenesPagoService: OrdenesPagoService,
    public utilsService: UtilsService,
    private elementRef: ElementRef,
  ) { }

  ngOnInit() {
  }

  getListOrdenesPago() {
    this.checkForm()
    console.log(this.filters);

    this.ordenesPagoService.buscarOrdenesPago(this.filters)
      .then((resp: any) => {
        this.listaOP = resp.arraydatos;
        this.setTotals()
        console.log(this.listaOP);
      })
      .catch((err: any) => this.utilsService.decodeErrorResponse(err))
  }

  viewOP() {

  }

  emitOP() {
    this.ordenesSeleccionadas.forEach((orden) => {
      this.ordenesPagoService.obtenerPdf({ idOpCab: orden.idOPCab, nroCopias: 1 })
        .subscribe((resp: any) => {
          const bodyResp = resp['_body'];

          var newBlob = new Blob([bodyResp], { type: "application/pdf" })

          // IE
          // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          //   window.navigator.msSaveOrOpenBlob(newBlob);
          //   return;
          // }

          const data = window.URL.createObjectURL(newBlob);

          var link = document.createElement('a');
          link.href = data;
          link.download = `${orden.numero}.pdf`;
          link.click();

          // Firefox
          setTimeout(function () {
            // For Firefox it is necessary to delay revoking the ObjectURL
            window.URL.revokeObjectURL(data);
          }, 100);
        })
    })
  }


  checkForm() {
    this.filters.idPadron = this.buscarClienteComponent.proveedorSeleccionado.padronCodigo ? this.buscarClienteComponent.proveedorSeleccionado.padronCodigo : 0;
    this.filters.fechaDesde = this.utilsService.formatearFecha('yyyy-mm-dd')(this.fromDate)
    this.filters.fechaHasta = this.utilsService.formatearFecha('yyyy-mm-dd')(this.toDate)
  }

  cancelOP() {
    this.ordenesSeleccionadas.forEach((orden: ItemListOrdenPago) => {
      this.ordenesPagoService.borrarComprobanteOrdenPago(orden.idOPCab)
        .then((resp) => {
          console.log(resp);
          this.utilsService.showModal('Aviso')('Comprobante anulado con exito')()('confirmation')
          this.getListOrdenesPago()
        })
        .catch(error => console.log(error))
    })
    this.ordenesPagoService.ordenesDePago = [];
  }


  selectOrden(event, orden: ItemListOrdenPago) {
    if ((event.target as HTMLInputElement).checked) {
      this.ordenesSeleccionadas.push(JSON.parse(JSON.stringify(orden)));
    } else {
      this.deleteItemFromSelected(orden);
    }
  }

  deleteItemFromSelected(orden: ItemListOrdenPago) {
    let index: number = this.ordenesSeleccionadas.findIndex(
      (item: ItemListOrdenPago) => item.numero == orden.numero
    );
    this.ordenesSeleccionadas.splice(index, 1);
  }

  getTotalOP(itemOP: ItemListOrdenPago) {
    let sum = 0;
    itemOP.formaPago.forEach(orden => sum += orden.importe)
    return sum;
  }

  getTotalDifCot(itemOP: ItemListOrdenPago) {
    let sum = 0;
    itemOP.detalle.forEach(detalle => sum += detalle.difCotizacion)
    return sum;
  }

  getTotalComprobante(itemOP: ItemListOrdenPago) {
    let sum = 0;
    itemOP.detalle.forEach(detalle => sum += detalle.importePesificado)
    return sum;
  }

  getTotalIva(itemOP: ItemListOrdenPago) {
    let iva = 0.21;
    return this.getTotalDifCot(itemOP) * iva;
  }

  resetTotales() {
    this.totales.totalComprobante = 0;
    this.totales.totalDifCot = 0;
    this.totales.totalIvaDifCot = 0;
    this.totales.totalSubtotalOP = 0;
    this.totales.totalImpuestos = 0;
    this.totales.totalOrdenesPago = 0;
  }

  setTotals() {
    this.resetTotales();
    this.listaOP.forEach(itemOP => {
      this.totales.totalComprobante += this.getTotalComprobante(itemOP);
      this.totales.totalDifCot += this.getTotalDifCot(itemOP);
      this.totales.totalIvaDifCot += this.getTotalIva(itemOP);
      this.totales.totalSubtotalOP += itemOP.pie[0].importeBase;
      this.totales.totalImpuestos += (itemOP.pie[0].importeImpuesto + itemOP.pie[1].importeImpuesto);
      this.totales.totalOrdenesPago += this.getTotalOP(itemOP);
    })
  }
}
