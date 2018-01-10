const Toast = {
  install(Vue) {
    let Toast = Vue.extend({
      data() {
        return {
          text: null,
          type: null,
          isShow: false,
          mask: false,
          timer: null
        }
      },
      template: `
        <div class="am-toast" v-if='isShow'>
          <div class="app-mask" v-if="mask"></div>
          <div class="am-toast-text" style="z-index: 101;position: relative;">
            <span v-if="type" class="am-icon toast" :class="type"></span> {{text}}
          </div>
        </div>
      `,
      methods: {
        show(text, type, cb = function () {}, time = 3000) {
          this.timer && window.clearTimeout(this.timer) //清除定时器
          if (text || type) {
            this.text = text
            this.type = type
            this.isShow = true
            this.timer = window.setTimeout(() => {
              this.text = ''
              this.type = ''
              this.isShow = false
              cb && cb()
            }, time)
          } else {
            this.isShow = false
          }
        },
        loading(text, mask = false) {
          this.text = text
          this.mask = mask
          this.type = 'loading'
          this.isShow = true
        },
        close() {
          this.timer && window.clearTimeout(this.timer)
          this.isShow = false
        }
      }
    })
    let div = document.createElement('div')
    let el = document.body.appendChild(div)
    Vue.prototype.$toast = new Toast().$mount(el)
  }
}

import Vue from 'vue'
Vue.use(Toast)
