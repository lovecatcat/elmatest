<template>
  <div class="main">
    <!--首页-->
    <div class="main-header">
      <div class="main-location">
        <div class="fn-left">深圳市福田区华强北</div>
        <div class="fn-right">登录</div>
      </div>
      <!--搜索-->
      <div class="main-search">
        <input class="am-search-value" type="text" placeholder="搜索商家、商品" value="" aria-label="关键词">
      </div>
      <!--热搜词-->
      <div class="am-ft-white main-hotword">
        <div>
          <span v-for="item in falseHotWord">
              {{item.title}}
          </span>
        </div>
      </div>
    </div>
    <!--导航-->
    <div class="main-banner">
      <router-link to="/search">
        <div class="banner-img">
          <img src="../images/slider-pic/slider-pic1.jpeg">
          <p>美食</p>
        </div>
      </router-link>
      <router-link to="/search">
        <div class="banner-img">
          <img src="../images/slider-pic/slider-pic2.jpeg">
          <p>美食</p>
        </div>
      </router-link>
      <router-link to="/search">
        <div class="banner-img">
          <img src="../images/slider-pic/slider-pic3.jpeg">
          <p>美食</p>
        </div>
      </router-link>
      <router-link to="/search">
        <div class="banner-img">
          <img src="../images/slider-pic/slider-pic4.jpeg">
          <p>美食</p>
        </div>
      </router-link>
    </div>
  </div>
</template>
<script>
import {
  mapState
} from 'vuex'

export default {
  name: 'main',
  data() {
    return {

    }
  },
  computed: {
    ...mapState([
      'isLogin',
      'falseHotWord'
    ])
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
