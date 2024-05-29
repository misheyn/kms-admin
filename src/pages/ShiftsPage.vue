<template>
  <div class="page__wrapper">
    <div class="top__panel" style="align-items: center;">
      <date-picker
          v-model="selectedDateRange"
          range
          placeholder="Выберите дату(ы) смены"/>
      <search-bar
          v-model="searchQuery"
          placeholder="Поиск..."/>
    </div>
    <div class="center__panel">
      <div class="shifts-list">
        <div
            class="shifts"
            v-for="(shift, index) in sortedFilteredShiftsByDate"
            :key="index">
          <div class="shift-date-time"> Смена
            {{ formatDate(shift.startDateTime) }} ({{ formatTime(shift.startDateTime) }} -
            {{ formatTime(shift.endDateTime) }})
          </div>
          <div class="watchman-info">
            <div class="watchman-photo">
              <img :src="handleImagePreview(shift.watchman.photo)" alt="watchman-img">
            </div>
            <div class="watchman-name" style="margin-left: 5px; font-size: small">
              {{ shift.watchman.lastName }} {{ shift.watchman.firstName }}<br>{{ shift.watchman.login }}
            </div>
          </div>
          <list-of-cards
              v-if="!isLoading"
              :objects="searchedOperations(shift.operations)"
              :element="'операций'"
              :card-type="'operation'"
              @show-info-card="showInfoCard"/>
          <h3 v-else style="margin: 15px 5px">Загрузка...</h3>
        </div>
      </div>
      <operation-info-card
          v-if="selectedOperation"
          :operation="selectedOperation"
          @close-info-card="this.selectedOperation = null"/>
    </div>
  </div>
</template>

<script>
import SearchBar from "@/components/UI/SearchBar.vue"
import ListOfCards from "@/components/ListOfCards.vue"
import employeesApi from "@/api/employeesApi"
import shiftsApi from "@/api/shiftsApi"
import OperationInfoCard from "@/components/shifts/OperationInfoCard.vue"
import DatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export default {
  components: {OperationInfoCard, ListOfCards, SearchBar, DatePicker},
  data() {
    return {
      searchQuery: '',
      shifts: [],
      isLoading: false,
      dialogVisible: false,
      selectedOperation: null,
      selectedDateRange: null
    }
  },
  methods: {
    handleImagePreview(file) {
      return URL.createObjectURL(file)
    },
    formatDate(date) {
      const dateObject = new Date(date)
      const year = dateObject.getFullYear()
      const month = (dateObject.getMonth() + 1).toString().padStart(2, "0")
      const day = dateObject.getDate().toString().padStart(2, "0")
      return `${day}.${month}.${year}`
    },
    formatTime(date) {
      if (date === null || date === undefined) return '...'
      else {
        const dateObject = new Date(date)
        const hours = dateObject.getHours()
        const minutes = dateObject.getMinutes()
        const seconds = dateObject.getSeconds()
        return `${hours}:${minutes}:${seconds}`
      }
    },
    showInfoCard(operation) {
      this.selectedOperation = operation
    },
    async fetchShifts() {
      this.isLoading = true
      try {
        const getShiftsResponse = await shiftsApi.getAllShifts()
        for (const itShift of getShiftsResponse) {
          const getImageResponse = await employeesApi.getImage(
              itShift.watchman.employee.image.image_id
          )
          const shift = {
            id: itShift.shift_id,
            startDateTime: itShift.start_date_time,
            endDateTime: itShift.end_date_time,
            watchman: {
              login: itShift.watchman.username,
              firstName: itShift.watchman.employee.firstName,
              lastName: itShift.watchman.employee.secondName,
              patronymic: itShift.watchman.employee.middleName,
              photo: getImageResponse,
            },
            operations: [],
          }
          const getOperationsResponse = await shiftsApi.getAllOperationsByShift(shift.id)
          for (const itOperation of getOperationsResponse) {
            const getImageResponse = await employeesApi.getImage(
                itOperation.employee.image.image_id
            )
            const operation = {
              id: itOperation.operation_id,
              key: {
                number: itOperation.key.audience.number,
                signalisation: itOperation.key.audience.signalisation,
                permissions: itOperation.key.audience.permissions,
                keyState: itOperation.key.key_state,
                main: itOperation.key.main,
              },
              employee: {
                firstName: itOperation.employee.firstName,
                lastName: itOperation.employee.secondName,
                patronymic: itOperation.employee.middleName,
                photo: getImageResponse,
                type: itOperation.employee.employeeType,
                permissions: itOperation.employee.permissions,
              },
              giveDateTime: itOperation.give_date_time,
              returnDateTime: itOperation.return_date_time,
              signatures: [],
            }
            operation.signatures = await shiftsApi.getSignaturesByOperation(operation.id)
            shift.operations.push(operation)
          }
          this.shifts.push(shift)
        }
        this.isLoading = false
      } catch (error) {
        console.error("Error fetching shifts:", error)
        alert("Error fetching shifts")
        this.isLoading = false
      }
    },
    searchObject(object, query) {
      if (typeof object === "string") return object.toLowerCase().includes(query)
      else if (typeof object === 'number') return object.toString().toLowerCase().includes(query)
      else if (typeof object === "object" && object !== null)
        return Object.values(object).some(value => this.searchObject(value, query))
      return false
    },
    searchedOperations(operations) {
      const query = this.searchQuery.toLowerCase()
      if (!query) return operations
      return operations.filter((operation) => operation && this.searchObject(operation, query))
    },
    isDateInRange(date, range) {
      const dateObject = new Date(date)
      const [start, end] = range
      return (!start || dateObject >= new Date(start)) && (!end || dateObject <= new Date(end))
    }
  },
  computed: {
    sortedShifts() {
      return [...this.shifts].sort((a, b) => new Date(b.startDateTime) - new Date(a.startDateTime))
    },
    sortedFilteredShifts() {
      const query = this.searchQuery.toLowerCase()
      if (!query) return this.sortedShifts

      return this.sortedShifts
          .map((shift) => {
            const filteredOperations = this.searchedOperations(shift.operations)
            return {...shift, operations: filteredOperations}
          })
          .filter((shift) => shift.operations.length > 0)
    },
    sortedFilteredShiftsByDate() {
      if (!this.selectedDateRange) return this.sortedFilteredShifts

      return this.sortedFilteredShifts.filter(shift => this.isDateInRange(shift.startDateTime, this.selectedDateRange))
    }
  },
  mounted() {
    this.fetchShifts()
  }
}
</script>

<style scoped>
.top__panel, .center__panel {
  display: flex;
  justify-content: space-between;
  padding: 15px 5px;
}

.watchman-photo {
  height: 30px;
  overflow: hidden;
}

.watchman-photo img {
  height: 100%;
  width: auto;
}

.shifts {
  display: flex;
  flex-direction: column;
  padding: 10px 5px;
}

.shifts-list {
  max-height: 80vh;
  overflow-y: auto;
  width: 49%;
}

.shift-date-time {
  font-weight: bold;
  font-size: large;
}

.watchman-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 2px;
}

.dp__main {
  width: fit-content;
}
</style>
