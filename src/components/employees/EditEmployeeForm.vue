<template>
  <form @submit.prevent>
    <div class="form__inputs">
      <div class="first__block">
        <form-input
            v-model="localEmployee.lastName"
            placeholder="Фамилия"/>
        <form-input
            v-model="localEmployee.firstName"
            placeholder="Имя"/>
        <form-input
            v-model="localEmployee.patronymic"
            placeholder="Отчество"/>
        <select class="employee-type" v-model="localEmployee.type">
          <option value="" disabled>Выберите тип</option>
          <option value="TEACHER">Преподаватель</option>
          <option value="SERVICE">Персонал</option>
          <option value="SECURITY">Охрана</option>
          <option value="WATCHMAN">Вахтер</option>
        </select>
      </div>
      <div class="second__block" style="margin-left: 15px;">
        <form-input
            v-model="localEmployee.IDNumber"
            placeholder="№ удостоверения"/>
        <div class="id-date">
          <label for="startDate">Дата начала действия:</label>
          <input type="date" v-model="localEmployee.IDStartDate" id="startDate"/>
        </div>
        <div class="id-date">
          <label for="endDate">Дата окончания действия:</label>
          <input type="date" v-model="localEmployee.IDEndDate" id="endDate"/>
        </div>
        <div
            class="date-error"
            v-if="this.localEmployee.IDStartDate && this.localEmployee.IDEndDate &&
            this.localEmployee.IDEndDate < this.localEmployee.IDStartDate">
          Дата окончания действия не может быть раньше даты начала
        </div>
        <div class="choice__photo" style="margin-top: 5px;">
          <input ref="fileInput" type="file" @click="cancelImage" @change="handleFileChange" accept="image/*"/>
          <div v-if="localEmployee.photo !== employee.photo" @click="cancelImage" class="cancel-cross"></div>
        </div>
        <div v-if="!localEmployee.photo" class="photo-preview">
          <img :src="employee.photo" alt="current-img">
        </div>
        <div v-else class="photo-preview">
          <img :src="localEmployee.photo" alt="attached-img">
        </div>
      </div>
    </div>
    <div class="btn__wrapper">
      <my-button
          class="cancel-btn"
          @click.prevent="cancelForm">
        Отменить
      </my-button>
      <my-button
          class="save-btn"
          @click="$emit('edit', this.localEmployee)">
        Сохранить изменения
      </my-button>
    </div>
  </form>
</template>

<script>
import MyButton from "@/components/UI/MyButton.vue"
import FormInput from "@/components/UI/FormInput.vue"

export default {
  components: {FormInput, MyButton},
  props: {
    employee: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      localEmployee: {}
    }
  },
  created() {
    this.localEmployee = {...this.employee}
  },
  methods: {
    cancelForm() {
      this.localEmployee = {...this.employee}
      this.$emit('close')
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.convertImageToBase64(file)
            .then(base64 => {
              this.localEmployee.photo = base64
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
      this.localEmployee.photo = null
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

.btn__wrapper {
  flex-direction: row;
  align-self: flex-end;
  margin-top: 20px;
}

.save-btn {
  margin-left: 10px;
  color: green;
  border-color: green;
}

.cancel-btn {
  color: blue;
  border-color: blue;
}

.photo-preview {
  margin: 10px 0 0 5px;
  display: flex;
  justify-content: space-between;
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
