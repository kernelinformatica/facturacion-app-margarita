import { Component, Input } from '@angular/core';

@Component({
    selector: 'ba-card',
    templateUrl: './baCard.html',
})
export class BaCard {
    @Input() cardTitle: String;
    @Input() baCardClass: String;
    @Input() cardType: String;

    @Input() toggleBtn: Boolean;
    @Input() toggleBtnExtra: Boolean;

    @Input() headerMin: Boolean = false;

    showCard: Boolean = true;

    constructor() {
    }
    
    onToggleCard = () => {
        this.showCard = !this.showCard;
    }
}
