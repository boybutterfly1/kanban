export interface Board {
  id: number | null
  name: string
  owner: string | null
  columns: Column[]
}
export interface Column {
  id: number | null
  name: string
  statuses : string[]
  tasksList: Task[]
}
export interface Task {
  id: number | null
  title: string
  description: string | null
  status: string
  statusChangeDate?: string
  startDate: string | null
  deadlineDate?: string
  priority: string
  author: string | null
  columnId: number | null
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