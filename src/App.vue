<template>
  <div class="app">
    <navbar v-if="route.path !== '/authorization'"/>
    <router-view/>
  </div>
</template>

<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
import {useRoute} from "vue-router";

const route = useRoute()
</script>

<style lang="sass">
*
  margin: 0
  padding: 0
  box-sizing: border-box
.app
  font-family: 'Open Sans', sans-serif
  background-color: #f8f8f8
  min-height: 100vh

</style>