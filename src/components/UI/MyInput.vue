<template>
  <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
  >
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string | undefined
}>()
</script>

<style lang="sass" scoped>
input
  font-family: 'Open Sans', sans-serif
  margin-bottom: 10px
  border-radius: 5px
  border: 1px solid #7e7e7e
  padding: 2px 5px
  color: var(--text-color)
  background-color: var(--options-background-color)
  &::placeholder
    color: #7e7e7e
  &:focus
    outline: none
    box-shadow: 0 0 5px 1.5px #295bc4
</style>




