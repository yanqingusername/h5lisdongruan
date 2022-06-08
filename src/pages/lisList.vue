<template>
  <div class="child-section">
    <!-- <Header>
      <div class="header-content">
        <div class="header-title">采样管收集管理</div>
        <div class="header-back">
          <div class="back" @click="handleTitleBack">
            <i class="iconfont icon-arrowthin" style="color: #999999;"></i>
          </div>
        </div>
      </div>
    </Header> -->
    <van-nav-bar
      title="上门预约管理台"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="main">
      <!-- <div class="item_center" @click.stop="clickPDF">样本箱转运系统使用说明</div> -->

      <div class="dis_item_center">
        <div class="s_center_view">
          <van-popover
            v-model="showVipStatus"
            trigger="click"
            :actions="vipStatusList"
            @select="onSelect"
            placement="bottom-start"
          >
            <template #reference>
              <div>
                <!-- <span style="color: #ec1f2d">{{ service_type }}</span>
                <van-icon name="arrow" /> -->
                <span class="s_center_t">{{service_type_text}}</span>
                <i class="el-icon-caret-bottom"></i>
              </div>
            </template>
          </van-popover>
        </div>
        <div class="s_center" @click="clickDateTime">
          <div class="s_center_t">{{currentDateText ? currentDateText : '全部日期'}}</div>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <div class="s_center_view" @click="cliclDate">
          <div class="s_center_t">{{sort_status == 0 ? '时间正序' : '时间倒序'}}</div>
          <i class="el-icon-caret-bottom" size="16"></i>
        </div>
      </div>

      <!-- <div class="t_center">
        <div class="s_center_t">全部日期：</div>
          <el-date-picker
            v-model="expect_date"
            type="date"
            placeholder="选择日期"
            @change="changeExpectDate">
          </el-date-picker>
      </div> -->

      <div class="t_center">
        <div class="s_center_t">筛选护士：</div>
        <div class="s_center_t_r" >
          <div class="s_center_t_r_v">
              <div :class="dataIndex == index ? 's_center_t_r_i':'s_center_t_r_i_default'" v-for="(item, index) in dataList"
            :key="index" @click="clickTRI(item,index)">{{item.person_name}}</div>
          </div>
        </div>
      </div>
      <div class="t_center">
        <div class="s_center_t">筛选状态：</div>
        <div class="s_center_t_r" >
          <div class="s_center_t_r_v">
              <div :class="statusIndex == index ? 's_center_t_r_i':'s_center_t_r_i_default'" v-for="(item, index) in statusList"
            :key="index" @click="clickStatus(item,index)">{{item.text}}</div>
          </div>
        </div>
      </div>

      <div class="view_selects">
        <div class="select-item input-item">
              <input
                v-model="vipPhoneNumber"
                type="text"
                name="vipPhoneNumber"
                placeholder="搜索手机号"
                :onkeyup="vipPhoneNumber=vipPhoneNumber.replace(/[^\w\.\/]/ig,'')"
              />
              <img src="../assets/images/icon_search.png"  class="searchBtn" @click="clickSearch"/>
            </div>
        <div class="s_select_t_r_i_default" @click="clickClose">清空筛选条件</div>
      </div>


      <div class="dis_setting">
        <div class="s_center_t">筛选后合计数据：{{instrumentList.length}}条</div>
        <div class="s_setting_t" style="color:#E06596;" @click="handleSetting"><van-icon name="setting-o" size="24" style="margin-right:4px;color:#E06596;"/>修改配置</div>
      </div>

       <div class="search-list-role" v-if="instrumentList.length>0">
          <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onDownLoad"
        >
          <div
            v-for="(item, index) in instrumentList"
            :key="index">
            <div class="search-result-view">
              <div class="dis_setting" style="padding: 0px 0px 8px 0px;">
                <div class="s_center_t_item" v-if="item.special_expect_date && item.special_expect_time_bucket">{{ item.special_expect_date }} {{item.special_expect_time_bucket}}</div>
                <div class="s_center_t_item" v-else>{{ item.expect_date }} {{item.expect_time_bucket ? item.expect_time_bucket : '未选择预约时间'}}</div>
                <!-- <div class="s_center_t_item" v-else>{{ '未选择预约时间' }}</div> -->
                <div class="s_setting_t_item" style="color:#E06596;">{{item.nurse_name_list ? item.nurse_name_list : '未安排护士'}}</div>
              </div>
              <div class="search-result-view-item" v-if="item.vip_person">
                <div class="search-result-view-left">联系人</div>
                <div class="search-result-view-right">{{item.vip_person}}</div>
              </div>
              <div class="search-result-view-item" v-if="item.vip_phone">
                <div class="search-result-view-left">手机号</div>
                <div class="search-result-view-right" @click="copyVipPhone(item.vip_phone)">{{item.vip_phone}}</div>
              </div>
              <div class="search-result-view-item" v-if="item.address" style="positon:relative;">
                <div class="search-result-view-left">上门地址</div>
                <div class="search-result-view-right" style="width: 63%;" @click="copyAddress(item.province,item.city,item.area,item.address)">{{item.province}}{{item.city}}{{item.area}}{{item.address}}</div>
                <div class="pic-img-view" @click="markOnAMAP(item)">
                  <img class="pic-img-icon" src="../assets/images/icon_position_red.png" alt="" />
                </div>
              </div>
              <div class="search-result-view-item" v-if="item.service_title">
                <div class="search-result-view-left">检测类型</div>
                <div class="search-result-view-right">{{item.service_title}}</div>
              </div>
              <div class="search-result-view-item" v-if="item.customer_url && item.address == ''">
                <div class="search-result-view-left">客户录入</div>
                <div class="search-result-view-right" @click="copyUrl('https://scldev.coyotebio-lab.com:8443/vue1/#/vipInfoCustom',item.appointment_vip_num)">请客户点击下面链接<span style="text-decoration-line: underline;color:blue">{{'https://scldev.coyotebio-lab.com:8443/vue1/#/vipInfoCustom?avipnum='}}{{item.appointment_vip_num}}</span>，填写预约信息。</div>
              </div>
              <div class="search-result-view-item" v-if="item.inspection_person_num">
                <div class="search-result-view-left">受检人数</div>
                <div class="search-result-view-right">{{item.inspection_person_num}}人</div>
              </div>
              <div class="search-result-view-item" v-if="item.remark">
                <div class="search-result-view-left">备注</div>
                <div class="search-result-view-right">{{item.remark}}</div>
              </div>

              <div class="dis_setting" style="padding: 10px 0px 0px 0px;">
                <div class="s_center_t_item" style="display:flex;">
                  <div>状态：</div>
                  <div class="s_setting_t_item" style="color:#408BE4;" v-if="item.appointment_vip_status == -1">{{'未录入'}}</div>
                  <div class="s_setting_t_item" style="color:#ec1f2d;" v-if="item.appointment_vip_status == 0">{{'等待确认'}}</div>
                  <div class="s_setting_t_item" style="color:#ec1f2d;" v-if="item.appointment_vip_status == 1">{{'待采样'}}</div>
                  <div class="s_setting_t_item" style="color:#408BE4;" v-if="item.appointment_vip_status == 2">{{'已完成'}}</div>
                  <div class="s_setting_t_item" style="color:#408BE4;" v-if="item.appointment_vip_status == 3">{{'客户缺席'}}</div>
                  <div class="s_setting_t_item" v-if="item.appointment_vip_status == 4">{{'已退款'}}</div>
                  <div class="s_setting_t_item" v-if="item.appointment_vip_status == 5" >{{'已删除'}}</div>
                </div>
                <div class="s_setting_t_item" style="display:flex;">
                  <!-- <div class="s_center_t_r_i" v-if="item.appointment_vip_status == 0 || item.appointment_vip_status == 1 || item.appointment_vip_status == 2" @click="clickVipInfo(item,index)">修改</div>
                  <div class="s_center_t_r_i" v-if="item.appointment_vip_status == -1" @click="clickVipInfo(item,index)">后台录入</div> -->
                  
                  <div class="s_center_t_r_i" v-if="item.appointment_vip_status == -1" @click="clickVipInfo(item,index)">后台录入</div>
                  <div class="s_center_t_r_i" v-else @click="clickVipInfo(item,index)">修改</div>

                  <div class="s_center_t_r_i" style="margin-right:0px;" @click="clickDelete(item,index)">删除</div>
                </div>
              </div>
            </div>
          </div>
        </van-list>
