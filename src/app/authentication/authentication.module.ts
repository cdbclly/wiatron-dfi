import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    AuthenticationRoutingModule,
    TranslateModule
  ],
  declarations: [
    LoginComponent
  ]
})
export class AuthenticationModule { }
