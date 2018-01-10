<template>
  <section class="insurance">
    <!-- 险种信息  -->
    <div>
      <div class="am-list am-list-6lb form products">
        <div class="form-header" @click="changeProducts(index)" >
          {{productsList.name}}
          <span class="icon" :class="{'on':productsList.num==true}"></span>
        </div>
        <div class="am-list-body" v-show="productsList.num">
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
              <option selected disabled value='00'>请选择</option>
              <option v-for="(item,index) in mainSyAttr" v-bind:value="item" v-if="item < 50 && item > 0">{{item}}年</option>
              <option v-for="(item,index) in mainSyAttr" v-bind:value="item" v-if="item > 50">至{{item}}岁</option>
              <option v-for="(item,index) in mainSyAttr" v-bind:value="item" v-if="item === '0'">终身</option>
            </select>
          </app-select>
          <app-select label="缴费年限" :readonly="mainPyAttr != null && mainPyAttr.length === 1">
            <select v-model='insurance.pay_year' :disabled="mainPyAttr != null && mainPyAttr.length === 1" @change="pyChanged">
              <option selected disabled value='0'>请选择</option>
              <option v-for="(item,index) in mainPyAttr" v-bind:value="item">{{item}}年交</option>
            </select>
          </app-select>
          <template v-if="sc_id">
          <!-- 输入保额算保费 -->
            <template v-if="isBaseMoney&&!fuBaseMoney">
              <app-select label="计划类型" v-if="prospectus_types.length > 0">
                <select v-model.number="prospectus_type" v-if="prospectus_types" @change="resetFee">
                  <option disabled value='0'>请选择</option>
                  <option v-for="item in prospectus_types" :value="item.value">{{item.name}}</option>
                </select>
              </app-select>
              <app-select label="领取年龄" v-if="insurance.safe_id === '205'">
                <select v-model.number="flag['205']" @change="resetFee">
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
            <!-- 输入保额算保费 -->
            <!-- 泰康乐行天下 -->
            <template v-else-if="isBaseMoney&&fuBaseMoney">
              <app-input label="基本保额">
                <input slot="input" readonly v-model.number.lazy="insurance.money" type="number" placeholder="完善附加险再计算">
              </app-input>
              <app-input label="年缴保费" >
                <input slot="input" readonly v-model.number.lazy="insurance.period_money" type="number" placeholder="完善附加险再计算">
                 <div slot="button" class="am-list-button">
                  <button type="button" @click="calMoney(true)">点击计算</button>
                </div>
              </app-input>
            </template>
            <!-- 泰康乐行天下 -->
            <!-- 输入保费算保额 -->
            <template v-else>
              <app-select label="计划类型" v-if="prospectus_types.length > 0">
                <select v-model.number="prospectus_type" v-if="prospectus_types" @change="resetFee">
                  <option disabled value='0'>请选择</option>
                  <option v-for="item in prospectus_types" :value="item.value">{{item.name}}</option>
                </select>
              </app-select>
              <app-select label="领取年龄" v-if="insurance.safe_id === '352'">
              <!-- 中国人保尊赢人生 -->
                <select v-model.number="flag['352']" @change="resetFee">
                  <option disabled value='0'>请选择</option>
                  <option value="60">60岁</option>
                  <option value="80">80岁</option>
                </select>
              </app-select>
              <app-input label="年缴保费" >
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
            <!-- 输入保费算保额 -->
          </template>
        </div>
      </div>
      <!-- 险种信息  -->
      <!-- <div class="app-form-header">附加险</div> -->
      <app-dropdown :ref="'applicant_'+item.safe_id" v-for="item,index in Addons[insurance.safe_id]" :key="item.safe_id" :id="'fj'+item.safe_id" up="up" v-if="productsList.num">
        <template slot="header">
          <div class="am-ft-md"> {{item.name}}</div>
          <div class="am-list-extra" style="min-width:.44rem">投保&nbsp;</div>
          <div class="am-switch">
            <input type="checkbox" @change="chAddonState(item.safe_id)" v-model="addonsSelected[item.safe_id]" class="am-switch-checkbox" :id="'applicant_'+item.safe_id">
            <label class="am-switch-label" :for="'applicant_'+item.safe_id">
              <div class="am-switch-inner"></div>
              <div class="am-switch-switch"></div>
            </label>
          </div>
        </template>
        <!-- 附加品质生活年金保险 -->
        <template v-if="item.safe_id==='354'">
          <app-input label="年缴保费">
            <input slot="input" v-model.number="cache.derate_money354" type="number" placeholder="基本保险金额（元）" @change="chAddonState(item.safe_id)">
            <div slot="icon" v-show="cache.derate_money354 !== ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="cache.derate_money354 = ''"></i></div>
          </app-input>
          <div class="am-notice" role="alert">
            <div class="am-notice-content">年缴保费为1000元整数倍，可为0</div>
          </div>
        </template>
        <!-- 附加品质生活年金保险 -->
        <!-- 附加金账户年金保险 -->
        <template v-if="item.safe_id==='349'">
          <app-input label="年缴保费">
            <input slot="input" v-model.number="cache.derate_money349" type="number" placeholder="基本保险金额（元）" @change="chAddonState(item.safe_id)">
            <div slot="icon" v-show="cache.derate_money349 !== ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="cache.derate_money349 = ''"></i></div>
          </app-input>
          <div class="am-notice" role="alert">
            <div class="am-notice-content">年缴保费为1000元整数倍，可为0</div>
          </div>
        </template>
        <!-- 附加金账户年金保险 -->
        <!-- 附加乐行天下意外住院津贴 -->
        <template v-if="item.safe_id === '333'">
          <div class="am-list-item">
            <div class="am-list-content">保障金额</div>
            <div class="am-ft-black">100元/日</div>
          </div>
          <template v-if="addonRes[item.safe_id]">
            <div class="am-list-item">
              <div class="am-list-content">保障期间</div>
              <div class="am-ft-black">{{mainSafe_year}}年</div>
            </div>
            <div class="am-list-item">
              <div class="am-list-content">缴费期间</div>
              <div class="am-ft-black">{{mainPay_year}}年</div>
            </div>
            <div class="am-list-item">
              <div class="am-list-content">年缴保费</div>
              <div class="am-ft-orange" v-model.number="cache.pay_money333">{{addonRes[item.safe_id]['年缴保费']}}</div>
            </div>
          </template>
        </template>
        <!-- 附加乐行天下意外住院津贴  -->
        <!-- 附加乐行天下意外伤害 -->
        <template v-if="item.safe_id === '332'">
          <app-select label="保险金额">
            <select v-model.number="flag[item.safe_id]" @change="flagChanged(item.safe_id)">
              <option disabled value='0'>请选择</option>
              <option value="100000">100000</option>
              <option value="200000">200000</option>
              <option value="300000">300000</option>
            </select>
          </app-select>
          <template v-if="addonRes[item.safe_id]">
            <div class="am-list-item">
              <div class="am-list-content">保障期间</div>
              <div class="am-ft-black">{{mainSafe_year}}年</div>
            </div>
            <div class="am-list-item">
              <div class="am-list-content">缴费期间</div>
              <div class="am-ft-black">{{mainPay_year}}年</div>
            </div>
            <div class="am-list-item">
              <div class="am-list-content">年缴保费</div>
              <div class="am-ft-orange" v-model.number="cache.pay_money332">{{addonRes[item.safe_id]['年缴保费']}}</div>
            </div>
          </template>
        </template>
        <!-- 附加乐行天下意外伤害  -->
        <!-- 附加恒祥 -->
        <template v-if="item.safe_id === '295'">
          <app-input label="保险金额">
            <input slot="input" v-model.number="cache.base_money295" type="number" placeholder="保险金额(元)" @change="addonRes[item.safe_id]=null,addonsSelected[item.safe_id]=false">
            <div slot="icon" v-show="cache.base_money295 != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="cache.base_money295 = ''"></i></div>
          </app-input>
          <div class="am-list-footer"><span class='am-ft-orange'>最低50元,10的整数倍。累计不超过100元/天</span>
          </div>
          <template v-if="addonRes[item.safe_id]">
            <div class="am-list-item">
              <div class="am-list-content">保障期间</div>
              <div class="am-ft-black">终身</div>
            </div>
            <div class="am-list-item">
              <div class="am-list-content">缴费期间</div>
              <div class="am-ft-black">趸缴</div>
            </div>
            <div class="am-list-item">
              <div class="am-list-content">保险金额</div>
              <div class="am-ft-orange">{{cache.base_money295}}</div>
            </div>
            <div class="am-list-item">
              <div class="am-list-content">年缴保费</div>
              <div class="am-ft-orange">{{addonRes[item.safe_id]['年缴保费']}}</div>
            </div>
          </template>
        </template>
        <!-- 附加恒祥 -->
        <!-- 附加恒顺 -->
        <template v-else-if="item.safe_id === '294'">
          <app-select label="保险金额">
            <select v-model.number="flag[item.safe_id]" @change="flagChanged(item.safe_id)">
              <option disabled value='0'>请选择</option>
              <option value="2000">2000</option>
              <option value="3000">3000</option>
              <option value="4000">4000</option>
              <option value="5000">5000</option>
              <option value="6000">6000</option>
              <option value="7000">7000</option>
              <option value="8000">8000</option>
              <option value="9000">9000</option>
              <option value="10000">10000</option>
              <option value="15000">15000</option>
              <option value="20000">20000</option>
              <option value="52000">5类职业2000</option>
              <option value="53000">5类职业3000</option>
              <option value="54000">5类职业4000</option>
              <option value="55000">5类职业5000</option>
              <option value="56000">5类职业6000</option>
              <option value="57000">5类职业7000</option>
              <option value="58000">5类职业8000</option>
              <option value="59000">5类职业9000</option>
              <option value="510000">5类职业10000</option>
              <option value="515000">5类职业15000</option>
              <option value="520000">5类职业20000</option>
              <option value="62000">6类职业2000</option>
              <option value="63000">6类职业3000</option>
              <option value="64000">6类职业4000</option>
              <option value="65000">6类职业5000</option>
              <option value="66000">6类职业6000</option>
              <option value="67000">6类职业7000</option>
              <option value="68000">6类职业8000</option>
              <option value="69000">6类职业9000</option>
              <option value="610000">6类职业10000</option>
              <option value="615000">6类职业15000</option>
              <option value="620000">6类职业20000</option>
            </select>
          </app-select>
          <template v-if="addonRes[item.safe_id]">
            <div class="am-list-item">
              <div class="am-list-content">保障期间</div>
              <div class="am-ft-black">终身</div>
            </div>
            <div class="am-list-item">
              <div class="am-list-content">缴费期间</div>
              <div class="am-ft-black">趸缴</div>
            </div>
            <div class="am-list-item">
              <div class="am-list-content">保险金额</div>
              <div class="am-ft-orange">{{flag[item.safe_id] > 50000 ? flag[item.safe_id].toString().substr(1) : flag[item.safe_id]}}</div>
            </div>
            <div class="am-list-item">
              <div class="am-list-content">年缴保费</div>
              <div class="am-ft-orange">{{addonRes[item.safe_id]['年缴保费']}}</div>
            </div>
          </template>
        </template>
        <!-- 附加恒顺 -->
        <!-- 金财人生终身年金保险D款 -->
        <template v-else-if="item.safe_id==='291'">
          <div class="am-list-item">
            <div class="am-list-content">保障期间</div>
            <div class="am-ft-black">终身</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">缴费期间</div>
            <div class="am-ft-black">趸交</div>
          </div>
          <app-input label="年缴保费">
            <input slot="input" v-model.number="cache.derate_money291" type="number" placeholder="基本保险金额（元）" @change="chAddonState(item.safe_id)">
            <div slot="icon" v-show="cache.derate_money291 !== ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="cache.derate_money291 = ''"></i></div>
          </app-input>
          <div class="am-notice" role="alert">
            <div class="am-notice-content">年缴保费为1000元整数倍，可为0</div>
          </div>
        </template>
        <!-- 金财人生终身年金保险D款 -->
        <!-- 附加尊享安康费用补偿医疗保险 -->
        <template v-else-if="item.safe_id==='293'">
          <app-select label="保险金额">
            <select v-model.number="flag[item.safe_id]" @change="flagChanged(item.safe_id)">
              <option disabled value='0'>请选择</option>
              <option value='150'>有社保50万</option>
              <option value='250'>无社保50万</option>
            </select>
          </app-select>
          <template v-if="addonRes[item.safe_id]">
             <div class="am-list-item">
              <div class="am-list-content">保障期间</div>
              <div class="am-ft-black">1年</div>
            </div>
            <div class="am-list-item">
              <div class="am-list-content">缴费期间</div>
              <div class="am-ft-black">趸缴</div>
            </div>
            <div class="am-list-item">
              <div class="am-list-content">年缴保费</div>
              <div class="am-ft-orange">{{addonRes[item.safe_id]['年缴保费']}}</div>
            </div>
          </template>
        </template>
        <!-- 附加尊享安康费用补偿医疗保险 -->
        <!-- 附加投保人豁免保险费重大疾病保险（2017 版） -->
        <template v-else-if="(item.safe_id==='289') && addonRes[item.safe_id]">
          <div class="am-list-item">
            <div class="am-list-content">保障期间</div>
            <div class="am-ft-black">终身</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">缴费期间</div>
            <div class="am-ft-black">{{mainPay_year-1}}年交</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">保险金额</div>
            <div class="am-ft-orange">{{insurance.period_money}}</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">年缴保费</div>
            <div class="am-ft-orange">{{addonRes[item.safe_id]['年缴保费']}}</div>
          </div>
        </template>
        <!-- 附加投保人豁免保险费重大疾病保险（2017 版） -->
        <!-- 附加豁免保险费定期寿险 -->
        <template v-else-if="(item.safe_id==='285' || item.safe_id==='284') && addonRes[item.safe_id]">
          <div class="am-list-item">
            <div class="am-list-content">保障期间</div>
            <div class="am-ft-black">{{mainPay_year-1}}年</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">缴费期间</div>
            <div class="am-ft-black">{{mainPay_year-1}}年交</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">保险金额</div>
            <div class="am-ft-orange">{{insurance.period_money}}</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">年缴保费</div>
            <div class="am-ft-orange">{{addonRes[item.safe_id]['年缴保费']}}</div>
          </div>
        </template>
        <!-- 附加豁免保险费定期寿险 -->
        <!-- 附加投保人保费豁免重大疾病保险 -->
        <template v-else-if="item.safe_id === '281' && addonRes[item.safe_id]">
          <div class="am-list-item">
            <div class="am-list-content">保障期间</div>
            <div class="am-ft-black">{{mainPay_year}}年</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">缴费期间</div>
            <div class="am-ft-black">{{mainPay_year}}年交</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">保险金额</div>
            <div class="am-ft-orange">{{insurance.period_money}}</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">年缴保费</div>
            <div class="am-ft-orange">{{addonRes[item.safe_id]['年缴保费']}}</div>
          </div>
        </template>
        <!-- 附加投保人保费豁免重大疾病保险 -->
        <!-- 附加住院费用医疗（社保和非社保型）235-236 -->
        <template v-else-if="(item.safe_id === '235' || item.safe_id === '236' || item.safe_id === '237')">
          <app-select label="保险金额">
            <select v-model.number="flag[item.safe_id]" @change="flagChanged(item.safe_id)">
              <option disabled value='0'>请选择</option>
              <option value="1" v-if="(insurance.period_money > 1000 && insurance.period_money <= 1499)">1份</option>
              <option :value="n" v-else-if="(insurance.period_money > 1500 && insurance.period_money <= 2999)" v-for="n in 2">{{n}}份</option>
              <option :value="n" v-else-if="(insurance.period_money > 3000 && insurance.period_money <= 3999)" v-for="n in 3">{{n}}份</option>
              <option :value="n" v-else-if="(insurance.period_money > 4000 && insurance.period_money <= 4999)" v-for="n in 4">{{n}}份</option>
              <option :value="n" v-else-if="(insurance.period_money > 4000 && item.safe_id === '237')" v-for="n in 4">{{n}}份</option>
              <option :value="n" v-else-if="(insurance.period_money > 5000 && insurance.period_money <= 5999)" v-for="n in 5">{{n}}份</option>
              <option :value="n" v-else-if="insurance.period_money > 6000" v-for="n in 6">{{n}}份</option>
            </select>
          </app-select>
          <div class="am-list-item">
            <div class="am-list-content">保障期间</div>
            <div class="am-ft-black">1年</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">缴费期间</div>
            <div class="am-ft-black">趸交</div>
          </div>
          <div class="am-list-item" v-if="addonRes[item.safe_id]">
            <div class="am-list-content">年缴保费</div>
            <div class="am-ft-orange">{{addonRes[item.safe_id]['年缴保费']}}</div>
          </div>
        </template>
        <!-- 附加住院费用医疗（社保和非社保型）235-236 -->
        <!-- 华宝安康医疗保险 -->
        <template v-else-if="item.safe_id === '273'">
          <app-select label="选择计划">
            <select v-model.number="flag[item.safe_id]" @change="flagChanged(item.safe_id)">
              <option disabled value='0'>请选择计划</option>
              <option value='1'>愈安</option>
              <option value='3'>愈佳</option>
            </select>
          </app-select>
          <div class="am-list-item" v-for="(value,key) in addonRes[item.safe_id]" v-if="key !== '社保外特殊病房床位费及膳食费'">
            <div class="am-list-content">{{key}}</div>
            <div class="am-ft-orange">{{value}}</div>
          </div>
        </template>
        <!-- 华宝安康医疗保险 -->
        <!-- 附加住院津贴医疗保险 -->
        <template v-else-if="item.safe_id === '196' && addonRes[item.safe_id]">
          <div class="am-list-item" v-for="(value,key) in addonRes[item.safe_id]">
            <div class="am-list-content">{{key}}</div>
            <div class="am-ft-orange">{{value}}</div>
          </div>
        </template>
        <!-- 附加住院津贴医疗保险 -->
        <!-- 附加御立方三号重大疾病保险 -->
        <template v-else-if="item.safe_id === '177' && addonRes[item.safe_id]">
          <div class="am-list-item">
            <div class="am-list-content">年缴保费</div>
            <div class="am-ft-orange">{{addonRes[item.safe_id]['年缴保费']}}</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">轻症保险金</div>
            <div class="am-ft-orange">{{addonRes[item.safe_id]['轻症保险金']}}</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">重疾保险金</div>
            <div class="am-ft-orange">{{addonRes[item.safe_id]['重疾保险金']}}</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">现金价值</div>
            <div class="am-ft-orange">{{addonRes[item.safe_id]['现金价值']}}</div>
          </div>
        </template>
        <!-- 附加御立方三号重大疾病保险 -->
        <!-- 附加乐无忧住院医疗保险 -->
        <template v-else-if="item.safe_id === '175'">
          <app-select label="保险计划">
            <select v-model.number="flag[item.safe_id]" @change="flagChanged(item.safe_id)">
              <option disabled value='0'>请选择计划</option>
              <option value='1'>计划一(基本保额：1万元)</option>
              <option value='2'>计划二(基本保额：2万元)</option>
              <option value='3'>计划三(基本保额：3.5万元)</option>
              <option value='4'>计划四(基本保额：5万元)</option>
            </select>
          </app-select>
          <template v-if="addonRes[item.safe_id]">
            <div class="am-list-item">
              <div class="am-list-content">住院医疗保险金-计划{{flag[item.safe_id]}}(元)</div>
              <div class="am-ft-orange">{{addonRes[item.safe_id]['住院医疗保险金-计划'+flag[item.safe_id]+'(元)']}}</div>
            </div>
            <div class="am-list-item">
              <div class="am-list-content">自费用药费用保险金-计划{{flag[item.safe_id]}}(元) </div>
              <div class="am-ft-orange">{{addonRes[item.safe_id]['自费用药费用保险金-计划'+flag[item.safe_id]+'(元)']}}</div>
            </div>
            <div class="am-list-item">
              <div class="am-list-content">保障期间(年)</div>
              <div class="am-ft-orange">{{addonRes[item.safe_id]['保障期间(年)']}}</div>
            </div>
            <div class="am-list-item">
              <div class="am-list-content">缴费年间(年)</div>
              <div class="am-ft-orange">{{addonRes[item.safe_id]['缴费年间(年)']}}</div>
            </div>
            <div class="am-list-item">
              <div class="am-list-content">年缴保费(元)</div>
              <div class="am-ft-orange">{{addonRes[item.safe_id]['年缴保费(元)']}}</div>
            </div>
          </template>
        </template>
        <!-- 附加乐无忧住院医疗保险 -->
        <!-- 附加综合意外伤害保险 -->
        <template v-else-if="item.safe_id === '148'">
          <app-input label="保险金额">
            <input slot="input" v-model.number="cache.base_money148" type="number" placeholder="基本保险金额（元）" @change="addonRes[item.safe_id]=null,addonsSelected[item.safe_id]=false">
            <div slot="icon" v-show="cache.base_money148 != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="cache.base_money148 = ''"></i></div>
            <span slot="button" class="am-ft-orange am-ft-sm">(5万~300万)</span>
          </app-input>
          <app-select label="职业分类">
            <select v-model.number="flag[item.safe_id]" @change="addonRes[item.safe_id]=null,addonsSelected[item.safe_id]=false">
              <option disabled value='0'>请选择职业分类</option>
              <option :value="item" v-for="item in 4">{{item}}类</option>
            </select>
          </app-select>
          <div class="am-list-item">
            <div class="am-list-content">保障期间</div>
            <div class="am-ft-black">1年</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">缴费期间</div>
            <div class="am-ft-black">趸交</div>
          </div>
          <div class="am-list-item" v-if="addonRes[item.safe_id]">
            <div class="am-list-content">年缴保费</div>
            <div class="am-ft-orange">{{addonRes[item.safe_id]['年缴保费']}}</div>
          </div>
        </template>
        <!-- 附加综合意外伤害保险 -->
        <!-- 附加住院费用医疗保险 -->
        <template v-else-if="item.safe_id === '147'">
          <app-select label="保险金额">
            <select v-model.number="flag[item.safe_id]" @change="flagChanged(item.safe_id)">
              <option disabled value='0'>请选择金额</option>
              <option value="2000">2000元</option>
              <option value="3000">3000元</option>
              <option value="4000">4000元</option>
              <option value="5000">5000元</option>
              <option value="6000">6000元</option>
              <option value="7000">7000元</option>
              <option value="8000">8000元</option>
              <option value="9000">9000元</option>
              <option value="10000">10000元</option>
              <option value="15000">15000元</option>
              <option value="20000">20000元</option>
              <option value="25000">25000元</option>
              <option value="30000">30000元</option>
            </select>
          </app-select>
          <div class="am-list-item">
            <div class="am-list-content">保障期间</div>
            <div class="am-ft-black">1年</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">缴费期间</div>
            <div class="am-ft-black">趸交</div>
          </div>
          <div class="am-list-item" v-if="addonRes[item.safe_id]">
            <div class="am-list-content">年缴保费</div>
            <div class="am-ft-orange">{{addonRes[item.safe_id]['年缴保费']}}</div>
          </div>
        </template>
        <!-- 附加住院费用医疗保险 -->
        <!-- 附加意外伤害医疗B -->
        <template v-else-if="item.safe_id === '146'">
          <app-select label="保险金额">
            <select v-model.number="flag[item.safe_id]" @change="flagChanged(item.safe_id)">
              <option disabled value='0'>请选择金额</option>
              <option value="2000">2000元</option>
              <option value="3000">3000元</option>
              <option value="4000">4000元</option>
              <option value="5000">5000元</option>
              <option value="6000">6000元</option>
              <option value="7000">7000元</option>
              <option value="8000">8000元</option>
              <option value="9000">9000元</option>
              <option value="10000">10000元</option>
              <option value="15000">15000元</option>
              <option value="20000">20000元</option>
            </select>
          </app-select>
          <div class="am-list-item">
            <div class="am-list-content">保障期间</div>
            <div class="am-ft-black">1年</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">缴费期间</div>
            <div class="am-ft-black">趸交</div>
          </div>
          <div class="am-list-item" v-if="addonRes[item.safe_id]">
            <div class="am-list-content">年缴保费</div>
            <div class="am-ft-orange">{{addonRes[item.safe_id]['年缴保费']}}</div>
          </div>
        </template>
        <!-- 附加意外伤害医疗B -->
        <!-- 附加乐相伴豁免保险费重大疾病保险 -->
        <template v-else-if="item.safe_id === '131' && addonRes[item.safe_id]">
          <div class="am-list-item">
            <div class="am-list-content">保障期间</div>
            <div class="am-ft-black">{{mainPay_year > 1 ? mainPay_year - 1 : mainPay_year}}年</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">缴费期间</div>
            <div class="am-ft-black">{{mainPay_year > 1 ? (mainPay_year-1) + '年交' : '趸交'}}</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">保险金额</div>
            <div class="am-ft-orange">{{insurance.period_money}}</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">年缴保费</div>
            <div class="am-ft-orange">{{addonRes[item.safe_id]['年缴保费(元)']}}</div>
          </div>
        </template>
        <!-- 附加乐相伴豁免保险费重大疾病保险 -->
        <!-- 附加如意尊享住院费用B款医疗保险 -->
        <template v-else-if="item.safe_id === '121' && addonRes[item.safe_id]">
          <div class="am-list-item" v-for="(value,key) in addonRes[item.safe_id]">
            <div class="am-list-content">{{key}}</div>
            <div class="am-ft-orange">{{value}}</div>
          </div>
        </template>
        <!-- 附加如意尊享住院费用B款医疗保险 -->
        <!-- 国华附加年金保险 -->
        <template v-else-if="item.safe_id === '94' && addonRes[item.safe_id]">
          <div class="am-list-item">
            <div class="am-list-content">保障期间</div>
            <div class="am-ft-black">至85岁</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">缴费期间</div>
            <div class="am-ft-black">{{mainPay_year}}年交</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">保险金额</div>
            <div class="am-ft-orange">{{insurance.period_money * mainPay_year}}</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">年缴保费</div>
            <div class="am-ft-orange">{{addonRes[item.safe_id]['年缴保费']}}</div>
          </div>
        </template>
        <!-- 国华附加年金保险 -->
        <!-- 附加豁免保险费重疾保险 -->
        <template v-else-if="item.safe_id === '86' && addonRes[item.safe_id]">
          <div class="am-list-item">
            <div class="am-list-content">保障期间</div>
            <div class="am-ft-black">{{(mainPay_year -1) + '年'}}</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">缴费期间</div>
            <div class="am-ft-black">{{(mainPay_year -1) + '年交'}}</div>
          </div>
          <div class="am-list-item">
            <div class="am-list-content">年缴保费</div>
            <div class="am-ft-orange">{{addonRes[item.safe_id]['年缴保费']}}</div>
          </div>
        </template>
        <!-- 附加豁免保险费重疾保险 -->
      </app-dropdown>
    </div>
    <div class="am-button-group">
      <button type="button" class="am-button save" @click="savePlay" v-if="savePlayshow"><i class="iconfont icon-baocun"></i>保存</button>
    </div>
    <div class="am-button-group">
      <button type="button" class="am-button save" @click="xiugaiPlay" v-if="xiugaiPlayshow"><i class="iconfont icon-baocun"></i>修改</button>
    </div>
  </section>
