<template>
  <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
  >
    <option disabled selected value="">{{selectName}}</option>
    <option
        v-for="option in getOptions(array)"
        :key="option.value"
        :value="option.label"
    >
      {{option.label}}
    </option>
  </select>
</template>

<script setup lang="ts">
import {Option} from "@/types/types";

const props = defineProps<{
  modelValue: string
  array: string[]
  selectName : string
}>()
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