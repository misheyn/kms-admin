<template>
  <div class="info-card">
    <div class="close-cross" @click="closeInfoCard"></div>
    <div class="name" style="font-size: large; font-weight: bold; display: flex">
      Разрешения {{
        cardType === 'permissionEmployee' ? `сотрудника ${object.lastName} ${object.firstName}`
            : `подразделения ${object.name}`
      }}
    </div>
    <search-bar
        v-model="searchQuery"
        placeholder="Поиск..."/>
    <div class="info__wrapper">
      <div v-if="audiences.length > 0 && !editListMode" class="permission-list" v-scroll="handleScroll">
        <edit-list-item
            v-for="(item, index) in searchedAudiences"
            :object="item"
            :key="index"
            :is-edit-mode="editListMode"
            :photo="false">
          {{ item.number }} - {{ convertType(item.type) }}
        </edit-list-item>
      </div>
      <h4 v-if="audiences.length <= 0 && !editListMode" style="margin: 5px">
        Для этого {{ cardType === 'permissionEmployee' ? 'сотрудника' : 'подразделения' }} нет разрешений</h4>
      <div v-if="editListMode" class="permission-list" v-scroll="handleScroll">
        <edit-list-item
            v-for="(item, index) in searchedAudiences"
            :object="item"
            :key="index"
            :is-edit-mode="editListMode"
            :photo="false"
            @chosen="handleChosen">
          {{ item.number }} - {{ convertType(item.type) }}
        </edit-list-item>
      </div>
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
import EditListItem from "@/components/EditListItem.vue"
import MyButton from "@/components/UI/MyButton.vue"
import SearchBar from "@/components/UI/SearchBar.vue"
import vScroll from "@/directives/vScroll"
import {mapMutations, mapState} from "vuex"
import audiencesApi from "@/api/audiencesApi"
import permissionsApi from "@/api/permissionsApi"

