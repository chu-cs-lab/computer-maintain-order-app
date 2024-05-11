// 公共头部文件
const cloud = require('wx-server-sdk')
const env = require("shared")

cloud.init({
  env: env.cloud_id
})
module.exports={
  cloud:cloud,
}