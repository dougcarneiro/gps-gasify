export class Task {
  id?: number;
  titulo?: string;
  descricao?: string;
  prioridade?: 'baixa' | 'normal' | 'media' | 'alta';
  status?: 'feito' | 'pendente';
  donoId?: string; // FK para Usuario
  dataCriacao?: Date;
  dueDate?: Date;
  dataAlteracao?: Date;
  removido?: boolean; // Exclusão lógica

}
