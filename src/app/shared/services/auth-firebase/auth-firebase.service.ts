import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Login } from '../../types/Login';
import { removeUserData } from '../../../utils/localStorage';
import { from, map, Observable } from 'rxjs';
import { IAuthService } from '../../../interfaces/auth-service.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseService implements IAuthService {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  login(email: string, password: string): Observable<Login> {
    return from(
      this.afAuth.signInWithEmailAndPassword(email, password)
    ).pipe(
      map(userCredential => {
        const user = userCredential.user;
        if (!user) {
          throw new Error('Usuário não encontrado');
        }
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
