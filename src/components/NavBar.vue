<template>
  <div class="navbar">
    <div class="logo">Keys Management System</div>
    <div class="navbar__btn" v-if="!isAuthPage" style="margin-left: auto;">
      <button
          class="switch-btn"
          :class="{ 'active-tab': selectedTab === 'shifts' }"
          @click="selectTab('shifts')">Журнал смен
      </button>
      <button
          class="switch-btn"
          :class="{ 'active-tab': selectedTab === 'employees' || selectedTab === 'audiences' }"
          @click="selectTab('employees')">Сотрудники и аудитории
      </button>
      <button
          class="switch-btn"
          :class="{ 'active-tab': selectedTab === 'watchmen' }"
          @click="selectTab('watchmen')">Вахтеры
      </button>
      <button
          class="switch-btn"
          :class="{ 'active-tab': selectedTab === 'permissions' }"
          @click="selectTab('permissions')">Разрешения
      </button>
      <button
          class="switch-btn"
          :class="{ 'active-tab': selectedTab === 'divisions' }"
          @click="selectTab('divisions')">Подразделения
      </button>
      <my-button @click="signOut" style="margin-left: 20px; background: black; color: white">Выйти</my-button>
    </div>
  </div>
</template>

<script>
import MyButton from "@/components/UI/MyButton.vue"
import {mapActions} from 'vuex'

export default {
  components: {MyButton},
  data() {
    return {
      selectedTab: ''
    }
  },
  methods: {
    ...mapActions({
      logOut: 'auth/logOut'
    }),
    selectTab(tab) {
      this.selectedTab = tab
      this.$router.push(`/${tab}`)
    },
    updateSelectedTab() {
      this.selectedTab = this.$route.name
    },
    signOut() {
      this.logOut()
      this.$router.push('/auth')
    }
  },
  computed: {
    isAuthPage() {
      return this.$route.name === 'auth'
    }
  },
  watch: {
    $route: 'updateSelectedTab'
  },
  mounted() {
    this.updateSelectedTab()
  },
  beforeRouteUpdate(to, from, next) {
    this.updateSelectedTab()
    next()
  }
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
  font-size: 22px;
  color: #E68569;
}

.navbar__btn, .switch-btn {
  height: 63px;
}
</style>
