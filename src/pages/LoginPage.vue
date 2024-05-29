<template>
  <form @submit.prevent class="login-form">
    <h1 style="margin-bottom: 15px">Авторизация</h1>
    <input class="input" v-model="admin.login" placeholder="Логин..." type="text">
    <input class="input" v-model="admin.password" placeholder="Пароль..." type="password">
    <button class="btn" @click="signIn">Войти</button>
  </form>
</template>

<script>
import axios from "axios"
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      admin: {
        login: '',
        password: ''
      }
    }
  },
  methods: {
    ...mapActions({
      logIn: 'auth/logIn'
    }),
    async signIn() {
      try {
        const response = await axios.post("https://kmsadmin-production.up.railway.app/api/users/auth", {
          username: this.admin.login,
          password: this.admin.password
        })
        if (response.status === 200) {
          await this.logIn()
          this.$router.push('/shifts')
        } else {
          alert('Ошибка при авторизации. Пожалуйста, проверьте введенные данные.')
        }
      } catch (e) {
        console.error(e)
        alert('Ошибка при отправке запроса на сервер. Пожалуйста, попробуйте позже.')
      }
    }
  }
}
</script>

<style scoped>
.login-form {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  margin-top: 165px;
  padding: 20px;
}

.input {
  margin-bottom: 10px;
  width: 25%;
  min-height: 40px;
  font-size: medium;
  border-radius: 5px;
}

.btn {
  font-size: large;
  font-weight: bold;
  color: #498F7A;
  background: none;
  padding: 10px 30px;
  border: 2px solid #498F7A;
  border-radius: 15px;
  cursor: pointer;
}
</style>
