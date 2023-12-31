import {defineStore} from 'pinia'
import {ref} from "vue";
import {Board, Column, Task} from "@/types/types";
export const useTaskDragAndDropStore = defineStore('taskDragAndDrop', () => {
  const dragTask = ref<Task | null>(null)
  const board = ref<Board | null>(null)
  const isGrabbed = ref<boolean>(false)
  const isDroppableArea = ref<boolean>(true)
  function onDrag(event: DragEvent, task: Task) {
    dragTask.value = task
    isGrabbed.value = true
    isDroppableArea.value = true
    const dataTransfer = event.dataTransfer
    if (dataTransfer) {
      dataTransfer.dropEffect = "move"
      dataTransfer.effectAllowed = 'move'
    }
  }
  function onDrop(column: Column, dropBoard: Board, status?: string) {
    board.value = dropBoard
    if (dragTask.value) {
      if (status) {
        dragTask.value.status = status
      }
      deleteTaskFromDragColumn(dragTask.value.columnId)
      addTaskToDropColumn(column)
    }
    isGrabbed.value = false
    isDroppableArea.value = false
  }
  function addTaskToDropColumn(dropColumn: Column) {
    if (dropColumn && dragTask.value) {
      dragTask.value.columnId = dropColumn.id
      if (dropColumn.statuses.length === 1) {
        dragTask.value.status = dropColumn.statuses[0]
      }
      dragTask.value.statusChangeDate = Date.now()
      dropColumn.tasksList.push(dragTask.value)
    }
  }
  function deleteTaskFromDragColumn(dragColumnId: number | null) {
    let dragColumn = board.value? board.value.columns.find((column: Column) => {
      return column.id === dragColumnId || null
    }) : null
    if (dragColumn) {
      dragColumn.tasksList = dragColumn.tasksList.filter((task: Task) => {
        return dragTask.value ? task.id !== dragTask.value.id : null
      })
    }
  }
  return {
    dragTask,
    board,
    isGrabbed,
    isDroppableArea,
    onDrag,
    onDrop
  }
})