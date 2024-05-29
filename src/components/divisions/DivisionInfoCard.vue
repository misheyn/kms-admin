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
        placeholder="Поиск..."
        style="font-size: medium; margin-top: 10px;"/>
    <div class="info__wrapper">
      <div v-if="employees.length > 0 && !editListMode && !isLoading" class="employee-list" v-scroll="handleScroll">
        <edit-list-item
            v-for="(item, index) in searchedEmployees"
            :object="item"
            :key="index"
            :is-edit-mode="editListMode"
            :photo="true">
          {{ item.lastName }} {{ item.firstName }} {{ item.patronymic }}
        </edit-list-item>
      </div>
      <h4 v-else-if="employees.length <= 0 && !editListMode && !isLoading" style="margin: 5px">
        В этом подразделении нет сотрудников</h4>
      <h4 v-else-if="!editListMode && isLoading">Загрузка...</h4>
      <div v-if="editListMode && !isLoading" class="employee-list" v-scroll="handleScroll">
        <edit-list-item
            v-for="(item, index) in searchedEmployees"
            :object="item"
            :key="index"
            :is-edit-mode="editListMode"
            :photo="true"
            @chosen="handleChosen">
          {{ item.lastName }} {{ item.firstName }} {{ item.patronymic }}
        </edit-list-item>
      </div>
      <h4 v-else-if="editListMode && isLoading">Загрузка...</h4>
    </div>
    <div class="btn__wrapper">
      <my-button v-if="!editListMode" class="btn-edit" @click="openEditMode">Редактировать</my-button>
      <my-button
          v-if="editListMode"
          class="btn-cancel"
          @click="editListMode = false">Отменить
      </my-button>
      <my-button
          v-if="editListMode"
          class="btn-save"
          @click="saveChanges">Сохранить изменения
      </my-button>
    </div>
  </div>
</template>

<script>
import MyButton from "@/components/UI/MyButton.vue"
import {mapMutations, mapState} from "vuex"
import SearchBar from "@/components/UI/SearchBar.vue"
import divisionsApi from "@/api/divisionsApi"
import employeesApi from "@/api/employeesApi"
import EditListItem from "@/components/EditListItem.vue"
import vScroll from "@/directives/vScroll"

export default {
  components: {EditListItem, SearchBar, MyButton},
  directives: {
    'v-scroll': vScroll
  },
  data() {
    return {
      isLoading: false,
      searchQuery: '',
      editNameMode: false,
      editListMode: false,
      newDivisionName: '',
      allEmployees: [],
      addEmployees: [],
      removeEmployees: []
    }
  },
  props: {
    division: {
      type: Object,
      required: true
    },
    employees: {
      type: Array,
      required: true
    }
  },
  emits: ['close-info-card', 'update-division-name', 'update-employees'],
  methods: {
    ...mapMutations({
      setActiveIndex: 'index/setActiveIndex'
    }),
    closeInfoCard() {
      this.$emit('close-info-card')
      this.setActiveIndex(null)
    },
    handleScroll() {
    },
    async updateDivisionName() {
      const updatedDivision = {...this.division}
      const updateResponse = await divisionsApi.updateDivision(this.division.id, this.newDivisionName)
      if (updateResponse.status === 200) {
        updatedDivision.name = updateResponse.data.name
        this.$emit('update-division-name', updatedDivision)
        this.editNameMode = false
      }
    },
    async openEditMode() {
      this.isLoading = true
      this.allEmployees = []
      const getEmployeesResponse = await employeesApi.getAllEmployees()

      for (const it of getEmployeesResponse) {
        if (it.employeeStatus === "WORKS" && it.employeeType !== "WATCHMAN") {
          const getImageResponse = await employeesApi.getImage(it.image.image_id)
          let flag = false
          if (it.divisions) {
            it.divisions.forEach(itDiv => {
              if (itDiv.division_id === this.division.id) flag = true
            })
          }
          const employee = {
            id: it.employeeId,
            lastName: it.secondName,
            firstName: it.firstName,
            patronymic: it.middleName,
            photo: getImageResponse,
            inDivision: flag,
            isChosen: false
          }
          this.allEmployees.push(employee)
        }
      }
      this.editListMode = true
      this.isLoading = false
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
          this.$emit('update-employees', it, 'push')
        }
      }
      if (this.removeEmployees.length > 0) {
        for (const it of this.removeEmployees) {
          const deleteEmployeeResponse = await employeesApi.deleteEmployeeFromDivision(this.division.id, it.id)
          if (deleteEmployeeResponse.status !== 200 || deleteEmployeeResponse.status !== 204)
            alert(`Сотрудник ${it.lastName} ${it.firstName} ${it.patronymic} не удален из подразделения ${this.division.name}. Попробуйте снова`)
          this.$emit('update-employees', it, 'remove')
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
    this.newDivisionName = this.division.name
  }
}
</script>

<style scoped>
.info-card {
  width: 49%;
  margin-top: 10px;
  border: 1px solid lightgray;
  border-radius: 8px;
  padding: 15px 15px 10px;
  display: flex;
  flex-direction: column;
  height: 72vh;
  justify-content: space-around;
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
  margin-top: 40px;
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
  min-height: 200px;
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
