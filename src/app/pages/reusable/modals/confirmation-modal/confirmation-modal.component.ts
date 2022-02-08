import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'confirmation-modal',
    styleUrls: [('./confirmation-modal.component.scss')],
    templateUrl: './confirmation-modal.component.html'
})

export class ConfirmationModal implements OnInit {

    modalHeader: string;
    modalContent: string;

    afirmativeText = null;
    negativeText = null;

    isInnerHTML = false;

    constructor(private activeModal: NgbActiveModal) {
    }

    ngOnInit() { }

    closeModal(resultado) {
        this.activeModal.close(resultado);
    }
}
