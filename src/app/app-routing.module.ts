import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { CadastroComponent } from './auth/cadastro/cadastro.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { NoAuthGuard } from './shared/guards/no-auth.guard';
import { HomeComponent } from './home/home.component';
import { ColaboradorListagemComponent } from './colaboradores/colaborador-listagem/colaborador-listagem.component';
import { ColaboradoresComponent } from './colaboradores/colaboradores.component';
import { ProdutoComponent } from './produtos/produto.component';
import { WelcomeCardComponent } from './shared/components/welcome-card/welcome-card.component';
import { MeuPerfilComponent } from './meu-perfil/meu-perfil.component';

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
        path: '',
        component: WelcomeCardComponent,
      },
      {
        path: 'colaboradores',
        component: ColaboradoresComponent,
      },
      {
        path: 'produtos',
        component: ProdutoComponent,
      },
      {
        path: 'meu-perfil',
        component: MeuPerfilComponent,
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
