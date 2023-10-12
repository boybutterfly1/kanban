<template>
  <div class="task">
    <div class="task__header">
      <div class="popup">
        <img src="https://img.icons8.com/ios-glyphs/30/000000/user--v1.png" alt="username" class="popup__trigger">
        <div class="popup__content">
          {{task.author}}
        </div>
      </div>
      <span class="task__header__id">{{task.id}}</span>
      <span>{{task.priority}}</span>
      <img src="https://img.icons8.com/ios-glyphs/30/000000/more.png" alt="">
    </div>
    <span class="task__title">{{task.title}}</span>
    <div class="task__status">
      <div
        :class="getStatusClass(task.status)"
      >
        {{task.status}}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Status, Task} from "@/types/types";

const props = defineProps<{
  task: Task
}>()

function getStatusClass(status: Status): string {
    return ['task__status', status.toLowerCase().replace(' ', '-')].join(' ')
}
</script>

<style lang="sass" scoped>
.task
  width: 250px
  height: 100px
  border-radius: 8px
  border: 1px solid #d9d9d9
  display: flex
  flex-direction: column
  justify-content: space-between
  box-shadow: 5px 5px 10px rgba(0,0,0,0.1)
  transition: 0.3s ease
  padding: 15px 15px
  background-color: white
  &__header
    display: flex
    align-items: center
    justify-content: space-between
    & img
      width: 17px
    &__id
      width: 120px
    & span
        font-size: 12px
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
</style>