<template>
  <div class="child-section">
    <div class="main">
      <div class="dis_setting_view" style="background:#FFFFFF;">
        <form action="/" style="width:100%;">
          <van-search
            v-model="value"
            show-action
            placeholder="请输入箱码"
            @search="onSearch"
            @cancel="onCancel"
          />
        </form>
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
                  <!-- <div class="search-result-view-1">{{item.boxnumber}}</div> -->
                  <!-- <div class="search-result-view-2" :style="id == 4 ? 'color: #307FF5;':'color: #999999;'">{{'未封箱'}}</div> -->
                  <van-icon name="arrow" size="16"/>
                </div>
              </div>
            </div>
          </div>
      </div>
      <div class="search-list-role" v-else>
        <div class="s_center_t_empty">没有搜索到相关箱码</div>
      </div>

      <div class="empty_view"></div>
      

      <!-- <div class="view_bottom">
        <div class="view_bottom_left" @click="onClickLeft"><van-icon name="arrow-left" size="20" />返回</div>
        <div class="view_bottom_right"></div>
      </div> -->

    </div>

  </div>
</template>

<script>
import { searchSampleBoxInfo } from "../request/api";
import { Toast } from "vant";
export default {
  name: "",
  components: {},
  data() {
    return {
      id: "",
      boxnum: "",
      instrumentList:[],
      value: ''
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.boxnum = this.$route.query.boxnum;
    
  },
  mounted() {
    if(this.boxnum){
      this.searchSampleBoxInfo(this.boxnum);
    }
  },
  methods: {
    searchSampleBoxInfo(box_num){
      let that = this;
      searchSampleBoxInfo({
        box_num: box_num,
        id: this.id
      }).then((res) => {
        if (res.data.success) {
          that.instrumentList = res.data.result;
        } else {
          Toast(res.data.msg)
        }
      });
    },
    onClickLeft() {
      this.$router.back();
    },
    clickItem(box_num,status){
      if(box_num && status){
        this.$router.replace({
          path: "/lisDetailInfoBox",
          query:{id: this.id,boxnum: box_num,st:status}
        });
      }
    },
    onSearch(val) {
      if(val){
        this.value = val;
        this.searchSampleBoxInfo(val);
      }
    },
    onCancel() {
      this.onClickLeft();
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
  justify-content: center;
  align-items: center;
  padding: 0px 30px 0px 30px;
}
.van-search{
    width: 100% !important;
    padding: 10px 0px;
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
padding: 30px 30px;
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

.s_center_t_empty{
  display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 80px;
    font-size: 28px;

color: #333333;
}
</style>