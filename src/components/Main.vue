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
          <p>甜品饮品</p>
        </div>
      </router-link>
      <router-link to="/search">
        <div class="banner-img">
          <img src="../images/slider-pic/slider-pic3.jpeg">
          <p>商店超市</p>
        </div>
      </router-link>
      <router-link to="/search">
        <div class="banner-img">
          <img src="../images/slider-pic/slider-pic4.jpeg">
          <p>预定早餐</p>
        </div>
      </router-link>
      <router-link to="/search">
        <div class="banner-img">
          <img src="../images/slider-pic/slider-pic5.jpeg">
          <p>果蔬生鲜</p>
        </div>
      </router-link>
      <router-link to="/search">
        <div class="banner-img">
          <img src="../images/slider-pic/slider-pic6.jpeg">
          <p>新店特惠</p>
        </div>
      </router-link>
      <router-link to="/search">
        <div class="banner-img">
          <img src="../images/slider-pic/slider-pic7.jpeg">
          <p>准时达</p>
        </div>
      </router-link>
      <router-link to="/search">
        <div class="banner-img">
          <img src="../images/slider-pic/slider-pic8.jpeg">
          <p>夜宵</p>
        </div>
      </router-link>
    </div>
    <!-- 商品列表  -->
    <div class="main-list">
      <h3>推荐商家</h3>
      <div>
        <OneBusiness v-for="item in falseBussinessbrief" :val="item"></OneBusiness>
      </div>
    </div>
  <!-- 底部导航 -->
    <FixBottom></FixBottom>
  </div>
</template>
<script>
import OneBusiness from './OneBusiness'
import FixBottom from './FixBottom'
import {
  mapState
} from 'vuex'

export default {
  name: 'main',
  components: {
    OneBusiness,
    FixBottom
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapState([
      'isLogin',
      'falseHotWord',
      'falseBussinessbrief'
    ])
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
