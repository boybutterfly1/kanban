import {defineStore} from 'pinia'
import {computed, ref} from "vue";
import {Board, Column, Task} from "@/types/types";
import router from "@/router";
import {usePopupsFlagsStore} from "@/store/popupsFlags";

export const useKanbanStore = defineStore('kanban', () => {
  const popupFlagsStore= usePopupsFlagsStore()
  const statuses: string[] = ['Open', 'In Progress', 'Need Info', 'Testing', 'Closed']
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
          id: 1,
          name: '1',
          description: null,
          status: 'Open',
          startDate: '00.00.00',
          priority: 'Minor',
          author: 'Admin',
          columnId: 1
        },{
          id: 2,
          name: '2',
          description: null,
          status: 'Open',
          startDate: '00.00.00',
          priority: 'Trivial',
          author: 'Admin',
          columnId: 1
        }],
        boardId: 1
      },
        {
          id: 2,
          name: 'In Progress, Need Info',
          statuses: ['In Progress', 'Need Info'],
          tasksList: [{
            id: 3,
            name: '3',
            description: null,
            status: 'In Progress',
            startDate: '00.00.00',
            priority: 'Minor',
            author: 'Admin',
            columnId: 2
          },],
          boardId: 1
        }],
      availableStatuses: ['Testing', 'Closed']
    },
  ])
  const searchValue = ref<string>('')
  const loading = ref<boolean>(false)

  const searchTasks = computed<Task[]>((array: Task[]) => {
    return array.filter((task: Task) => task.name.toLowerCase().includes(searchValue.value.toLowerCase()))
  })
  const searchBoards = computed<Board[]>((array: Board[]) => {
    return array.filter((board: Board) => board.name.toLowerCase().includes(searchValue.value.toLowerCase()))
  })

  function changePage(route: string) {
    loading.value = true
    setTimeout(() => {
      router.push(route);
      loading.value = false
    }, 1000);
  }

  return {
    boards,
    statuses,
    searchValue,
    searchTasks,
    searchBoards,
    loading,
    changePage
  }
})