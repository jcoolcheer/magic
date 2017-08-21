require('./css/reset.less')
require('./css/main.less')
require('./css/font-css/weather-icons.css')
// import Vue from 'vue/dist/vue.js'
import Vue from 'vue'

import app from './app.vue'
Vue.directive('loading', function (el, binding) {
    if (binding.value) {
        el.classList.add("is-loading")
    } else {
        el.classList.remove("is-loading")
    }
})
Vue.prototype.URL = 'http://127.0.0.1:8002/'

new Vue({
    el: '#app',
    template: '<app/>',
    components: {
        app
    }
})
