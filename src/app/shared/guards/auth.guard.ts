import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      this.router.navigate(['/sign-in']);
      return false;
    }
    return true;
  }
}
