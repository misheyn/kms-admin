<template>
  <form @submit.prevent>
    <div class="form__inputs">
      <text-input
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
import TextInput from "@/components/UI/TextInput.vue"
import MyButton from "@/components/UI/MyButton.vue"
import divisionsApi from "@/api/divisionsApi"

export default {
  components: {MyButton, TextInput},
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
