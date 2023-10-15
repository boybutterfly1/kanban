<template>
  <div
      class="auth"
      v-if="!kanbanStore.loading"
  >
      <form
        @submit.prevent
        v-if="isRegistered"
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
        <my-button
          @click="login(user)"
          type="submit"
        >
          Login
        </my-button>
        <span @click="changeInputs">Registration</span>
      </form>
      <form
        @submit.prevent
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
        <my-button
            @click="register(user)"
            type="submit"
        >
          Register
        </my-button>
        <span @click="changeInputs">Login</span>
      </form>
  </div>
  <loading v-else/>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {User} from "@/types/types";
import {useUsersStore} from "@/store/users";
import router from "@/router";
import MyInput from "@/components/UI/MyInput.vue";
import MyButton from "@/components/UI/MyButton.vue";
import Loading from "@/components/UI/Loading.vue";
import {useKanbanStore} from "@/store/kanban";
const kanbanStore = useKanbanStore()
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
    kanbanStore.loading = true
    setTimeout(() => {
      router.push('/');
      kanbanStore.loading = false
    }, 800);
  }
}

function register(currentUser: User) {
  usersStore.users.push(currentUser)
  usersStore.currentUser = currentUser;
  usersStore.isLoggedIn = true;
  kanbanStore.changePage('/')
}
</script>

<style lang="sass" scoped>
.auth
  position: absolute
  top: 45%
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