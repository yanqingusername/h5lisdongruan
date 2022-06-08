<template>
  <div class="child-section">
    <van-nav-bar
      title="修改团体上门预约信息"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="main">
      <div class="search-list-role">
        <div class="dis_setting_i" v-if="can_update==0">
          <div class="s_center_t_item">修改状态</div>
          <van-popover
            v-model="showPopover"
            trigger="click"
            :actions="actions"
            @select="onSelect"
            placement="bottom-end"
          >
            <template #reference>
              <div class="s_setting_t_item">
                <span style="color: #ec1f2d">{{ statustext }}</span>
                <van-icon name="arrow" />
              </div>
            </template>
          </van-popover>
        </div>
        <div class="dis_setting_i" v-else>
          <div class="s_center_t_item">修改状态</div>
              <div class="s_setting_t_item">
                <span style="color: #ec1f2d">{{ statustext }}</span>
                <van-icon name="arrow" />
              </div>
        </div>
      </div>

      <div class="dis_setting_icon">
        <div class="s_setting_t" style="color: #e27a62">
          <van-icon
            name="info-o"
            size="20"
            style="margin-right: 4px; color: #e27a62"
          />
        </div>
        <div class="s_center_t" style="color: #e27a62">
          只有运营和负责护士可修改状态，若当前为【等待确认】，请确认信息后修改为【待采样】，否则流程将无法继续。
        </div>
      </div>

      <div class="search-list-role">
        <div class="dis_setting_i">
          <div class="s_center_t_item">负责护士</div>
          <div class="s_setting_t_item" @click="clickHushi">
            <span style="color: #e06596">{{resultCheckbox ? resultCheckbox : '请选择'}}</span>
            <van-icon name="arrow" />
          </div>
        </div>
      </div>

      <div class="search-list-role">
        <div class="dis_setting_i_mar">
          <div class="s_center_t_item_g" style="width: 20%">备注</div>
          <van-field
              v-model="remark"
              rows="1"
              autosize
              label=""
              type="textarea"
              maxlength="200"
              placeholder="请写下与客户沟通情况与确认金额"
            />
          <!-- <div class="select-item input-item">
            <input
              v-model="remark"
              type="text"
              name="remark"
              placeholder="请写下与客户沟通情况与确认金额"
            />
          </div> -->
        </div>
      </div>

      <div class="search-list-role">
        <div class="dis_setting_i_mar">
          <div class="s_center_t_item_g" style="width: 20%">企业名称</div>
          <van-field
              v-model="company_name"
              rows="1"
              autosize
              label=""
              type="textarea"
              maxlength="200"
              placeholder="便于后续沟通，选填"
            />
        </div>
      </div>

      <div class="search-list-role-from">
        <div class="search-list-role-from-a">
          <div class="search-list-role-from-b">上门地址</div>
          <div class="search-list-role-from-c">
            <div class="s_center_t_item" style="width: 20%">姓名</div>
            <div class="select-item input-item">
              <input
                v-model="vip_person"
                type="text"
                name="vip_person"
                placeholder="请输入联系人姓名"
                maxlength="50"
              />
            </div>
          </div>

          <div class="search-list-role-from-c">
            <div class="s_center_t_item" style="width: 20%">手机号</div>
            <div class="select-item input-item">
              <input
                v-model="vip_phone"
                type="number"
                name="vip_phone"
                placeholder="请输入联系人手机号"
                maxlength="11"
              />
              <div class="clear_1" @click="clearPhone" v-if="vip_phone">
                <img class="icon_clear" src="../assets/images/deleteTest.png" />
              </div>
            </div>
          </div>
          <div class="search-list-role-from-c">
            <div class="s_center_t_item" style="width: 20%">所在地区</div>
            <div class="select-item div-item" @click="clickArea">
              <!-- <input
                v-model="provincecityarea"
                type="text"
                name="provincecityarea"
                placeholder="请选择所在地区"
              /> -->
              <div :style="provincecityarea ? 'color: #333333;':'color: #666666;'">{{provincecityarea ? provincecityarea : '请选择所在地区'}}</div>
              <div class="clear_1" style="padding: 0px">
                <van-icon name="arrow" />
              </div>
            </div>
          </div>
          <div class="search-list-role-from-g" style="border-bottom: none">
            <div class="s_center_t_item_g" >详细地址</div>
            <!-- <el-input
  type="textarea"
  autosize
  placeholder="请输入内容"
  v-model="address">
