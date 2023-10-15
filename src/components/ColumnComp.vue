<template>
  <div
      v-if="column"
      class="column"
      @dragover.prevent
      @dragenter.prevent
      @drop="dragAndDropStore.onDrop(column, board)"
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
        v-for="task in searchTasks"
        :key="task.id"
        :task="task"
    />
    <div v-if="dropAreaFlag">
        <div
          :class="{ 'column__drop-area' : dragAndDropStore.isDroppableArea, 'column__drop-area__dragover': isDragOver}"
          v-for="status in column.statuses"
          @dragover="isDragOver = true"
          @dragleave="isDragOver = false"
        >
          <span>{{status}}</span>
        </div>
    </div>
    <button
        v-if="column.id === board.columns[0].id"
        class="column__add-task-btn"
        @click="newTaskPopupIsOpen = true"
    >
      <img src="https://img.icons8.com/ios/50/000000/plus-math--v1.png" alt="">
      <span>Add task</span>
    </button>
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
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {useUsersStore} from "@/store/users";
import MyPopup from "@/components/UI/MyPopup.vue";
import MyButton from "@/components/UI/MyButton.vue";
import MySelect from "@/components/UI/MySelect.vue";
import MyInput from "@/components/UI/MyInput.vue";
import {useTaskDragAndDropStore} from "@/store/taskDragAndDrop";
import {usePopupsFlagsStore} from "@/store/popupsFlags";
const popupsFlagsStore = usePopupsFlagsStore()
const dragAndDropStore = useTaskDragAndDropStore()
const usersStore = useUsersStore()
const kanbanStore = useKanbanStore()
const props = defineProps<{
  column: Column
  board: Board
}>()
const newTask = ref<Task>({
  id: null,
  name: '',
  description: '',
  status: '',
  startDate: '',
  priority: '',
  author: usersStore.currentUser? usersStore.currentUser.username : null,
  columnId: props.column.id
})
const newTaskPopupIsOpen = ref<boolean>(false)
const isDragOver = ref(false)
// const isDroppableArea = ref(false)
const dropAreaFlag = computed<boolean>(() => {
  return  isColumnNotOpen.value && dragAndDropStore.isDroppableArea && isDragColNotDropCol.value && props.column.statuses.length > 1
})
const isColumnNotOpen = computed<boolean>(() => {
  return !props.column.statuses.some(status => status === 'Open')
})
const isDragColNotDropCol = computed<boolean>(() => {
  return dragAndDropStore.dragTask ? dragAndDropStore.dragTask.columnId !== props.column.id : false
})
const searchTasks = computed<Task[]>(() => {
  return props.column.tasksList.filter((task: Task) => task.name.toLowerCase().includes(kanbanStore.searchValue.toLowerCase()))
})
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
  &__drop-area
    display: flex
    justify-content: center
    align-items: center
    height: 100px
    background-color: #c6d9ea
    border-radius: 15px
    margin-bottom: 10px
    &__dragover
      background-color: #b2cbe1
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
    &:hover
      border-radius: 6px
      background-color: #a7adb2
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
  width: 255px
  margin-bottom: 10px
  border: 0
  height: 1px
  background-color: #b7b6b6
</style>