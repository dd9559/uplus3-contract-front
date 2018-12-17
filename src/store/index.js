import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    path:[],
    slider:[]
  },
  mutations: {
    setPath (state,payload) {
      localStorage.setItem('router',JSON.stringify(payload))
      state.path=payload
    }
  },
  getters:{
    getPath:state=>{
      return state.path
    }
  }
})
export {
  store
}
