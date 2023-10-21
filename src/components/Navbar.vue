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
          <input type="checkbox" id="toggle">
          <span class="slider"></span>
        </label>
        <span v-if="usersStore.isLoggedIn">Logout</span>
        <span v-else>Login</span>
      </div>
    </div>
  </nav>

</template>

<script setup lang="ts">
import {useUsersStore} from "@/store/users";

const usersStore = useUsersStore()
</script>

<style lang="sass" scoped>
.navbar
  display: flex
  width: 100%
  position: fixed
  height: 35px
  border-bottom: 1px solid #b7b6b6
  background-color: #f8f8f8
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
.switch .slider
  position: absolute
  cursor: pointer
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: white
  transition: .3s
  border-radius: 25px
  border: 1px solid #d9d9d9
.switch .slider:before
  position: absolute
  content: ""
  height: 12px
  width: 12px
  left: 4px
  bottom: 4px
  background-color: #d9d9d9
  transition: .3s
  border-radius: 50%
.switch input:checked + .slider
  background-color: #a4baec
.switch input:checked + .slider:before
  transform: translateX(21px)
</style>