<template>
  <div class="child-section">
    <div class="main">
      <div class="dis_setting_view" style="background:#FFFFFF;">
        <div class="dis_setting_1" @click.stop="clickSearch">
          <div class="dis_setting_1_1">请输入试管条码</div>
          <div class="dis_setting_1_2" @click.stop="scanQRCodeClick">
            <img class="icon_delete" src="../assets/img/icon_img_07.png" alt="" />
          </div>
        </div>
      </div>
     
      <div class="dis_item_center">
        <div class="dis_item_center_3">
          <div class="dis_setting_1_1" style="padding-left:0px;">管数 {{instrumentList.length}}</div>
        </div>
        <div class="dis_item_center_3">
          <div class="dis_setting_1_1" style="padding-left:0px;" v-if="status==1">状态 未封箱</div>
          <div class="dis_setting_1_1" style="padding-left:0px;" v-if="status==2">状态 已封箱</div>
          <div class="dis_setting_1_1" style="padding-left:0px;" v-if="status==3">状态 待转运</div>
          <div class="dis_setting_1_1" style="padding-left:0px;" v-if="status==4">状态 转运中</div>
          <div class="dis_setting_1_1" style="padding-left:0px;" v-if="status==5">状态 已接收</div>
        </div>
      </div>

      <div class="dis_item_center" v-if="create_time">
        <div class="dis_item_center_6">
          <div class="dis_setting_1_1" style="padding-left:0px;">开箱时间 {{create_time}}</div>
        </div>
      </div>

      <div class="dis_item_center" v-if="isShowDiv && close_time">
        <div class="dis_item_center_6">
          <div class="dis_setting_1_1" style="padding-left:0px;">封箱时间 {{close_time}}</div>
        </div>
      </div>

      <div class="dis_item_center" v-if="isShowDiv">
        <div class="dis_item_center_6" v-if="receive_time">
          <div class="dis_setting_1_1" style="padding-left:0px;">接收时间 {{receive_time}}</div>
        </div>
        <div class="dis_item_center_6" v-if="receive_person_name">
          <div class="dis_setting_1_1" style="padding-left:0px;">接收人 {{receive_person_name}}</div>
        </div>
      </div>

      <div class="dis_item_center" v-if="isShowDiv">
        <div class="dis_item_center_6" v-if="convey_time">
          <div class="dis_setting_1_1" style="padding-left:0px;">转运时间 {{convey_time}}</div>
        </div>
        <div class="dis_item_center_6" v-if="conveyer_person_name">
          <div class="dis_setting_1_1" style="padding-left:0px;">转运人 {{conveyer_person_name}}</div>
        </div>
      </div>
      

      <div class="dis_item_center" @click="clickShowDiv">
        <div class="dis_item_center_5" v-if="isShowDiv">
          <van-icon name="arrow-up" size="20"/>
          <div class="dis_setting_1_1" style="padding-left:0px;">收起</div>
        </div>
        <div class="dis_item_center_5" v-else>
          <van-icon name="arrow-down" size="20"/>
          <div class="dis_setting_1_1" style="padding-left:0px;">展开</div>
        </div>
      </div>


      <div class="search-list-role" v-if="instrumentList.length>0">
        <div
            v-for="(item, index) in instrumentList"
            :key="index">
            <div class="search-result-view">
              <div class="dis_setting" style="padding: 0px 0px 0px 0px;">
                <div class="s_center_t_item" style="display:flex;">
                  <div class="search-result-view-1">{{index+1}}.</div>
                  <div class="search-result-view-2">{{item.sample_id}}</div>
                </div>
                <div class="search-result-view-3" style="display:flex;">
                  <div class="search-result-view-1">{{item.create_time}}</div>
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

  </div>
</template>

<script>
import { getJSSDKHELP,getExpandSampleInfoDetail,getSampleBoxInfoDetail } from "../request/api";
import { Toast } from "vant";
import wx from 'jweixin-module';
export default {
  name: "",
  components: {},
  data() {
    return {
      id: "",
      boxnum: "",
      status: "",
      isShowDiv: false,
      instrumentList:[],
      conveyer_person_name: "",//转运人
      convey_time: "",//转运时间
      receive_person_name: "",//接收人
      receive_time: "",//接收时间
      close_time: "",//封箱时间
      create_time: "",//开箱时间
    };
  },
  created() {
    document.title = this.boxnum + "箱码详情";
    
    // this.id = this.$route.query.id;
    // this.boxnum = this.$route.query.boxnum;
    // this.status = this.$route.query.st;

    this.id = localStorage.getItem('lisId');
    this.boxnum = localStorage.getItem('lisBoxnum');
    this.status = localStorage.getItem('lisStatus');
   
  },
  mounted() {
    this.isWechat();

    this.getExpandSampleInfoDetail();
    this.getSampleBoxInfoDetail();
  },
  methods: {
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
    getExpandSampleInfoDetail(){
      let that = this;
      getExpandSampleInfoDetail({
        box_num: that.boxnum,
        id: that.id,
        status: that.status == 3 ? '' : that.status
      }).then((res) => {
        if (res.data.success) {
          if(res.data.result && res.data.result.length > 0 ){
            let item = res.data;
            that.conveyer_person_name = item.conveyer_person_name;
            that.convey_time = item.convey_time;
            that.receive_person_name = item.receive_person_name;
            that.receive_time = item.receive_time;
            that.close_time = item.close_time;
            that.create_time = item.create_time;
          }
        } else {
          Toast(res.data.msg)
        }
      });
    },
    getSampleBoxInfoDetail(){
      let that = this;
      getSampleBoxInfoDetail({
        box_num: that.boxnum,
        id: that.id,
        status: that.status
      }).then((res) => {
        if (res.data.success) {
          that.instrumentList = res.data.result;
        } else {
          Toast(res.data.msg)
        }
      });
    },
    clickSearch(){
      localStorage.setItem('lisSeaSampleid',"");
      this.$router.push({
        path: "/lisDetailInfoBoxSearch",
        // query:{id: this.id,sampleid:''}
      });
    },
    // 扫描
   scanQRCodeClick() {
     this.getScanQRCodeClick();
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
      localStorage.setItem('lisSeaSampleid',boxCodeNumber);
      this.$router.push({
        path: "/lisDetailInfoBoxSearch",
        // query:{id: this.id,sampleid:boxCodeNumber}
      });
    },
    onClickLeft() {
      this.$router.back();
    },
    clickShowDiv(){
      if(this.isShowDiv){
        this.isShowDiv = false;
      }else{
        this.isShowDiv = true;
      }
    }
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
  padding: 30px 30px 10px 30px;
  align-items: center;
  justify-content: center;
}
.dis_item_center_4{
  display: flex;
  padding: 0px 30px 0px 30px;
  align-items: center;
  justify-content: center;
  margin: 0px 0px;
  color: #999999;
}
.dis_item_center_5{
  display: flex;
  padding: 20px 30px 20px 30px;
  align-items: center;
  justify-content: center;
  margin: 0px 0px;
  color: #999999;
}
.dis_item_center_6{
  display: flex;
  padding: 8px 30px 8px 30px;
  align-items: center;
  justify-content: center;
  margin: 0px 0px;
  color: #999999;
}
</style>