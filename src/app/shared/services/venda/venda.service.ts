import { Injectable } from '@angular/core';
import { Venda } from '../../model/Venda';
import { Observable } from 'rxjs';
import { CaixaService } from '../caixa/caixa.service';
import { getCurrentUserData } from '../../../utils/localStorage';
import { VendaFirebaseService } from '../venda-firebase/venda-firebase.service';
import { Caixa } from '../../model/Caixa';
import { ProdutoService } from '../produto/produto.service';

@Injectable({
  providedIn: 'root'
})
export class VendaService {

  constructor(
    private vendaFirebaseService: VendaFirebaseService,
    private caixaService: CaixaService,
    private produtoService: ProdutoService
  ) { }

  lancarVenda(venda: Venda): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        // Verificar estoque antes de processar a venda
        for (const item of venda.itens) {
          const produto = await this.produtoService.getProdutoPorId(item.produtoId).toPromise();
          if (!produto) {
            throw new Error(`Produto ${item.descricaoProduto} não encontrado`);
          }
          if (produto.quantidadeEstoque < item.quantidade) {
            throw new Error(`Estoque insuficiente para ${item.descricaoProduto}. Disponível: ${produto.quantidadeEstoque}, Solicitado: ${item.quantidade}`);
          }
        }

        const vendaCadastrada = await this.vendaFirebaseService.cadastrar(venda).toPromise();
        if (!vendaCadastrada) {
          throw new Error("Não foi possível cadastrar a venda");
        }

        // Atualizar estoque dos produtos
        for (const item of venda.itens) {
          const produto = await this.produtoService.getProdutoPorId(item.produtoId).toPromise();
          if (produto) {
            const novaQuantidade = produto.quantidadeEstoque - item.quantidade;
            await this.produtoService.atualizarEstoque(item.produtoId, novaQuantidade);
          }
        }

        // Atualizar saldo do caixa
        const caixa: Caixa | undefined = await this.caixaService.pesquisarPorId(venda.caixaId).toPromise();
        if (!caixa) {
          throw new Error("Caixa não encontrado");
        }
        const novoSaldo = (caixa.currentBalance || 0) + venda.totalVenda;
        await this.caixaService.atualizarSaldo(venda.caixaId, novoSaldo);
        resolve(vendaCadastrada);
      } catch (error) {
        reject(error);
      }
    });
  }

  listarVendasPorCaixa(caixaId: string): Observable<Venda[]> {
    return this.vendaFirebaseService.listarPorCaixa(caixaId);
  }

  getVendaPorId(id: string): Observable<Venda> {
    return this.vendaFirebaseService.pesquisarPorId(id);
  }

  listarVendasPorOperacao(operationId: string, from?: Date, to?: Date): Observable<Venda[]> {
    return this.vendaFirebaseService.listarPorOperacao(operationId, from, to);
  }
}
