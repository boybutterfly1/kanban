<template>
  <div class="app">
<!--    <navbar v-if="route.path !== '/authorization'"/>-->
    <navbar/>
    <router-view/>
  </div>
</template>

<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
import {useRoute} from "vue-router";
import {useKanbanStore} from "@/store/kanban";
import {watch} from "vue";

const kanbanStore = useKanbanStore()
const route = useRoute()

watch(() => kanbanStore.darkMode, () => {
  if (kanbanStore.darkMode === true) {
    document.documentElement.style.setProperty('--app-background-color', '#222326');
    document.documentElement.style.setProperty('--options-background-color', '#222326');
    document.documentElement.style.setProperty('--task-background-color', '#38393c');
    document.documentElement.style.setProperty('--task-hover-background-color', '#4c4d50');
    document.documentElement.style.setProperty('--task-border-color', '#38393c');
    document.documentElement.style.setProperty('--task-border-hover-color', '#4c4d50');
    document.documentElement.style.setProperty('--text-color', 'white');
    document.documentElement.style.setProperty('--linear-gradient', 'linear-gradient(90deg, #525252, #707070, #525252)');


  } else {
    document.documentElement.style.setProperty('--app-background-color', '#f8f8f8');
    document.documentElement.style.setProperty('--options-background-color', 'white');
    document.documentElement.style.setProperty('--task-background-color', 'white');
    document.documentElement.style.setProperty('--task-hover-background-color', 'gainsboro');
    document.documentElement.style.setProperty('--task-border-color', '#eeeded');
    document.documentElement.style.setProperty('--task-border-hover-color', '#d9d9d9');
    document.documentElement.style.setProperty('--text-color', 'black');
    document.documentElement.style.setProperty('--linear-gradient', 'linear-gradient(90deg, #b0b0b0, #e8e8e8, #b0b0b0)');

  }
})
</script>

<style lang="sass">
*
  margin: 0
  padding: 0
  box-sizing: border-box
.app
  font-family: 'Open Sans', sans-serif
  background-color: var(--app-background-color)
  min-height: 100vh
  color: var(--text-color)
</style>