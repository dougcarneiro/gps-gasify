import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-panels',
  standalone: false,
  templateUrl: './dashboard-panels.component.html',
  styleUrls: ['./dashboard-panels.component.css']
})
export class DashboardPanelsComponent {

  constructor(private router: Router) { }

  navigateToVendas() {
    this.router.navigate(['/dashboard/vendas']);
  }

  navigateToReceitas() {
    this.router.navigate(['/dashboard/receitas']);
  }

  voltar() {
    this.router.navigate(['/operacao']);
  }
}
