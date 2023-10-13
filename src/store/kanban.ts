import {defineStore} from 'pinia'
import {ref} from "vue";
import {Board, Column, Task} from "@/types/types";

export const useKanbanStore = defineStore('kanban', () => {
  const priorities: string[] = ['Trivial', 'Minor', 'Normal', 'Critical', 'Blocker']
  const statuses: string[] = ['Open', 'In Progress', 'Need Info', 'Closed']
  const boards = ref<Board[]>([])
  return {
    boards,
    priorities,
    statuses
  }
})