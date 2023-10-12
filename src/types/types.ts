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
  status: Status
  statusChangeDate?: string
  startDate: string
  deadlineDate?: string
  priority: Priority
  author: string
}
export interface User {
  id: number
  username: string
  login: string
  password: string
  regDate: string
}
export enum Priority {
  trivial = 'Trivial',
  minor = 'Minor',
  normal = 'Normal',
  critical = 'Critical',
  blocker = 'Blocker'
}
export enum Status {
  open = 'Open',
  inProgress = 'In Progress',
  needInfo = 'Need Info',
  closed = 'Closed',
}