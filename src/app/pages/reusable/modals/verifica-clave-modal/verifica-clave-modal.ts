import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'verifica-clave-modal',
  templateUrl: './verifica-clave-modal.html',
  styleUrls: ['./verifica-clave-modal.css']
})
export class VerificaClaveModal {
  validatingForm: FormGroup;
  modalHeader: string;
  modalContent: string;
  modalClave: string;
  onClickValidar;
 
  constructor(private activeModal: NgbActiveModal) {
    this.validatingForm = new FormGroup({
      modalFormAvatarPassword: new FormControl('', Validators.required)
    });
  }
  ngOnInit() { }

  get modalFormAvatarPassword() {
    return this.validatingForm.get('modalFormAvatarPassword');
  }
}