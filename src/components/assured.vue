<template>
  <section class="assured">
    <!-- 被投保人信息  -->
    <div class="am-list am-list-6lb form">
      <div class="form-header">
        被投保人信息
        <span class="xt-boutton" @click="rsChanged">同投保人</span>
      </div>
      <div class="am-list-body">
        <app-input label="姓名">
          <input slot="input" type="text" placeholder="请填写投保人姓名" v-model="assured.name" @change="changeName">
          <div slot="icon" class="am-list-clear" v-show="assured.name != '' "><i class="am-icon-clear am-icon" @click="assured.name = ''"></i></div>
        </app-input>
        <app-input label="年龄">
          <input slot="input" type="text" placeholder="请填写投保人年龄" v-model="assured.age" @change="changeName">
          <div slot="icon" class="am-list-clear" v-show="assured.age != '' "><i class="am-icon-clear am-icon" @click="assured.age = '' "></i></div>
          <div slot="icon" class="am-list-data">
            <span><i class="iconfont icon-rili"></i>出生日期</span>
            <input class="weui-input" type="date" placeholder="生日" value="生日" @change="appBdaySelect()" v-model="assured.bday">
          </div>
        </app-input>
        <app-input label="性别">
          <div class="am-ft-left" slot="input">
            <label class="radio sex-radio">
              <div class="am-checkbox">
                <input type="radio" name="assured" checked="checked" value="true" v-model="assured.sex">
                <span class="icon-check" aria-hidden="true" style="top: -6px"></span>
              </div>
              <span>男</span>
            </label>
            <label class="radio sex-radio">
              <div class="am-checkbox">
                <input type="radio" name="assured" value="false" v-model="assured.sex">
                <span class="icon-check" aria-hidden="true" style="top: -6px;"></span>
              </div>
              <span>女</span>
            </label>
          </div>
        </app-input>
      </div>
    </div>
    <!-- 被投保人信息  -->
  </section>
</template>
<script>
import Bus from '.././widgets/bus.js'
export default {
  name: 'assured',
  props: {
    planAddLen: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      assured: {
        name: '',
        age: '',
        sex: true,
        bday: ''
      }
    }
  },
  methods: {
    //更改性别
    changeSex() {
      this.sex = this.assured.sex ? '男' : '女'
      this.changeBus()
    },
    //更改出生日期
    appBdaySelect() {
      const myday = new Date()
      const mydayTime = myday.getTime()
      const bdayTime = new Date(this.assured.bday).getTime()
      const fearTime = (mydayTime - bdayTime) / 1000
      const fear = parseInt(fearTime / (60 * 60 * 24 * 365))
      this.assured.age = fear
    },
    // 更改投保人关系
    rsChanged() {
      this.message = this.$parent.$parent.applicant
      this.assured.name = this.message.name
      this.assured.age = this.message.age
      this.assured.sex = this.message.sex
      this.sex = this.assured.sex ? '男' : '女'
      this.changeBus()
    },
    changeName() {
      this.changeBus()
    },
    changeBus() {
      Bus.$emit('get', this.assured)
    }
  }
}
</script>
