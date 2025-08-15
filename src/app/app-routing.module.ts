import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { CadastroComponent } from './auth/cadastro/cadastro.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { NoAuthGuard } from './shared/guards/no-auth.guard';
import { DashboardGuard } from './shared/guards/dashboard.guard';
import { HomeComponent } from './home/home.component';
import { ColaboradorListagemComponent } from './colaboradores/colaborador-listagem/colaborador-listagem.component';
import { ColaboradoresComponent } from './colaboradores/colaboradores.component';
import { ProdutoComponent } from './produtos/produto.component';
import { WelcomeCardComponent } from './shared/components/welcome-card/welcome-card.component';
import { MeuPerfilComponent } from './meu-perfil/meu-perfil.component';
import { OperacaoPerfilComponent } from './operacao-perfil/operacao-perfil.component';
import { CaixaComponent } from './caixas/caixa.component';
import { VendasComponent } from './vendas/vendas.component';
import { DashboardVendasComponent } from './dashboard/vendas/dashboard-vendas.component';

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
      },
      {
        path: 'operacao',
        component: OperacaoPerfilComponent,
      },
      {
        path: 'operacao/dashboard',
        component: DashboardVendasComponent,
        canActivate: [DashboardGuard],
      },
      {
        path: 'caixa',
        component: CaixaComponent,
      },
      {
        path: 'vendas',
        component: VendasComponent,
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
