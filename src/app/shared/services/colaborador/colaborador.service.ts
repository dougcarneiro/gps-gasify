import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IAuthService } from '../../../interfaces/auth-service.interface';
import { OperationFirebaseService } from '../operation-firebase/operation-firebase.service';
import { UserProfileFirebaseService } from '../user-profile-firebase/user-profile-firebase.service';
import { UserProfileOperationFirebaseService } from '../user-profile-operation-firebase/user-profile-operation-firebase.service';
import { getCurrentUserData, saveUserData } from '../../../utils/localStorage';
import { UserProfile } from '../../model/UserProfile';
import { Operation } from '../../model/Operation';
import { UserProfileOperation } from '../../model/UserProfileOperation';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { UserProfileListing } from '../../types/UserProfileListing';
import { checkAdmin } from '../../../colaboradores/utils/checkAdmin';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {
  constructor(
    private authService: IAuthService,
    private operationService: OperationFirebaseService,
    private userProfileService: UserProfileFirebaseService,
    private userProfileOperationService: UserProfileOperationFirebaseService,
    private router: Router
  ) { }

  async verificarSeTemPermissao(): Promise<UserProfileOperation> {
    const operationRoleParent: UserProfileOperation | undefined = await this.verificarPermissao();

    if (!operationRoleParent) {
      throw new Error('Você não tem permissão para realizar essa operação');
    }

    return operationRoleParent;
  }

  async verificarPermissao(): Promise<UserProfileOperation | undefined> {
    return await this.userProfileOperationService.verificarUserAdmin(getCurrentUserData().roleId).toPromise();
  }

  async cadastrarColaborador(
    nome: string,
    email: string,
    funcao: string,
    password: string,
  ): Promise<void> {
    const operationRoleParent: UserProfileOperation | undefined = await this.verificarSeTemPermissao();
    try {

      // 1. Checks if user is already on the platform
      const alreadyRegistered = await this.userProfileService.pesquisarPorEmail(email).toPromise();
      if (!alreadyRegistered) {
        const registerResult = await this.authService.register(
          nome,
          email,
          password
        ).toPromise();
        if (!registerResult || !registerResult.user) {
          throw new Error('Erro ao registrar novo colaborador como usuário');
        }

      }

      // 2. Create UserProfile for the "colaborador"
      const userProfileResult = await this.userProfileService.obterOuCriar({
        name: nome,
        email: email,
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
        isAdmin: checkAdmin(funcao), // Check if the role is admin
      } as UserProfileOperation).toPromise();

      // What happens after a "colaborador" is registered? Navigate somewhere?
      // this.router.navigate(['/some-path']); // Example navigation

    } catch (error: any) {
      // Rethrow or handle as needed
      throw error;
    }
  }


  async atualizarColaborador(dados: UserProfileListing): Promise<void> {
    await this.verificarSeTemPermissao();
    try {
      const userProfile = await this.userProfileService.pesquisarPorEmail(dados.email!).toPromise();
      if (!userProfile || !userProfile.id) {
        throw new Error('Perfil do colaborador não encontrado');
      }

      await this.userProfileService.atualizar({
        id: userProfile.id,
        name: dados.name,
        email: dados.email,
      } as UserProfile).toPromise();

      await this.userProfileOperationService.atualizar({
        id: dados.idUserProfileOperation,
        function: dados.function,
      } as UserProfileOperation).toPromise();

    } catch (error: any) {
      throw error;
    }
  }
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

      saveUserData({ ...registerResult, operationId: operationResult.id, roleId: userProfileOperationResult.id, role: 'proprietário' });
      this.router.navigate(['/']);

    } catch (error: any) {
      throw error; // Rethrow to allow the component to handle UI changes like loading state
    }
  }

  carregarColaboradores(operationId: string): Observable<UserProfile[]> {
    return this.userProfileOperationService.listarColaboradoresComDetalhes(operationId);
  }

  async remover(id: string): Promise<Observable<void>> {
    await this.verificarSeTemPermissao();
    try {
      return this.userProfileOperationService.remover(id).pipe(
        // Show success message on completion
        tap(() => {
          // Handle errors and show error message
          catchError((error: any) => {
            throw error;
          })
        })
      );
    } catch (error: any) {
      throw error;
    }
  }
}