</van-pull-refresh>
          
      </div>
      <div class="search-list-role" style="background:#FFFFFF;" v-else>
        <div class="s_center_t_empty"><img src="../assets/images/nodata.png"  class="s_center_t_empty_img"/>暂无数据</div>
      </div>

      <div class="empty_view"></div>
      

      <div class="view_bottom">
        <div class="view_bottom_left" @click="clickTeam">+ 创建团体上门预约</div>
        <div class="view_bottom_right" @click="clickVip">+ 创建VIP上门预约</div>
      </div>
    </div>

    <van-dialog
      v-model="isShowVip"
      showCancelButton
      :beforeClose="beforeCloseVip"
      confirmButtonColor='#E06596'
      confirm-button-text="创建"
    >
    <div class="dialog_item">
        <div class="dialog_item_title">确定要创建一条VIP上门预约数据吗？</div>
    </div>
    </van-dialog>

    <van-dialog
      v-model="isShowTeam"
      showCancelButton
      :beforeClose="beforeCloseTeam"
      confirmButtonColor='#E06596'
      confirm-button-text="创建"
    >
    <div class="dialog_item">
        <div class="dialog_item_title">确定要创建一条团体上门预约数据吗？</div>
    </div>
    </van-dialog>

    <van-dialog
      v-model="isShowDelete"
      showCancelButton
      :beforeClose="beforeCloseDelete"
      confirmButtonColor='#E06596'
    >
    <div class="dialog_item">
        <div class="dialog_item_title">确定要删除该条预约吗？</div>
    </div>
    </van-dialog>



    <van-popup v-model="isShowDateTime" round position="bottom">
     
     <van-datetime-picker
  v-model="currentDate"
  type="date"
  title="选择年月日"
  @cancel="dateTimeCancel" 
  @confirm="dateTimeConfirm"
