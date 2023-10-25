import {defineStore} from 'pinia'
import {computed, ref} from "vue";
import {Board, Column, Task} from "@/types/types";
import router from "@/router";
import {usePopupsFlagsStore} from "@/store/popupsFlags";

export const useKanbanStore = defineStore('kanban', () => {
  const darkMode = ref(false)
  const statuses: string[] = ['Open', 'In Progress', 'Need Info', 'Testing', 'Closed']
  const priorities: Record<number, string> = {
    0: 'Trivial',
    1: 'Minor',
    2: 'Normal',
    3: 'Critical',
    4: 'Blocker'
  }
  const boards = ref<Board[]>([
    {
      id: 1,
      name: 'Test Kanban',
      owner: 'Admin',
      columns: [{
        id: 1,
        name: 'Open',
        statuses: ['Open'],
        tasksList: [{
          id: 'Task-1',
          name: 'First task',
          description: null,
          status: 'Open',
          startDate: 1697662800000,
          priority: 'Minor',
          author: 'Admin',
          columnId: 1
        },{
          id: 'Task-2',
          name: 'Second task',
          description: null,
          status: 'Open',
          startDate: 1697922000000,
          priority: 'Trivial',
          author: 'Admin',
          columnId: 1
        }],
      },
        {
          id: 2,
          name: 'In Progress, Need Info',
          statuses: ['In Progress', 'Need Info'],
          tasksList: [{
            id: 'Task-3',
            name: 'Third task',
            description: null,
            status: 'In Progress',
            startDate: 1698181200000,
            priority: 'Minor',
            author: 'Admin',
            columnId: 2
          },],
        }],
      availableStatuses: ['Testing', 'Closed']
    },
  ]);
  const openDropdowns = ref<string[]>([])
  const searchValue = ref<string>('')
  const isLoading = ref<boolean>(false)

  const searchTasks = computed<Task[]>((array: Task[]) => {
    return array.filter((task: Task) => task.name.toLowerCase().includes(searchValue.value.toLowerCase()))
  })
  const searchBoards = computed<Board[]>((array: Board[]) => {
    return array.filter((board: Board) => board.name.toLowerCase().includes(searchValue.value.toLowerCase()))
  })
  const selectedTasks = ref<Task[]>([])

  function changePage(route: string) {
    router.push(route).then(r => {})
    isLoading.value = true
    setTimeout(() => {
      isLoading.value = false
    }, 2500);
  }

  return {
    darkMode,
    boards,
    statuses,
    priorities,
    searchValue,
    searchTasks,
    searchBoards,
    selectedTasks,
    isLoading,
    openDropdowns,
    changePage
  }
})