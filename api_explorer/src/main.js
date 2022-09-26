import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import {store} from './store'

Vue.config.productionTip = false
Vue.use(Vuex)

const app = new Vue({
    router,
    render: h => h(App),
    store: store()
}).$mount('#app')
