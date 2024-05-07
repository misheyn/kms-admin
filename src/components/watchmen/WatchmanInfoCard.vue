<template>
  <div class="info-card">
    <div class="close-cross" @click="closeInfoCard"></div>
    <div class="name"><b>{{ watchman.lastName }} {{ watchman.firstName }} {{ watchman.patronymic }}</b></div>
    <div class="info__wrapper">
      <div>Логин: {{ watchman.login }}</div>
      <div class="photo"></div>
    </div>
    <div class="btn__wrapper">
      <my-button class="btn-remove" @click="removeDialogVisible = true">Удалить</my-button>
      <my-button class="btn-edit" @click="editDialogVisible = true">Редактировать</my-button>
    </div>
  </div>
  <create-dialog v-model:show="editDialogVisible">
    <edit-watchman-form
        :watchman="watchman"
        @edit="editWatchman"
        @close="editDialogVisible = false"/>
  </create-dialog>
  <create-dialog v-model:show="removeDialogVisible">
    <confirm-delete-form
        :element="'этого вахтера'"
        @delete="removeWatchman"
        @close="removeDialogVisible = false"/>
  </create-dialog>
</template>

<script>
import MyButton from "@/components/UI/MyButton.vue"
import CreateDialog from "@/components/UI/CreateDialog.vue"
import EditWatchmanForm from "@/components/watchmen/EditWatchmanForm.vue"
import watchmenApi from "@/api/watchmenApi"
import {mapMutations, mapState} from "vuex"
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm.vue";

export default {
  components: {ConfirmDeleteForm, EditWatchmanForm, CreateDialog, MyButton},
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
      const deleteResponse = await watchmenApi.deleteWatchman(userResponse.employee.employee_id, this.watchman.firstName,
          this.watchman.lastName, this.watchman.patronymic)
      console.log(deleteResponse)
      if (deleteResponse.status === 200) {
        this.$emit('remove', this.watchman)
        this.closeInfoCard()
      }
    },
    async editWatchman(updatedWatchman, newPassword) {
      const userResponse = await watchmenApi.getUser(updatedWatchman.id)
      const updateWatchmanResponse = await watchmenApi.updateWatchman(
          userResponse.employee.employee_id,
          updatedWatchman.firstName,
          updatedWatchman.lastName,
          updatedWatchman.patronymic
      )
      const updateUserResponse = await watchmenApi.updateUser(updatedWatchman.id, updatedWatchman.login, newPassword)
      if (updateWatchmanResponse.status === 200 && updateUserResponse.status === 200) {
        this.$emit('update-watchman-info', updatedWatchman)
        this.editDialogVisible = false
      } else {
        console.log('ABOBA')
      }
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
  margin-top: 100px;
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
  background-image: url("../../assets/default_photo.png");
  width: 110px;
  height: 110px;
  background-size: cover;
  margin-right: 30px;
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
