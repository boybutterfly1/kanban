<template>
  <div v-if="isOpen" class="popup">
    <div class="popup__content">
      <slot/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

const isOpen = ref<boolean>(false);
</script>

<style lang="sass">

</style>
