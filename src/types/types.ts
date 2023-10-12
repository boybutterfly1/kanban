export interface Board {
  id: number
  name: string
  owner: string | null
  columns: Column[]
}
export interface Column {
  id: number
  name: string
  statuses : string[] | null
  tasksList: Task[]
}
export interface Task {
  id: number
  title: string
  description: string | null
  status: string
  statusChangeDate?: string
  startDate: string
  deadlineDate?: string
  priority: string
  author: string
}
export interface User {
  id: number
  username: string
  login: string
  password: string
  regDate: string
}
export interface Option {
  value: string
  title: string
}