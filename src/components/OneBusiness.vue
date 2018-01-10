<template>
  <router-link to='/search'>
    <section>
     <div class="am-list am-list-twoline">
      <div class="am-list-body">
        <div class="am-list-item am-list-item-indent line-twoline">
          <div class="am-list-thumb">
            <img src="../images/shop-logo.png" alt="">
          </div>
          <div class="am-list-content">
            <div class="am-list-title"><span class="pinpai">品牌</span>{{val.shop_name}}</div>
            <div class="am-list-brief">内容一</div>
          </div>
          <div class="am-list-extra">
            <div class="am-list-title">标题二</div>
            <div class="am-list-brief">内容一</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</router-link>
</template>
<script>
export default {
  name: 'oneBusiness',
  props: ['val'],
  data () {
    return {

    }
  }
}

</script>
