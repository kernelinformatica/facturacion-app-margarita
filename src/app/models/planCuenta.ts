export class PlanCuenta {
    planCuentas: number;
    planDescripcion: string

    constructor(planCuenta?: {
        planCuentas: number;
        planDescripcion: string
    }) {
        if (planCuenta) {
            this.planCuentas = planCuenta.planCuentas;
            this.planDescripcion = planCuenta.planDescripcion
        } else {
            this.planCuentas = null;
            this.planDescripcion = null
        }
    }

}