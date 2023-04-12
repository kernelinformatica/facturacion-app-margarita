import { DatePipe } from "@angular/common";

export class ListaPasajesLogs {
    fechayhora: string;
    dato: string;

    constructor(listaPasajesLogs: {
        fechayhora: Date;
        dato: string;
    }) {

        if (listaPasajesLogs) {
            this.fechayhora = this.formateaFecha(listaPasajesLogs.fechayhora);
            this.dato = listaPasajesLogs.dato;
        } else {
            this.fechayhora = null;
            this.dato = null;
        }
    }

    formateaFecha(fechaHoraStr) {
        let fechaHora: Date = new Date(fechaHoraStr);
        let fechaHoraFormatoStr: string = fechaHora.getDate().toString().padStart(2, "0") + "/" +
            (fechaHora.getMonth() + 1).toString().padStart(2, "0") + "/" +
            fechaHora.getFullYear().toString() + " " +
            fechaHora.getHours().toString().padStart(2, "0") + ":" +
            fechaHora.getMinutes().toString().padStart(2, "0") + ":" +
            fechaHora.getSeconds().toString().padStart(2, "0");
        return fechaHoraFormatoStr;
    }
}