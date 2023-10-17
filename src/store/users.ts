import {defineStore} from "pinia";
import {ref} from "vue";
import {User} from "@/types/types";

export const useUsersStore = defineStore('users', () => {
  const isLoggedIn: boolean = false
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

  return {
    isLoggedIn,
    currentUser,
    users
  }
})