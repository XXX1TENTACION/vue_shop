import axios from 'axios'

function request(config){
  const instance = axios.create({
    baseURL:`http://127.0.0.1:8888/api/private/v1/`
  })
  instance.interceptors.request.use((config1) => {
    // 为请求头添加token令牌
    config1.headers.Authorization = window.sessionStorage.getItem('token')
    return config1
  },error => {
     // 对请求错误做些什么
     return Promise.reject(error);
  })
  return instance(config)
}

export default request