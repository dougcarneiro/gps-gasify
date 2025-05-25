import { Component, signal } from '@angular/core';
import { MensagemSnackService } from '../../shared/services/message/snack.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { saveUserData } from '../../utils/localStorage';
import { IAuthService } from '../../interfaces/auth-service.interface';


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

    readonly registerForm = new FormGroup({
      nome: this.nomeFormControl,
      email: this.emailFormControl,
      password: this.passwordFormControl
  });

  submitButtonStatus = false;
  submitButtonText = 'Entrar';
  isLoading = false;

  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');
  nomeErrorMessage = signal('');

  constructor(
    private authService: IAuthService,
    private snackService: MensagemSnackService,
    private router: Router,
  ) { }

  checkForm() {
    this.trimFormValues();
    this.emailUpdateErrorMessage();
    this.passwordUpdateErrorMessage();
    this.nomeUpdateErrorMessage();
    this.submitButtonStatus = this.nomeFormControl.valid && this.emailFormControl.valid && this.passwordFormControl.valid;
  }

  toggleLoading() {
    this.isLoading = !this.isLoading;
    this.submitButtonStatus = !this.submitButtonStatus;
    this.submitButtonText = this.isLoading ? '' : 'Entrar';
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
    this.nomeFormControl.setValue(this.nomeFormControl.value.trim());
    this.emailFormControl.setValue(this.emailFormControl.value.trim());
    this.passwordFormControl.setValue(this.passwordFormControl.value.trim());
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
      this.nomeErrorMessage.set('O nome deve ter no mínimo 6 caracteres.');
    } else {
      this.nomeErrorMessage.set('');
    }
  }

  onSubmit() {
    this.nomeFormControl.markAllAsTouched();
    if (this.registerForm.invalid) {
      return
    }

    this.toggleLoading();

    this.authService.register(
      this.nomeFormControl.value!,
      this.emailFormControl.value!,
      this.passwordFormControl.value!,
      ).subscribe({
      next: (register) => {
        this.snackService.sucesso('Cadastro realizado com sucesso');
        saveUserData(register);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.toggleLoading();
        this.snackService.erro(error.message);
      }
    });
  }
}
