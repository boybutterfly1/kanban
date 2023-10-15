import {defineStore} from 'pinia'
import {computed, ref} from "vue";
import {Board, Column, Task} from "@/types/types";
import router from "@/router";
import {usePopupsFlagsStore} from "@/store/popupsFlags";

export const useKanbanStore = defineStore('kanban', () => {
  const popupFlagsStore= usePopupsFlagsStore()
  const priorities: string[] = ['Trivial', 'Minor', 'Normal', 'Critical', 'Blocker']
  const statuses: string[] = ['Open', 'In Progress', 'Need Info', 'Closed']
  const boards = ref<Board[]>([])
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

  // const search = computed<Task[] | Board[]>((array: Task[] | Board[]) => {
  //   return array.filter((item: Task | Board) => item.name.toLowerCase().includes(searchValue.value.toLowerCase()))
  // })

  // function createBoard(newBoard: Board) {
  //   newBoard.id = Date.now()
  //   boards.value.push({...newBoard})
  //   popupFlagsStore.createBoardPopupIsOpen = false
  //   router.push(`/board${newBoard.id}`)
  // }
  // function addNewColumn(newColumn: Column, board: Board) {
  //   newColumn.id = Date.now()
  //   board.columns.push({...newColumn})
  // }

  return {
    boards,
    priorities,
    statuses,
    searchValue,
    searchTasks,
    searchBoards,
    loading,
    changePage
    // createBoard,
    // addNewColumn
  }
})