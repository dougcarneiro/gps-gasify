import { Component, OnInit } from '@angular/core';
import { OperacaoPerfil } from '../shared/types/OperacaoPerfil';
import { OperacaoService } from '../shared/services/operacao/operacao.service';
import { ColaboradorService } from '../shared/services/colaborador/colaborador.service';
import { UserProfileFirebaseService } from '../shared/services/user-profile-firebase/user-profile-firebase.service';
import { Operation } from '../shared/model/Operation';

@Component({
  selector: 'app-operacao-perfil',
  templateUrl: './operacao-perfil.component.html',
  styleUrls: ['./operacao-perfil.component.css'],
  standalone: false,
})
export class OperacaoPerfilComponent implements OnInit {

  perfil: OperacaoPerfil | undefined;
  isLoading: boolean = false;

  qtdProdutos: number | undefined;
  qtdColaboradores: number | undefined;
  ownerData: { nome: string, email: string } | undefined;
  operationData: Operation | undefined;

  constructor(
    private operacaoService: OperacaoService,
  ) { }

  ngOnInit(): void {
    this.carregarPerfil();
  }

  carregarPerfil() {
    this.isLoading = true;

    this.operacaoService.carregarPerfil().subscribe(perfil => {
      this.perfil = perfil;
      this.isLoading = false;
    });
  }
}
