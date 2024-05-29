<template>
  <div class="page__wrapper">
    <div class="btn__wrapper" style="display: flex; margin-top: 10px;">
      <button
          class="switch-btn"
          :class="{'active-tab': cardType === 'permissionEmployee'}"
          @click="cardType = 'permissionEmployee'">Сотрудников
      </button>
      <button
          class="switch-btn"
          :class="{'active-tab': cardType === 'permissionDivision'}"
          @click="cardType = 'permissionDivision'">Подразделений
      </button>
    </div>
    <div class="line"></div>
    <div class="top__panel">
      <search-bar
          v-model="searchQuery"
          placeholder="Поиск..."
          v-if="!selectedObject"/>
    </div>
    <div class="center__panel">
      <list-of-cards
          v-if="!isLoading"
          :objects="searchedObjects"
          :element="''"
          :card-type="cardType"
          @show-info-card="showInfoCard"
          @get-list="getPermissions"/>
      <h2 v-else style="margin: 15px 5px">Загрузка...</h2>
      <permission-info-card
          v-if="selectedObject"
          :object="selectedObject"
          :card-type="cardType"
          :audiences="audiences"
          @update-object="updatePermissions"
          @close-info-card="this.selectedObject = null"
          @update-audiences="updateAudiences"/>
    </div>
  </div>
</template>

<script>
import SearchBar from "@/components/UI/SearchBar.vue"
import ListOfCards from "@/components/ListOfCards.vue"
import divisionsApi from "@/api/divisionsApi"
import employeesApi from "@/api/employeesApi"
import PermissionInfoCard from "@/components/permissions/PermissionInfoCard.vue"
import audiencesApi from "@/api/audiencesApi"

export default {
  components: {PermissionInfoCard, SearchBar, ListOfCards},
  data() {
    return {
      searchQuery: '',
      divisions: [],
      employees: [],
      audiences: [],
      isLoading: false,
      dialogVisible: false,
      selectedObject: null,
      cardType: 'permissionEmployee'
    }
  },
  methods: {
    showInfoCard(object) {
      this.selectedObject = object
    },
    async updatePermissions(object, isEmployee) {
      if (isEmployee) {
        const index = this.employees.findIndex(e => e.id === object.id)
        if (index !== -1) this.employees.splice(index, 1, object)
        object.photo = await employeesApi.getImage(object.imageId)
      } else {
        const index = this.divisions.findIndex(d => d.id === object.id)
        if (index !== -1) this.divisions.splice(index, 1, object)
      }
      this.showInfoCard(object)
    },
    updateAudiences(audience, type) {
      if (type === 'push') this.audiences.push(audience)
      else if (type === 'remove') this.audiences.splice(this.audiences.indexOf(audience), 1)
    },
    async fetchDivisions() {
      const getDivisionsResponse = await divisionsApi.getAllDivisions()
      getDivisionsResponse.forEach(it => {
        const division = {
          id: it.division_id,
          name: it.name,
          permissionsNumber: it.permissions.length,
          permissions: it.permissions
        }
        this.divisions.push(division)
      })
    },
    async fetchEmployees() {
      const getEmployeesResponse = await employeesApi.getAllEmployees()

      for (const it of getEmployeesResponse) {
        if (it.employeeStatus === "WORKS" && it.employeeType !== "WATCHMAN") {
          const getImageResponse = await employeesApi.getImage(it.image.image_id)
          const employee = {
            id: it.employeeId,
            lastName: it.secondName,
            firstName: it.firstName,
            patronymic: it.middleName,
            imageId: it.image.image_id,
            photo: getImageResponse,
            type: it.employeeType,
            permissionsNumber: it.permissions.length,
            permissions: it.permissions
          }
          this.employees.push(employee)
        }
      }
    },
    async getPermissions() {
      this.audiences = []
      const getAudiencesResponse = await audiencesApi.getAllAudiences()

      for (const it of getAudiencesResponse) {
        if (it.exist && it.permissions) {
          for (const perm of it.permissions) {
            for (const objPerm of this.selectedObject.permissions) {
              if (perm.permission_id === objPerm.permission_id) {
                const audience = {
                  id: it.audience_id,
                  number: it.number,
                  type: it.audience_type
                }
                this.audiences.push(audience)
                break
              }
            }
          }
        }
      }
    },
    convertType(type) {
      if (type === "TEACHER") return 'Преподаватель'
      else if (type === "SERVICE") return 'Персонал'
      else if (type === "SECURITY") return 'Охрана'
    }
  },
  computed: {
    searchedObjects() {
      if (this.cardType === 'permissionEmployee') {
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
      } else {
        return this.divisions.filter(div => div && div.name && div.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
      }
    }
  },
  mounted() {
    this.isLoading = true
    this.fetchEmployees()
    this.fetchDivisions()
    this.isLoading = false
  }
}
</script>

<style scoped>
.center__panel {
  display: flex;
  justify-content: space-between;
  padding: 15px 5px;
}

.top__panel {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 15px 5px;
}
</style>
