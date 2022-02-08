import { PlanCuenta } from "app/models/planCuenta";
import { DateLikePicker } from "./dateLikePicker";

export class DetalleFormaPago {
    idFormaPagoDet: number;
    cantDias: number;
    porcentaje: number;
    detalle: string;
    monto: number;
    observaciones: string;

    formaPagoDescrip: string;

    planCuenta: PlanCuenta;

    // No está en el modelo, pero lo calculo acá y lo mando
    fechaPago: DateLikePicker;

    constructor(detalleFormaPago?: {
        idFormaPagoDet: number;
        cantDias: number;
        porcentaje: number;
        detalle: string;

        planCuenta: any;
    }) {
        if (detalleFormaPago) {
            this.idFormaPagoDet = detalleFormaPago.idFormaPagoDet;
            this.cantDias = detalleFormaPago.cantDias;
            this.porcentaje = detalleFormaPago.porcentaje;
            this.detalle = detalleFormaPago.detalle

            this.monto = 0;
            this.observaciones = '';
            this.formaPagoDescrip = '';

            this.planCuenta = new PlanCuenta(detalleFormaPago.planCuenta);

            this.fechaPago = null;
        } else {
            this.idFormaPagoDet = null;
            this.cantDias = null;
            this.porcentaje = null;
            this.detalle = null
            this.monto = null;
            this.observaciones = null;
            this.formaPagoDescrip = null;

            this.planCuenta = new PlanCuenta();

            this.fechaPago = null;
        }
    }
}
