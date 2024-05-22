<template>
  <form @submit.prevent>
    <div class="form__inputs">
      <div class="first__block">
        <text-input
            v-model="watchman.lastName"
            placeholder="Фамилия"/>
        <text-input
            v-model="watchman.firstName"
            placeholder="Имя"/>
        <text-input
            v-model="watchman.patronymic"
            placeholder="Отчество"/>
        <text-input
            v-model="watchman.login"
            placeholder="Логин"/>
        <text-input
            v-model="watchman.password"
            placeholder="Пароль"
            :password="true"/>
      </div>
      <div class="second__block" style="margin-left: 15px;">
        <div class="choice__photo" style="margin-top: 5px;">
          <input ref="fileInput" type="file" @click="cancelImage" @change="handleFileChange" accept="image/*"/>
          <div v-if="watchman.photo !== null" @click="cancelImage" class="cancel-cross"></div>
        </div>
        <div v-if="!watchman.photo" class="photo-preview">
          <img :src="defaultImage" alt="default-img">
        </div>
        <div v-else class="photo-preview">
          <img :src="handleImagePreview(watchman.photo)" alt="attached-img">
        </div>
      </div>
    </div>
    <my-button
      class="btn"
      @click="addWatchman">
    Добавить
  </my-button>
  </form>
</template>

<script>
import MyButton from "@/components/UI/MyButton.vue"
import TextInput from "@/components/UI/TextInput.vue"
import watchmenApi from "@/api/watchmenApi"
import employeesApi from "@/api/employeesApi"

export default {
  components: {TextInput, MyButton},
  data() {
    return {
      defaultImage: require("../../assets/default_photo.png"),
      watchman: {
        lastName: '',
        firstName: '',
        patronymic: '',
        login: '',
        password: '',
        photo: null,
      }
    }
  },
  methods: {
    async addWatchman() {
      let image_id = 103
      if (this.watchman.photo != null) {
        const imageFormData = new FormData()
        imageFormData.append('image', this.watchman.photo)
        const createImageResponse = await employeesApi.createImage(imageFormData)
        image_id = createImageResponse.data.image_id
      }
      const createWatchmanResponse = await employeesApi.createEmployee(
          this.watchman.firstName,
          this.watchman.lastName,
          this.watchman.patronymic,
          image_id,
          "WATCHMAN")
      const createUserResponse = await watchmenApi.createUser(
          createWatchmanResponse.employee_id,
          this.watchman.login,
          this.watchman.password)
      this.$emit('create', createUserResponse)
      this.watchman = {
        lastName: '',
        firstName: '',
        patronymic: '',
        login: '',
        password: '',
        photo: null
      }
    },
    handleFileChange(event) {
      const file = event.target.files[0]
      if (file) this.watchman.photo = file
    },
    handleImagePreview(file) {
      return URL.createObjectURL(file)
    },
    cancelImage() {
      this.watchman.photo = null
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
  margin-top: 10px;
  color: green;
  border-color: green;
  display: flex;
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
</style>
