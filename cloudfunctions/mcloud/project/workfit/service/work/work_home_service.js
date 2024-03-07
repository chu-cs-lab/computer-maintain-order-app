/**
 * Notes: 服务者首页管理模块 
 * Date: 2023-01-15 07:48:00 
 * Ver : CCMiniCloud Framework 2.0.8  (wechat)
 */
const cloud = require("wx-server-sdk")
const db = cloud.database();

const BaseProjectWorkService = require('./base_project_work_service.js');

const timeUtil = require('../../../../framework/utils/time_util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const md5Lib = require('../../../../framework/lib/md5_lib.js');

const MeetModel = require('../../model/meet_model.js');

const MeetService = require('../../service/meet_service.js');
const EngineerModel = require('../../model/engineer_model.js');
const { ORDER_BY } = require("../../model/meet_model.js");

class WorkHomeService extends BaseProjectWorkService {


	/**
	 * 首页数据归集
	 */
	async workHome(meetId) {

		let meetService = new MeetService();
		let dayList = await meetService.getDaysSet(meetId, timeUtil.time('Y-M-D'));
    let dayCnt = dayList.length;
    
    //  
		return { dayCnt };
	}

  // 新的登录
	async workLogin(phone, password, openId) {

		// 判断是否存在
		let where = {
		  phone: phone,
			password: md5Lib.md5(password),
			status:EngineerModel.STATUS.OK
    }
    
		let fields = "_openid,name,token,token_time,last_login_time,avatar,login_count";
    let res = await EngineerModel.getOne(where,fields,"",false);
    console.log("登录返回：",res);

		if (!res)
      this.AppError('该账号不存在或者密码错误');
    
		let cnt = res.login_count;

		// 生成token
		let token = dataUtil.genRandomString(32);
    let tokenTime = timeUtil.time();
    
		let data = {
			openid:openId,
			token: token,
			token_time: tokenTime,
			last_login_time: timeUtil.time(),
			login_count: cnt + 1
    }

    await EngineerModel.edit(where, data,false);

		let name = res.name;
		let id = res._id;
		let last = (!res.last_login_time) ? '尚未登录' : timeUtil.timestamp2Time(res.last_login_time);
		let pic = '';
		if (res.avatar && res.avatar.length > 0)
      pic = res.avatar;
      
		return {
			id,
			token,
			name,
			last,
			cnt,
			pic
		}

	}

	/** 修改自身密码 */
	async pwdWork(workId, oldPassword, password) {
		let where = {
			_id: workId,
			MEET_PASSWORD: md5Lib.md5(oldPassword),
		}
		let work = await MeetModel.getOne(where);
		if (!work)
			this.AppError('旧密码错误');

		let data = {
			MEET_PASSWORD: md5Lib.md5(password),
		}
		return await MeetModel.edit(workId, data);
	}

}

module.exports = WorkHomeService;