<template>
  <div v-if="watchmen.length > 0" class="list" v-scroll="handleScroll">
    <transition-group name="watchman-list">
      <watchman-item
          v-for="(watchman, index) in watchmen"
          :watchman="watchman"
          :key="index"
          @show-info-card="$emit('show-info-card', watchman)"
          :active="activeIndex === index"
          @toggle-active="toggleActive(index)"
      />
    </transition-group>
  </div>
  <h2 v-else style="margin: 15px 5px">Список вахтеров пуст</h2>
</template>

<script>
import WatchmanItem from "@/components/watchmen/WatchmanItem.vue"
import vScroll from "@/directives/vScroll.js"
import { mapState, mapMutations } from "vuex"

export default {
  components: {WatchmanItem},
  directives: {
    'v-scroll': vScroll
  },
  props: {
    watchmen: {
      type: Array,
      required: true
    }
  },
  methods: {
    handleScroll(){},
    toggleActive(index) {
      // this.activeIndex === index ? this.setActiveIndex(null) : this.setActiveIndex(index)
      if (this.activeIndex !== index) this.setActiveIndex(index)
    },
    ...mapMutations({
      setActiveIndex: 'index/setActiveIndex'
    }),
  },
  computed: {
    ...mapState({
      activeIndex: state => state.index.activeIndex
    })
  }
}
</script>

<style scoped>
.list {
  width: 49%;
  margin-top: 10px;
  height: 80vh;
  overflow-y: auto;
}

.watchman-list-item {
  display: inline-block;
  margin-right: 10px;
}

.watchman-list-enter-active,
.watchman-list-leave-active {
  transition: all 0.5s ease;
}

.watchman-list-enter-from,
.watchman-list-leave-to {
  opacity: 0;
  transform: translateX(130px);
}

.watchman-list-move {
  transition: transform 0.4s ease;
}
</style>
