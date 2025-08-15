import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Caixa } from '../../shared/model/Caixa';
import { metodosPagamentoList } from '../../shared/model/MetodoPagamento';
import { ItemVenda } from '../../shared/model/ItemVenda';
import { Venda } from '../../shared/model/Venda';
import { VendaService } from '../../shared/services/venda/venda.service';
import { AdicionarItemVendaComponent } from '../adicionar-item-venda/adicionar-item-venda.component';
import { getCurrentUserData } from '../../utils/localStorage';
import { MensagemSnackService } from '../../shared/services/message/snack.service';

@Component({
  selector: 'app-venda-form',
  standalone: false,
  templateUrl: './venda-form.component.html',
  styleUrls: ['./venda-form.component.css']
})
export class VendaFormComponent implements OnInit {
  form: FormGroup;
  metodosPagamento = metodosPagamentoList;
  caixa: Caixa;
  isLoading = false;
  hidden = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private vendaService: VendaService,
    private snackService: MensagemSnackService,
    public dialogRef: MatDialogRef<VendaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { caixa: Caixa }
  ) {
    this.caixa = data.caixa;
    this.form = this.fb.group({
      cliente: [''],
      metodoPagamento: ['', Validators.required],
      itens: this.fb.array([], Validators.required)
    });
  }

  ngOnInit(): void { }

  get itens(): FormArray {
    return this.form.get('itens') as FormArray;
  }

  adicionarItem() {
    this.hidden = true;
    const dialogRef = this.dialog.open(AdicionarItemVendaComponent, {
      width: '500px',
      data: { operationId: this.caixa.operationId }
    });

    dialogRef.afterClosed().subscribe((item: ItemVenda) => {
      if (item) {
        this.itens.push(this.fb.group(item));
      }
      this.hidden = false;
    });
  }

  removerItem(index: number) {
    this.itens.removeAt(index);
  }

  calcularTotal(): number {
    return this.itens.value.reduce((acc: number, item: ItemVenda) => acc + item.subtotal, 0);
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    const { roleId, operationId } = getCurrentUserData();
    const novaVenda: Venda = {
      caixaId: this.caixa.id!,
      ...this.form.value,
      totalVenda: this.calcularTotal(),
      ownerId: roleId,
      operationId: operationId
    };

    this.vendaService.lancarVenda(novaVenda)
      .then(() => {
        this.snackService.sucesso('Venda registrada com sucesso!');
        this.dialogRef.close(true);
      })
      .catch(err => {
        console.error(err);
        const errorMessage = err.message || 'Erro ao registrar venda.';
        this.snackService.erro(errorMessage);
      })
      .finally(() => this.isLoading = false);
  }
}
