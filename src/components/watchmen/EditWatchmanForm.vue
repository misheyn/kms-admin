<template>
  <form @submit.prevent>
    <div class="form__inputs">
      <div class="first__block">
        <form-input
            v-model="localWatchman.lastName"
            placeholder="Фамилия"/>
        <form-input
            v-model="localWatchman.firstName"
            placeholder="Имя"/>
        <form-input
            v-model="localWatchman.patronymic"
            placeholder="Отчество"/>
        <form-input
            v-model="localWatchman.login"
            placeholder="Логин"/>
        <form-input
            v-model="newPassword"
            :password="true"
            placeholder="Введите новый пароль"/>
        <form-input
            v-model="newPassword2"
            :password="true"
            placeholder="Подтвердите новый пароль"/>
        <div v-if="!samePassword" class="error-msg">Пароли не совпадают</div>
      </div>
      <div class="second__block" style="margin-left: 15px;">
        <div class="choice__photo" style="  margin-top: 5px;">
          <input ref="fileInput" type="file" @click="cancelImage" @change="handleFileChange" accept="image/*"/>
          <div v-if="localWatchman.photo !== watchman.photo" @click="cancelImage" class="cancel-cross"></div>
        </div>
        <div v-if="!localWatchman.photo" class="photo-preview">
          <img :src="watchman.photo" alt="current-img">
        </div>
        <div v-else class="photo-preview">
          <img :src="localWatchman.photo" alt="attached-img">
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
import FormInput from "@/components/UI/FormInput.vue";
import MyButton from "@/components/UI/MyButton.vue";

export default {
  components: {MyButton, FormInput},
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
      newPassword2: ''
    }
  },
  created() {
    this.localWatchman = {...this.watchman}
  },
  methods: {
    saveChanges() {
      if (this.samePassword)
        this.$emit('edit', this.localWatchman, this.newPassword)
    },
    cancelForm() {
      this.localWatchman = {...this.watchman}
      this.$emit('close')
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.convertImageToBase64(file)
            .then(base64 => {
              this.localWatchman.photo = base64
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
      this.localWatchman.photo = null
      this.$refs.fileInput.value = null
    }
  },
  computed: {
    samePassword() {
      return this.newPassword === this.newPassword2;
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
