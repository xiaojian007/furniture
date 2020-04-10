//  判断字符串长度
const strlen = (str) => {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    // let a = str.chartAt(i)
    // if (a.match(/[^\x00-\xff]/ig) != null) {
    //   len += 2
    // }   // (汉字算两个字符)
    len += 1
  }
  return len
}

// 输入框表情处理
const filterEmojis = (name) => {
  let newName = ''
  let is4Byte = function (str) {
    return str.codePointAt(0) > 65535
  }
  for (let item of name) {
    if (!is4Byte(item)) {
      newName += item
    }
  }
  return newName
}

// 判断是否是手机号码
const isPhone = (phone) => {
  let isPhone = phone == '' || phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)
  return isPhone
}

// 过滤中文
const removeChinese = (strValue) => {
  if (strValue != null && strValue != "") {
    var reg = /[\u4e00-\u9fa5]/g
    return strValue.replace(reg, "")
  } else {
    return ""
  }
}

module.exports = {
  strlen,
  filterEmojis,
  isPhone,
  removeChinese
}