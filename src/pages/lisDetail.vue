<template>
  <div class="child-section">
    <div class="main" v-if="isShowSuccess">
      <div class="dis_setting">
        <div class="dis_setting_1">
          <div class="dis_setting_1_1">箱码：{{boxnum}}<img v-if="instrumentList.length <=0" @click="clickDelete" class="icon_delete" src="../assets/img/icon_img_05.png" alt=""/>
          </div>
          <div class="dis_setting_1_2">开箱时间：{{boxnumTime}}</div>
        </div>
        <div class="dis_setting_2">{{instrumentList.length}}/{{boxnumMax}}</div>
      </div>

      <div class="search-list-role" @click="scanQRCodeClick">
        <div class="search-list-role-1">
          <div class="s_center_t_item"><van-icon name="plus" /> 添加试管</div>
        </div>
      </div>

      <div class="search-list-role" v-if="instrumentList.length > 0">
        <div
          v-for="(item, index) in instrumentList"
          :key="index"
          @click="clickItem"
        >
          <van-swipe-cell
            :before-close="beforeDeleteClose"
            :name="item.sample_id"
          >
            <div class="search-result-view">
              <div class="dis_setting" style="padding: 0px 0px 0px 0px">
                <div class="s_center_t_item" style="display: flex">
                  <div class="search-result-view-1">{{ index+1 }}.</div>
                  <div class="search-result-view-2">{{ item.sample_id }}</div>
                </div>
                <div class="search-result-view-3" style="display: flex">{{ item.create_time }}</div>
              </div>
            </div>
            <template #right>
              <van-button square type="danger" text="删除" />
            </template>
          </van-swipe-cell>
        </div>
      </div>

      <div class="empty_view"></div>

      <div class="view_bottom">
        <div class="view_bottom_left" @click="onClickLeft1">
          <van-icon name="arrow-left" size="20" />返回
        </div>
        <div class="view_bottom_right" @click="clickDown">封箱（{{instrumentList.length}}/{{boxnumMax}}）</div>
      </div>
    </div>
    <div class="main" v-else>
      <img class="icon_success" src="../assets/img/icon_img_06.png" alt="" />
      <div class="div_success_1">封箱成功</div>
      <div class="div_success_3">箱码</div>
      <div class="div_success_2">{{successboxnum}}</div>
      <div class="div_success_3">试管数量</div>
      <div class="div_success_2">{{successnum}}</div>
      <div class="empty_view_1"></div>

      <div class="view_bottom_1">
        <div class="view_bottom_left_1" @click="clickNewScan">扫描新箱码</div>
        <div class="view_bottom_left_2" @click="onClickLeft">返回首页</div>
      </div>
    </div>

    <van-dialog
      v-model="isDelete"
      showCancelButton
      :beforeClose="beforeDelete"
      confirmButtonColor="#307FF5"
      confirm-button-text="确认"
      cancel-button-text="取消"
    >
      <div class="dialog_item">
        <div class="dialog_item_title2">确认删除该箱码吗？</div>
        <div class="dialog_item_title3">删除后可再次扫码使用</div>
      </div>
    </van-dialog>

    <van-dialog
      v-model="isMaxBox"
      showCancelButton
      :beforeClose="beforeMaxBox"
      confirmButtonColor="#307FF5"
      confirm-button-text="立即封箱"
      cancel-button-text="取消"
    >
      <div class="dialog_item">
        <div class="dialog_item_title1">已达最大封箱数量，请先封箱</div>
      </div>
    </van-dialog>

    <van-dialog
      v-model="isSure"
      showCancelButton
      :beforeClose="beforeSure"
      confirmButtonColor="#307FF5"
      confirm-button-text="确认"
      cancel-button-text="取消"
    >
      <div class="dialog_item">
        <div class="dialog_item_title2">确认封箱吗？</div>
        <div class="dialog_item_title3">封管后将结束该试管绑定任务</div>
      </div>
    </van-dialog>

    <van-dialog
      v-model="isBack"
      showCancelButton
      :beforeClose="beforeBack"
      confirmButtonColor="#307FF5"
      confirm-button-text="立即封箱"
      cancel-button-text="直接返回"
    >
      <div class="dialog_item">
        <div class="dialog_item_title2">箱码还未封箱，确认返回吗？</div>
        <div class="dialog_item_title3">返回后数据会自动保存</div>
      </div>
    </van-dialog>

    <van-dialog
      v-model="isShowBox"
      :beforeClose="beforeGoDetail"
      confirmButtonColor="#307FF5"
      confirm-button-text="去封箱"
      theme="round"
    >
      <div class="dialog_item">
        <div class="dialog_item_title1">存在未封箱的箱码，请先封箱，否则无法使用新箱码</div>
      </div>
    </van-dialog>

    
  </div>
