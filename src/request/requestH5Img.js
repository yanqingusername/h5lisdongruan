import axios from "axios";
import qs from "qs";

/**
 * 共用请求方法H5
 */
const requestH5 = axios.create({
  crewithdentials: true, // 跨域请求时发送cookies
  timeout: 10000, // requestH5 timeout
  baseURL: 'https://api-cn.faceplusplus.com/imagepp/v2/generalocr'
});

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
