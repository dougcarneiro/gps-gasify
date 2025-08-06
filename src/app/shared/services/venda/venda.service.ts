import { Injectable } from '@angular/core';
import { Venda } from '../../model/Venda';
import { Observable } from 'rxjs';
import { CaixaService } from '../caixa/caixa.service';
import { getCurrentUserData } from '../../../utils/localStorage';
import { VendaFirebaseService } from '../venda-firebase/venda-firebase.service';
import { Caixa } from '../../model/Caixa';

@Injectable({
  providedIn: 'root'
})
export class VendaService {

  constructor(
    private vendaFirebaseService: VendaFirebaseService,
    private caixaService: CaixaService
  ) { }

  lancarVenda(venda: Venda): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const vendaCadastrada = await this.vendaFirebaseService.cadastrar(venda).toPromise();
        if (!vendaCadastrada) {
          throw new Error("Não foi possível cadastrar a venda");
        }
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
}
