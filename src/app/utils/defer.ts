export function defer() {
  let resolve
  let reject
  const promise: Promise<any> = new Promise(function () {
    resolve = arguments[0] // eslint-disable-line prefer-rest-params
    reject = arguments[1] // eslint-disable-line prefer-rest-params
  })
  return { resolve, reject, promise }
}
