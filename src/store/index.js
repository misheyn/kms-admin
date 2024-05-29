import { createStore } from 'vuex'
import {indexModule} from "@/store/indexModule"
import {authModule} from "@/store/authModule"

export default createStore({
  modules: {
    index: indexModule,
    auth: authModule
  }
})
