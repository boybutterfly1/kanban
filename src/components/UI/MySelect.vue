<template>
  <select
      v-if="selectName && array"
      :value="modelValue"
      @change="emitChange($event.target.value)"
  >
    <option disabled selected value="">{{selectName}}</option>
    <option
        v-for="option in getOptions(array? array: [])"
        :key="option.value"
        :value="option.label"
    >
      {{option.label}}
    </option>
  </select>

  <select
      v-if="!selectName && array"
      :value="modelValue"
      @change="emitChange($event.target.value)"
  >
    <option selected value="">{{getOptions(array)[0].label}}</option>
    <option
        v-for="option in getOptions(array? array: []).slice(1)"
        :key="option.value"
        :value="option.label"
    >
      {{option.label}}
    </option>
  </select>

  <select
      v-if="selectName && props.enum"
      :value="modelValue"
      @change="emitChange($event.target.value)"
  >
    <option disabled selected value="">{{selectName}}</option>
    <option
        v-for="value in enumKeys"
        :key="value"
        :value="value"
    >
      {{value}}
    </option>
  </select>
</template>

<script setup lang="ts">
import {computed} from "vue";

const props = defineProps<{
  modelValue: string
  array?: string[]
  selectName?: string
  enum?: Object
}>()
const emits = defineEmits(['update:modelValue', 'change'])
const enumKeys = computed<string[]>(() => {
  return Object.values(props.enum? props.enum : {}).slice(1, 6)
})
function emitChange(event: Event) {
  emits('update:modelValue', event)
  emits('change')
}
function getOptions(array: string[]) {
  if (array) {
    return array.map((item: string) => {
      return {value: item.toLowerCase().replace(' ','-'), label: item};
    });
  }
}
</script>

<style lang="sass" scoped>
select
  margin-bottom: 5px
  font-family: 'Open Sans', sans-serif
  border-radius: 5px
  border: 1px solid #d9d9d9
  color: #757575
  &:focus
    outline: none
</style>