import { Injectable } from '@angular/core';
import { getCurrentUserData } from '../../../utils/localStorage';
import { Produto } from '../../model/Produto';
import { forkJoin, map, Observable, of, switchMap, take } from 'rxjs';
import { OperationFirebaseService } from '../operation-firebase/operation-firebase.service';
import { ProdutoService } from '../produto/produto.service';
import { ColaboradorService } from '../colaborador/colaborador.service';
import { UserProfile } from '../../model/UserProfile';
import { Operation } from '../../model/Operation';
import { UserProfileFirebaseService } from '../user-profile-firebase/user-profile-firebase.service';
import { OperacaoPerfil } from '../../types/OperacaoPerfil';

@Injectable({
  providedIn: 'root'
})
export class OperacaoService {
  constructor(
    private produtoService: ProdutoService,
    private colaboradorService: ColaboradorService,
    private userProfileService: UserProfileFirebaseService,
    private operationFirebaseService: OperationFirebaseService,
  ) { }

  carregarProdutos(): Observable<Produto[]> {
    const userData = getCurrentUserData();
    if (userData && userData.operationId) {
      return this.produtoService.carregarProdutos(userData.operationId);
    }
    return of([]);
  }

  carregarColaboradores(): Observable<UserProfile[]> {
    return this.colaboradorService.carregarColaboradores();
  }

  carregarDadosOperacao(): Observable<Operation> {
    const userData = getCurrentUserData();
    if (userData && userData.operationId) {
      return this.operationFirebaseService.pesquisarPorId(userData.operationId)
    }
    return of({});
  }

  carregarDadosProprietario(): Observable<UserProfile> {
    return this.carregarDadosOperacao().pipe(
      // Use switchMap to get ownerId from the Operation object
      // and fetch the UserProfile by ownerId
      switchMap((operation: Operation) => {
        if (operation && operation.ownerId) {
          return this.userProfileService.pesquisarPorId(operation.ownerId);
        }
        // Return an empty observable or handle as needed
        return of({} as UserProfile);
      })
    );
  }

  carregarPerfil(): Observable<OperacaoPerfil> {
    return forkJoin({
      operacao: this.carregarDadosOperacao(),
      proprietario: this.carregarDadosProprietario(),
      colaboradores: this.carregarColaboradores().pipe(take(1)),
      produtos: this.carregarProdutos().pipe(take(1))
    }).pipe(
      map(({ operacao, proprietario, colaboradores, produtos }) => {
        const perfil: OperacaoPerfil = {
          nome: operacao.name ?? '',
          codigo: operacao.slug ?? '',
          dataCadastro: (operacao.createdAt as any)?.toDate(),
          proprietario: {
            nome: proprietario.name ?? '',
            email: proprietario.email ?? ''
          },
          quantidadeColaboradores: colaboradores.length,
          quantidadeProdutos: produtos.length
        };
        return perfil;
      })
    );
  }
}
