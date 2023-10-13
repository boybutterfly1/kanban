<template>
  <div class="board">
    <div class="board__header">
      <div class="board__header__name">
        <span>{{board.name}}</span>
      </div>
      <div class="board__header__options">
        <div>
          <my-input
              v-model="searchValue"
              type="text"
              placeholder="Search"
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
            :board="props.board"

        />
          <img
              class="btn"
              src="https://img.icons8.com/ios/50/000000/plus--v1.png"
              alt="plus--v1"
              @click="newColumnPopupIsOpen = true"
          />
      </div>
  </div>
  <my-popup
      :is-open="newColumnPopupIsOpen"
      @close="newColumnPopupClose"
  >
    <form @submit.prevent class="new-column">
      <my-select
          v-model="selectedStatus"
          :array="kanbanStore.statuses"
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
          placeholder="Column Name"
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
import {Board, Column, Task} from "@/types/types";
import {computed, ref} from "vue";
import MyInput from "@/components/UI/MyInput.vue";
import MyPopup from "@/components/UI/MyPopup.vue";
import MySelect from "@/components/UI/MySelect.vue";
import {useKanbanStore} from "@/store/kanban";
import MyButton from "@/components/UI/MyButton.vue";
import {prop} from "vue-class-component";
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

const newColumnPopupIsOpen = ref<boolean>(false)
const selectedStatus = ref<string>('')
const searchValue = ref<string>()

function newColumnPopupClose() {
  newColumn.value.statuses = []
  newColumn.value.name = ''
  newColumnPopupIsOpen.value = false
}
function addStatus(selectedStatus:string) {
  if (newColumn.value.statuses.find(status => status === selectedStatus)){
    newColumn.value.statuses = newColumn.value.statuses.filter(status => status !== selectedStatus)
  } else {
    newColumn.value.statuses.push(selectedStatus)
  }
}
function deleteStatus(selectedStatus:string) {
  if (newColumn.value.statuses.find(status => status === selectedStatus)){
    newColumn.value.statuses = newColumn.value.statuses.filter(status => status !== selectedStatus)
  }
}
function addNewColumn() {
  if (newColumn.value.name && newColumn.value.statuses.length > 0) {
    newColumn.value.id = Date.now()
    props.board.columns.push({...newColumn.value})
    newColumn.value.tasksList = []
    newColumnPopupClose()
  }
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
@drop="handleDrop(column.id)"