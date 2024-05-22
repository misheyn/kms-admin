<template>
  <form @submit.prevent>
    <div class="form__inputs">
        <text-input
            v-model="audience.number"
            placeholder="Номер аудитории"/>
        <text-input
            v-model="audience.capacity"
            placeholder="Вместимость"/>
        <select class="audience-type" v-model="audience.type">
          <option value="" selected disabled>Выберите тип</option>
          <option value="STUDY">Учебная</option>
          <option value="MULTIMEDIA">Мультимедийная</option>
          <option value="LAB">Лаборатория</option>
          <option value="ADMINISTRATION">Служебная</option>
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
import TextInput from "@/components/UI/TextInput.vue"
import MyButton from "@/components/UI/MyButton.vue"
import audiencesApi from "@/api/audiencesApi"

export default {
  components: {MyButton, TextInput},
  data() {
    return {
      audience: {
        number: '',
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
          this.audience.capacity,
          this.audience.type)
      const createMainKeyResponse = await audiencesApi.createKey(createAudienceResponse.audience_id, true)
      const createSpareKeyResponse = await audiencesApi.createKey(createAudienceResponse.audience_id, false)
      this.audience.keys.push({
        id: createMainKeyResponse.key_id,
        state: createMainKeyResponse.key_state,
        main: createMainKeyResponse.main,
        qrData: createMainKeyResponse.qr})
      this.audience.keys.push({
        id: createSpareKeyResponse.key_id,
        state: createSpareKeyResponse.key_state,
        main: createSpareKeyResponse.main,
        qrData: createSpareKeyResponse.qr})
      this.$emit('create', this.audience)
      this.audience = {
        number: '',
        capacity: '',
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
