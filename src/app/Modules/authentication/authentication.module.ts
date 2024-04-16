import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { MainComponent } from './pages/main/main.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthenticationComponent } from './authentication.component';
import { NgOtpInputModule } from  'ng-otp-input';
import { OtpComponent } from './pages/otp/otp.component';
import { MaterialModule } from 'src/app/Shared Module/material/material.module';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    MainComponent,
    NavbarComponent,
    AuthenticationComponent,
    OtpComponent
  ],
  
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    MaterialModule,
    NgOtpInputModule
    



  ]
})
export class AuthenticationModule { }
