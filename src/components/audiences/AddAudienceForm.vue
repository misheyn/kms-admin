<template>
  <form @submit.prevent>
    <div class="form__inputs">
        <form-input
            v-model="audience.number"
            placeholder="Номер аудитории"/>
        <form-input
            v-model="audience.floor"
            placeholder="Этаж"/>
        <form-input
            v-model="audience.capacity"
            placeholder="Вместимость"/>
        <div style="padding: 3px 5px 0">
          <label style="margin-right: 5px">Сигнализация:</label>
          <input v-model="audience.signalisation" type="radio" id="sign-yes" name="signalisation" value="ON" checked>
          <label for="sign-yes"> Есть </label>
          <input v-model="audience.signalisation" type="radio" id="sign-no" name="signalisation" value="NONE">
          <label for="sign-no"> Нет </label>
        </div>
        <select class="audience-type" v-model="audience.type">
          <option value="" selected disabled>Выберите тип</option>
          <option value="STUDY">Учебная</option>
          <option value="MULTIMEDIA">Мультимедийная</option>
          <option value="LAB">Лаборатория</option>
          <option value="ADMINISTRATION">Административная</option>
        </select>
      <my-button
        class="btn"
        @click="addAudience">
      Добавить
    </my-button>
    </div>
  </form>
</template>

<script>
import FormInput from "@/components/UI/FormInput.vue"
import MyButton from "@/components/UI/MyButton.vue"
import audiencesApi from "@/api/audiencesApi"

export default {
  components: {MyButton, FormInput},
  data() {
    return {
      audience: {
        number: '',
        floor: '',
        capacity: '',
        signalisation: "ON",
        type: "",
        keys: []
      }
    }
  },
  methods: {
    async addAudience() {
      const createAudienceResponse = await audiencesApi.createAudience(
          this.audience.number,
          this.audience.floor,
          this.audience.capacity,
          this.audience.signalisation,
          this.audience.type)
      console.log(createAudienceResponse)
      const createMainKeyResponse = await audiencesApi.createKey(createAudienceResponse.audience_id, true)
      const createSpareKeyResponse = await audiencesApi.createKey(createAudienceResponse.audience_id, false)
      this.audience.keys.push({
        id: createMainKeyResponse.key_id,
        state: createMainKeyResponse.keyState,
        main: createMainKeyResponse.main })
      this.audience.keys.push({
        id: createSpareKeyResponse.key_id,
        state: createSpareKeyResponse.keyState,
        main: createSpareKeyResponse.main })
      this.$emit('create', this.audience)
      this.audience = {
        number: '',
        floor: '',
        capacity: '',
        signalisation: "ON",
        type: "",
        keys: []
      }
    }
  }
}
</script>

<style scoped>
.form__inputs {
  display: flex;
  flex-direction: column;
}

.btn {
  align-self: flex-end;
  margin-top: 10px;
  color: green;
  border-color: green;
}

.audience-type {
  margin-top: 10px;
  height: 25px;
  border-radius: 8px;
}

label {
  font-size: small;
}
</style>
