const routes = require("./routes.js")
module.exports = {
  /**
   * 
   * @param {String} str 路由字符串 
   */
  spliteRoute(str) {
    const res = str.split("/");
    const file = typeof res[0] != undefined && typeof res[0] != null ? res[0] : null
    const func = typeof res[1] != undefined && typeof res[1] != null ? res[1] : null
    return {
      file: file,
      func: func
    }
  },
  /**
   * 验证路由是否存在
   */
  verifyRoute(route){
    if(route === undefined || routes[route] === undefined || routes[route]=== null){
      return false;
    }
  },
  /**
   * 返回结果
   * @param {Number} code 响应码 约定自然数是正确的响应，负整数为错误码。
   * @param {Number} code 响应消息
   * @param {Number} data 响应数据 如果是失败的消息一般留空
   */
  resultReturn(code=null,msg=null,data=null){
    const res = {}
    if(code != null){
      res.code = code
    }
    if(msg != null){
      res.msg = msg
    }
    if(data != null){
      res.data = data
    }
    return res
  }

}