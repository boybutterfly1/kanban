<template>
  <div class="boards">
    <div class="boards__header">
      <div class="boards__header__name">
        <span>Boards</span>
        <hr>
      </div>
      <div class="boards__header__bar">
        <div class="boards__header__bar__options">
          <my-input
              v-model="searchValue"
              type="text"
              placeholder="Search"
          />
          <div>Sort by</div>
        </div>
        <div class="boards__header__bar__button>">
          <my-button @click="createFormIsOpen = true">
            Create Board
          </my-button>
        </div>
      </div>
    </div>
    <div>
      <table>
        <thead>
          <tr class="head">
            <th>Name</th>
            <th>ID</th>
            <th>Owner</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
              class="list"
              v-for="board in kanbanStore.boards"
              @click="router.push(`/board${board.id}`)"
          >
            <td>{{board.name}}</td>
            <td>{{board.id}}</td>
            <td>{{board.owner}}</td>
            <td>
              <img src="https://img.icons8.com/ios/50/000000/plus-math--v1.png" alt="">
              <img src="https://img.icons8.com/ios-glyphs/50/000000/more.png" alt="">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <my-popup
      :is-open="createFormIsOpen"
      @close="createFormIsOpen = false"
  >
    <form class="creating-board" @submit.prevent>
      <span>Creating board</span>
      <my-input
          v-model="newBoard.name"
          type="text"
          placeholder="BoardName"
      />
      <my-button
        @click="createBoard"
        type="submit"
      >
        Create
      </my-button>
    </form>
  </my-popup>
</template>

<script setup lang="ts">
import {useKanbanStore} from "@/store/kanban";
import MyButton from "@/components/UI/MyButton.vue";
import MyInput from "@/components/UI/MyInput.vue";
import {ref} from "vue";
import MyPopup from "@/components/UI/MyPopup.vue";
import {Board, Column, User} from "@/types/types";
import {useUsersStore} from "@/store/users";
import router from "@/router";

const usersStore = useUsersStore()
const kanbanStore = useKanbanStore()
const searchValue = ref<string>('')
const createFormIsOpen = ref<boolean>(false)
const newBoard = ref<Board>({
  id: 0,
  name: "",
  owner: usersStore.currentUser ? usersStore.currentUser.username : null,
  columns: []
})

function createBoard() {
  if (newBoard.value.name) {
    newBoard.value.id = Date.now()
    kanbanStore.boards.push({...newBoard.value})
  }
  createFormIsOpen.value = false
  newBoard.value.name = ''
}
</script>

<style lang="sass" scoped>
.boards
  display: flex
  padding: 40px
  flex-direction: column
  &__header
    display: flex
    flex-direction: column
    &__name
      font-weight: bold
      font-size: 25px
      margin-bottom: 10px
    &__bar
      display: flex
      justify-content: space-between
      align-items: center
      &__options
        display: flex
        justify-content: space-between
        & div
          margin-left: 20px
table
  margin-top: 10px
  border-collapse: collapse
  font-size: 14px
  text-align: left
  width: 100%
  & thead
    & th
      font-weight: bold
      padding: 10px
      border-bottom: 1px solid #b7b6b6
      &:nth-child(1)
        width: 20%
  & tbody
    & tr
      cursor: pointer

      &:hover
        background-color: #b7b7b7
      & td
        padding: 10px
        & img
          width: 17px
          margin-left: 10px
        &:nth-child(4)
          width: 10%
          text-align: right
hr
  width: 100%
  border: 0
  height: 1px
  background-color: #b7b6b6
.creating-board
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  & span
    margin-bottom: 15px
</style>