<template>
  <form @submit.prevent>
    <div class="form__inputs">
      <div class="first__block">
        <text-input
            v-model="localEmployee.lastName"
            placeholder="Фамилия"/>
        <text-input
            v-model="localEmployee.firstName"
            placeholder="Имя"/>
        <text-input
            v-model="localEmployee.patronymic"
            placeholder="Отчество"/>
        <select class="employee-type" v-model="localEmployee.type">
          <option value="" disabled>Выберите тип</option>
          <option value="TEACHER">Преподаватель</option>
          <option value="SERVICE">Персонал</option>
          <option value="SECURITY">Охрана</option>
        </select>
      </div>
      <div class="second__block" style="margin-left: 15px;">
        <text-input
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
          <div v-if="localEmployee.photo !== null" @click="cancelImage" class="cancel-cross"></div>
        </div>
        <div v-if="!localEmployee.photo" class="photo-preview">
          <img :src="defaultImage" alt="current-img">
        </div>
        <div v-else class="photo-preview">
          <img :src="handleImagePreview(localEmployee.photo)" alt="attached-img">
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
          @click="saveChanges">
        Сохранить изменения
      </my-button>
    </div>
  </form>
</template>

<script>
import MyButton from "@/components/UI/MyButton.vue"
import TextInput from "@/components/UI/TextInput.vue"
import employeesApi from "@/api/employeesApi"

export default {
  components: {TextInput, MyButton},
  props: {
    employee: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      localEmployee: {},
      defaultImage: require("../../assets/default_photo.png")
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
    handleImagePreview(file) {
      return URL.createObjectURL(file)
    },
    handleFileChange(event) {
      const file = event.target.files[0]
      if (file) this.localEmployee.photo = file
    },
    cancelImage() {
      this.localEmployee.photo = null
      this.$refs.fileInput.value = null
    },
    async saveChanges() {
      let deleteImageId = 0
      if ((this.localEmployee.photo === null || this.localEmployee.photo !== this.employee.photo) &&
          this.localEmployee.imageId !== 1) deleteImageId = this.employee.imageId

      if (this.localEmployee.photo !== this.employee.photo && this.localEmployee.photo !== null) {
        const formData = new FormData()
        formData.append('image', this.localEmployee.photo)
        const createImageResponse = await employeesApi.createImage(formData)
        if (createImageResponse.status === 200 || createImageResponse.status === 201)
          this.localEmployee.imageId = createImageResponse.data.image_id
      } else if (this.localEmployee.photo === null) {
        this.localEmployee.imageId = 1
      }
      this.$emit('edit', this.localEmployee, deleteImageId)
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
