<template>
  <div class="navbar">
    <div
        class="logo"
        @click="selectTab('main')">Keys Management System</div>
    <div class="navbar__btn" v-if="!isAuthPage" style="margin-left: auto;">
      <button
          class="switch-btn"
          :class="{ 'active-tab': selectedTab === 'shifts' }"
          @click="selectTab('shifts')">Журналы смен</button>
      <button
          class="switch-btn"
          :class="{ 'active-tab': selectedTab === 'employees' }"
          @click="selectTab('employees')">Сотрудники и аудитории</button>
      <button
          class="switch-btn"
          :class="{ 'active-tab': selectedTab === 'watchmen' }"
          @click="selectTab('watchmen')">Вахтеры</button>
      <button
          class="switch-btn"
          :class="{ 'active-tab': selectedTab === 'permissions' }"
          @click="selectTab('permissions')">Разрешения</button>
      <button
          class="switch-btn"
          :class="{ 'active-tab': selectedTab === 'divisions' }"
          @click="selectTab('divisions')">Подразделения</button>
      <my-button @click="$router.push('/')" style="margin-left: 20px; background: black; color: white">Выйти</my-button>
    </div>
  </div>
</template>

<script>
import MyButton from "@/components/UI/MyButton.vue"

export default {
  components: {MyButton},
  data() {
    return {
      selectedTab: ''
    }
  },
  methods: {
    selectTab(tab) {
      this.selectedTab = tab;
      if (tab === 'shifts') this.$router.push('/shifts')
      else if (tab === 'employees') this.$router.push('/employees')
      else if (tab === 'watchmen') this.$router.push('/watchmen')
      else if (tab === 'permissions') this.$router.push('/permissions')
      else if (tab === 'divisions') this.$router.push('/divisions')
      else if (tab === 'main') this.$router.push('/main')
    }
  },
  computed: {
    isAuthPage () {
      return this.$route.name === 'auth'
    },
  },
  mounted() {
    this.selectedTab = this.$route.name
  },
}
</script>

<style scoped>
.navbar {
  display: flex;
  padding: 15px 50px;
  border-bottom: 1px solid black;
  align-items: center;
  height: 65px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  background: white;
}

.logo {
  font-family: "Comic Sans MS", sans-serif;
  font-size: 18px;
  color: darkmagenta;
}

.navbar__btn, .switch-btn {
  height: 63px;
}
</style>
