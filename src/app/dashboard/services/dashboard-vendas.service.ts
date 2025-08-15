import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { VendaFirebaseService } from '../../shared/services/venda-firebase/venda-firebase.service';
import { DashboardParams } from '../../shared/types/DashboardParams';
import { RobotResponsesReport, DailyReportResult } from '../types/report-result';
import { getCurrentUserData } from '../../utils/localStorage';
import { Venda } from '../../shared/model/Venda';
import { ItemVenda } from '../../shared/model/ItemVenda';

@Injectable({
  providedIn: 'root'
})
export class DashboardVendasService {

  constructor(private vendaFirebaseService: VendaFirebaseService) { }

  getAllSoldItems(params: DashboardParams): Observable<RobotResponsesReport> {
    const { operationId } = getCurrentUserData();

    return this.vendaFirebaseService.listarPorOperacao(operationId, params.from, params.to).pipe(
      map((vendas: Venda[]) => {
        // Agrupar vendas por data (contando número de vendas, não itens)
        const vendasGroupedByDate = new Map<string, number>();
        let totalVendas = 0;

        vendas.forEach((venda: Venda) => {
          const dateKey = this.formatDateKey(venda.createdAt!, params.granularity || 'day');

          const currentCount = vendasGroupedByDate.get(dateKey) || 0;
          vendasGroupedByDate.set(dateKey, currentCount + 1);
          totalVendas += 1;
        });

        // Converter para o formato esperado pelo dashboard
        const results: DailyReportResult[] = [];

        // Gerar todas as datas no período para garantir continuidade
        const dateRange = this.generateDateRange(params.from!, params.to!, params.granularity || 'day');

        dateRange.forEach(date => {
          const dateKey = this.formatDateKey(date, params.granularity || 'day');
          results.push({
            date: dateKey,
            count: vendasGroupedByDate.get(dateKey) || 0
          });
        });

        return {
          results: results.sort((a, b) => a.date.localeCompare(b.date)),
          total: totalVendas
        } as RobotResponsesReport;
      })
    );
  }

  getAllSalesRevenue(params: DashboardParams): Observable<RobotResponsesReport> {
    const { operationId } = getCurrentUserData();

    return this.vendaFirebaseService.listarPorOperacao(operationId, params.from, params.to).pipe(
      map((vendas: Venda[]) => {
        // Agrupar receita por data
        const revenueGroupedByDate = new Map<string, number>();
        let totalRevenue = 0;

        vendas.forEach((venda: Venda) => {
          const dateKey = this.formatDateKey(venda.createdAt!, params.granularity || 'day');

          const currentRevenue = revenueGroupedByDate.get(dateKey) || 0;
          revenueGroupedByDate.set(dateKey, currentRevenue + venda.totalVenda);
          totalRevenue += venda.totalVenda;
        });

        // Converter para o formato esperado pelo dashboard
        const results: DailyReportResult[] = [];

        // Gerar todas as datas no período para garantir continuidade
        const dateRange = this.generateDateRange(params.from!, params.to!, params.granularity || 'day');

        dateRange.forEach(date => {
          const dateKey = this.formatDateKey(date, params.granularity || 'day');
          results.push({
            date: dateKey,
            count: revenueGroupedByDate.get(dateKey) || 0
          });
        });

        return {
          results: results.sort((a, b) => a.date.localeCompare(b.date)),
          total: totalRevenue
        } as RobotResponsesReport;
      })
    );
  }

