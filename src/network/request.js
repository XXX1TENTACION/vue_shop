import axios from 'axios'

function request(config){
  const instance = axios.create({
    baseURL:`http://127.0.0.1:8888/api/private/v1/`
  })
  return instance(config)
}

export default request