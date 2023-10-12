import {defineStore} from 'pinia'
import {ref} from "vue";
import {Board, Column, Task} from "@/types/types";

export const useKanbanStore = defineStore('kanban', () => {
  const priorities: string[] = ['Trivial', 'Minor', 'Normal', 'Critical', 'Blocker']
  const statuses: string[] = ['Open', 'In Progress', 'Need Info', 'Closed']
  const testTask1 = ref<Task>({
    id: 5234621,
    title: 'Bebr',
    description: null,
    status: 'Open',
    startDate: '11.10.2023',
    priority: 'Minor',
    author: 'boybutterfly1'
  })
  const testTask2 = ref<Task>({
    id: 5234621,
    title: 'Bebr',
    description: null,
    status: 'In Progress',
    startDate: '11.10.2023',
    priority: 'Critical',
    author: 'boybutterfly1'
  })
  const testTask3 = ref<Task>({
    id: 5234621,
    title: 'Bebr',
    description: null,
    status: 'Need Info',
    startDate: '11.10.2023',
    priority: 'Normal',
    author: 'boybutterfly1'
  })
  const testTask4 = ref<Task>({
    id: 5234621,
    title: 'Bebr',
    description: null,
    status: 'Closed',
    startDate: '11.10.2023',
    priority: 'Trivial',
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
    board2,
    priorities,
    statuses
  }
})