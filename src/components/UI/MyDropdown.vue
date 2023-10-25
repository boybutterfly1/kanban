<template>
  <div
      v-if="isOpen"
      class="dropdown"
  >
    <slot/>
  </div>
</template>

<script setup lang="ts">
import {onBeforeMount, onMounted, onUpdated, ref, watch} from "vue";
import {useKanbanStore} from "@/store/kanban";

const kanbanStore = useKanbanStore()
const props = defineProps<{
  isOpen: boolean
  coordinates: Record<string, number | null>,
  dropdownId: string
  direction?: string
}>()
const emits = defineEmits(['close'])
const elementToHide = ref<HTMLElement | null>(null);
const handleClickOutside = (event: MouseEvent) => {
  if (elementToHide.value && !elementToHide.value.contains(event.target as Node)) {
    emits('close')
    elementToHide.value = null
    kanbanStore.openDropdowns = []
  }
};
onUpdated(() => {
  elementToHide.value = document.querySelector('.dropdown');
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
})
onBeforeMount(() => {
  document.removeEventListener('click', handleClickOutside);
})
watch(() => {return kanbanStore.openDropdowns[kanbanStore.openDropdowns.length - 2]}, () => {
  let openDropdown: string = ''
  if (kanbanStore.openDropdowns.length > 1) {
    openDropdown = kanbanStore.openDropdowns[kanbanStore.openDropdowns.length - 2]
  }
  if (openDropdown === props.dropdownId) {
    emits('close')
    elementToHide.value = null
  }
}, {deep: true})
</script>

<style lang="sass">
.dropdown
  position: fixed
  transform: translate(-50%, -50%)
  background-color: var(--task-background-color)
  border-radius: 5px
  border: 1px solid var(--task-border-color)
  box-shadow: 5px 10px 10px rgba(0,0,0,0.1)
</style>
