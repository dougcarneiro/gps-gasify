import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MensagemSnackService } from '../../shared/services/message/snack.service';
import { Router } from '@angular/router';
import { saveUserData } from '../../utils/localStorage';
import { IAuthService } from '../../interfaces/auth-service.interface';


@Component({
  selector: 'app-login',
  standalone: false,

  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  submitButtonStatus = false;
  submitButtonText = 'Entrar';
  isLoading = false;

  emailFormControl: FormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl: FormControl = new FormControl('', [Validators.required]);

  readonly loginForm = new FormGroup({
    email: this.emailFormControl,
    password: this.passwordFormControl
  });

  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');

  constructor(
    private authService: IAuthService,
    private snackService: MensagemSnackService,
    private router: Router,
  ) { }

  checkForm() {
    this.trimFormValues();
    this.updateErrorMessage();
    this.onBlur();
    this.submitButtonStatus = this.emailFormControl.valid && this.passwordFormControl.valid;
  }

  updateErrorMessage() {
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

  }

  onBlur() {
    if (this.passwordFormControl.hasError('required')) {
      this.passwordErrorMessage.set('Digite sua senha.');
    } else {
      this.passwordErrorMessage.set('');
    }
  }

  toggleLoading() {
    this.isLoading = !this.isLoading;
    this.submitButtonStatus = !this.submitButtonStatus;
    this.submitButtonText = this.isLoading ? '' : 'Entrar';
  }

  onSubmit() {
    this.toggleLoading();

    this.authService.login(
      this.emailFormControl.value, this.passwordFormControl.value).subscribe({
      next: (login) => {
        this.snackService.sucesso('Login realizado com sucesso');
        saveUserData(login);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.snackService.erro(error.message);
        this.toggleLoading();
      }
    });
  }
}
