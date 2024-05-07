<template>
  <form @submit.prevent>
    <div class="form__inputs">
      <form-input
          v-model="localAudience.number"
          placeholder="Номер аудитории"/>
      <form-input
          v-model="localAudience.capacity"
          placeholder="Вместимость"/>
      <div style="padding: 3px 5px 0">
        <label style="margin-right: 5px">Сигнализация:</label>
        <input v-model="localAudience.signalisation" type="radio" id="sign-yes" name="signalisation" value="ON">
        <label for="sign-yes"> Есть </label>
        <input v-model="localAudience.signalisation" type="radio" id="sign-no" name="signalisation" value="NONE">
        <label for="sign-no"> Нет </label>
      </div>
      <div style="font-size: small; margin: 8px 0 2px 5px" >Тип аудитории:</div>
      <select class="audience-type" v-model="localAudience.type">
        <option value="" disabled>Выберите тип</option>
        <option value="STUDY">Учебная</option>
        <option value="MULTIMEDIA">Мультимедийная</option>
        <option value="LAB">Лаборатория</option>
        <option value="ADMINISTRATION">Административная</option>
      </select>
      <div style="margin-top: 8px; font-size: small">Состояние</div>
      <div class="state__wrapper">
        <div class="key_wrapper">
          <span>основного ключа: </span>
          <select class="key-state" v-model="localAudience.keys[0].state">
            <option value="" disabled>Выберите состояние</option>
            <option value="GIVEN_AWAY">Выдан</option>
            <option value="RETURNED">Возвращен</option>
            <option value="LOST">Утерян</option>
          </select>
        </div>
        <div class="key_wrapper">
          <span>запасного ключа: </span>
          <select class="key-state" v-model="localAudience.keys[1].state">
            <option value="" disabled>Выберите состояние</option>
            <option value="GIVEN_AWAY">Выдан</option>
            <option value="RETURNED">Возвращен</option>
            <option value="LOST">Утерян</option>
          </select>
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
            @click="$emit('edit', this.localAudience)">
          Сохранить изменения
        </my-button>
      </div>
    </div>
  </form>
</template>

<script>
import FormInput from "@/components/UI/FormInput.vue"
import MyButton from "@/components/UI/MyButton.vue"

export default {
  components: {MyButton, FormInput},
  props: {
    audience: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      localAudience: {}
    }
  },
  created() {
    this.localAudience = {...this.audience}
  },
  methods: {
    cancelForm() {
      this.localAudience = {...this.audience}
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.form__inputs, .key_wrapper {
  display: flex;
  flex-direction: column;
}

.state__wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 3px;
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

.audience-type, .key-state {
  height: 25px;
  border-radius: 8px;
}

label, span {
  font-size: small;
}
</style>
