
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import './widgets/Components.js'
import './widgets/Toast.js'

import './assets/css/antui-all.css'
import './assets/css/app.less'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

// 混合
Vue.mixin({
  methods: {
    errorCb(error) { // 网络错误
      this.log(error)
      this.$toast.close()
      if (error.name && error.name.indexOf('Error') > -1) {
        this.$toast.show('服务器开小差了', 'error')
        return
      }
    },
    log(info, level) { // 0:log 1:info
      var type = level || 0
      var methods = ['log', 'info']
      level === 2 ? console.log(JSON.stringify(info)) : console[methods[type]](info)
    }
  }
})
