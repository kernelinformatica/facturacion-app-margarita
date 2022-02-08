import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { AppTranslationModule } from '../../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../../theme/nga.module';

import { Login } from './login.component';
import { routing }       from './login.routing';
import { LoginService } from '../../../services/loginservice';

import { AuthService } from '../../../services/authService';
import { UtilsService } from '../../../services/utilsService';


@NgModule({
  imports: [
    CommonModule,
    AppTranslationModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing
  ],
  declarations: [
    Login
  ],
  providers: [
    LoginService,
    AuthService,
    UtilsService
  ],
  
})
export class LoginModule {}
