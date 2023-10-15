<script lang="ts" setup>

</script>

<template>
  <div class="loader"></div>
</template>

<style lang="sass" scoped>
@keyframes spin
  from
    transform: rotate(0deg)
  to
    transform: rotate(360deg)

.loader
  position: absolute
  top: 45%
  left: 50%
  transform: translate(-50%, -50%)
  border: 3px solid white
  border-top: 3px solid #a7afb7
  border-radius: 50%
  width: 50px
  height: 50px
  animation: spin 0.8s linear infinite
  margin: -25px
</style>