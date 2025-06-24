export class Colaborador {
  id?: string;
  nome!: string;
  funcao!: 'proprietário' | 'administrador' | 'gerente' | 'frentista';
  status?: boolean;
  senha?: string;
  email!: string;
}
