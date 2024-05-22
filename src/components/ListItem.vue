<template>
  <div
      class="item"
      :class="{ 'active': active }"
      @click="toggleActive">
    <div v-if="isEmployee" class="item-photo">
      <img :src="handleImagePreview(object.photo)" alt="img">
    </div>
    <div class="info">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    object: {
      type: Object,
      required: true
    },
    active: {
      type: Boolean,
      required: true
    },
    isEmployee: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    handleImagePreview(file) {
      return URL.createObjectURL(file)
    },
    toggleActive() {
      this.$emit('toggle-active')
      this.$emit('show-info-card', this.object)
    }
  }
}
</script>

<style scoped>
.item {
  margin-bottom: 10px;
  padding: 5px 15px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid lightgray;
  border-radius: 8px;
  cursor: pointer;
}

.item.active {
  border: 2px solid #1BE0A6;
}

.info {
  text-align: left;
  margin-left: 15px;
}

.item-photo {
  height: 50px;
  overflow: hidden;
}

.item-photo img {
  height: 100%;
  width: auto;
}
</style>
