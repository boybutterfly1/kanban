<template>
  <div
      @dragover.prevent
      @dragenter.prevent
      draggable="true"
      @dragstart="columnDADStore.onDrag($event, column)"
      @dragend="columnDADStore.dragEnd"
  >
    <div
        v-if="column"
        class="column"
        @dragover.prevent
        @dragenter.prevent
        @drop="column.statuses.length === 1 ? taskDADStore.onDrop(column, board): null"
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
          v-for="task in sortAndSearchBy2(sortValue)"
          :key="task.id"
          :task="task"
      />
      <div v-if="isDropArea">
        <div v-for="status in column.statuses">
          <div
              class="column__drop-area"
              :class="{ 'column__drop-area__dragover': isDragOver[status] }"
              @dragover="setDragOver(status,true)"
              @dragleave="setDragOver(status, false)"
              @drop="taskDADStore.onDrop(column, board, status); setDragOver(status, false)"
          >
            <span>{{ status }}</span>
          </div>
        </div>
      </div>
      <button
          v-if="column.id === board.columns[0].id"
          class="column__add-task-btn"
          @click="newTaskPopupIsOpen = true"
      >
        <img src="https://img.icons8.com/ios/50/000000/plus-math--v1.png" alt="">
        Add task
      </button>
    </div>
  </div>
  <my-popup
      :is-open="newTaskPopupIsOpen"
      @close="newTaskPopupClose"
  >
    <form class="new-task" @submit.prevent>
      <my-input
          v-model="newTask.name"
          type="text"
          placeholder="Task title"
      />
      <textarea
          v-model="newTask.description"
          placeholder="Task description"
      />
      <my-select
          v-if="column.statuses.length > 1"
          :array="column.statuses"
          v-model="newTask.status"
          select-name="Task status"
      />
      <my-input
          v-else
          disabled
          :placeholder="column.statuses[0]"
          v-model="newTask.status"
      />
      <my-select
          :enum="Priorities"
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
import {Board, Column, Priorities, Task} from "@/types/types";
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {useUsersStore} from "@/store/users";
import MyPopup from "@/components/UI/MyPopup.vue";
import MyButton from "@/components/UI/MyButton.vue";
import MySelect from "@/components/UI/MySelect.vue";
import MyInput from "@/components/UI/MyInput.vue";
import {useTaskDragAndDropStore} from "@/store/taskDragAndDrop";
import {usePopupsFlagsStore} from "@/store/popupsFlags";
import {useColumnDragAndDropStore} from "@/store/columnDragAndDrop";
const taskDADStore = useTaskDragAndDropStore()
const columnDADStore = useColumnDragAndDropStore()
const usersStore = useUsersStore()
const kanbanStore = useKanbanStore()
const props = defineProps<{
  column: Column
  board: Board
  sortValue: string
}>()
const newTask = ref<Task>({
  id: null,
  name: '',
  description: '',
  status: '',
  startDate: '',
  priority: '',
  author: usersStore.currentUser? usersStore.currentUser.username : '',
  columnId: props.column.id
})
const newTaskPopupIsOpen = ref<boolean>(false)
const isDragOver = ref<Record<string, boolean>>({})
const setDragOver = (status: string, value: boolean) => {
  isDragOver.value[status] = value;
};
const isDropArea = computed<boolean>(() => {
  return  isColumnNotOpen() && isDragColNotDropCol() && taskDADStore.isDroppableArea && props.column.statuses.length > 1
})
function isColumnNotOpen(): boolean {
  return !props.column.statuses.some((status: string) => status === 'Open')
}
function isDragColNotDropCol():boolean {
  return taskDADStore.dragTask ? taskDADStore.dragTask.columnId !== props.column.id : false
}
const searchTasks = computed<Task[]>(() => {
  return props.column.tasksList.filter((task: Task) => task.name.toLowerCase().includes(kanbanStore.searchValue.toLowerCase()))
})
function sortAndSearchBy2(value: string):Task[] {
  const values: Record<string, Task[]> = {
    'Priority' : [...searchTasks.value].sort((task1: Task, task2: Task) => {
      return Priorities[task1.priority] - Priorities[task2.priority];
    }).reverse(),
    'Start Date' : [...searchTasks.value].sort((task1: Task, task2: Task) => {
      return new Date(task1.startDate).getTime() - new Date(task2.startDate).getTime();
    }).reverse(),
    'Deadline' : [...searchTasks.value.filter((task: Task) => {task.deadlineDate})].sort((task1: Task, task2: Task) => {
      return new Date(task1.startDate).getTime() - new Date(task2.startDate).getTime();
    }).reverse(),
  }
  return values[value] || searchTasks.value
}
function newTaskPopupClose() {
  newTask.value.name = ''
  newTask.value.description = ''
  newTask.value.status = ''
  newTask.value.priority = ''
  newTaskPopupIsOpen.value = false
}
function addNewTask() {
  if (newTask.value.name && newTask.value.status && newTask.value.priority) {
    newTask.value.id = Date.now()
    newTask.value.startDate = new Date().toLocaleString()
    console.log(newTask.value.startDate)
    props.column.tasksList.push({...newTask.value})
    newTaskPopupClose()
  }
  if (newTask.value.name && newTask.value.priority && props.column.statuses.length === 1) {
    newTask.value.status = props.column.statuses[0]
    newTask.value.id = Date.now()
    newTask.value.startDate = new Date().toLocaleString()
    newTask.value.columnId = props.column.id
    props.column.tasksList.push({...newTask.value})
    newTaskPopupClose()
  }
}
onUnmounted(() => {
  kanbanStore.searchValue = ''
})
</script>

<style lang="sass" scoped>
.column
  display: flex
  flex-direction: column
  width: 300px
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
  &__drop-area
    display: flex
    justify-content: center
    align-items: center
    height: 50px
    background-color: #d2e2f1
    border-radius: 15px
    margin-bottom: 10px
    &__dragover
      background-color: #becdec
    & span
      color: #628be1
      font-size: 12px
  &__add-task-btn
    padding: 5px 5px
    display: flex
    background-color: rgba(0, 0, 0, 0)
    width: 90px
    border: 0
    cursor: pointer
    align-items: center
    font-family: 'Open Sans', sans-serif
    &:hover
      border-radius: 6px
      background-color: #c0c9d0
    & img
      width: 17px
      margin-right: 2px
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
  width: 300px
  margin-bottom: 10px
  border: 0
  height: 1px
  background-color: #b7b6b6
</style>