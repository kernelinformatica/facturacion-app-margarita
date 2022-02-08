import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
    CuentaOperador,
    GrabarOrdenesPago,
    GrillaComprobantes,
    GrillaFormaPago,
    GrillaSubTotales,
    ItemComprobantePago,
    TipoOrdenCompra,
    TotalesOrdenesPago,
    UsuarioOperador,
} from "app/models/comprobantes-pago";
import { FormaPago } from "app/models/formaPago";
import { LocalStorageService } from "app/services/localStorageService";
import { OrdenesPagoService } from "app/services/ordenes-pago.service";
import { UtilsService } from "app/services/utilsService";
import { environment } from "environments/environment";

@Component({
    selector: "app-generar-op",
    templateUrl: "./generar-op.component.html",
    styleUrls: ["./generar-op.component.scss"],
})
export class GenerarOpComponent implements OnInit {
    headTitleList = [
        "Fecha fact pend",
        "Proveedor",
        "Cta Cte",
        "N° Documento",
        "Tipo Doc",
        "Importe USD",
        "TC Fact",
        "Pesificado",
        "Vto",
        "Forma de pago",
        "Total Pagos u$s",
        "Total Pagos $",
        "Pendiente u$s",
        "Pendiente $",
        "Su PAGO U$S",
        "Su PAGO $",
        "Fecha pago",
        "TC pago",
        "Dif Cotiz",
        "IVA 21",
        "Total Dif Cot",
    ];
    formasPago: Array<FormaPago> = [];
    formaSeleccionada = "-";
    public ordenesSeleccionadas: Array<ItemComprobantePago> = [];
    total: TotalesOrdenesPago = new TotalesOrdenesPago();
    today = new Date();
    listaGrillaFormaPago: Array<GrillaFormaPago> = [new GrillaFormaPago()];
    retIG: number = 0;
    retIIBB: number = 0;
    numRetencionIIBB: number = 0;
    numRetencionIG: number = 0;

    tiposOrdenCompra: Array<TipoOrdenCompra> = []
    tipoOrdenCompraSeleccionado: number = 85;
    dataOPRequest = new GrabarOrdenesPago(); // con esta data se graba la orden

    operador: UsuarioOperador;
    cuenta: CuentaOperador;

    constructor(
        public ordenesPagoService: OrdenesPagoService,
        private localStorageService: LocalStorageService,
        private utilsService: UtilsService,
        private router: Router,
        private location: Location,
    ) { }

    ngOnInit() {
        if (
            !this.ordenesPagoService.ordenesSeleccionadas ||
            this.ordenesPagoService.ordenesSeleccionadas.length === 0
        ) {
            this.router.navigate(["/pages/ordenesPagoCompras/pago-proveedores"]);
            return;
        }
        if (this.ordenesPagoService.ordenesSeleccionadas) {
            this.ordenesSeleccionadas = JSON.parse(
                JSON.stringify(this.ordenesPagoService.ordenesSeleccionadas)
            );
            this.setTotal();
        }
        this.obtenerFormaPago();
        this.getUserInfo();
        this.obtenerTipoOrdenPago()
        this.obtenerTiposOrdenCompra()
    }

    obtenerTiposOrdenCompra() {
        this.ordenesPagoService.obtenerTiposOrdenCompra()
            .then((resp: any) => {
                this.tiposOrdenCompra = resp.arraydatos;
                console.log('tiposOrdenCompra', this.tiposOrdenCompra);

            })
            .catch(error => console.log(error))
    }

    getUserInfo(): void {
        this.operador = this.localStorageService.getObject(environment.localStorage.perfil);
        this.cuenta = this.localStorageService.getObject(environment.localStorage.cuenta)
    }

    getTypeFP(orden: ItemComprobantePago) {
        if (orden.idmoneda == 1) return "Pesificado";
        if (orden.idmoneda == 2 && !orden.dolarizadoAlVto) return "Dolar fijo";
        if (orden.idmoneda == 2 && orden.dolarizadoAlVto) return "Dolar abierto";
    }

