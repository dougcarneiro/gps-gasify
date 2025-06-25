export const ADMIN_ROLES: string[] = ['proprietário', 'administrador', 'gerente'];

export function checkAdmin(funcao: string | undefined): boolean {
  return funcao ? ADMIN_ROLES.includes(funcao || '') : false;
}