/>
    </van-popup>


  </div>
</template>

<script>
import Header from "../components/header.vue";
import { getAllVIPRecords,getNurseInfo,createVIPGroupRecord,createVIPFiveRecord,updateVIPInfoByNum } from "../request/api";
import { Notify,Toast,List,Button,Dialog,NavBar,DropdownMenu, DropdownItem } from "vant";
import wx from 'jweixin-module';
export default {
  name: "",
  components: {
    Header,
    [Dialog.Component.name]: Dialog.Component, //Dialog.Component写成这样才生效
    [Button.name]: Button,
  },
  data() {
    return {
      vipPhoneNumber:"",
      isShowDateTime: false,
      currentDate: new Date(),
      currentDateText:'',
      service_type:'',
      service_type_text:"全部上门类型",
      expect_date:'',
      sort_status: "0",

      showVipStatus: false,
      vipStatusList:[
        { text: "全部上门", value:'' },
        { text: "VIP上门", value:'0' },
        { text: "团体上门", value:'1' },
      ],
      show: false,
      dataList:[],
      dataIndex: 0,
      dataText: '全部',
      dataValue: '',
      statusIndex: 0,
      statusText: '全部',
      statusValue: '',
      statusList:[
        { text: '全部', value: '' },
        { text: '等待确认', value: '0' },
        { text: '待采样', value: '1' },
        { text: '已完成', value: '2' },
        { text: '客户缺席', value: '3' },
        { text: '未录入', value: '-1' },
      ],
      page: 1, //第几页
      limit: 30, //每页限制
      instrumentList: [],
      loading: false,
      finished: false,
      refreshing: false,
      roleId: 1,  
      isShowVip: false,
      isShowTeam: false,
      isShowDelete: false,
      roleName:'',
      userId: '',
      appointment_vip_num: '',
      locationMap: ''
    };
  },
  created() {
    this.roleId = this.$route.query.id;
    this.roleName = this.$route.query.name;
    this.userId = this.$route.query.userId;
    console.log(this.roleId)
    console.log(this.roleName)
    console.log(this.userId)

    
  },
  mounted() {
    this.isWechat();

    this.getNurseInfo();
    this.page = 1;
    this.instrumentList = [];
    this.getAllVIPRecords();

    this.initMap();
  },
  methods: {
    clickClose(){

      this.currentDateText = '';
      this.service_type =  '';
      this.service_type_text = "全部上门类型";
      this.sort_status = "0"
      this.dataIndex = 0;
      this.dataText = '全部';
      this.dataValue = '';
      this.statusIndex =  0;
      this.statusText = '全部';
      this.statusValue =  '';
      this.vipPhoneNumber = '';

      this.page = 1;
      this.instrumentList = [];
      this.getAllVIPRecords();

    },
    initMap() {
      let that = this;
      // var geolocation = new qq.maps.Geolocation(
      //   'RLWBZ-JD53U-OJHV6-27XHB-I5VKQ-I7F3H',
      //   "myapp"
      // );
      var geolocation = new qq.maps.Geolocation();
      geolocation.getLocation(
        postion => {
          that.locationMap = postion;
          console.log("定位",postion);
        },
        err => {
          console.log("定位失败");
        }
      );
    },
    markOnAMAP(item) {
      let that = this;
      if(item){
        let address = item.province+item.city+item.area+item.address+"";
        this.$jsonp("https://apis.map.qq.com/ws/geocoder/v1/?", {
          address: `${address}`, // 经纬度
          key: "RLWBZ-JD53U-OJHV6-27XHB-I5VKQ-I7F3H",
          output: "jsonp" // output必须jsonp   不然会超时
        }).then(res => {
          console.log(res, "腾讯地图");
          let locations = res.result.location;
          location.href = `https://apis.map.qq.com/tools/routeplan/eword=${item.address}&epointx=${locations.lat}&epointy=${locations.lng}&spointx=${that.locationMap.lat}&spointy=${that.locationMap.lng}?key=RLWBZ-JD53U-OJHV6-27XHB-I5VKQ-I7F3H&referer=myapp`;
        });
      }
      
    
      // location.href = `https://apis.map.qq.com/tools/routeplan/eword=${'丽泽桥丰顺驾校采样站'}&epointx=${'39.86985'}&epointy=${'116.307988'}&spointx=${'39.85856'}&spointy=${'116.28616'}?key=RLWBZ-JD53U-OJHV6-27XHB-I5VKQ-I7F3H&referer=myapp`;
    },
    getNurseInfo(){
      let that = this;
      getNurseInfo({}).then((res) => {
        if (res.data.success) {
          that.dataList = res.data.result;
          that.dataList.unshift({
            "id": "",
            "person_name": "全部",
            "person_phone": "",
            "role": "-1"
          });
        } else {
            Toast(res.data.msg)
        }
      });
    },
    onSelect(action) {
      Toast(action.text,action.value);
      this.service_type = action.value;
      if(action.value){
        this.service_type_text = action.text;
      }else{
        this.service_type_text = '全部上门类型';
      }

      this.page = 1;
      this.instrumentList = [];
      this.getAllVIPRecords();
    },
    changeExpectDate(value){
      // this.expect_date = value;
      console.log(this.expect_date)

      this.page = 1;
      this.instrumentList = [];
      this.getAllVIPRecords();
    },
    timeFormat(time) { // 时间格式化 2019-09-08
     let year = time.getFullYear();
     let month = time.getMonth() + 1;
      if(month<10){
        month = '0'+month;
      }
     let day = time.getDate();
     let hour = time.getHours();
     return year + '-' + month + '-' + day + '日';
    },
    cliclDate(){
      if(this.sort_status == 0){
        this.sort_status = '1';
      }else{
        this.sort_status = '0';
      }

      this.page = 1;
      this.instrumentList = [];
      this.getAllVIPRecords();
      
    },
    clickTRI(e,index){
      this.dataIndex = index;
      this.dataText = e.text;
      this.dataValue = e.id;

      this.page = 1;
      this.instrumentList = [];
      this.getAllVIPRecords();
    },
    clickStatus(e,index){
      this.statusIndex = index;
      this.statusText = e.text;
      this.statusValue = e.value;

      this.page = 1;
      this.instrumentList = [];
      this.getAllVIPRecords();
    },
    formatDate(date) {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    },
    onConfirm(date) {
      this.show = false;
      this.date = this.formatDate(date);
    },
    onClickLeft() {
      this.$router.back();
    },
    clickPDF() {
      this.$router.push({
        path: "/instrumentPDF"
      });
      return;
    },
    isWechat() {
      const ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/micromessenger/i) == 'micromessenger') {
        // return true;
        console.log('微信浏览器');
        this.scanQRJssdk();
      } else {
        console.log('普通浏览器,请在手机微信浏览器打开此页面');
        return false;
      }
    },
    // 初始化sdk配置
    async scanQRJssdk() {
      // alert(`url链接:${window.location.href}`);
	  const u = navigator.userAgent;
      const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; // Android
      const isIOS = navigator.platform.indexOf('iPhone') != -1;//ios
       let url = '';
      if (isAndroid) {
        url = location.href;
      }
      if (isIOS) {
        url = location.href.split('#')[0]; // hash模式下,#后面的部分如果带上ios中config会不对
      }
      const api = [];
      // 'qrCode','barCode'
      api.push('qrCode');
      api.push('barCode');
      // alert(url);
      const resData = await getJSSDKHELP({ url });	// 根据接口返回appId，timestamp等数据
      console.log('获取微信配置结果', resData);
      if (resData) {
        // alert(JSON.stringify(resData.data));
        wx.config({
          // beta: true,
          debug: false,
          appId: resData.data.appId,
          timestamp: resData.data.timestamp,
          nonceStr: resData.data.nonceStr,
          signature: resData.data.signature,
          jsApiList: ['checkJsApi', 'scanQRCode']
        });
        wx.ready(() => {
          wx.checkJsApi({
            jsApiList: ['scanQRCode'],
            success(res) {
              console.log('aaaa', res);
            }
          });
        });
        wx.error((res) => {
          alert(`出错了：${res.errMsg}`);// 这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然		后根据微信文档查询即可。
        });
      }
    },
    handleTitleBack() {
      this.$router.back();
    },
    getAllVIPRecords() {
      if (this.refreshing) {
          this.refreshing = false;
        }

      let that = this;
      getAllVIPRecords({
        page: that.page,
        limit: that.limit,
        service_type: that.service_type,
        expect_date: that.currentDateText,
        nurse_name_ids: that.dataValue,
        appointment_vip_status: that.statusValue,
        sort_status: that.sort_status,
        vip_phone: that.vipPhoneNumber
      }).then((res) => {
        if (res.data.success) {
          let instrumentList = that.instrumentList;
					instrumentList = that.page == 1 ? res.data.result : instrumentList.concat(res.data.result)

          that.loading = false;

          if(res && res.data && res.data.result.length > 0){
            that.page = that.page + 1;
          }else{
             that.finished = true;
          }
          
          that.instrumentList = instrumentList;

          that.instrumentList.sort((a, b) => {
            return a.appointment_vip_status == -1 ? -1 : 1;
          });
        } else {
            Toast(res.data.msg)
        }
      });
    },
    onDownLoad(){
      console.log(this.page)
      if(this.page > 1){
        this.getAllVIPRecords();
      }
    },
    onRefresh(){
      // 清空列表数据
      this.finished = false;
      this.page = 1;
      this.instrumentList = [];
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.getAllVIPRecords();
    },
    beforeCloseVip(action, done) {
      let that = this;
      if(action === 'confirm') {
        createVIPFiveRecord({}).then((res) => {
          if (res.data.success) {
            Toast(res.data.msg)
            that.isShowVip = false;
            that.page = 1;
            that.instrumentList = [];
            that.getAllVIPRecords();
            done()
          } else {
            Toast(res.data.msg)
            done(false);
          }
        });
      } else if(action === 'cancel') {
        that.isShowVip = false;
        done() //关闭
      }
    },
    beforeCloseTeam(action, done) {
      let that = this;
      if(action === 'confirm') {
        createVIPGroupRecord({}).then((res) => {
          if (res.data.success) {
            Toast(res.data.msg)
            that.isShowTeam = false;
            that.page = 1;
            that.instrumentList = [];
            that.getAllVIPRecords();
            done()
          } else {
            Toast(res.data.msg)
            done(false);
          }
        });
      } else if(action === 'cancel') {
        that.isShowTeam = false;
        done() //关闭
      }
      
    },
    beforeCloseDelete(action, done) {
      let that = this;
      if(action === 'confirm') {
        updateVIPInfoByNum({
          appointment_vip_num:that.appointment_vip_num
        }).then((res) => {
          if (res.data.success) {
            that.isShowDelete = false;
            that.page = 1;
            that.instrumentList = [];
            that.getAllVIPRecords();
            done()
          } else {
            Toast(res.data.msg)
            done(false);
          }
        });
      } else if(action === 'cancel') {
        that.isShowDelete = false;
        done() //关闭
      }
    },
    clickTeam(){
      this.isShowTeam = true;
    },
    clickVip(){
      this.isShowVip = true;
    },
    clickDelete(item,index){
      this.isShowDelete = true;
      console.log(item.appointment_vip_num)
      this.appointment_vip_num = item.appointment_vip_num
    },
    handleSetting(){
      this.$router.push({
        path: "/lisMain",
        query:{id: this.roleId,name: this.roleName,userId: this.userId}
      });
    },
    clickVipInfo(item,index){
      console.log('----.:',item,index);
      let appointment_vip_num = item.appointment_vip_num;
      // this.$router.push({
      //       path: "/lisInfoCustom",
      //       query:{avipnum:appointment_vip_num}
      //     });
      if(appointment_vip_num){
        if(item.service_type == 0){
          this.$router.push({
            path: "/lisInfo",
            query:{id: this.roleId,name: this.roleName,userId: this.userId,avipnum:appointment_vip_num}
          });
        }else {
          this.$router.push({
            path: "/lisInfoGroup",
            query:{id: this.roleId,name: this.roleName,userId: this.userId,avipnum:appointment_vip_num}
          });
        }
      }
    },
    copyVipPhone(item){
      // 模拟 输入框
        var cInput = document.createElement("input");
        cInput.value = item;
        document.body.appendChild(cInput);
        cInput.select(); // 选取文本框内容
        // 执行浏览器复制命令
        // 复制命令会将当前选中的内容复制到剪切板中（这里就是创建的input标签）
        // Input要在正常的编辑状态下原生复制方法才会生效
        document.execCommand("copy");
        Toast('复制成功')
        // 复制成功后再将构造的标签 移除
        document.body.removeChild(cInput);
    },
    copyAddress(province,city,area,address){
        // 模拟 输入框
        var cInput = document.createElement("input");
        cInput.value = province+city+area+address+"";
        document.body.appendChild(cInput);
        cInput.select(); // 选取文本框内容
        // 执行浏览器复制命令
        // 复制命令会将当前选中的内容复制到剪切板中（这里就是创建的input标签）
        // Input要在正常的编辑状态下原生复制方法才会生效
        document.execCommand("copy");
        Toast('复制成功')
        // 复制成功后再将构造的标签 移除
        document.body.removeChild(cInput);
    },
    copyUrl(url,vipnum){
      // 模拟 输入框
        var cInput = document.createElement("input");
        cInput.value = url + '?avipnum=' + vipnum;
        document.body.appendChild(cInput);
        cInput.select(); // 选取文本框内容
        // 执行浏览器复制命令
        // 复制命令会将当前选中的内容复制到剪切板中（这里就是创建的input标签）
        // Input要在正常的编辑状态下原生复制方法才会生效
        document.execCommand("copy");
        Toast('复制成功')
        // 复制成功后再将构造的标签 移除
        document.body.removeChild(cInput);
    },
    clickDateTime(){
      this.isShowDateTime = true;
    },
    dateTimeCancel(){
      this.isShowDateTime = false;
    },
    dateTimeConfirm(){
      this.currentDateText = this.timeFormat1(this.currentDate);
      console.log(this.currentDateText)
      this.isShowDateTime = false;

      this.page = 1;
      this.instrumentList = [];
      this.getAllVIPRecords();
    },
    timeFormat1(time) { // 时间格式化 2019-09-08
     let year = time.getFullYear();
     let month = time.getMonth() + 1;
      if(month<10){
        month = '0'+month;
      }
     let day = time.getDate();
      if(day<10){
        day = '0'+day;
      }

    return year + '年' + month + '月' + day + '日';
     },
    clickSearch(){
      this.page = 1;
      this.instrumentList = [];
      this.getAllVIPRecords();
    }
  },
};
</script>
<style scoped lang="scss">
.icon_logo {
  width: 40px;
  height: 40px;
}

