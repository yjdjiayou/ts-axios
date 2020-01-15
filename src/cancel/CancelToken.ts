import { Canceler, CancelExecutor, CancelTokenSource } from '../types'
import Cancel from './Cancel'

interface ResolvePromise {
  (reason?: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })

    executor(message => {
      if (this.reason) {
        return
      }
      this.reason = new Cancel(message);
      resolvePromise(this.reason)
    })
  }

  throwIfRequested(){
    if (this.reason) {
      throw this.reason
    }
  }

  static source():CancelTokenSource{
    // 因为 cancel 是在一个函数中被赋值，TS 无法检测到会报错
    // 所以这里加一个 非空断言
    let cancel!: Canceler;
    const token = new CancelToken(c =>{
      cancel = c;
    })

    return {
      cancel,
      token
    }

  }

}
