<template>
  <nav-bar></nav-bar>
  <div class="app">
      <router-view></router-view>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import NavBar from "@/components/NavBar.vue";

export default defineComponent({
  components: {NavBar}
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  height: 100vh;
  overflow-y: auto;
}
</style>

