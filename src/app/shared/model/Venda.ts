import { ItemVenda } from "./ItemVenda";
import { MetodoPagamento } from "./MetodoPagamento";

export class Venda {
  id?: string;
  caixaId!: string;
  itens!: ItemVenda[];
  totalVenda!: number;
  cliente?: string; // Nome ou CPF
  metodoPagamento!: MetodoPagamento;
  createdAt?: Date;
  ownerId?: string;
  operationId?: string;
}

