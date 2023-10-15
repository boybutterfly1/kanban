<template>
  <div
       v-if="task"
       class="task"
       @click="taskDetailsIsOpen = !taskDetailsIsOpen"
       :class="{'task__details-open': taskDetailsIsOpen, 'task__details-closed' : !taskDetailsIsOpen, 'task__isGrabbed':dragAndDropStore.isGrabbed}"
       draggable="true"
       @dragstart="dragAndDropStore.onDrag($event, task); $emit('dragStart')"
       @dragend="dragAndDropStore.isDroppableArea = false"
  >
    <div class="task__header">
      <div class="popup">
        <img src="https://img.icons8.com/ios-glyphs/30/000000/user--v1.png" alt="username" class="popup__trigger">
        <div class="popup__content">
          {{task.author}}
        </div>
      </div>
      <span class="task__header__id">{{task.id}}</span>
      <span>{{task.priority}}</span>
      <img src="https://img.icons8.com/ios-glyphs/30/000000/more.png" alt="taskDetails">
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
  <div :class="{ 'menu-open': taskDetailsIsOpen }" class="side-menu">
    {{task.name}}
  </div>
</template>

<script setup lang="ts">
import {Task} from "@/types/types";
import {useTaskDragAndDropStore} from "@/store/taskDragAndDrop";
import {ref} from "vue";
const taskDetailsIsOpen = ref<boolean>(false)
const dragAndDropStore = useTaskDragAndDropStore()
const props = defineProps<{
  task: Task
}>()
const emits = defineEmits(['dragEnd','dragStart'])
function getStatusClass(status: string): string {
    return ['task__status', status.toLowerCase().replace(' ', '-')].join(' ')
}
</script>

<style lang="sass" scoped>
.task
  width: 250px
  height: 100px
  border-radius: 15px
  border: 1px solid #d9d9d9
  display: flex
  flex-direction: column
  justify-content: space-between
  box-shadow: 5px 5px 10px rgba(0,0,0,0.1)
  transition: 0.3s ease
  padding: 15px
  cursor: grab
  &__isGrabbed
    cursor: grabbing
  &__header
    display: flex
    align-items: center
    justify-content: space-between
    & img
      width: 17px
      cursor: pointer
      border-radius: 5px
      &:hover
        background-color: #a7adb2
    &__id
      width: 120px
    & span
        font-size: 12px
  &__details-open
    background-color: #ddeaf6
  &__details-closed
    background-color: white
  &:hover
    background-color: gainsboro
  &__title
    font-size: 14px
  &__status
    display: flex
    font-size: 12px
    border-radius: 5px
    & .open
      padding: 1px 5px
      background-color: #c0c9d0
    & .in-progress
      padding: 1px 5px 2px
      background-color: #79b7ea
    & .need-info
      padding: 1px 5px
      background-color: #f5de6a
    & .closed
      padding: 1px 5px
      background-color: #b3ec70
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
  transition: right 0.5s
  overflow-y: auto
.menu-open
  right: 0
</style>