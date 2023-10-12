<template>
  <div class="column">
    <div class="column__header">
      <div class="column__header__name">
        <span>{{column.name}}</span>
        {{column.tasksList.length}}
      </div>
      <div class="column__header__buttons">
        <img src="https://img.icons8.com/ios/50/000000/plus-math--v1.png" alt="">
        <img src="https://img.icons8.com/ios-glyphs/50/000000/more.png" alt="">
      </div>
    </div>
    <hr>
    <task-comp
        v-for="task in column.tasksList"
        :task="task"
    />
    <button>
      <img width="17" src="https://img.icons8.com/ios/50/000000/plus-math--v1.png" alt="">
      <span>Add task</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import TaskComp from "@/components/TaskComp.vue";
import {useKanbanStore} from "@/store/kanban";
import {Column} from "@/types/types";

const kanbanStore = useKanbanStore()
const props = defineProps<{
  column: Column
}>()
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
  & button
    padding: 5px 10px
    display: flex
    background-color: rgba(0, 0, 0, 0)
    width: 90px
    border: 0
    &:hover
      border-radius: 6px
      background-color: gainsboro
hr
  width: 255px
  margin-bottom: 10px
  border: 0
  height: 1px
  background-color: #b7b6b6
</style>