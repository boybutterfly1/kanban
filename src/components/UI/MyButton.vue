<template>
  <button>
    <slot/>
  </button>
</template>

<script setup lang="ts">
</script>

<style lang="sass" scoped>
button
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
</style>




