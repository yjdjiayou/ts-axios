/**
 * 处理 headers
 */

import { isPlainObject, deepMerge } from './util'
import { Method } from '../types'

/**
 *  标准化请求头
 * @param headers
 * @param normalizedName
 */
function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(name => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

/**
 * 处理请求头
 * @param headers
 * @param data
 */
export function processHeaders(headers: any, data: any): any {
  // 因为 headers 属性大小写不敏感
  // 所以这里将 headers 里面的可能包含的 content-type 大写化
  normalizeHeaderName(headers, 'Content-Type')

  // 当 data 是一个对象时
  if (isPlainObject(data)) {
    // 当 headers 没有配置 Content-Type 时
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

/**
 * 处理响应头——将字符串转换成对象
 * @param headers
 */
export function parseHeaders(headers: string): any {
  // 创建一个空对象
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }

  headers.split('\r\n').forEach(line => {
    let [key, val] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    if (val) {
      val = val.trim()
    }
    parsed[key] = val
  })

  return parsed
}

/**
 * 扁平化 headers —— 提取想要的属性
 * @param headers
 * @param method
 */
export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }
  // 扁平化处理：将复杂的嵌套结构的对象转化成只有一层结构的对象
  // 将 headers.common 里的值 和当前 method 对应的值都提取出来
  // 合并后的 headers 是一个复杂的对象
  headers = deepMerge(headers.common, headers[method], headers)

  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']

  // 因为前面已经提取出需要的值了，所以这里需要删除不会使用到的字段
  methodsToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}
