<template>
  <section>
    <!-- 被投保人信息  -->
    <app-assured ref="assured" :planAddLen="planAddLen"></app-assured>
    <!-- 被投保人信息  -->
    <!-- 险种组件 -->
    <app-insurance ref="insurace" :key="item" v-for="item in productsIndex" :id="item" :index="item" :planAddLen="planAddLen" :len="productsIndex.length"></app-insurance>
    <!-- 险种组件 -->
    <div class="am-button-group">
      <button type="button" class="am-button add" @click="addPlay"><i class="iconfont icon-tianjia"></i>添加险种</button>
    </div>
  </section>
</template>
<script>
import Assured from './Assured'
import Insurance from './Insurance'
import Bus from '.././widgets/bus.js'
export default {
  name: 'plan',
  props: {
    index: {
      type: Number,
      required: true
    }
  },
  components: {
    'app-assured': Assured,
    'app-insurance': Insurance
  },
  data() {
    return {
      assured: {},
      productsIndex: [1], //险种信息个数
      planAddLen: '', //当前保险计划
      savefl: false //先保存后才可以添加新的
    }
  },
  created() {
    this.planAddLen = this.index
    Bus.$on('getsavefl', savefl => {
      this.savefl = savefl
    })
    Bus.$on('get', assured => {
      if (!this.assured.name) {
        this.assured = assured
      }
    })
  },
  methods: {
    //添加险种
    addPlay() {
      if (this.uploading) {
        this.$toast.show('请勿连续点击')
        return false
      }
      this.uploading = true
      setTimeout(() => {
        this.uploading = false
      }, 1000)
      console.log(this.savefl)
      if (!this.savefl) {
        this.$toast.show('请先保存当前险种')
      } else {
        var max = this.productsIndex.length
        this.productsIndex.push(max + 1)
        this.savefl = false
        Bus.$emit('getsavefl', this.savefl)
      }
    }
  }

}
</script>