</template>
<script>
import axios from 'axios'
import qs from 'qs'
import Bus from '.././widgets/bus.js'
import $_GET from '../widgets/Get'
import $ from 'n-zepto'
const admin_id = $_GET['admin_id'] || '1846'
const sid = '74'

const calMoneyIns = ['74', '182', '290', '352'] //算保费的主险
const fuMoneyIns = ['318']//通过附加算主险
  // 附加险上线产品
const addonFilter = ['8', '11', '86', '94', '121', '131', '146', '147', '148', '175', '177', '196', '235', '236', '237', '273', '281', '284', '285', '289', '291', '293', '294', '295', '348']
const mustSelected = ['291', '177', '11', '333', '332', '349', '354'] //必须附加的附加险
const noMust = ['94', '147', '177', '284', '285', '289', '291', '309', '349', '333', '354'] //不需要验证条件的附加险
export default {
  name: 'insurance',
  props: {
    index: {
      type: Number,
      required: true
    },
    planAddLen: {
      type: Number,
      required: true
    },
    len: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      init: [], //初始化字段数据
      insInfo: [], //主险信息
      message: '', //投保人信息从plan传过来
      assured: '',
      isBaseMoney: true, //输入保额
      fuBaseMoney: false, //输入保额
      mainInsurance: [], //主险信息
      mainSafe_year: '', //主险
      mainPay_year: '', //主险
      mainPyAttr: null,
      mainSyAttr: null,
      mainIns: {}, //主险险种信息
      prospectus_types: [], //计划书类型
      prospectus_type: 0, //选择的计划书类型
      flag: {}, //试算特殊参数
      cache: {
        base_money148: '',
        base_money295: '',
        quota147: '',
        derate_money291: '',
        derate_money349: '',
        derate_money354: '',
        pay_money332: '',
        pay_money333: ''
      }, //数据缓存
      addonsSelected: {}, //附加险投保状态
      showAddonIns: [], //附加险信息
      addonFilter: addonFilter, //附加险过滤
      //insFilter: insFilter, //主险过滤
      Addons: [], //附加险可选信息
      addonRes: {}, //附加险返回信息
      addonIns: {}, //附加险保存险种信息
      samePerson: false, //投被保人为同人
      sc_id: '0',
      insurance: {
        name: '',
        safe_id: '0', //险种
        safe_year: '00', //保险期间
        pay_year: 0, //交费年期
        money: '', //基本保险金额
        period_money: '' //年交保费
      },
      productsList: {
        num: true,
        name: '险种信息'
      },
      productsShow: {
        0: true
      },
      savePlayshow: true, //保存按钮
      xiugaiPlayshow: false, //保存按钮
      savefl: false, //先保存后才可以添加新的
      bool: true
    }
  },
  created() {
    var vm = this
    axios.get('http://cloud.ehuimeng.com/Prospectus/GetConf?uid=' + admin_id)
      .then(function(response) {
        vm.init = response.data.data
        vm.insInfo = response.data.data.company
        vm.mainInsurance = response.data.data.main
        vm.Addons = response.data.data.children
        for (var i in vm.mainInsurance) {
          for (var j in vm.mainInsurance[i]) {
            console.log(vm.mainInsurance[i][j].safe_id)
            if (sid === vm.mainInsurance[i][j].safe_id) {
              vm.sc_id = vm.mainInsurance[i][j].sc_id
            }
          }
        }
      })
      .catch(function(error) {
        console.log(error)
      })
    this.message = this.$parent.$parent.applicant
    vm.insurance.safe_id = sid
  },
  methods: {
    //险种显示
    changeProducts(index) {
      console.log(index)
      if (this.productsList.num && !this.savePlayshow && this.xiugaiPlayshow) {
        this.productsList.num = false
        this.xiugaiPlayshow = false
      } else if (this.savePlayshow) {
        this.productsList.num = true
        this.xiugaiPlayshow = false
      } else {
        this.productsList.num = true
        this.xiugaiPlayshow = true
      }
    },
    //更改保险公司
    companyChanged() {
      this.assured = this.$parent.assured
      console.log(this.$parent.assured)
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
        safe_year: '00', //保险期间
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
          value: 'educate',
          name: '领取版'
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

      if (safeid === '205' || safeid === '352') { //泰康尊享岁月  中国人保尊赢
        this.flag[safeid] = 0 //领取年龄
      }

      //保障期间
      if (safeid === '4' || safeid === '6') {
        this.mainSyAttr = ['30']
      } else if (safeid === '8') {
        this.mainSyAttr = ['66', '77', '88']
      } else if (safeid === '172') {
        this.mainSyAttr = ['100']
      } else if (safeid === '182') {
        this.mainSyAttr = ['100']
      } else if (safeid === '205') {
        this.mainSyAttr = ['106']
      } else if (safeid === '280' || safeid === '309') {
        this.mainSyAttr = ['1']
      } else if (safeid === '292') {
        this.mainSyAttr = ['30', '75']
      } else if (safeid === '316') {
        this.mainSyAttr = ['30']
      } else if (safeid === '318') {
        this.mainSyAttr = ['30', '80']
      } else {
        this.mainSyAttr = ['0']
      }
      if (this.mainSyAttr.length === 1) {
        this.insurance.safe_year = this.mainSyAttr[0]
        this.syChanged()
      } else {
        this.insurance.safe_year = '00'
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
      } else if (safeid === '319') {
        this.mainPyAttr = ['1', '3', '5', '10', '15', '19', '20']
      } else if (safeid === '352') {
        this.mainPyAttr = ['3', '5', '10']
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
      this.fuBaseMoney = fuMoneyIns.indexOf(safeid) !== -1
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
        if (!this.checkMainFee(this.insurance.safe_id)) {
          this.addonsSelected[index] = false
          this.$forceUpdate()
          return false
        }
        var flag = this.flag[index]
        var period_money = this.insurance.period_money
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
              if (this.insurance.pay_year === 10 && this.insurance.period_money < 10000) {
                toastText = '主险缴费期为 10年，且期交保费 1 万及以上方可附加'
              } else if (this.insurance.period_money < 20000 && [3, 5].indexOf(this.insurance.pay_year) === -1) {
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
          case '354': //附加品质生活年金-中国人保
            if (toastText) break
            if (this.cache.derate_money354 === '') {
              toastText = '年缴保费不能为空'
            } else if (this.cache.derate_money354 !== 0 && this.cache.derate_money354 % 1000 !== 0) {
              toastText = '年缴保费为1000元整数倍，可为0'
            } else if (this.cache.derate_money354 > this.insurance.period_money * this.mainPay_year) {
              toastText = '该附加险保费不能超过主险总保费'
            }
            break
          case '349': //附加金账户年金-工银
            if (toastText) break
            if (this.cache.derate_money349 === '') {
              toastText = '年缴保费不能为空'
            } else if (this.cache.derate_money349 !== 0 && this.cache.derate_money349 % 1000 !== 0) {
              toastText = '年缴保费为1000元整数倍，可为0'
            } else if (this.cache.derate_money349 > this.insurance.period_money * this.mainPay_year) {
              toastText = '该附加险保费不能超过主险总保费'
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
            if (this.cache.derate_money291 === '') {
              toastText = '年缴保费不能为空'
            } else if (this.cache.derate_money291 !== 0 && this.cache.derate_money291 % 1000 !== 0) {
              toastText = '年缴保费为1000元整数倍，可为0'
            } else if (this.cache.derate_money291 > this.insurance.period_money * this.mainPay_year) {
              toastText = '该附加险保费不能超过主险总保费'
            }
            break
          case '148': //*
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
            }
            break
          case '131':  //*
          case '281': //*
          case '86': //附加豁免保险费重疾保险*
          case '285': //附加豁免保险费重大疾病保险
          case '284': //附加豁免保险费定期寿险
          case '289': //附加投保人豁免保费
            if (this.samePerson) {
              toastText = '投被保人为同人时不可附加该险种'
            }
            break
          case '235': //附加住院费用医疗（非社保型）*
            if (this.addonsSelected[236]) {
              toastText = '社保与非社保只能选择一个'
            }
            break
          case '236': //附加住院费用医疗（社保型）*
            if (this.addonsSelected[235]) {
              toastText = '社保与非社保只能选择一个'
            }
            break
        }
        if (toastText) {
          this.$toast.show(toastText)
          this.addonsSelected[index] = false
          this.$forceUpdate()
          return
        } else {
          // this.log('选择附加险 ID: ' + index + (this.flag[index] ? ' Flag: ' + this.flag[index] : ''), INFO)
          this.calMoney(false, index)// 试算附加险
        }
      } else {
        if (mustSelected.indexOf(index) > -1) {
          toastText = '该附加险必须附加，不能取消'
          this.$toast.show(toastText)
            // this.log(toastText + 'ID: ' + index, INFO)
          this.addonsSelected[index] = true
          this.$forceUpdate()
          this.calMoney(false, index)// 试算附加险
          return
        }
        this.addonRes[index] = null
        this.$forceUpdate()
        // this.log('取消选择附加险 ID: ' + index, INFO)
      }
    },
    // 重置附加险默认信息
    resetAddon() {
      // this.log('重置附加险默认信息', INFO)
      var safeid = this.insurance.safe_id
      if (safeid === '318') {
        this.flag[332] = 0
      } else if (safeid === '288' || safeid === '290' || safeid === '292') {
        this.flag[294] = 0
        this.flag[293] = 0
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
      for (let i in this.Addons[safeid]) {
        const j = this.Addons[safeid][i].safe_id
        this.addonsSelected[j] = false
        if (mustSelected.indexOf(j) > -1) {
         // this.addonsSelected[j] = true
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
      // if (index === '147') {
      //   if (this.cache.quota147 < 2 || this.cache.quota147 > 30) {
      //     this.$toast.show()
      //   }
      //   this.flag[index] = this.cache.quota147 * 1000
      // }
      this.$forceUpdate()
    },
    // 校验投保人
    checkAppl() {
      var toastText = null
      var exp = /^(([1-9]\d{0,12})|0)(\.\d{1,2})?$/
      if (!this.message.name) {
        toastText = '投保人姓名不能为空'
      } else if (this.message.age < 18) {
        toastText = '投保人年龄不能小于18周岁'
      } else if (!this.message.age) {
        toastText = '投保人年龄不能为空'
      } else if (exp.test(this.message.age) === false) {
        toastText = '保险人年龄格式不规范，请重新输入'
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
      var exp = /^(([1-9]\d{0,12})|0)(\.\d{1,2})?$/
      if (!this.assured.name) {
        toastText = '被保人姓名不能为空'
      } else if (!this.assured.age) {
        toastText = '被保人年龄不能为空'
      } else if (exp.test(this.message.age) === false) {
        toastText = '被保险人年龄格式不规范，请重新输入'
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
      var exp = /^(([1-9]\d{0,12})|0)(\.\d{1,2})?$/
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
      } else if (this.insurance.safe_year === '00') {
        toastText = '请选择主险保险期间'
      } else if (this.insurance.pay_year === '0') {
        toastText = '请选择主险交费期间'
      } else if (safeid === '205' && !this.flag[safeid]) {
        toastText = '请选择主险领取年龄'
      } else if (safeid === '352' && !this.flag[safeid]) {
        toastText = '请选择主险领取年龄'
      } else if (this.isBaseMoney && !this.insurance.money && !this.fuBaseMoney) {
        toastText = '请输入主险基本保额'
      } else if (this.isBaseMoney && exp.test(this.insurance.money) === false && !this.fuBaseMoney) {
        toastText = '数字格式不规范，请重新输入'
      } else if (!this.isBaseMoney && !this.insurance.period_money && !this.fuBaseMoney) {
        toastText = '请输入主险年缴保费'
      } else if (this.isBaseMoney && !this.insurance.period_money && this.fuBaseMoney && this.cache.pay_money332 === '') {
        toastText = '请先完善附加乐行天下意外伤害保险'
      } else if (this.isBaseMoney && !this.insurance.period_money && this.fuBaseMoney && this.cache.pay_money333 === '') {
        toastText = '请先完善附加乐行天下意外住院津贴医疗保险'
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
    //主险保费校验
    checkMainFee(safeid) {
      var toastText = null
      var period_money = this.insurance.period_money

      if (this.isBaseMoney && !this.insurance.period_money && !this.fuBaseMoney) {
        toastText = this.insurance.period_money === 0 ? '超出费率表计算范围，无法投保' : '请计算主险年缴保费'
      } else if (!this.isBaseMoney && !this.insurance.money && !this.fuBaseMoney) {
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
          if (this.mainPay_year === '15' || this.mainPay_year === '20') {
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

      this.mainPay_year = this.insurance.pay_year
      this.mainSafe_year = this.insurance.safe_year
      if (isMain && !this.checkMainForm()) {
        return false
      }
      const safeid = isMain ? this.insurance.safe_id : addonSafeid
      if (!safeid) {
        this.$toast.show('险种ID不正确', 'warn')
        return false
      }
      var data = {
        admin_id: admin_id,
        modify_id: this.planAddLen.toString() + this.index + safeid,
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
      var filterSafeid = ['74', '182', '290', '348', '172', '352']
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
      //乐行天下主险
      if (safeid === '318') {
        data = Object.assign(data, {
          money_one: this.cache.pay_money332,
          money_two: this.cache.pay_money333
        })
      }
      // 计划书类型
      if (this.prospectus_types.length > 0) {
        data.type = this.prospectus_type
      }
      if (safeid === '309' || safeid === '280') {
        data.flag = this.prospectus_type
      } else if (safeid === '172') {
        data.flag = 0
      }

      // 计算保额还是保费
      if (this.isBaseMoney) {
        data.base_money = this.insurance.money
      } else {
        data.year_fee = this.insurance.period_money
      }

      var py = this.mainPay_year === '1' ? 1 : this.mainPay_year - 1 // 主险缴费期间减一年
      var period_money = this.insurance.period_money
      var money = this.insurance.money
        // 险种参数
      if (safeid === '352') {
        //中国人保尊赢人生
        data.pay_year = this.mainPay_year
        data.safe_year = this.mainSafe_year
        data.flag = this.flag[safeid]
      } else if (safeid === '354') {
        //中国人保尊赢人生附加
        data.pay_year = 1
        data.safe_year = 1
        data.flag = this.cache.derate_money354
      } else if (safeid === '349') {
        //乐行天下附加
        data.pay_year = 1
        data.safe_year = 1
        data.flag = this.cache.derate_money349
      } else if (safeid === '333') {
        //乐行天下附加
        data.pay_year = this.mainPay_year
        data.safe_year = this.mainSafe_year
        data.base_money = 100
      } else if (safeid === '332') {
        //乐行天下附加
        data.pay_year = this.mainPay_year
        data.safe_year = this.mainSafe_year
        data.base_money = this.flag[safeid]
      } else if (safeid === '295') {
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
        data.flag = this.flag[safeid]
          // data.flag = this.warranty.assu_social_security === '15046' ? 150 : 250
      } else if (safeid === '291') { //附加金管家年金保险
        // 尊享安康
        data.pay_year = 1
        data.safe_year = 1
        data.derate_money = this.cache.derate_money291
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
      if (noMust.indexOf(safeid) === -1) {
        $.ajax({
          url: 'http://open.ehuimeng.com/validate/safegoods',
          type: 'get',
          dataType: 'script',
          async: false,
          data: {
            id: safeid
          },
          success: function() {
            //console.log(res)
            var toastText = null
            if (window.validate.assu_age) {
              var assu_age = window.validate.assu_age(Number(vm.assured.age), Number(vm.mainPay_year), Number(data.flag), Number(vm.mainSafe_year))
              if (!assu_age.status) {
                toastText = assu_age.message
              }
            }
            if (window.validate.year_fee) {
              var year_fee = window.validate.year_fee(Number(period_money), Number(vm.mainPay_year))
              if (!year_fee.status) {
                toastText = year_fee.message
              }
            }
            if (window.validate.base_money) {
              var base_money = window.validate.base_money(Number(data.base_money), Number(vm.mainPay_year))
              if (!base_money.status) {
                toastText = base_money.message
              }
            }
            if (window.validate.flag) {
              var flag = window.validate.flag(Number(vm.flag[safeid]))
              if (!flag.status) {
                toastText = flag.message
              }
            }
            if (window.validate.pay_year) {
              var pay_year = window.validate.pay_year(Number(vm.mainPay_year))
              if (!pay_year.status) {
                toastText = pay_year.message
              }
            }
            if (toastText) {
              vm.$toast.show(toastText)
              vm.bool = false
              vm.addonsSelected[safeid] = false
              vm.$forceUpdate()
            } else {
              vm.bool = true
            }
          }
        })
      }
      if (this.bool) {
        axios.post('http://cloud.ehuimeng.com/Prospectus/CreateBook3', postData)
        .then(function(response) {
          if (isMain) {
            if (vm.isBaseMoney && !vm.fuBaseMoney) {
              vm.insurance.period_money = response.data.data[safeid].main.list[1]['年缴保费']
            } else if (vm.isBaseMoney && vm.fuBaseMoney) {
              vm.insurance.period_money = response.data.data[safeid].main.list[1]['年缴保费']
              vm.insurance.money = response.data.data[safeid].base_money
            } else {
              vm.insurance.money = response.data.data[safeid].base_money
            }
            if (safeid !== '318') {
              vm.resetAddon()
            }
            //vm.checkMainFee(safeid)
          } else {
            vm.addonRes[safeid] = response.data.data[safeid].main.list[1]
            if (safeid === '332') {
              vm.cache.pay_money332 = vm.addonRes[safeid]['年缴保费']
            } else if (safeid === '333') {
              vm.cache.pay_money333 = vm.addonRes[safeid]['年缴保费']
            }
            //vm.setAddon(safeid)
            vm.$forceUpdate()
          }
        })
      }
      if (isMain) {
        this.mainIns = data
      } else {
        this.addonIns[safeid] = data
      }
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
      // 投被保人
      if (!this.checkMainForm()) {
        return
      }
      // 主险费用
      if (!this.checkMainFee(this.insurance.safe_id)) {
        return
      }
      // 校验成功
      var vm = this
      // 附加险
      var addonIns = []
      for (var k in vm.addonsSelected) {
        if (vm.addonsSelected[k] === true) {
          addonIns.push(vm.addonIns[k])
        } else if (mustSelected.indexOf(k) > -1) {
          if (k === '291') {
            this.$toast.show('【 附加金管家年金保险D款】附加险为必选')
          } else {
            this.$toast.show('附加险为必选')
          }
          return false
        }
      }
      if (this.addonIns.length < 1) {
        this.$toast.show('请先完成当前险种')
        return false
      }

      this.productsList.num = false
      this.productsList.name = this.insurance.name
      this.savePlayshow = false
      this.savefl = true
      Bus.$emit('getsavefl', this.savefl)
      Bus.$emit('getdataMain', this.mainIns)
      Bus.$emit('getdataAddon', this.addonIns)
    },
    xiugaiPlay() {
      if (this.uploading) {
        this.$toast.show('请勿连续点击')
        return false
      }
      this.uploading = true
      setTimeout(() => {
        this.uploading = false
      }, 1000)
      // 投被保人
      if (!this.checkMainForm()) {
        return
      }
      // 主险费用
      if (!this.checkMainFee(this.insurance.safe_id)) {
        return
      }
      // 校验成功
      var vm = this
      // 附加险
      var addonIns = []
      for (var k in vm.addonsSelected) {
        if (vm.addonsSelected[k] === true) {
          addonIns.push(vm.addonIns[k])
        } else if (mustSelected.indexOf(k) > -1) {
          this.$toast.show('附加险为必选')
          return false
        }
      }
      if (this.addonIns.length < 1) {
        this.$toast.show('请先完成当前险种')
        return false
      }

      this.productsList.num = false
      this.productsList.name = this.insurance.name
      this.xiugaiPlayshow = false
      this.savefl = true
      Bus.$emit('getsavefl', this.savefl)
      Bus.$emit('xiugaidataMain', this.mainIns)
      Bus.$emit('xiugaidataAddon', this.addonIns)
    }
  }
}
</script>
