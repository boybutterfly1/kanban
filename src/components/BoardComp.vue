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
        <div>
          <MySelect
            :array="tasksSortValuesArray"
            v-model="tasksSortValue"
            select-name="Sort by"
          />
        </div>
        <div>
          <button
              @click="isShowFilters = !isShowFilters"
              :class="{'active' : isShowFilters}"
          >
            <img src="https://img.icons8.com/material-outlined/24/484747/filter--v1.png" alt="filter"/>
            Filters
          </button>
        </div>
      </div>
    </div>
    <hr>
    <div
        v-if="isShowFilters"
        class="board__header__options__filters"
    >
      <div class="filters-container">
        <div class="filter"
             v-for="filter in tasksFiltersArray"
             :key="filter"
             @click="openFilterPopup(filter)"
        >
          {{filter}}
          <span v-if="selectedFilter === filter">: {{selectedFilterOption}}</span>
        </div>
        <my-popup
            :is-open="isFilterPopupOpen"
            @close="isFilterPopupOpen = false"
        >
          Select
          <my-select
            v-model="selectedFilterOption"
            :array="filterOptionsArray(selectedFilter)"
            :select-name="selectedFilter"
          />
        </my-popup>
      </div>
      <hr>
    </div>
      <div class="board__container">
        <column-comp
          v-for="column in filterResult"
          :key="column.id"
          :column="column"
          :board="board"
          :sort-value="tasksSortValue"
        />
          <img
            v-if="board.availableStatuses.length > 0"
            class="btn"
            src="https://img.icons8.com/ios/50/000000/plus--v1.png"
            alt="add column"
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
        <div class="new-column__statuses__status"
          v-for="status in newColumn.statuses"
          @click="deleteStatus(status)"
        >
          {{status}}
          <img src="https://img.icons8.com/ios-filled/50/multiply.png" alt="delete status"/>
        </div>
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
import {Board, Column, Task, User} from "@/types/types";
import {computed, ref} from "vue";
import MyInput from "@/components/UI/MyInput.vue";
import MyPopup from "@/components/UI/MyPopup.vue";
import MySelect from "@/components/UI/MySelect.vue";
import {useKanbanStore} from "@/store/kanban";
import MyButton from "@/components/UI/MyButton.vue";
import {usePopupsFlagsStore} from "@/store/popupsFlags";
import {useUsersStore} from "@/store/users";
const usersStore = useUsersStore()
const popupsFlagsStore = usePopupsFlagsStore()
const kanbanStore = useKanbanStore()
const props = defineProps<{
  board: Board
}>()
const newColumn = ref<Column>({
  id: null,
  name: '',
  statuses : [],
  tasksList: [],
  boardId: props.board.id
})

const selectedFilterOption = ref('')
const selectedFilter = ref('')
const isFilterPopupOpen = ref(false)
const isShowFilters = ref(false)
const tasksSortValuesArray = ref(['Default', 'Priority', 'Deadline', 'Start Date'])
const tasksFiltersArray = ref(['Status', 'Priority', 'Author'])
const tasksSortValue = ref('')
const selectedStatus = ref('')

const filterResult = computed<Column[]>(() => {
  if (selectedFilterOption.value) {
    return props.board.columns.map((column: Column) => {
      const filteredTasks = column.tasksList.filter((task: Task) => {
        if (selectedFilter.value === 'Status') return task.status === selectedFilterOption.value
        if (selectedFilter.value === 'Priority') return task.priority === selectedFilterOption.value
        if (selectedFilter.value === 'Author') return task.author === selectedFilterOption.value
      });
      return { ...column, tasksList: filteredTasks }
    });
  }
  return props.board.columns;
});

function filterOptionsArray(filter: string):string[] {
  const filters: Record<string, string[]> = {
    'Status': kanbanStore.statuses,
    'Priority': Object.values(kanbanStore.priorities),
    'Author': usersStore.users.map((user: User) => user.username)
  }
  return filters[filter]
}
function openFilterPopup(filter: string) {
  isFilterPopupOpen.value = true
  selectedFilter.value = filter
}
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
    align-items: center
    &__name
      font-weight: bold
      font-size: 25px
      margin-bottom: 5px
    &__options
      display: flex
      & div
        margin-left: 20px
      & button
        margin-top: 1px
        font-family: 'Open Sans', sans-serif
        font-size: 14px
        padding: 1px 5px
        display: flex
        background-color: white
        border-radius: 5px
        border: 1px solid #d9d9d9
        color: #484747
        cursor: pointer
        &:hover
          background-color: #a4baec
        & img
          padding: 2px 0
          width: 15px
          margin-right: 2px
        &.active
          background-color: #a4baec
      &__filters
        display: flex
        margin-bottom: 10px
        flex-direction: column
        & .filters-container
          display: flex
          margin-bottom: 10px
          justify-content: flex-start
          & .filter
            display: flex
            align-items: center
            padding: 3px 5px
            font-size: 13px
            border-radius: 5px
            margin: 0 5px 3px 0
            border: none
            background-color: #cbd3da
            cursor: pointer
            &:hover
              background-color: #a7adb2
            & img
              width: 15px
              height: 15px
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
    &__status
      align-items: center
      padding: 3px 5px
      font-size: 13px
      border-radius: 5px
      margin: 0 5px 3px 0
      border: none
      background-color: #cbd3da
      cursor: pointer
      &:hover
        background-color: #a7adb2
      & img
        width: 15px
        height: 15px
        vertical-align: -3.5px
hr
  width: 100%
  margin-bottom: 10px
  border: 0
  height: 1px
  background-color: #b7b6b6
</style>