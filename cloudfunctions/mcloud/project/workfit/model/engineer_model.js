/**
 * 独立工程师数据库模型
 */

const BaseProjectModel = require('./base_project_model.js');

class EngineerModel extends BaseProjectModel {

}

// 集合名
EngineerModel.CL = BaseProjectModel.C('engineer');

EngineerModel.DB_STRUCTURE = {
  phone:"string|true|comment=手机号",
  avatar:"string|false|comment=头像",
  login_count:"int|true|comment=登录次数",
  _open_id:"string|false|comment=工程师登录微信的openid",
  token:"string|false|comment=登录token",
  token_time:"int|false|comment=token过期时间",
	account:'string|true|comment=账号',
	password: 'string|true|comment=密码',
	name: 'string|true|comment=工程师名',
  openid:"string|false|comment=微信openid",
  free_time:"int|false|comment=空闲时间",
  info:"object|false|comment=扩展信息",
  status:"bool|true|是否启用",
  create_time:"int|true|注册时间",
  last_login_time:"int|true|comment=上次登录时间",
};

// 字段前缀
EngineerModel.FIELD_PREFIX = "";

/**
 * 状态 0=未启用,1=使用中,9=停止预约,10=已关闭 
 */
EngineerModel.STATUS = {
  OK:true,
  disabled:false
};

EngineerModel.STATUS_DESC = {
	OK: '正常',
	disabled: '已禁用',
};


EngineerModel.NAME = '工程师';

// 开关自带更新ADD_TIME,EDIT_TIME,DEL_TIME的操作 
EngineerModel.UPDATE_TIME = false;

// 开关自带更新ADD_IP,EDIT_IP,DEL_IP的操作 
EngineerModel.UPDATE_IP = false;


module.exports = EngineerModel;