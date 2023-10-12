import {defineStore} from 'pinia'
import {ref} from "vue";
import {Board, Column, Priority, Status, Task} from "@/types/types";

export const useKanbanStore = defineStore('kanban', () => {

  const testTask1 = ref<Task>({
    id: 5234621,
    title: 'Bebr',
    description: null,
    status: Status.open,
    startDate: '11.10.2023',
    priority: Priority.trivial,
    author: 'boybutterfly1'
  })
  const testTask2 = ref<Task>({
    id: 5234621,
    title: 'Bebr',
    description: null,
    status: Status.inProgress,
    startDate: '11.10.2023',
    priority: Priority.trivial,
    author: 'boybutterfly1'
  })
  const testTask3 = ref<Task>({
    id: 5234621,
    title: 'Bebr',
    description: null,
    status: Status.needInfo,
    startDate: '11.10.2023',
    priority: Priority.trivial,
    author: 'boybutterfly1'
  })
  const testTask4 = ref<Task>({
    id: 5234621,
    title: 'Bebr',
    description: null,
    status: Status.closed,
    startDate: '11.10.2023',
    priority: Priority.trivial,
    author: 'boybutterfly1'
  })
  const column1 = ref<Column>({
    id: 1,
    name: 'Closed',
    statuses : null,
    tasksList: [testTask1.value, testTask2.value, testTask3.value, testTask4.value]
  })
  const column2 = ref<Column>({
    id: 1,
    name: 'Open',
    statuses : null,
    tasksList: [testTask1.value, testTask2.value]
  })
  const board1 = ref<Board>({
    id: 1,
    name: 'Kanban Board',
    owner: 'Bebr',
    columns: [column1.value, column2.value]
  })
  const board2 = ref<Board>({
    id: 2,
    name: 'Kanban Board',
    owner: 'Negr',
    columns: []
  })
  const boards = ref<Board[]>([
    board1.value,
    board2.value
  ])
  return {
    boards,
    board1,
    board2
  }
})