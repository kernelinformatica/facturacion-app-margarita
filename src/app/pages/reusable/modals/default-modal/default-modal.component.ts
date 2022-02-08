import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'add-service-modal',
    styleUrls: [('./default-modal.component.scss')],
    templateUrl: './default-modal.component.html'
})

/**
 * COMPONENTE REUTILIZABLE
 * Este modal es el por defecto que se va a usar en todo el proyecto.
 * Ejemplo de uso:
 *   showModalError(): void {
 *       const activeModal = this.modalService.open(DefaultModal, { size: 'sm' });
 *       activeModal.componentInstance.modalHeader = 'Error';
 *       activeModal.componentInstance.modalContent = 'Usuario o contraseña incorrecto';
 *       activeModal.componentInstance.buttonText = 'Okey';
 *   }
 */
export class DefaultModal implements OnInit {

    modalHeader: string;
    modalContent: string;
    buttonText: string = 'Aceptar';

    isInnerHTML = false;

    constructor(private activeModal: NgbActiveModal) {
    }

    ngOnInit() { }

    closeModal() {
        this.activeModal.close(true);
    }
}
