<template>
  <div
      :class="{ 'is-open': isOpen }"
      class="sidebar"
      :id="String(id) + '-sidebar'"
      @click.stop
  >
    <span class="sidebar__date">{{startDate}}</span>
    <hr>
    <span class="sidebar__name">{{task.name}}</span>
    <div class="sidebar__status">
      <div :class="'sidebar'+kanbanStore.getStatusClass(task.status)">
        {{`${task.status}: ${timer}`}}
      </div>
    </div>
    <textarea
        class="sidebar__description"
        v-model="task.description"
        placeholder="Task description"
    />
    <hr>
    <div class="sidebar__parameters">
      <div class="sidebar__parameters__parameter">
        <span class="sidebar__parameters__parameter__title">Status</span>
        <my-select
            :array="statusesArray"
            v-model="task.status"
            select-name="Task status"
            @change="changeStatus()"
        />
      </div>
      <div class="sidebar__parameters__parameter">
        <span class="sidebar__parameters__parameter__title">Priority</span>
        <my-select
            :enum="Priorities"
            v-model="task.priority"
            select-name="Task priority"
        />
      </div>
      <div class="sidebar__parameters__parameter">
        <span class="sidebar__parameters__parameter__title">Deadline</span>
        <span>{{task.deadlineDate}}</span>
      </div>
      <div class="sidebar__parameters__parameter">
        <span class="sidebar__parameters__parameter__title">Author</span>
        <span>{{task.author}}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch, computed, onBeforeUnmount} from "vue";
import {useKanbanStore} from "@/store/kanban";
import {Board, Column, Priorities, Task} from "@/types/types";
import MySelect from "@/components/UI/MySelect.vue";

const kanbanStore = useKanbanStore()
const props = defineProps<{
  isOpen: boolean
  id: number | string | null
  task: Task
  column: Column
  board: Board
}>()
const emits = defineEmits(['close'])
const elementToHide = ref<HTMLElement | null>(null);

const statusesArray = computed<string[]>(() => {
  let result: string[] = []
  props.board.columns.forEach((column: Column) => {
    result = [...result, ...column.statuses]
  })
  return result
})
const startDate = computed<string>(() => {
  let startDate: string = ''
  let startTime: string = ''
  let updateDate: string = ''
  let updateTime: string = ''
  if (props.task.startDate) {
    startDate = new Date(props.task.startDate).toDateString().slice(4).slice(0, -5)
    startTime = new Date(props.task.startDate).toLocaleTimeString().slice(0, -3)
  }
  if (props.task.statusChangeDate) {
    updateDate = new Date(props.task.statusChangeDate).toDateString().slice(4).slice(0, -5)
    updateTime = new Date(props.task.statusChangeDate).toLocaleTimeString().slice(0, -3)
  }
  return props.task.statusChangeDate? `Created ${startDate} ${startTime}, updated ${updateDate} ${updateTime}` : `Created ${startDate} ${startTime}`
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
function changeStatus() {
  props.column.tasksList = props.column.tasksList.filter((task: Task) => {
    return task.id !== props.task.id
  })
  let availableColumn: Column | null = props.board.columns.find((column : Column) => {
    return column.statuses.includes(props.task.status)
  }) || null
  if (availableColumn) {
    availableColumn.tasksList.push(props.task)
    props.task.columnId = availableColumn.id
  }
  props.task.statusChangeDate = Date.now()
}
function close() {
  if (kanbanStore.openSidebar !== String(props.id) + '-sidebar') {
    emits('close')
  }
}
const handleClickOutside = (event: MouseEvent) => {
  if (elementToHide.value && !elementToHide.value.contains(event.target as Node)) {
    emits('close')
  }
}
onMounted(() => {
  elementToHide.value = document.getElementById(String(props.id) + '-sidebar');
  document.addEventListener('click', handleClickOutside);
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
})
watch(() => {return kanbanStore.openSidebar}, () => {
  close()
})
</script>

<style lang="sass">
.sidebar
  border-left: 7px solid var(--task-hover-background-color)
  width: 500px
  height: 100%
  position: fixed
  top: 0
  right: -500px
  background: var(--task-background-color)
  transition: right 0.2s
  overflow-y: auto
  z-index: 40
  display: flex
  flex-direction: column
  padding: 10px 20px
  gap: 10px
  &__description
    width: 100%
    height: 100px
    font-family: 'Open Sans', sans-serif
    margin-top: 10px
    border-radius: 5px
    border: 1px solid #7e7e7e
    background-color: var(--options-background-color)
    padding: 5px 7px
    color: var(--text-color)
    &:focus
      outline: none
      box-shadow: 0 0 5px #3f74e3
  &__date
    font-size: 12px
  &__name
    font-size: 20px
    font-weight: bold
  &__status
    display: flex
    font-size: 10px
    border-radius: 5px
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
  &__parameters
    display: flex
    flex-direction: column
    font-size: 13px
    gap: 15px
    &__parameter
      display: flex
      &__title
        font-weight: bold
        width: 30px
        margin-right: 100px
.is-open
  right: 0
hr
  width: 100%
  margin: 5px 0 15px
  border: 0
  height: 1px
  background-color: #7e7e7e
</style>
