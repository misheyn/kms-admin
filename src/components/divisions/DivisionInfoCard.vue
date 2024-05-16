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
      <div v-if="employees.length > 0" class="employee-list" v-scroll="handleScroll">
        <employee-list-item
            v-for="(item, index) in employees"
            :employee="item"
            :key="index"/>
      </div>
      <h3 v-else style="margin: 5px">В этом подразделении нет сотрудников</h3>
    </div>
    <div class="btn__wrapper">
<!--      <my-button class="btn-remove" @click="removeDialogVisible = true">Удалить</my-button>-->
      <my-button v-if="!editListMode" class="btn-edit" @click="openEditMode">Редактировать</my-button>
      <my-button v-if="editListMode">Отменить</my-button>
      <my-button v-if="editListMode">Сохранить изменения</my-button>
    </div>
<!--    <create-dialog v-model:show="editDialogVisible">-->
<!--      <edit-division-form-->
<!--          :division="division"-->
<!--          @edit="editDivision"-->
<!--          @close="editDialogVisible = false"/>-->
<!--    </create-dialog>-->
<!--    <create-dialog v-model:show="removeDialogVisible">-->
<!--      <confirm-delete-form-->
<!--          :element="'это подразделение'"-->
<!--          @delete="removeDivision"-->
<!--          @close="removeDialogVisible = false"/>-->
<!--    </create-dialog>-->
  </div>
</template>

<script>
// import CreateDialog from "@/components/UI/CreateDialog.vue"
// import ConfirmDeleteForm from "@/components/ConfirmDeleteForm.vue"
import MyButton from "@/components/UI/MyButton.vue"
import {mapMutations, mapState} from "vuex"
import SearchBar from "@/components/UI/SearchBar.vue"
import divisionsApi from "@/api/divisionsApi"
import employeesApi from "@/api/employeesApi"
import EmployeeListItem from "@/components/EmployeeListItem.vue"
import vScroll from "@/directives/vScroll"

export default {
  components: {EmployeeListItem, SearchBar, MyButton/*, ConfirmDeleteForm, CreateDialog*/},
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
      allEmployees: []
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
    // async removeEmployee() {
    //   const deleteResponse = await employeesApi.deleteEmployee(this.employee.id, this.employee.firstName,
    //       this.employee.lastName, this.employee.patronymic, this.employee.type)
    //   if (deleteResponse.status === 200) {
    //     this.$emit('remove', this.employee)
    //     this.closeInfoCard()
    //   }
    // },
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
      const getEmployeesResponse = await employeesApi.getAllEmployees()
      console.log(getEmployeesResponse)

      for (const it of getEmployeesResponse) {
        if (it.employee_status === "WORKS" && it.employee_type !== "WATCHMAN") {
          const getImageResponse = await employeesApi.getImage(it.image.image_id)
          const employee = {
            id: it.employee_id,
            lastName: it.second_name,
            firstName: it.first_name,
            patronymic: it.middle_name,
            photo: getImageResponse
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
        if (it.employee_status === "WORKS" && it.employee_type !== "WATCHMAN" && it.divisions.division_id === this.division.id) {
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
  },
  computed: {
    ...mapState({
      activeIndex: state => state.index.activeIndex
    })
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

.btn-remove {
  color: red;
  border-color: red;
}

.btn-edit {
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
