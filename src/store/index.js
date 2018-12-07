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
      localStorage.setItem('router',payload)
      state.path=payload
    },
    sliderRouter(state,payload){
      localStorage.setItem('slider',payload)
      state.slider=payload
    }
  }
})
export {
  store
}
