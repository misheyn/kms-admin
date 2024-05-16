<template>
  <div class="page__wrapper">
    <div class="top__panel">
      <my-button
          class="create-btn"
          @click="this.dialogVisible = true"
          style="margin-top: 20px;">
        Создать подразделение
      </my-button>
      <create-dialog v-model:show="dialogVisible">
        <add-division-form @create="addDivision"/>
      </create-dialog>
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
          @show-info-card="showInfoCard"/>
      <h2 v-else style="margin: 15px 5px">Загрузка...</h2>
      <division-info-card
          v-if="selectedDivision"
          :division="selectedDivision"
          @close-info-card="this.selectedDivision = null"
          @update-division-name="updateDivisionName"/>
<!--          @remove="removeEmployee"-->

    </div>
  </div>
</template>

<script>
import CreateDialog from "@/components/UI/CreateDialog.vue"
import ListOfCards from "@/components/ListOfCards.vue"
import SearchBar from "@/components/UI/SearchBar.vue"
import MyButton from "@/components/UI/MyButton.vue"
import divisionsApi from "@/api/divisionsApi"
import AddDivisionForm from "@/components/divisions/AddDivisionForm.vue"
import DivisionInfoCard from "@/components/divisions/DivisionInfoCard.vue"

export default {
  components: {AddDivisionForm, MyButton, SearchBar, ListOfCards, CreateDialog, DivisionInfoCard},
  data() {
    return {
      searchQuery: '',
      divisions: [],
      isLoading: false,
      dialogVisible: false,
      selectedDivision: null
    }
  },
  methods: {
    addDivision (object) {
      const division = {
        id: object.division_id,
        name: object.name
      }
      this.divisions.push(division)
      this.dialogVisible = false
    },
    showInfoCard (division) {
      this.selectedDivision = division
    },
    // removeEmployee (employee) {
    //   this.employees = this.employees.filter(emp => emp.id !== employee.id)
    // },
    async fetchDivisions () {
      this.isLoading = true
      const getDivisionsResponse = await divisionsApi.getAllDivisions()
      console.log(getDivisionsResponse)
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
      if (index !== -1) {
        this.divisions.splice(index, 1, updatedDivision)
      }
      this.showInfoCard(updatedDivision)
    },
  },
  computed: {
    searchedDivisions () {
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
}
</style>
