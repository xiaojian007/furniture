const calculator = require('./calculator.js')

const formatTime = date => {
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  month = month > 9 ? month : [0, month].join('')
  day = day > 9 ? day : [0, day].join('')
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/**
 * 时间格式化 yyyy-MM-dd hh:mm:ss
 */
const format = (date, fmt) => {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

const padLeftZero = (str) => {
  return ('00' + str).substr(str.length)
}


/**
 * 经纬度获取地址
 */
const getAddress = (latitude, longitude, callback) => {
  // 实例化API核心类
  let qqMap = new QQMapWX({
    key: '3RFBZ-SM7KK-RU6JP-AZYYQ-PQUO6-3CBD4' // 必填
  })

  // 调用接口
  qqMap.reverseGeocoder({
    location: {
      latitude: latitude,
      longitude: longitude
    },
    success: (res) => {
      if (res.result.address_component) {
        callback(true, res.result.address_component)
      } else {
        console.log('获取详细地址失败', res)
        callback(false, res)
      }
    },
    fail: (err) => {
      console.log('获取地址报错', err)
      callback(false, err)
    }
  })
}

/**
 * 提供地址获取详细地址
 */
const geocoder = (address, callback) => {
  // 实例化API核心类
  let qqMap = new QQMapWX({
    key: '3RFBZ-SM7KK-RU6JP-AZYYQ-PQUO6-3CBD4' // 必填
  })

  // 调用接口
  qqMap.geocoder({
    address: address,
    success: (res) => {
      callback(res)
    },
    fail: (err) => {
      console.log('详细地址获取省市区报错原因', err)
      callback(err)
    }
  })
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 处理 html 字符串
const getBody = (content) => {
  const REG_BODY = /<body[^>]*>([\s\S]*)<\/body>/
  const result = REG_BODY.exec(content)
  if (result && result.length === 2) {
    content = result[1]
  }
  content = content.replace(/<section/ig, '<div').replace(/<\/section>/ig, '</div>')
  content = content.replace(/<header/ig, '<div').replace(/<\/header>/ig, '</div>')
  content = content.replace(/<footer/ig, '<div').replace(/<\/footer>/ig, '</div>')
  content = content.replace(/<article/ig, '<div').replace(/<\/article>/ig, '</div>')
  content = content.replace(/<time/ig, '<div').replace(/<\/time>/ig, '</div>')
  content = content.replace(/<img/ig, '<img class="img-size"')
  content = content.replace(/http:\/\/wg\.cloud\.ininin\.com/ig, 'https://wg.cloud.ininin.com')
  return content
}

const formatParams = (params) => {
  let parts = []
  Object.keys(params).forEach((key) => {
    parts.push([key, params[key]].join('='))
  })
  return parts.join('&')
}

/**
 * json解析
 */
const jsonParse = (str) => {
  if (typeof str === 'string') {
    let json
    try {
      json = JSON.parse(str)
    } catch (e) {
      console.log(e)
    }
    return json
  } else if (str !== null && typeof str === 'object') {
    return str
  } else {
    return
  }
}

/**
 * 倒计时   start: 开始时间, end：结束时间
 */
const restTime = (start, end, pageObj, callback) => {
  // 结束时间
  let endTime = new Date(end.replace(/-/g, '/')).getTime()
  // 开始时间
  let staTime = new Date(start.replace(/-/g, '/')).getTime()
  const countDown = () => {
    let nowTime = new Date().getTime()
    let time = endTime - nowTime
    // 判断活动是否开始
    let isStart = staTime - nowTime
    // 倒计时时间
    let countDownData = {
      day: '00',
      hours: '00',
      minute: '00',
      second: '00'
    }
    // console.log(new Date(end), new Date(start))
    if (time > 0 && isStart < 0 && pageObj.isCountDown) {
      // 天数位
      let day = Math.floor(time / (60 * 60 * 24 * 1000))
      let dayStr = day.toString()
      if (dayStr.length == 1) dayStr = '0' + dayStr

      countDownData.day = dayStr

      // 小时位
      let hr = Math.floor(time / (60 * 60 * 1000) % 24)
      let hrStr = hr.toString()
      if (hrStr.length == 1) hrStr = '0' + hrStr

      countDownData.hours = hrStr

      // 分钟位
      let min = Math.floor(time / (60 * 1000) % 60)
      let minStr = min.toString()
      if (minStr.length == 1) minStr = '0' + minStr

      countDownData.minute = minStr

      // 秒位
      let sec = Math.floor(time / 1000 % 60)
      let secStr = sec.toString()
      if (secStr.length == 1) secStr = '0' + secStr

      countDownData.second = secStr

      // Math.floor对正数的小数取“舍”，对负数的小数取“入”
      // praseInt属于类型转换，会对字符逐级判断，占用内存较高
      callback(countDownData)

      setTimeout(countDown, 1000)
    } else {
      callback(countDownData)
      return false
    }
  }
  countDown()
}

module.exports = {
  format,
  getBody,
  calculator,
  formatTime,
  jsonParse,
  formatParams,
  getAddress,
  geocoder,
  restTime
}