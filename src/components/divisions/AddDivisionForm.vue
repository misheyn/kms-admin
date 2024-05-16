<template>
  <form @submit.prevent>
    <div class="form__inputs">
      <form-input
          v-model="division.name"
          placeholder="Название подразделения"/>
      <my-button
          class="btn"
          @click="addDivision">
        Добавить
      </my-button>
    </div>
  </form>
</template>

<script>
import FormInput from "@/components/UI/FormInput.vue"
import MyButton from "@/components/UI/MyButton.vue"
import divisionsApi from "@/api/divisionsApi"

export default {
  components: {MyButton, FormInput},
  data() {
    return {
      division: {
        name: ''
      }
    }
  },
  methods: {
    async addDivision() {
      const createResponse = await divisionsApi.createDivision(this.division.name)
      console.log(createResponse)
      this.$emit('create', createResponse)
      this.division = {
        name: ''
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
</style>
