<template>
  <div class="page__wrapper">
    <div class="btn__wrapper" style="display: flex; margin-top: 10px;">
      <button class="switch-btn" @click="selectTab('employees')">Сотрудники</button>
      <button class="switch-btn active-tab" @click="selectTab('audiences')">Аудитории</button>
    </div>
    <div class="line"></div>
    <div class="top__panel" style="align-items: center;">
      <my-button
          class="create-btn"
          @click="this.dialogVisible = true">
        Добавить аудиторию
      </my-button>
      <my-dialog v-model:show="dialogVisible">
        <add-audience-form @create="addAudience"/>
      </my-dialog>
        <select v-model="selectedType" class="filter-type">
          <option value="" selected disabled>Выберите тип</option>
          <option value="">Все</option>
          <option value="STUDY">Учебная</option>
          <option value="LAB">Лаборатория</option>
          <option value="MULTIMEDIA">Мультимедийная</option>
          <option value="ADMINISTRATION">Служебная</option>
        </select>
        <search-bar
            v-model="searchQuery"
            placeholder="Поиск..."/>
    </div>
    <div class="center__panel">
      <list-of-cards
          v-if="!isLoading"
          :objects="searchedAudience"
          :element="'аудиторий'"
          :card-type="'audience'"
          @show-info-card="showInfoCard"/>
      <h2 v-else style="margin: 15px 5px">Загрузка...</h2>
      <audience-info-card
          v-if="selectedAudience"
          :audience="selectedAudience"
          @close-info-card="this.selectedAudience = null"
          @remove="removeAudience"
          @update-audience-info="updateAudienceInfo"/>
    </div>
  </div>
</template>

<script>
import MyDialog from "@/components/UI/MyDialog.vue"
import ListOfCards from "@/components/ListOfCards.vue"
import SearchBar from "@/components/UI/SearchBar.vue"
import MyButton from "@/components/UI/MyButton.vue"
import audiencesApi from "@/api/audiencesApi"
import AddAudienceForm from "@/components/audiences/AddAudienceForm.vue"
import AudienceInfoCard from "@/components/audiences/AudienceInfoCard.vue"

export default {
  components: {AudienceInfoCard, AddAudienceForm, MyButton, SearchBar, ListOfCards, MyDialog},
  data() {
    return {
      searchQuery: '',
      audiences: [],
      isLoading: false,
      dialogVisible: false,
      selectedAudience: null,
      selectedType: ''
    }
  },
  methods: {
    selectTab(tab) {
      if (tab === 'audiences') this.$router.push('/audiences')
      else this.$router.push('/employees')
    },
    addAudience(audience) {
      this.audiences.push(audience)
      this.dialogVisible = false
    },
    showInfoCard(audience) {
      this.selectedAudience = audience
    },
    removeAudience(audience) {
      this.audiences = this.audiences.filter(aud => aud.id !== audience.id)
    },
    async fetchAudiences() {
      this.isLoading = true
      const getAudiencesResponse = await audiencesApi.getAllKeys()

      getAudiencesResponse.forEach(it => {
        if (it.audience && it.audience.exist) {
          const index = this.audiences.findIndex(audience => audience.id === (it.audience.audience_id || it.audience))
          if (index !== -1) {
            const key = {id: it.key_id, state: it.key_state, main: it.main}
            this.audiences[index].keys.push(key)
          } else {
            const audience = {
              id: it.audience.audience_id,
              number: it.audience.number,
              capacity: it.audience.capacity,
              signalisation: it.audience.signalisation,
              type: it.audience.audience_type,
              keys: [
                {id: it.key_id, state: it.key_state, main: it.main, qrData: it.qr}
              ]
            }
            this.audiences.push(audience)
          }
        }
      })
      this.isLoading = false
    },
    updateAudienceInfo(updatedAudience) {
      const index = this.audiences.findIndex(e => e.id === updatedAudience.id)
      if (index !== -1) this.audiences.splice(index, 1, updatedAudience)
      this.showInfoCard(updatedAudience)
    }
  },
  computed: {
    searchedAudience() {
      const query = this.searchQuery.toLowerCase()
      return [...this.audiences]
          .filter(audience => {
            return (!this.selectedType || audience.type === this.selectedType) &&
                Object.values(audience).some(value => {
                  if (typeof value === 'string') {
                    return value.toLowerCase().includes(query)
                  } else if (value !== undefined && value !== null) {
                    return value.toString().toLowerCase().includes(query)
                  }
                  return false
                })
          })
    }
  },
  mounted() {
    this.fetchAudiences()
  }
}
</script>

<style scoped>
.top__panel, .center__panel {
  display: flex;
  justify-content: space-between;
  padding: 15px 5px;
}

.filter-type {
  margin-left: auto;
  margin-right: 10px;
  height: 25px;
  border: none;
}
</style>
