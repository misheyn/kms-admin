<template>
  <div class="page__wrapper">
    <div class="btns__wrapper" style="display: flex;">
      <button class="active-tab switch-btn" @click="selectTab('employees')">Сотрудники</button>
      <button class="switch-btn" @click="selectTab('audiences')">Аудитории</button>
    </div>
    <div class="line"></div>
    <div class="top__panel">
      <my-button
          class="create-btn"
          @click="this.dialogVisible = true">
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
          :objects="searchedEmployee"
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
import AddEmployeeForm from "@/components/employees/AddEmployeeForm.vue";
import EmployeeInfoCard from "@/components/employees/EmployeeInfoCard.vue";

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
    addEmployee (object) {
      const employee = {
        id: object.employee_id,
        lastName: object.second_name,
        firstName: object.first_name,
        patronymic: object.middle_name,
        type: object.employee_type,
      };
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
      const getEmployeesResponse = await employeesApi.getAllEmployees()
      console.log(getEmployeesResponse)
      getEmployeesResponse.forEach(it => {
        if (it.employee_status === "WORKS") {
          const employee = {
            id: it.employee_id,
            lastName: it.second_name,
            firstName: it.first_name,
            patronymic: it.middle_name,
            type: it.employee_type,
          }
          this.employees.push(employee)
        }
      })
      this.isLoading = false
    },
    updateEmployeeInfo(updatedEmployee) {
      const index = this.employees.findIndex(e => e.id === updatedEmployee.id)
      if (index !== -1) {
        this.employees.splice(index, 1, updatedEmployee)
      }
      this.showInfoCard(updatedEmployee)
    }
  },
  computed: {
    searchedEmployee () {
      const query = this.searchQuery.toLowerCase();
      return [...this.employees].filter(employee => {
        return Object.values(employee).some(value => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(query);
          }
          return false;
        });
      });
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

.create-btn {
  cursor: pointer;
  margin-top: 20px;
}
</style>
