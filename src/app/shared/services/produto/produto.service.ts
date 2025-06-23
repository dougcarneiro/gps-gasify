import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IAuthService } from '../../../interfaces/auth-service.interface';
import { OperationFirebaseService } from '../operation-firebase/operation-firebase.service';
import { UserProfileFirebaseService } from '../user-profile-firebase/user-profile-firebase.service';
import { UserProfileOperationFirebaseService } from '../user-profile-operation-firebase/user-profile-operation-firebase.service';
import { getCurrentUserData, saveUserData } from '../../../utils/localStorage';
import { Produto, TipoUnidadeProduto } from '../../model/Produto';
import { Operation } from '../../model/Operation';
import { UserProfileOperation } from '../../model/UserProfileOperation';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Colaborador } from '../../model/Colaborador';
import { UserProfileListing } from '../../types/UserProfileListing';
import { ProdutoFirebaseService } from '../produto-firebase/produto-firebase.service';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  constructor(
    private produtoFirebaseService: ProdutoFirebaseService,
    private userProfileOperationService: UserProfileOperationFirebaseService,
  ) { }

  async verificarSeTemPermissao(): Promise<UserProfileOperation> {
    const operationRoleParent: UserProfileOperation | undefined = await this.userProfileOperationService.verificarUserAdmin(getCurrentUserData().roleId).toPromise();

    if (!operationRoleParent) {
      throw new Error('Você não tem permissão para realizar essa operação');
    }

    return operationRoleParent;
  }

  async cadastrarProduto(
    operationId: string,
    descricao: string,
    precoPorUnidade: number,
    tipoUnidade: TipoUnidadeProduto,
    quantidadeEstoque: number,
  ): Promise<void> {
    const operationRoleParent: UserProfileOperation | undefined = await this.verificarSeTemPermissao();
    if (!operationRoleParent) {
      throw new Error('Você não tem permissão para cadastrar um produto');
    }
    try {

      await this.produtoFirebaseService.cadastrar({
        operationId: operationId,
        descricao: descricao,
        precoPorUnidade: precoPorUnidade,
        tipoUnidade: tipoUnidade,
        quantidadeEstoque: quantidadeEstoque,
        createdBy: getCurrentUserData().roleId,
      } as Produto).toPromise();

    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      throw new Error('Erro ao cadastrar produto');
    }
  }

  async atualizarProduto(dados: Produto): Promise<void> {
    const operationRoleParent: UserProfileOperation | undefined = await this.verificarSeTemPermissao();
    if (!operationRoleParent) {
      throw new Error('Você não tem permissão para atualizar um produto');
    }
    try {
      await this.produtoFirebaseService.atualizar(dados).toPromise();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw new Error('Erro ao atualizar produto');
    }
  }

  async removerProduto(id: string): Promise<void> {
    const operationRoleParent: UserProfileOperation | undefined = await this.verificarSeTemPermissao();
    if (!operationRoleParent) {
      throw new Error('Você não tem permissão para remover um produto');
    }
    try {
      await this.produtoFirebaseService.remover(id).toPromise();
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      throw new Error('Erro ao remover produto');
    }
  }
}
