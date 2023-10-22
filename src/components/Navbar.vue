<template>
  <nav>
    <div class="navbar">
      <div class="navbar__navigation">
        <span>Boards</span>
        <span>/</span>
        <span>Boards</span>
      </div>
      <div class="navbar__options">
        <span></span>
        <span></span>
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
        <span v-if="usersStore.isLoggedIn">Logout</span>
        <span v-else>Login</span>
      </div>
    </div>
  </nav>

</template>

<script setup lang="ts">
import {useUsersStore} from "@/store/users";
import {useKanbanStore} from "@/store/kanban";

const kanbanStore = useKanbanStore()
const usersStore = useUsersStore()
</script>

<style lang="sass" scoped>
.navbar
  display: flex
  width: 100%
  position: fixed
  height: 35px
  border-bottom: 1px solid #7e7e7e
  background-color: var(--app-background-color)
  align-items: center
  padding: 0 20px
  justify-content: space-between
  &__navigation
    & span
      font-size: 14px
      margin-right: 5px
  &__options
    display: flex
    align-items: center
    gap: 15px

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