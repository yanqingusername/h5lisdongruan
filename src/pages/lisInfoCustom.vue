<template>
  <div class="child-section">
    
    <div class="main">

      <div class="search-list-role">
        <div class="dis_setting_item">
          <div class="dis_setting_item_1">{{channel_name}}</div>
          <div class="dis_setting_item_2">不登记信息将无法进入使用系统</div>
        </div>
      </div>

      <div class="search-list-role-from">
        <div class="search-list-role-from-a">
          <div class="search-list-role-from-c">
            <div class="s_center_t_item" style="width: 30%">采样人姓名</div>
            <div class="select-item input-item">
              <input
                v-model="sampling_member_name"
                type="text"
                name="sampling_member_name"
                placeholder="请输入采样人真实姓名"
                maxlength="30"
              />
            </div>
          </div>

          <div class="search-list-role-from-c">
            <div class="s_center_t_item" style="width: 30%">采样点电话</div>
            <div class="select-item input-item">
              <input
                v-model="sampling_member_phone"
                type="number"
                name="sampling_member_phone"
                placeholder="请输入采样人有效联系方式"
                maxlength="11"
              />
              <!-- <div class="clear_1" @click="clearPhone" v-if="sampling_member_phone">
                <img class="icon_clear" src="../assets/images/deleteTest.png" />
              </div> -->
            </div>
          </div>

          <div class="search-list-role-from-c">
            <div class="s_center_t_item" style="width: 30%">登记人姓名</div>
            <div class="select-item input-item">
              <input
                v-model="registrant_member_name"
                type="text"
                name="registrant_member_name"
                placeholder="请输入登记人真实姓名"
                maxlength="30"
              />
            </div>
          </div>

          <div class="search-list-role-from-c" style="border-bottom:none;">
            <div class="s_center_t_item" style="width: 30%">登记人电话</div>
            <div class="select-item input-item">
              <input
                v-model="registrant_member_phone"
                type="number"
                name="registrant_member_phone"
                placeholder="请输入登记人有效联系方式"
                maxlength="11"
              />
              <!-- <div class="clear_1" @click="clearAccountPhone" v-if="registrant_member_phone">
                <img class="icon_clear" src="../assets/images/deleteTest.png" />
              </div> -->
            </div>
          </div>
          
        </div>
      </div>

      <div class="empty_view"></div>

      <div class="view_bottom">
        <div class="view_bottom_left" @click="clickSubmit">确认并进入</div>
      </div>
    </div>

  </div>
</template>

<script>
import {
  Toast,
  Button,
  Dialog,
} from "vant";
import { getSamplingRegistrantInfoById,writeRegistrantInfo } from "../request/api";

export default {
  name: "",
  components: {
    [Dialog.Component.name]: Dialog.Component, //Dialog.Component写成这样才生效
    [Button.name]: Button,
  },
  data() {
    return {
      id: "",
      channel_name:"",
      channel_id:"",
      registrant_member_name:"",
      registrant_member_phone:"",
      sampling_member_name:"",
      sampling_member_phone:""
    };
  },
  created() {

    document.title = '采样点人员信息登记';

    this.id = this.$route.query.id;
  },
  mounted() {
    this.getSamplingRegistrantInfoById();
  },
  methods: {
    getSamplingRegistrantInfoById(){
      let that = this;
      getSamplingRegistrantInfoById({
        id: that.id
      }).then((res) => {
        if (res.data.success) {
          let item = res.data.result;
          if(item && item.length > 0){
            that.channel_name = item[0].channel_name;
            that.channel_id = item[0].channel_id;
            that.registrant_member_name = item[0].registrant_member_name;
            that.registrant_member_phone = item[0].registrant_member_phone;
            that.sampling_member_name = item[0].sampling_member_name;
            that.sampling_member_phone = item[0].sampling_member_phone;
          }
        } else {
            Toast(res.data.msg)
        }
      });
    },
    onClickLeft() {
      this.$router.back();
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
    /**
     * 保存
     */
    clickSubmit() {
      let that = this;

      if(that.sampling_member_name == ''){
        Toast('请输入采样人真实姓名');
        return;
      }

      if(that.sampling_member_phone == ''){
        Toast('请输入采样人有效联系方式');
        return;
      }

      if (!that.checkPhone(that.sampling_member_phone)) {
        Toast('采样人手机号有误')
        return;
      } 

      if(that.registrant_member_name == ''){
        Toast('请输入登记人真实姓名');
        return;
      }

      if(that.registrant_member_phone == ''){
        Toast('请输入登记人有效联系方式');
        return;
      }

      if (!that.checkPhone(that.registrant_member_phone)) {
        Toast('登记人手机号有误')
        return;
      } 

      writeRegistrantInfo({
        sampling_member_name: that.sampling_member_name,
        sampling_member_phone: that.sampling_member_phone,
        registrant_member_name: that.registrant_member_name,
        registrant_member_phone: that.registrant_member_phone,
        channel_id: that.channel_id,
        channel_name: that.channel_name,
        id: that.id
      }).then((res) => {
        if (res.data.success) {
          that.$router.push({
            path: "/lisMain",
            query:{id: that.id}
          });
        } else {
          Toast(res.data.msg)
        }
      });
      
    },
    clearPhone() {
      this.sampling_member_phone = "";
    },
    clearAccountPhone(){
      this.registrant_member_phone = "";
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



.dis_setting_item {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 30px 20px;
  background: #ffffff;
  border-radius: 20px;
  margin-top: 20px;
}

.dis_setting_item_1{
  font-size: 32px;
  color: #333333;
}
.dis_setting_item_2{
  font-size: 28px;
  margin-top: 16px;
  color: #E0694D;
}




.s_center_t_item {
  font-size: 28px;
}


.select-item {
  width: 70%;
}


.input-item {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  input {
    width: 100%;
    height: 80px;
    background: #ffffff;
    border-radius: 12px;
    border: none;
    outline: none;
    font-size: 28px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    padding-left: 20px;
  }


}

.search-list-role {
  // height: 1110px;
  border: 0 none;
  // background-color: #FFFFFF;
  width: 100%;
  padding: 0px 30px;

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
}
  }
     }
}

.empty_view {
  height: 80px;
  width: 100%;
}

.view_bottom {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  // position: fixed;
  // bottom: 50px;
  z-index: 9;
  height: 120px;
}

.view_bottom_left {
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

.search-list-role-from {
  // height: 1110px;
  border: 0 none;
  width: 100%;
  padding: 0px 30px;
  margin-top: 20px;
  border-radius: 20px;

  .search-list-role-from-a {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px 20px;
    background: #ffffff;
    border-radius: 20px;

    .search-list-role-from-b {
      padding-top: 10px;
      font-size: 32px;
    }

    .search-list-role-from-c {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #ffffff;
      padding: 10px 0px;
      border-bottom: 1px solid #dddddd;
    }

    .search-list-role-from-g{
      width: 100%;
      display: flex;
      justify-content: space-between;
      background: #ffffff;
      padding: 10px 0px;
      border-bottom: 1px solid #dddddd;

      
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