export default {
  components: {EditListItem, SearchBar, MyButton},
  directives: {
    'v-scroll': vScroll
  },
  data() {
    return {
      localObject: {},
      searchQuery: '',
      editListMode: false,
      allAudiences: [],
      addPermissions: [],
      removePermissions: []
    }
  },
  props: {
    object: {
      type: Object,
      required: true
    },
    cardType: {
      type: String,
      required: true
    },
    audiences: {
      type: Array,
      required: true
    }
  },
  emits: ['close-info-card', 'update-audiences', 'update-object'],
  methods: {
    ...mapMutations({
      setActiveIndex: 'index/setActiveIndex'
    }),
    handleScroll() {},
    convertType(type) {
      if (type === "STUDY") return 'Учебная'
      else if (type === "MULTIMEDIA") return 'Мультимедийная'
      else if (type === "LAB") return 'Лаборатория'
      else if (type === "ADMINISTRATION") return 'Служебная'
    },
    closeInfoCard() {
      this.$emit('close-info-card')
      this.setActiveIndex(null)
    },
    async openEditMode() {
      this.allAudiences = []
      const getAudiencesResponse = await audiencesApi.getAllAudiences()
      console.log(getAudiencesResponse)

      for (const it of getAudiencesResponse) {
        if (it.exist) {
          let flag = false, permId
          for (const perm of it.permissions) {
            for (const objPerm of this.object.permissions) {
              if (perm.permission_id === objPerm.permission_id) {
                permId = objPerm.permission_id
                flag = true
                break
              }
            }
          }
          const audience = {
            id: it.audience_id,
            number: it.number,
            type: it.audience_type,
            permission: flag,
            isChosen: false,
            permissionId: permId
          }
          this.allAudiences.push(audience)
        }
      }
      this.editListMode = true
    },
    handleChosen(object) {
      if (object.isChosen && !object.permission) this.addPermissions.push(object)
      else if (!object.isChosen && !object.permission)
        this.addPermissions = this.addPermissions.filter(ap => ap.id !== object.id)
      if (object.isChosen && object.permission) this.removePermissions.push(object)
      else if (!object.isChosen && object.permission)
        this.removePermissions = this.removePermissions.filter(rp => rp.id !== object.id)
    },
    async saveChanges() {
      this.localObject = {...this.object}
      if (this.addPermissions.length > 0) {
        for (const it of this.addPermissions) {
          if (this.cardType === 'permissionEmployee') {
            const createPermissionResponse = await permissionsApi.createPermission(
                `${it.number} - ${this.object.lastName} ${this.object.firstName}`)
            const addAudiencePermissionResponse = await permissionsApi.addPermissionToAudience(
                createPermissionResponse.permission_id,
                it.id)
            const addEmployeePermissionResponse = await permissionsApi.addPermissionToEmployee(
                createPermissionResponse.permission_id,
                this.object.id)
            if (addAudiencePermissionResponse.status === 200 && addEmployeePermissionResponse.status === 200) {
              this.$emit('update-audiences', it, 'push')
              this.localObject.permissions = addEmployeePermissionResponse.permissions
              this.localObject.permissionsNumber += 1
            } else alert(`Для сотрудника ${this.object.lastName} ${this.object.firstName} ${this.object.patronymic}
            не добавлено разрешение на аудиторию ${it.number}. Попробуйте снова`)
          } else {
            const createPermissionResponse = await permissionsApi.createPermission(
                `${it.number} - ${this.object.name}`)
            const addAudiencePermissionResponse = await permissionsApi.addPermissionToAudience(
                createPermissionResponse.permission_id,
                it.id)
            const addDivisionPermissionResponse = await permissionsApi.addPermissionToDivision(
                createPermissionResponse.permission_id,
                this.object.id)
            if (addAudiencePermissionResponse.status === 200 && addDivisionPermissionResponse.status === 200) {
              this.$emit('update-audiences', it, 'push')
              this.localObject.permissions = addDivisionPermissionResponse.permissions
              this.localObject.permissionsNumber += 1
            } else alert(`Для подразделения ${this.object.name} не добавлено разрешение на аудиторию ${it.number}.
            Попробуйте снова`)
          }
        }
      }
      if (this.removePermissions.length > 0) {
        for (const it of this.removePermissions) {
          if (this.cardType === 'permissionEmployee') {
            const deleteAudiencePermissionResponse = await permissionsApi.deletePermissionFromAudience(
                it.permissionId,
                it.id)
            const deleteEmployeePermissionResponse = await permissionsApi.deletePermissionFromEmployee(
                it.permissionId,
                this.object.id)
            if ((deleteAudiencePermissionResponse.status === 200 || deleteAudiencePermissionResponse.status === 204) &&
                (deleteEmployeePermissionResponse.status === 200 || deleteEmployeePermissionResponse.status === 204)) {
              this.$emit('update-audiences', it, 'remove')
              this.localObject.permissions = this.localObject.permissions.filter(p => p.permission_id !== it.permissionId)
              this.localObject.permissionsNumber -= 1
            } else alert(`Для сотрудника ${this.object.lastName} ${this.object.firstName} ${this.object.patronymic}
            не удалено разрешение на аудиторию ${it.number}. Попробуйте снова`)
          } else {
            const deleteAudiencePermissionResponse = await permissionsApi.deletePermissionFromAudience(
                it.permissionId,
                it.id)
            const deleteDivisionPermissionResponse = await permissionsApi.deletePermissionFromDivision(
                it.permissionId,
                this.object.id)
            if ((deleteAudiencePermissionResponse.status === 200 || deleteAudiencePermissionResponse.status === 204) &&
                (deleteDivisionPermissionResponse.status === 200 || deleteDivisionPermissionResponse.status === 204)) {
              this.$emit('update-audiences', it, 'remove')
              this.localObject.permissions = this.localObject.permissions.filter(p => p.permission_id !== it.permissionId)
              this.localObject.permissionsNumber -= 1
            } else alert(`Для подразделения ${this.object.name} не удалено разрешение на аудиторию ${it.number}.
            Попробуйте снова`)
          }
        }
      }
      if (this.cardType === 'permissionEmployee') this.$emit('update-object', this.localObject, true)
      else this.$emit('update-object', this.localObject, false)
      this.editListMode = false
    }
  },
  computed: {
    ...mapState({
      activeIndex: state => state.index.activeIndex
    }),
    searchedAudiences() {
      const query = this.searchQuery.toLowerCase()
      let currentArray = []
      if (this.editListMode) currentArray = [...this.allAudiences]
      else currentArray = [...this.audiences]
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
  created() {
    this.localObject = {...this.object}
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
</style>
