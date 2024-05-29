<template>
  <div class="info-card">
    <div class="close-cross" @click="closeInfoCard"></div>
    <div class="audience" style="font-size: large">
      Аудитория: <b>{{ operation.key.number }}</b>
    </div>
    <div>Ключ: {{ operation.key.main ? 'основной' : 'запасной' }}</div>
    <div style="font-size: large; margin-top: 10px;">Сотрудник</div>
    <div class="employee__wrapper">
      <div class="photo" style="height: 60px;">
        <img :src="handleImagePreview(operation.employee.photo)" alt="employee-img">
      </div>
      <div class="info" style="margin-left: 10px;">
        <b>{{ convertType(operation.employee.type) }}</b><br>{{ operation.employee.lastName }}
        {{ operation.employee.firstName }}
        {{ operation.employee.patronymic }}<br>
        Разрешение: <b>{{ checkPermissions(operation.key, operation.employee) ? 'есть' : 'нет' }}</b>
      </div>
    </div>
    <div class="operation__wrapper" style="display: flex; justify-content: space-between;">
      <div class="give-key">
        <b>Выдача</b><br>{{ formatDate(operation.giveDateTime) }} в {{ formatTime(operation.giveDateTime) }}<br>
        Подпись
        <div class="signature" v-if="signatures[0] !== null" style="height: 50px;">
          <img :src="signatures[0]" alt="signature-img">
        </div>
      </div>
      <div class="return-key" v-if="operation.returnDateTime !== null">
        <b>Сдача</b><br>{{ formatDate(operation.returnDateTime) }} в {{ formatTime(operation.returnDateTime) }}<br>
        Подпись
        <div class="signature" v-if="signatures[1] !== null" style="height: 50px;">
          <img :src="signatures[1]" alt="signature-img">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapState} from "vuex"
import employeesApi from "@/api/employeesApi"

export default {
  data() {
    return {
      signatures: []
    }
  },
  props: {
    operation: {
      type: Object,
      required: true
    }
  },
  emits: ['close-info-card'],
  methods: {
    ...mapMutations({
      setActiveIndex: 'index/setActiveIndex'
    }),
    closeInfoCard() {
      this.$emit('close-info-card')
      this.setActiveIndex(null)
    },
    convertType(type) {
      if (type === "TEACHER") return 'Преподаватель'
      else if (type === "SERVICE") return 'Сотрудник персонала'
      else if (type === "SECURITY") return 'Сотрудник охраны'
    },
    handleImagePreview(file) {
      return URL.createObjectURL(file)
    },
    checkPermissions(key, employee) {
      for (const keyPerm of key.permissions) {
        for (const empPerm of employee.permissions) {
          if (keyPerm.permission_id === empPerm.permission_id) return true
        }
      }
      return false
    },
    formatDate(date) {
      const dateObject = new Date(date)
      const year = dateObject.getFullYear()
      const month = (dateObject.getMonth() + 1).toString().padStart(2, "0")
      const day = dateObject.getDate().toString().padStart(2, "0")
      return `${day}.${month}.${year}`
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
    },
    async getSignature(signature) {
      const getImageResponse = await employeesApi.getImage(signature.image.image_id)
      return this.handleImagePreview(getImageResponse)
    },
    async fetchSignatures() {
      if (this.operation.signatures[0]) this.signatures[0] = await this.getSignature(this.operation.signatures[0])
      if (this.operation.signatures[1]) this.signatures[1] = await this.getSignature(this.operation.signatures[1])
    },
  },
  computed: {
    ...mapState({
      activeIndex: state => state.index.activeIndex
    })
  },
  async mounted() {
    await this.fetchSignatures()
  }
}
</script>

<style scoped>
.info-card {
  width: 49%;
  margin-top: 10px;
  border: 1px solid lightgray;
  border-radius: 8px;
  padding: 15px 15px 10px;
  display: flex;
  flex-direction: column;
  height: fit-content;
}

.photo, .signature {
  background-size: cover;
  overflow: hidden;
}

.photo img, .signature img {
  height: 100%;
  width: auto;
}

.close-cross {
  background-image: url("../../assets/close_cross.png");
  width: 20px;
  height: 20px;
  background-size: cover;
  align-self: flex-end;
  cursor: pointer;
}

.employee__wrapper {
  display: flex;
  margin: 5px 0 25px;
}
</style>
