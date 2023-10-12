<template>
  <div class="board">
    <div class="board__header">
      <div class="board__header__name">
        <span>{{board.name}}</span>
      </div>
      <div class="board__header__options">
        <div><input></div>
        <div>Sort by</div>
        <div>Filters</div>
      </div>
    </div>
    <hr>
      <div class="board__container">
        <column-comp
            v-for="column in board.columns"
            :column="column"
        />
          <img width="30" height="30" src="https://img.icons8.com/ios/50/000000/plus--v1.png" alt="plus--v1"/>
      </div>
  </div>
</template>

<script setup lang="ts">
import ColumnComp from "@/components/ColumnComp.vue";
import {Board} from "@/types/types";

const props = defineProps<{
  board: Board
}>()
</script>

<style lang="sass" scoped>
.board
  display: flex
  flex-direction: column
  padding: 20px
  &__header
    display: flex
    justify-content: space-between
    &__name
      font-weight: bold
      font-size: 25px
    &__options
      display: flex
      & div
        margin-left: 20px
  &__container
    display: flex
hr
  margin-bottom: 30px
  border: 0
  height: 1px
  background-color: #b7b6b6
</style>