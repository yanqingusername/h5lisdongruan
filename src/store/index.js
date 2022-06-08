import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
import login from './login/index'

Vue.use(Vuex)

const state = {

}

const mutations = {

}

const actions = {

}

const getters = {

}

const modules = {
    login
}

const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    modules,
    plugins: [createPersistedState({ storage: window.sessionStorage })]
})

export default store