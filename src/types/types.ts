export interface Board {
  id: number | null
  name: string
  owner: string | null
  columns: Column[]
  availableStatuses: string[]
}
export interface Column {
  id: number | null
  name: string
  statuses : string[]
  tasksList: Task[]
}
export interface Task {
  id: string | null
  name: string
  description: string | null
  status: string
  statusChangeDate?: number | null
  startDate: number | null
  deadlineDate?: number | null
  priority: keyof typeof Priorities
  author: string
  columnId: number | null
}
export interface User {
  id: number
  username: string
  login: string
  password: string
  regDate: string
}
export enum Priorities {
  '' = 0,
  Trivial = 1,
  Minor = 2,
  Normal = 3,
  Critical = 4,
  Blocker = 5
}