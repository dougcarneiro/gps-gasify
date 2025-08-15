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
  produtoSelecionado: Produto | null = null;

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
    this.form.get('produto')?.valueChanges.subscribe(produto => {
      this.produtoSelecionado = produto;
      if (produto) {
        // Atualizar validação da quantidade baseada no estoque
        const quantidadeControl = this.form.get('quantidade');
        quantidadeControl?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(produto.quantidadeEstoque)
        ]);
        quantidadeControl?.updateValueAndValidity();

        // Verificar se a quantidade atual excede o novo estoque
        const quantidadeAtual = quantidadeControl?.value;
        if (quantidadeAtual && quantidadeAtual > produto.quantidadeEstoque) {
          this.onQuantidadeBlur();
        }
      }
    });
  }

  carregarProdutos() {
    this.produtoService.carregarProdutos(this.data.operationId).subscribe(produtos => {
      // Filtrar apenas produtos ativos e com estoque > 0
      this.produtos = produtos.filter(p => p.status && p.quantidadeEstoque > 0);
      this.isLoading = false;
    });
  }

  onQuantidadeBlur() {
    if (!this.produtoSelecionado) return;

    const quantidadeControl = this.form.get('quantidade');
    const quantidade = quantidadeControl?.value;

    if (quantidade && quantidade > this.produtoSelecionado.quantidadeEstoque) {
      quantidadeControl?.setErrors({
        'max': true,
        'estoqueInsuficiente': {
          estoqueDisponivel: this.produtoSelecionado.quantidadeEstoque,
          quantidadeSolicitada: quantidade
        }
      });
    } else if (quantidade && quantidade <= this.produtoSelecionado.quantidadeEstoque) {
      // Limpar erros relacionados ao estoque, mas manter outros erros de validação
      const currentErrors = quantidadeControl?.errors;
      if (currentErrors) {
        delete currentErrors['max'];
        delete currentErrors['estoqueInsuficiente'];

        // Se não há mais erros, definir como null
        const hasRemainingErrors = Object.keys(currentErrors).length > 0;
        quantidadeControl?.setErrors(hasRemainingErrors ? currentErrors : null);
      }
    }
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
