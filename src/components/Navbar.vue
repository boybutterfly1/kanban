<template>
  <nav>
    <div class="navbar">
      <div class="navigation">
        <span>Boards</span>
        <span>/</span>
        <span>Boards</span>
      </div>
      <div class="options">
        <span></span>
        <span></span>
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
  & span
    font-size: 14px
    margin-right: 5px
</style>