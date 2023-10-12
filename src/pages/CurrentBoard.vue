<template>
  <div>
    <board-comp
        :board="board"
    />
  </div>
</template>

<script setup lang="ts">
import BoardComp from "@/components/BoardComp.vue";
import {useKanbanStore} from "@/store/kanban";
import {Board} from "@/types/types";
import {ref} from "vue";

const kanbanStore = useKanbanStore()
const board = ref<Board>(kanbanStore.board1)
</script>

<style lang="sass" scoped>

</style>