.main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // padding-top: 30px;
}

.flex-between{
  display: flex;
    justify-content: center;
    align-items: center;
    width: 90%;
}

// .bind_main_item {
//   // width: 670px;
//   background: #ffffff;
//   border-radius: 12px;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   // align-items: center;
//   // margin-top: 40px;
//   padding: 30px;

//   .form-item {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     // margin-top: 15px;

//     .icon_login_text{
//       width: 30%;
//     }

//     input {
//       // margin-top: 5px;
//       width: 100%;
//       outline: none;
//       border: 1px solod #DDDDDD;
//       line-height: 35px;
//       background-color: #eee;
//       border-radius: 5px;
//       padding-left: 0px;
//     }
//     .select-item {
//       // display: flex;
//       // align-items: center;
//       // width: 100%;
      
//     }

//     .input-item {
//       display: flex;
//       justify-content: center;
//       align-items: center;

//       input {
//         width: 420px;
//          height: 80px;
//         background: #ffffff;
//         border-radius: 12px;
//         border: 1px solid #DDDDDD;
//         outline: none;
//         font-size: 28px;
//         font-family: PingFangSC-Regular, PingFang SC;
//         font-weight: 400;
//         color: #999999;
//         padding-left: 20px;
//       }

//       .icon_scan {
//         width: 40px;
//         height: 40px;
//       }
//     }
//   }
// }


