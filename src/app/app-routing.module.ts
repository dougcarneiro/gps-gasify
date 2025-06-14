import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { CadastroComponent } from './auth/cadastro/cadastro.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { NoAuthGuard } from './shared/guards/no-auth.guard';
import { HomeComponent } from './home/home.component';
import { ColaboradorListagemComponent } from './colaboradores/colaborador-listagem/colaborador-listagem.component';
import { ColaboradoresComponent } from './colaboradores/colaboradores.component';

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
    children: [
      {
        path: 'colaboradores', // Esta rota será acessível como /colaboradores
        component: ColaboradoresComponent,
        // O AuthGuard é herdado da rota pai '' (HomeComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' } // Rota curinga
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
