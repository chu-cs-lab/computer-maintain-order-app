const functions = require("common/functions.js")
const head = require("../common/head.js")
module.exports = {
  /**
   * 处理邀请码验证方法
   */
  async verifyInviteCode(param) {
    const code = param.code
    if (!code) {
      return false
    }
    const result = await head.cloud
      .database()
      .collection("invite_code_list")
      .where({
        invite_code: code,
      })
      .get()
    if (result.data.length !== 0) {
      // 删除邀请码
      const res = await head.cloud
      .database()
      .collection("invite_code_list")
      .where({
        invite_code: code,
      })
      .remove({
        success:function(){
          return true
        }
      })
      return functions.resultReturn(1, "验证成功！");
    } else {
      return functions.resultReturn(-3, "邀请码不存在或者已被使用！");
    }
  }
}