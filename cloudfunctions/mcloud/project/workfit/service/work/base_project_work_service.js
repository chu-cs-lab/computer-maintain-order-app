/**
 * Notes: 服务者管理模块业务基类
 * Date: 2023-01-15 07:48:00 
 * Ver : CCMiniCloud Framework 2.0.8  (wechat)
 */

const BaseService = require('../../../../framework/platform/service/base_service.js');

const timeUtil = require('../../../../framework/utils/time_util.js');
const appCode = require('../../../../framework/core/app_code.js');

const config = require('../../../../config/config.js');
const MeetModel = require('../../model/meet_model.js');
const EngineerModel = require("../../model/engineer_model.js");
class BaseProjectWorkService extends BaseService { 

	/** 是否登陆 */
	async isWork(token) {

		let where = {
			token: token,
			token_time: ['>', timeUtil.time() - config.WORK_LOGIN_EXPIRE * 1000], // token有效时间
			status: EngineerModel.STATUS.OK,
		}
		let res = await EngineerModel.getOne(where, '_id,name',"",false);
		if (!res)
      this.AppError('登录已过期，请重新登录', appCode.WORK_ERROR);
      
		return res;
	}

}

module.exports = BaseProjectWorkService;