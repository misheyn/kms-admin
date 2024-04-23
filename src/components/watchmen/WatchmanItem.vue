<template>
  <div
      class="card"
      :class="{ 'active': active }"
      @click="toggleActive">
    <div class="watchman-photo"></div>
    <div class="info">
      <div> {{ watchman.lastName }}</div>
      <div> Логин: {{ watchman.login }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    watchman: {
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
      this.$emit('show-info-card', this.watchman)
    }
  }
}
</script>

<style scoped>
.card {
  margin-top: 10px;
  padding: 5px 15px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid lightgray;
  border-radius: 8px;
  cursor: pointer;
}

.card.active {
  border: 2px solid aquamarine;
}

.info {
  text-align: left;
  margin-left: 15px;
}

.watchman-photo {
  background-image: url("../../assets/default_photo.png");
  width: 50px;
  height: 50px;
  background-size: cover;
}
</style>
