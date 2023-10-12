<template>
  <div class="auth">
      <form
        v-if="isRegistered"
        class="auth__login"
      >
        <my-input
            v-model="user.login"
            type="text"
            placeholder="Login"
            autofocus
        />
        <my-input
            v-model="user.password"
            type="password"
            placeholder="Password"
        />
        <button
          @click="login(user)"
          type="submit"
        >
          Login
        </button>
        <span @click="changeInputs">Registration</span>
      </form>
      <form
        v-else
      >
        <my-input
            v-model="user.username"
            type="text"
            pattern="[a-zA-Z0-9]"
            placeholder="Username"
            autofocus
        />
        <my-input
            v-model="user.login"
            type="text"
            pattern="[a-zA-Z0-9\s@_]"
            placeholder="Login"
        />
        <my-input
            v-model="user.password"
            type="password"
            placeholder="Password"
            show-password
            @input="validatePassword"
        />
        <div class="error" v-if="!isPasswordValid">{{passwordError}}</div>
        <button
            @click="register(user)"
            type="submit"
        >
          Register
        </button>
        <span @click="changeInputs">Login</span>
      </form>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {User} from "@/types/types";
import {useUsersStore} from "@/store/users";
import router from "@/router";
import MyInput from "@/components/UI/MyInput.vue";

const usersStore = useUsersStore()
const isRegistered = ref<boolean>(true)
const user = ref<User>({
  id: Date.now(),
  username: '',
  login: '',
  password: '',
  regDate: new Date().toDateString()
})
function changeInputs() {
  isRegistered.value = !isRegistered.value

  user.value.username = ''
  user.value.login = ''
  user.value.password = ''
}
const isPasswordValid = ref<boolean | null>(null)
const passwordError = ref<string>('')
function validatePassword() {
  if (user.value.password && user.value.password.length < 8 || user.value.password && !/^[A-Za-z0-9.,!?;:]+$/.test(user.value.password)) {
    isPasswordValid.value = false
    passwordError.value = 'The password must contain 8 or more characters and can only include English letters, numbers and punctuation marks'
  } else {
    isPasswordValid.value = true
    passwordError.value = ''
  }
}
function login(currentUser: User) {
  const user = usersStore.users.find(user => user.login === currentUser.login && user.password === currentUser.password)
  if (user) {
    usersStore.currentUser = user;
    usersStore.isLoggedIn = true;
    router.push('/')
  }
}
function register(currentUser: User) {
  usersStore.users.push(currentUser)
  usersStore.currentUser = currentUser;
  usersStore.isLoggedIn = true;
  router.push('/')
}
</script>

<style lang="sass" scoped>
.auth
  position: absolute
  top: 40%
  left: 50%
  transform: translate(-50%, -50%)
  border-radius: 8px
  border: 1px solid #d9d9d9
  box-shadow: 5px 5px 10px rgba(0,0,0,0.1)
  padding: 10px
  background-color: white
  & form
    display: flex
    flex-direction: column
    align-items: center
    & button
      margin: 5px 0 10px
      padding: 5px 10px
      font-family: 'Open Sans', sans-serif
      font-size: 14px
      cursor: pointer
      border-radius: 5px
      border: 0
      background-color: #3f74e3
      color: white
      &:hover
        background-color: #2953ab
    & span
      font-size: 13px
      cursor: pointer
      color: #6b6a6a
      &:hover
        text-decoration: underline
    & .error
      width: 150px
      color: red
      font-size: 12px
</style>