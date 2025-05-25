import { Injectable } from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class MensagemSnackService {

  constructor(private snackBar: MatSnackBar) { }

  sucesso(mensagem: string): void {
    this.abrirSnackBar(mensagem, ['success']);
  }

  erro(mensagem: string): void {
    this.abrirSnackBar(mensagem, ['error']);
  }

  info(mensagem: string): void {
    this.abrirSnackBar(mensagem, ['info']);
  }

  aviso(mensagem: string): void {
    this.abrirSnackBar(mensagem, ['warning']);
  }


  private abrirSnackBar(mensagem: string, extraClasses: string[]): void {
    const config = new MatSnackBarConfig();
    config.duration = 8000;
    config.panelClass = extraClasses;
    this.snackBar.open(mensagem, 'X', config);
  }

}