</template>

<script>
import {
  deleteSampleBoxInfo,
  getSampleBoxInfo,
  getJSSDKHELP,
  checkSampleTube,
  addSampleTubeInfo,
  closeSampleBox,
  checkSampleBoxStatus,
  checkSampleBoxStatusIsClose,
  startScanSampleBox,
  deleteSampleTubeInfo
} from "../request/api";
import {
  Notify,
  Toast,
  List,
  Button,
  Dialog,
  NavBar,
  DropdownMenu,
  DropdownItem,
} from "vant";
import wx from "jweixin-module";
export default {
  name: "",
  components: {
    [Dialog.Component.name]: Dialog.Component, //Dialog.Component写成这样才生效
  },
  data() {
    return {
      isShowBox: false,
      isBack: false,
      isSure: false,
      isMaxBox: false,
      isDelete: false,
      isShowSuccess: true,
      id: "",
      boxnum:"",
      boxnumTime:"",
      boxnumMax: 0,
      channel_id: '',
      instrumentList: [],
      successboxnum: 0,
      successnum:0
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.boxnum = this.$route.query.boxnum;
    console.log(this.id);
    console.log(this.boxnum);
  },
  mounted() {
    this.isWechat();
    this.getSampleBoxInfo();
  },
  methods: {
    isWechat() {
      const ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/micromessenger/i) == "micromessenger") {
        // return true;
        console.log("微信浏览器");
        this.scanQRJssdk();
      } else {
        console.log("普通浏览器,请在手机微信浏览器打开此页面");
        return false;
      }
    },
    // 初始化sdk配置
    async scanQRJssdk() {
      // alert(`url链接:${window.location.href}`);
      const u = navigator.userAgent;
      const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; // Android
      const isIOS = navigator.platform.indexOf("iPhone") != -1; //ios
      let url = "";
      if (isAndroid) {
        url = location.href;
      }
      if (isIOS) {
        url = location.href.split("#")[0]; // hash模式下,#后面的部分如果带上ios中config会不对
      }
      const api = [];
      // 'qrCode','barCode'
      api.push("qrCode");
      api.push("barCode");
      // alert(url);
      const resData = await getJSSDKHELP({ url }); // 根据接口返回appId，timestamp等数据
      console.log("获取微信配置结果", resData);
      if (resData) {
        // alert(JSON.stringify(resData.data));
        wx.config({
          // beta: true,
          debug: false,
          appId: resData.data.appId,
          timestamp: resData.data.timestamp,
          nonceStr: resData.data.nonceStr,
          signature: resData.data.signature,
          jsApiList: ["checkJsApi", "scanQRCode"],
        });
        wx.ready(() => {
          wx.checkJsApi({
            jsApiList: ["scanQRCode"],
            success(res) {
              console.log("aaaa", res);
            },
          });
        });
        wx.error((res) => {
          alert(`出错了：${res.errMsg}`); // 这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然		后根据微信文档查询即可。
        });
      }
    },
    getSampleBoxInfo(){
      let that = this;
      getSampleBoxInfo({
        box_num: that.boxnum,
        id: this.id,
      }).then((res) => {
        if (res.data.success) {
          console.log(res.data.result)
          if(res.data.result && res.data.result.length > 0){
            let item = res.data.result[0];
            that.boxnum = item.box_num;
            that.boxnumTime = item.create_time;
            that.boxnumMax = item.max_sum;
            that.channel_id = item.channel;
          }
          that.instrumentList = res.data.listData;
        } else {
          Toast(res.data.msg);
        }
      });
    },
    // 扫描
    scanQRCodeClick() {
      this.getScanQRCodeClick();
      // this.checkSampleTube('111111111111119');
    },
    getScanQRCodeClick() {
      // 点击的时候调起扫一扫功能呢
      const that = this;
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success(res) {
          const resultStrArr = res.resultStr.split(",");
          // 转为数组时为了避免扫描一维码是返回CODE_128,20180528前面会添加一个CODE_128所以转为数组获		取最后一条就行了
          console.log(resultStrArr[resultStrArr.length - 1]); // 输出扫码信息
          that.result = resultStrArr[resultStrArr.length - 1];
          let boxCodeNumber = resultStrArr[resultStrArr.length - 1];
          if (boxCodeNumber) {
            that.checkSampleTube(boxCodeNumber);
          }
        },
        fail(res) {
          console.log("err", res);
        },
      });
    },
    /**
     *
     */
    checkSampleTube(boxCodeNumber) {
      let that = this;
      checkSampleTube({
        sample_id: boxCodeNumber
      }).then((res) => {
        if (res.data.success) {
          that.addSampleTubeInfo(boxCodeNumber);
        } else {
          Toast(res.data.msg);
        }
      });
    },
    addSampleTubeInfo(sample_id) {
      let that = this;
      addSampleTubeInfo({
        box_num: that.boxnum,
        id: that.id,
        sample_id: sample_id,
        channel_id: that.channel_id
      }).then((res) => {
        if (res.data.success) {
          if(res.data.can_add == 0){
            that.getSampleBoxInfo();
          }else{
            that.isMaxBox = true;
          }
        } else {
          Toast(res.data.msg);
        }
      });
    },
    onClickLeft() {
      this.$router.back();
    },
    clickDown() {
      if(this.instrumentList.length > 0){
        this.isSure = true;
      }else{
        this.closeSetSampleBox();
      }
    },
    closeSetSampleBox(){
      let that = this;
        closeSampleBox({
          box_num: that.boxnum,
          id: that.id
        }).then((res) => {
          if (res.data.success) {
            Toast(res.data.msg)
            that.isShowSuccess = false;
            if(res.data.result && res.data.result.length > 0){
              let item = res.data.result[0];
              that.successboxnum = item.box_num;
              that.successnum = item.sample_num;
            }
          } else {
            Toast(res.data.msg)
          }
        });
    },
    clickNewScan() {
      this.checkSampleBoxStatusIsClose();
    },
    checkSampleBoxStatusIsClose() {
      let that = this;
      checkSampleBoxStatusIsClose({
        id: that.id,
      }).then((res) => {
        if (res.data.success) {
          if (res.data.is_exist == 0) {
            that.isShowBox = true;
            that.boxnum = res.data.box_num;
          } else {
            that.getScanQRCodeClick2();
            // that.checkSampleBoxStatus('456789');
            // Toast(res.data.msg);
          }
        } else {
          Toast(res.data.msg);
        }
      });
    },
    getScanQRCodeClick2() {
      // 点击的时候调起扫一扫功能呢
      let that = this;
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success(res) {
          const resultStrArr = res.resultStr.split(",");
          // 转为数组时为了避免扫描一维码是返回CODE_128,20180528前面会添加一个CODE_128所以转为数组获		取最后一条就行了
          console.log(resultStrArr[resultStrArr.length - 1]); // 输出扫码信息
          that.result = resultStrArr[resultStrArr.length - 1];
          let boxCodeNumber = resultStrArr[resultStrArr.length - 1];
          if (boxCodeNumber) {
            that.checkSampleBoxStatus(boxCodeNumber);
          }
        },
        fail(res) {
          console.log("err", res);
        },
      });
    },
    checkSampleBoxStatus(boxCodeNumber) {
      let that = this;
      checkSampleBoxStatus({
        box_num: boxCodeNumber,
      }).then((res) => {
        if(res){
          if (res.data.success) {
            that.startScanSampleBox(boxCodeNumber);
          } else {
            Toast(res.data.msg);
          }
        } else {
          Toast("网络不稳定，请重试");
        }
      });
    },
    startScanSampleBox(boxCodeNumber) {
      let that = this;
      startScanSampleBox({
        box_num: boxCodeNumber,
        // max_sum:max_sum,
        id: that.id,
        channel_id: that.channel_id
      }).then((res) => {
        if(res){
          if (res.data.success) {
            that.isShowSuccess = true;
            that.id = that.id;
            that.boxnum = boxCodeNumber;
            that.getSampleBoxInfo();
          } else {
            Toast(res.data.msg);
          }
        } else {
          Toast("网络不稳定，请重试");
        }
      });
    },
    beforeGoDetail(action, done) {
      let that = this;
      if (action === "confirm") {
        that.isShowBox = false;
        that.isShowSuccess = true;
        that.id = that.id;
        that.boxnum = that.boxnum;
        that.getSampleBoxInfo();
        done(); //关闭
      } else if (action === "cancel") {
        that.isShowBox = false;
        done(); //关闭
      }
    },
    clickItem() {
      
    },
    clickDelete() {
      this.isDelete = true;
    },
    beforeDelete(action, done) {
      let that = this;

      if (action === "confirm") {
        that.isDelete = false;
        deleteSampleBoxInfo({
          box_num: that.boxnum
        }).then((res) => {
          if (res.data.success) {
            Toast(res.data.msg)
            that.isDelete = false;
            done();
            that.onClickLeft();
          } else {
            Toast(res.data.msg)
            return done(false);//阻止关闭
          }
        }).catch(()=>{
          return done(false); //阻止关闭
        });
      } else if (action === "cancel") {
        that.isDelete = false;
        done(); //关闭
      }
    },
    beforeMaxBox(action, done) {
      let that = this;

      if (action === "confirm") {
        closeSampleBox({
          box_num: that.boxnum,
          id: that.id
        }).then((res) => {
          if (res.data.success) {
            Toast(res.data.msg)
            that.isMaxBox = false;
            that.isShowSuccess = false;
            if(res.data.result && res.data.result.length > 0){
              let item = res.data.result[0];
              that.successboxnum = item.box_num;
              that.successnum = item.sample_num;
            }
            done();
          } else {
              Toast(res.data.msg)
              return done(false);//阻止关闭
          }
        });
      } else if (action === "cancel") {
        that.isMaxBox = false;
        done(); //关闭
      }
    },
    beforeSure(action, done) {
      let that = this;

      if (action === "confirm") {
        closeSampleBox({
          box_num: that.boxnum,
          id: that.id
        }).then((res) => {
          if (res.data.success) {
            Toast(res.data.msg)
            that.isSure = false;
            that.isShowSuccess = false;
            if(res.data.result && res.data.result.length > 0){
              let item = res.data.result[0];
              that.successboxnum = item.box_num;
              that.successnum = item.sample_num;
            }
            done();
          } else {
              Toast(res.data.msg)
              return done(false);//阻止关闭
          }
        });
      } else if (action === "cancel") {
        that.isSure = false;
        done(); //关闭
      }
    },
    onClickLeft1(){
      this.isBack = true;
    },
    beforeBack(action, done) {
      let that = this;
      if (action === "confirm") {
        closeSampleBox({
          box_num: that.boxnum,
          id: that.id
        }).then((res) => {
          if (res.data.success) {
            Toast(res.data.msg)
            that.isBack = false;
            that.isShowSuccess = false;
            if(res.data.result && res.data.result.length > 0){
              let item = res.data.result[0];
              that.successboxnum = item.box_num;
              that.successnum = item.sample_num;
            }
            done();
          } else {
              Toast(res.data.msg)
              return done(false);//阻止关闭
          }
        });
      } else if (action === "cancel") {
        that.isBack = false;
        that.onClickLeft();
        done(); //关闭
      }
    },
    beforeDeleteClose({ name, position, instance }) {
      switch (position) {
        case "left":
        case "cell":
        case "outside":
          instance.close();
          break;
        case "right":
          console.log("---->:", name);
          Dialog.confirm({
            message: "确认删除该试管吗？",
            confirmButtonColor: "#307FF5",
          }).then(() => {
              deleteSampleTubeInfo({
                sample_id: name,
                id: that.id
              }).then((res) => {
                if (res.data.success) {
                  Toast(res.data.msg)
                  that.getSampleBoxInfo();
                } else {
                  Toast(res.data.msg)
                }
              });
              instance.close();
            })
            .catch(() => {
              instance.close();
            });
          break;
      }
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
  background-color: #ffffff;
  border-radius: 10px;
  margin-top: 30px;
}

