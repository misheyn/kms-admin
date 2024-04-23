<template>
  <div class="page__wrapper">
    <div class="btns__wrapper" style="display: flex;">
      <button class="switch-btn" @click="selectTab('employees')">Сотрудники</button>
      <button class="switch-btn active-tab" @click="selectTab('audiences')">Аудитории</button>
    </div>
    <div class="line"></div>
    <h1>Аудитории</h1>
  </div>
</template>

<script>
export default {
  methods: {
    selectTab(tab) {
      if (tab === 'audiences') this.$router.push('/audiences')
      else this.$router.push('/employees')
    }
  }
}
</script>

<style scoped>
.line {
  height: 1px;
  top: -1px;
  background-color: lightgray;
  position: relative;
  width: 100%;
}
</style>
