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
          >
            <td @click.stop="kanbanStore.changePage(`/board/${board.id}`)">{{board.name}}</td>
            <td @click.stop="kanbanStore.changePage(`/board/${board.id}`)">{{board.id}}</td>
            <td @click.stop="kanbanStore.changePage(`/board/${board.id}`)">{{board.owner}}</td>
            <td>
              <img
                  @click.stop="openBoardDropdown(board.id)"
                  src="https://img.icons8.com/ios-glyphs/50/7e7e7e/more.png"
                  alt="dropdown"
                  :id="board.id + 'edit-board'"
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <my-dropdown
      :dropdown-id="String(currentBoardId) + 'edit-column'"
      :is-open="isBoardDropdownOpen"
      :coordinates="boardDropdownCoordinates"
      @close="isBoardDropdownOpen = false"
      direction="left"
  >
    <div class="board-options-container">
      <div class="board-options-container__options">
        <div class="delete"
             @click="deleteBoard(currentBoardId)">
          <img src="https://img.icons8.com/ios-filled/50/ff4747/trash--v1.png" alt="trash">
          <span>Delete board</span>
        </div>
      </div>
    </div>
  </my-dropdown>
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
import MyDropdown from "@/components/UI/MyDropdown.vue";
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
const currentBoardId = ref<number | null>(null)
const boardDropdownCoordinates = ref<Record<string, number | null>>({
  top: null,
  left: null
})
const isBoardDropdownOpen = ref(false)
const searchBoards = computed<Board[]>(() => {
  return kanbanStore.boards.filter((board: Board) => board.name.toLowerCase().includes(kanbanStore.searchValue.toLowerCase()))
})
function openBoardDropdown(id: number| null) {
  currentBoardId.value = id
  const element = document.getElementById(String(id) + 'edit-board')
  const rect = element? element.getBoundingClientRect() : null
  boardDropdownCoordinates.value['top'] = rect? rect.top + rect.height  : null
  boardDropdownCoordinates.value['left'] = rect? rect.left + rect.width: null
  kanbanStore.openDropdowns.push(String(id) + 'edit-board')
  if (kanbanStore.openDropdowns.length > 2) kanbanStore.openDropdowns.shift()
  isBoardDropdownOpen.value = true
}
function deleteBoard(id: number | null) {
  kanbanStore.boards = kanbanStore.boards.filter((board: Board) => {
    return board.id !== id
  })
  isBoardDropdownOpen.value = false
}
function createBoard() {
  if (newBoard.value.name) {
    newBoard.value.id = Date.now()
    kanbanStore.boards.push({...newBoard.value})
    popupFlagsStore.createBoardPopupIsOpen = false
    kanbanStore.changePage(`/board/${newBoard.value.id}`)
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
  padding: 65px 60px
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
          width: 17px
        &:nth-child(4)
          width: 10%
          text-align: right
.new-board
  display: flex
  flex-direction: column
  justify-content: center
  padding: 15px
  & span
    margin-bottom: 15px
.board-options-container
  &__options
    padding: 3px 0
    display: flex
    flex-direction: column
    cursor: pointer
    font-size: 12px
    & .delete
      color: #ff4747
    & div
      display: flex
      align-items: center
      padding: 5px 10px
      & img
        width: 15px
        margin-right: 3px
      &:hover
        background-color: var(--task-hover-background-color)
hr
  width: 100%
  border: 0
  height: 1px
  background-color: #7e7e7e
</style>