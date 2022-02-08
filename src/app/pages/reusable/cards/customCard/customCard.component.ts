import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'custom-card',
    templateUrl: './customCard.html',
    styleUrls: ['./customCard.scss']
})
export class CustomCard {
    @Input() title;
}
