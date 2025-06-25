import { Component } from '@angular/core';
import { AuthRestService } from '../../services/auth-rest/auth-rest.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthFirebaseService } from '../../services/auth-firebase/auth-firebase.service';

@Component({
  selector: 'app-navbar',
  standalone: false,

  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  menuItems = [
    { name: 'Home', icon: 'home', route: '' },
    { name: 'Operação', icon: '', route: '/operacao' },
    { name: 'Colaboradores', icon: '', route: '/colaboradores' },
    { name: 'Produtos', icon: '', route: '/produtos' },
    { name: 'Meu Perfil', icon: '', route: '/meu-perfil' },
  ];

  constructor(
    private authService: AuthFirebaseService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'menuIcon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('gas-station.svg')
    );
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }
}
