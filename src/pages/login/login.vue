<template>
  <div class="login-section">
    <div v-if="isShowWechat" style="width:100%;">
      <div class="root_header">
        <img class="icon_logo" src="../../assets/img/icon_banner_01.png" alt="" />
      </div>

      <div class="main_view">
        <div class="main">
          <div class="icon_login_text">欢迎登录</div>
          <div class="main_item_div">
            <div class="main_item_text">账号</div>
            <div class="form-item">
              <input
                v-model="phone"
                type="text"
                name="phone"
                :oninput="phone = (phone.length > 11 ? phone.slice(0, 11) : phone)"
                placeholder="请输入账号"
                maxlength="11"
              />
              <!-- <div class="get_code" @click="btnClick">
                {{ codeRestTime ? `${codeRestTime}S` : "获取验证码" }}
              </div> -->
            </div>
          </div>
          <div class="main_item_div">
            <div class="main_item_text">密码</div>
            <div class="form-item">
              <input
                v-model="code"
                type="password"
                name="code"
                placeholder="请输入密码"
                maxlength="11"
              />
              <!-- :oninput="code = (code.length > 6 ? code.slice(0, 6) : code)" -->
            </div>
          </div>
        </div>

         <van-button class="submit_view" block type="info" @click="handleLogin">登录</van-button>
      </div>
    </div>

    <div class="login-section" v-else>
      <div class="icon_login_content">普通浏览器,请在手机微信浏览器打开此页面</div>
    </div>
  </div>
  
</template>

<script>
import { getLogin,getAutoLogin } from "../../request/api";
import { Notify,Toast } from 'vant';

