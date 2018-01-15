<template>
  <section class="FixBottom am-fixed am-fixed-bottom">
   <div>
     <router-link to="/">
       首页
     </router-link>
  </div>
   <div>
     <router-link to="OrderList">
       订单
     </router-link>
   </div>
   <div>
     <router-link to="MyCenter">我的</router-link>
   </div>
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
