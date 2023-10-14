import {defineStore} from "pinia";
import {ref} from "vue";

export const usePopupsFlagsStore = defineStore('popupFlags', () => {
  const createBoardPopupIsOpen = ref<boolean>(false)
  const newColumnPopupIsOpen = ref<boolean>(false)
  return {
    createBoardPopupIsOpen,
    newColumnPopupIsOpen,
  }
})