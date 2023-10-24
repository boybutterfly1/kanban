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
              v-model="kanbanStore.searchValue"
              type="text"
              placeholder="Search by board"
          />
        </div>
        <div class="boards__header__bar__button>">
          <my-button @click="popupFlagsStore.createBoardPopupIsOpen = true">
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
              v-for="board in searchBoards"
              @click="kanbanStore.changePage(`/board${board.id}`)"
          >
            <td>{{board.name}}</td>
            <td>{{board.id}}</td>
            <td>{{board.owner}}</td>
            <td>
              <img src="https://img.icons8.com/ios-glyphs/50/7e7e7e/more.png" alt="">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <my-popup
      :is-open="popupFlagsStore.createBoardPopupIsOpen"
      @close="createBoardPopupClose"
  >
    <form class="new-board" @submit.prevent>
      <span>Creating board</span>
      <my-input
          v-model="newBoard.name"
          type="text"
          placeholder="Board Name"
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
import {computed, onUnmounted, ref} from "vue";
import MyPopup from "@/components/UI/MyPopup.vue";
import {Board} from "@/types/types";
import {useUsersStore} from "@/store/users";
import {usePopupsFlagsStore} from "@/store/popupsFlags";
import MySelect from "@/components/UI/MySelect.vue";
const popupFlagsStore = usePopupsFlagsStore()
const usersStore = useUsersStore()
const kanbanStore = useKanbanStore()
const newBoard = ref<Board>({
  id: null,
  name: "",
  owner: usersStore.currentUser ? usersStore.currentUser.username : null,
  columns: [],
  availableStatuses : [...kanbanStore.statuses]
})
const searchBoards = computed<Board[]>(() => {
  return kanbanStore.boards.filter((board: Board) => board.name.toLowerCase().includes(kanbanStore.searchValue.toLowerCase()))
})
function createBoard() {
  if (newBoard.value.name) {
    newBoard.value.id = Date.now()
    kanbanStore.boards.push({...newBoard.value})
    popupFlagsStore.createBoardPopupIsOpen = false
    kanbanStore.changePage(`/board${newBoard.value.id}`)
    createBoardPopupClose()
  }
}
function createBoardPopupClose() {
  popupFlagsStore.createBoardPopupIsOpen = false
  newBoard.value.name = ''
}
onUnmounted(() => {
  kanbanStore.searchValue = ''
})
</script>

<style lang="sass" scoped>
.boards
  display: flex
  padding: 55px 40px
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
      border-bottom: 1px solid #7e7e7e
      &:nth-child(1)
        width: 20%
  & tbody
    & tr
      cursor: pointer
      &:hover
        background-color: var(--task-hover-background-color)
      & td
        padding: 5px 10px
        & img
          margin-top: 5px
          width: 17px
          margin-left: 10px
        &:nth-child(4)
          width: 10%
          text-align: right
.new-board
  display: flex
  flex-direction: column
  justify-content: center
  & span
    margin-bottom: 15px
hr
  width: 100%
  border: 0
  height: 1px
  background-color: #7e7e7e
</style>