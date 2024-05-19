<template>
  <div class="page__wrapper">
    <div class="btn__wrapper" style="display: flex;">
      <button class="active-tab switch-btn" @click="selectTab('employees')">Сотрудники</button>
      <button class="switch-btn" @click="selectTab('audiences')">Аудитории</button>
    </div>
    <div class="line"></div>
    <div class="top__panel">
      <my-button
          class="create-btn"
          @click="this.dialogVisible = true"
          style="margin-top: 20px;">
        Добавить сотрудника
      </my-button>
      <create-dialog v-model:show="dialogVisible">
        <add-employee-form @create="addEmployee"/>
      </create-dialog>
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
import CreateDialog from "@/components/UI/CreateDialog.vue"
import SearchBar from "@/components/UI/SearchBar.vue"
import MyButton from "@/components/UI/MyButton.vue"
import ListOfCards from "@/components/ListOfCards.vue"
import employeesApi from "@/api/employeesApi"
import AddEmployeeForm from "@/components/employees/AddEmployeeForm.vue"
import EmployeeInfoCard from "@/components/employees/EmployeeInfoCard.vue"

export default {
  components: {EmployeeInfoCard, AddEmployeeForm, ListOfCards, MyButton, SearchBar, CreateDialog},
  data() {
    return {
      searchQuery: '',
      employees: [],
      isLoading: false,
      dialogVisible: false,
      selectedEmployee: null
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
    async addEmployee (object) {
      const getImageResponse = await employeesApi.getImage(object.employee.image.image_id)

      const employee = {
        id: object.employee.employee_id,
        lastName: object.employee.second_name,
        firstName: object.employee.first_name,
        patronymic: object.employee.middle_name,
        imageId: object.employee.image.image_id,
        photo: getImageResponse,
        type: object.employee.employee_type,
        qrData: object.employee.qr,
        IDId: object.id,
        IDNumber: object.number,
        IDStartDate: this.formatDate(object.start_date),
        IDEndDate: this.formatDate(object.end_date),
      }
      this.employees.push(employee)
      this.dialogVisible = false
    },
    showInfoCard (employee) {
      this.selectedEmployee = employee
    },
    removeEmployee (employee) {
      this.employees = this.employees.filter(emp => emp.id !== employee.id)
    },
    async fetchEmployees () {
      this.isLoading = true
      const getImagesResponse = await employeesApi.getAllImages()
      console.log(getImagesResponse)
      const getEmployeesResponse = await employeesApi.getAllIDs()
      console.log(getEmployeesResponse)

      for (const it of getEmployeesResponse) {
        if (it.employee.employee_status === "WORKS" && it.employee.employee_type !== "WATCHMAN") {
          const getImageResponse = await employeesApi.getImage(it.employee.image.image_id)
          const employee = {
            id: it.employee.employee_id,
            lastName: it.employee.second_name,
            firstName: it.employee.first_name,
            patronymic: it.employee.middle_name,
            imageId: it.employee.image.image_id,
            photo: getImageResponse,
            type: it.employee.employee_type,
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
    },
    convertType(type) {
      if (type === "TEACHER") return 'Преподаватель'
      else if (type === "SERVICE") return 'Персонал'
      else if (type === "SECURITY") return 'Охрана'
    }
  },
  computed: {
    searchedEmployees () {
      const query = this.searchQuery.toLowerCase()
      const convertedTypes = this.employees.map(employee => this.convertType(employee.type).toLowerCase())

      return [...this.employees].filter((employee, index) => {
        const convertedType = convertedTypes[index]
        return Object.values(employee).some(value => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(query)
          }
          return false;
        }) || convertedType.includes(query)
      })
    }
  },
  mounted() {
    this.fetchEmployees()
  }
}
</script>

<style scoped>
.line {
  height: 1px;
  top: -1px;
  background-color: lightgray;
  position: relative;
  width: 100%;
}

.top__panel, .center__panel {
  display: flex;
  justify-content: space-between;
}
</style>
