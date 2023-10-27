<template>
  <div
      v-if="task"
      class="task"
      @click.stop="openTaskSidebar"
      :class="{
        'task__sidebar-open': taskSidebarIsOpen,
        'task__isGrabbed':taskDADStore.isGrabbed,
        'task__isSelected' : isSelected
      }"
      draggable="true"
      @dragstart="taskDADStore.onDrag($event, task)"
      @dragend="taskDADStore.isDroppableArea = false"
  >
    <div class="task__header">
      <div class="task__header__left-side">
        <div class="popup">
          <div class="popup__trigger">
            <img
                class="task__header__left-side__author"
                src="https://img.icons8.com/ios-glyphs/30/7e7e7e/user--v1.png"
                alt="username">
          </div>
          <div class="popup__content">
            {{task.author}}
          </div>
        </div>
        <div class="popup">
          <div class="popup__trigger">
          <span
              @mouseover="isTaskIdCopied = false"
              @click.stop="copyId"
              class="task__header__left-side__id"
          >
            {{task.id}}
          </span>
          </div>
          <div class="popup__content">
            {{ copyStatus }}
          </div>
        </div>
      </div>
      <div class="task__header__right-side">
        <span class="task__header__right-side__priority">{{task.priority}}</span>
        <img
            class="task__header__right-side__btn"
            src="https://img.icons8.com/ios-glyphs/30/7e7e7e/more.png"
            alt="taskDetails"
            :id="String(task.id) + '-dropdown'"
            @click.stop="openTaskDropdown"
        >
      </div>
    </div>
    <span class="task__title">{{task.name}}</span>
    <div class="task__status">
      <div
          :class="'task' + kanbanStore.getStatusClass(task.status)"
      >
        {{`${task.status}: ${timer}`}}
      </div>
    </div>
  </div>
  <my-dropdown
      :is-open="isTaskDropdownOpen"
      @close="closeTaskDropdown"
      :coordinates="taskDropdownCoordinates"
      :dropdownId="String(task.id) + '-dropdown'"
  >
    <div class="task-options-container">
      <div
          class="task-options-container__options"
      >
        <div
            v-if="!isSelected"
            @click="selectTask"
        >
          <img v-if="kanbanStore.darkMode" src="https://img.icons8.com/ios-filled/50/ffffff/checked-checkbox--v1.png" alt="select">
          <img v-else src="https://img.icons8.com/ios-filled/50/000000/checked-checkbox--v1.png" alt="select">
          <span>Select</span>
        </div>
        <div
            v-else
            @click="unselectTask"
        >
          <img v-if="kanbanStore.darkMode" src="https://img.icons8.com/ios-filled/50/indeterminate-checkbox.png" alt="select">
          <img v-else src="https://img.icons8.com/ios-filled/50/indeterminate-checkbox.png" alt="select">
          <span>Clear</span>
        </div>
        <div class="delete"
             @click="deleteTask">
          <img src="https://img.icons8.com/ios-filled/50/ff4747/trash--v1.png" alt="trash">
          <span>Delete task</span>
        </div>
      </div>
    </div>
  </my-dropdown>
  <my-sidebar
      :is-open="taskSidebarIsOpen"
      :sidebar-id="String(task.id) + '-sidebar'"
      :task="task"
      :column="column"
      :board="board"
      @close="taskSidebarIsOpen = false"
  />

</template>

<script setup lang="ts">
import {Board, Column, Task} from "@/types/types";
import {useTaskDragAndDropStore} from "@/store/taskDragAndDrop";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {useKanbanStore} from "@/store/kanban";
import MyDropdown from "@/components/UI/MyDropdown.vue";
import MySidebar from "@/components/UI/MySidebar.vue";

const kanbanStore = useKanbanStore()
const taskDADStore = useTaskDragAndDropStore()
const props = defineProps<{
  task: Task,
  column: Column
  board: Board
}>()

const taskSidebarIsOpen = ref<boolean>(false)
const isTaskDropdownOpen = ref(false)
const isTaskIdCopied = ref(false)

const copyStatus = computed<string>(() => {
  return isTaskIdCopied.value ? 'Copied' : 'Copy'
})
const taskDropdownCoordinates = ref<Record<string, number | null>>({
  top: null,
  left: null
})
const isSelected = computed<boolean>(() => {
  return kanbanStore.selectedTasks.includes(props.task)
})
const timer = computed<string>(() => {
  let time: number
  if (props.task.statusChangeDate) {
    time = Date.now() - props.task.statusChangeDate;
  } else {
    time = props.task.startDate ? Date.now() - props.task.startDate : 0;
  }
  const date = new Date(time)
  const days = Math.floor(time / (24 * 60 * 60 * 1000));
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  return `${days? days + 'd': ''} ${hours}hr ${minutes}m`
})
function copyId() {
  navigator.clipboard.writeText(String(props.task.id))
      .then(() => {
        isTaskIdCopied.value = true
      })
      .catch(error => {
        console.error(error);
      });
}

