<template>
  <div class="page__wrapper">
    <div class="btn__wrapper" style="display: flex; margin-top: 10px;">
      <button class="active-tab switch-btn" @click="selectTab('employees')">Сотрудники</button>
      <button class="switch-btn" @click="selectTab('audiences')">Аудитории</button>
    </div>
    <div class="line"></div>
    <div class="top__panel" style="align-items: center;">
      <my-button
          class="create-btn"
          @click="this.dialogVisible = true">
        Добавить сотрудника
      </my-button>
      <my-dialog v-model:show="dialogVisible">
        <add-employee-form @create="addEmployee"/>
      </my-dialog>
      <select v-model="selectedType" class="filter-type">
        <option value="" selected disabled>Выберите тип</option>
        <option value="">Все</option>
        <option value="TEACHER">Преподаватель</option>
        <option value="SERVICE">Персонал</option>
        <option value="SECURITY">Охрана</option>
      </select>
      <search-bar
          v-model="searchQuery"
          placeholder="Поиск..."/>
    </div>
    <div class="center__panel">
      <list-of-cards
          v-if="!isLoading"
          :objects="searchedEmployees"
          :element="'сотрудников'"
          :card-type="'employee'"
          @show-info-card="showInfoCard"/>
      <h2 v-else style="margin: 15px 5px">Загрузка...</h2>
      <employee-info-card
          v-if="selectedEmployee"
          :employee="selectedEmployee"
          @close-info-card="this.selectedEmployee = null"
          @remove="removeEmployee"
          @update-employee-info="updateEmployeeInfo"/>
    </div>
  </div>
</template>

<script>
import MyDialog from "@/components/UI/MyDialog.vue"
import SearchBar from "@/components/UI/SearchBar.vue"
import MyButton from "@/components/UI/MyButton.vue"
import ListOfCards from "@/components/ListOfCards.vue"
import employeesApi from "@/api/employeesApi"
import AddEmployeeForm from "@/components/employees/AddEmployeeForm.vue"
import EmployeeInfoCard from "@/components/employees/EmployeeInfoCard.vue"

export default {
  components: {EmployeeInfoCard, AddEmployeeForm, ListOfCards, MyButton, SearchBar, MyDialog},
  data() {
    return {
      searchQuery: '',
      employees: [],
      isLoading: false,
      dialogVisible: false,
      selectedEmployee: null,
      selectedType: ''
    }
  },
  methods: {
    selectTab(tab) {
      if (tab === 'audiences') this.$router.push('/audiences')
      else this.$router.push('/employees')
    },
    formatDate(date) {
      const dateObject = new Date(date)
      const year = dateObject.getFullYear()
      const month = (dateObject.getMonth() + 1).toString().padStart(2, "0")
      const day = dateObject.getDate().toString().padStart(2, "0")
      return `${year}-${month}-${day}`
    },
    async addEmployee(object) {
      const getImageResponse = await employeesApi.getImage(object.employee.image.image_id)

      const employee = {
        id: object.employee.employeeId,
        lastName: object.employee.secondName,
        firstName: object.employee.firstName,
        patronymic: object.employee.middleName,
        imageId: object.employee.image.image_id,
        photo: getImageResponse,
        type: object.employee.employeeType,
        qrData: object.employee.qr,
        IDId: object.id,
        IDNumber: object.number,
        IDStartDate: this.formatDate(object.start_date),
        IDEndDate: this.formatDate(object.end_date),
      }
      this.employees.push(employee)
      this.dialogVisible = false
    },
    showInfoCard(employee) {
      this.selectedEmployee = employee
    },
    removeEmployee(employee) {
      this.employees = this.employees.filter(emp => emp.id !== employee.id)
    },
    async fetchEmployees() {
      this.isLoading = true
      const getEmployeesResponse = await employeesApi.getAllIDs()

      for (const it of getEmployeesResponse) {
        if (it.employee.employeeStatus === "WORKS" && it.employee.employeeType !== "WATCHMAN") {
          const getImageResponse = await employeesApi.getImage(it.employee.image.image_id)
          const employee = {
            id: it.employee.employeeId,
            lastName: it.employee.secondName,
            firstName: it.employee.firstName,
            patronymic: it.employee.middleName,
            imageId: it.employee.image.image_id,
            photo: getImageResponse,
            type: it.employee.employeeType,
            qrData: it.employee.qr,
            IDId: it.id,
            IDNumber: it.number,
            IDStartDate: this.formatDate(it.start_date),
            IDEndDate: this.formatDate(it.end_date),
          }
          this.employees.push(employee)
        }
      }
      this.isLoading = false
    },
    async updateEmployeeInfo(updatedEmployee) {
      const index = this.employees.findIndex(e => e.id === updatedEmployee.id)
      if (index !== -1) this.employees.splice(index, 1, updatedEmployee)
      updatedEmployee.photo = await employeesApi.getImage(updatedEmployee.imageId)
      this.showInfoCard(updatedEmployee)
    }
  },
  computed: {
    searchedEmployees() {
      const query = this.searchQuery.toLowerCase()
      return [...this.employees]
          .filter(employee => {
            return (!this.selectedType || employee.type === this.selectedType) &&
                Object.values(employee).some(value => {
                  if (typeof value === 'string') {
                    return value.toLowerCase().includes(query)
                  } else if (value !== undefined && value !== null) {
                    return value.toString().toLowerCase().includes(query)
                  }
                  return false
                })
          })
    }
  },
  mounted() {
    this.fetchEmployees()
  }
}
</script>

<style scoped>
.top__panel, .center__panel {
  display: flex;
  justify-content: space-between;
  padding: 15px 5px;
}

.filter-type {
  margin-left: auto;
  margin-right: 10px;
  height: 25px;
  border: none;
}
</style>
