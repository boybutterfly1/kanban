<template>
  <div
      v-if="task"
      class="task"
      @click.stop="taskDetailsIsOpen = true"
      :class="{
        'task__details-open': taskDetailsIsOpen,
        'task__isGrabbed':taskDADStore.isGrabbed,
        'task__isSelected' : isSelected
      }"
      draggable="true"
      @dragstart="taskDADStore.onDrag($event, task)"
      @dragend="taskDADStore.isDroppableArea = false"
  >
    <div class="task__header">
      <div class="popup">
        <img src="https://img.icons8.com/ios-glyphs/30/7e7e7e/user--v1.png" alt="username" class="popup__trigger">
        <div class="popup__content">
          {{task.author}}
        </div>
      </div>
      <span class="task__header__id">{{task.id}}</span>
      <span>{{task.priority}}</span>
      <img
          class="edit-task"
          src="https://img.icons8.com/ios-glyphs/30/7e7e7e/more.png"
          alt="taskDetails"
          :id="task.id + 'edit'"
          @click.stop="openEditTaskPopup"
      >
    </div>
    <span class="task__title">{{task.name}}</span>
    <div class="task__status">
      <div
          :class="getStatusClass(task.status)"
      >
        {{task.status}}
      </div>
    </div>
  </div>
  <div
      :class="{ 'menu-open': taskDetailsIsOpen }"
      class="side-menu"
  >
    {{task.name}}
    <my-popup
        :is-open="isEditTaskPopupOpen"
        @close="isEditTaskPopupOpen = false"
        :coordinates="editTaskPopupCoordinates"
    >
      <div class="task-options-container">
        <div
            v-if="kanbanStore.darkMode"
            class="task-options-container__options"
        >
          <div
              v-if="!isSelected"
              @click="selectTask"
          >
            <img src="https://img.icons8.com/ios-filled/50/ffffff/checked-checkbox--v1.png" alt="select">
            <span>Select</span>
          </div>
          <div
              v-else
              @click="unselectTask"
          >
            <img src="https://img.icons8.com/ios-filled/50/ffffff/indeterminate-checkbox.png" alt="select">
            <span>Clear</span>
          </div>
          <div @click="deleteTask">
            <img src="https://img.icons8.com/ios-filled/50/ffffff/trash--v1.png" alt="trash">
            <span>Delete task</span>
          </div>
        </div>
        <div
            v-else
            class="task-options-container__options"
        >
          <div
              v-if="!isSelected"
              @click="selectTask"
          >
            <img src="https://img.icons8.com/ios-filled/50/checked-checkbox--v1.png" alt="select">
            <span>Select</span>
          </div>
          <div
              v-else
              @click="unselectTask"
          >
            <img src="https://img.icons8.com/ios-filled/50/indeterminate-checkbox.png" alt="select">
            <span>Clear</span>
          </div>
          <div @click="deleteTask">
            <img src="https://img.icons8.com/ios-filled/50/trash--v1.png" alt="trash">
            <span>Delete task</span>
          </div>
        </div>
      </div>
    </my-popup>
  </div>

</template>

<script setup lang="ts">
import {Column, Task} from "@/types/types";
import {useTaskDragAndDropStore} from "@/store/taskDragAndDrop";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import MyPopup from "@/components/UI/MyPopup.vue";
import {useKanbanStore} from "@/store/kanban";

const kanbanStore = useKanbanStore()
const taskDADStore = useTaskDragAndDropStore()
const props = defineProps<{
  task: Task,
  column: Column
}>()

const taskDetailsIsOpen = ref<boolean>(false)
const taskElement = ref<HTMLElement | null>(null);
const elementToHide = ref<HTMLElement | null>(null);
const isEditTaskPopupOpen = ref(false)
const editTaskPopupCoordinates = ref<Record<string, number | null>>({
  top: null,
  left: null
})
const isSelected = computed<boolean>(() => {
  return kanbanStore.selectedTasks.includes(props.task)
})

function getStatusClass(status: string): string {
  return ['task__status', status.toLowerCase().replace(' ', '-')].join(' ')
}
function openEditTaskPopup() {
  const element = document.getElementById(String(props.task.id) + 'edit')
  const rect = element? element.getBoundingClientRect() : null
  editTaskPopupCoordinates.value['top'] = rect? rect.top + rect.height : null
  editTaskPopupCoordinates.value['left'] = rect? rect.left : null

  isEditTaskPopupOpen.value = true
}
function selectTask() {
  isEditTaskPopupOpen.value = false
  kanbanStore.selectedTasks.push(props.task)
}
function unselectTask() {
  isEditTaskPopupOpen.value = false
  kanbanStore.selectedTasks = kanbanStore.selectedTasks.filter((task: Task) => {
    return task.id !== props.task.id
  })
}
function deleteTask() {
  props.column.tasksList = props.column.tasksList.filter((task: Task) => {
    return task.id !== props.task.id
  })
}
function handleClickOutside(event: MouseEvent) {
  if (elementToHide.value && !elementToHide.value.contains(event.target as Node)) {
    taskDetailsIsOpen.value = false;
  }
}
function handleScroll() {
  taskDetailsIsOpen.value = false
  isEditTaskPopupOpen.value = false
  console.log('scroll')
}
onMounted(() => {
  elementToHide.value = document.querySelector('.side-menu');
  taskElement.value = document.querySelector('.task');
  document.addEventListener('click', handleClickOutside);
  window.addEventListener("scroll", handleScroll);
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
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
    & img
      width: 17px
      cursor: pointer
      border-radius: 5px
      &:hover
        background-color: #a7adb2
    &__id
      width: 120px
      color: #7e7e7e
    & span
      font-size: 12px
      color: #7e7e7e
  &__details-open
    background-color: #ddeaf6
  &__details-closed
    background-color: var(--task-background-color)
  &:hover
    background-color: var(--task-hover-background-color)
    border-color: var(--task-hover-background-color)
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
.popup
  position: relative
  &__content
    display: none
    position: absolute
    top: 100%
    left: 0
    color: gainsboro
    background-color: #505050
    border: 1px solid #ddd
    border-radius: 5px
    padding: 2px
    font-size: 12px
  &__trigger:hover + &__content
    display: block
.side-menu
  border-left: 7px solid #ddeaf6
  width: 500px
  height: 100%
  position: fixed
  top: 0
  right: -500px
  background: white
  transition: right 0.3s
  overflow-y: auto
  z-index: 100
.menu-open
  right: 0
.selected-tasks
  padding: 0 40px
  position: fixed
  bottom: 60px
  height: 60px
  width: 100%
  border-radius: 10px
  background-color: #3f74e3
.task-options-container
  &__options
    padding: 3px 0
    display: flex
    flex-direction: column
    cursor: pointer
    font-size: 12px
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