<template>
  <section class="insurance">
    <!-- 被投保人信息  -->
    <div class="am-list am-list-6lb form">
      <div class="form-header">
        被投保人信息
        <span class="xt-boutton" @click="rsChanged">同投保人</span>
      </div>
      <div class="am-list-body">
        <app-input label="姓名">
          <input slot="input" type="text" placeholder="请填写投保人姓名" v-model="assured.name">
          <div slot="icon" class="am-list-clear" v-show="assured.name != '' "><i class="am-icon-clear am-icon" @click="assured.name = ''"></i></div>
        </app-input>
        <app-input label="年龄">
          <input slot="input" type="text" placeholder="请填写投保人年龄" v-model="assured.age">
          <div slot="icon" class="am-list-data">
            <span>出生日期</span>
            <input class="weui-input" type="date" placeholder="生日" value="生日">
          </div>
        </app-input>
        <app-input label="性别">
          <div class="am-ft-right" slot="input">
          <span style="float:left;line-height:0.36rem;">{{sex}}</span>
            <div class="am-switch am-sex">
              <input type="checkbox" class="am-switch-checkbox" for="sex" v-model="assured.sex" @change="changeSex">
              <label class="am-switch-label" for="sex">
                <div class="am-switch-inner"></div>
                <div class="am-switch-switch"></div>
              </label>
            </div>
          </div>
        </app-input>
      </div>
    </div>
    <!-- 被投保人信息  -->

    <!-- 险种信息  -->
    <div v-for="products in productsIndex" :id="products">
      <div class="am-list am-list-6lb form products" >
        <div class="form-header" @click="changeProducts">
          {{productsList.name}}
          <span></span>
        </div>
        <div class="am-list-body" v-if="productsList.num">
          <app-select label="公司品牌">
            <select v-model='sc_id' @change="companyChanged">
              <option selected disabled value='0'>请选择</option>
              <option v-for="item in insInfo" v-bind:value="item.sc_id">{{item.company_name}}</option>
            </select>
          </app-select>
          <app-select label="险种">
            <select v-model='insurance.safe_id' @change="insChanged">
              <option selected disabled value='0'>请选择</option>
              <option v-for="item in mainInsurance[sc_id]" v-bind:value="item.safe_id">{{item.name}} </option>
            </select>
          </app-select>
          <app-select label="保险期间" :readonly="mainSyAttr != null && mainSyAttr.length === 1">
            <select v-model='insurance.safe_year' :disabled="mainSyAttr != null && mainSyAttr.length === 1" @change="syChanged">
              <option selected disabled value='0'>请选择</option>
              <option v-for="(item,index) in mainSyAttr" v-bind:value="item">{{item}}</option>
            </select>
          </app-select>
          <app-select label="缴费年限" :readonly="mainPyAttr != null && mainPyAttr.length === 1">
            <select v-model='insurance.pay_year' :disabled="mainPyAttr != null && mainPyAttr.length === 1" @change="pyChanged">
              <option selected disabled value='0'>请选择</option>
              <option v-for="(item,index) in mainPyAttr" v-bind:value="item">{{item}}年交</option>
            </select>
          </app-select>
          <template v-if="sc_id">
            <template v-if="isBaseMoney">
              <app-select label="计划类型" v-if="prospectus_types.length > 0">
                <select v-model.number="prospectus_type" v-if="prospectus_types">
                  <option disabled value='0'>请选择</option>
                  <option v-for="item in prospectus_types" :value="item.value">{{item.name}}</option>
                </select>
              </app-select>
              <app-select label="领取年龄" v-if="insurance.safe_id === '205'">
                <select v-model.number="flag['205']">
                  <option disabled value='0'>请选择</option>
                  <option value="60">60岁</option>
                  <option value="65">65岁</option>
                  <option value="70">70岁</option>
                  <option value="75">75岁</option>
                </select>
              </app-select>
              <app-input label="基本保额" v-if="insurance.safe_id !== '292'" v-show="insurance.safe_id !== '309' && insurance.safe_id !== '280'">
                <input slot="input" v-model.number.lazy="insurance.money" type="number" placeholder="请填写基本保险金额（元）" @change="resetFee">
                <div slot="icon" v-show="insurance.money != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="insurance.money = ''"></i></div>
              </app-input>
              <template v-else>
                <app-select label="投保份数">
                  <select v-model.number="insurance.money" @change="resetFee">
                    <option disabled value="0">请选择份数</option>h
                    <option :value="n" v-for="n in 4">{{n}}</option>
                  </select>
                </app-select>
                <app-input label="基本保额">
                  <div slot="input">{{insurance.money*50000}}</div>
                </app-input>
              </template>
              <app-input label="年缴保费">
                <input slot="input" readonly v-model.number.lazy="insurance.period_money" type="number" placeholder="年缴保费（元）">
                <div slot="button" class="am-list-button">
                  <button type="button" @click="calMoney(true)">点击计算</button>
                </div>
              </app-input>
            </template>
            <template v-else>
              <app-select label="计划类型" v-if="prospectus_types.length > 0">
                <select v-model.number="prospectus_type" v-if="prospectus_types" @change="resetFee">
                  <option disabled value='0'>请选择</option>
                  <option v-for="item in prospectus_types" :value="item.value">{{item.name}}</option>
                </select>
              </app-select>
              <app-input label="年缴保费">
                <input slot="input" v-model.number.lazy="insurance.period_money" type="number" placeholder="请填写年缴保费（元）" @change="resetFee">
                <div slot="icon" v-show="insurance.period_money != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="insurance.period_money = ''"></i></div>
              </app-input>
              <app-input label="基本保额">
                <input slot="input" readonly v-model.number.lazy="insurance.money" type="number" placeholder="基本保险金额（元）">
                <div slot="button" class="am-list-button">
                  <button type="button" @click="calMoney(true)">点击计算</button>
                </div>
              </app-input>
            </template>
          </template>
        </div>
      </div>
      <!-- 险种信息  -->  
    </div>
    <div class="am-button-group">
      <button type="button" class="am-button save" @click="savePlay" v-if="savePlayshow">保存</button>
    </div>
    <div class="am-button-group">
      <button type="button" class="am-button add" @click="addPlay">添加险种</button>
    </div>
  </section>
