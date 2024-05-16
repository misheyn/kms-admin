<template>
  <div class="info-card">
    <div class="close-cross" @click="closeInfoCard"></div>
    <div class="name" style="font-size: large">
      <b>{{ employee.lastName }} {{ employee.firstName }} {{ employee.patronymic }}</b>
    </div>
    <div class="info__wrapper">
      <div>Должность: {{ convertType(employee.type) }}</div>
      <div>№ удостоверения: {{ employee.IDNumber }}</div>
      <div>Действительно до: {{ employee.IDEndDate }}</div>
      <div class="images">
        <div class="photo">
          <img :src="handleImagePreview(employee.photo)" alt="employee-img">
        </div>
        <vue-qrcode
            class="qrcode"
            ref="qrcode"
            :options="{
                width: 120
            }"
            :value="employee.qrData"
            :foreground-color="'#000'"
            :background-color="'#fff'"
            @click="downloadQrcode">
        </vue-qrcode>
      </div>
    </div>
    <div class="btn__wrapper">
      <my-button class="btn-remove" @click="removeDialogVisible = true">Удалить</my-button>
      <my-button class="btn-edit" @click="editDialogVisible = true">Редактировать</my-button>
    </div>
    <create-dialog v-model:show="editDialogVisible">
      <edit-employee-form
          :employee="employee"
          @edit="editEmployee"
          @close="editDialogVisible = false"/>
    </create-dialog>
    <create-dialog v-model:show="removeDialogVisible">
      <confirm-delete-form
          :element="'этого сотрудника'"
          @delete="removeEmployee"
          @close="removeDialogVisible = false"/>
    </create-dialog>
  </div>
</template>

<script>
import MyButton from "@/components/UI/MyButton.vue"
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm.vue"
import CreateDialog from "@/components/UI/CreateDialog.vue"
import {mapMutations, mapState} from "vuex"
import employeesApi from "@/api/employeesApi"
import EditEmployeeForm from "@/components/employees/EditEmployeeForm.vue"
import VueQrcode from '@chenfengyuan/vue-qrcode'

export default {
  components: {EditEmployeeForm, CreateDialog, ConfirmDeleteForm, MyButton, VueQrcode},
  data() {
    return {
      editDialogVisible: false,
      removeDialogVisible: false
    }
  },
  props: {
    employee: {
      type: Object,
      required: true
    }
  },
  emits: ['close-info-card', 'remove', 'update-employee-info'],
  methods: {
    ...mapMutations({
      setActiveIndex: 'index/setActiveIndex'
    }),
    closeInfoCard() {
      this.$emit('close-info-card')
      this.setActiveIndex(null)
    },
    downloadQrcode() {
      const qrcodeComponent = this.$refs.qrcode;
      if (qrcodeComponent) {
        const canvas = document.createElement('canvas');
        canvas.width = qrcodeComponent.$el.width;
        canvas.height = qrcodeComponent.$el.height;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(qrcodeComponent.$el, 0, 0);

        const imageDataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imageDataURL;
        link.download = `${this.employee.lastName}Qrcode.png`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('QR code component not found');
      }
    },
    async removeEmployee() {
      const deleteResponse = await employeesApi.updateEmployee(
          this.employee.id,
          this.employee.firstName,
          this.employee.lastName,
          this.employee.patronymic,
          this.employee.imageId,
          this.employee.type,
          "FIRED"
      )
      if (deleteResponse.status === 200) {
        this.$emit('remove', this.employee)
        this.closeInfoCard()
      }
    },
    async editEmployee(updatedEmployee, deleteImageId) {
      const updateEmployeeResponse = await employeesApi.updateEmployee(
          updatedEmployee.id,
          updatedEmployee.firstName,
          updatedEmployee.lastName,
          updatedEmployee.patronymic,
          updatedEmployee.imageId,
          updatedEmployee.type,
          "WORKS"
      )
      const updateIDResponse = await employeesApi.updateID(
          updatedEmployee.IDId,
          updatedEmployee.id,
          updatedEmployee.IDNumber,
          updatedEmployee.IDStartDate,
          updatedEmployee.IDEndDate
      )
      let isSuccess = true
      if (deleteImageId > 0) {
        const deleteImageResponse = await employeesApi.deleteImage(deleteImageId)
        if (deleteImageResponse.status !== 200 && deleteImageResponse.status !== 204) isSuccess = false
      }
      if (updateEmployeeResponse.status === 200 && updateIDResponse.status === 200 && isSuccess) {
        this.$emit('update-employee-info', updatedEmployee)
        this.editDialogVisible = false
      }
    },
    convertType(type) {
      if (type === "TEACHER") return 'Преподаватель'
      else if (type === "SERVICE") return 'Персонал'
      else if (type === "SECURITY") return 'Охрана'
    },
    handleImagePreview(file) {
      return URL.createObjectURL(file)
    },
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
  flex-direction: column;
}

.images {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>
