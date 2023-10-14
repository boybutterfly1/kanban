<template>
  <div class="board">
    <div class="board__header">
      <div class="board__header__name">
        <span>{{board.name}}</span>
      </div>
      <div class="board__header__options">
        <div>
          <my-input
            v-model="kanbanStore.searchValue"
            type="text"
            placeholder="Search by task"
          />
        </div>
        <div>Sort by</div>
        <div>Filters</div>
      </div>
    </div>
    <hr>
      <div class="board__container">
        <column-comp
          v-for="column in board.columns"
          :key="column.id"
          :column="column"
          :board="board"
        />
          <img
            class="btn"
            src="https://img.icons8.com/ios/50/000000/plus--v1.png"
            alt="plus--v1"
            @click="popupsFlagsStore.newColumnPopupIsOpen = true"
          />
      </div>
  </div>
  <my-popup
    :is-open="popupsFlagsStore.newColumnPopupIsOpen"
    @close="newColumnPopupClose"
  >
    <form @submit.prevent class="new-column">
      <my-select
        v-model="selectedStatus"
        :array="props.board.availableStatuses"
        @change="addStatus(selectedStatus)"
        select-name="Column statuses"
      />
      <div class="new-column__statuses">
        <button
          v-for="status in newColumn.statuses"
          @click="deleteStatus(status)"
        >
          {{status}}
        </button>
      </div>
      <my-input
        v-model="newColumn.name"
        type="text"
        placeholder="Column name"
      />
      <my-button
        @click="addNewColumn"
      >
        Add
      </my-button>
    </form>
  </my-popup>


</template>

<script setup lang="ts">
import ColumnComp from "@/components/ColumnComp.vue";
import {Board, Column} from "@/types/types";
import {ref} from "vue";
import MyInput from "@/components/UI/MyInput.vue";
import MyPopup from "@/components/UI/MyPopup.vue";
import MySelect from "@/components/UI/MySelect.vue";
import {useKanbanStore} from "@/store/kanban";
import MyButton from "@/components/UI/MyButton.vue";
import {usePopupsFlagsStore} from "@/store/popupsFlags";

const popupsFlagsStore = usePopupsFlagsStore()
const kanbanStore = useKanbanStore()
const props = defineProps<{
  board: Board
}>()
const newColumn = ref<Column>({
  id: null,
  name: '',
  statuses : [],
  tasksList: []
})

const selectedStatus = ref<string>('')

function addStatus(newStatus:string) {
  newColumn.value.statuses.push(newStatus)
  newColumn.value.name = newColumn.value.statuses.join(', ')
  selectedStatus.value = ''
}
function deleteStatus(selectedStatus:string) {
  if (newColumn.value.statuses.find(status => status === selectedStatus)){
    newColumn.value.statuses = newColumn.value.statuses.filter(status => status !== selectedStatus)
    newColumn.value.name = newColumn.value.statuses.join(', ')
  }
}
function addNewColumn() {
  if (newColumn.value.name && newColumn.value.statuses.length > 0) {
    newColumn.value.id = Date.now()
    props.board.columns.push({...newColumn.value})
    props.board.availableStatuses = props.board.availableStatuses.filter((status: string) => !newColumn.value.statuses.includes(status))
    newColumnPopupClose()
  }
}
function newColumnPopupClose() {
  newColumn.value.tasksList = []
  newColumn.value.statuses = []
  newColumn.value.name = ''
  popupsFlagsStore.newColumnPopupIsOpen = false
}
</script>

<style lang="sass" scoped>
.board
  display: flex
  flex-direction: column
  padding: 40px
  &__header
    display: flex
    justify-content: space-between
    &__name
      font-weight: bold
      font-size: 25px
    &__options
      display: flex
      & div
        margin-left: 20px
  &__container
    display: flex
    overflow-x: auto
    white-space: nowrap
    & .btn
      width: 30px
      height: 30px
      border: none
      cursor: pointer
      border-radius: 50%
      &:hover
        background-color: #a7adb2
.new-column
  display: flex
  flex-direction: column
  width: 180px
  &__statuses
    display: flex
    flex-wrap: wrap
    justify-content: flex-start
    margin-bottom: 10px
    & button
      padding: 2px 5px
      font-size: 12px
      border-radius: 5px
      margin: 0 5px 3px 0
      border: none
      background-color: #cbd3da
      cursor: pointer
      &:hover
        background-color: #a7adb2
hr
  margin-bottom: 30px
  border: 0
  height: 1px
  background-color: #b7b6b6
</style>