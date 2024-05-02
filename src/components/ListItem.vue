<template>
  <div
      class="item"
      :class="{ 'active': active }"
      @click="toggleActive">
    <div class="item-photo"></div>
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
    }
  },
  methods: {
    toggleActive() {
      this.$emit('toggle-active')
      this.$emit('show-info-card', this.object)
    }
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
  border: 1px solid lightgray;
  border-radius: 8px;
  cursor: pointer;
}

.item.active {
  border: 2px solid aquamarine;
}

.info {
  text-align: left;
  margin-left: 15px;
}

.item-photo {
  background-image: url("../assets/default_photo.png");
  width: 50px;
  height: 50px;
  background-size: cover;
}
</style>
