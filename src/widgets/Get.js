// get 参数
var $_GET = (function () {
  var url = window.document.location.href.split('?')
  if (url.length < 2) return {}
  var us = url[1].replace(/#(.)*$/, '') + (url.length === 3 ? '&' + url[2] : '')
  if (typeof us === 'string') {
    var u = us.split('&')
    var get = {}
    for (var i in u) {
      var j = u[i].split('=')
      get[j[0]] = j[1]
    }
    return get
  } else {
    return {}
  }
})()

export default $_GET
