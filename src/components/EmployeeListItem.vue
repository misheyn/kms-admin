<template>
  <div class="item">
    <div class="item-photo">
      <img :src="handleImagePreview(employee.photo)" alt="img">
    </div>
    <div class="info">
      {{employee.lastName}} {{employee.firstName}} {{employee.patronymic}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    employee: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleImagePreview(file) {
      return URL.createObjectURL(file)
    },
  }
}
</script>

<style scoped>
.item {
  margin-top: 10px;
  padding: 5px 15px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.info {
  text-align: left;
  margin-left: 15px;
}

.item-photo {
  height: 40px;
  overflow: hidden;
}

.item-photo img {
  height: 100%;
  width: auto;
}
</style>
