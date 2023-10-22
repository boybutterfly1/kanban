<template>
  <div
      v-if="task"
      class="task"
      @click.stop
      @click="toggleTaskDetails"
      :class="{'task__details-open': taskDetailsIsOpen, 'task__details-closed' : !taskDetailsIsOpen, 'task__isGrabbed':taskDADStore.isGrabbed}"
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
      <img src="https://img.icons8.com/ios-glyphs/30/7e7e7e/more.png" alt="taskDetails">
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
  </div>
</template>

<script setup lang="ts">
import {Task} from "@/types/types";
import {useTaskDragAndDropStore} from "@/store/taskDragAndDrop";
import {onBeforeUnmount, onMounted, ref} from "vue";

const taskDADStore = useTaskDragAndDropStore()
const props = defineProps<{
  task: Task,
  taskIndex: number
}>()
const emits = defineEmits(['dragEnd','dragStart'])

const taskDetailsIsOpen = ref<boolean>(false)
const taskElement = ref<HTMLElement | null>(null);
const elementToHide = ref<HTMLElement | null>(null);
const taskDetailsOpen = ref<number>(-1)
function getStatusClass(status: string): string {
  return ['task__status', status.toLowerCase().replace(' ', '-')].join(' ')
}
const toggleTaskDetails = () => {
  // Закрываем детали предыдущей задачи, если они открыты
  if (taskDetailsOpen.value !== -1) {
    taskDetailsOpen.value = -1;
  }

  // Открываем/закрываем детали текущей задачи
  taskDetailsOpen.value = taskDetailsOpen.value === props.taskIndex ? -1 : props.taskIndex;
};

const handleClickOutside = (event: MouseEvent) => {
  if (elementToHide.value && !elementToHide.value.contains(event.target as Node)) {
    taskDetailsIsOpen.value = false;
  }
};

onMounted(() => {
  elementToHide.value = document.querySelector('.side-menu');
  taskElement.value = document.querySelector('.task');
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
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
  transition: right 0.5s
  overflow-y: auto
.menu-open
  right: 0
</style>