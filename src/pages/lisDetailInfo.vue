<template>
  <div class="child-section">
    <div class="main">
      <div class="dis_setting_view" style="background:#FFFFFF;">
        <div class="dis_setting_1" @click.stop="clickSearch">
          <div class="dis_setting_1_1">请输入箱码</div>
          <div class="dis_setting_1_2" @click.stop="scanQRCodeClick">
            <img class="icon_delete" src="../assets/img/icon_img_07.png" alt="" />
          </div>
        </div>
      </div>

      <div class="dis_item_center">
        <div class="dis_item_center_1" @click="clickDateTime">
          <div class="dis_item_center_2">{{currentDateText}}</div>
          <van-icon name="arrow-down" size="16"/>
        </div>
        <div class="dis_item_center_3">
          <div class="dis_setting_1_1">箱数 {{box_sum}} 管数 {{sample_sum}}</div>
        </div>
      </div>

      <div class="dis_setting_view_tab">
        
          <div class="dis_setting_view_tab_1" :style="tabIndex == 0 ? 'color: #307FF5;':'color: #999999;'" @click="clickTabIndex('0')">全部</div>
          <div class="dis_setting_view_tab_1" :style="tabIndex == 3 ? 'color: #307FF5;':'color: #999999;'" @click="clickTabIndex('3')">待转运({{stay_transport_sum}})</div>
          <div class="dis_setting_view_tab_1" :style="tabIndex == 4 ? 'color: #307FF5;':'color: #999999;'" @click="clickTabIndex('4')">转运中({{transporting_sum}})</div>
          <div class="dis_setting_view_tab_1" :style="tabIndex == 5 ? 'color: #307FF5;':'color: #999999;'" @click="clickTabIndex('5')">已接收</div>

      </div>


      <div class="search-list-role" v-if="instrumentList.length>0">
        <div
            v-for="(item, index) in instrumentList"
            :key="index" @click="clickItem(item.box_num,item.status)">
            <div class="search-result-view">
              <div class="dis_setting" style="padding: 0px 0px 0px 0px;">
                <div class="s_center_t_item" style="display:flex;">
                  <div class="search-result-view-1">{{index+1}}.</div>
                  <div class="search-result-view-2">{{item.box_num}}</div>
                </div>
                <div class="search-result-view-3" style="display:flex;">
                  <div class="search-result-view-1">{{item.sample_num}}</div>
                  <div class="search-result-view-2" v-if="item.status == 1" style="color: #307FF5;">未封箱</div>
                  <div class="search-result-view-2" v-if="item.status == 2" style="color: #999999;">已封箱</div>
                  <div class="search-result-view-2" v-if="item.status == 3" style="color: #999999;">待转运</div>
                  <div class="search-result-view-2" v-if="item.status == 4" style="color: #999999;">转运中</div>
                  <div class="search-result-view-2" v-if="item.status == 5" style="color: #999999;">已接收</div>
                  <van-icon name="arrow" size="16"/>
                </div>
              </div>
            </div>
          </div>
      </div>

      <div class="empty_view"></div>
      

      <div class="view_bottom">
        <div class="view_bottom_left" @click="onClickLeft"><van-icon name="arrow-left" size="20" />返回</div>
        <div class="view_bottom_right"></div>
      </div>

    </div>

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
import { getJSSDKHELP,getAlreadySmapleInfo } from "../request/api";
import { Toast } from "vant";
import wx from 'jweixin-module';
export default {
  name: "",
  components: {},
  data() {
    return {
      tabIndex: 0,
      isShowSuccess: true,
      id: "",
      instrumentList:[],
      currentDateText: '',
      currentDate: new Date(),
      isShowDateTime: false,
      box_sum: 0,
      sample_sum: 0,
      stay_transport_sum: 0,
      transporting_sum: 0
    };
  },
  created() {
    document.title = '已采集信息';

    this.id = this.$route.query.id;
    this.currentDateText = this.timeFormat1(this.currentDate);
  },
  mounted() {
    this.isWechat();
    this.getAlreadySmapleInfo();
  },
  methods: {
    clickTabIndex(number){
      this.tabIndex = number;
      this.getAlreadySmapleInfo();
    },
    getAlreadySmapleInfo() {
      let that = this;
      getAlreadySmapleInfo({
        id: that.id,
        create_time: that.currentDateText,
        status: this.tabIndex == 0 ? '' : this.tabIndex
      }).then((res) => {
        if (res.data.success) {
          that.box_sum = res.data.box_sum;
          that.sample_sum = res.data.sample_sum;
          that.instrumentList = res.data.result;
          that.stay_transport_sum = res.data.stay_transport_sum;
          that.transporting_sum = res.data.transporting_sum;
         
        } else {
            Toast(res.data.msg)
        }
      });
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

    return year + '-' + month + '-' + day + '';
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
    clickSearch(){
      this.$router.push({
        path: "/lisDetailInfoSearch",
        query:{id: this.id,boxnum:''}
      });
    },
    // 扫描
   scanQRCodeClick() {
     this.getScanQRCodeClick();
    // this.getBindSearch('567890');
   },
    getScanQRCodeClick() {	// 点击的时候调起扫一扫功能呢
      const that = this;
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
        success(res) {
          const resultStrArr = res.resultStr.split(',');		
          // 转为数组时为了避免扫描一维码是返回CODE_128,20180528前面会添加一个CODE_128所以转为数组获		取最后一条就行了
          console.log(resultStrArr[resultStrArr.length - 1]); // 输出扫码信息
          that.result = resultStrArr[resultStrArr.length - 1];
          let boxCodeNumber = resultStrArr[resultStrArr.length - 1];
          if(boxCodeNumber){
            that.getBindSearch(boxCodeNumber);
          }
        },
        fail(res) {
          console.log('err', res);
        }
      });
    },
    /**
     * 
     */
    getBindSearch(boxCodeNumber) {
      this.$router.push({
        path: "/lisDetailInfoSearch",
        query:{id: this.id,boxnum: boxCodeNumber}
      });
    },
    onClickLeft() {
      this.$router.back();
    },
    clickItem(box_num,status){
      if(box_num && status){
        this.$router.push({
          path: "/lisDetailInfoBox",
          query:{id: this.id,boxnum: box_num,st:status}
        });
      }
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

      this.instrumentList = [];
      this.getAlreadySmapleInfo();
    },
  },
};
</script>
<style scoped lang="scss">
.child-section {
  background-color: #f5f5f5;
  height: 100%;
}

