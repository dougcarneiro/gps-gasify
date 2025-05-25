import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { CadastroComponent } from './auth/cadastro/cadastro.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { NoAuthGuard } from './shared/guards/no-auth.guard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'sign-in',
    component: LoginComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'sign-up',
    component: CadastroComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
