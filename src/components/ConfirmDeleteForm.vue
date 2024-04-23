<template>
  <form @submit.prevent>
    <h3>Вы уверены, что хотите удалить {{ element }}?</h3>
    <div class="btns_wrapper">
      <my-button class="yes-btn" @click="this.$emit('delete')">Да</my-button>
      <my-button class="no-btn" @click.prevent="this.$emit('close')">Нет</my-button>
    </div>
  </form>
</template>

<script>
import MyButton from "@/components/UI/MyButton.vue";

export default {
  components: {MyButton},
  props: {
    element: String,
  }
}
</script>

<style scoped>
.btns_wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.yes-btn {
  color: red;
  border-color: red;
  cursor: pointer;
  margin-right: 10px;
}

.no-btn {
  border-color: darkgrey;
  cursor: pointer;
  margin-left: 10px;
}
</style>
