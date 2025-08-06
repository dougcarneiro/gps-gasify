import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalDatePipe } from './local-date.pipe';
import { BrlCurrencyPipe } from './brl-currency.pipe';
import { PaymentMethodPipe } from './payment-method.pipe';

@NgModule({
  declarations: [
    LocalDatePipe,
    BrlCurrencyPipe,
    PaymentMethodPipe,
  ],
  imports: [],
  exports: [
    LocalDatePipe,
    BrlCurrencyPipe,
    PaymentMethodPipe,
  ]
})
export class PipesModule { }
