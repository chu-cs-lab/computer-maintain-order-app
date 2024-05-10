// 云函数入口文件
const cloud = require('wx-server-sdk')
const env = require("shared")
cloud.init({
  env: env.cloud_id
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event.where);
  return cloud
    .database()
    .collection("shop_orders")
    .aggregate()
    .match({
      ...event.where
    })
    .sort({
      time:-1
    })
    .lookup({
      from: "shop_comments",
      localField: "_id",
      foreignField: "orderId",
      as:"comments"
    })
    .end()
    .then((res) => {
      return res;
    });
}