  getSalesByProductCategory(params: DashboardParams): Observable<RobotResponsesReport> {
    const { operationId } = getCurrentUserData();

    return this.vendaFirebaseService.listarPorOperacao(operationId, params.from, params.to).pipe(
      map((vendas: Venda[]) => {
        // Agrupar vendas por categoria de produto e data
        const categoryGroupedByDate = new Map<string, Map<string, number>>();
        const totalByCategory = new Map<string, number>();

        // Inicializar categorias
        const categories = ['gasolinaComum', 'gasolinaAditivada', 'etanolEtilico', 'diesel', 'outros'];
        categories.forEach(category => {
          totalByCategory.set(category, 0);
        });

        vendas.forEach((venda: Venda) => {
          const dateKey = this.formatDateKey(venda.createdAt!, params.granularity || 'day');

          // Categorizar os itens da venda
          const vendaCategories = this.categorizarItensVenda(venda.itens);

          vendaCategories.forEach((hasCategory, category) => {
            if (hasCategory) {
              // Inicializar o mapa da data se não existir
              if (!categoryGroupedByDate.has(dateKey)) {
                categoryGroupedByDate.set(dateKey, new Map());
              }

              const dateMap = categoryGroupedByDate.get(dateKey)!;
              const currentCount = dateMap.get(category) || 0;
              dateMap.set(category, currentCount + 1);

              // Atualizar total da categoria
              const currentTotal = totalByCategory.get(category) || 0;
              totalByCategory.set(category, currentTotal + 1);
            }
          });
        });

        // Converter para o formato esperado pelo dashboard com múltiplas séries
        const dateRange = this.generateDateRange(params.from!, params.to!, params.granularity || 'day');
        const receivedGroup: any = {};

        categories.forEach(category => {
          const categoryResults: DailyReportResult[] = [];

          dateRange.forEach(date => {
            const dateKey = this.formatDateKey(date, params.granularity || 'day');
            const dateMap = categoryGroupedByDate.get(dateKey);
            const count = dateMap ? (dateMap.get(category) || 0) : 0;

            categoryResults.push({
              date: dateKey,
              count: count
            });
          });

          receivedGroup[category] = categoryResults.sort((a, b) => a.date.localeCompare(b.date));
        });

        // Calcular total geral
        const totalGeral = Array.from(totalByCategory.values()).reduce((sum, count) => sum + count, 0);

        return {
          receivedGroup: receivedGroup,
          total: totalGeral
        } as RobotResponsesReport;
      })
    );
  }

  getRevenueByProductCategory(params: DashboardParams): Observable<RobotResponsesReport> {
    const { operationId } = getCurrentUserData();

    return this.vendaFirebaseService.listarPorOperacao(operationId, params.from, params.to).pipe(
      map((vendas: Venda[]) => {
        // Agrupar receita por categoria de produto e data
        const categoryRevenueGroupedByDate = new Map<string, Map<string, number>>();
        const totalRevenueByCategory = new Map<string, number>();

        // Inicializar categorias
        const categories = ['gasolinaComum', 'gasolinaAditivada', 'etanolEtilico', 'diesel', 'outros'];
        categories.forEach(category => {
          totalRevenueByCategory.set(category, 0);
        });

        vendas.forEach((venda: Venda) => {
          const dateKey = this.formatDateKey(venda.createdAt!, params.granularity || 'day');

          // Categorizar os itens da venda e calcular receita por categoria
          const vendaCategories = this.categorizarItensVenda(venda.itens);
          const revenueByCategory = this.calcularReceitaPorCategoria(venda.itens, vendaCategories);

          revenueByCategory.forEach((revenue, category) => {
            if (revenue > 0) {
              // Inicializar o mapa da data se não existir
              if (!categoryRevenueGroupedByDate.has(dateKey)) {
                categoryRevenueGroupedByDate.set(dateKey, new Map());
              }

              const dateMap = categoryRevenueGroupedByDate.get(dateKey)!;
              const currentRevenue = dateMap.get(category) || 0;
              dateMap.set(category, currentRevenue + revenue);

              // Atualizar total da categoria
              const currentTotal = totalRevenueByCategory.get(category) || 0;
              totalRevenueByCategory.set(category, currentTotal + revenue);
            }
          });
        });

        // Converter para o formato esperado pelo dashboard com múltiplas séries
        const dateRange = this.generateDateRange(params.from!, params.to!, params.granularity || 'day');
        const receivedGroup: any = {};

        categories.forEach(category => {
          const categoryResults: DailyReportResult[] = [];

          dateRange.forEach(date => {
            const dateKey = this.formatDateKey(date, params.granularity || 'day');
            const dateMap = categoryRevenueGroupedByDate.get(dateKey);
            const revenue = dateMap ? (dateMap.get(category) || 0) : 0;

            categoryResults.push({
              date: dateKey,
              count: revenue
            });
          });

          receivedGroup[category] = categoryResults.sort((a, b) => a.date.localeCompare(b.date));
        });

        // Calcular total geral
        const totalGeral = Array.from(totalRevenueByCategory.values()).reduce((sum, revenue) => sum + revenue, 0);

        return {
          receivedGroup: receivedGroup,
          total: totalGeral
        } as RobotResponsesReport;
      })
    );
  }

