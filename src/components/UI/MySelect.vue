<template>
  <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
  >
    <option
        v-for="option in getOptions(props.array)"
        :key="option.value"
        :value="option.value"
    >
        {{option.label}}
    </option>
  </select>
</template>

<script setup lang="ts">
import {Option} from "@/types/types";

const props = defineProps<{
  modelValue: string[]
  array: string[]
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

</style>




