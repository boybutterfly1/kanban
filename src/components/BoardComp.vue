<template>
  <div v-if="!kanbanStore.loading"
       class="board"
  >
    <div class="board__header">
      <div class="board__header__name">
        <span>{{board.name}}</span>
      </div>
      <div class="board__header__options">
          <my-input
            v-model="kanbanStore.searchValue"
            type="text"
            placeholder="Search by task"
          />
          <my-select
            :array="tasksSortValuesArray"
            v-model="tasksSortValue"
            select-name="Sort by"
          />
          <button
              @click="isShowFilters = !isShowFilters"
              :class="{'active' : isShowFilters, 'filters-selected' : selectedFilterOption}"
          >
            <img src="https://img.icons8.com/ios-filled/50/484747/horizontal-settings-mixer--v1.png" alt="filter"/>
            Filters
          </button>
      </div>
    </div>
    <hr>
    <div
        v-if="isShowFilters"
        class="board__header__options__filters"
    >
      <div class="filters-container">
        <div
          class="filter"
          :class="{'active' : Object.values(filter)[0].length > 0}"
          v-for="filter in filtersArray"
          :key="Object.keys(filter)[0]"
          @click="openFilterPopup(filter)"
        >
          <img src="https://img.icons8.com/android/24/484747/filter.png" alt="filter"/>
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
                src="https://img.icons8.com/ios/50/plus-math--v1.png"
                alt="add column"
                @click="popupsFlagsStore.newColumnPopupIsOpen = true"
            />
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
  </div>

  <div v-else class="board-skeleton">
    <div class="board-skeleton__header">
      <div class="board-skeleton__header__name"/>
      <div class="board-skeleton__header__options">
        <div
            style="width: 159px"/>
        <div
            style="width: 85px"/>
        <div
            style="width: 70px"/>
      </div>
    </div>
    <hr>
<!--    <div class="board-skeleton__header__options__filters">-->
<!--      <div class="filters-container">-->
<!--        <div class="filter"/>-->
<!--      </div>-->
<!--      <hr>-->
<!--    </div>-->
    <div class="board__container">
      <div class="column-skeleton">
        <div class="column-skeleton__header">
          <div class="column-skeleton__header__name">
            <div/>
          </div>
        </div>
        <hr>
        <div class="task-skeleton"/>
      </div>
      <div class="column-skeleton">
        <div class="column-skeleton__header">
          <div class="column-skeleton__header__name">
            <div/>
          </div>
        </div>
        <hr>
        <div class="task-skeleton"/>
        <div class="task-skeleton"/>
        <div class="task-skeleton"/>
      </div>
      <div class="column-skeleton">
        <div class="column-skeleton__header">
          <div class="column-skeleton__header__name">
            <div/>
          </div>
        </div>
        <hr>
        <div class="task-skeleton"/>
        <div class="task-skeleton"/>
      </div>
      <div class="column-skeleton">
        <div class="column-skeleton__header">
          <div class="column-skeleton__header__name">
            <div/>
          </div>
        </div>
        <hr>
        <div class="task-skeleton"/>
      </div>
      <div class="column-skeleton">
        <div class="column-skeleton__header">
          <div class="column-skeleton__header__name">
            <div/>
          </div>
        </div>
        <hr>
        <div class="task-skeleton"/>
        <div class="task-skeleton"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ColumnComp from "@/components/ColumnComp.vue";
import {Board, Column, User} from "@/types/types";
import {computed, onMounted, ref, watchEffect} from "vue";
import MyInput from "@/components/UI/MyInput.vue";
import MyPopup from "@/components/UI/MyPopup.vue";
import MySelect from "@/components/UI/MySelect.vue";
import {useKanbanStore} from "@/store/kanban";
import MyButton from "@/components/UI/MyButton.vue";
import {usePopupsFlagsStore} from "@/store/popupsFlags";
import {useUsersStore} from "@/store/users";
import router from "@/router";
import {useRoute} from "vue-router";
import TaskComp from "@/components/TaskComp.vue";
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
      gap: 20px
      & button
        margin-top: 1px
        margin-bottom: 10px
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
            &.active
              background-color: #a4baec
            &:hover
              background-color: #a7adb2
            & img
              width: 13px
              height: 13px
              margin-right: 2px
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
    & .btn
      width: 30px
      height: 30px
      border: none
      cursor: pointer
      border-radius: 15%
      &:hover
        background-color: #a7adb2

.board-skeleton
  padding: 55px 40px
  display: flex
  flex-direction: column
  &__header
    display: flex
    justify-content: space-between
    align-items: center
    &__name
      height: 30px
      width: 175px
      margin-bottom: 10px
      border-radius: 5px
      background: linear-gradient(90deg, #b0b0b0, #e8e8e8, #b0b0b0)
      background-size: 200% 200%
      animation: gradientAnimation 1.5s linear infinite
    &__options
      margin-bottom: 5px
      display: flex
      gap: 20px
      & div
        height: 24px
        border-radius: 5px
        background: linear-gradient(90deg, #b0b0b0, #e8e8e8, #b0b0b0)
        background-size: 200% 200%
        animation: gradientAnimation 1.5s linear infinite
      &__filters
        display: flex
        margin-bottom: 10px
        flex-direction: column
        & .filters-container
          display: flex
          margin-bottom: 10px
          justify-content: flex-start
          & .filter
            height: 24px
            width: 160px
            border-radius: 5px
            background: linear-gradient(90deg, #b0b0b0, #e8e8e8, #b0b0b0)
            background-size: 200% 200%
            animation: gradientAnimation 1.5s linear infinite
.column-skeleton
  display: flex
  flex-direction: column
  width: 300px
  gap: 10px
  margin-right: 30px
  &__header
    display: flex
    align-items: center
    justify-content: space-between
    width: 300px
    &__name
      & div
        height: 21.5px
        width: 300px
        border-radius: 5px
        background: linear-gradient(90deg, #b0b0b0, #e8e8e8, #b0b0b0)
        background-size: 200% 200%
        animation: gradientAnimation 1.5s linear infinite
.task-skeleton
  width: 300px
  height: 110px
  border-radius: 15px
  background: linear-gradient(90deg, #b0b0b0, #e8e8e8, #b0b0b0)
  background-size: 200% 200%
  animation: gradientAnimation 1.5s linear infinite
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
@keyframes gradientAnimation
  0%
    background-position: 0 0

  50%
    background-position: 100% 0

  100%
    background-position: 0 0
hr
  width: 100%
  margin-bottom: 10px
  border: 0
  height: 1px
  background-color: #b7b6b6
</style>