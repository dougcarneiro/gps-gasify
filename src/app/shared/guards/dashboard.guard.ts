import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, of, catchError } from 'rxjs';
import { UserProfileOperationFirebaseService } from '../services/user-profile-operation-firebase/user-profile-operation-firebase.service';
import { getCurrentUserData } from '../../utils/localStorage';
import { MensagemSnackService } from '../services/message/snack.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {

  constructor(
    private userProfileOperationService: UserProfileOperationFirebaseService,
    private router: Router,
    private snackService: MensagemSnackService
  ) { }

  canActivate(): Observable<boolean> {
    const userData = getCurrentUserData();

    if (!userData || !userData.roleId) {
      this.snackService.erro('Acesso negado: usuário não autenticado.');
      this.router.navigate(['/']);
      return of(false);
    }

    return this.userProfileOperationService.pesquisarPorId(userData.roleId).pipe(
      map(userProfileOperation => {
        if (!userProfileOperation) {
          this.snackService.erro('Acesso negado: perfil de usuário não encontrado.');
          this.router.navigate(['/operacao']);
          return false;
        }

        const isOwner = userProfileOperation.function === 'proprietário';
        const isAdmin = userProfileOperation.isAdmin === true;

        if (isOwner || isAdmin) {
          return true;
        } else {
          this.snackService.erro('Acesso negado: apenas administradores e proprietários podem acessar o dashboard.');
          this.router.navigate(['/operacao']);
          return false;
        }
      }),
      catchError(error => {
        console.error('Erro ao verificar permissões do usuário:', error);
        this.snackService.erro('Erro ao verificar permissões. Tente novamente.');
        this.router.navigate(['/operacao']);
        return of(false);
      })
    );
  }
}
