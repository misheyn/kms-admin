<template>
  <button class="btn">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'my-button'
}
</script>

<style scoped>
.btn {
  padding: 5px 15px;
  background: none;
  border: 1px solid black;
  border-radius: 12px;
  color: black;
  font-size: large;
  cursor: pointer;
}
</style>
