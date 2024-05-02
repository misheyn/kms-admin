<template>
  <div class="page__wrapper">
    <div class="top__panel">
      <my-button
          class="create-btn"
          @click="this.dialogVisible = true">
        Добавить вахтера
      </my-button>
      <create-dialog v-model:show="dialogVisible">
        <add-watchman-form @create="addWatchman"/>
      </create-dialog>
      <search-bar
          v-model="searchQuery"
          placeholder="Поиск..."/>
    </div>
    <div class="center__panel">
      <list-of-cards
          v-if="!isLoading"
          :objects="searchedWatchmen"
          :element="'вахтеров'"
          :card-type="'watchman'"
          @show-info-card="showInfoCard"/>
      <h2 v-else style="margin: 15px 5px">Загрузка...</h2>
      <watchman-info-card
          v-if="selectedWatchman"
          :watchman="selectedWatchman"
          @close-info-card="this.selectedWatchman = null"
          @remove="removeWatchman"
          @update-watchman-info="updateWatchmanInfo"/>
    </div>
  </div>
</template>

<script>
import MyButton from "@/components/UI/MyButton.vue"
import SearchBar from "@/components/UI/SearchBar.vue"
import CreateDialog from "@/components/UI/CreateDialog.vue"
import AddWatchmanForm from "@/components/watchmen/AddWatchmanForm.vue"
import WatchmanInfoCard from "@/components/watchmen/WatchmanInfoCard.vue"
import watchmenApi from "@/api/watchmenApi"
import ListOfCards from "@/components/ListOfCards.vue"

export default {
  components: {ListOfCards, WatchmanInfoCard, AddWatchmanForm, CreateDialog, SearchBar, MyButton},
  data() {
    return {
      searchQuery: '',
      watchmen: [],
      isLoading: false,
      dialogVisible: false,
      selectedWatchman: null
    }
  },
  methods: {
    addWatchman (user) {
      const watchman = {
        id: user.user_id,
        lastName: user.employee.second_name,
        firstName: user.employee.first_name,
        patronymic: user.employee.middle_name,
        login: user.username
      };
      this.watchmen.push(watchman)
      this.dialogVisible = false
    },
    showInfoCard (watchman) {
      this.selectedWatchman = watchman
    },
    removeWatchman (watchman) {
      this.watchmen = this.watchmen.filter(wm => wm.id !== watchman.id)
    },
    async fetchWatchmen () {
        this.isLoading = true
        const getUsersResponse = await watchmenApi.getAllUsers()
        console.log(getUsersResponse)
        getUsersResponse.forEach(user => {
          if (user.employee && user.employee.employee_type === "WATCHMAN" && user.employee.employee_status === "WORKS") {
            const watchman = {
              id: user.user_id,
              lastName: user.employee.second_name,
              firstName: user.employee.first_name,
              patronymic: user.employee.middle_name,
              login: user.username
            }
            this.watchmen.push(watchman)
          }
        })
        this.isLoading = false
    },
    updateWatchmanInfo(updatedWatchman) {
      const index = this.watchmen.findIndex(w => w.id === updatedWatchman.id)
      if (index !== -1) {
        this.watchmen.splice(index, 1, updatedWatchman)
      }
      this.showInfoCard(updatedWatchman)
    }
  },
  computed: {
    searchedWatchmen () {
      const query = this.searchQuery.toLowerCase();
      return [...this.watchmen].filter(watchman => {
        return Object.values(watchman).some(value => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(query);
          }
          return false;
        });
      });
    }
  },
  mounted() {
    this.fetchWatchmen()
  }
}
</script>

<style scoped>
.top__panel, .center__panel {
  display: flex;
  justify-content: space-between;
}

.create-btn {
  cursor: pointer;
  margin-top: 20px;
}
</style>
