export class Colaborador {
  id?: string;
  nome!: string;
  funcao!: 'proprietário' | 'administrador' | 'gerente' | 'frentista';
  senha?: string;
  email!: string;
}
