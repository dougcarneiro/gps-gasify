import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ColaboradorService } from '../shared/services/colaborador/colaborador.service';
import { MyProfile } from '../shared/types/MyProfile';

@Component({
  selector: 'app-meu-perfil',
  templateUrl: './meu-perfil.component.html',
  styleUrls: ['./meu-perfil.component.css'],
  standalone: false,
})
export class MeuPerfilComponent implements AfterViewInit {

  perfil: MyProfile | undefined;
  isLoading: boolean = false;

  constructor(
    private colaboradorService: ColaboradorService,
  ) { }

  ngAfterViewInit(): void {
    this.carregarPerfil();
  }

  carregarPerfil() {
    this.isLoading = true;
    this.colaboradorService.getPerfil().then((userProfile) => {
      this.perfil = userProfile;
      this.isLoading = false;
    });
  }

  mudarSenha() {
    // TODO
  }
}
