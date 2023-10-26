<template>
  <nav>
    <div class="navbar">
      <div class="navbar__navigation">
        <div class="logo">
          <img
              src="../assets/icons8-check-pieces-96.png"
              alt="logo"
          >
        </div>
        <div v-if="route.path === '/boards'">
          <span>All boards</span>
        </div>
        <div v-if="route.path.includes('/board/')">
            <span
                @click="router.push('/boards')"
                class="boards"
            >
              Boards
            </span>
          <span>
          {{ ` / ${currentBoardName}` }}
        </span>
        </div>
      </div>
      <div class="navbar__options">
        <label class="switch">
          <input
              type="checkbox"
              @change="kanbanStore.darkMode = !kanbanStore.darkMode;"
          >
          <span class="slider">
            <img v-if="kanbanStore.darkMode" src="https://img.icons8.com/ios-filled/50/ffffff/sun--v1.png" alt="On Image" class="on-image" />
            <img v-else src="https://img.icons8.com/ios-filled/50/7e7e7e/crescent-moon.png" alt="Off Image" class="off-image" />
          </span>
        </label>
        <div
            class="logout"
            v-if="usersStore.isLoggedIn"
            @click="usersStore.logout()"
        >
          <img v-if="kanbanStore.darkMode" src="https://img.icons8.com/fluency-systems-filled/48/ffffff/exit.png" alt="logout">
          <img v-else src="https://img.icons8.com/fluency-systems-filled/48/000000/exit.png" alt="logout">
          <span>Logout</span>
        </div>
      </div>
    </div>
  </nav>

</template>

<script setup lang="ts">
import {useUsersStore} from "@/store/users";
import {useKanbanStore} from "@/store/kanban";
import {useRoute} from "vue-router";
import {computed, ref, watch} from "vue";
import {Board} from "@/types/types";
import router from "@/router";

const route = useRoute()
const id = ref<number | null>(null)
const kanbanStore = useKanbanStore()
const usersStore = useUsersStore()
const currentBoardName = computed<string | null>(() => {
  const currentBoard: Board | null = kanbanStore.boards.find((board: Board) => board.id === id.value) || null
  return currentBoard ? currentBoard.name : null
})
watch((route),() => {
  id.value = +(route.path.split('/')[route.path.split('/').length-1])
})
</script>

<style lang="sass" scoped>
.navbar
  display: flex
  width: 100%
  position: fixed
  height: 45px
  border-bottom: 1px solid #7e7e7e
  background-color: var(--app-background-color)
  align-items: center
  padding: 0 20px
  justify-content: space-between
  font-size: 13px
  z-index: 30
  &__navigation
    display: flex
    margin-right: 5px
    align-items: center
    & .logo
      display: flex
      align-items: center
      margin-right: 5px
      & img
        width: 30px
        margin-right: 5px
      & span
        color: #3F74E3
        font-weight: bold
        font-size: 20px
    & .boards
      cursor: pointer
      &:hover
        color: #a4b9ec
  &__options
    display: flex
    align-items: center
    gap: 15px
    & .logout
      padding: 3px 5px
      cursor: pointer
      display: flex
      align-items: center
      & img
        margin-top: 1px
        width: 14px
        margin-right: 1px
      &:hover
        border-radius: 5px
        background-color: var(--task-hover-background-color)
.switch input
  display: none
.switch
  margin-top: 2px
  position: relative
  display: inline-block
  width: 43px
  height: 22px
  & .slider
    position: absolute
    cursor: pointer
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: white
    transition: .3s
    border-radius: 25px
    border: 1px solid #7e7e7e
  & .slider:before
    position: absolute
    content: ""
    height: 12px
    width: 12px
    left: 4px
    bottom: 4px
    background-color: #7e7e7e
    transition: .3s
    border-radius: 50%
  & input:checked + .slider
    background-color: #4c4d50
  & input:checked + .slider:before
    transform: translateX(21px)
.on-image
  position: absolute
  height: 16px
  width: 16px
  left: 3px
  bottom: 2px
  transition: 0.4s
  border-radius: 50%
.off-image
  position: absolute
  height: 12px
  width: 12px
  left: 23px
  bottom: 4px
  transition: 0.4s
  border-radius: 50%
</style>