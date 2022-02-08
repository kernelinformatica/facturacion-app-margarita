import { Component, Input, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { UtilsService } from '../../../../services/utilsService';
import { DateLikePicker } from 'app/models/dateLikePicker';

@Component({
    selector: 'date-licker-picker',
    templateUrl: './dateLickePicker.html',
    styleUrls: ['./dateLickePicker.scss']
})
export class DateLickePicker implements AfterViewChecked {
// export class DateLickePicker {
    // Id del likePicker
    @Input() idLikePicker? = 'idLikePicker';
    // Item a bindear
    @Input() itemBinded;
    // ID del elemento que focusea cuando hace blur
    @Input() idFocusBlur;

    @Output() itemChanged = new EventEmitter<string>();

    constructor(public utilsService: UtilsService) { }

    ngAfterViewChecked() {
        if (
            this.itemBinded &&
            !this.itemBinded.day
        ) {
            this.itemBinded = new DateLikePicker(
                this.itemBinded
            );
        }
    }

    public onItemChanged() {
        // debugger;
        this.itemChanged.emit(this.itemBinded);
        // debugger;
    }

    onBlurItem = () => {
        
        this.itemBinded = this.utilsService.stringToDateLikePicker(this.itemBinded)

        this.idFocusBlur && document.getElementById(this.idFocusBlur) ?
            document.getElementById(this.idFocusBlur).focus() : null // En vez de null sería bueno algo como focusNextInput

        this.itemChanged.emit(this.itemBinded);
    }

    onNgModelChange(e) {
        this.itemChanged.emit(e);
    }
}
