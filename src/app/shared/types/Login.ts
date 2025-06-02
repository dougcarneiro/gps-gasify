import { Operation } from "../model/Operation"

export type Login = {
  accessToken: string
  user: User
  operationId: string
  role: 'proprietário' | 'administrador' | 'gerente' | 'frentista'
  roleId: string
}

type User = {
  id: string,
  email: string
}