</template>
<script>
import axios from 'axios'
import qs from 'qs'
const admin_id = '911'

const calMoneyIns = ['74', '182', '290'] //算保费的主险
  // 附加险上线产品
const addonFilter = ['8', '11', '86', '94', '121', '131', '146', '147', '148', '175', '177', '196', '235', '236', '237', '273', '281', '284', '285', '289', '291', '293', '294', '295']
const mustSelected = ['291', '177', '11'] //必须附加的附加险
export default {
  name: 'insurance',
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      init: [], //初始化字段数据
      insInfo: [], //主险信息
      assured: {
        name: '2',
        age: '33',
        sex: true
      },
      sex: '男',
      isBaseMoney: true, //输入保额
      mainInsurance: [], //主险信息
      mainSafe_year: '', //主险
      mainPay_year: '', //主险
      mainPyAttr: null,
      mainSyAttr: null,

      prospectus_types: [], //计划书类型
      prospectus_type: 0, //选择的计划书类型
      flag: {}, //试算特殊参数
      cache: {
        base_money148: '',
        base_money295: '',
        quota147: ''
      }, //数据缓存
      addonsSelected: {}, //附加险投保状态
      showAddonIns: [], //附加险信息
      addonFilter: addonFilter, //附加险过滤
      //insFilter: insFilter, //主险过滤
      Addons: [], //附加险可选信息
      addonRes: {}, //附加险返回信息
      addonIns: {}, //附加险险种信息
      samePerson: false, //投被保人为同人
      sc_id: '0',
      insurance: {
        name: '',
        safe_id: '0', //险种
        safe_year: '0', //保险期间
        pay_year: '0', //交费年期
        money: '', //基本保险金额
        period_money: '' //年交保费
      },
      productsList: {
        num: 1,
        name: '险种信息'
      },
      productsIndex: [1], //险种信息个数
      savePlayshow: true, //保存按钮
      dataArr: [], //已添加的险种
      arr: []
    }
  },
  created() {
    var vm = this
    axios.get('http://cloud.ehuimeng.com/Prospectus/GetConf?uid=911')
      .then(function(response) {
        vm.init = response.data.data
        vm.insInfo = response.data.data.company
        vm.mainInsurance = response.data.data.main
        vm.Addons = response.data.data.children
      })
      .catch(function(error) {
        console.log(error)
      })
  },
  methods: {
    //更改性别
    changeSex() {
      this.sex = this.assured.sex ? '男' : '女'
    },
    changeProducts() {
      if (this.productsList.num && this.dataArr.length > 0) {
        this.productsList.num = false
      } else {
        this.productsList.num = true
      }
    },
    //更改保险公司
    companyChanged() {
      this.resetIns()
      if (!this.checkAppl()) {
        return false
      }
      if (!this.checkAssu()) {
        return false
      }
    },
    // 重置主险
    resetIns() {
      this.insurance = {
        safe_id: '0', //险种
        safe_year: '0', //保险期间
        pay_year: '0', //交费年期
        money: '', //基本保险金额
        period_money: '' //年交保费
      }
      this.prospectus_type = 0
      this.resetFee()
    },
    // 重置主险费用及附加险
    resetFee() {
      this.isBaseMoney ? this.insurance.period_money = '' : this.insurance.money = ''
      this.resetAddon()
    },
    // 更改险种
    insChanged() {
      const safeid = this.insurance.safe_id
      console.log(this.Addons[safeid])
        // console.log(this.mainInsurance[this.sc_id])
      for (var i in this.mainInsurance[this.sc_id]) {
        if (this.mainInsurance[this.sc_id][i].safe_id === safeid) {
          this.insurance.name = this.mainInsurance[this.sc_id][i].name
        }
      }
      console.log(this.insurance.name)
        // 计划类型
      if (safeid === '74') {
        this.prospectus_types = [{
          value: 'educate',
          name: '领取版'
        }, {
          value: 'asset',
          name: '财富传承'
        }]
      } else if (safeid === '172') {
        this.prospectus_types = [{
          value: 'pasture',
          name: '个人养老'
        }, {
          value: 'educate',
          name: '成长教育'
        }, {
          value: 'asset',
          name: '财富传承'
        }]
      } else if (safeid === '280') { //平安e生保
        this.prospectus_types = [{
          value: '100',
          name: '有社保100万'
        }, {
          value: '300',
          name: '有社保300万'
        }, {
          value: '1100',
          name: '无社保100万'
        }, {
          value: '1300',
          name: '无社保300万'
        }]
      } else if (safeid === '309') { //安联无忧
        this.prospectus_types = [{
          value: '1',
          name: '计划一'
        }, {
          value: '2',
          name: '计划二'
        }, {
          value: '3',
          name: '计划三'
        }]
      } else {
        this.prospectus_types = []
      }

      if (safeid === '205') { //尊享岁月
        this.flag[safeid] = 0 //领取年龄
      }

      //保障期间
      if (safeid === '4' || safeid === '6') {
        this.mainSyAttr = ['30年']
      } else if (safeid === '8') {
        this.mainSyAttr = ['66', '77', '88']
      } else if (safeid === '172') {
        this.mainSyAttr = ['100']
      } else if (safeid === '182') {
        this.mainSyAttr = ['100']
      } else if (safeid === '205') {
        this.mainSyAttr = ['106']
      } else if (safeid === '280' || safeid === '309') {
        this.mainSyAttr = ['1年']
      } else if (safeid === '292') {
        this.mainSyAttr = ['30', '75']
      } else if (safeid === '316') {
        this.mainSyAttr = ['30']
      } else if (safeid === '318') {
        this.mainSyAttr = ['30', '80']
      } else {
        this.mainSyAttr = ['终身']
      }
      if (this.mainSyAttr.length === 1) {
        this.insurance.safe_year = this.mainSyAttr[0]
        this.syChanged()
      } else {
        this.insurance.safe_year = '0'
      }
      //缴费年限
      if (safeid === '4') {
        this.mainPyAttr = ['1', '5', '10', '20']
      } else if (safeid === '6') {
        this.mainPyAttr = ['5', '10']
      } else if (safeid === '8') {
        this.mainPyAttr = ['3', '5', '10', '20', '30']
      } else if (safeid === '74') {
        this.mainPyAttr = ['1', '3', '5', '8', '10']
      } else if (safeid === '130') {
        this.mainPyAttr = ['1', '5', '10', '15', '20']
      } else if (safeid === '172') {
        this.mainPyAttr = ['1', '3', '5', '10']
      } else if (safeid === '165') {
        this.mainPyAttr = ['1', '3', '5', '10', '15', '19', '20']
      } else if (safeid === '210') {
        this.mainPyAttr = ['20']
      } else if (safeid === '272') {
        this.mainPyAttr = ['5', '10', '15', '20']
      } else if (safeid === '280' || safeid === '309') {
        this.mainPyAttr = ['1']
      } else if (safeid === '283') {
        this.mainPyAttr = ['5', '10', '15', '20', '30']
      } else if (safeid === '288') {
        this.mainPyAttr = ['10', '15', '20']
      } else if (safeid === '290') {
        this.mainPyAttr = ['1', '3', '5', '10']
      } else if (safeid === '292') {
        this.mainPyAttr = ['1', '5', '10']
      } else if (safeid === '316') {
        this.mainPyAttr = ['10']
      } else if (safeid === '318') {
        this.mainPyAttr = ['1', '3', '5', '10']
      } else if (safeid === '165') {
        this.mainPyAttr = ['1', '3', '5', '10', '15', '19', '20']
      } else {
        this.mainPyAttr = ['1', '3', '5', '10', '15', '20']
      }
      if (this.mainPyAttr.length === 1) {
        this.insurance.pay_year = this.mainPyAttr[0]
        this.pyChanged()
      } else {
        this.insurance.pay_year = '0'
      }

      //保费、保额
      if (safeid === '292') {
        this.insurance.money = 0
      } else if (safeid === '280' || safeid === '309') { //平安e生保，安联无忧
        this.insurance.money = 1
      } else {
        this.insurance.money = ''
      }
      this.insurance.period_money = ''

      // 部分险种输入 保额， 算保费
      this.isBaseMoney = calMoneyIns.indexOf(safeid) === -1
      console.log(this.isBaseMoney)
    },
    // 更改保障期间
    syChanged() {
      this.resetFee()
    },
    //更改缴费期间
    pyChanged() {
      this.resetFee()
    },
    // 更改投保人关系
    rsChanged() {
      this.assured.name = this.message.name
      this.assured.age = this.message.age
      this.assured.sex = this.message.sex
    },
    // 校验关系
    checkRS() {
      if (this.message.name === this.assured.name && this.message.sex === this.assured.sex && this.message.age === this.assured.age) {
        // 3要素相同
        this.samePerson = true
        console.log('被保险人和投保人为同一人')
      }
    },
    // 更改附加险状态
    chAddonState(index) {
      if (this.uploading) {
        this.$toast.show('您手速过快，请慢点操作')
        this.addonsSelected[index] = !this.addonsSelected[index]
        this.$forceUpdate()
        return false
      }
      console.log(this.addonsSelected[index])
      this.checkRS()
      var toastText = null
      if (this.addonsSelected[index]) {
        // 主险保费校验不合格
        if (!this.checkMainFee(this.insurance.safeid)) {
          this.addonsSelected[index] = false
          this.$forceUpdate()
          return false
        }
        var flag = this.flag[index]
        var period_money = this.insurance.period_money
        var addonPeriod_money = this.addonIns[index] && this.addonIns[index].period_money
        // this.log({
        //   flag,
        //   period_money,
        //   addonPeriod_money
        // }, STRING)

        switch (this.insurance.safe_id) {
          case '288':
            if (['295', '294', '293'].indexOf(index) > -1) {
              if (this.insurance.money < 250000) {
                toastText = '主险保额小于25万元时不可附加该险种'
              }
            }
            break
          case '290':
            if (['295', '294', '293'].indexOf(index) > -1) {
              if (this.mainPay_year === 10 || this.insurance.period_money < 10000) {
                toastText = '主险缴费期为 10年，且期交保费 1 万及以上方可附加'
              } else if (this.insurance.period_money < 20000 || [3, 5].indexOf(this.mainPay_year) === -1) {
                toastText = '主险缴费期为 3 年、5 年，且期交保费 2 万及以上方可附加'
              }
            }
            break
          case '292':
            if (['295', '294', '293'].indexOf(index) > -1) {
              if (this.insurance.money * 50000 < 200000) {
                toastText = '主险保额小于20万元时不可附加该险种'
              }
            }
            break
          default:
            break
        }

        switch (index) {
          case '295': // 恒祥
            if (toastText) break
            if (!this.cache.base_money295) {
              toastText = '请先输入保险金额'
            } else if (this.cache.base_money295 < 50 || this.cache.base_money295 > 100 || this.cache.base_money295 % 10 !== 0) {
              toastText = '保险金额范围50-100元，且为10的整数'
            }
            break
          case '294': //恒顺
            if (toastText) break
            var extraMoney = flag > 50000 ? flag.toString().substr(1) : flag
            if (!flag) {
              toastText = '请先选择保险金额'
            } else if (extraMoney > this.insurance.period_money * this.mainPay_year * 0.2 && this.insurance.safe_id === '290') {
              //主险--金财D
              toastText = '该附加险保额不超主合同总保费（期交保费*缴费年限）*20%'
            } else if (extraMoney > this.insurance.money * 0.2 && this.insurance.safe_id === '288') {
              // 恒久健康
              toastText = '该附加险保额不能大于主险保额的20%'
            } else if (extraMoney > this.insurance.money * 50000 * 0.2 && this.insurance.safe_id === '292') {
              //千万护航
              toastText = '该附加险保额不能大于主险保额的20%'
            }
            break
          case '291': //金管家D款
            if (toastText) break
            if (addonPeriod_money === '') {
              toastText = '年缴保费不能为空'
            } else if (addonPeriod_money !== 0 && addonPeriod_money % 1000 !== 0) {
              toastText = '年缴保费为1000元整数倍，可为0'
            } else if (addonPeriod_money > this.insurance.period_money * this.mainPay_year) {
              toastText = '该附加险保费不能超过主险总保费'
            }
            if (toastText) {
              setTimeout(() => {
                this.addonIns[index].period_money = ''
                this.$forceUpdate()
              }, 2000)
            }
            break
          case '281':
            if (this.samePerson) {
              toastText = '投被保人为同人时不可附加该险种'
            } else if (this.mainPay_year === 1) {
              toastText = '主险趸交不可附加该险种'
            }
            break
          case '196':
            if (period_money < 1000) {
              toastText = '主险年交保费小于1000元不可附加该险种'
            }
            break
          case '273':
          case '175':
            if (flag === 0) {
              toastText = '请先选择计划'
            }
            break
          case '148':
            if (!this.cache.base_money148) {
              toastText = '请先输入保险金额'
            } else if (this.cache.base_money148 < 50000 || this.cache.base_money148 > 3000000) {
              toastText = '保险金额范围为5万~300万'
            } else if (this.cache.base_money148 > this.insurance.money * 5) {
              toastText = '保额不得超过主险保额的5倍'
            } else if (flag === 0) {
              toastText = '请先选择职业分类'
            }
            break
          case '147':
            if (period_money < 1000) {
              toastText = '主险年交保费小于1000元不可附加该险种'
            } else if (period_money <= 3000 && (this.cache.quota147 < 2 || this.cache.quota147 > 10)) {
              toastText = '主险保费对应份额为2-10份'
            } else if (this.cache.quota147 < 2 || this.cache.quota147 > 30) {
              toastText = '主险保费对应份额为2-30份'
            }
            break
          case '146':
            if (flag === 0) {
              toastText = '请先选择保险金额'
            }
            break
          case '131':
          case '86': //附加豁免保险费重疾保险
          case '285': //附加豁免保险费重大疾病保险
          case '284': //附加豁免保险费定期寿险
            if (this.samePerson) {
              toastText = '投被保人为同人时不可附加该险种'
            }
            break
          case '121':
            if (period_money < 3000) {
              toastText = '主险年交保费小于3000元不可附加该险种'
            }
            break
          case '235': //附加住院费用医疗（非社保型）
            if (this.warranty.assu_social_security === '15046') {
              toastText = '有社保不可附加该险种'
            } else if (flag === 0) {
              toastText = '请先选择保险金额'
            }
            break

          case '236': //附加住院费用医疗（社保型）
            if (this.warranty.assu_social_security === '15047') {
              toastText = '没有社保不可附加该险种'
            } else if (flag === 0) {
              toastText = '请先选择保险金额'
            }
            break
          case '237': //附加住院费用医疗（社保型）
            if (flag === 0) {
              toastText = '请先选择保险金额'
            }
            break
        }
        if (toastText) {
          this.$toast.show(toastText)
          if (mustSelected.indexOf(index) === -1) {
            this.addonsSelected[index] = false
            // this.log(toastText, INFO)
            this.$forceUpdate()
          }
          return
        } else {
          // this.log('选择附加险 ID: ' + index + (this.flag[index] ? ' Flag: ' + this.flag[index] : ''), INFO)
          if (index !== '291') {
            this.calMoney(false, index) // 试算附加险
          }
        }
      } else {
        if (mustSelected.indexOf(index) > -1) {
          toastText = '该附加险必须附加，不能取消'
          this.$toast.show(toastText)
          // this.log(toastText + 'ID: ' + index, INFO)
          this.addonsSelected[index] = true
          this.$forceUpdate()
          return
        }
        // this.log('取消选择附加险 ID: ' + index, INFO)
      }
    },
    // 重置附加险默认信息
    resetAddon() {
      // this.log('重置附加险默认信息', INFO)
      var safeid = this.insurance.safe_id
      if (safeid === '288' || safeid === '290' || safeid === '292') {
        this.flag[294] = 0
      } else if (safeid === '283') {
        this.flag[146] = 0
        this.flag[147] = 2000
        this.cache.quota147 = 2
        this.flag[148] = 0
        this.cache.base_money148 = 0
      } else if (safeid === '272') {
        this.flag[273] = 0
      } else if (safeid === '130') {
        this.flag[175] = 1
      } else if (safeid === '165' || safeid === '319') {
        this.flag[235] = 0
        this.flag[236] = 0
        this.flag[237] = 0
      }
      this.addonsSelected = {}
      for (let i in this.Addons) {
        if (mustSelected.indexOf(i) > -1) {
          this.addonsSelected[i] = true
        }
      }
      this.addonRes = {}
    },
    // 更新附加险
    setAddon(safeid) {
      // this.log('更新附加险', INFO)
      if (['175', '131', '121'].indexOf(safeid) > -1) {
        this.addonIns[safeid].period_money = this.addonRes[safeid]['年缴保费(元)']
      }
      if (['11', '86', '94', '146', '147', '148', '177', '181', '196', '235', '236', '237', '273', '281', '284', '285', '289', '293', '294', '295'].indexOf(safeid) > -1) {
        this.addonIns[safeid].period_money = this.addonRes[safeid]['年缴保费']
      }
      // this.log(this.addonIns[safeid], STRING)
    },
    // 更新附加险Flag
    flagChanged(index) {
      // this.log('更新附加险Flag， ID:' + index, INFO)
      this.addonRes[index] = null
      this.addonsSelected[index] = false
      if (index === '147') {
        if (this.cache.quota147 < 2 || this.cache.quota147 > 30) {
          this.$toast.show()
        }
        this.flag[index] = this.cache.quota147 * 1000
      }
      this.$forceUpdate()
    },
    // 校验投保人
    checkAppl() {
      var toastText = null
      if (!this.message.name) {
        toastText = '投保人姓名不能为空'
      } else if (!this.message.age) {
        toastText = '投保人年龄不能为空'
      }
      if (toastText) {
        // this.log(toastText, INFO)
        this.sc_id = '0'
        this.$toast.show(toastText)
        return false
      }
      return true
    },
    // 校验被保险人
    checkAssu() {
      var toastText = null
      if (!this.assured.name) {
        toastText = '被保人姓名不能为空'
      } else if (!this.assured.age) {
        toastText = '被保人年龄不能为空'
      }
      if (toastText) {
        this.sc_id = '0'
        this.$toast.show(toastText)
        return false
      }
      return true
    },
    // 校验主险
    checkMainForm() {
      //this.log('校验主险', INFO)
      const safeid = this.insurance.safe_id
      let toastText = null
      if (!this.checkAppl()) {
        return false
      }
      if (!this.checkAssu()) {
        return false
      }
      console.log(this.sc_id)
      if (this.sc_id === '0') {
        toastText = '请选择公司'
      } else if (this.insurance.safe_id === '0') {
        toastText = '请选择主险'
      } else if (this.insurance.safe_year === '0') {
        toastText = '请选择主险保险期间'
      } else if (this.insurance.pay_year === '0') {
        toastText = '请选择主险交费期间'
      } else if (safeid === '205' && !this.flag[safeid]) {
        toastText = '请选择主险领取年龄'
      } else if (this.isBaseMoney && !this.insurance.money) {
        console.log(this.insurance.money)
        toastText = '请输入主险基本保额'
      } else if (!this.isBaseMoney && !this.insurance.period_money) {
        toastText = '请输入主险年缴保费'
      } else if (this.prospectus_types.length > 0 && this.prospectus_type === 0) {
        toastText = '请选择计划类型'
      }
      if (toastText) {
        this.$toast.show(toastText)
          //this.log(toastText, INFO)
        return false
      }
      return true
    },
    // 校验主险投保年龄
    checkMainAge(safeid) {
      var assu_age = this.assured.age
      var payOverage = this.safe_year + assu_age //期满年龄
      var mainPay_year = this.pay_year01
      var mainSafe_year = this.safe_year
        // if (assu_day < 30 && this.scid !== '8') {
        //   this.$toast.show('被保人年龄不能小于30天')
        //   return false
        // } else if (assu_day < 28 && this.scid === '8') { // 国华
        //   this.$toast.show('被保人年龄不能小于28天')
        //   return false
        // }

      var toastText = null
      switch (safeid) {
        case '316': // 华宝安行
          if (assu_age > 50) {
            toastText = '被保人年龄不能大于50周岁'
          } else if (assu_age < 18) {
            toastText = '被保人年龄不能小于18周岁'
          }
          break
        case '313': //爱驾宝两全保险(2017)
          if (assu_age > 60) {
            toastText = '被保人年龄不能大于60周岁'
          } else if (assu_age < 18) {
            toastText = '被保人年龄不能小于18周岁'
          } else if (assu_age > 50 && mainSafe_year === 30) {
            toastText = '被保人大于50周岁时,只能选择20年交'
          }
          break
        case '292': // 千万护航两全保险
          if (assu_age < 18 || assu_age > 55) {
            toastText = '被保人年龄范围应在18-55周岁'
          }
          break
        case '290': // 金财人生终身年金保险D款
          if (mainPay_year === 1 && assu_age > 59) {
            toastText = '趸交投保年龄上限为59岁'
          } else if ([3, 5].indexOf(mainPay_year) > -1 && assu_age > 55) {
            toastText = mainPay_year + '年交投保年龄上限为55岁'
          } else if (mainPay_year === 10 && assu_age > 50) {
            toastText = '10年交投保年龄上限为50岁'
          }
          break
        case '288': // 恒久健康终身重大疾病保险2017
          if ([1, 3, 5, 10].indexOf(mainPay_year) > -1 && assu_age > 65) {
            toastText = (mainPay_year === 1 ? '趸交' : mainPay_year + '年交') + '投保年龄上限为65岁'
          } else if (mainPay_year === 15 && assu_age > 60) {
            toastText = '15年交投保年龄上限为60岁'
          } else if (mainPay_year === 20 && assu_age > 55) {
            toastText = '20年交投保年龄上限为55岁'
          }
          break
        case '283': // 御享人生重大疾病保险
          if (mainPay_year === 5 && assu_age > 60) {
            toastText = '被保人年龄不能大于60周岁'
          } else if (mainPay_year === 10 && assu_age > 55) {
            toastText = '被保人年龄不能大于55周岁'
          } else if (mainPay_year === 15 && assu_age > 50) {
            toastText = '被保人年龄不能大于50周岁'
          } else if (mainPay_year === 20 && assu_age > 50) {
            toastText = '被保人年龄不能大于50周岁'
          } else if (mainPay_year === 30 && assu_age > 35) {
            toastText = '被保人年龄不能大于35周岁'
          }
          break
        case '280': //平安e生保
          if (assu_age > 60) {
            toastText = '被保人年龄不能大于60周岁'
          }
          break
        case '272': //盛世年年C款年金保险
          if (assu_age > 60) {
            toastText = '被保人年龄不能大于60周岁'
          }
          break
        case '209': // 信泰人寿：健康100
          if (assu_age > 60) {
            toastText = '被保人年龄不能大于60周岁'
          }
          break
        case '210': // 信泰人寿：健康100(铂金版)
          if (assu_age > 50) {
            toastText = '被保人年龄不能大于50周岁'
          }
          break
        case '205': // 尊享岁月
          if (assu_age > 65) {
            toastText = '被保人年龄不能大于65周岁'
          } else if (payOverage > this.flag[safeid]) {
            toastText = '交费期满被保人年龄不能超过开始领取年龄'
          }
          break
        case '319': // 爱加倍
        case '165': // 爱相随-尊享版
          if (assu_age > 50 && this.mainPay_year > 10) {
            toastText = '被保人年龄不能大于50周岁'
          } else if (assu_age > 55 && this.mainPay_year === 10) {
            toastText = '被保人年龄不能大于55周岁'
          } else if (assu_age > 60 && this.mainPay_year < 10) {
            toastText = '被保人年龄不能大于60周岁'
          }
          break
        case '130': // 乐安康
          if (assu_age > 50 && this.mainPay_year > 10) {
            toastText = '被保人年龄不能大于50周岁'
          } else if (assu_age > 55 && this.mainPay_year === 10) {
            toastText = '被保人年龄不能大于55周岁'
          } else if (assu_age > 60 && this.mainPay_year < 10) {
            toastText = '被保人年龄不能大于60周岁'
          }
          break
        case '74': // 盛世年年
          if (payOverage > 60) {
            toastText = '被保人交费期满不能大于60岁'
          }
          break
        case '86':
          if (assu_age > 55) {
            toastText = '被保人年龄不能大于55周岁'
          }
          break
        case '8': //御立方三号两全保险
          if (this.mainSafe_year === 66) {
            if (this.mainPay_year === 3 && assu_age > 50) {
              toastText = '3年交保障至66周岁时被保人年龄不能大于50周岁'
            } else if (this.mainPay_year === 5 && assu_age > 50) {
              toastText = '5年交保障至66周岁时被保人年龄不能大于50周岁'
            } else if (this.mainPay_year === 10 && assu_age > 45) {
              toastText = '10年交保障至66周岁时被保人年龄不能大于45周岁'
            } else if (this.mainPay_year === 20 && assu_age > 40) {
              toastText = '20年交保障至66周岁时被保人年龄不能大于40周岁'
            } else if (this.mainPay_year === 30 && assu_age > 30) {
              toastText = '30年交保障至66周岁时被保人年龄不能大于30周岁'
            }
          } else if (this.mainSafe_year === 77) {
            if (this.mainPay_year === 3 && assu_age > 55) {
              toastText = '3年交保障至77周岁被保人年龄不能大于55周岁'
            } else if (this.mainPay_year === 5 && assu_age > 55) {
              toastText = '5年交保障至77周岁被保人年龄不能大于55周岁'
            } else if (this.mainPay_year === 10 && assu_age > 50) {
              toastText = '10年交保障至77周岁被保人年龄不能大于50周岁'
            } else if (this.mainPay_year === 20 && assu_age > 45) {
              toastText = '20年交保障至77周岁被保人年龄不能大于45周岁'
            } else if (this.mainPay_year === 30 && assu_age > 35) {
              toastText = '30年交保障至77周岁被保人年龄不能大于35周岁'
            }
          } else if (this.mainSafe_year === 88) {
            if (this.mainPay_year === 3 && assu_age > 60) {
              toastText = '3年交保障至88周岁时被保人年龄不能大于60周岁'
            } else if (this.mainPay_year === 5 && assu_age > 60) {
              toastText = '5年交保障至88周岁时被保人年龄不能大于60周岁'
            } else if (this.mainPay_year === 10 && assu_age > 55) {
              toastText = '10年交保障至88周岁时被保人年龄不能大于55周岁'
            } else if (this.mainPay_year === 20 && assu_age > 45) {
              toastText = '20年交保障至88周岁时被保人年龄不能大于45周岁'
            } else if (this.mainPay_year === 30 && assu_age > 35) {
              toastText = '30年交保障至88周岁时被保人年龄不能大于35周岁'
            }
          }
          break
      }

      if (toastText) {
        // this.log(toastText, INFO)
        this.$toast.show('【' + this.insurance.name + '】' + toastText)
        return false
      }
      return true
    },
    //主险保额校验
    checkMainMoney(safeid) {
      var money = this.insurance.money
      var period_money = this.insurance.period_money
      var assu_age = this.assured.age
      var name = this.insurance.name
      var toastText = null
        //this.log('主险保额校验 ID：' + safeid, INFO)

      switch (safeid) {
        case '319': // 爱加倍
          if (this.mainPay_year === 19) {
            if (money < 100000 || money % 10000 !== 0) {
              toastText = '【' + name + '】19年交最低保额10万元，且为1万元整数倍！'
            }
          } else if (money < 20000 || money % 10000 !== 0) {
            toastText = '【' + name + '】保额最低2万元，且为1万元整数倍'
          }
          break
        case '316': // 华宝安行
          if (money < 50000 || money % 50000 !== 0) {
            toastText = '【' + name + '】最低保额为5万元，且为5万元整数倍'
          } else if (money > 200000) {
            toastText = '【' + name + '】最高保额为20万元'
          }
          break
        case '314': //百万终身护理保险
          if (money < 3000 || money % 1000 !== 0) {
            toastText = '【' + name + '】保额最低3千元，且为千元整数倍'
          } else if (money > 500000) {
            toastText = '【' + name + '】保额最高为50万元'
          }
          break
        case '313': //爱驾宝两全保险(2017)
          if (money < 10000 || money % 10000 !== 0) {
            toastText = '【' + name + '】保额最低1万元，且为1万元整数倍'
          }
          break
        case '292': // 千万护航两全保险
          if (!money) {
            toastText = '【' + name + '】50000元/份，1份起售'
          }
          break
        case '290': // 金财人生终身年金保险D款
          if (period_money < 10000) {
            toastText = '【' + name + '】最低年缴保费为1万元'
          } else if (period_money % 1000 !== 0) {
            toastText = '【' + name + '】保费需为1千元整数倍'
          }
          break
        case '288': // 恒久健康终身重大疾病保险2017
          if (money < 10000 || money % 1000 !== 0) {
            toastText = '最低保额为1万元,且为1千元整数倍'
          }
          break
        case '283': // 御享人生重大疾病保险
          if (money < 50000) {
            toastText = '【' + name + '】最低保额为5万元'
          }
          break
        case '272': //盛世年年C款年金保险
          if (money < 150000 || money % 10000 !== 0) {
            toastText = '【' + name + '】最低保额为15万元，且为1万元整数倍'
          }
          break
        case '209': //信泰人寿：健康100
          if (money < 50000 || money % 10000 !== 0) {
            toastText = '该主险最低保额为5万元，且为1万元整数倍'
          }
          break
        case '210': // 信泰人寿：健康100(铂金版)
          if (money < 300000 || money % 10000 !== 0) {
            toastText = '该主险最低保额为30万元，且为1万元整数倍'
          }
          break
        case '205': // 泰康：尊享岁月分红型
          if (money % 1000 !== 0) {
            toastText = '该主险保额应为1000元的整数倍'
          }
          break
        case '165': // 爱相随-尊享版
          if (assu_age >= 18 && money > 1000000) {
            toastText = '【' + name + '】成年人最高保额为100万元'
          } else if (assu_age < 18 && money > 500000) {
            toastText = '【' + name + '】未成年人最高保额为50万元'
          } else if (this.mainPay_year === 19) {
            if (money < 300000 || money % 10000 !== 0) {
              toastText = '【' + name + '】19年交最低保额30万元，且为1万元整数倍！'
            }
          } else if (money < 50000 || money % 10000 !== 0) {
            toastText = '【' + name + '】保额最低5万元，且为1万元整数倍'
          }
          break
        case '130': // 乐安康
          if (money < 50000 || money % 10000 !== 0) {
            toastText = '该主险最低保额为5万元，且为1万元整数倍！'
          }
          break
        case '74': // 盛世年年
          if (this.mainPay_year === 1) {
            if (period_money < 10000 || period_money % 1000 !== 0) {
              toastText = '趸交的最低保费为1万元,且以千元递增！'
            }
          } else if (period_money < 5000 || period_money % 1000 !== 0) {
            toastText = '最低年缴保费为5千元,且以千元递增'
          }
          break
        case '8': // 御立方三号两全保险
          if (money < 10000) {
            toastText = '该主险最低保额为1万元'
          }
          break
      }
      if (toastText) {
        // this.log(toastText, INFO)
        this.$toast.show(toastText)
        return false
      }
      return true
    },
    //主险保费校验
    checkMainFee(safeid) {
      var toastText = null
      var period_money = this.insurance.period_money

      if (this.isBaseMoney && !this.insurance.period_money) {
        toastText = this.insurance.period_money === 0 ? '超出费率表计算范围，无法投保' : '请计算主险年缴保费'
      } else if (!this.isBaseMoney && !this.insurance.money) {
        toastText = this.insurance.money === 0 ? '超出费率表计算范围，无法投保' : '请计算主险基本保额'
      }
      if (toastText) {
        // this.log(toastText, STRING)
        this.$toast.show(toastText)
        return false
      }

      switch (safeid) {
        case '8': //御立方三号两全保险
          if (period_money < 1000) {
            toastText = '该主险最低年缴保费为1000元'
          }
          break
        case '283': //御享人生重大疾病保险
          if (period_money < 1000) {
            toastText = '该主险最低年缴保费为1000元'
          }
          break
        case '205': //尊享岁月养老年金保险（分红型）
          if (this.mainPay_year === 15 || this.mainPay_year === 20) {
            if (period_money < 150000) {
              toastText = '【' + name + '】15、20最低年交保费15万元'
            }
          } else {
            if (period_money < 200000) {
              toastText = '该交费期间最低年交保费20万元'
            }
          }
          break
      }
      if (toastText) {
        // this.log(toastText, INFO)
        this.$toast.show(toastText)
        setTimeout(() => {
          this.insurance.period_money = ''
        }, 2000)
        return false
      }
      return true
    },
     // 校验附加险投保年龄
    checkExtraAge(safeid) {
      var assu_age = this.assured.age
      var appl_age = this.message.age
      var payOverage = this.insurance.pay_year - 1 + appl_age //期满年龄
      var toastText = null
      // this.log('投保人年龄：' + appl_age + '被保人年龄：' + assu_age, INFO)

      // if (assu_day < 30) {
      //   this.$toast.show('被保人年龄不能小于30天')
      //   return false
      // }
      switch (safeid) {
        case '121':
          if (assu_age > 55) {
            toastText = '被保人年龄不能大于55周岁'
          }
          break
        case '131':
          if (appl_age > 69) {
            toastText = '被豁免合同投保人年龄不能大于69周岁'
          }
          break
        case '148':
          if (assu_age > 70) {
            toastText = '被保人年龄不能大于70周岁'
          }
          break
        case '146':
        case '147':
        case '175':
        case '196':
        case '281':
          if (appl_age > 68) {
            toastText = '被豁免合同投保人年龄不能大于68周岁'
          }
          break
        case '235':
        case '236':
        case '237':
        case '273':
          if (assu_age > 60) {
            toastText = '被保人年龄不能大于60周岁'
          }
          break
        case '285':
          if (appl_age > 60 || payOverage > 75) {
            toastText = '投保人年龄不能大于60周岁,且期满年龄不能大于75岁'
          }
          break
        case '293': // 尊享安康
          if (assu_age > 65) {
            toastText = '被保人年龄不能大于65周岁'
          }
          break
        case '294': // 恒顺
          if (assu_age > 65) {
            toastText = '被保人年龄不能大于65周岁'
          }
          break
        case '295': // 恒祥
          if (assu_age > 65) {
            toastText = '被保人年龄不能大于65周岁'
          }
          break
      }

      if (toastText) {
        // this.log(toastText, INFO)
        this.$toast.show(toastText)
        return false
      }
      return true
    },
    //计算
    calMoney(isMain, addonSafeid = 0) {
      if (this.uploading) {
        this.$toast.show('请勿连续点击！')
        return false
      }
      this.uploading = true
      setTimeout(() => {
        this.uploading = false
      }, 1000)
      if (isMain && !this.checkMainForm()) {
        return false
      }
      const safeid = isMain ? this.insurance.safe_id : addonSafeid
      if (!safeid) {
        this.$toast.show('险种ID不正确', 'warn')
        return false
      }
      if (isMain) { // 主险
        if (!this.checkMainAge(safeid)) {
          return false
        }
        if (!this.checkMainMoney(safeid)) {
          return false
        }
      } else { // 附加险
        if (!this.checkExtraAge(safeid)) {
          return false
        }
      }
      var data = {
        admin_id: admin_id,
        applicant: this.message.name,
        appl_sex: this.message.sex ? 1 : 2,
        appl_age: this.message.age,
        assured: this.assured.name,
        assu_sex: this.assured.sex ? 1 : 2,
        assu_age: this.assured.age,
        safe_year: this.insurance.safe_year,
        pay_year: this.insurance.pay_year,
        warranty_year: 1,
        genre: safeid,
        fj: !isMain,
        is_save: 0,
        derate_money: 0,
        need_packet: 0
      }
        // 添加特殊参数
      var filterSafeid = ['74', '182', '290']
      if (filterSafeid.indexOf(safeid) > -1) {
        data = Object.assign(data, {
          assume_rate: '0',
          sa_one: '0',
          fa_one: '0',
          money_one: '0',
          sa_two: '0',
          fa_two: '0',
          money_two: '0',
          sa_three: '0',
          fa_three: '0',
          money_three: '0',
          sa_four: '0',
          fa_four: '0',
          money_four: '0',
          sa_five: '0',
          fa_five: '0',
          money_five: '0',
          sa_six: '0',
          fa_six: '0',
          money_six: '0',
          sa_seven: '0',
          fa_seven: '0',
          money_seven: '0',
          sa_eight: '0',
          fa_eight: '0',
          money_eight: '0',
          sa_night: '0',
          fa_night: '0',
          money_night: '0',
          sa_ten: '0',
          fa_ten: '0',
          money_ten: '0'
        })
      }
      // 计划书类型
      if (this.prospectus_types.length > 0) {
        data.type = this.prospectus_type
      }
      if (safeid === '309' || safeid === '280') {
        data.flag = this.prospectus_type
      }

      // 计算保额还是保费
      if (this.isBaseMoney) {
        data.base_money = this.insurance.money
      } else {
        data.year_fee = this.insurance.period_money
      }

      var py = this.mainPay_year === 1 ? 1 : this.mainPay_year - 1 // 主险缴费期间减一年
      var period_money = this.insurance.period_money
      var money = this.insurance.money
      // 险种参数
      if (safeid === '295') {
        // 恒祥
        data.pay_year = 1
        data.safe_year = 1
        data.base_money = this.cache.base_money295
      } else if (safeid === '294') {
        // 恒顺
        data.pay_year = 1
        data.safe_year = 1
        data.base_money = this.flag[safeid] > 50000 ? this.flag[safeid].toString().substr(1) : this.flag[safeid]
        data.flag = this.flag[safeid]
      } else if (safeid === '293') {
        // 尊享安康
        data.pay_year = 1
        data.safe_year = 1
        data.base_money = 500000
        // data.flag = this.warranty.assu_social_security === '15046' ? 150 : 250
      } else if (safeid === '289') {
        // 附加投保人豁免2017
        data.pay_year = py
        data.safe_year = py
        data.base_money = period_money
      } else if (safeid === '292') {
        data.base_money = money * 50000
      } else if (safeid === '285' || safeid === '284') {
        // 附加豁免保险费重大疾病保险 附加豁免保险费定期寿险
        data.pay_year = py
        data.safe_year = py
        data.base_money = period_money
      } else if (safeid === '281') {
        data.pay_year = this.mainPay_year
        data.safe_year = this.mainPay_year
        data.base_money = period_money
      } else if (safeid === '205') {
        data.flag = this.flag[safeid]
      } else if (safeid === '273') {
        data.pay_year = 1
        data.safe_year = 1
        data.flag = this.flag[safeid]
      } else if (safeid === '235' || safeid === '236' || safeid === '237') {
        data.pay_year = 1
        data.safe_year = 1
        data.base_money = period_money
        data.flag = this.flag[safeid]
      } else if (safeid === '196') { //附加住院津贴医疗保险
        data.pay_year = 1
        data.safe_year = 1
        if (period_money >= 1000 && period_money <= 3000) {
          data.base_money = 1
        } else if (period_money > 3000 && period_money <= 10000) {
          data.base_money = 2
        } else if (period_money > 10000 && period_money <= 20000) {
          data.base_money = 3
        } else if (period_money > 20000 && period_money <= 30000) {
          data.base_money = 5
        } else if (period_money > 30000 && period_money <= 50000) {
          data.base_money = 7
        } else if (period_money > 50000) {
          data.base_money = 10
        }
        data.year_fee = period_money
      } else if (safeid === '177') { //附加御立方三号重大疾病保险-工银
        data.base_money = money
      } else if (safeid === '175') { //附加乐无忧住院医疗保险
        data.pay_year = 1
        data.safe_year = 1
        data.flag = this.flag[safeid]
      } else if (safeid === '148') { //附加综合意外伤害保险
        data.pay_year = 1
        data.safe_year = 1
        data.base_money = this.cache.base_money148
        data.flag = this.flag[safeid]
      } else if (safeid === '147' || safeid === '146') {
        //附加住院费用医疗保险  附加意外伤害医疗B
        data.pay_year = 1
        data.safe_year = 1
        data.base_money = money
        data.year_fee = period_money
        data.flag = this.flag[safeid]
      } else if (safeid === '131') { //附加乐相伴豁免保险费重大疾病保险
        data.pay_year = py
        data.safe_year = py
        data.year_fee = period_money
      } else if (safeid === '121') {
        data.pay_year = 1
        data.safe_year = 1
        data.base_money = 250000
      } else if (safeid === '94') {
        data.base_money = period_money * this.mainPay_year
        data.safe_year = 85
      } else if (safeid === '86') {
        data.pay_year = py
        data.safe_year = py
        data.base_money = period_money
      } else if (safeid === '11') {
        data.safe_year = 999
        data.pay_year = 1
        data.base_money = 0
      }
      var postData = qs.stringify({
        safes: JSON.stringify([data])
      })
      var vm = this
      axios.post('http://cloud.ehuimeng.com/Prospectus/CreateBook3', postData)
        .then(function(response) {
          if (isMain) {
            if (vm.isBaseMoney) {
              vm.insurance.period_money = response.data.data[safeid].main.list[1]['年缴保费']
            } else {
              vm.insurance.money = response.data.data[safeid].base_money
            }
            // this.resetAddon()
            vm.checkMainFee(safeid)
          } else {
            vm.addonRes[safeid] = response.data.data[safeid].main.list[1]
            console.log(vm.addonRes[safeid])
            // vm.setAddon(safeid)
            vm.$forceUpdate()
          }
        })
      this.dataArr.push(data)
      console.log(this.dataArr)
    },
    //保存
    savePlay() {
      if (this.uploading) {
        this.$toast.show('请勿连续点击')
        return false
      }
      this.uploading = true
      setTimeout(() => {
        this.uploading = false
      }, 1000)
      if (this.dataArr.length < 1) {
        this.$toast.show('请先完成当前险种')
        return false
      }
      this.productsList.num = false
      this.productsList.name = this.insurance.name
      this.savePlayshow = false
      console.log('ss')
    },
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

      if (this.savePlayshow) {
        this.$toast.show('请先保存，在添加')
        return false
      }
      var max = this.productsIndex.length
      this.productsIndex.push(max + 1)
      //this.resetIns()
      this.arr.push(this.insurance1)
      console.log(this.arr)
    }
  }
}
</script>