export default {
  name: "",
  components: {},
  data() {
    return {
      code: "", // 用户姓名
      phone: "", // 联系电话
      codeRestTime: 0,
      restTime: 60,
      phoneCode: ["", ""], //正确的 手机号 和 验证码
      phoneSub: "",
      codeSub: "",
      isShowWechat: true
    };
  },
  created() {},
  mounted() {
    // this.isWechat();
    // this.getAutoLogin();
  },
  methods: {
    isWechat() {
      const ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/micromessenger/i) == 'micromessenger') {
        console.log('微信浏览器');
        this.isShowWechat = true;
        this.getAutoLogin();
        return true;
      } else {
        this.isShowWechat = false;
        console.log('普通浏览器,请在手机微信浏览器打开此页面');
        return false;
      }
    },
    checkPhone(phone) {
      var phoneReg = /^1\d{10}$/;
      if (phone.length != 11) {
        return false;
      } else if (!phoneReg.test(phone)) {
        return false;
      } else {
        return true;
      }
    },
    btnClick() {
      let that = this;
      if (this.phone == "") {
        Toast('请输入账号')
          // Notify({ type: 'danger', message: '请填写手机号'});
        // alert("请填写手机号");
      } else if (!this.checkPhone(this.phone)) {
        Toast('手机号有误')
          // Notify({ type: 'danger', message: '手机号有误'});
        // alert("手机号有误");
      } else {
        this.codeRestTime = this.restTime;
        let timer = setInterval(() => {
          --this.codeRestTime;
          if (!this.codeRestTime) {
            clearInterval(timer);
            timer = null;
          }
        }, 1000);

        getVerification({
          phone: this.phone,
        }).then((res) => {
          if (res.data.success) {
              console.log(res.data.msg)
              that.phoneSub = res.data.phone;
              that.codeSub = res.data.msg;
            // that.phoneCode[(that.phone, res.msg)];
          } else {
            // alert("验证码发送失败");
            Toast(res.data.msg)
            // Notify({ type: 'primary', message:  res.msg});
          }
        });
      }
    },
    commit() {
      if (this.phone == "") {
        Toast('请输入账号')
          //  Notify({ type: 'danger', message: '请填写手机号'});
        return;
      // } else if (!this.checkPhone(this.phone)) {
      //   Toast('手机号有误')
      //   return;
      } else if (this.code == "") {
        Toast('请填写密码')
          // Notify({ type: 'danger', message: '请填写验证码'});
        return;
      // } else if (this.code == "") {
      //   Toast('请填写验证码')
      //     // Notify({ type: 'danger', message: '请填写验证码'});
      //   return;
      // } else if (this.phoneSub == "") {
      //   Toast('请获取验证码')
      //   // Notify({ type: 'danger', message: '请获取验证码'});
      //   return;
      // } else if (this.phoneSub != this.phone) {
      //   Toast('验证码过期')
      //     // Notify({ type: 'danger', message: '验证码过期'});
      //   return;
      // } else if (this.codeSub != this.code) {
      //   Toast('验证码错误')
      //     // Notify({ type: 'danger', message: '验证码错误'});
      //   return;
      } else {
        getLogin({
          person_phone: this.phone,
          password: this.code
        }).then((res) => {
          console.log(res)
          if (res.data.success) {
            Toast(res.data.msg)
            localStorage.setItem('vipPhone',this.phone);
            localStorage.setItem('conveyPassword',this.code)
            this.$router.push({
                path: "/lisList",
                query:{id: res.data.result[0].role,name: res.data.result[0].person_name,userId: res.data.result[0].id}
            });
          } else {
            Toast(res.data.msg)
          }
        });
      }
    },
    handleLogin() {
      this.$router.push({
        path: "/lisInfoCustom",
        query:{id: '1',name: '杨青',userId: '45'}
      });
    },
    getAutoLogin(){
      let phone = localStorage.getItem('vipPhone');
      // let password = localStorage.getItem('conveyPassword');
      if(phone){
        // this.phone = phone;
        // this.code = password;
        getAutoLogin({
         person_phone: phone,
          // password: password
        }).then((res) => {
          console.log(res)
          if (res.data.success) {
            // this.phone = '';
            // this.code = '';
            if(res.data.is_auto_login == 0){
              Toast(res.data.msg)
              this.$router.push({
                  path: "/lisList",
                  query:{id: res.data.result[0].role,name: res.data.result[0].person_name,userId: res.data.result[0].id}
              });
            }
          } else {
            Toast(res.data.msg)
          }
        });
      }
    }
  },
};
</script>
<style scoped lang="scss">
@import "../../assets/style/variable.scss";
.login-section {
  height: 100%;
  display: flex;
  background: #F5F5F5;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
  // @include flexCenter;
  .submit-btn {
    width: 500px;
  }
  .root_header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 360px;
    // padding-top: 200px;
  }

  .icon_logo {
    width: 100%;
    height: 360px;
  }

  .icon_login_text {
    font-size: 36px;
    font-weight: 600;
    color: #333333;
  }

  .icon_login_content{
    font-size: 36px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
    margin-top: 60px;
  }

  .main_view{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -70px;
    flex-direction: column;
  }

  .main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // padding-top: 50px;
    width: 670px;
height: 430px;
background: #FFFFFF;
border-radius: 12px;
  }
  .main_item_div{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
    // padding: 0px 40px;
    width: 90%;
    border-bottom: 1px solid #DDDDDD;
    // margin: 0px 40px;
  }
  .main_item_text{
    font-size: 36px;
    font-weight: 600;
    color: #333333;
    width: 20%;
  }
  .form-item {
    display: flex;
    height: 100px;
    position: relative;
    align-items: center;
    width: 80%;

    input {
      height: 100px;
      border: none;
      outline: none;
      width: 100%;
      border-bottom: none;
      font-size: 36px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
    //   padding: 0px 50px;
    }
  }

  .submit_view {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 70px;
    width: 90%;
    background: #307FF5;
      border: 1px solid #307FF5;
    border-radius: 16px;
    color: #ffffff;
    font-size: 32px;
  }

  .get_code {
    position: absolute;
    right: 25px;
    font-size: 36px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #E06596;
    line-height: 25px;
  }
}
</style>