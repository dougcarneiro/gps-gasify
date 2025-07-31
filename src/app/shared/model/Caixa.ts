export class Caixa {
  id?: string;
  operationId!: string; // Operation ID to which this product belongs
  initialBalance!: number;
  currentBalance!: number;
  closedBalance!: number | null;
  isActive!: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  ownerId?: string; // Creator UserProfileOperation ID
}
