import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');

    if (token || userId) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
