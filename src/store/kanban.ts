import {defineStore} from 'pinia'
import {ref} from "vue";
import {Board, Column} from "@/types/types";
import router from "@/router";
import {usePopupsFlagsStore} from "@/store/popupsFlags";

export const useKanbanStore = defineStore('kanban', () => {
  const popupFlagsStore= usePopupsFlagsStore()
  const priorities: string[] = ['Trivial', 'Minor', 'Normal', 'Critical', 'Blocker']
  const statuses: string[] = ['Open', 'In Progress', 'Need Info', 'Closed']
  const boards = ref<Board[]>([])
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
    // createBoard,
    // addNewColumn
  }
})