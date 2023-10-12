<template>
  <div class="boards">
    <div class="boards__header">
      <div class="boards__header__name">
        <span>Boards</span>
      </div>
      <div class="boards__header__options">
        <div><input></div>
        <div>Sort by</div>
      </div>
    </div>
    <div
      v-for="board in kanbanStore.boards"
    >
      {{board.name}}
      {{board.id}}
      {{board.owner}}
    </div>
  </div>
</template>

<script setup lang="ts">
import {useKanbanStore} from "@/store/kanban";

const kanbanStore = useKanbanStore()
</script>

<style lang="sass" scoped>
.boards
  display: flex
  padding: 20px
  flex-direction: column
  &__header
    display: flex
    flex-direction: column
    &__name
      font-weight: bold
      font-size: 25px
      margin-bottom: 20px
    &__options
      display: flex
      & div
        margin-right: 20px
  &__container
    display: flex
hr
  margin-bottom: 30px
  border: 0
  height: 1px
  background-color: #b7b6b6
</style>