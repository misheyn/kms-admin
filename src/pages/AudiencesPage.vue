<template>
  <div class="page__wrapper">
    <div class="btn__wrapper" style="display: flex;">
      <button class="switch-btn" @click="selectTab('employees')">Сотрудники</button>
      <button class="switch-btn active-tab" @click="selectTab('audiences')">Аудитории</button>
    </div>
    <div class="line"></div>
    <div class="top__panel">
      <my-button
          class="create-btn"
          @click="this.dialogVisible = true">
        Добавить аудиторию
      </my-button>
      <create-dialog v-model:show="dialogVisible">
        <add-audience-form @create="addAudience"/>
      </create-dialog>
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
import CreateDialog from "@/components/UI/CreateDialog.vue"
import ListOfCards from "@/components/ListOfCards.vue"
import SearchBar from "@/components/UI/SearchBar.vue"
import MyButton from "@/components/UI/MyButton.vue"
import audiencesApi from "@/api/audiencesApi"
import AddAudienceForm from "@/components/audiences/AddAudienceForm.vue"
import AudienceInfoCard from "@/components/audiences/AudienceInfoCard.vue"

export default {
  components: {AudienceInfoCard, AddAudienceForm, MyButton, SearchBar, ListOfCards, CreateDialog},
  data() {
    return {
      searchQuery: '',
      audiences: [],
      isLoading: false,
      dialogVisible: false,
      selectedAudience: null
    }
  },
  methods: {
    selectTab(tab) {
      if (tab === 'audiences') this.$router.push('/audiences')
      else this.$router.push('/employees')
    },
    addAudience (audience) {
      this.audiences.push(audience)
      this.dialogVisible = false
    },
    showInfoCard (audience) {
      this.selectedAudience = audience
    },
    removeAudience (audience) {
      this.audiences = this.audiences.filter(aud => aud.id !== audience.id)
    },
      async fetchAudiences () {
        this.isLoading = true
        const getAudiencesResponse = await audiencesApi.getAllKeys()
        console.log(getAudiencesResponse)

        getAudiencesResponse.forEach(it => {
          const index = this.audiences.findIndex(audience => audience.id === it.audience.audience_id)
          if (index !== -1) {
            const key = { id: it.key_id, state: it.keyState, main: it.main }
            this.audiences[index].keys.push(key)
          } else {
            const audience = {
              id: it.audience.audience_id || undefined,
              number: it.audience.number || undefined,
              floor: it.audience.floor || undefined,
              capacity: it.audience.capacity || undefined,
              signalisation: it.audience.signalisation || undefined,
              type: it.audience.audienceType || undefined,
              keys: [
                { id: it.key_id, state: it.keyState, main: it.main }
              ]
            }
            this.audiences.push(audience)
          }
        })
        console.log(this.audiences)
        this.isLoading = false
      },
    updateAudienceInfo(updatedAudience) {
      const index = this.audiences.findIndex(e => e.id === updatedAudience.id)
      if (index !== -1) {
        this.audiences.splice(index, 1, updatedAudience)
      }
      this.showInfoCard(updatedAudience)
    }
  },
  computed: {
    searchedAudience () {
      const query = this.searchQuery.toLowerCase();
      return [...this.audiences].filter(audience => {
        return Object.values(audience).some(value => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(query);
          }
          // } else if (value !== undefined && value !== null) { // Добавленная проверка
          //   return value.toString().toLowerCase().includes(query); // Используем toString для преобразования в строку
          // }
          return false;
        });
      });
    }
  },
  mounted() {
    this.fetchAudiences()
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

.top__panel, .center__panel {
  display: flex;
  justify-content: space-between;
}

.create-btn {
  cursor: pointer;
  margin-top: 20px;
}
</style>