  private categorizarItensVenda(itens: ItemVenda[]): Map<string, boolean> {
    const categorias = new Map<string, boolean>();

    // Inicializar todas as categorias como false
    categorias.set('gasolinaComum', false);
    categorias.set('gasolinaAditivada', false);
    categorias.set('etanolEtilico', false);
    categorias.set('diesel', false);
    categorias.set('outros', false);

    itens.forEach(item => {
      const descricao = item.descricaoProduto.toLowerCase().trim();

      // Mapeamento específico baseado nos nomes exatos
      if (descricao.includes('gasolina comum')) {
        categorias.set('gasolinaComum', true);
      } else if (descricao.includes('gasolina aditivada')) {
        categorias.set('gasolinaAditivada', true);
      } else if (descricao.includes('etanol')) {
        categorias.set('etanolEtilico', true);
      } else if (descricao.includes('diesel')) {
        categorias.set('diesel', true);
      } else {
        // Fallback: verificar palavras-chave individuais
        if (descricao.includes('gasolina') && !descricao.includes('aditivada')) {
          categorias.set('gasolinaComum', true);
        } else if (descricao.includes('alcool') || descricao.includes('álcool') || descricao.includes('etanol')) {
          categorias.set('etanolEtilico', true);
        } else {
          categorias.set('outros', true);
        }
      }
    });

    return categorias;
  }

  private calcularReceitaPorCategoria(itens: ItemVenda[], vendaCategories: Map<string, boolean>): Map<string, number> {
    const receitaPorCategoria = new Map<string, number>();

    // Inicializar todas as categorias com 0
    receitaPorCategoria.set('gasolinaComum', 0);
    receitaPorCategoria.set('gasolinaAditivada', 0);
    receitaPorCategoria.set('etanolEtilico', 0);
    receitaPorCategoria.set('diesel', 0);
    receitaPorCategoria.set('outros', 0);

    itens.forEach(item => {
      const descricao = item.descricaoProduto.toLowerCase().trim();
      const valorItem = item.subtotal;

      // Determinar a categoria do item e somar a receita
      if (descricao.includes('gasolina comum')) {
        const atual = receitaPorCategoria.get('gasolinaComum') || 0;
        receitaPorCategoria.set('gasolinaComum', atual + valorItem);
      } else if (descricao.includes('gasolina aditivada')) {
        const atual = receitaPorCategoria.get('gasolinaAditivada') || 0;
        receitaPorCategoria.set('gasolinaAditivada', atual + valorItem);
      } else if (descricao.includes('etanol')) {
        const atual = receitaPorCategoria.get('etanolEtilico') || 0;
        receitaPorCategoria.set('etanolEtilico', atual + valorItem);
      } else if (descricao.includes('diesel')) {
        const atual = receitaPorCategoria.get('diesel') || 0;
        receitaPorCategoria.set('diesel', atual + valorItem);
      } else {
        // Fallback: verificar palavras-chave individuais
        if (descricao.includes('gasolina') && !descricao.includes('aditivada')) {
          const atual = receitaPorCategoria.get('gasolinaComum') || 0;
          receitaPorCategoria.set('gasolinaComum', atual + valorItem);
        } else if (descricao.includes('alcool') || descricao.includes('álcool') || descricao.includes('etanol')) {
          const atual = receitaPorCategoria.get('etanolEtilico') || 0;
          receitaPorCategoria.set('etanolEtilico', atual + valorItem);
        } else {
          const atual = receitaPorCategoria.get('outros') || 0;
          receitaPorCategoria.set('outros', atual + valorItem);
        }
      }
    });

    return receitaPorCategoria;
  }

  private formatDateKey(date: Date, granularity: string): string {
    if (granularity === 'month') {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  private generateDateRange(from: Date, to: Date, granularity: string): Date[] {
    const dates: Date[] = [];
    const current = new Date(from);
    const end = new Date(to);

    while (current <= end) {
      dates.push(new Date(current));

      if (granularity === 'month') {
        current.setMonth(current.getMonth() + 1);
        current.setDate(1); // Primeiro dia do mês
      } else {
        current.setDate(current.getDate() + 1);
      }
    }

    return dates;
  }
}
