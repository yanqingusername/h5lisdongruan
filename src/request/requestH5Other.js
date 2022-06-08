import axios from "axios";
import qs from "qs";

/**
 * 共用请求方法H5
 */
const requestH5 = axios.create({
  crewithdentials: true, // 跨域请求时发送cookies
  timeout: 10000, // requestH5 timeout
  baseURL: '/lis_appointment'
});
// axios.defaults.baseURL = '/lis_appointment'

axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    if( config.data && !config.data.i ){
      config.headers['Content-Type'] = 'multipart/form-data';
      //配置请求头
      // config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

    }else{
      config.data = Qs.stringify(config.data);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
})

/**
 * @param {url} String 路由地址
 * @param {val} Obejct 传输的数据
 * @param {method} String 请求方式
 */
export default (url = "/", val = {}, method = "get") =>
  requestH5({
    url,
    method,
    [method === "get" ? "params" : "data"]:
      method === "get" ? val : qs.stringify(val)
  });
