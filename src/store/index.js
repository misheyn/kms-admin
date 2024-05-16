import { createStore } from 'vuex'
import {indexModule} from "@/store/indexModule"

export default createStore({
  modules: {
    index: indexModule
  }
})