    obtenerTipoOrdenPago(): void {
        this.ordenesPagoService.getTipoOrdenPago()
            .then((resp: any) => {
                console.log('obtenerTipoOrdenPago', resp);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    obtenerFormaPago() {
        this.ordenesPagoService.getFormaPago()
            .then((resp: any) => {
                this.formasPago = resp.arraydatos.filter((resp: FormaPago) =>
                    resp.idFormaPago == 8 ||
                    resp.idFormaPago == 9 ||
                    resp.idFormaPago == 11 ||
                    resp.idFormaPago == 12 ||
                    resp.idFormaPago == 13 ||
                    resp.idFormaPago == 14
                );
            })
            .catch((error) => {
                console.log(error);
            });
    }

    setTotal() {
        this.resetTotal();
        this.ordenesSeleccionadas.forEach((itemOp) => {
            if (!itemOp.importeTotal && itemOp.importeTotal !== 0) {
                itemOp.importeTotal = 0;
            }
            this.total.importeDolar += itemOp.idmoneda == 1
                ? itemOp.importeTotal / itemOp.cotDolar
                : itemOp.importeTotal;
            this.total.importePesificado += itemOp.idmoneda == 1
                ? itemOp.importeTotal : itemOp.importeTotal * itemOp.cotDolar;
            this.total.pendientePesos += itemOp.idmoneda == 1
                ? itemOp.importePendiente : 0;
            this.total.pendienteUsd += itemOp.idmoneda == 1
                ? 0 : itemOp.importePendiente;
            this.total.suPagoPesos += !!itemOp.suPagoPesos
                ? itemOp.suPagoPesos
                : 0;
            this.total.suPagoUsd += !!itemOp.suPagoUsd ? itemOp.suPagoUsd : 0;
            this.total.totalDifCotizacion += this.calcTotDifCot(itemOp);
        });
    }

    resetTotal() {
        this.total = new TotalesOrdenesPago();
    }

    calcDifCot(orden: ItemComprobantePago) {
        if (!orden.suPagoUsd) return 0;
        if (orden.dolarizadoAlVto) {
            let cotizacionDolar =
                this.ordenesPagoService.cotizacionDolar[0].cotizacion -
                orden.cotDolar;
            return cotizacionDolar * orden.suPagoUsd;
        }
        return 0;
    }

    calcTotDifCot(orden) {
        if (!(orden.dolarizadoAlVto) || !orden.suPagoUsd) return 0;
        return this.calcDifCot(orden) + this.calcIva(orden);
    }

    calcIva(orden: ItemComprobantePago) {
        if (!(orden.dolarizadoAlVto) || !orden.suPagoUsd)
            return 0;
        let iva = 0.21;
        return ((this.ordenesPagoService.cotizacionDolar[0].cotizacion - orden.cotDolar) * orden.suPagoUsd * iva);
    }

    generateOP() {
        this.agregarDatosGenerales()
        this.dataOPRequest.grillaFormaPago = JSON.parse(JSON.stringify(this.listaGrillaFormaPago));
        this.agregarGrillaSubtotales();
        this.agregarGrillaComprobantes();
        this.formatearFormaDePago();

        console.log(this.dataOPRequest);


        this.ordenesPagoService.grabaOrdenesDePago(this.dataOPRequest)
            .then((resp: any) => {
                console.log(resp);
                this.ordenesPagoService.ordenesDePago = []
                this.location.back();
                this.utilsService.showModal('Aviso')('Comprobante grabado con exito')()('confirmation')
                this.getPdf(resp.datos.idOpCab)
            })
            .catch(error => console.log(error))
    }

    getPdf(idOpCab: number) {
        this.ordenesPagoService.obtenerPdf({ nroCopias: 1, idOpCab: idOpCab })
            .subscribe(resp => {
                const bodyResp = resp['_body'];

                var newBlob = new Blob([bodyResp], { type: "application/pdf" })

                // IE
                // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                //     window.navigator.msSaveOrOpenBlob(newBlob);
                //     return;
                // }

                const data = window.URL.createObjectURL(newBlob);

                var link = document.createElement('a');
                link.href = data;
                // link.download="fileBody.pdf";
                link.download = `${idOpCab}.pdf`;
                link.click();

                // Firefox
                setTimeout(function () {
                    // For Firefox it is necessary to delay revoking the ObjectURL
                    window.URL.revokeObjectURL(data);
                }, 100);
            })
    }

    agregarDatosGenerales() {
        this.dataOPRequest.codigoPostal = this.operador.sucursal.codigoPostal; this.operador
        this.dataOPRequest.cotDolar = this.ordenesPagoService.cotizacionDolar[0].cotizacion;
        this.dataOPRequest.cuit = this.ordenesSeleccionadas[0].cuit;
        this.dataOPRequest.fechaAutorizacion = "1900-01-01";//  por defecto en 1900-01-01
        this.dataOPRequest.fechaEmision = this.utilsService.formatearFecha('yyyy-mm-dd')(new Date());//  fecha hoy
        this.dataOPRequest.idCteTipo = 85; // es un combo ,por ahora va 85
        this.dataOPRequest.idFactCab = 0; //  mandar en 0 
        this.dataOPRequest.idMoneda = 1; //  mandar en 1 osea en pesos
        this.dataOPRequest.idNumero = this.buscarTipoOrdenCompra()[0].letrasCodigos[0].numeradores[0].idCteNumerador;
        this.dataOPRequest.idPadron = this.ordenesPagoService.proveedorSeleccionado.padronCodigo; // va  id padron 
        this.dataOPRequest.idSisOperacionComprobante = 127; // mandar fijo 127 por ahora
        this.dataOPRequest.idSisTipoOperacion = 14; // va 14
        this.dataOPRequest.idUsuario = this.cuenta.id; //  va el id del usuario que autoriza 
        this.dataOPRequest.nombre = this.ordenesPagoService.proveedorSeleccionado.padronApelli;
        this.dataOPRequest.numero = this.generarNroComprobante();
        this.dataOPRequest.numeroReciboCaja = 0; // va 0
        // booleanos
        this.dataOPRequest.ordenPagoCabecera = true; // mandar todo en true
        this.dataOPRequest.ordenPagoDetalle = true; // mandar todo en true
        this.dataOPRequest.ordenPagoFormaPago = true; // mandar todo en true
        this.dataOPRequest.ordenPagoPie = true; // mandar todo en true
        //----------  ---------
        this.dataOPRequest.pagoCerrado = 0;
    }

    getRandomInt(min = 0, max = 1000) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    generarNroComprobante(): number {
        let found = this.buscarTipoOrdenCompra();

        const numerador = found[0].letrasCodigos[0].numeradores[0];
        let cantidadCeros: string = "";

        for (let index = 0; index < (8 - numerador.numerador.toString().length); index++) {
            cantidadCeros += "0"
        }

        let numeroGenerado: string = numerador.ptoVenta.idPtoVenta + cantidadCeros + numerador.numerador;

        return parseInt(numeroGenerado);
    }

    buscarTipoOrdenCompra() {
        return this.tiposOrdenCompra.filter((tipoOC) =>
            tipoOC.idCteTipo == this.tipoOrdenCompraSeleccionado
        )
    }

    agregarGrillaSubtotales(): void {
        this.dataOPRequest.grillaSubTotales.forEach((subTotal, i) => {
            subTotal.importeBase = this.total.suPagoPesos; // es total comprobantes
            console.log('totales', this.total, this.total.totalDifCotizacion);

            subTotal.alicuota = this.total.totalDifCotizacion;

            if (i == 0) subTotal.detalle = "retIG";
            if (i == 1) subTotal.detalle = "retIIBB";
            if (i == 0) subTotal.importeImpuesto = this.retIG;
            if (i == 1) subTotal.importeImpuesto = this.retIIBB;
            if (i == 0) subTotal.numeroRetencion = this.numRetencionIG;
            if (i == 1) subTotal.numeroRetencion = this.numRetencionIIBB;
            subTotal.operador = this.operador.idPerfil.toString(); //
        })

    }

    agregarGrillaComprobantes(): void {
        this.dataOPRequest.grillaComprobantes = this.ordenesSeleccionadas.map((orden, index) => {
            let grilla = new GrillaComprobantes()
            grilla.cotDolarFact = this.ordenesSeleccionadas[0].dolarizadoAlVto ?
                this.ordenesPagoService.cotizacionDolar[0].cotizacion
                : orden.cotDolar;// en la que es dolar fijo .. es la de la factura.. y la que es dolar libre es la cotizacion actual de la tabla de dolar
            grilla.difContizacion = this.calcDifCot(orden);
            grilla.idDetalle = 0; //probar mandar en 0
            grilla.idFormaPago = this.buscarFormaPago(orden);
            grilla.idIva = 1; //mandar en 1 iva
            grilla.importePesificado = orden.suPagoPesos;
            grilla.item = index; //mandar el orden que se muestra 
            grilla.ivaDifContizacion = this.calcIva(orden);
            grilla.pagadoDolar = orden.suPagoUsd; //su pago usd
            grilla.idFactCabComp = orden.idFactCab;
            return grilla;
        })
    }

    formatearFormaDePago() {
        this.dataOPRequest.grillaFormaPago.forEach(formaPago => {
            formaPago.fechaAcreditacion = this.utilsService.formatearFecha('yyyy-mm-dd')(formaPago.fechaAcreditacion)
        })
    }

    buscarFormaPago(orden: ItemComprobantePago): number {
        return 0;
    }

    onchagePay(event, orden: ItemComprobantePago) {
        const el = (event.target as HTMLInputElement)
        let valueInput = parseFloat(el.value);
        if (valueInput > orden.importePendiente) {
            el.value = orden.importePendiente.toString();
            this.ordenesSeleccionadas.forEach(item => {
                if (item.idFactCab == orden.idFactCab) {
                    orden.idmoneda == 1 ? item.suPagoPesos = orden.importePendiente : item.suPagoUsd = orden.importePendiente
                };
            })
            this.setTotal();
            return this.onchagePay(event, orden)
        }
        if (orden.idmoneda == 1) {
            if (orden.dolarizadoAlVto) {
                orden.suPagoUsd = parseFloat((valueInput / this.ordenesPagoService.cotizacionDolar[0].cotizacion).toFixed(2))
            } else {
                orden.suPagoUsd = parseFloat((valueInput / orden.cotDolar).toFixed(2))
            }
        } else {

            if (orden.dolarizadoAlVto) {
                orden.suPagoPesos = parseFloat((this.ordenesPagoService.cotizacionDolar[0].cotizacion * valueInput).toFixed(2));
            } else {
                orden.suPagoPesos = parseFloat((orden.cotDolar * valueInput).toFixed(2));
            }
        }
        this.setTotal();
    }

    addRow() {
        this.listaGrillaFormaPago.push(new GrillaFormaPago());
    }

    ereaseRow(i: number): void {
        this.listaGrillaFormaPago.splice(i, 1);
    }

    getTotalOP(): number {
        let pagoNeto = this.total.totalDifCotizacion + this.total.suPagoPesos - this.retIG - this.retIIBB;
        let importes = this.listaGrillaFormaPago.reduce((accumulator, currentValue) => accumulator + currentValue.importe, 0);
        let total = Number.parseFloat(importes.toFixed(2)) - Number.parseFloat(pagoNeto.toFixed(2));

        return total;
    }

    validateOP() {
        let found = this.ordenesSeleccionadas.find(orden => orden.suPagoPesos == 0);
        if (found) return true;
        found = this.ordenesSeleccionadas.find(orden => orden.suPagoUsd == 0);
        if (found) return true;
        found = this.ordenesSeleccionadas.find(orden => orden.suPagoPesos == undefined);
        if (found) return true;
        found = this.ordenesSeleccionadas.find(orden => orden.suPagoUsd == undefined);
        if (found) return true;
        let found2 = this.listaGrillaFormaPago.find(lista => (lista.fechaAcreditacion == undefined || lista.fechaAcreditacion == "Invalid date" || lista.fechaAcreditacion == ""));
        if (found2) return true;
        return false
    }

    keyPress(event: KeyboardEvent) {
        const pattern = /[0-9]/;
        const inputChar = String.fromCharCode((event).charCode);

        if (!pattern.test(inputChar)) event.preventDefault();
    }
}
