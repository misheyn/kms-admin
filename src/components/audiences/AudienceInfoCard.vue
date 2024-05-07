<template>
  <div class="info-card">
    <div class="close-cross" @click="closeInfoCard"></div>
    <div class="name" style="font-size: x-large">
      <b>{{ audience.number }}</b>
    </div>
    <div class="info__wrapper">
      <div>Вместимость: {{ audience.capacity }}</div>
      <div>Сигнализация: {{ convertType(audience.signalisation) }}</div>
      <div>Тип аудитории: {{ convertType(audience.type) }}</div>
      <div>Ключи:</div>
      <div class="qrcode__wrapper">
        <div class="key__info">
          <div>{{ audience.keys[0].main === true ? 'Основной' : 'Запасной' }}</div>
          <div>Состояние: {{ convertType(audience.keys[0].state) }}</div>
          <vue-qrcode
              class="qrcode"
              ref="qrcode"
              :options="{
                width: 120
            }"
              :value="qrData1"
              :foreground-color="'#000'"
              :background-color="'#fff'"
              @click="downloadQrcode">
          </vue-qrcode>
        </div>
        <div class="key__info">
          <div>{{ audience.keys[1].main === true ? 'Основной' : 'Запасной' }}</div>
          <div>Состояние: {{ convertType(audience.keys[1].state) }}</div>
          <vue-qrcode
              class="qrcode"
              ref="qrcode"
              :options="{
                width: 120
            }"
              :value="qrData2"
              :foreground-color="'#000'"
              :background-color="'#fff'"
              @click="downloadQrcode">
          </vue-qrcode>
        </div>
      </div>
    </div>
    <div class="btn__wrapper">
      <my-button class="btn-remove" @click="removeDialogVisible = true">Удалить</my-button>
      <my-button class="btn-edit" @click="editDialogVisible = true">Редактировать</my-button>
    </div>
    <create-dialog v-model:show="editDialogVisible">
      <edit-audience-form
          :audience="audience"
          @edit="editAudience"
          @close="editDialogVisible = false"/>
    </create-dialog>
<!--    <create-dialog v-model:show="removeDialogVisible">-->
<!--      <confirm-delete-form-->
<!--          :element="'эту аудиторию'"-->
<!--          @delete="removeAudience"-->
<!--          @close="removeDialogVisible = false"/>-->
<!--    </create-dialog>-->
  </div>
</template>

<script>
import CreateDialog from "@/components/UI/CreateDialog.vue"
import VueQrcode from "@chenfengyuan/vue-qrcode"
import MyButton from "@/components/UI/MyButton.vue"
import {mapMutations, mapState} from "vuex"
import EditAudienceForm from "@/components/audiences/EditAudienceForm.vue"
import audiencesApi from "@/api/audiencesApi"

export default {
  components: {EditAudienceForm, MyButton, VueQrcode, CreateDialog},
  data() {
    return {
      editDialogVisible: false,
      removeDialogVisible: false,
      qrData1: 'jdjrf745455hubbdc',
      qrData2: 'huy7e3ueuhuy4yu47',
    }
  },
  props: {
    audience: {
      type: Object,
      required: true
    }
  },
  emits: ['close-info-card', 'remove', 'update-audience-info'],
  methods: {
    ...mapMutations({
      setActiveIndex: 'index/setActiveIndex'
    }),
    closeInfoCard() {
      this.$emit('close-info-card')
      this.setActiveIndex(null)
    },
    downloadQrcode() {
      const qrcodeComponent = this.$refs.qrcode
      if (qrcodeComponent) {
        const canvas = document.createElement('canvas')
        canvas.width = qrcodeComponent.$el.width
        canvas.height = qrcodeComponent.$el.height

        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(qrcodeComponent.$el, 0, 0)

        const imageDataURL = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.href = imageDataURL
        link.download = `${this.audience.number}Qrcode.png`

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        console.error('QR code component not found')
      }
    },
/*    async removeEmployee() {
      const deleteResponse = await employeesApi.deleteEmployee(this.employee.id, this.employee.firstName,
          this.employee.lastName, this.employee.patronymic, this.employee.type)
      if (deleteResponse.status === 200) {
        this.$emit('remove', this.employee)
        this.closeInfoCard()
      }
    },*/
    async editAudience(updatedAudience) {
      console.log(updatedAudience)
      const updateMainKeyResponse = await audiencesApi.updateKey(
          updatedAudience.id,
          updatedAudience.keys[0].state,
          updatedAudience.keys[0].main
      )
      console.log(updateMainKeyResponse.data)
      const updateSpareKeyResponse = await audiencesApi.updateKey(
          updatedAudience.id,
          updatedAudience.keys[1].state,
          updatedAudience.keys[1].main
      )
      console.log(updateSpareKeyResponse.data)
      if (updateMainKeyResponse.status === 200 && updateSpareKeyResponse.status === 200) {
        this.$emit('update-audience-info', updatedAudience)
        this.editDialogVisible = false
      }
    },
    convertType(val) {
      if (val === "NONE") return 'Нет'
      else if (val === "ON") return 'Включена'
      else if (val === "OFF") return 'Выключена'
      else if (val === "STUDY") return 'Учебная'
      else if (val === "MULTIMEDIA") return 'Мультимедийная'
      else if (val === "LAB") return 'Лаборатория'
      else if (val === "ADMINISTRATION") return 'Административная'
      else if (val === "GIVEN_AWAY") return 'Выдан'
      else if (val === "RETURNED") return 'Возвращен'
      else if (val === "LOST") return 'Утерян'
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
.info-card {
  width: 49%;
  margin-top: 70px;
  border: 1px solid lightgray;
  border-radius: 8px;
  padding: 15px 15px 10px;
  display: flex;
  flex-direction: column;
  height: fit-content;
}

.close-cross {
  background-image: url("../../assets/close_cross.png");
  width: 20px;
  height: 20px;
  background-size: cover;
  align-self: flex-end;
  cursor: pointer;
}

.btn__wrapper {
  flex-direction: row;
  align-self: flex-end;
  justify-content: center;
}

.btn-remove {
  color: red;
  border-color: red;
}

.btn-edit {
  color: blue;
  border-color: blue;
  margin-left: 10px;
}

.info__wrapper {
  display: flex;
  justify-content: space-between;
  margin: 5px 0 25px;
  flex-direction: column;
}

.qrcode__wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

.key__info {
  display: flex;
  flex-direction: column;
}
</style>
