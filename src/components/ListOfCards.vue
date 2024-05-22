<template>
  <div
      v-if="objects.length > 0"
      class="list"
      :class="{'notOperations': cardType !== 'operation'}"
      v-scroll="handleScroll">
    <transition-group name="object-list">
      <list-item
          v-for="(item, index) in objects"
          :object="item"
          :key="index"
          :active="activeIndex === index"
          :is-employee="cardType === 'employee' || cardType === 'watchman' || cardType === 'permissionEmployee'"
          @show-info-card="handleShowInfoCard(item, cardType)"
          @toggle-active="toggleActive(index)">
        <div
            v-if="cardType === 'employee' || cardType === 'watchman' || cardType === 'permissionEmployee'"
            class="first-line">{{ item.lastName }} {{ item.firstName.slice(0, 1) }}. {{ item.patronymic.slice(0, 1) }}.</div>
        <div v-if="cardType === 'employee'">Должность: {{ convertType(item.type) }}</div>
        <div v-if="cardType === 'watchman'">Логин: {{ item.login }}</div>
        <div v-if="cardType === 'audience'" class="first-line">{{ item.number }}</div>
        <div v-if="cardType === 'audience'">Тип: {{ convertType(item.type) }}</div>
        <div v-if="cardType === 'division' || cardType === 'permissionDivision'" class="first-line">
          {{ item.name }}</div>
        <div v-if="cardType === 'permissionEmployee'">
          Должность: {{ convertType(item.type) }}, Разрешений: {{ item.permissionsNumber }}</div>
        <div v-if="cardType === 'permissionDivision'">
          Разрешений: {{ item.permissionsNumber }}</div>
        <div v-if="cardType === 'operation'" class="operation">
          {{item.key.main ? 'Основной' : 'Запасной'}} ключ от аудитории <b>{{item.key.number}}</b></div>
        <div v-if="cardType === 'operation'" class="operation">
          Выдан: <b>{{formatTime(item.giveDateTime)}}</b>
          <br>Возвращен: <b>{{formatTime(item.returnDateTime)}}</b></div>
        <div v-if="cardType === 'operation'" class="operation">
          {{convertTypeForOperation(item.employee.type)}} <b>{{item.employee.lastName}}</b>
          {{item.employee.firstName.slice(0, 1)}}. {{item.employee.patronymic.slice(0, 1)}}.</div>
      </list-item>
    </transition-group>
  </div>
  <h3 v-else style="margin: 15px 5px; color: darkred">Список {{ element }} пуст</h3>
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
    element: {
      type: String,
      required: true
    },
    cardType: {
      type: String,
      required: true
    }
  },
  methods: {
    handleScroll(){},
    handleShowInfoCard(item, cardType) {
      this.$emit('show-info-card', item)
      if (cardType === 'permissionEmployee' || cardType === 'permissionDivision' || cardType === 'division')
        this.$emit('get-list')
    },
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
      else if (type === "ADMINISTRATION") return 'Служебная'
    },
    convertTypeForOperation(type) {
      if (type === "TEACHER") return 'Преподаватель'
      else if (type === "SERVICE") return 'Сотрудник персонала'
      else if (type === "SECURITY") return 'Сотрудник охраны'
    },
    formatTime(date) {
      if (date === null || date === undefined) return '...'
      else {
        const dateObject = new Date(date)
        const hours = dateObject.getHours()
        const minutes = dateObject.getMinutes()
        const seconds = dateObject.getSeconds()
        return `${hours}:${minutes}:${seconds}`
      }
    }
  },
  computed: {
    ...mapState({
      activeIndex: state => state.index.activeIndex
    })
  },
  mounted() {
    this.setActiveIndex(-1)
  }
}
</script>

<style scoped>
.list {
  width: 100%;
  margin-top: 10px;
}

.list.notOperations {
  width: 49%;
  max-height: 80vh;
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

.first-line {
  font-weight: bold;
  font-size: large;
}

.operation {
  font-size: small;
}

.operation b {
  color: #E68569;
}
</style>
