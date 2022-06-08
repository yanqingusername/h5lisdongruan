import { 
    get
} from './http'

import requestH5Imgs from './requestH5Img'
import requestH5Other from './requestH5Other'


export const udateH5Images = val => requestH5Imgs('', val, 'post');



export const getLogin = val => requestH5Other('/vipback/viplogin.hn', val, 'get'); //vip后台登陆

export const getAutoLogin = val => requestH5Other('/vipback/checkAutoLogin.hn', val, 'get'); //vip后台自动登录

export const getAllVIPRecords = val => requestH5Other('/vipback/getAllVIPAppointmentRecords.hn', val, 'get'); //vip后台获取预约记录

export const updatePersonNum = val => requestH5Other('/vipback/updateAppointmentPersonNum.hn', val, 'get'); //vip上门预约修改配置

export const createVIPFiveRecord = val => requestH5Other('/vipback/createVIPFiveAppointmentRecord.hn', val, 'get'); //创建vip（5人以下）预约记录

export const createVIPGroupRecord = val => requestH5Other('vipback/createVIPGroupAppointmentRecord.hn', val, 'get'); //创建vip（团体）预约记录

export const updateVIPInfoByNum = val => requestH5Other('/vipback/updateVIPAppointmentInfoByNum.hn', val, 'get'); //后台vip根据预约码appointment_vip_num删除预约信息

export const getVIPInfoByNum = val => requestH5Other('/vipback/getVIPAppointmentInfoByNum.hn', val, 'get'); //vip根据预约码appointment_vip_num获取预约信息

export const checkVIPAppointmentNurse = val => requestH5Other('/vipback/checkVIPAppointmentNurse.hn', val, 'get'); //预约护士检验

export const updateVIPOrderStatus = val => requestH5Other('/vipback/updateVIPAppointmentOrderStatus.hn', val, 'get'); //vip上门后台修改预约订单

export const getNurseInfo = val => requestH5Other('/vipback/getNurseInfo.hn', val, 'get'); //获取护士信息

export const createCustomerAddressInfo = val => requestH5Other('/vipback/createCustomerAddressInfo.hn', val, 'get'); //vip预约客户填信息


export const getVIPServiceType = val => requestH5Other('/avip/getVIPServiceType.hn', val, 'get'); //


export const getAppointmentPersonNum = val => requestH5Other('/vipback/getAppointmentPersonNum.hn', val, 'get'); 




