<template>
  <form @submit.prevent>
    <div class="inputs__photo">
      <div class="form__inputs">
        <form-input
            v-model="watchman.lastName"
            placeholder="Фамилия"/>
        <form-input
            v-model="watchman.firstName"
            placeholder="Имя"/>
        <form-input
            v-model="watchman.patronymic"
            placeholder="Отчество"/>
        <form-input
            v-model="watchman.login"
            placeholder="Логин"/>
        <form-input
            v-model="watchman.password"
            placeholder="Пароль"
            :password="true"/>
      </div>
      <div class="add__photo">
        <div class="choice__photo">
          <input ref="fileInput" type="file" @click="cancelImage" @change="handleFileChange" accept="image/*"/>
          <div v-if="watchman.photo !== defaultImage" @click="cancelImage" class="cancel-cross"></div>
        </div>
        <div v-if="!watchman.photo" class="photo-preview">
          <img :src="defaultImage" alt="default-img">
        </div>
        <div v-else class="photo-preview">
          <img :src="watchman.photo" alt="attached-img">
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
import MyButton from "@/components/UI/MyButton.vue";
import FormInput from "@/components/UI/FormInput.vue";
import watchmenApi from "@/api/watchmenApi";

export default {
  components: {FormInput, MyButton},
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
      const watchmanResponse = await watchmenApi.createWatchman(
          this.watchman.firstName,
          this.watchman.lastName,
          this.watchman.patronymic)
      const userResponse = await watchmenApi.createUser(
          watchmanResponse.employee_id,
          this.watchman.login,
          this.watchman.password)
      this.$emit('create', userResponse)
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
      const file = event.target.files[0];
      if (file) {
        this.convertImageToBase64(file)
            .then(base64 => {
              this.watchman.photo = base64
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
      this.watchman.photo = null
      this.$refs.fileInput.value = null
    }
  }
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}

.inputs__photo, .choice__photo {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.choice__photo {
  margin-top: 5px;
}

.btn {
  align-self: flex-end;
  margin-top: 10px;
  color: green;
  border-color: green;
  display: flex;
}

.photo-preview {
  margin-top: 10px;
  display: flex;
  justify-content: center;
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

.form__inputs, .add__photo {
  max-width: 350px;
}
</style>