.submit_view {
  display: flex;
  justify-content: center;
  align-items: center;
  //   margin-top: 20px;
  width: 90%;
  height: 88px;
  background: #E06596;
  border-radius: 12px;
  color: #ffffff;
  font-size: 32px;
  border: 1px solid #E06596;
}

.empty_view{
  height: 150px;
  width: 100%;
}

.view_bottom {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  position: fixed;
  bottom: 0px;
  z-index: 9;
  height: 120px;
  background: #FFFFFF;
}

.view_bottom_left {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 326px;
  height: 88px;
  background: #E06596;
  border-radius: 30px;
  border: 1px solid #E06596;
  font-size: 30px;
  color: #FFFFFF;
}

.view_bottom_right {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 326px;
  height: 88px;
  background: #E06596;
  border-radius: 30px;
  border: 1px solid #E06596;
  font-size: 30px;
  color: #FFFFFF;
}

.item_center{
  font-size: 32px;
  padding: 20px;
  color: #E06596;
}

.search-list-role{
  // height: 1110px;
  border: 0 none;
  background-color: #F5F5F5;
  width: 100%;
  padding: 0px 40px;
  // .search-result {
  //   height: 100%;
  //   overflow-x: hidden;
  //   overflow-y: auto;

    .search-result-view {
      display: flex;
      //   align-items: center;
      // justify-content: space-between;
      padding: 30px 30px;
  background-color: #FFFFFF;
  border-radius: 10px;
  margin-top: 30px;
  flex-direction: column;


  .search-result-view-item{
    width: 100%;
      display: flex;
    // justify-content: space-between;
    // align-items: center;
    padding: 10px 0px;
  

.search-result-view-left{
  width: 25%;
  font-size: 30px;
  color: #999999;
}

.search-result-view-right{
  width: 75%;
  font-size: 30px;
  word-break: break-all;
}

.pic-img-view{
  position: absolute;
  right: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;

  .pic-img-icon{
    width: 42px;
    height: 50px;
    
  }
}



}
      
    }

   
  // }
}



