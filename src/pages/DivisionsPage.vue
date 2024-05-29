<template>
  <div class="page__wrapper">
    <div class="top__panel" style="align-items: center">
      <my-button
          class="create-btn"
          @click="this.dialogVisible = true">
        Создать подразделение
      </my-button>
      <my-dialog v-model:show="dialogVisible">
        <add-division-form @create="addDivision"/>
      </my-dialog>
      <search-bar
          v-model="searchQuery"
          placeholder="Поиск..."
          v-if="!selectedDivision"/>
    </div>
    <div class="center__panel">
      <list-of-cards
          v-if="!isLoading"
          :objects="searchedDivisions"
          :element="'подразделений'"
          :card-type="'division'"
          @show-info-card="showInfoCard"
          @get-list="getEmployees"/>
      <h2 v-else style="margin: 15px 5px">Загрузка...</h2>
      <division-info-card
          v-if="selectedDivision"
          :division="selectedDivision"
          :employees="employees"
          @close-info-card="this.selectedDivision = null"
          @update-division-name="updateDivisionName"
          @update-employees="updateEmployees"/>
    </div>
  </div>
</template>

<script>
import MyDialog from "@/components/UI/MyDialog.vue"
import ListOfCards from "@/components/ListOfCards.vue"
import SearchBar from "@/components/UI/SearchBar.vue"
import MyButton from "@/components/UI/MyButton.vue"
import divisionsApi from "@/api/divisionsApi"
import AddDivisionForm from "@/components/divisions/AddDivisionForm.vue"
import DivisionInfoCard from "@/components/divisions/DivisionInfoCard.vue"
import employeesApi from "@/api/employeesApi"

export default {
  components: {AddDivisionForm, MyButton, SearchBar, ListOfCards, MyDialog, DivisionInfoCard},
  data() {
    return {
      searchQuery: '',
      employees: [],
      divisions: [],
      isLoading: false,
      dialogVisible: false,
      selectedDivision: null
    }
  },
  methods: {
    addDivision(object) {
      const division = {
        id: object.division_id,
        name: object.name
      }
      this.divisions.push(division)
      this.dialogVisible = false
    },
    showInfoCard(division) {
      this.selectedDivision = division
    },
    async getEmployees() {
      this.employees = []
      const getEmployeesResponse = await employeesApi.getAllEmployees()

      for (const it of getEmployeesResponse) {
        if (it.employeeStatus === "WORKS" && it.employeeType !== "WATCHMAN" && it.divisions) {
          for (const itDiv of it.divisions) {
            if (itDiv.division_id === this.selectedDivision.id) {
              const getImageResponse = await employeesApi.getImage(it.image.image_id)
              const employee = {
                id: it.employeeId,
                lastName: it.secondName,
                firstName: it.firstName,
                patronymic: it.middleName,
                photo: getImageResponse
              }
              this.employees.push(employee)
            }
          }
        }
      }
    },
    async fetchDivisions() {
      this.isLoading = true
      const getDivisionsResponse = await divisionsApi.getAllDivisions()
      getDivisionsResponse.forEach(it => {
        const division = {
          id: it.division_id,
          name: it.name
        }
        this.divisions.push(division)
      })
      this.isLoading = false
    },
    updateDivisionName(updatedDivision) {
      const index = this.divisions.findIndex(d => d.id === updatedDivision.id)
      if (index !== -1) this.divisions.splice(index, 1, updatedDivision)
      this.showInfoCard(updatedDivision)
    },
    updateEmployees(employee, type) {
      if (type === 'push') this.employees.push(employee)
      else if (type === 'remove') this.employees.splice(this.employees.indexOf(employee), 1)
    }
  },
  computed: {
    searchedDivisions() {
      return this.divisions.filter(div => div && div.name && div.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
    }
  },
  mounted() {
    this.fetchDivisions()
  }
}
</script>

<style scoped>
.top__panel, .center__panel {
  display: flex;
  justify-content: space-between;
  padding: 15px 5px;
}
</style>
