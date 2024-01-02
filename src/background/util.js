import { corsAnywhereUrl } from '@/common/config.js'

export function merge(...args) {
  return Object.assign({}, ...args)
}

export function serialize(params) {
  return Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join('&')
}
export function fetchImgToBase64(url) {
  return fetch(corsAnywhereUrl + url, {
    headers: {
      origin: 'https://www.sogou.com',
      'x-requested-with': 'XMLHttpRequest',
    },
  })
    .then((response) => response.blob())
    .then(
      (data) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(data)
        })
    )
}

// 搜狐表情返回的图片资源是不带 content-type 所以不能直接往 github 上贴链接（链接无效）
// 这里将图片转成 base64 时为图片加上正确的 type
export function standardizeBase64(base64, type) {
  return base64.replace(/^data:.*;/, `data:image/${type};`)
}

export function removeBase64Head(base64) {
  return base64.replace(/^data:.*base64,/, '')
}

export function dataURItoBlob(dataURI) {
  const data = dataURI.split(';base64,')
  const byte = atob(data[1])
  const mime = data[0].split(':')[1]
  const ab = new ArrayBuffer(byte.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byte.length; i++) {
    ia[i] = byte.charCodeAt(i)
  }
  return new Blob([ab], { type: mime })
}