.dialog_item{
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 50px 0px;
    }

    .dialog_item_title{
      font-size: 36px;
      color: #333333;
      padding: 20px 50px;
    }

    .dialog_item_lable{
      font-size: 28px;
      color: #666666;
      margin-top: 10px;
    }

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
/*滑动轨道*/
::-webkit-scrollbar-track-piece {
  background-color: transparent;
  -webkit-border-radius: 6px;
}
// 下面是滑块
/*竖向滚动条*/
::-webkit-scrollbar-thumb:vertical {
  height: 5px;
  background-color: #ffffff;
  -webkit-border-radius: 6px;
}
/*横向滚动条*/
::-webkit-scrollbar-thumb:horizontal {
  width: 5px;
  background-color: #ffffff;
  -webkit-border-radius: 6px;
}

.dis_item_center{
  width: 100%;
      display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin: 0px 30px 0px 30px;
}

.s_center{
  display: flex;
  padding: 30px;
  align-items: center;
  justify-content: center;
}

.s_center_view{
  display: flex;
  padding: 10px 30px;
  align-items: center;
  justify-content: center;
  margin: 20px 0px;
}

.s_center_t{
  font-size: 28px;
}

.t_center{
  font-size: 32px;
  padding: 0px 56px 20px 56px;
  width: 100%;
  display: flex;
  align-items: center;
}
.s_center_t_r{
  width: 490px;
  display: flex;
  overflow: scroll;
}
.s_center_t_r_v{
  display: flex;
  // width: 100%;
}
.s_center_t_r_i{
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #E06596;
  font-size: 26px;
  padding: 10px 0px;
  width: 140px;
  color: #E06596;
  margin-right: 20px;
}

