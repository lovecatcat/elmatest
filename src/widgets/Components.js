import Vue from 'vue'

///////////
// Input //
///////////
const AppInput = {
  props: {
    label: String,
    right: Boolean,
    color: Boolean
  },
  template: `
  <div class="am-list-item">
    <div class="am-list-label" :class="{tar:right,'main-color': color}">{{label}}</div>
    <div class="am-list-control">
      <slot name="input"></slot>
    </div>
    <slot name="icon"></slot>
    <slot name="button"></slot>
  </div>
  `
}

/////////////////
// AppDropdown //
/////////////////
const AppDropdown = {
  props: {
    label: String,
    up: String,
    isform: {
      type: Boolean,
      default: true
    }
  },
  template: `
  <div class="am-list" :class="{'am-list-5lb': isform, 'form': isform}">
    <div class="am-list-item dropdown" :class="isup">
      <div class="am-list-dropdown-main" @click="toggle" v-if="label">
        <div class="am-list-control">{{label}}</div>
        <div class="am-list-arrow">
            <span class="am-icon arrow vertical" :class="isup"></span>
        </div>
      </div>
      <div class="am-list-dropdown-main" v-else="label">
        <slot name="header"></slot>
      </div>
      <div class="am-list-dropdown-list">
        <slot></slot>
      </div>
    </div>
  </div>
  `,
  data() {
    return {
      isup: ''
    }
  },
  created() {
    this.isup = this.up
  },
  methods: {
    toggle() {
      if (this.isup !== 'up') {
        this.isup = 'up'
      } else {
        this.isup = ''
      }
    }
  }
}

///////////////
// AppDialog //
///////////////
const AppDialog = {
  template: `
  <div class="am-dialog show app-dialog">
    <div class="am-dialog-wrap">
      <slot name="header"></slot>
      <slot name="body"></slot>
      <slot name="footer"></slot>
    </div>
  </div>
  `
}

///////////////
// AppSelect //
///////////////
const AppSelect = {
  props: {
    label: String,
    readonly: Boolean
  },
  template: `
  <div class="am-list-item dropdown">
    <div class="am-list-dropdown-main">
      <div class="am-list-label">{{label}}</div>
      <div class="am-list-control">
        <slot></slot>
      </div>
      <div v-if="!readonly" class="am-list-arrow"><span class="am-icon arrow vertical"></span></div>
    </div>
  </div>
  `
}

Vue.component('app-input', AppInput)
Vue.component('app-dropdown', AppDropdown)
Vue.component('app-dialog', AppDialog)
Vue.component('app-select', AppSelect)
