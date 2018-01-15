<template>
  <div class="MyCenter">
    <FixHeader title="个人中心"></FixHeader>
    <div class="am-list am-list-twoline">
      <div class="am-list-body">
        <a class="am-list-item am-list-moreline">
          <div class="am-list-thumb"><img src="https://os.alipayobjects.com/rmsportal/OhSzVdRBnfwiuCK.png" alt=""></div>
          <div class="am-list-content">
            <div class="am-list-title">{{usename}}</div>
            <div class="am-list-brief">123****2222</div>
          </div>
        </a>
      </div>
    </div>
    <div>
      <div></div>
    </div>
    <!-- 底部导航 -->
    <FixBottom></FixBottom>
  </div>
</template>

<script>
import FixBottom from './FixBottom'
import FixHeader from './header'
export default {
  name: 'MyCenter',
  components: {
    FixBottom,
    FixHeader
  },
  data() {
    return {
      usename: 'baihao'
    }
  },
  mounted() {
    if (!this.$store.state.isLogin) {
      this.$router.replace('/Login')
    }
  }
}
</script>
