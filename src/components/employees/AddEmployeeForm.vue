<template>
  <form @submit.prevent>
    <div class="form__inputs">
      <div class="first__block">
        <text-input
            v-model="employee.lastName"
            placeholder="Фамилия"/>
        <text-input
            v-model="employee.firstName"
            placeholder="Имя"/>
        <text-input
            v-model="employee.patronymic"
            placeholder="Отчество"/>
        <select class="employee-type" v-model="employee.type">
          <option value="" selected disabled>Выберите тип</option>
          <option value="TEACHER">Преподаватель</option>
          <option value="SERVICE">Персонал</option>
          <option value="SECURITY">Охрана</option>
        </select>
      </div>
      <div class="second__block" style="margin-left: 15px;">
        <text-input
            v-model="employee.IDNumber"
            placeholder="№ удостоверения"/>
        <div class="id-date">
          <label for="startDate">Дата начала действия:</label>
          <input type="date" v-model="employee.IDStartDate" id="startDate"/>
        </div>
        <div class="id-date">
          <label for="endDate">Дата окончания действия:</label>
          <input type="date" v-model="employee.IDEndDate" id="endDate"/>
        </div>
        <div
            class="date-error"
            v-if="this.employee.IDStartDate && this.employee.IDEndDate && this.employee.IDEndDate < this.employee.IDStartDate">
          Дата окончания действия не может быть раньше даты начала
        </div>
        <div class="choice__photo" style=" margin-top: 5px;">
          <input ref="fileInput" type="file" @click="cancelImage" @change="handleFileChange" accept="image/*"/>
          <div v-if="employee.photo != null" @click="cancelImage" class="cancel-cross"></div>
        </div>
        <div v-if="!employee.photo" class="photo-preview">
          <img :src="defaultImage" alt="default-img">
        </div>
        <div v-else class="photo-preview">
          <img :src="handleImagePreview(employee.photo)" alt="attached-img">
        </div>
      </div>
    </div>
    <my-button
        class="btn"
        @click="addEmployee">
      Добавить
    </my-button>
  </form>
</template>

<script>
import TextInput from "@/components/UI/TextInput.vue"
import MyButton from "@/components/UI/MyButton.vue"
import employeesApi from "@/api/employeesApi"

export default {
  components: {MyButton, TextInput},
  data() {
    return {
      defaultImage: require("../../assets/default_photo.png"),
      employee: {
        lastName: '',
        firstName: '',
        patronymic: '',
        photo: null,
        type: "",
        IDNumber: '',
        IDStartDate: '',
        IDEndDate: ''
      }
    }
  },
  methods: {
    async addEmployee() {
      let image_id = 1
      if (this.employee.photo != null) {
        const imageFormData = new FormData()
        imageFormData.append('image', this.employee.photo)
        const createImageResponse = await employeesApi.createImage(imageFormData)
        image_id = createImageResponse.data.image_id
      }

      const createEmployeeResponse = await employeesApi.createEmployee(
          this.employee.firstName,
          this.employee.lastName,
          this.employee.patronymic,
          image_id,
          this.employee.type
      )
      const createIDResponse = await employeesApi.createID(
          createEmployeeResponse.employeeId,
          this.employee.IDNumber,
          this.employee.IDStartDate,
          this.employee.IDEndDate
      )
      const QRResponse = await employeesApi.generateQR(createEmployeeResponse.employeeId)
      if (QRResponse.status === 200) {
        this.$emit('create', createIDResponse)
        this.employee = {
          lastName: '',
          firstName: '',
          patronymic: '',
          photo: null,
          type: "",
          IDNumber: '',
          IDStartDate: '',
          IDEndDate: ''
        }
      }
    },
    handleFileChange(event) {
      const file = event.target.files[0]
      if (file) this.employee.photo = file
    },
    handleImagePreview(file) {
      return URL.createObjectURL(file)
    },
    cancelImage() {
      this.employee.photo = null
      this.$refs.fileInput.value = null
    }
  }
}
</script>

<style scoped>
form, .first__block, .second__block {
  display: flex;
  flex-direction: column;
}

.form__inputs, .choice__photo {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.btn {
  align-self: flex-end;
  margin-top: 5px;
  color: green;
  border-color: green;
  display: flex;
}

.photo-preview {
  margin: 10px 0 0 5px;
  display: flex;
  justify-content: flex-start;
}

.photo-preview img {
  max-width: 25%;
}

.cancel-cross {
  background-image: url("../../assets/close_cross_photo.png");
  cursor: pointer;
  width: 20px;
  height: 20px;
  background-size: cover;
}

.first__block, .second__block {
  max-width: 330px;
}

.employee-type {
  margin-top: 10px;
  height: 25px;
  border-radius: 8px;
}

.id-date {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}

.date-error {
  color: red;
  font-size: x-small;
  margin-top: 3px;
}

label {
  font-size: small;
}
</style>
