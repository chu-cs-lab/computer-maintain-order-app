// 云函数入口文件
const cloud = require('wx-server-sdk')
const routes = require("common/routes.js")
const functions = require("common/functions.js")
const env = require("shared")
cloud.init({
  env: env.cloud_id
}) // 使用当前云环境
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const route = event.route;
  const param = event.param;
  // 验证类路由是否存在
  if (functions.verifyRoute(route) === false) {
    return functions.resultReturn(-1, "路由不存在")
  }
  // 解构路由
  const {
    file,
    func
  } = functions.spliteRoute(routes[route])

  // 引入方法模块
  try {
    const pack = require(`modules/${file}.js`)
    // 执行方法
    const res = await pack[func](param);
    return res;
  } catch (e) {
    return functions.resultReturn(-2, e);
  }


}