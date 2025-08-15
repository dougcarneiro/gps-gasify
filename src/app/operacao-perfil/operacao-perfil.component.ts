import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OperacaoPerfil } from '../shared/types/OperacaoPerfil';
import { OperacaoService } from '../shared/services/operacao/operacao.service';
import { Operation } from '../shared/model/Operation';
import { UserProfileOperationFirebaseService } from '../shared/services/user-profile-operation-firebase/user-profile-operation-firebase.service';
import { getCurrentUserData } from '../utils/localStorage';

@Component({
  selector: 'app-operacao-perfil',
  templateUrl: './operacao-perfil.component.html',
  styleUrls: ['./operacao-perfil.component.css'],
  standalone: false,
})
export class OperacaoPerfilComponent implements OnInit {

  perfil: OperacaoPerfil | undefined;
  isLoading: boolean = false;
  isAdminOrOwner: boolean = false;

  qtdProdutos: number | undefined;
  qtdColaboradores: number | undefined;
  ownerData: { nome: string, email: string } | undefined;
  operationData: Operation | undefined;

  constructor(
    private operacaoService: OperacaoService,
    private userProfileOperationService: UserProfileOperationFirebaseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarPerfil();
    this.verificarPermissaoAdmin();
  }

  carregarPerfil() {
    this.isLoading = true;

    this.operacaoService.carregarPerfil().subscribe(perfil => {
      this.perfil = perfil;
      this.isLoading = false;
    });
  }

  verificarPermissaoAdmin() {
    const userData = getCurrentUserData();
    if (userData && userData.roleId) {
      this.userProfileOperationService.pesquisarPorId(userData.roleId).subscribe({
        next: (userProfileOperation) => {
          if (userProfileOperation) {
            const isOwner = userProfileOperation.function === 'proprietário';
            const isAdmin = userProfileOperation.isAdmin === true;
            this.isAdminOrOwner = isOwner || isAdmin;
          } else {
            this.isAdminOrOwner = false;
          }
        },
        error: (error) => {
          console.error('Erro ao verificar permissões:', error);
          this.isAdminOrOwner = false;
        }
      });
    }
  }

  navegarParaDashboard() {
    this.router.navigate(['/operacao/dashboard']);
  }
}
