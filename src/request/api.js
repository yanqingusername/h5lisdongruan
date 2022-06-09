import { 
    get
} from './http'

import requestH5Imgs from './requestH5Img'
import requestH5Other from './requestH5Other'


export const udateH5Images = val => requestH5Imgs('', val, 'post');

export const getLogin = val => requestH5Other('/eastlogin/login.hn', val, 'get'); //登录

export const getSamplingRegistrantInfoById = val => requestH5Other('/eastlogin/getSamplingRegistrantInfoById.hn', val, 'get'); //根据账号id查采样登记信息

export const writeRegistrantInfo = val => requestH5Other('/eastlogin/writeSamplingRegistrantInfo.hn', val, 'get'); //填写登记人信息

export const getEverydaySampleBoxInfo = val => requestH5Other('/eastbox/getEverydaySampleBoxInfo.hn', val, 'get'); //获取首页采样数据

export const getJSSDKHELP = val => requestH5Other('/eastbox/JSSDKHELP.hn', val, 'get'); // 调用扫一扫

export const checkSampleBoxStatusIsClose = val => requestH5Other('/eastbox/checkSampleBoxStatusIsClose.hn', val, 'get'); //获取账号id未封箱的数据

export const checkSampleBoxStatus = val => requestH5Other('/eastbox/checkSampleBoxStatus.hn', val, 'get'); //校验样本箱

export const startScanSampleBox = val => requestH5Other('/eastbox/startScanSampleBox.hn', val, 'get'); //扫描箱码

export const deleteSampleBoxInfo = val => requestH5Other('/eastbox/deleteSampleBoxInfo.hn', val, 'get'); //删除样本箱

export const getSampleBoxInfo = val => requestH5Other('/eastbox/getSampleBoxInfo.hn', val, 'get'); //获取箱码详情

export const closeSampleBox = val => requestH5Other('/eastbox/closeSampleBox.hn', val, 'get'); //封箱

export const checkSampleTube = val => requestH5Other('/eastbox/checkSampleTube.hn', val, 'get'); //校验样本管

export const addSampleTubeInfo = val => requestH5Other('/eastbox/addSampleTubeInfo.hn', val, 'get'); //添加样本管

export const exitEastSampleLogin = val => requestH5Other('/eastlogin/exitEastSampleLogin.hn', val, 'get'); //登出

export const deleteSampleTubeInfo = val => requestH5Other('/eastbox/deleteSampleTubeInfo.hn', val, 'get'); //删除样本管

export const getAlreadySmapleInfo = val => requestH5Other('/eastbox/getAlreadySmapleInfo.hn', val, 'get'); //获取已采集信息

export const getExpandSampleInfoDetail = val => requestH5Other('/eastbox/getExpandSampleInfoDetail.hn', val, 'get'); //获取试管

export const getSampleBoxInfoDetail = val => requestH5Other('/eastbox/getSampleBoxInfoDetail.hn', val, 'get'); //获取试管



export const searchSampleBoxInfo = val => requestH5Other('/eastbox/searchSampleBoxInfo.hn', val, 'get'); //搜索样本箱

export const searchSampleTubeInfo = val => requestH5Other('/eastbox/searchSampleTubeInfo.hn', val, 'get'); //搜索样本管信息


