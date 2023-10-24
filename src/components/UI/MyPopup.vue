<template>
  <div
      v-if="isOpen && !coordinates"
      class="popup-overlay-fixed"
      @click="$emit('close')"
  >
    <div
        class="popup-content-fixed"
        @click.stop
    >
      <slot/>
    </div>
  </div>
  <div
      v-if="isOpen && coordinates"
      class="popup-content-unfixed"
  >
      <slot/>
  </div>
</template>

<script setup lang="ts">
import {onUpdated, ref} from "vue";

const props = defineProps<{
  isOpen: boolean
  coordinates?: Record<string, number | null>
}>()
const emits = defineEmits(['close'])
const elementToHide = ref<HTMLElement | null>(null);
const handleClickOutside = (event: MouseEvent) => {
  if (elementToHide.value && !elementToHide.value.contains(event.target as Node)) {
    emits('close')
  }
};

onUpdated(() => {
  const popup: HTMLElement | null = document.querySelector('.popup-content-unfixed')
  const rect = popup?.getBoundingClientRect()
  if (popup && rect && props.coordinates) {
    popup.style.top = props.coordinates.top + rect.height/2 + 'px'
    popup.style.left = props.coordinates.left + rect.width/2 + 'px'
  }
  elementToHide.value = document.querySelector('.popup-content-unfixed');
  document.addEventListener('click', handleClickOutside);
})
</script>

<style lang="sass">
.popup-overlay-fixed
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
.popup-content-fixed
  position: absolute
  top: 40%
  left: 50%
  transform: translate(-50%, -50%)
  background-color: var(--task-background-color)
  border-radius: 5px
.popup-content-unfixed
  position: fixed
  transform: translate(-50%, -50%)
  background-color: var(--task-background-color)
  border-radius: 5px
  border: 1px solid var(--task-border-color)
  box-shadow: 5px 10px 10px rgba(0,0,0,0.1)
</style>
