<template>
  <div class="info-card">
    <div class="close-cross" @click="closeInfoCard"></div>
    <div v-if="!editNameMode" class="name" style="font-size: large; display: flex">
      <b>{{ division.name }}</b>
      <div class="edit-name" @click="editNameMode = true"></div>
    </div>
    <div v-else>
      <input v-model="newDivisionName" class="name-input"/>
      <button @click="updateDivisionName" class="confirm-btn">
        Подтвердить
      </button>
    </div>
    <search-bar
      v-model="searchQuery"
      placeholder="Поиск..."/>
    <div class="info__wrapper">
      <div v-if="employees.length > 0 && !editListMode" class="employee-list" v-scroll="handleScroll">
        <employee-list-item
            v-for="(item, index) in searchedEmployees"
            :employee="item"
            :key="index"
            :is-edit-mode="editListMode"/>
      </div>
      <h4 v-if="employees.length <= 0 && !editListMode" style="margin: 5px">В этом подразделении нет сотрудников</h4>
      <div v-if="editListMode" class="employee-list" v-scroll="handleScroll">
        <employee-list-item
            v-for="(item, index) in searchedEmployees"
            :employee="item"
            :key="index"
            :is-edit-mode="editListMode"
            @chosen="handleChosen"/>
      </div>
    </div>
    <div class="btn__wrapper">
      <my-button v-if="!editListMode" class="btn-edit" @click="openEditMode">Редактировать</my-button>
      <my-button
          v-if="editListMode"
          class="btn-cancel"
          @click="editListMode = false">Отменить</my-button>
      <my-button
          v-if="editListMode"
          class="btn-save"
          @click="saveChanges">Сохранить изменения</my-button>
    </div>
  </div>
</template>

<script>
import MyButton from "@/components/UI/MyButton.vue"
import {mapMutations, mapState} from "vuex"
import SearchBar from "@/components/UI/SearchBar.vue"
import divisionsApi from "@/api/divisionsApi"
import employeesApi from "@/api/employeesApi"
import EmployeeListItem from "@/components/EmployeeListItem.vue"
import vScroll from "@/directives/vScroll"

