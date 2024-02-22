let shared ;
try{
  shared = require('../lib/tools/shared.js')
} catch (e){
  console.warn('请配置 shared.js')
  shared = {
    is_demo: true
  }
}

module.exports = {
	//### 环境相关 
	CLOUD_ID: 'cloud1-1ghp17rt8303632d', //云服务id ,本地测试环境 

	// #### 版本信息 
	VER: 'build 2023.01.14',
	COMPANY: '联系作者',

	// #### 系统参数 
	IS_SUB: false, //分包模式 
	IS_DEMO: shared.is_demo, //是否演示版  

	MOBILE_CHECK: false, //手机号码是否真实性校验


	//#################     
	IMG_UPLOAD_SIZE: 20, //图片上传大小M兆    

	// #### 缓存相关
	CACHE_IS_LIST: true, //列表是否缓存
	CACHE_LIST_TIME: 60 * 30, //列表缓存时间秒    

}