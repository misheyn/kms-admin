<template>
  <div v-if="objects.length > 0" class="list" v-scroll="handleScroll">
    <transition-group name="object-list">
      <list-item
          v-for="(item, index) in objects"
          :object="item"
          :key="index"
          :active="activeIndex === index"
          @show-info-card="$emit('show-info-card', item)"
          @toggle-active="toggleActive(index)">
        <div v-if="cardType === 'employee' || cardType === 'watchman'"><b>{{ item.lastName }} {{ item.firstName }}</b></div>
        <div v-if="cardType === 'employee'">Должность: {{ convertType(item.type) }}</div>
        <div v-if="cardType === 'watchman'">Логин: {{ item.login }}</div>
        <div v-if="cardType === 'audience'">{{ item.number }}</div>
        <div v-if="cardType === 'audience'">Тип: {{ convertType(item.type) }}</div>
      </list-item>
    </transition-group>
  </div>
  <h2 v-else style="margin: 15px 5px">Список {{ element }} пуст</h2>
</template>

<script>
import ListItem from "@/components/ListItem.vue"
import vScroll from "@/directives/vScroll.js"
import { mapState, mapMutations } from "vuex"

export default {
  components: {ListItem},
  directives: {
    'v-scroll': vScroll
  },
  props: {
    objects: {
      type: Array,
      required: true
    },
    element: String,
    cardType: String
  },
  methods: {
    handleScroll(){},
    toggleActive(index) {
      if (this.activeIndex !== index) this.setActiveIndex(index)
    },
    ...mapMutations({
      setActiveIndex: 'index/setActiveIndex'
    }),
    convertType(type) {
      if (type === "TEACHER") return 'Преподаватель'
      else if (type === "SERVICE") return 'Персонал'
      else if (type === "SECURITY") return 'Охрана'
      else if (type === "WATCHMAN") return 'Вахтер'
      else if (type === "STUDY") return 'Учебная'
      else if (type === "MULTIMEDIA") return 'Мультимедийная'
      else if (type === "LAB") return 'Лаборатория'
      else if (type === "ADMINISTRATION") return 'Административная'
    }
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

.object-list-item {
  display: inline-block;
  margin-right: 10px;
}

.object-list-enter-active,
.object-list-leave-active {
  transition: all 0.5s ease;
}

.object-list-enter-from,
.object-list-leave-to {
  opacity: 0;
  transform: translateX(130px);
}

.object-list-move {
  transition: transform 0.4s ease;
}
</style>
