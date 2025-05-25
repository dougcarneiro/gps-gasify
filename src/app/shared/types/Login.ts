export type Login = {
  accessToken: string,
  user: User
}

type User = {
  id: string,
  email: string
}