export default {
  components: {EmployeeListItem, SearchBar, MyButton},
  directives: {
    'v-scroll': vScroll
  },
  data() {
    return {
      editDialogVisible: false,
      removeDialogVisible: false,
      searchQuery: '',
      editNameMode: false,
      editListMode: false,
      newDivisionName: '',
      employees: [],
      allEmployees: [],
      addEmployees: [],
      removeEmployees: []
    }
  },
  props: {
    division: {
      type: Object,
      required: true
    }
  },
  emits: ['close-info-card', 'remove', 'update-division-name'],
  methods: {
    ...mapMutations({
      setActiveIndex: 'index/setActiveIndex'
    }),
    closeInfoCard() {
      this.$emit('close-info-card')
      this.setActiveIndex(null)
    },
    handleScroll(){},
    async updateDivisionName() {
      const updatedDivision = {...this.division}
      const updateResponse = await divisionsApi.updateDivision(this.division.id, this.newDivisionName)
      console.log(updateResponse)
      if (updateResponse.status === 200) {
        updatedDivision.name = updateResponse.data.name
        this.$emit('update-division-name', updatedDivision)
        this.editNameMode = false
      }
    },
    async openEditMode() {
      this.allEmployees = []
      const getEmployeesResponse = await employeesApi.getAllEmployees()
      console.log(getEmployeesResponse)

      for (const it of getEmployeesResponse) {
        if (it.employee_status === "WORKS" && it.employee_type !== "WATCHMAN") {
          const getImageResponse = await employeesApi.getImage(it.image.image_id)
          let flag = false
          if (it.divisions) {
            it.divisions.forEach(itDiv => {
              if (itDiv.division_id === this.division.id) flag = true
            })
          }
          const employee = {
            id: it.employee_id,
            lastName: it.second_name,
            firstName: it.first_name,
            patronymic: it.middle_name,
            photo: getImageResponse,
            inDivision: flag,
            isChosen: false
          }
          this.allEmployees.push(employee)
        }
      }
      this.editListMode = true
    },
    async getEmployees() {
      const getEmployeesResponse = await employeesApi.getAllEmployees()
      console.log(getEmployeesResponse)

      for (const it of getEmployeesResponse) {
        if (it.employee_status === "WORKS" && it.employee_type !== "WATCHMAN" && it.divisions) {
          for (const itDiv of it.divisions) {
            if (itDiv.division_id === this.division.id) {
              const getImageResponse = await employeesApi.getImage(it.image.image_id)
              const employee = {
                id: it.employee_id,
                lastName: it.second_name,
                firstName: it.first_name,
                patronymic: it.middle_name,
                photo: getImageResponse
              }
              this.employees.push(employee)
            }
          }
        }
      }
    },
    handleChosen(employee) {
      if (employee.isChosen && !employee.inDivision) this.addEmployees.push(employee)
      else if (!employee.isChosen && !employee.inDivision)
        this.addEmployees = this.addEmployees.filter(ae => ae.id !== employee.id)
      if (employee.isChosen && employee.inDivision) this.removeEmployees.push(employee)
      else if (!employee.isChosen && employee.inDivision)
        this.removeEmployees = this.removeEmployees.filter(re => re.id !== employee.id)
    },
    async saveChanges() {
      if (this.addEmployees.length > 0) {
        for (const it of this.addEmployees) {
          const addEmployeeResponse = await employeesApi.addEmployeeToDivision(this.division.id, it.id)
          if (addEmployeeResponse.status !== 200)
            alert(`Сотрудник ${it.lastName} ${it.firstName} ${it.patronymic} не добавлен в подразделение ${this.division.name}. Попробуйте снова`)
          this.employees.push(it)
        }
      }
      if (this.removeEmployees.length > 0) {
        for (const it of this.removeEmployees) {
          const deleteEmployeeResponse = await employeesApi.deleteEmployeeFromDivision(this.division.id, it.id)
          console.log(deleteEmployeeResponse)
          if (deleteEmployeeResponse.status !== 200 || deleteEmployeeResponse.status !== 204)
            alert(`Сотрудник ${it.lastName} ${it.firstName} ${it.patronymic} не удален из подразделения ${this.division.name}. Попробуйте снова`)
          this.employees = this.employees.filter(e => e.id !== it.id)
        }
      }
      this.editListMode = false
    }
  },
  computed: {
    ...mapState({
      activeIndex: state => state.index.activeIndex
    }),
    searchedEmployees() {
      const query = this.searchQuery.toLowerCase()
      let currentArray = []
      if (this.editListMode) currentArray = [...this.allEmployees]
      else currentArray = [...this.employees]
      return currentArray.filter(employee => {
        return Object.values(employee).some(value => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(query)
          }
          return false
        })
      })
    }
  },
  mounted() {
    this.getEmployees()
    this.newDivisionName = this.division.name
  }
}
</script>

<style scoped>
.info-card {
  width: 49%;
  margin-top: 20px;
  border: 1px solid lightgray;
  border-radius: 8px;
  padding: 15px 15px 10px;
  display: flex;
  flex-direction: column;
  height: 75vh;
}

.close-cross {
  background-image: url("../../assets/close_cross.png");
  width: 20px;
  height: 20px;
  background-size: cover;
  align-self: flex-end;
  cursor: pointer;
}

.btn__wrapper {
  flex-direction: row;
  align-self: flex-end;
  justify-content: center;
}

.btn-cancel {
  color: gray;
  border-color: gray;
}

.btn-edit, .btn-save {
  color: blue;
  border-color: blue;
  margin-left: 10px;
}

.info__wrapper {
  display: flex;
  justify-content: space-between;
  margin: 10px 0 25px;
  flex-direction: column;
  height: 50vh;
  overflow-y: auto;
  border: 1px solid lightgray;
  border-radius: 4px;
  padding: 10px;
}

.edit-name {
  background-image: url("../../assets/edit_pen.png");
  width: 15px;
  height: 15px;
  background-size: cover;
  cursor: pointer;
  margin-left: 10px;
}

.name-input {
  font-size: medium;
  border-radius: 6px;
  padding: 4px;
}

.confirm-btn {
  border: none;
  background: none;
  cursor: pointer;
  margin-left: 5px;
}
</style>
