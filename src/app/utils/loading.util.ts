import { MatDialogRef } from "@angular/material/dialog";
import { ColaboradorFormComponent } from "../colaboradores/colaborador-form/colaborador-form.component";


export function toggleState(dialogRef: MatDialogRef<ColaboradorFormComponent>) {
    dialogRef.componentInstance.isLoading = !dialogRef.componentInstance.isLoading;
    if (dialogRef.componentInstance.isLoading) {
      dialogRef.componentInstance.submitButtonText = '';
    }
    else {
      dialogRef.componentInstance.submitButtonText = 'Salvar';
    }
    dialogRef.componentInstance.form.disabled ? dialogRef.componentInstance.form.enable() : dialogRef.componentInstance.form.disable();
}