.s_center_t_r_i_default{
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #A1A1A1;
  font-size: 26px;
  padding: 10px 0px;
  width: 140px;
  color: #A1A1A1;
  margin-right: 20px;
}

.dis_setting{
  width: 100%;
      display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 50px 20px 50px;
}

.s_setting_t{
  display: flex;
    justify-content: center;
    align-items: center;
}

.s_center_t_item{
  font-size: 32px;
}

.s_setting_t_item{
  font-size: 32px;
}

.view_selects{
  font-size: 32px;
  padding: 0px 56px 20px 56px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;


    .input-item {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      input {
        width: 400px;
         height: 60px;
        background: #ffffff;
        border-radius: 12px;
        border: 1px solid #DDDDDD;
        outline: none;
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        padding-left: 20px;
      }

      .searchBtn {
        width: 60px;
        height: 60px;
        position:absolute;
        padding: 10px;
        right: 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #E06596;
      }
    }
}

.s_select_t_r_i_default{
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #E06596;
  font-size: 26px;
  padding: 10px 0px;
  height: 60px;
  width: 200px;
  color: #E06596;
  margin-right: 0px;
}

.s_center_t_empty{
  display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 80px;
    font-size: 32px;
}
.s_center_t_empty_img{
  width: 306px;
  height: 200px;
  margin-bottom: 30px;
}
</style>