import {defineStore} from 'pinia'
import {ref} from "vue";
import {Board, Column, Task} from "@/types/types";

export const useTaskDragAndDropStore = defineStore('taskDragAndDrop', () => {
  const dragTask = ref<Task | null>(null)
  const board = ref<Board | null>(null)
  function onDrag(event: DragEvent, dragTaskId: number) {
    const dataTransfer = event.dataTransfer
    if (dataTransfer) {
      dataTransfer.dropEffect = "move"
      dataTransfer.effectAllowed = 'move'
      dataTransfer.setData('dragTaskId', dragTaskId.toString())
    }
  }
  function onDrop(event: DragEvent, dropColumnId: number) {
    const dataTransfer = event.dataTransfer
    if (dataTransfer) {
      const draggedTaskId: number = +(dataTransfer.getData('dragTaskId'))
      getDraggedTask(draggedTaskId)
      dragTask.value ? deleteTaskFromDragColumn(dragTask.value.columnId) : null
      addTaskToDropColumn(dropColumnId)
    }
  }
  function getDraggedTask(draggedTaskId: number) {
    board.value ? board.value.columns.forEach((column: Column) => {
      let foundTask = column.tasksList.find((task: Task) => task.id === draggedTaskId)
      if (foundTask) {
        dragTask.value = foundTask
      }
    }) : null
  }
  function addTaskToDropColumn(dropColumnId: number) {
    let dropColumn = null
    dropColumn = board.value?.columns.find((column: Column) => column.id === dropColumnId)
    if (dropColumn && dragTask.value) {
      dragTask.value.columnId = dropColumn.id
      dragTask.value.status = dropColumn.statuses[0]
      dragTask.value.statusChangeDate = Date.now().toLocaleString()
      dropColumn.tasksList.push({...dragTask.value})
    }
  }
  function deleteTaskFromDragColumn(dragColumnId: number | null) {
    let dragColumn = null
    board.value? dragColumn = board.value.columns.find((column: Column) => column.id === dragColumnId) : null
    if (dragColumn) {
      dragColumn.tasksList = dragColumn.tasksList.filter((task: Task) => {
        return dragTask.value ? task.id !== dragTask.value.id : null
      })
    }
  }
  return {
    dragTask,
    board,
    onDrag,
    onDrop
  }
})