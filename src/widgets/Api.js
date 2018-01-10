import axios from 'axios'
import local from './Local'

var baseURL = local === 1 ? 'http://172.16.2.89/hmhome' : '//cloud.ehuimeng.com'
axios.defaults.baseURL = baseURL

const post = function (url, data, scb, ecb) {
  axios
    .post(url, data)
    .then(response => {
      scb(response.data)
    })
    .catch(error => {
      ecb(error)
    })
}

const get = function (url, scb, ecb) {
  axios
    .get(url)
    .then(response => {
      scb(response.data)
    })
    .catch(error => {
      ecb(error)
    })
}

const obj2json = function (obj) {
  if (typeof obj !== 'object') return obj
  return JSON.parse(JSON.stringify(obj))
}

export default {
  baseURL,
  post,
  get,
  obj2json
}
