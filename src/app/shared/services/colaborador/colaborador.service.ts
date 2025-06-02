import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IAuthService } from '../../../interfaces/auth-service.interface';
import { OperationFirebaseService } from '../operation-firebase/operation-firebase.service';
import { UserProfileFirebaseService } from '../user-profile-firebase/user-profile-firebase.service';
import { UserProfileOperationFirebaseService } from '../user-profile-operation-firebase/user-profile-operation-firebase.service';
import { MensagemSnackService } from '../message/snack.service';
import { getCurrentUserData, saveUserData } from '../../../utils/localStorage';
import { UserProfile } from '../../model/UserProfile';
import { Operation } from '../../model/Operation';
import { UserProfileOperation } from '../../model/UserProfileOperation';
import { Observable } from 'rxjs';
import { Colaborador } from '../../model/Colaborador';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {
  constructor(
    private authService: IAuthService,
    private operationService: OperationFirebaseService,
    private userProfileService: UserProfileFirebaseService,
    private userProfileOperationService: UserProfileOperationFirebaseService,
    private snackService: MensagemSnackService,
    private router: Router
  ) { }

  async cadastrarColaborador(
    nome: string,
    email: string,
    funcao: string,
    password: string,
  ): Promise<void> {
    // Simplified version of the logic provided for registering a new user,
    // adapted for adding a "colaborador" (employee/collaborator).
    // This assumes that a "colaborador" is a new user associated with an existing operation.
    // Further adjustments might be needed based on the exact requirements for "colaborador" registration.

    try {
      // 1. Register the new user (colaborador)
      // For a "colaborador", we might not need a new password, or it might be auto-generated / set later.
      // This part needs clarification: Does a "colaborador" have their own login credentials initially?
      // Assuming for now that a "colaborador" is a user who will set their password later or has a default.
      // The authService.register method might need to be adapted or a different method used.
      // For this example, I'm creating a placeholder password.

      const operationRoleParent: UserProfileOperation | undefined = await this.userProfileOperationService.verificarSeUserPodeCriar(getCurrentUserData().roleId).toPromise();

      if (!operationRoleParent) {
        throw new Error('Você não tem permissão para cadastrar um colaborador.');
      }


      const registerResult = await this.authService.register(
        nome,
        email,
        password
      ).toPromise();

      if (!registerResult || !registerResult.user) {
        throw new Error('Erro ao registrar novo colaborador como usuário');
      }

      // 2. Create UserProfile for the "colaborador"
      const userProfileResult = await this.userProfileService.cadastrar({
        name: nome,
        email: email,
        userId: registerResult.user.id,
      } as UserProfile).toPromise();

      if (!userProfileResult || !userProfileResult.id) {
        throw new Error('Erro ao criar perfil para o colaborador');
      }

      // 3. Link UserProfile to Operation
      // The "function" (role) and "isAdmin" status would be specific to the "colaborador"
      await this.userProfileOperationService.cadastrar({
        userProfileId: userProfileResult.id,
        operationId: operationRoleParent.operationId, // ID of the existing operation
        function: funcao, // Role of the "colaborador"
        isAdmin: false, // Assuming "colaborador" is not an admin by default
      } as UserProfileOperation).toPromise();

      this.snackService.sucesso('Colaborador cadastrado com sucesso');
      // What happens after a "colaborador" is registered? Navigate somewhere?
      // this.router.navigate(['/some-path']); // Example navigation

    } catch (error: any) {
      this.snackService.erro(error.message || 'Erro durante o cadastro do colaborador');
      // Rethrow or handle as needed
      throw error;
    }
  }

  // The following is the direct adaptation of the provided logic.
  // It seems to be for a new user *and* a new operation, which might not be what's intended for "colaborador.service.ts".
  // If this service is strictly for "colaboradores" of an *existing* operation, the logic above is more appropriate.
  // If a "colaborador" can also create a new operation, then this more complex logic might be relevant,
  // but it would need to be invoked with all necessary form controls or parameters.

  async cadastrarNovoUsuarioEOperacao(
    nomeFormControlValue: string,
    emailFormControlValue: string,
    passwordFormControlValue: string,
    operationNameFormControlValue: string,
    operationSlugFormControlValue: string
  ): Promise<void> {
    try {
      // 1. Registro do usuário
      const registerResult = await this.authService.register(
        nomeFormControlValue,
        emailFormControlValue,
        passwordFormControlValue
      ).toPromise();

      if (!registerResult || !registerResult.user) {
        throw new Error('Erro ao registrar usuário');
      }

      // 2. Cadastro da operação
      const operationResult = await this.operationService.cadastrar({
        name: operationNameFormControlValue,
        slug: operationSlugFormControlValue,
        ownerId: registerResult.user.id,
      } as Operation).toPromise();

      if (!operationResult) {
        // This error message is based on the original component's logic,
        // implying that if cadastrar returns falsy, it's likely due to an existing slug.
        throw new Error('Já existe uma operação com esse código de acesso.');
      }

      // Verificar se os IDs existem antes de criar a relação (as in original component)
      if (!operationResult.id) {
        throw new Error('ID da operação não foi gerado corretamente');
      }

      // 3. Cadastro do perfil do usuário
      const userProfileResult = await this.userProfileService.cadastrar({
        name: nomeFormControlValue,
        email: emailFormControlValue,
        userId: registerResult.user.id,
      } as UserProfile).toPromise();

      if (!userProfileResult || !userProfileResult.id) {
        throw new Error('Erro ao criar perfil do usuário');
      }

      // As per original component, check userProfileResult.id explicitly as well
      if (!userProfileResult.id) {
        throw new Error('ID do perfil do usuário não foi gerado corretamente');
      }

      // 4. Criar relação usuário-operação
      const userProfileOperationResult = await this.userProfileOperationService.cadastrar({
        userProfileId: userProfileResult.id,
        operationId: operationResult.id, // Safe to use due to checks above
        function: "proprietário", // Assuming this is for the owner
        isAdmin: true, // Assuming owner is admin
      } as UserProfileOperation).toPromise();

      if (!userProfileOperationResult || !userProfileOperationResult.id) {
        throw new Error('Erro ao criar relação usuário-operação');
      }

      // As per original component, check userProfileResult.id explicitly as well
      if (!userProfileOperationResult.id) {
        throw new Error('ID do relação usuário-operação não foi gerado corretamente');
      }

      this.snackService.sucesso('Cadastro realizado com sucesso');
      saveUserData({...registerResult, operationId: operationResult.id, roleId: userProfileOperationResult.id, role: 'proprietário'});
      this.router.navigate(['/']);

    } catch (error: any) {
      this.snackService.erro(error.message || 'Erro durante o cadastro');
      throw error; // Rethrow to allow the component to handle UI changes like loading state
    }
  }

  carregarColaboradores(operationId: string): Observable<Colaborador[]> {
    return this.userProfileOperationService.listarColaboradoresComDetalhes(operationId);
  }
}
