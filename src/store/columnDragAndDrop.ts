import {defineStore} from 'pinia'
import {Column} from "@/types/types";
export const useColumnDragAndDropStore = defineStore('columnDragAndDrop', () => {
  function onDrag(event: DragEvent, dragColumn: Column) {

  }
  function dragOver() {

  }
  function dragLeave() {

  }
  function onDrop() {

  }
  function dragEnd() {

  }
  return {
    onDrag,
    onDrop,
    dragEnd
  }
})