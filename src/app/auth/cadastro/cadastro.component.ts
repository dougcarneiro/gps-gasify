import { Component, signal } from '@angular/core';
import { MensagemSnackService } from '../../shared/services/message/snack.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColaboradorService } from '../../shared/services/colaborador/colaborador.service';


@Component({
  selector: 'app-cadastro',
  standalone: false,

  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
    nomeFormControl: FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
    emailFormControl: FormControl = new FormControl('', [Validators.required, Validators.email]);
    passwordFormControl: FormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
    operationNameFormControl: FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
    operationSlugFormControl: FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);

    readonly registerForm = new FormGroup({
      nome: this.nomeFormControl,
      email: this.emailFormControl,
      password: this.passwordFormControl
  });

  submitButtonStatus = false;
  submitButtonText = 'Enviar';
  isLoading = false;

  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');
  nomeErrorMessage = signal('');
  operationNameErrorMessage = signal('');
  operationSlugErrorMessage = signal('');

  constructor(
    private snackService: MensagemSnackService,
    private colaboradorService: ColaboradorService,
  ) { }

  checkForm() {
    this.trimFormValues();
    this.emailUpdateErrorMessage();
    this.passwordUpdateErrorMessage();
    this.nomeUpdateErrorMessage();
    this.operationNameUpdataErrorMessage();
    this.operationSlugUpdataErrorMessage();
    this.submitButtonStatus = this.nomeFormControl.valid && this.emailFormControl.valid && this.passwordFormControl.valid;
  }

  toggleLoading() {
    this.isLoading = !this.isLoading;
    this.submitButtonStatus = !this.submitButtonStatus;
    this.submitButtonText = this.isLoading ? '' : 'Enviar';
  }

  emailUpdateErrorMessage() {
    if (this.emailFormControl.hasError('required')) {
      this.emailErrorMessage.set('Você precisa digitar um email.');
    } else if (this.emailFormControl.hasError('email')) {
      this.emailErrorMessage.set('Digite um email válido.');
    } else {
      this.emailErrorMessage.set('');
    }
  }

  trimFormValues() {
    this.emailFormControl.setValue(this.emailFormControl.value.trim());
    this.passwordFormControl.setValue(this.passwordFormControl.value.trim());
    this.operationSlugFormControl.setValue(this.operationSlugFormControl.value.trim());
  }

  passwordUpdateErrorMessage() {
    this.trimFormValues();

    if (this.passwordFormControl.hasError('required')) {
      this.passwordErrorMessage.set('Digite sua senha.');
    }
    else if (this.passwordFormControl.hasError('minlength')) {
      this.passwordErrorMessage.set('A senha deve ter no mínimo 6 caracteres.');}
    else {
      this.passwordErrorMessage.set('');
    }
  }

  nomeUpdateErrorMessage() {
    this.trimFormValues();
    if (this.nomeFormControl.hasError('required')) {
      this.nomeErrorMessage.set('Você precisa digitar um nome.');
    } else if (this.nomeFormControl.hasError('minlength')) {
      this.nomeErrorMessage.set('O nome deve ter no mínimo 3 caracteres.');
    } else {
      this.nomeErrorMessage.set('');
    }
  }

  operationNameUpdataErrorMessage() {
    this.trimFormValues();
    if (this.operationNameFormControl.hasError('required')) {
      this.operationNameErrorMessage.set('Você precisa digitar o nome da sua operação.');
    } else if (this.nomeFormControl.hasError('minlength')) {
      this.operationNameErrorMessage.set('O nome da deve ter no mínimo 6 caracteres.');
    } else {
      this.operationNameErrorMessage.set('');
    }
  }

  operationSlugUpdataErrorMessage() {
    this.trimFormValues();
    if (this.operationSlugFormControl.hasError('required')) {
      this.operationSlugErrorMessage.set('Você precisa digitar código de acesso da operação.');
    } else if (this.nomeFormControl.hasError('minlength')) {
      this.operationSlugErrorMessage.set('O código deve ter no mínimo 6 caracteres.');
    } else {
      this.operationSlugErrorMessage.set('');
    }
  }

  async onSubmit() {
    this.nomeFormControl.markAllAsTouched();
    if (this.registerForm.invalid) {
      return;
    }

    this.toggleLoading();

    try {
      this.colaboradorService.cadastrarNovoUsuarioEOperacao(
        this.nomeFormControl.value,
        this.emailFormControl.value,
        this.passwordFormControl.value,
        this.operationNameFormControl.value,
        this.operationSlugFormControl.value
      )
      this.snackService.sucesso('Cadastro realizado com sucesso!');

    } catch (error: any) {
      this.toggleLoading();
      this.snackService.erro(error.message || 'Erro durante o cadastro');
    }
  }
}
