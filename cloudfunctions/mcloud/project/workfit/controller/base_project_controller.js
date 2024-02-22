/**
 * Notes: 本业务基本控制器
 * Date: 2021-03-15 19:20:00 
 * 
 */

const BaseController = require('../../../framework/platform/controller/base_controller.js');
const BaseProjectService = require('../service/base_project_service.js');

class BaseProjectController extends BaseController {

	// TODO
	async initSetup() {
		let service = new BaseProjectService();
		await service.initSetup();
	}
}

module.exports = BaseProjectController;