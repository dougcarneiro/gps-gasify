import { ChangeDetectorRef, Component, AfterViewInit } from '@angular/core';
import { getCurrentUserData } from '../utils/localStorage';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MensagemSnackService } from '../shared/services/message/snack.service';
import { toggleState } from '../utils/loading.util';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { ProdutoService } from '../shared/services/produto/produto.service';
import { Produto } from '../shared/model/Produto';
import { ProdutoFormComponent } from './produto-form/produto-form.component';
import { ColaboradorService } from '../shared/services/colaborador/colaborador.service';

@Component({
  selector: 'app-produtos',
  standalone: false,
  templateUrl: './produto.component.html',
})
export class ProdutoComponent implements AfterViewInit {
  isUserAdmin: boolean = false;

  produtos: Array<Produto> = [];
  noDataLabel = 'Nenhum produto cadastrado.'

  isLoading = false;

  userId!: string;
  dialogRef!: MatDialogRef<ProdutoFormComponent>;

  constructor(
    private dialog: MatDialog,
    private snackService: MensagemSnackService,
    private produtoService: ProdutoService,
    private colaboradorService: ColaboradorService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngAfterViewInit(): void {
    this.userId = getCurrentUserData().user.id;
    this.getProdutos();
    this.checkIfUserIsAdmin();
  }

  checkIfUserIsAdmin(): void {
    this.colaboradorService.verificarPermissao().then((userProfileOperation) => {
      this.isUserAdmin = userProfileOperation ? true : false;
    });
  }

  getProdutos(): void {
    this.isLoading = true;

    const currentUserData = getCurrentUserData();
    if (currentUserData && currentUserData.operationId) {
      this.produtoService.carregarProdutos(currentUserData.operationId).subscribe({
        next: dados => {
          this.produtos = dados
            .filter((dado: Produto) => dado.id !== undefined)
            .map((dado: Produto) => ({
              ...dado,
            }));
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erro ao carregar produtos:', err);
          this.produtos = [];
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      console.error('Não foi possível obter operationId do usuário atual.');
      this.produtos = [];
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  novoProdutoDialog(): void {
    const dialogRef = this.dialog.open(ProdutoFormComponent, {
      width: '30rem',
      data: { formTitle: 'Novo Produto' },
    });

    dialogRef.componentInstance.submit.subscribe((formData: any) => {
      const data: Produto = {
        operationId: getCurrentUserData().operationId,
        descricao: formData.description,
        tipoUnidade: formData.unitType,
        precoPorUnidade: formData.price,
        quantidadeEstoque: formData.stock,
        status: true,
        createdBy: getCurrentUserData().roleId,
      }

      toggleState(dialogRef);
      this.produtoService.cadastrarProduto(
        getCurrentUserData().operationId!,
        data.descricao,
        data.precoPorUnidade,
        data.tipoUnidade,
        data.quantidadeEstoque,
        data.createdBy!
      ).then(() => {
        this.snackService.sucesso('Produto adicionado com sucesso!');
        this.getProdutos();
        dialogRef.close();
      }).catch((error) => {
        console.error('Erro ao criar produto:', error);
        this.snackService.erro('Erro ao tentar criar produto: ' + error.message);
        toggleState(dialogRef);
      });
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  async onDelete(produto: Produto): Promise<void> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '30rem',
      data: {
        dialogTitle: 'Remover Produto',
        dialogText: `Deseja realmente remover o produto ${produto.descricao}?`
      },
    });

    dialogRef.componentInstance.dialogActionConfirm.subscribe(
      async () => {
        await this.remove(produto.id!);
        dialogRef.close();
      }
    );
  }

  async remove(id: string): Promise<void> {
    this.isLoading = true;
    await this.produtoService.removerProduto(id).then(() => {
      this.getProdutos();
      this.snackService.sucesso('Produto removido com sucesso!');
      this.isLoading = false;
    }).catch((error) => {
      console.error('Erro ao criar produto:', error);
      this.snackService.erro('Erro ao tentar criar produto: ' + error.message);
      this.isLoading = false;
    });
  }

  async onStatusChange(produto: Produto): Promise<void> {
    produto.status = !produto.status;
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '30rem',
      data: {
        dialogTitle: produto.status ? 'Ativar Produto' : 'Desativar Produto',
        dialogText: `Deseja realmente ${produto.status ? 'ativar' : 'desativar'} o produto ${produto.descricao}?`
      },
    });

    let confirmed = false;
    const confirmSubscription = dialogRef.componentInstance.dialogActionConfirm.subscribe(
      async () => {
        confirmed = true;
        dialogRef.componentInstance.isLoading = true;
        await this.produtoService.atualizarProduto(produto)
          .then(() => {
            this.snackService.sucesso('Status do produto atualizado com sucesso!');

            dialogRef.close();
          })
          .catch((error) => {
            console.error('Erro ao atualizar status do produto:', error);
            this.snackService.erro('Erro ao atualizar status do produto: ' + error.message);
            this.getProdutos();
            dialogRef.close();
          });
      }
    );

    const closeSubscription = dialogRef.afterClosed().subscribe(() => {
      if (!confirmed) {
        this.getProdutos();
      }
      confirmSubscription.unsubscribe();
      closeSubscription.unsubscribe();
    });
  }

  async onEdit(produto: Produto): Promise<void> {
    const dialogRef = this.dialog.open(ProdutoFormComponent, {
      width: '30rem',
      data: { formTitle: 'Atualizar Produto', produto: produto, isEditMode: true },
    });

    dialogRef.componentInstance.submit.subscribe((formData: any) => {
      const data: Produto = {
        id: produto.id,
        createdBy: produto.createdBy,
        operationId: produto.operationId,
        descricao: formData.description,
        precoPorUnidade: formData.price,
        tipoUnidade: produto.tipoUnidade,
        status: produto.status,
        quantidadeEstoque: formData.stock,
      }

      toggleState(dialogRef);

      this.produtoService.atualizarProduto(data)
        .then((updatedProduto) => {
          this.snackService.sucesso('Produto atualizado com sucesso!');
          this.getProdutos();
          dialogRef.close();
        })
        .catch((error) => {
          console.error('Erro ao atualizar produto:', error);
          this.snackService.erro('Erro ao atualizar produto: ' + error.message);
          toggleState(dialogRef);
        });
    });
  }


}
