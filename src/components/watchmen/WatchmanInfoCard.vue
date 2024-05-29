<template>
  <div class="info-card">
    <div class="close-cross" @click="closeInfoCard"></div>
    <div class="name"><b>{{ watchman.lastName }} {{ watchman.firstName }} {{ watchman.patronymic }}</b></div>
    <div class="info__wrapper">
      <div>Логин: {{ watchman.login }}</div>
      <div class="photo">
        <img :src="handleImagePreview(watchman.photo)" alt="watchman-img">
      </div>
    </div>
    <div class="btn__wrapper">
      <my-button class="btn-remove" @click="removeDialogVisible = true">Удалить</my-button>
      <my-button class="btn-edit" @click="editDialogVisible = true">Редактировать</my-button>
    </div>
  </div>
  <my-dialog v-model:show="editDialogVisible">
    <edit-watchman-form
        :watchman="watchman"
        @edit="editWatchman"
        @close="editDialogVisible = false"/>
  </my-dialog>
  <my-dialog v-model:show="removeDialogVisible">
    <confirm-delete-form
        :element="'этого вахтера'"
        @delete="removeWatchman"
        @close="removeDialogVisible = false"/>
  </my-dialog>
</template>

<script>
import MyButton from "@/components/UI/MyButton.vue"
import MyDialog from "@/components/UI/MyDialog.vue"
import EditWatchmanForm from "@/components/watchmen/EditWatchmanForm.vue"
import watchmenApi from "@/api/watchmenApi"
import {mapMutations, mapState} from "vuex"
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm.vue"
import employeesApi from "@/api/employeesApi"

export default {
  components: {ConfirmDeleteForm, EditWatchmanForm, MyDialog, MyButton},
  data() {
    return {
      editDialogVisible: false,
      removeDialogVisible: false
    }
  },
  props: {
    watchman: {
      type: Object,
      required: true
    }
  },
  emits: ['close-info-card', 'remove', 'update-watchman-info'],
  methods: {
    ...mapMutations({
      setActiveIndex: 'index/setActiveIndex'
    }),
    closeInfoCard() {
      this.$emit('close-info-card')
      this.setActiveIndex(null)
    },
    async removeWatchman() {
      const userResponse = await watchmenApi.getUser(this.watchman.id)
      const deleteResponse = await employeesApi.updateEmployee(
          userResponse.employee.employeeId,
          this.watchman.firstName,
          this.watchman.lastName,
          this.watchman.patronymic,
          this.watchman.imageId,
          "WATCHMAN"
      )
      if (deleteResponse.status === 200) {
        this.$emit('remove', this.watchman)
        this.closeInfoCard()
      }
    },
    async editWatchman(updatedWatchman, newPassword, deleteImageId) {
      const userResponse = await watchmenApi.getUser(updatedWatchman.id)
      const updateWatchmanResponse = await employeesApi.updateEmployee(
          userResponse.employee.employeeId,
          updatedWatchman.firstName,
          updatedWatchman.lastName,
          updatedWatchman.patronymic,
          updatedWatchman.photo.image_id,
          "WATCHMAN"
      )
      const updateUserResponse = await watchmenApi.updateUser(
          updatedWatchman.id,
          updateWatchmanResponse.data.employeeId,
          updatedWatchman.login,
          newPassword
      )
      let isSuccess = true
      if (deleteImageId > 0) {
        const deleteImageResponse = await employeesApi.deleteImage(deleteImageId)
        if (deleteImageResponse.status !== 200 && deleteImageResponse.status !== 204) isSuccess = false
      }
      if (updateWatchmanResponse.status === 200 && updateUserResponse.status === 200 && isSuccess) {
        this.$emit('update-watchman-info', updatedWatchman)
        this.editDialogVisible = false
      } else if (updateUserResponse.status === 204) {
        alert("Нельзя изменить пароль на текущий!")
      }
    },
    handleImagePreview(file) {
      return URL.createObjectURL(file)
    }
  },
  computed: {
    ...mapState({
      activeIndex: state => state.index.activeIndex
    })
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
  height: fit-content;
}

.name {
  font-size: large;
}

.photo {
  height: 110px;
  background-size: cover;
  overflow: hidden;
}

.photo img {
  height: 100%;
  width: auto;
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
  margin: 5px 0 25px;
}
</style>
