<template>
  <section class="FixBottom am-fixed am-fixed-bottom">
   <div>
    <svg v-if="returnPageNow == 'homepage'">
      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#index.18edf5a"></use>
    </svg>
    首页
  </div>
   <div>订单</div>
   <div>我的</div>
  </section>
</template>
<script>
export default {
  name: 'FixBottom',
  data() {
    return {
    }
  }
}
</script>
