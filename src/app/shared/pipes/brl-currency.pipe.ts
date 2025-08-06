import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'brlCurrency',
  standalone: false
})
export class BrlCurrencyPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value === null || value === undefined) {
      return '';
    }
    const currencyPipe = new CurrencyPipe('pt-BR');
    return currencyPipe.transform(value, 'BRL', 'symbol', '1.2-2');
  }

}
