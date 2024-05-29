<template>
  <form @submit.prevent>
    <div class="form__inputs">
      <div class="first__block">
        <text-input
            v-model="localWatchman.lastName"
            placeholder="Фамилия"/>
        <text-input
            v-model="localWatchman.firstName"
            placeholder="Имя"/>
        <text-input
            v-model="localWatchman.patronymic"
            placeholder="Отчество"/>
        <text-input
            v-model="localWatchman.login"
            placeholder="Логин"/>
        <text-input
            v-model="newPassword"
            :password="true"
            placeholder="Введите новый пароль"/>
        <text-input
            v-model="newPassword2"
            :password="true"
            placeholder="Подтвердите новый пароль"/>
        <div v-if="!samePassword" class="error-msg">Пароли не совпадают</div>
      </div>
      <div class="second__block" style="margin-left: 15px;">
        <div class="choice__photo" style="  margin-top: 5px;">
          <input ref="fileInput" type="file" @click="cancelImage" @change="handleFileChange" accept="image/*"/>
          <div v-if="localWatchman.photo !== null" @click="cancelImage" class="cancel-cross"></div>
        </div>
        <div v-if="!localWatchman.photo" class="photo-preview">
          <img :src="defaultImage" alt="current-img">
        </div>
        <div v-else class="photo-preview">
          <img :src="handleImagePreview(localWatchman.photo)" alt="attached-img">
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
import TextInput from "@/components/UI/TextInput.vue"
import MyButton from "@/components/UI/MyButton.vue"
import employeesApi from "@/api/employeesApi"

export default {
  components: {MyButton, TextInput},
  props: {
    watchman: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      localWatchman: {},
      newPassword: '',
      newPassword2: '',
      defaultImage: require("../../assets/default_photo.png")
    }
  },
  created() {
    this.localWatchman = {...this.watchman}
  },
  methods: {
    async saveChanges() {
      let deleteImageId = 0
      if ((this.localWatchman.photo === null || this.localWatchman.photo !== this.watchman.photo) &&
          this.localWatchman.imageId !== 1) deleteImageId = this.watchman.imageId

      if (this.localWatchman.photo !== this.watchman.photo && this.localWatchman.photo !== null) {
        const formData = new FormData()
        formData.append('image', this.localWatchman.photo)
        const createImageResponse = await employeesApi.createImage(formData)
        if (createImageResponse.status === 200 || createImageResponse.status === 201)
          this.localWatchman.imageId = createImageResponse.data.image_id
      } else if (this.localWatchman.photo === null) {
        this.localWatchman.imageId = 1
      }
      if (this.samePassword)
        this.$emit('edit', this.localWatchman, this.newPassword, deleteImageId)
    },
    cancelForm() {
      this.localWatchman = {...this.watchman}
      this.$emit('close')
    },
    handleImagePreview(file) {
      return URL.createObjectURL(file)
    },
    handleFileChange(event) {
      const file = event.target.files[0]
      if (file) this.localWatchman.photo = file
    },
    cancelImage() {
      this.localWatchman.photo = null
      this.$refs.fileInput.value = null
    }
  },
  computed: {
    samePassword() {
      return this.newPassword === this.newPassword2
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

.error-msg {
  color: red;
  font-size: small;
  margin: 5px 0 0 3px;
}

.photo-preview {
  margin-top: 10px;
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
