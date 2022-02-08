import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UtilsService } from '../../../../services/utilsService';

@Component({
    selector: 'sexi-list',
    templateUrl: './sexiList.html',
    styleUrls: ['./sexiList.scss']
})
export class SexiList {
    @Input() title;
    // @Input() innerClass;
    @Input() items = [];
    @Input() onCondition;
    @Input() onClickEvent;
    @Input() keysToShow = [];

    constructor() { }

    /**
     * Arma la descripción del item
     */
    getDescripcion = (item) => 
        this.keysToShow
            .map(key => item[key])
            .join(', ');

    // getCustomClass = () =>
    //     this.innerClass ? `sexi-list ${this.innerClass}` : 'sexi-list'
}
