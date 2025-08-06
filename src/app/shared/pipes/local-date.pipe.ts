import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'localDate',
  standalone: false
})
export class LocalDatePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!value) {
      return '';
    }
    const datePipe = new DatePipe('pt-BR');
    return datePipe.transform(value, 'dd/MM/yyyy HH:mm');
  }

}
