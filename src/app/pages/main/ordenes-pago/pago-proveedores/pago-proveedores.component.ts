import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
    NgbCalendar,
    NgbDateParserFormatter,
    NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import {
    FiltroComprobantePago,
    ItemComprobantePago,
    Moneda,
    TotalesPagoProveedores,
} from "app/models/comprobantes-pago";
import { Padron } from "app/models/padron";
import { PopupListaService } from "app/pages/reusable/otros/popup-lista/popup-lista-service";
import { OrdenesPagoService } from "app/services/ordenes-pago.service";
import { RecursoService } from "app/services/recursoService";
import { UtilsService } from "app/services/utilsService";
import { BehaviorSubject } from "rxjs";
import { ComprobanteCompraService } from "../../compras/comprobanteCompra/comprobanteCompraService";
import { BuscarClienteComponent } from "../buscar-cliente/buscar-cliente.component";

@Component({
    selector: "app-pago-proveedores",
    templateUrl: "./pago-proveedores.component.html",
    styleUrls: ["./pago-proveedores.component.scss"],
})
export class PagoProveedoresComponent implements OnInit {
    @ViewChild(BuscarClienteComponent)
    buscarClienteComponent: BuscarClienteComponent;
    fromDate: NgbDateStruct;
    toDate: NgbDateStruct;
    filters = new FiltroComprobantePago();
    totales = new TotalesPagoProveedores();
    ordenesSeleccionadas: ItemComprobantePago[] = [];
    ordenesPago: Array<ItemComprobantePago> = [];
    selectedFilter: "dolar abierto" | "pesificado" | "todas" = "todas";
    monedas: Moneda[];
    Op;
    selectedPayOrder: "Pesificado" | "Dolar fijo" | "Dolar abierto";

    headTitleList = [
        "Fecha de comprobante",
        "Número",
        "Tipo",
        "Importe Dólar",
        "Tipo de cambio",
        "Importe Pesos",
        "Fecha Vencimiento",
        "Forma de Pago",
        "Total Orden Pago aplicadas dólar",
        "Total Orden Pago aplicadas Pesos",
        "Saldo Pendiente Dólar",
        "Saldo Pendiente Pesos",
    ];

    constructor(
        public ordenesPagoService: OrdenesPagoService,
        public utilsService: UtilsService,
        private router: Router
    ) { }

    ngOnInit() {
        this.obtenerOrdenesGuardadas()
    }

    public obtenerOrdenesGuardadas() {
        this.ordenesPago = JSON.parse(JSON.stringify(this.ordenesPagoService.ordenesDePago))
        if (this.ordenesPago && this.ordenesPago.length > 0) this.setTotalValues()
    }

    getOrdenesPago() {
        this.checkForm();
        console.log(this.filters);

        this.ordenesPagoService
            .buscarComprobantesOrdenesPago(this.filters)
            .then((resp: any) => {
                this.ordenesPago = (resp.arraydatos as Array<ItemComprobantePago>)
                    .filter((item) =>
                        item.cuit === this.ordenesPagoService.proveedorSeleccionado.cuit.toString()
                    );
                this.ordenesPago = this.ordenesPago.sort((a, b) => {
                    let date1 = new Date(a.fechaVence).getTime();
                    let date2 = new Date(b.fechaVence).getTime();
                    if (date1 > date2) return 1;
                    if (date1 < date2) return -1;
                    return 0;
                });
                // this.setDiferentPayOrderTypes(); // solo para testing
                this.setTotalValues();
                this.ordenesPagoService.ordenesDePago = JSON.parse(JSON.stringify(this.ordenesPago))
                if (this.ordenesPago.length === 0) this.utilsService.showModal('Aviso')('No existen comprobantes para este proveedor')()('confirmation');
                console.log(this.ordenesPago);
            })
            .catch((err: any) => this.utilsService.decodeErrorResponse(err));
    }

    setDiferentPayOrderTypes() {
        this.ordenesPago.forEach((itemOp, i) => {

            if (i < 50 && itemOp.idmoneda == 2) itemOp.dolarizadoAlVto = true;

        });
    }
    setDataToShow() { }

    selectFilter(filter) {
        this.selectedFilter = filter;
    }

    checkForm() {
        console.log(this.buscarClienteComponent.proveedorSeleccionado);

        this.filters.padCodigo =
            this.buscarClienteComponent.proveedorSeleccionado.padronCodigo;
        if (this.fromDate && this.toDate) {
            this.filters.fechaDesde = this.utilsService.formatearFecha(
                "yyyy-mm-dd"
            )(this.fromDate);
            this.filters.fechaHasta = this.utilsService.formatearFecha(
                "yyyy-mm-dd"
            )(this.toDate);
        }
    }

    generateOP() {
        console.log("generate op");
        this.ordenesPagoService.ordenesSeleccionadas = JSON.parse(
            JSON.stringify(this.ordenesSeleccionadas)
        );
        this.router.navigate(["/pages/ordenesPagoCompras/generar-op"]);
    }

    selectOrden(event, orden: ItemComprobantePago) {
        if ((event.target as HTMLInputElement).checked) {
            this.ordenesSeleccionadas.push(JSON.parse(JSON.stringify(orden)));
            if (this.ordenesSeleccionadas.length === 1) {
                this.selectedPayOrder = this.getTypeFP(orden)
            }
        } else {
            this.deleteItemFromSelected(orden);
            if (this.ordenesSeleccionadas.length === 0) {
                this.selectedPayOrder = null;
            }
        }
        console.log(this.ordenesSeleccionadas);
    }

    deleteItemFromSelected(orden: ItemComprobantePago) {
        let index: number = this.ordenesSeleccionadas.findIndex(
            (item: ItemComprobantePago) => item.numero == orden.numero
        );
        this.ordenesSeleccionadas.splice(index, 1);
    }

    setTotalValues() {
        this.ordenesPago.forEach((itemOP) => {
            this.totales.importeDolar += itemOP.idmoneda == 1
                ? 0 : itemOP.importeTotal;
            this.totales.importePesos += itemOP.idmoneda == 1
                ? itemOP.importeTotal : 0;
            this.totales.dolarOPAplicadas += itemOP.idmoneda == 1
                ? 0 : (itemOP.importeTotal - itemOP.importePendiente);
            this.totales.pesosOPAplicadas += itemOP.idmoneda == 1
                ? (itemOP.importeTotal - itemOP.importePendiente) : 0;
            this.totales.saldoPesos += itemOP.idmoneda == 1
                ? 0 : itemOP.importePendiente;
            this.totales.saldoDolar += itemOP.idmoneda == 1
                ? itemOP.importePendiente : 0;
        });
        console.log(this.totales);
    }

    getTypeFP(orden: ItemComprobantePago) {
        if (orden.idmoneda == 1) return "Pesificado";
        if (orden.idmoneda == 2 && !orden.dolarizadoAlVto) return "Dolar fijo";
        if (orden.idmoneda == 2 && orden.dolarizadoAlVto) return "Dolar abierto";
    }
}
