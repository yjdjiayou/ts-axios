import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'

/**
 * 工厂函数
 * @param config
 */
function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  // 这里需要返回一个混合对象，该对象既可以当作函数使用，也可以当作对象使用

  // 当前的 instance 被赋值为一个函数，需要修正 this 的指向
  const instance = Axios.prototype.request.bind(context)

  // 将实例对象 context 上所有的属性/方法都拷贝到 instance 这个函数上
  // 把 instance 当作函数执行时，就相当于在调用 Axios.prototype.request 方法
  extend(instance, context)

  return instance as AxiosStatic
}

const axios = createInstance(defaults)

axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}

export default axios
