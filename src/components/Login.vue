<template>
    <div class="login">
      <FixHeader title="登录"></FixHeader>
      <div class="am-list am-list-form">
        <div class="am-list-item am-input-autoclear">
          <div class="am-list-label">账号</div>
          <div class="am-list-control">
            <input type="text" placeholder="请输入账号" v-model="user">
          </div>
          <div class="am-list-clear" tabindex="0" aria-label="清空输入框" aria-controls="demo-input-2">
            <i class="am-icon-clear am-icon" aria-hidden="true"></i>
          </div>
        </div>
        <div class="am-list-item am-input-autoclear">
          <div class="am-list-label">密码</div>
          <div class="am-list-control">
            <input type="text" placeholder="请输入密码" v-model="pass">
          </div>
          <div class="am-list-clear" tabindex="0" aria-label="清空输入框" aria-controls="demo-input-3">
            <i class="am-icon-clear am-icon" aria-hidden="true"></i>
          </div>
        </div>
      </div>
      <button type="button" class="am-button" @click="login">登录</button>
    </div>
</template>

<script>
import FixHeader from './header'
import {
  mapState
} from 'vuex'

export default {
  name: 'login',
  components: {
    FixHeader
  },
  data() {
    return {
      user: '',
      pass: ''
    }
  },
  computed: {
    ...mapState([
      'isLogin',
      'username',
      'password'
    ])
  },
  mounted() {
    if (this.isLogin) {
      // this.$router.replace('/MyCenter')
    }
  },
  methods: {
    login() {
      if (!this.username || !this.password) {
        alert('请先输入用户名或密码')
      } else if (this.user !== this.username || this.pass !== this.password) {
        alert('请先输入正确的用户名或密码')
      } else {
        this.$store.commit('SET_ISLOGIN', true)
        this.$router.replace('/MyCenter')
      }
    }
  }
}
</script>
