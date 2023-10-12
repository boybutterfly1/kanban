<template>
  <div>
    <board-comp
        :board="currentBoard"
    />
  </div>
</template>

<script setup lang="ts">
import BoardComp from "@/components/BoardComp.vue";
import {useKanbanStore} from "@/store/kanban";
import {Board} from "@/types/types";
import {ref} from "vue";
import {useRoute} from "vue-router";

const route = useRoute()
const kanbanStore = useKanbanStore()
const currentBoardId = ref<number>(+(route.params.id))
const currentBoard = kanbanStore.boards.find(board => board.id === currentBoardId.value)
</script>

<style lang="sass" scoped>

</style>