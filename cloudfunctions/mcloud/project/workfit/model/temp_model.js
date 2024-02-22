/**
 * Notes: 预约日期设置实体
 * 
 * Date: 2021-01-25 19:20:00 
 */


const BaseProjectModel = require('./base_project_model.js');

class DayModel extends BaseProjectModel {

}

// 集合名
DayModel.CL = BaseProjectModel.C('temp');

DayModel.DB_STRUCTURE = {
	_pid: 'string|true',
	TEMP_ID: 'string|true',
	TEMP_NAME: 'string|true|comment=名字',

	TEMP_MEET_ID: 'string|false',

	TEMP_TIMES: 'array|true|comment=时间段',

	TEMP_ADD_TIME: 'int|true',
	TEMP_EDIT_TIME: 'int|true',
	TEMP_ADD_IP: 'string|false',
	TEMP_EDIT_IP: 'string|false',
};

// 字段前缀
DayModel.FIELD_PREFIX = "TEMP_";



module.exports = DayModel;