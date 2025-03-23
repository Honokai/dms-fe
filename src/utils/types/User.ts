export type User = {
  userId: number
  name: string
  email: string
  password: string
  groups: {
    groupId: number
    name: string
  }[]
}