<template>
  <div
      v-if="isOpen"
      class="dropdown"
      :id="String(id) + '-dropdown'"
  >
    <slot/>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, onUpdated, ref, watch} from "vue";
import {useKanbanStore} from "@/store/kanban";

const kanbanStore = useKanbanStore()
const props = defineProps<{
  isOpen: boolean
  coordinates: Record<string, number | null>,
  id: number | string | null
  direction?: string
}>()
const emits = defineEmits(['close'])
const elementToHide = ref<HTMLElement | null>(null);
function close() {
  if (kanbanStore.openDropdown !== String(props.id) + '-dropdown') {
    emits('close')
  }
}
const handleClickOutside = (event: MouseEvent) => {
  if (elementToHide.value && !elementToHide.value.contains(event.target as Node)) {
    emits('close')
  }
}
const handleScroll = () => {
  emits('close')
}
onUpdated(() => {
  elementToHide.value = document.getElementById(String(props.id) + '-dropdown');
  const rect = elementToHide.value?.getBoundingClientRect()

  if (elementToHide.value && rect && props.coordinates && props.direction === 'left') {
    elementToHide.value.style.top = props.coordinates.top? props.coordinates.top + rect.height/2 + 'px' : ''
    elementToHide.value.style.left = props.coordinates.left? props.coordinates.left - rect.width/2 + 'px': ''
  } else if (elementToHide.value && rect && props.coordinates) {
    elementToHide.value.style.top = props.coordinates.top? props.coordinates.top + rect.height/2 + 'px' : ''
    elementToHide.value.style.left = props.coordinates.left? props.coordinates.left + rect.width/2 + 'px': ''
  }
})
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('scroll', handleScroll);
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('scroll', handleScroll);
})
watch(() => {return kanbanStore.openDropdown}, () => {
  close()
})
</script>

<style lang="sass">
.dropdown
  position: fixed
  transform: translate(-50%, -50%)
  background-color: var(--task-background-color)
  border-radius: 5px
  border: 1px solid var(--task-border-color)
  box-shadow: 5px 10px 10px rgba(0,0,0,0.1)
  z-index: 10
</style>
