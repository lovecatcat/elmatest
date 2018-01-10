import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import { falseHotWord, falseOrder, falseBussinessbrief, falseBussinessInfo } from '../falsedata/falsedata.js'

// import state from 'state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  strict: debug,
  state: {
    isLoading: false, //是否加载中
    username: 'baihao',
    password: 'baihao',
    isLogin: false,
    // 当前所在页面 homepage | order | myzone (myzone切换还有问题)
    whichPage: '',
    falseHotWord,
    falseOrder,
    falseBussinessbrief,
    falseBussinessInfo
  },
  mutations,
  actions,
  getters
})
