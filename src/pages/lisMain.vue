<template>
  <div class="child-section">
    <div class="main">
      <div class="dis_setting">
        <div class="dis_setting_1">北京西站北广场采样站</div>
        <div class="dis_setting_2">退出登录</div>
      </div>

      <div class="search-list-role">
        <div class="search-list-role-1">
          <div class="s_center_t_item">今日采样数据</div>
          <div class="dis_setting_i">
            <div class="dis_setting_i_left">
              <div class="dis_setting_i_left_1">1200</div>
              <div class="dis_setting_i_left_2">录入总管数</div>
            </div>
            <div class="dis_setting_i_left">
              <div class="dis_setting_i_left_1">4</div>
              <div class="dis_setting_i_left_2">录入总箱数</div>
            </div>
          </div>
        </div>
      </div>

<div class="search-list-role">
  <div class="search-list-role-2">
            <div class="search-list-role-3" @click="scanQRCodeClick">
              <img class="icon_logo" src="../assets/img/icon_img_02.png" alt="" />
              <div class="search-list-role-3-1">扫描箱码</div>
              <div class="search-list-role-3-2">扫箱码后再绑试管</div>
            </div>
            <div class="search-list-role-3">
             <img class="icon_logo" src="../assets/img/icon_img_03.png" alt="" />
              <div class="search-list-role-3-1">已采集信息</div>
              <div class="search-list-role-3-2">试管信息</div>
            </div>
          </div>
      </div>

      <div class="empty_view"></div>

      <div class="view_bottom">
        <div class="view_bottom_1" @click="inputClick">无法识别箱码，<span style="color:#307FF5;">手动输入</span></div>
      </div>
    </div>

    <van-dialog
      v-model="isInput"
      showCancelButton
      :beforeClose="beforeClose1"
      confirmButtonColor='#307FF5'
      confirm-button-text="确认开箱"
    >
    <div class="dialog_item">
        <div class="dialog_item_title">手动输入箱码</div>
        <div class="bind_main_item">
          <div class="form-item">
            <div class="select-item input-item">
              <input
                v-model="boxCodeNumber"
                type="text"
                name="boxCodeNumber"
                placeholder="请输入箱码"
                :onkeyup="boxCodeNumber=boxCodeNumber.replace(/[^\w\.\/]/ig,'')"
              />
              <div class="clear_1" @click="clearboxCodeNumber" v-if="boxCodeNumber">
                <img class="icon_clear" src="../assets/img/icon_img_04.png" />
              </div>
            </div>
          </div>
        </div>
    </div>
    </van-dialog>

  </div>
</template>

<script>
import { updatePersonNum, getJSSDKHELP,conveyScan,getCheckedUserId } from "../request/api";
import { Toast } from "vant";
import wx from 'jweixin-module';
export default {
  name: "",
  components: {},
  data() {
    return {
      roleId: "",
      roleName: "",
      userId: "",
      appointment_person_num: 1,
      isInput: false,
      boxCodeNumber: ''
    };
  },
  created() {
    this.roleId = this.$route.query.id;
    this.roleName = this.$route.query.name;
    this.userId = this.$route.query.userId;
    console.log(this.roleId);
    console.log(this.roleName);
    console.log(this.userId);

  },
  mounted() {
    this.isWechat();
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
    // 扫描
   scanQRCodeClick() {
     
     this.$router.push({
        path: "/lisDetail",
        query:{id: this.roleId,name: this.roleName,userId: this.userId}
      });
    //  this.getScanQRCodeClick();
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
      let that = this;
      conveyScan({
        box_num: boxCodeNumber,
        userId: this.userId
      }).then((res) => {
        if (res.data.success) {
          that.bindInfo = {
            box_num: res.data.box_num,
            system_sum: res.data.system_sum,
            channel_name: res.data.channel_name,
            is_receive: res.data.is_receive,
          }
          that.isShow = true;
        } else {
            Toast(res.data.msg)
        }
      });
    },
    onClickLeft() {
      this.$router.back();
    },
    inputClick(){
      this.isInput = true;
    },
    beforeClose1(action, done) {
      let that = this;
      
        if(action === 'confirm') {
          if(that.boxCodeNumber){
            conveyScan({
              box_num: that.boxCodeNumber,
              userId: this.userId
            }).then((res) => {
              if (res.data.success) {
                that.isInput = false;
                that.boxCodeNumber = "";
                done();

                that.bindInfo = {
                  box_num: res.data.box_num,
                  system_sum: res.data.system_sum,
                  channel_name: res.data.channel_name,
                  is_receive: res.data.is_receive,
                }
              } else {
                  Toast(res.data.msg)
                  return done(false);//阻止关闭
              }
            });
          }else{
            Toast('请输入箱码号')
            return done(false);//阻止关闭
          }
        } else if(action === 'cancel') {
          that.bindInfo = '';
          that.boxCodeNumber = "";
          that.isInput = false;
          done() //关闭
        }
      
    },
    clearboxCodeNumber(){
      this.boxCodeNumber = '';
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

.dis_setting {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 30px;
}
.dis_setting_1 {
  font-size: 32px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
}

.dis_setting_2 {
  font-size: 28px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #307ff5;
}

.search-list-role {
  // height: 1110px;
  border: 0 none;
  // background-color: #FFFFFF;
  width: 100%;
  padding: 0px 30px;

  .search-list-role-1 {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 30px 20px;
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
    color: #333333;
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

.view_bottom_1{
  font-size: 32px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #666666;

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


</style>