import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentMethod',
  standalone: false
})
export class PaymentMethodPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    switch (value) {
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
}
