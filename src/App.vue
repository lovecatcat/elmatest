<template>
  <div id="app">
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import Main from './components/Main'
import './assets/css/prospectus.css'
import './assets/css/antui-all.css'
import './assets/fonts/iconfont.css'
export default {
  name: 'app',
  components: {
    home: Main
  }
}
</script>
<style>
</style>
