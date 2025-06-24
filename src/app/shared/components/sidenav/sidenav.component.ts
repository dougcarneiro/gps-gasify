import { Component } from '@angular/core';
import { AuthFirebaseService } from '../../services/auth-firebase/auth-firebase.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-sidenav',
  standalone: false,

  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent {
  menuItems = [
    { name: 'Caixa', icon: 'point_of_sale', route: '/caixa' },
    { name: 'Produtos', icon: 'inventory_2', route: '/produtos' },
    { name: 'Colaboradores', icon: 'people', route: '/colaboradores' },
    { name: 'Minha Operação', icon: 'storefront', route: '/minha-operacao' },
    { name: 'Meu Perfil', icon: 'person', route: '/meu-perfil' }
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
    this.authService.logout()
  }
}
