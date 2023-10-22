<template>
  <div
      v-if="isOpen"
      class="popup-overlay"
      @click="$emit('close')"
  >
    <div class="popup-content" @click.stop>
      <slot/>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()
</script>

<style lang="sass">
.popup-overlay
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  display: flex
  align-items: center
  justify-content: center
  z-index: 100
  background-color: rgb(0, 0, 0, 0.3)
.popup-content
  position: absolute
  top: 40%
  left: 50%
  transform: translate(-50%, -50%)
  background-color: var(--task-background-color)
  padding: 15px
  border-radius: 5px
</style>
