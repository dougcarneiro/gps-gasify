import { Injectable } from '@angular/core';
import { UserProfileOperationFirebaseService } from '../user-profile-operation-firebase/user-profile-operation-firebase.service';
import { getCurrentUserData } from '../../../utils/localStorage';
import { Produto, TipoUnidadeProduto } from '../../model/Produto';
import { UserProfileOperation } from '../../model/UserProfileOperation';
import { Observable } from 'rxjs';
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

  carregarProdutos(operationId: string): Observable<Produto[]> {
    return this.produtoFirebaseService.listarPorOperacao(operationId);
  }

  async listarProdutos(operationId: string): Promise<Produto[]> {
    const operationRoleParent: UserProfileOperation | undefined = await this.verificarSeTemPermissao();
    try {
      return (await this.produtoFirebaseService.listarPorOperacao(operationId).toPromise()) ?? [];
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      throw new Error('Erro ao listar produtos');
    }
  }

  async cadastrarProduto(
    operationId: string,
    descricao: string,
    precoPorUnidade: number,
    tipoUnidade: TipoUnidadeProduto,
    quantidadeEstoque: number,
    createdBy: string
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
        createdBy: createdBy || getCurrentUserData().roleId,
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

  async atualizarEstoque(produtoId: string, novaQuantidade: number): Promise<void> {
    try {
      await this.produtoFirebaseService.atualizarEstoque(produtoId, novaQuantidade).toPromise();
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      throw new Error('Erro ao atualizar estoque');
    }
  }

  getProdutoPorId(produtoId: string): Observable<Produto> {
    return this.produtoFirebaseService.pesquisarPorId(produtoId);
  }
}
