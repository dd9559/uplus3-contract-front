import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    path:[],
    slider:[],
    user:null
  },
  mutations: {
    setPath (state,payload) {
      localStorage.setItem('router',JSON.stringify(payload))
      state.path=payload
    },
    setUser(state,payload){
      sessionStorage.setItem('userMsg',JSON.stringify(payload))
      state.user=payload
    }
  },
  actions:{
    asyncUser({commit},payload){
      commit('setUser',payload)
    }
  },
  getters:{
    getPath:state=>{
      return state.path
    },
    getUser:state=>{
      return state.user
    }
  }
})
export {
  store
}
