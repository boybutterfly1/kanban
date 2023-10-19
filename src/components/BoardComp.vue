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
              :class="{'active' : isShowFilters, 'filters-selected' : selectedFilterOption}"
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
             v-for="filter in filtersArray"
             :key="Object.keys(filter)[0]"
             @click="openFilterPopup(filter)"
        >
          {{Object.keys(filter)[0]}}
          <span v-if="Object.values(filter)[0].length > 0">{{': ' + Object.values(filter)[0].join(', ')}}</span>
        </div>
        <my-popup
            :is-open="isFilterPopupOpen"
            @close="closeFilterPopup"
        >
          <form
            @submit.prevent
            class="filterOptionsPopup"
          >
            <my-select
              v-model="selectedFilterOption"
              :array="filterOptionsArray(Object.keys(selectedFilter)[0])"
              :select-name="'Select ' + Object.keys(selectedFilter)[0]"
              @change="addToSelectedFilterOptionsArray"
            />

            <div class="filterOptionsPopup__options">
              <div
                  class="filterOptionsPopup__options__option"
                  v-for="option in selectedFilterOptionsArray"
                   @click="deleteOption(option)"
              >
                {{option}}
                <img src="https://img.icons8.com/ios-filled/50/multiply.png" alt="delete option"/>
              </div>
            </div>
            <my-button
                @click="applyFilterPopup"
            >
              Apply
            </my-button>
          </form>
        </my-popup>
      </div>
      <hr>
    </div>
      <div class="board__container">
        <column-comp
          v-for="column in props.board.columns"
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
import {Board, Column, User} from "@/types/types";
import {computed, onMounted, ref} from "vue";
import MyInput from "@/components/UI/MyInput.vue";
import MyPopup from "@/components/UI/MyPopup.vue";
import MySelect from "@/components/UI/MySelect.vue";
import {useKanbanStore} from "@/store/kanban";
import MyButton from "@/components/UI/MyButton.vue";
import {usePopupsFlagsStore} from "@/store/popupsFlags";
import {useUsersStore} from "@/store/users";
import router from "@/router";
import {useRoute} from "vue-router";
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
const isFilterPopupOpen = ref(false)
const isShowFilters = ref(false)

const tasksSortValuesArray = ref(['Default', 'Priority', 'Deadline', 'Start Date'])
const tasksSortValue = ref('')
const selectedStatus = ref('')
const filtersArray = ref<{ [key: string]: string[] }[]>([
  { Status: [] },
  { Priority: [] },
  { Author: [] },
]);
const selectedFilterOption = ref('')
const selectedFilter = ref<{ [key: string]: string[] }>({})
const selectedFilterOptionsArray = ref<string[]>([])

const filterResult = computed<Column[]>(() => {
  const statusConditions = filtersArray.value[0]['Status']
  const priorityConditions = filtersArray.value[1]['Priority']
  const authorConditions = filtersArray.value[2]['Author']

  const result: Column[] = props.board.columns.map((column: Column) => {
    const filteredTasks = column.tasksList.filter((task) => {
      const statusMatch = statusConditions.length === 0 || statusConditions.includes(task.status)
      const priorityMatch = priorityConditions.length === 0 || priorityConditions.includes(task.priority)
      const authorMatch = authorConditions.length === 0 || authorConditions.includes(task.author)
      return statusMatch && priorityMatch && authorMatch
    });
    return { ...column, tasksList: filteredTasks }
  });
  return result || props.board.columns
});

function filterOptionsArray(filter: string):string[] {
  const filters: Record<string, string[]> = {
    'Status': kanbanStore.statuses,
    'Priority': Object.values(kanbanStore.priorities),
    'Author': usersStore.users.map((user: User) => user.username)
  }
  return filters[filter]
}
function addToSelectedFilterOptionsArray() {
  if (!selectedFilterOptionsArray.value.some(options => options === selectedFilterOption.value)) {
    selectedFilterOptionsArray.value.push(selectedFilterOption.value)
  }
}
function applyFilterPopup() {
  const key = Object.keys(selectedFilter.value)[0]
  selectedFilter.value[key] = [...selectedFilterOptionsArray.value]
  selectedFilterOptionsArray.value = []
  selectedFilterOption.value = ''
  isFilterPopupOpen.value = false
}
function closeFilterPopup() {
  selectedFilterOptionsArray.value = []
  isFilterPopupOpen.value = false
  selectedFilterOption.value = ''

}
function openFilterPopup(filter: object) {
  isFilterPopupOpen.value = true
  selectedFilter.value = filter
  if (Object.values(filter)[0].length > 0){
    selectedFilterOptionsArray.value = Object.values(filter)[0]
  }
}
function deleteOption(selectedOption:string) {
  selectedFilterOptionsArray.value = selectedFilterOptionsArray.value.filter((option: string) => {
    return option !== selectedOption
  })
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

onMounted(() => {
  console.log(useRoute())
})
</script>

<style lang="sass" scoped>
.board
  padding: 55px 40px
  display: flex
  flex-direction: column
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
        &.filters-selected
          background-color: #c4d3f5
          &:hover
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
          & .filterOptionsPopup
            display: flex
            flex-direction: column
            width: 180px
            &__options
              display: flex
              flex-wrap: wrap
              justify-content: flex-start
              &__option
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