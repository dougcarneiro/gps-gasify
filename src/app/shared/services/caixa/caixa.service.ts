import { Injectable } from '@angular/core';
import { getCurrentUserData } from '../../../utils/localStorage';
import { Caixa } from '../../model/Caixa';
import { Observable } from 'rxjs';
import { CaixaFirebaseService } from '../caixa-firebase/caixa-firebase.service';

@Injectable({
  providedIn: 'root'
})
export class CaixaService {
  constructor(
    private caixaFirebaseService: CaixaFirebaseService,
  ) { }

  carregarCaixas(operationId: string): Observable<Caixa[]> {
    return this.caixaFirebaseService.listarPorOperacao(operationId);
  }

  carregarCaixasAtivas(operationId: string): Observable<Caixa[]> {
    return this.caixaFirebaseService.listarAtivoPorOperacao(operationId);
  }

  async listarCaixasPorOwner(ownerId: string): Promise<Caixa[]> {
    try {
      return (await this.caixaFirebaseService.listarPorOwner(ownerId).toPromise()) ?? [];
    } catch (error) {
      console.error('Erro ao listar caixas por owner:', error);
      throw new Error('Erro ao listar caixas por owner');
    }
  }

  async verificarSeCaixaEstaAberto(ownerId: string, operationId: string): Promise<Caixa | null> {
    try {
      const caixas: Caixa[] | undefined = await this.caixaFirebaseService.listarAtivoPorOwnerEOperation(ownerId, operationId).toPromise();
      if (!caixas) {
        return null;
      }
      return caixas.length > 0 ? caixas[0] : null;
    } catch (error) {
      console.error('Erro ao verificar se caixa está aberto:', error);
      throw new Error('Erro ao verificar se caixa está aberto');
    }
  }

  async listarCaixas(operationId: string): Promise<Caixa[]> {
    try {
      return (await this.caixaFirebaseService.listarPorOperacao(operationId).toPromise()) ?? [];
    } catch (error) {
      console.error('Erro ao listar caixas:', error);
      throw new Error('Erro ao listar caixas');
    }
  }

  async abrirCaixa(
    operationId: string,
    initialBalance: number,
    ownerId?: string
  ): Promise<void> {
    try {
      await this.caixaFirebaseService.cadastrar({
        operationId: operationId,
        initialBalance: initialBalance,
        currentBalance: initialBalance,
        closedBalance: 0,
        isActive: true,
        ownerId: ownerId || getCurrentUserData().roleId,
      } as Caixa).toPromise();

    } catch (error) {
      console.error('Erro ao abrir caixa:', error);
      throw new Error('Erro ao abrir caixa');
    }
  }

  async atualizarCaixa(dados: Caixa): Promise<void> {
    try {
      await this.caixaFirebaseService.atualizar(dados).toPromise();
    } catch (error) {
      console.error('Erro ao atualizar caixa:', error);
      throw new Error('Erro ao atualizar caixa');
    }
  }

  async fecharCaixa(id: string, closedBalance: number): Promise<void> {
    try {
      await this.caixaFirebaseService.fecharCaixa(id, closedBalance).toPromise();
    } catch (error) {
      console.error('Erro ao fechar caixa:', error);
      throw new Error('Erro ao fechar caixa');
    }
  }

  async atualizarSaldo(id: string, novoSaldo: number): Promise<void> {
    try {
      await this.caixaFirebaseService.atualizarSaldo(id, novoSaldo).toPromise();
    } catch (error) {
      console.error('Erro ao atualizar saldo do caixa:', error);
      throw new Error('Erro ao atualizar saldo do caixa');
    }
  }

  async removerCaixa(id: string): Promise<void> {
    try {
      await this.caixaFirebaseService.remover(id).toPromise();
    } catch (error) {
      console.error('Erro ao remover caixa:', error);
      throw new Error('Erro ao remover caixa');
    }
  }
}