</el-input> -->
            <van-field
              v-model="address"
              rows="1"
              autosize
              label=""
              type="textarea"
              placeholder="请填写详细地址"
            />
            <!-- <div class="select-item input-item">
                    <input
                      v-model="vip_phone"
                      type="textarea"
                      name="vip_phone"
                      placeholder="请填写详细地址"
                      maxlength="50"
                    />
                  </div> -->
          </div>
        </div>
      </div>

      <div class="search-list-role-from">
        <div class="search-list-role-from-a">
          <div class="search-list-role-from-d">
            <div class="s_center_t_item">期望上门时间</div>
            <div class="s_setting_t_item" @click="clickDate">
              <span :style="dateText ? 'color: #333333;':'color: #666666;'">{{dateText ? dateText : '请选择期望上门时间'}}</span><van-icon name="arrow" />
            </div>
          </div>
          <div class="search-list-role-from-d">
            <div class="s_center_t_item">特殊时间要求</div>
            <div class="s_setting_t_item" @click="clickDateTime">
              <span :style="timeValue ? 'color: #333333;':'color: #666666;'">{{timeValue ? timeValue : '请选择'}}</span><van-icon name="arrow" />
            </div>
          </div>
        </div>
      </div>

      <div class="search-list-role">
        <div class="dis_setting_i">
          <div class="s_center_t_item">受检人数</div>
          <div class="s_setting_t_item" style="color: #e06596">
            <van-stepper
              v-model="inspection_person_num"
              integer
              input-width="40"
              theme="round"
              button-size="30"
              min="1"
            />
          </div>
        </div>
      </div>

      <div class="empty_view"></div>

      <div class="view_bottom">
        <div class="view_bottom_left" @click="clickSubmit">保存</div>
      </div>
    </div>

    <van-dialog
      v-model="isShowCheckbox"
      showCancelButton
      :beforeClose="beforeCloseCheckbox"
      confirmButtonColor='#E06596'
    >
    <div class="dialog_item">
        <van-checkbox-group v-model="result"  direction="horizontal">
          <div v-for="(item,index) in nurse_list" :key="index" class="checkbox_class">
          <van-checkbox :name="item.id">{{item.person_name}}</van-checkbox>
          </div>
        </van-checkbox-group>
    </div>
    </van-dialog>


    
    <van-popup v-model="isShowArea" round position="bottom">
      <van-area title="选择地区" :area-list="areaList" @confirm="areaConfirm" @cancel="areaCancel"/>
    </van-popup>


    <van-popup v-model="isShowDate" round position="bottom">
      <van-picker show-toolbar title="选择开始时间" :columns="objectMultiArray" @cancel="dateCancel" @confirm="dateConfirm"/>
    </van-popup>

<van-popup v-model="isShowDateTime" round position="bottom">
     
     <van-datetime-picker
  v-model="currentDate"
  type="datehour"
  title="选择年月日小时"
  :min-date="minDate"
  @cancel="dateTimeCancel" 
  @confirm="dateTimeConfirm"
/>
    </van-popup>


    <van-dialog
      v-model="isShowUpdate"
      showCancelButton
      :beforeClose="beforeUpdate"
      confirmButtonColor='#E06596'
      cancel-button-color='#E06596'
      confirm-button-text="仍然保存"
      cancel-button-text="再看看"
    >
    <div class="dialog_item">
        <div class="dialog_item_title">负责护士<span style="color:#E06596;">{{checkinfo.person_name}}</span>在<span style="color:#E06596;">{{checkinfo.expect_date}}{{checkinfo.expect_time_bucket}}</span>已有上门预约，仍然要保存吗？</div>
    </div>
    </van-dialog>

  </div>
</template>