function openTaskDropdown() {
  const element = document.getElementById(String(props.task.id) + '-dropdown')
  const rect = element? element.getBoundingClientRect() : null
  taskDropdownCoordinates.value['top'] = rect? rect.top + rect.height : null
  taskDropdownCoordinates.value['left'] = rect? rect.left : null
  if (kanbanStore.openDropdowns[1] !== (String(props.task.id) + '-dropdown')) {
    kanbanStore.openDropdowns.push(String(props.task.id) + '-dropdown')
  }
  if (kanbanStore.openDropdowns.length > 2) kanbanStore.openDropdowns.shift()
  isTaskDropdownOpen.value = true
  console.log('openDropdown', taskDropdownCoordinates.value, kanbanStore.openDropdowns, rect)
}
function closeTaskDropdown(id: string) {
  isTaskDropdownOpen.value = false
  taskDropdownCoordinates.value['top'] = null
  taskDropdownCoordinates.value['left'] = null
  console.log('close ', String(props.task.id) + '-dropdown')
}
function openTaskSidebar() {
  kanbanStore.openSidebars.push(String(props.task.id) + '-sidebar')
  if (kanbanStore.openSidebars.length > 2) kanbanStore.openSidebars.shift()
  taskSidebarIsOpen.value = true
}
function selectTask() {
  isTaskDropdownOpen.value = false
  kanbanStore.selectedTasks.push(props.task)
  kanbanStore.openDropdowns.pop()
}
function unselectTask() {
  isTaskDropdownOpen.value = false
  kanbanStore.selectedTasks = kanbanStore.selectedTasks.filter((task: Task) => {
    return task.id !== props.task.id
  })
  kanbanStore.openDropdowns.pop()
}
function deleteTask() {
  props.column.tasksList = props.column.tasksList.filter((task: Task) => {
    return task.id !== props.task.id
  })
}
function handleScroll() {
  isTaskDropdownOpen.value = false
}
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
})
onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
})

</script>

<style lang="sass" scoped>
.task
  width: 300px
  height: 110px
  border-radius: 15px
  border: 1px solid var(--task-border-color)
  display: flex
  flex-direction: column
  justify-content: space-between
  box-shadow: 5px 10px 10px rgba(0,0,0,0.1)
  transition: 0.3s ease
  padding: 15px
  cursor: grab
  background-color: var(--task-background-color)
  &__isGrabbed
    cursor: grabbing
  &__isSelected
    box-shadow: 0 0 5px 1.5px #295bc4
  &__header
    display: flex
    align-items: center
    justify-content: space-between
    cursor: pointer
    font-size: 12px
    color: #7e7e7e
    &__left-side
      display: flex
      align-items: center
      gap: 15px
      &__author
        width: 17px
        cursor: pointer
        border-radius: 5px
        &:hover
          background-color: #a7adb2
    &__id
      width: 30px
      color: #7e7e7e
      display: flex
    &__right-side
      display: flex
      align-items: center
      gap: 15px
      &__priority
      &__btn
        width: 17px
        cursor: pointer
        border-radius: 5px
  &__title
    font-size: 14px
  &__status
    display: flex
    font-size: 10px
    border-radius: 5px
    cursor: pointer
    & .open
      padding: 1px 5px
      background-color: #c5cdd3
      color: #282b2d
    & .in-progress
      padding: 1px 5px 2px
      background-color: #a4baec
      color: #111f3d
    & .need-info
      padding: 1px 5px
      background-color: #f3e49a
      color: #594424
    & .closed
      padding: 1px 5px
      background-color: #cbeca4
      color: #33481c
    & .testing
      padding: 1px 5px
      background-color: #b7b7d5
      color: #241e41
  &__sidebar-open
    background-color: #ddeaf6
  &:hover
    background-color: var(--task-hover-background-color)
    border-color: var(--task-hover-background-color)
.popup
  position: relative
  &__content
    display: none
    position: absolute
    top: 100%
    left: 0
    color: gainsboro
    background-color: #484848
    border-radius: 5px
    padding: 5px 5px
    font-size: 12px
    box-shadow: 3px 3px 3px rgba(0,0,0,0.5)
  &__trigger:hover + &__content
    display: block
.task-options-container
  &__options
    padding: 3px 0
    display: flex
    flex-direction: column
    cursor: pointer
    font-size: 12px
    & .delete
      color: #ff4747
    & div
      display: flex
      align-items: center
      padding: 5px 10px
      & img
        width: 15px
        margin-right: 3px
      &:hover
        background-color: var(--task-hover-background-color)
</style>