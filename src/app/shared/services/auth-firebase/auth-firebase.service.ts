import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Login } from '../../types/Login';
import { removeUserData } from '../../../utils/localStorage';
import { from, map, Observable, switchMap } from 'rxjs';
import { IAuthService } from '../../../interfaces/auth-service.interface';
import { UserProfileOperationFirebaseService } from '../user-profile-operation-firebase/user-profile-operation-firebase.service';
import { UserProfileOperation } from '../../model/UserProfileOperation';


@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseService implements IAuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private userProfileOperationService: UserProfileOperationFirebaseService,
  ) {}

  login(email: string, password: string, code: string): Observable<Login> {
    return from(
      this.afAuth.signInWithEmailAndPassword(email, password)
    ).pipe(
      switchMap(userCredential => {
        const user = userCredential.user;
        if (!user) {
          throw new Error('Usuário não encontrado');
        }

        // Busca a relação do usuário com a operação
        return this.userProfileOperationService.buscarPorEmailEOperacao(email, code).pipe(
          map(operationProfile => {
            if (!operationProfile) {
              throw new Error('Operação não encontrada para o usuário ou código de acesso inválido');
            }

            return {
              accessToken: user.refreshToken,
              user: {
                id: user.uid,
                email: user.email || "",
              },
              operationId: operationProfile.operationId,
              role: operationProfile.function,
              roleId: operationProfile.id,
            } as Login;
          })
        );
      })
    )
  }

  register(name: string, email: string, password: string): Observable<Login> {
    return from(
      this.afAuth.createUserWithEmailAndPassword(email, password)
    ).pipe(
      map(userCredential => {
        const user = userCredential.user;
        if (!user) {
          throw new Error('Falha na criação do usuário');
        }
        user.updateProfile({ displayName: name });

        return {
          accessToken: user.refreshToken,
          user: {
            id: user.uid,
            email: user.email || "",
          }
        } as Login;
      })
    );
  }

  logout(): Promise<void> {
    return this.afAuth.signOut().then(() => {
      removeUserData();
      this.router.navigate(['/sign-in']);
    });
  }

  isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }
}
