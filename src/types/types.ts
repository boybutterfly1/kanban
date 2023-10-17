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
  boardId: number | null
}
export interface Task {
  id: number | null
  name: string
  description: string | null
  status: string
  statusChangeDate?: string
  startDate: string
  deadlineDate?: string
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