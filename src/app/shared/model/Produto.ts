export class Produto {
  id?: string;
  operationId!: string; // Operation ID to which this product belongs
  descricao!: string;
  precoPorUnidade!: number;
  tipoUnidade!: TipoUnidadeProduto;
  quantidadeEstoque!: number;
  status!: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string; // Creator UserProfileOperation ID
}

export type TipoUnidadeProduto = 'unidade' | 'litro' | 'quilo';
