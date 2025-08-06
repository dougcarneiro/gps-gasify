import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Produto } from '../../shared/model/Produto';
import { ProdutoService } from '../../shared/services/produto/produto.service';
import { ItemVenda } from '../../shared/model/ItemVenda';

@Component({
  selector: 'app-adicionar-item-venda',
  standalone: false,
  templateUrl: './adicionar-item-venda.component.html',
  styleUrls: ['./adicionar-item-venda.component.css']
})
export class AdicionarItemVendaComponent implements OnInit {
  form: FormGroup;
  produtos: Produto[] = [];
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    public dialogRef: MatDialogRef<AdicionarItemVendaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { operationId: string }
  ) {
    this.form = this.fb.group({
      produto: ['', Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.produtoService.carregarProdutos(this.data.operationId).subscribe(produtos => {
      this.produtos = produtos.filter(p => p.status); // Apenas produtos ativos
      this.isLoading = false;
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const produtoSelecionado: Produto = this.form.value.produto;
    const quantidade: number = this.form.value.quantidade;

    const novoItem: ItemVenda = {
      produtoId: produtoSelecionado.id!,
      descricaoProduto: produtoSelecionado.descricao,
      quantidade: quantidade,
      precoUnitario: produtoSelecionado.precoPorUnidade,
      subtotal: produtoSelecionado.precoPorUnidade * quantidade
    };

    this.dialogRef.close(novoItem);
  }
}
