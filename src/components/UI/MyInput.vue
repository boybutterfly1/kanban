<template>
  <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
  >
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()
</script>

<style lang="sass" scoped>
input
  font-family: 'Open Sans', sans-serif
  margin-bottom: 10px
  border-radius: 5px
  border: 1px solid #d9d9d9
  padding: 2px 5px
  &:focus
    outline: none
    box-shadow: 0 0 5px #3f74e3
</style>




