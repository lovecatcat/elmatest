/*eslint-disable*/
let appId = document.getElementById('appId').value
let timestamp = document.getElementById('timestamp').value
let noncestr = document.getElementById('noncestr').value
let signature = document.getElementById('signature').value

wx.config({
  debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
  appId: appId, // 必填，公众号的唯一标识
  timestamp: timestamp, // 必填，生成签名的时间戳
  nonceStr: noncestr, // 必填，生成签名的随机串
  signature: signature, // 必填，签名，见附录1
  jsApiList: [ // 授权接口列表
    // 'getLocation',
    // 'closeWindow',
    'onMenuShareTimeline',
    'onMenuShareAppMessage',
    'onMenuShareQQ',
    'onMenuShareWeibo',
    'onMenuShareQZone'
    // 'chooseImage',
    // 'previewImage',
    // 'uploadImage',
    // 'downloadImage'
  ]
})

var share = function (share) {
  wx.ready(function () {
    wx.onMenuShareTimeline(share);
    wx.onMenuShareAppMessage(share);
    wx.onMenuShareQQ(share);
    wx.onMenuShareWeibo(share);
    wx.onMenuShareQZone(share);
  })
}

var close = function () {
  wx.closeWindow()
}

export default { share, close }
