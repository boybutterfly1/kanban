<template>
  <div
      @dragover.prevent
      @dragenter.prevent
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
          {{filteredSortedSearchedTasks.length}}
        </div>
        <div class="column__header__buttons">
          <img
              @click="newTaskPopupIsOpen = true"
              src="https://img.icons8.com/ios/50/7e7e7e/plus-math--v1.png"
              alt="add task"
          >
          <img src=https://img.icons8.com/ios-glyphs/50/7e7e7e/more.png alt="edit column">
        </div>
      </div>
      <hr>
      <task-comp
          v-for="(task) in filteredSortedSearchedTasks"
          :key="task.id"
          :task="task"
          :column="column"
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
            <span v-if="props.column.statuses.length > 1">{{ status }}</span>
          </div>
        </div>
      </div>
      <button
          v-if="column.id === board.columns[0].id"
          class="column__add-task-btn"
          @click="newTaskPopupIsOpen = true"
      >
        <img src="https://img.icons8.com/ios/50/7e7e7e/plus-math--v1.png" alt="">
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
import {computed, onUnmounted, ref} from "vue";
import {useUsersStore} from "@/store/users";
import MyPopup from "@/components/UI/MyPopup.vue";
import MyButton from "@/components/UI/MyButton.vue";
import MySelect from "@/components/UI/MySelect.vue";
import MyInput from "@/components/UI/MyInput.vue";
import {useTaskDragAndDropStore} from "@/store/taskDragAndDrop";
import {useColumnDragAndDropStore} from "@/store/columnDragAndDrop";
const taskDADStore = useTaskDragAndDropStore()
const columnDADStore = useColumnDragAndDropStore()
const usersStore = useUsersStore()
const kanbanStore = useKanbanStore()
const props = defineProps<{
  column: Column
  board: Board
  sortValue: string
  filters: Record<string, string[]>
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
  return  isColumnNameNotOpen() && isDragColNotDropCol() && taskDADStore.isDroppableArea
})
function isColumnNameNotOpen(): boolean {
  return !props.column.statuses.some((status: string) => status === 'Open')
}
function isDragColNotDropCol():boolean {
  return taskDADStore.dragTask ? taskDADStore.dragTask.columnId !== props.column.id : false
}
const searchedTasks = computed<Task[]>(() => {
  return props.column.tasksList.filter((task: Task) => task.name.toLowerCase().includes(kanbanStore.searchValue.toLowerCase()))
})
const sortedSearchedTasks = computed<Task[]>(() => {
  const values: Record<string, Task[]> = {
    'Priority' : [...searchedTasks.value].sort((task1: Task, task2: Task) => {
      return Priorities[task1.priority] - Priorities[task2.priority];
    }).reverse(),
    'Start Date' : [...searchedTasks.value].sort((task1: Task, task2: Task) => {
      return new Date(task1.startDate).getTime() - new Date(task2.startDate).getTime();
    }).reverse(),
    'Deadline' : [...searchedTasks.value.filter((task: Task) => {task.deadlineDate})].sort((task1: Task, task2: Task) => {
      return new Date(task1.startDate).getTime() - new Date(task2.startDate).getTime();
    }).reverse(),
  }
  return values[props.sortValue] || searchedTasks.value
})
const filteredSortedSearchedTasks = computed<Task[]>(() => {
  return sortedSearchedTasks.value.filter((task) => {
    return [
      !props.filters['Status'].length || props.filters['Status'].includes(task.status),
      !props.filters['Priority'].length || props.filters['Priority'].includes(task.priority),
      !props.filters['Author'].length || props.filters['Author'].includes(task.author),
    ].every(Boolean);
  });
});

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
  margin-bottom: 20px
  padding: 0 7px
  &__header
    display: flex
    align-items: center
    justify-content: space-between
    &__name
      & span
        font-weight: bold
    &__buttons
      padding-top: 5px
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
    opacity: 0.85
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
    color: #7e7e7e
    &:hover
      border-radius: 6px
      background-color: #c0c9d0
    & img
      width: 17px
      margin-right: 2px
.new-task
  padding: 15px
  display: flex
  flex-direction: column
  textarea
    width: 300px
    height: 100px
    font-family: 'Open Sans', sans-serif
    margin-bottom: 10px
    border-radius: 5px
    border: 1px solid #7e7e7e
    background-color: var(--options-background-color)
    padding: 2px 5px
    &:focus
      outline: none
      box-shadow: 0 0 5px #3f74e3
hr
  width: 300px
  margin-bottom: 10px
  border: 0
  height: 1px
  background-color: #7e7e7e
</style>