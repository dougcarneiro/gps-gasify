import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MensagemSnackService } from './shared/services/message/snack.service';
import { AuthModule } from './auth/auth.module';
import { MaterialModule } from './shared/modules/material.module';
import { LogoModule } from './shared/components/logo/logo.module';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DialogModule } from './shared/components/dialog/dialog.module';
import { FirebaseModule } from './firestore/firestore.module';
import { IAuthService } from './interfaces/auth-service.interface';
import { AuthFirebaseService } from './shared/services/auth-firebase/auth-firebase.service';
import { SidenavModule } from './shared/components/sidenav/sidenav.module';
import { HomeModule } from './home/home.module';
import { ColaboradoresModule } from './colaboradores/colaboradores.module';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AuthModule,
    MaterialModule,
    LogoModule,
    FormsModule,
    DialogModule,
    FirebaseModule,
    HomeModule,
    SidenavModule,
    ColaboradoresModule,
  ],
  providers: [
    provideHttpClient(),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    MensagemSnackService,
    {
      provide: IAuthService,
      useClass: AuthFirebaseService
    }
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule { }
