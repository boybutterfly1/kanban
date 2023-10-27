<template>
  <div :class="{'light' : !kanbanStore.darkMode, 'dark' : kanbanStore.darkMode}">
    <div v-if="!kanbanStore.isLoading"
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
            <img src="https://img.icons8.com/ios-filled/50/7e7e7e/horizontal-settings-mixer--v1.png" alt="filter"/>
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
              :class="{'active' : filtersObject[filter].length > 0}"
              v-for="filter in Object.keys(filtersObject)"
              :key="filter"
              @click="openFilterPopup(filter)"
          >
            <img src="https://img.icons8.com/android/24/black/filter.png" alt="filter"/>
            {{ filter }}
            <span v-if="filtersObject[filter].length ">{{': ' + filtersObject[filter].join(', ')}}</span>
          </div>
          <div class="reset-btn" @click="resetFilters">
            <img v-if="kanbanStore.darkMode" src="https://img.icons8.com/ios-filled/50/ffffff/recurring-appointment.png" alt="reset">
            <img v-else src="https://img.icons8.com/ios-filled/50/000000/recurring-appointment.png" alt="reset">
            <span>Reset</span>
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
                  :array="filterOptionsArray(selectedFilter)"
                  :select-name="'Select ' + selectedFilter.toLowerCase()"
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
            :filters="filtersObject"
        />
        <img
            v-if="board.availableStatuses.length"
            class="btn"
            src="https://img.icons8.com/ios/50/7e7e7e//plus-math--v1.png"
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
      <div
          class="board__selected-tasks"
          v-if="kanbanStore.selectedTasks.length"
      >
        <div class="board__selected-tasks__options">
          <div class="selected-tasks-count">
            <span v-if="kanbanStore.selectedTasks.length === 1">{{kanbanStore.selectedTasks.length}} task selected</span>
            <span v-else>{{kanbanStore.selectedTasks.length}} tasks selected</span>
          </div>
          <div
              class="change"
              @click="isSelectedTasksChangeStatusPopupOpen = true"
          >
            <img src="https://img.icons8.com/material-outlined/48/ffffff/change.png" alt="change">
            <span>Change status</span>
          </div>
          <div
              class="remove"
              @click="removeSelectedTasks"
          >
            <img src="https://img.icons8.com/ios-filled/50/ffffff/trash--v1.png" alt="trash">
            <span>Remove from board</span>
          </div>
        </div>
        <img
            class="board__selected-tasks__close"
            src="https://img.icons8.com/ios-filled/50/ffffff/delete-sign--v1.png"
            alt="close"
            @click="kanbanStore.selectedTasks = []"
        >
        <my-popup
            :is-open="isSelectedTasksChangeStatusPopupOpen"
            @close="isSelectedTasksChangeStatusPopupOpen = false"
        >
          <div class="change-status-popup">
            <my-select
                v-model="selectedTasksChangeStatus"
                :array="selectedTasksChangeStatuses"
                @change="changeStatus"
                select-name="Select status"
            />
          </div>
        </my-popup>
      </div>
      <div
          class="board__empty-board"
          v-if="!props.board.columns.length"
      >
        <span>No tasks found</span>
        <my-button @click="popupsFlagsStore.newColumnPopupIsOpen = true">
          Add column
        </my-button>
      </div>
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
  </div>
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
  tasksList: []
})
const isFilterPopupOpen = ref(false)
const isShowFilters = ref(false)
const isSelectedTasksChangeStatusPopupOpen = ref(false)
const selectedTasksChangeStatus = ref('')
const selectedTasksChangeStatuses = computed<string[]>(() => {
  const changeStatuses: string[] = []
  props.board.columns.forEach((column: Column) => {
    column.statuses.forEach((status: string) => {
      if (status !== 'Open') changeStatuses.push(status)
    })
  })
  return changeStatuses
})

const tasksSortValuesArray = ref(['Default', 'Priority', 'Deadline', 'Start Date'])
const tasksSortValue = ref('')
const selectedStatus = ref('')

const filtersObject = ref<Record<string, string[]>>({
  Status: [],
  Priority: [],
  Author: []
})
const selectedFilter = ref('')
const selectedFilterOption = ref('')
const selectedFilterOptionsArray = ref<string[]>([])

function resetFilters() {
  Object.keys(filtersObject.value).forEach(key => {
    filtersObject.value[key] = []
  })
}
function filterOptionsArray(filter: string):string[] {
  const filters: Record<string, string[]> = {
    'Status': kanbanStore.statuses,
    'Priority': Object.values(kanbanStore.priorities),
    'Author': usersStore.users.map((user: User) => user.username)
  }
  return filters[filter]
}
function addToSelectedFilterOptionsArray() {
  if (!selectedFilterOptionsArray.value.some((option: string) => option === selectedFilterOption.value)) {
    selectedFilterOptionsArray.value.push(selectedFilterOption.value)
  }
}
function applyFilterPopup() {
  filtersObject.value[selectedFilter.value] = [...selectedFilterOptionsArray.value]
  selectedFilterOptionsArray.value = []
  selectedFilterOption.value = ''
  isFilterPopupOpen.value = false
}
function closeFilterPopup() {
  selectedFilterOptionsArray.value = []
  isFilterPopupOpen.value = false
  selectedFilterOption.value = ''
}
function openFilterPopup(filter: string) {
  isFilterPopupOpen.value = true
  selectedFilter.value = filter
  if (filtersObject.value[filter].length){
    selectedFilterOptionsArray.value = [...filtersObject.value[filter]]
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
  if (newColumn.value.name && newColumn.value.statuses.length) {
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
function removeSelectedTasks() {
  const selectedTaskIds = kanbanStore.selectedTasks.map((task: Task) => task.id);
  props.board.columns.forEach((column: Column) => {
    column.tasksList = column.tasksList.filter((task: Task) => {
      return !selectedTaskIds.includes(task.id)
    })
  })
  kanbanStore.selectedTasks = []
}
function changeStatus() {
  console.log(props.board.columns)
  kanbanStore.selectedTasks.forEach((selectedTask: Task) => {
    selectedTask.status = selectedTasksChangeStatus.value
    props.board.columns.forEach((column: Column) => {
      column.tasksList = column.tasksList.filter((task: Task) => {
        return task.id !== selectedTask.id
      })
    })
    props.board.columns.forEach((column: Column) => {
      if (column.statuses.includes(selectedTask.status)) {
        selectedTask.columnId = column.id
        column.tasksList.push({...selectedTask})
      }
    })
  })

  isSelectedTasksChangeStatusPopupOpen.value = false
  kanbanStore.selectedTasks = []
  selectedTasksChangeStatus.value = ''
}
</script>

<style lang="sass" scoped>
.board
  padding: 65px 60px
  display: flex
  flex-direction: column
  overflow: scroll
  &__empty-board
    margin-top: 50px
    padding: 50px
    align-self: center
    width: 500px
    border-radius: 15px
    border: 1px solid var(--task-border-color)
    box-shadow: 5px 10px 10px rgba(0,0,0,0.1)
    background-color: var(--task-background-color)
    display: flex
    flex-direction: column
    align-items: center
    gap: 20px
    justify-content: center
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
        background-color: var(--options-background-color)
        border-radius: 5px
        border: 1px solid #7e7e7e
        color: #7e7e7e
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
            color: black
            cursor: pointer
            &.active
              background-color: #a4baec
            &:hover
              background-color: #a7adb2
            & img
              width: 13px
              height: 13px
              margin-right: 2px
          & .reset-btn
            display: flex
            align-items: center
            padding: 3px 5px
            font-size: 13px
            border-radius: 5px
            margin: 0 5px 3px 7px
            border: none
            color: var(--text-color)
            cursor: pointer
            & img
              width: 15px
              margin-right: 5px
            & span
              font-size: 13px
            &:hover
              border-radius: 5px
              background-color: #cbd3da
          & .filterOptionsPopup
            padding: 15px
            display: flex
            flex-direction: column
            width: 180px
            &__options
              display: flex
              flex-wrap: wrap
              justify-content: flex-start
              &__option
                color: black
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
  &__selected-tasks
    align-self: center
    align-items: center
    display: flex
    position: fixed
    padding: 10px 15px
    bottom: 20px
    height: 50px
    width: 90%
    border-radius: 10px
    background-color: #3f74e3
    justify-content: space-between
    &__options
      display: flex
      gap: 30px
      color: white
      font-size: 13px
      align-items: center
      & .selected-tasks-count
          font-weight: bold
          color: white
      & .change
        display: flex
        cursor: pointer
        padding: 5px
        align-items: center
        &:hover
          background-color: #6d95ea
          border-radius: 5px
        & img
          width: 20px
          height: 20px
          margin-right: 5px
      & .remove
        display: flex
        cursor: pointer
        padding: 5px
        align-items: center
        &:hover
          background-color: #6d95ea
          border-radius: 5px
        & img
          width: 15px
          height: 15px
          margin-right: 5px
    &__close
      width: 30px
      cursor: pointer
      padding: 5px
      &:hover
        background-color: #6d95ea
        border-radius: 5px
  &__container
    display: flex
    overflow-x: auto
    white-space: nowrap
    & .btn
      width: 30px
      height: 30px
      border: none
      cursor: pointer
      border-radius: 15%
      &:hover
        background-color: #a7adb2

.board-skeleton
  padding: 65px 40px
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
      background: var(--linear-gradient)
      background-size: 200% 200%
      animation: gradientAnimation 1.5s linear infinite
    &__options
      margin-bottom: 5px
      display: flex
      gap: 20px
      & div
        height: 24px
        border-radius: 5px
        background: var(--linear-gradient)
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
            background: var(--linear-gradient)
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
        background: var(--linear-gradient)
        background-size: 200% 200%
        animation: gradientAnimation 1.5s linear infinite
.task-skeleton
  width: 300px
  height: 110px
  border-radius: 15px
  background: var(--linear-gradient)
  background-size: 200% 200%
  animation: gradientAnimation 1.5s linear infinite
.new-column
  display: flex
  flex-direction: column
  width: 180px
  padding: 15px
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
  background-color: #7e7e7e
.change-status-popup
  padding: 15px
</style>