<script>
import {
  Toast,
  Button,
  Dialog,
} from "vant";
import { getVIPInfoByNum,getNurseInfo,updateVIPOrderStatus,checkVIPAppointmentNurse,getVIPServiceType } from "../request/api";
import { areaList } from '@vant/area-data';
export default {
  name: "",
  components: {
    [Dialog.Component.name]: Dialog.Component, //Dialog.Component写成这样才生效
    [Button.name]: Button,
  },
  data() {
    return {
      roleId: "",
      roleName: "",
      userId: "",
      appointment_vip_num:'',
      inspection_person_num: 20,
      remark: "",
      vip_person: "",
      vip_phone: "",
      province: "",
      city: "",
      area: "",
      address_id: '',
      appointment_vip_status: -1,
      expect_date: "",
      expect_time_bucket: "",
      nurse_name_list: "",
      nurse_name_ids: "",
      text: "",
      service_type: "",
      service_status: "",
      address: "",
      special_expect_date: "",
      special_expect_time_bucket: "",
      company_name: "",
      provincecityarea: "",
      statustext: "等待确认",
      statuvalue: '0',
      showPopover: false,
      // 通过 actions 属性来定义菜单选项
      actions: [
        { text: '等待确认', value: '0' },
        { text: '待采样', value: '1' },
        { text: '已完成', value: '2' },
        { text: '客户缺席', value: '3' },
      ],
      isShowCheckbox: false,
      result: [],
      moreResult: [],
      resultCheckbox: "",
      nurse_list:[],
      isShowArea: false,
      areaList,
      objectMultiArray:[],
      // objectMultiArray: [
      //                     {
      //                         "text": "05月31日",
      //                         "children": [
      //                             {
      //                                 "text": "上午",
      //                                 disabled: true
      //                             },
      //                             {
      //                                 "text": "下午"
      //                             },
  
      //                         ]
      //                     },
      //                     {
      //                         "text": "06月01日",
      //                         "children": [
      //                             {
      //                                 "text": "上午"
      //                             },
      //                             {
      //                                 "text": "下午"
      //                             },
  
      //                         ]
      //                     },
                         
      //                     {
      //                         "text": "06月02日",
      //                         "children": [
      //                             {
      //                                 "text": "上午"
      //                             },
      //                             {
      //                                 "text": "下午"
      //                             },
  
      //                         ]
      //                     },
      //                     {
      //                         "text": "06月03日",
      //                         "children": [
      //                             {
      //                                 disabled: true,
      //                                 "text": "上午"
      //                             },
      //                             {
      //                                 "text": "下午"
      //                             },
  
      //                         ]
      //                     }
      //                 ],
      isShowDate: false,
      dateText: '',
      isShowDateTime: false,
      minDate: new Date(),
      currentDate: new Date(),
      timeValue: '',
      isShowUpdate: false,
      checkinfo: '',
      can_update: '0', // 判断是否可以修改状态
    };
  },
  created() {
    this.roleId = this.$route.query.id;
    this.roleName = this.$route.query.name;
    this.userId = this.$route.query.userId;
    this.appointment_vip_num = this.$route.query.avipnum;
    console.log(this.roleId);
    console.log(this.roleName);
    console.log(this.userId);
    console.log(this.appointment_vip_num);
    
  },
  mounted() {
    this.getVIPInfoByNum();
    this.getNurseInfo();

    this.getVIPServiceType();
  },
  methods: {
    getVIPServiceType(){
      let that = this;
      getVIPServiceType({}).then((res) => {
        if (res.data.success) {
          let service_type_info = res.data.service_type_info;
          that.objectMultiArray = service_type_info[1].objectMultiArray;

          if(that.objectMultiArray.length > 0){
            let objList = [];
            for (let i = 0; i < that.objectMultiArray.length; i++) {
              let obj = {};

              // obj.text =  that.objectMultiArray[i].date;
              let dateText = that.objectMultiArray[i].date;
              if(dateText.indexOf('年')!=-1){
                let index = dateText.indexOf("date");
                let result = dateText.substr(index + 1,dateText.length); 
                obj.text =  result;
              }else{
                obj.text =  dateText;
              }

              obj.children =  [];
              let item = that.objectMultiArray[i].time;
              for (let j = 0; j < item.length; j++) {
                let timelist = item[j];
                let objTime = {};
                if(timelist.can_use == 1){
                  objTime.disabled = true;
                  objTime.text = timelist.time_section + ' (已满约)';
                }else{
                  objTime.text = timelist.time_section;
                }
                obj.children.push(objTime)
              }
              objList.push(obj);
            }

            that.objectMultiArray = objList;
          }
        } else {
            Toast(res.data.msg)
        }
      });
    },
    getNurseInfo(){
      let that = this;
      getNurseInfo({}).then((res) => {
        if (res.data.success) {
          that.nurse_list = res.data.result;
        } else {
            Toast(res.data.msg)
        }
      });
    },
    getVIPInfoByNum(){
      let that = this;
      getVIPInfoByNum({
        id: that.userId,
        appointment_vip_num: that.appointment_vip_num
      }).then((res) => {
        if (res.data.success) {
          that.can_update = res.data.can_update;
          
          let result = res.data.result
          if(result && result.length > 0){
            let item = result[0];

             that.appointment_vip_num = item.appointment_vip_num;
             if(item.inspection_person_num){
                that.inspection_person_num = item.inspection_person_num;
             }
             
             that.remark = item.remark;
             that.vip_person = item.vip_person;
             that.vip_phone = item.vip_phone;
             that.province = item.province;
             that.city = item.city;
             that.area = item.area;
             that.address_id = item.address_id;
             that.appointment_vip_status = item.appointment_vip_status;
             that.expect_date = item.expect_date;
             that.expect_time_bucket = item.expect_time_bucket;
             that.nurse_name_list = item.nurse_name_list;
             that.nurse_name_ids = item.nurse_name_ids;
             that.text = item.text;
             that.service_type = item.service_type;
             that.service_status = item.service_status;
             that.address = item.address;

             if(that.nurse_name_ids){
               let nurseIds = that.nurse_name_ids.split(',');
               if(nurseIds && nurseIds.length > 0){
                 for(let i = 0; i < nurseIds.length; i++){
                   let id = parseInt(nurseIds[i])
                    that.result.push(id);
                    that.moreResult.push(id);
                 }
               }
              //  console.log(that.nurse_name_ids,that.result)
             }

             if(item.special_expect_date){
                that.special_expect_date = item.special_expect_date;
             }

             if(item.special_expect_time_bucket){
                that.special_expect_time_bucket = item.special_expect_time_bucket;
             }

             if(item.company_name){
                that.company_name = item.company_name;
             }

             if(that.province && that.city && that.area){
                that.provincecityarea = that.province + that.city + that.area + '';
             }

             if(that.special_expect_date && that.special_expect_time_bucket){
               that.timeValue = that.special_expect_date + ' ' + that.special_expect_time_bucket;
             }else{
               if(that.expect_date && that.expect_time_bucket){
                that.dateText = that.expect_date + ' ' + that.expect_time_bucket;
              }
             }

             
             if(that.appointment_vip_status == -1 || that.appointment_vip_status == 0){
                that.statustext = "等待确认";
                that.statuvalue = 0;
             } else if(that.appointment_vip_status == 1){
                that.statustext = "待采样";
                that.statuvalue = 1;
             } else if(that.appointment_vip_status == 2){
                that.statustext = "已完成";
                that.statuvalue = 2;
             } else if(that.appointment_vip_status == 3){
                that.statustext = "客户缺席";
                that.statuvalue = 3;
             }

             if(that.nurse_name_list){
               that.resultCheckbox = that.nurse_name_list;
             }
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

      if(that.statuvalue != 0 && that.resultCheckbox == ''){
        Toast('非等待确认状态，请选择负责护士');
        return;
      }

      if(that.remark == ''){
        Toast('请写下与客户沟通情况与确认金额');
        return;
      }

      if(that.vip_person == ''){
        Toast('请输入联系人姓名');
        return;
      }

      if(that.vip_phone == ''){
        Toast('请输入联系人手机号');
        return;
      }

      if (!that.checkPhone(that.vip_phone)) {
        Toast('手机号有误')
        return;
      } 

      if(that.provincecityarea == ''){
        Toast('请选择所在地区');
        return;
      }

      if(that.address == ''){
        Toast('请填写详细地址');
        return;
      }

      if(that.dateText == ''){
        Toast('请选择期望上门时间');
        return;
      }

      if(that.statuvalue == 0){
        that.setSaveData();
      } else {
        let param = {
          appointment_vip_num: that.appointment_vip_num,
          nurse_name_ids: that.nurse_name_ids,
          expect_date: that.special_expect_date ?  that.special_expect_date : that.expect_date,
          expect_time_bucket: that.special_expect_time_bucket ? that.special_expect_time_bucket : that.expect_time_bucket,
        }
        checkVIPAppointmentNurse(param).then((res) => {
          if (res.data.success) {
            if(res.data.is_alert == 1){
              that.setSaveData();
            }else{
              that.isShowUpdate = true;
              if(res.data.result && res.data.result.length > 0){
                that.checkinfo = res.data.result[0];
              }
            }
          } else {
            Toast(res.data.msg)
          }
        });
      }
    },
    setSaveData(){
      let that = this;
      let param = {
          company_name: that.company_name,
          appointment_vip_num: that.appointment_vip_num,
          appointment_vip_status: that.statuvalue,
          nurse_name_list: that.resultCheckbox,
          nurse_name_ids: that.nurse_name_ids,
          remark: that.remark,
          address_id: that.address_id,
          vip_person: that.vip_person,
          vip_phone: that.vip_phone,
          province: that.province,
          city: that.city,
          area: that.area,
          address: that.address,
          expect_date: that.expect_date,
          expect_time_bucket: that.expect_time_bucket,
          special_expect_date: that.special_expect_date,
          special_expect_time_bucket: that.special_expect_time_bucket,
          inspection_person_num: that.inspection_person_num
        }
        console.log('--params-->:',param)
        updateVIPOrderStatus(param).then((res) => {
          if (res.data.success) {
            Toast(res.data.msg);
            that.onClickLeft();
          } else {
            Toast(res.data.msg);
          }
        });
    },
    beforeUpdate(action, done) {
      let that = this;
      let param = {
        company_name: that.company_name,
        appointment_vip_num: that.appointment_vip_num,
        appointment_vip_status: that.statuvalue,
        nurse_name_list: that.resultCheckbox,
        nurse_name_ids: that.nurse_name_ids,
        remark: that.remark,
        address_id: that.address_id,
        vip_person: that.vip_person,
        vip_phone: that.vip_phone,
        province: that.province,
        city: that.city,
        area: that.area,
        address: that.address,
        expect_date: that.expect_date,
        expect_time_bucket: that.expect_time_bucket,
        special_expect_date: that.special_expect_date,
        special_expect_time_bucket: that.special_expect_time_bucket,
        inspection_person_num: that.inspection_person_num
      }
      console.log('--params-->:',param)

      if(action === 'confirm') {
        updateVIPOrderStatus(param).then((res) => {
          if (res.data.success) {
            this.isShowUpdate = false;
            Toast(res.data.msg);
            done() //关闭
            that.onClickLeft();
          } else {
            Toast(res.data.msg);
            done(false) //关闭
          }
        });
      } else if(action === 'cancel') {
        this.isShowUpdate = false;
        done() //关闭
      }
    },
    clearPhone() {
      this.vip_phone = "";
    },
    onSelect(action) {
      this.statustext = action.text;
      this.statuvalue = action.value;
    },
    clickHushi(){
      this.isShowCheckbox = true;
      this.result = this.moreResult;
    },
    beforeCloseCheckbox(action, done) {
      let that = this;
      if(action === 'confirm') {
        if(that.result.length > 0){
          this.isShowCheckbox = false;
          console.log(that.result)
          let resultCheckbox = '';

            let resultText = [];
            for(let i = 0; i < that.nurse_list.length; i++){
              let item = that.nurse_list[i];
              for(let j = 0; j < that.result.length; j++){
                if(item.id == that.result[j]){
                  resultText.push(item.person_name)
                }
              }
            }
            that.moreResult = that.result;

          resultCheckbox= resultText.join(",");
          that.nurse_name_ids = that.result.join(",");
          that.result=[];
          that.resultCheckbox = resultCheckbox;
          done()
        }else{
          Toast('请选择负责护士');
          done(false)
        }
      } else if(action === 'cancel') {
        this.isShowCheckbox = false;
        this.result=[];
        done() //关闭
      }
    },
    clickArea(){
      this.isShowArea = true;
    },
    areaConfirm(item){
      console.log(item)
      if(item.length>0){
        let areaList = [];
        for(let i = 0; i < item.length; i++){
          areaList.push(item[i].name);
        }
        let areaName = '';
          areaName= areaList.join(",");
          this.province = areaList[0];
          this.city = areaList[1];
          this.area = areaList[2];
          console.log(areaList[0],areaList[1],areaList[2])
        this.provincecityarea = areaName;
      }
      this.isShowArea = false;
    },
    areaCancel(){
      this.isShowArea = false;
    },
    clickDate(){
      this.isShowDate = true;
    },
    dateCancel(){
      this.isShowDate = false;
    },
    dateConfirm(date){
      console.log(date)
      if(date.length>0){
        let atime = date[1];
        if(atime.indexOf('已满约') !=-1){
          // let btime = atime.substr(0,(atime.indexOf('(')));
          // console.log('--22-->:',btime)
          Toast('该时间段已约满,请选择其他上门时间~');
          let dateValue = '';
          this.dateText = dateValue;
          this.expect_date = '';
          this.expect_time_bucket = '';
          this.isShowDate = false;
        }else{
          let dateValue = '';
            dateValue = date.join(" ");
          this.dateText = dateValue;
          this.expect_date = date[0];
          this.expect_time_bucket = date[1];
          this.isShowDate = false;

          if(this.timeValue && this.special_expect_date && this.special_expect_time_bucket){
            this.dateText = '';
            this.expect_date = '';
            this.expect_time_bucket = '';
          }
        }
      }
    },
    clickDateTime(){
      this.isShowDateTime = true;
    },
    dateTimeCancel(){
      this.isShowDateTime = false;
    },
    dateTimeConfirm(){
      this.timeValue = this.timeFormat(this.currentDate);
      console.log(this.timeValue)

      this.dateText = '';
      this.expect_date = '';
      this.expect_time_bucket = '';

      this.isShowDateTime = false;
    },
    timeFormat(time) { // 时间格式化 2019-09-08
     let year = time.getFullYear();
     let month = time.getMonth() + 1;
      if(month<10){
        month = '0'+month;
      }
     let day = time.getDate();
    if(day<10){
        day = '0'+day;
      }

     let hour = time.getHours();
     if(hour<10){
        hour = '0'+hour;
      }

     this.special_expect_date = month + '月' + day + '日';
      this.special_expect_time_bucket = hour + ':00';

     return month + '月' + day + '日' + ' ' + hour + ':00';
     }
  },
};
</script>
<style scoped lang="scss">
.child-section {
  background-color: #f5f5f5;
  // height: 100%;
}
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

.dis_setting {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 80px 50px 20px 50px;
}
.s_center_t {
  font-size: 20px;
}

.dis_setting_i {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 20px;
  background: #ffffff;
  border-radius: 20px;
  margin-top: 20px;
}

.dis_setting_i_mar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  // align-items: center;
  padding: 10px 20px;
  background: #ffffff;
  border-radius: 20px;
  margin-top: 20px;
}

.dis_setting_icon {
  width: 100%;
  display: flex;
  padding: 20px 30px 0px;
}

.s_center_t_item {
  font-size: 32px;
}

.s_setting_t_item {
  font-size: 32px;
}

.select-item {
  width: 80%;
}

.div-item{
  padding: 20px 0px;
    width: 77%;
    display: flex;
  // justify-content: center;
  align-items: center;
  position: relative;
  font-size: 28px;
  color: #333333;
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
    color: #333333 !important;
    padding-left: 20px;
  }

  .icon_scan {
    width: 40px;
    height: 40px;
  }
}

.search-list-role {
  // height: 1110px;
  border: 0 none;
  // background-color: #FFFFFF;
  width: 100%;
  padding: 0px 30px;
}

.empty_view {
  height: 150px;
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
  background: #e06596;
  border-radius: 50px;
  border: 1px solid #e06596;
  font-size: 34px;
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

.s_center_t_item_g{
        width: 20%;
        margin-top:10px;
        font-size: 32px;
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

.el-textarea {
  width: 78%;
  border: none;
}
.el-textarea__inner {
  border: none;
}
.van-cell {
  padding: 6px 0px !important;
  width: 77% !important;
}

::v-deep .van-field__control::-webkit-input-placeholder {
  color: #666666;
  font-size: 0.38rem;
}

.search-list-role-from-d {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 20px 0px;
}

.dialog_item{
      display: flex;
      // align-items: center;
      // justify-content: center;
      flex-direction: column;
      padding: 20px;
    }

.dialog_item_title{
  padding: 30px;
}

.checkbox_class{
  padding: 20px;
  display: flex;
  align-items: center;
  width: 50%;
}
</style>