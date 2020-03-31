export default {
  toImage (el, options) {
    return new Promise(resolve => {
      html2canvas(el, {
        scale: this.getPixelRatio(),
        ...options
      }).then(canvas => {
        const dataURL = canvas.toDataURL()

        resolve(dataURL)
      })
    })
  },

  downloadImage (el, imgName, options = {}) {
    this.toImage(el, options).then(dataURL => {
      // 移动端有许多兼容问题
      this.doDownloadImage(this.dataURLToBlob(dataURL), imgName)
    })
  },

  doDownloadImage (blob, imgName) {
    if (window.navigator.msSaveBlob) {
      try {
        window.navigator.msSaveBlob(blob, imgName)
      } catch (e) {
        console.error(e)
      }
    }

    const a = document.createElement('a')
    const url = this.creatURL(blob)

    a.download = imgName
    a.href = url
    a.click()
    a.remove()
    // 释放创建的url对象
    URL.revokeObjectURL(url)
  },

  creatURL (blob) {
    return URL.createObjectURL(blob)
  },

  // 屏幕像素比和canvas存储的像素比比值，决定canvas时在绘制时需要放大的倍数以适应retina屏幕
  getPixelRatio () {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    const backingStoreRatio =
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio ||
      1
    const devicePixelRatio = window.devicePixelRatio || 1

    return devicePixelRatio / backingStoreRatio
  },

  dataURLToBlob (dataURL) {
    // atob：解码base64，并提取data部分
    const data = atob(dataURL.split(',')[1])
    const len = data.length
    const arr = new Uint8Array(len)

    for (let i = 0; i < len; i++) {
      arr[i] = data.charCodeAt(i)
    }
    return new Blob([arr])
  },

  readBlobAsDataURL (blob) {
    return new Promise((resolve) => {
      const a = new FileReader()

      a.onload = function (e) {
        resolve(e.target.result)
      }
      a.readAsDataURL(blob)
    })
  },

  isMobile () {
    if (
      window.navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )
    ) {
      return true // 移动端
    }
    return false // PC端
  }
}