.main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  // padding-top: 30px;
}

.search-result-view {
      display: flex;
      //   align-items: center;
      // justify-content: space-between;
      padding: 30px 30px;
  background-color: #FFFFFF;
  border-radius: 10px;
  margin-top: 30px;
}

.search-result-view-1{
  font-size: 28px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #666666;

}

.search-result-view-2{
  font-size: 28px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #333333;
margin-left: 10px;

}

.search-result-view-3{
  display: flex;
  align-items: center;
color: #999999;
}

.dis_setting {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 30px;
}

.dis_setting_view{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 30px 0px 30px;
}
.dis_setting_view_tab{
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 0px 30px;
  background: #FFFFFF;
}
.dis_setting_view_tab_1{
  display: flex;
  align-items: center;
  font-size: 28px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #999999;
padding: 30px 10px;
}
.dis_setting_1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 690px;
height: 72px;
background: #F5F5F5;
border-radius: 12px;
}

.dis_setting_1_1 {
  display: flex;
  align-items: center;
  font-size: 28px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #999999;
padding-left: 20px;
}

.dis_setting_1_2{
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dis_setting_2 {
  font-size: 32px;
font-family: PingFangSC-Medium, PingFang SC;
font-weight: 500;
color: #333333;
}

.search-list-role {
  // height: 1110px;
  border: 0 none;
  // background-color: #FFFFFF;
  background-color: #F5F5F5;
  width: 100%;
  padding: 0px 30px;

  .search-list-role-1 {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 20px;
    background: #ffffff;
    border-radius: 20px;
  }

  .search-list-role-2{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 50px;
  }

  .search-list-role-3{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 332px;
    height: 332px;
    background: #FFFFFF;
    border-radius: 20px
  }

  .icon_logo{
    width: 80px;
    height: 80px;
  }

  .search-list-role-3-1{
    font-size: 36px;
font-family: PingFangSC-Medium, PingFang SC;
font-weight: 500;
color: #333333;
margin-top: 36px;
  }

  .search-list-role-3-2{
    font-size: 24px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #999999;
margin-top: 18px;
  }

  .s_center_t_item {
    font-size: 32px;
font-family: PingFangSC-Medium, PingFang SC;
font-weight: 500;
color: #307FF5;
  }

  .dis_setting_i {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
  }

  .dis_setting_i_left{
    width: 50%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  .dis_setting_i_left_1{
    font-size: 36px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
  }

  .dis_setting_i_left_2{
    margin-top: 8px;
    font-size: 28px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #999999;
  }

  .s_setting_t_item {
    font-size: 32px;
  }
}

.empty_view {
  height: 50px;
  width: 100%;
}

.view_bottom {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0px 30px;
}


.dialog_item{
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 50px 0px;
    }

    .dialog_item_title{
      font-size: 32px;
      color: #333333;
    }

    .dialog_item_lable{
      font-size: 28px;
      color: #666666;
      margin-top: 10px;
    }

    .bind_main_item {
  // width: 670px;
  background: #ffffff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  // align-items: center;
  // margin-top: 40px;
  padding: 30px;

  .form-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // margin-top: 15px;


    input {
      // margin-top: 5px;
      width: 100%;
      outline: none;
      border: 1px solod #DDDDDD;
      line-height: 35px;
      background-color: #eee;
      border-radius: 5px;
      padding-left: 0px;
    }
    .select-item {
      // display: flex;
      // align-items: center;
      // width: 100%;
      
    }

    .input-item {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      input {
        width: 520px;
         height: 80px;
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

      .icon_scan {
        width: 40px;
        height: 40px;
      }
    }
  }
}

.clear_1 {
  position: absolute;
  padding: 16px;
  right: 0px;
  font-size: 32px;
}


.icon_clear {
  width: 32px;
  height: 32px;
}

.icon_delete{
  width: 36px;
  height: 36px;
}


.empty_view{
  height: 180px;
  width: 100%;
  background: #F5F5F5;
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
  // justify-content: center;
  align-items: center;
  width: 184px;
  height: 88px;
  background: #FFFFFF;
  font-size: 32px;
  color: #666666;
}

.view_bottom_right {
  display: flex;
  justify-content: center;
  align-items: center;
 width: 506px;
height: 88px;
background: #FFFFFF;
border-radius: 16px;

  border: 1px solid #FFFFFF;
  font-size: 30px;
  color: #FFFFFF;
}


  .icon_success{
    margin-top: 104px;
    width: 104px;
    height: 104px;
  }
  .div_success_1{
    margin-top: 40px;
    font-size: 40px;
font-family: PingFangSC-Medium, PingFang SC;
font-weight: 500;
color: #333333;
  }
  .div_success_2{
margin-top: 0px;
font-size: 28px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #666666;
  }
  .div_success_3{
    margin-top: 40px;
font-size: 28px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #666666;
  }

.empty_view_1 {
  height: 120px;
  width: 100%;
}

.view_bottom_1 {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  // position: fixed;
  // bottom: 50px;
  z-index: 9;
  height: 120px;
}

.view_bottom_left_1 {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 690px;
  height: 98px;

background: #307FF5;
  border-radius: 16px;
  border: 1px solid #307FF5;
  font-size: 32px;
  color: #ffffff;
}

.dis_item_center{
  width: 100%;
      display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0px 30px 0px 30px;
    background: #FFFFFF;
}

.dis_item_center_1{
  display: flex;
  padding: 30px;
  align-items: center;
  justify-content: center;
}
.dis_item_center_2{
  font-size: 28px;
}

.dis_item_center_3{
  display: flex;
  padding: 10px 30px;
  align-items: center;
  justify-content: center;
  margin: 20px 0px;
}
</style>