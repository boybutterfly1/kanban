<template>
  <div
    class="column"
    @dragover.prevent
    @dragenter.prevent
    @drop="onDrop($event, column.id)"

  >
    <div class="column__header">
      <div class="column__header__name">
        <span>{{column.name}}</span>
        {{column.tasksList.length}}
      </div>
      <div class="column__header__buttons">
        <img
            @click="newTaskPopupIsOpen = true"
            src="https://img.icons8.com/ios/50/000000/plus-math--v1.png"
            alt="add task"
        >
        <img src="https://img.icons8.com/ios-glyphs/50/000000/more.png" alt="edit column">
      </div>
    </div>
    <hr>
    <task-comp
        v-for="task in column.tasksList"
        :key="task.id"
        :task="task"
        @drag-start="startDrag"
    />
    <button
      @click="newTaskPopupIsOpen = true"
    >
      <img width="17" src="https://img.icons8.com/ios/50/000000/plus-math--v1.png" alt="">
      <span>Add task</span>
    </button>
  </div>
  <my-popup
      :is-open="newTaskPopupIsOpen"
      @close="newTaskPopupClose"
  >
    <form class="new-task" @submit.prevent>
      <my-input
          v-model="newTask.title"
          type="text"
          placeholder="Task title"
      />
      <textarea
          v-model="newTask.description"
          placeholder="Task description"
      />
      <my-select
          :array="column.statuses"
          v-model="newTask.status"
          select-name="Task status"
      />
      <my-select
          :array="kanbanStore.priorities"
          v-model="newTask.priority"
          select-name="Task priority"
      />
      <my-button
          @click="addNewTask"
      >
        Add
      </my-button>
    </form>
  </my-popup>
</template>

<script setup lang="ts">
import TaskComp from "@/components/TaskComp.vue";
import {useKanbanStore} from "@/store/kanban";
import {Board, Column, Task} from "@/types/types";
import {computed, ref} from "vue";
import {useUsersStore} from "@/store/users";
import MyPopup from "@/components/UI/MyPopup.vue";
import MyButton from "@/components/UI/MyButton.vue";
import MySelect from "@/components/UI/MySelect.vue";
import MyInput from "@/components/UI/MyInput.vue";

const usersStore = useUsersStore()
const kanbanStore = useKanbanStore()
const props = defineProps<{
  column: Column
  board: Board
}>()

const newTask = ref<Task>({
  id: 0,
  title: '',
  description: '',
  status: '',
  startDate: null,
  priority: '',
  author: usersStore.currentUser? usersStore.currentUser.username : null,
  columnId: null
})
const newTaskPopupIsOpen = ref<boolean>(false)

function newTaskPopupClose() {
  newTask.value.title = ''
  newTask.value.description = ''
  newTaskPopupIsOpen.value = false
}
function addNewTask() {
  if (newTask.value.title && newTask.value.status && newTask.value.priority) {
    newTask.value.id = Date.now()
    newTask.value.startDate = new Date().toDateString()
    newTask.value.columnId = props.column.id
    props.column.tasksList.push({...newTask.value})
    newTaskPopupClose()
  }
}

const draggedTask = ref<Task | null>(null)
function getDraggingTask(taskId: number | null) {
  props.board.columns.forEach((column: Column) => {
    if (column.tasksList.find((task: Task) => task.id === taskId)) {
      draggedTask.value = column.tasksList.find((task: Task) => task.id === taskId)
    }
  })
}
function deleteTaskFromPrevColumn(prevColumnId: number | null) {
  const prevColumn = props.board.columns.find((column: Column) => column.id === prevColumnId)
  if (prevColumn) {
    prevColumn.tasksList = prevColumn.tasksList.filter((task: Task) => task.id !== draggedTask.value)
  }
}
function handleDrop(id: number | null) {
  deleteTaskFromPrevColumn(draggedTask.value.columnId)
  let column = null
  column = props.board?.columns.find((column: Column) => column.id === id)
  if (column && draggedTask.value) {
    draggedTask.value.columnId = column.id
    column.tasksList.push({...draggedTask.value})
  }
}
function startDrag(event: DragEvent, taskId: number) {
  const dataTransfer = event.dataTransfer
  if (dataTransfer) {
    dataTransfer.dropEffect = "move"
    dataTransfer.effectAllowed = 'move'
    dataTransfer.setData('taskId', taskId.toString())
  }
}
function onDrop(event: DragEvent, columnId: number | null) {
  const dataTransfer = event.dataTransfer
  if (dataTransfer) {
    const taskId = dataTransfer.getData('taskId')
    getDraggingTask(+taskId)
    handleDrop(columnId)
  }
}
</script>

<style lang="sass" scoped>
.column
  display: flex
  flex-direction: column
  width: 250px
  gap: 10px
  margin-right: 30px
  &__header
    display: flex
    align-items: center
    justify-content: space-between
    &__name
      & span
        font-weight: bold
    &__buttons
      display: inline
      gap: 10px
      & img
        width: 17px
        margin-left: 10px
        cursor: pointer
        border-radius: 5px
        &:hover
          background-color: #a7adb2
  & button
    padding: 5px 10px
    display: flex
    background-color: rgba(0, 0, 0, 0)
    width: 90px
    border: 0
    cursor: pointer
    &:hover
      border-radius: 6px
      background-color: #a7adb2
.new-task
  display: flex
  flex-direction: column
  textarea
    width: 300px
    height: 100px
    font-family: 'Open Sans', sans-serif
    margin-bottom: 10px
    border-radius: 5px
    border: 1px solid #d9d9d9
    padding: 2px 5px
    &:focus
      outline: none
      box-shadow: 0 0 5px #3f74e3
hr
  width: 255px
  margin-bottom: 10px
  border: 0
  height: 1px
  background-color: #b7b6b6
</style>