.search-result-view-1 {
  font-size: 28px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #666666;
}

.search-result-view-2 {
  font-size: 28px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  margin-left: 10px;
}

.search-result-view-3 {
  font-size: 28px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
}

.dis_setting {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 30px;
}
.dis_setting_1 {
  display: flex;
  // align-items: center;
  flex-direction: column;
}

.dis_setting_1_1 {
  display: flex;
  align-items: center;
  font-size: 32px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
}

.dis_setting_1_2 {
  margin-top: 10px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #666666;
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
  background-color: #f5f5f5;
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

  .search-list-role-2 {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 50px;
  }

  .search-list-role-3 {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 332px;
    height: 332px;
    background: #ffffff;
    border-radius: 20px;
  }

  .icon_logo {
    width: 80px;
    height: 80px;
  }

  .search-list-role-3-1 {
    font-size: 36px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    margin-top: 36px;
  }

  .search-list-role-3-2 {
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
    color: #307ff5;
  }

  .dis_setting_i {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
  }

  .dis_setting_i_left {
    width: 50%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  .dis_setting_i_left_1 {
    font-size: 36px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
  }

  .dis_setting_i_left_2 {
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

.dialog_item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 50px 0px;
}

.dialog_item_title {
  font-size: 32px;
  color: #333333;
}

.dialog_item_lable {
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
      border: 1px solod #dddddd;
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
        border: 1px solid #dddddd;
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

.icon_delete {
  width: 56px;
  height: 56px;
  margin-left: 20px;
}

.empty_view {
  height: 180px;
  width: 100%;
  background: #f5f5f5;
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
  background: #ffffff;
}

.view_bottom_left {
  display: flex;
  // justify-content: center;
  align-items: center;
  width: 184px;
  height: 88px;
  background: #ffffff;
  font-size: 32px;
  color: #666666;
}

.view_bottom_right {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 506px;
  height: 88px;
  background: #307ff5;
  border-radius: 16px;

  border: 1px solid #307ff5;
  font-size: 30px;
  color: #ffffff;
}

.icon_success {
  margin-top: 104px;
  width: 104px;
  height: 104px;
}
.div_success_1 {
  margin-top: 40px;
  font-size: 40px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
}
.div_success_2 {
  margin-top: 0px;
  font-size: 28px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #666666;
}
.div_success_3 {
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
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
  padding: 20px 0px;
  background: #307ff5;
  border-radius: 16px;
  border: 1px solid #307ff5;
  font-size: 32px;
  color: #ffffff;
}

.view_bottom_left_2 {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 690px;
  padding: 20px 0px;
  background: #307ff5;
  border-radius: 16px;
  border: 1px solid #307ff5;
  font-size: 32px;
  color: #ffffff;
  margin-top: 40px;
}

.dialog_item_title1 {
  font-size: 32px;
  color: #333333;
  padding: 20px 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.dialog_item_title2 {
  font-size: 34px;
  color: #000000;
  padding: 20px 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.dialog_item_title3 {
  font-size: 28px;
  color: #333333;
  padding: 0px 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>