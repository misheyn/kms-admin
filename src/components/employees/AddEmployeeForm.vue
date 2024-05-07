<template>
  <form @submit.prevent>
    <div class="form__inputs">
      <div class="first__block">
        <form-input
            v-model="employee.lastName"
            placeholder="Фамилия"/>
        <form-input
            v-model="employee.firstName"
            placeholder="Имя"/>
        <form-input
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
        <form-input
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
          <img :src="employee.photo" alt="attached-img">
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
import FormInput from "@/components/UI/FormInput.vue"
import MyButton from "@/components/UI/MyButton.vue"
import employeesApi from "@/api/employeesApi"

export default {
  components: {MyButton, FormInput},
  data() {
    return {
      defaultImage: require("../../assets/default_photo.png"),
      employee: {
        lastName: '',
        firstName: '',
        patronymic: '',
        photo: null,
        type: "",
        qrData: '',
        IDNumber: '',
        IDStartDate: '',
        IDEndDate: ''
      }
    }
  },
  methods: {
    async addEmployee() {
      if (!this.$refs.fileInput.value)
        this.convertImageToBase64(this.defaultImage)
            .then(base64 => {
              this.employee.photo = base64
            })
            .catch(error => {
              console.error('Ошибка при чтении файла:', error)
            })
      this.employee.qrData = this.employee.lastName + '56891'
      const createResponse = await employeesApi.createEmployee(
          this.employee.firstName,
          this.employee.lastName,
          this.employee.patronymic,
          this.employee.type)
      this.$emit('create', createResponse)
      this.employee = {
        lastName: '',
        firstName: '',
        patronymic: '',
        photo: null,
        type: "",
        qrData: '',
        IDNumber: '',
        IDStartDate: '',
        IDEndDate: ''
      }
    },
    handleFileChange(event) {
      const file = event.target.files[0]
      if (file) {
        this.convertImageToBase64(file)
            .then(base64 => {
              this.employee.photo = base64
            })
            .catch(error => {
              console.error('Ошибка при чтении файла:', error)
            })
      }
    },
    convertImageToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
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
