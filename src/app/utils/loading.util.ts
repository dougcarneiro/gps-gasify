import { MatDialogRef } from "@angular/material/dialog";
import { ColaboradorFormComponent } from "../colaboradores/colaborador-form/colaborador-form.component";
import { ProdutoFormComponent } from "../produtos/produto-form/produto-form.component";


export function toggleState(dialogRef: MatDialogRef<any>, submitButtonText: string = 'Salvar'): void {
  dialogRef.componentInstance.isLoading = !dialogRef.componentInstance.isLoading;
  if (dialogRef.componentInstance.isLoading) {
    dialogRef.componentInstance.submitButtonText = '';
  }
  else {
    dialogRef.componentInstance.submitButtonText = submitButtonText;
  }

  if (dialogRef.componentInstance instanceof ColaboradorFormComponent || dialogRef.componentInstance instanceof ProdutoFormComponent) {
    dialogRef.componentInstance.form.disabled ? dialogRef.componentInstance.form.enable() : dialogRef.componentInstance.form.disable();
  }
}
