export class UserProfileOperation {
  id?: string;
  operationId?: string;
  userProfileId?: string;
  function?: 'proprietário' | 'administrador' | 'gerente' | 'frentista';
  isAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
