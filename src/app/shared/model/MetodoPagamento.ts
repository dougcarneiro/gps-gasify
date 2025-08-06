export type MetodoPagamento = 'PIX' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'DINHEIRO';

export const metodosPagamentoList: { value: MetodoPagamento; viewValue: string }[] = [
  { value: 'PIX', viewValue: 'Pix' },
  { value: 'CARTAO_CREDITO', viewValue: 'Cartão de Crédito' },
  { value: 'CARTAO_DEBITO', viewValue: 'Cartão de Débito' },
  { value: 'DINHEIRO', viewValue: 'Dinheiro' },
];

export function formatMetodoPagamento(metodo: MetodoPagamento): string {
  switch (metodo) {
    case 'PIX':
      return 'Pix';
    case 'CARTAO_CREDITO':
      return 'Cartão de Crédito';
    case 'CARTAO_DEBITO':
      return 'Cartão de Débito';
    case 'DINHEIRO':
      return 'Dinheiro';
    default:
      return 'Método Desconhecido';
  }
}
