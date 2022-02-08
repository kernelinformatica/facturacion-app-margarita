import { Injectable } from "@angular/core";
import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { DateLikePicker } from "../../../models/dateLikePicker";
import { NgbDate } from "../../../../../node_modules/@ng-bootstrap/ng-bootstrap/datepicker/ngb-date";

function padNumber(value: number) {
    if (isNumber(value)) {
        return `0${value}`.slice(-2);
    } else {
        return "";
    }
}

function isNumber(value: any): boolean {
    return !isNaN(toInteger(value));
}

function toInteger(value: any): number {
    return parseInt(`${value}`, 10);
}


@Injectable()
export class NgbDateFRParserFormatter extends NgbDateParserFormatter {
    parse(value: string): NgbDateStruct {
        // debugger;
        if (value) {
            const dateParts = value.trim().split('/');
            if (dateParts.length === 1 && isNumber(dateParts[0])) {
                return new DateLikePicker(null, {year: toInteger(dateParts[0]), month: null, day: null})
                // return {year: toInteger(dateParts[0]), month: null, day: null};
            } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {

                return new DateLikePicker(null, {year: toInteger(dateParts[1]), month: toInteger(dateParts[0]), day: null});
                // return {year: toInteger(dateParts[1]), month: toInteger(dateParts[0]), day: null};
            } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
                return new DateLikePicker(null, {year: toInteger(dateParts[2]), month: toInteger(dateParts[1]), day: toInteger(dateParts[0])});
                // return {year: toInteger(dateParts[2]), month: toInteger(dateParts[1]), day: toInteger(dateParts[0])};
            }
        }   
        return null;
    }

    format(date: NgbDateStruct): string {
        // debugger;
        let stringDate: string = ""; 
        if(date) {
            stringDate += isNumber(date.day) ? padNumber(date.day) + "/" : "";
            stringDate += isNumber(date.month) ? padNumber(date.month) + "/" : "";
            stringDate += date.year;
        } 
        // else {
        //     // Si NO viene ninguna fecha entonces seteo por defecto la fecha de hoy
        //     const todayDate = new Date();
        //     const todayNgbDate = new NgbDate(
        //         todayDate.getFullYear(),
        //         todayDate.getMonth() + 1,
        //         todayDate.getDate()
        //     );

        //     stringDate += isNumber(todayNgbDate.day) ? padNumber(todayNgbDate.day) + "/" : "";
        //     stringDate += isNumber(todayNgbDate.month) ? padNumber(todayNgbDate.month) + "/" : "";
        //     stringDate += todayNgbDate.year;
        // }
        return stringDate;
    }
}
