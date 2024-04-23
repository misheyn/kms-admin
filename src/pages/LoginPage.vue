<template>
  <form @submit.prevent class="login-form">
    <h1 style="margin-bottom: 15px">Авторизация</h1>
    <input class="input" v-model="admin.login" type="text" placeholder="Логин...">
    <input class="input" v-model="admin.password" type="password" placeholder="Пароль...">
    <button class="btn" @click="logIn">Войти</button>
  </form>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      admin: {
        name: '',
        login: '',
        password: ''
      }
    }
  },
  methods: {
    async logIn() {
      try {
        const response = await axios.post("https://muddled-event-production.up.railway.app/api/users/auth", {
          username: this.admin.login,
          password: this.admin.password
        })
        if (response.status === 200) {
          this.$router.push('/main');
        } else {
          alert('Ошибка при авторизации. Пожалуйста, проверьте введенные данные.');
        }
      } catch (e) {
        console.error(e);
        alert('Ошибка при отправке запроса на сервер. Пожалуйста, попробуйте позже.');
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
  margin: 30px;
  padding: 20px;
}

.input {
  margin-bottom: 15px;
  min-width: 25%;
  min-height: 30px;
  font-size: medium;
}

.btn {
  font-size: medium;
  font-weight: bold;
  background: #E8D6FF;
  padding: 10px 30px;
  border: none;
  border-radius: 15px;
}
</style>
