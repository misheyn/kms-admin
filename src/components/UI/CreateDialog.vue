<template>
  <div class="dialog" v-if="show" @click.stop="hideDialog">
    <div @click.stop class="dialog-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import toggleMixin from '@/mixins/toggleMixin'

export default {
  name: 'create-dialog',
  mixins: [toggleMixin]
}
</script>

<style scoped>
.dialog {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgb(0, 0, 0, 0.5);
  position: absolute;
  display: flex;
  z-index: 999;
}
.dialog-content {
  margin: auto;
  background: white;
  border-radius: 15px;
  min-height: 50px;
  min-width: 350px;
  padding: 20px;
}
</style>
