import {defineStore} from "pinia";
import {ref} from "vue";
import {User} from "@/types/types";
import router from "@/router";

export const useUsersStore = defineStore('users', () => {
  const isLoggedIn = ref(false)
  const currentUser = ref<User | null>(null)
  const admin = ref<User>({
    id: 1,
    username: 'Admin',
    login: '123',
    password: '123',
    regDate: new Date().toDateString()
  })
  const users = ref<User[]>([
    admin.value,
  ])
  function logout() {
    currentUser.value = null
    isLoggedIn.value = false
    router.replace('/authorization').then(r => {})
  }
  return {
    isLoggedIn,
    currentUser,
    users,
    logout
  }
})