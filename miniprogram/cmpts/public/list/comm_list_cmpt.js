const cloudHelper = require('../../../helper/cloud_helper.js');
const helper = require('../../../helper/helper.js');
const PublicBiz = require('../../../comm/biz/public_biz.js');
const pageHelper = require('../../../helper/page_helper.js');

Component({
  options: {
    addGlobalClass: true,
    pureDataPattern: /^_dataList/, // 指定所有 _ 开头的数据字段为纯数据字段
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  /**
   * 组件的属性列表
   */
  properties: {
    doDate: {
      type: Boolean,
      value: false
    },
    listHeight: { // 列表区高度
      type: String,
      value: ''
    },

    route: { // 业务路由
      type: String,
      value: ''
    },

    source: { // 来源 admin/user
      type: String,
      value: 'user'
    },

    _params: { // 路由的附加参数
      type: Object,
      value: null,
      observer: function (newVal, oldVal) { //TODO????
        if (!oldVal || !newVal) return; //页面data里赋值会引起触发，除非在组件标签里直接赋值,或者提前赋值

        // 清空当前选择
        if (newVal) {
          this.setData({
            pulldownMaskShow: false //返回去遮罩
          });
          this._fmtSearchData();
        }

        this.data._dataList = null;
        this.triggerEvent('list', { //TODO 考虑改为双向数据绑定model 
          dataList: this.data._dataList
        });
        this._getList(1);
      }
    },
    isTotalMenu: {
      type: Boolean, //是否整个搜索菜单显示
      value: true
    },
    _items: { // 下拉菜单基础数据
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        if (newVal) this._fmtSearchData();
      }
    },
    _menus: { // 非下拉菜单基础数据 
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        if (newVal) this._fmtSearchData(); //置为纯数据字段则不触发
      }
    },
    _dataList: {
      type: Object,
      value: null
    },
    type: {
      type: String, //业务类型 info,user,well
      value: ''
    },
    placeholder: {
      type: String,
      value: '搜索关键字'
    },
    sortMenusDefaultIndex: {
      type: Number,
      value: -1 //横菜单默认选中的
    },
    search: {
      type: String, //搜索框关键字
      value: '',
      observer: function (newVal, oldVal) {
        // 清空当前选择
        if (newVal) {
          this.setData({
            pulldownMaskShow: false //返回去遮罩
          });
          this._fmtSearchData();
        }

        this.data._dataList = null;
        this.triggerEvent('list', { //TODO 考虑改为双向数据绑定model 
          dataList: this.data._dataList
        });
        this._getList(1);
      }
    },
    whereEx: {
      type: Object, // 附加查询条件
      value: null,
    },
    returnUrl: {
      type: String, // 搜索完返回页面
      value: '',
    },
    topBottom: {
      type: String, // 回顶部按钮的位置
      value: '50'
    },
    isCache: { // 非缓存状态下或者list缓存过期下onshow加载, 缓存下onload加载
      type: Boolean, //是否cache
      value: true
    },
    pulldownType: {
      type: Array, // 下拉菜单展示模式 list/modal 每个菜单一个
      value: ['list', 'list', 'list', 'list', 'list', 'list']
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    refresherTriggered: false, //下拉刷新是否完成

    sortItems: [], //下拉
    sortMenus: [], //一级菜单非下拉

    sortType: '', //回传的类型
    sortVal: '', //	回传的值

    sortItemIndex: -1,
    sortIndex: -1,

    topNum: 0, //回顶部
    topShow: false,

    pulldownMaskShow: false, //下拉菜单遮罩

    startDate: '', //默认起始时间  
    endDate: '', //默认结束时间 
  },

  lifetimes: {
    created: function () {
      // 组件实例化，但节点树还未导入，因此这时不能用setData
    },
    attached: function () {
      // 在组件实例进入页面节点树时执行 
      // 节点树完成，可以用setData渲染节点，但无法操作节点 
    },
    ready: async function () {

      // 组件布局完成，这时可以获取节点信息，也可以操作节点
      this._fmtSearchData();

      if (this.data.isCache) //缓存状态下加载
        await this._getList(1);
      await this.paddingData();
      //取得预置参数_params的选中状态 
      let params = this.data._params;
      if (params && params.sortType && helper.isDefined(params.sortVal)) {
        let sortMenus = this.data._menus;
        for (let k = 0; k < sortMenus.length; k++) {
          if (params.sortType == sortMenus[k].type && params.sortVal == sortMenus[k].value) {
            this.setData({
              //sortType: sortMenus[k].type,
              //sortVal: sortMenus[k].value,
              sortMenusDefaultIndex: k
            });
            break;
          }
        }
      }

    },
    move: function () {
      // 组件实例被移动到树的另一个位置
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  pageLifetimes: {
    async show() {
      // 页面被展示   
      if (!this.data.isCache || !PublicBiz.isCacheList(this.data.type)) {
        // 非缓存状态下或者 list缓存过期下加载
        await this._getList(1);
      }

    },
    hide() {
      // 页面被隐藏
    },
    resize(size) {
      // 页面尺寸变化
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    reload: async function () {
      await this._getList(1);
    },
    // 填充虚拟数据，这里是在开发环境下演示数据，生产环境时应该删除或者注释。
    paddingData: async function () {
      let data = [
        {
        MEET_CATE_ID: "3",
        MEET_CATE_NAME: "项目预约",
        MEET_DAYS: [],
        MEET_OBJ: {
          desc: "笔记本电脑散热清灰和扬声器清灰",
          cover: ["https://th.bing.com/th?id=OIP.eYYm0U3_OM2xxX5EDE_4YgHaHa&w=98&h=104&c=7&o=6&dpr=2&pid=13.1"],
          content: [{type: "text", val: "电脑清灰"}],
          level: 3,
          spec: ""
        },
        MEET_TITLE: "电脑清灰",
        openRule: "0天可预约",
        _id: "8da4b7e665d5bb29016edd1b3ae0e35b"
      },
      {
        MEET_CATE_ID: "2",
        MEET_CATE_NAME: "项目预约",
        MEET_DAYS: [],
        MEET_OBJ: {
          desc: "给你的电脑更换更大的内存条",
          cover: ["data:image/jpeg;base64,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"],
          content: [{type: "text", val: "电脑清灰"}],
          level: 3,
          spec: ""
        },
        MEET_TITLE: "内存条更换",
        openRule: "0天可预约",
        _id: "8da4b7e665d5bb29016edd1b3ae0e35b"
      },
    ];
    let dataList = this.data._dataList;
    dataList.list=[...dataList.list,...data];
    this.setData({
      _dataList:dataList
    });
    },
    // 数据列表
    _getList: async function (page) {
      let params = {
        page: page,
        ...this.data._params
      };
      if (this.data.whereEx) params.whereEx = this.data.whereEx;

      // 搜索关键字
      if (this.data.search)
        params.search = this.data.search;

      // 搜索菜单
      if (this.data.sortType && helper.isDefined(this.data.sortVal)) {
        params.sortType = this.data.sortType;
        params.sortVal = this.data.sortVal;
      }

      //if (page == 1 && !this.data._dataList) { TODO???
      if (page == 1) {
        this.triggerEvent('list', {
          dataList: null //第一页面且没有数据提示加载中
        });
      }


      let opt = {};
      //if (this.data._dataList && this.data._dataList.list && this.data._dataList.list.length > 0)
      opt.title = 'bar';
      await cloudHelper.dataList(this, '_dataList', this.data.route, params, opt);

      this.paddingData();   // 生产环境中需要删除


      this.triggerEvent('list', { //TODO 考虑改为双向数据绑定model
        sortType: this.data.sortType,
        dataList: this.data._dataList
      });
      if (this.data.isCache)
        PublicBiz.setCacheList(this.data.type);
      if (page == 1) this.bindTopTap();


    },

    bindReachBottom: function () {
      // 上拉触底 
      this._getList(this.data._dataList.page + 1);
    },

    bindPullDownRefresh: async function () {
      // 下拉刷新
      this.setData({
        refresherTriggered: true
      });
      await this._getList(1);
      this.setData({
        refresherTriggered: false
      });

    },

    /**
     * 顶部位置
     * @param {*} e 
     */
    bindScrollTop: function (e) {
      if (e.detail.scrollTop > 100) {
        this.setData({
          topShow: true
        });
      } else {
        this.setData({
          topShow: false
        });
      }
    },

    /**
     * 一键回到顶部
     */
    bindTopTap: function () {
      this.setData({
        topNum: 0
      });
    },

    // 初始化搜索
    _fmtSearchData: function () {
      let data = {};
      let sortItems = [];
      let items = this.data._items;
      for (let k = 0; k < items.length; k++) {
        let item = {
          show: false,
          items: items[k]
        };
        sortItems.push(item);
      }
      data.sortItems = sortItems;
      data.sortMenus = this.data._menus;

      data.sortItemIndex = -1;
      data.sortIndex = -1;

      data.sortType = '';
      data.sortVal = '';
      this.setData(data);

    },

    /**
     * 清除搜索条件
     */
    bindSearchClearTap: function () {
      // 请求父页面清空搜索
      if (this.data.search) {
        this.triggerEvent('list', {
          search: ''
        });
      }
    },


    // 分类&排序一级菜单选择  
    bindSortTap: function (e) {
      let sortIndex = e.currentTarget.dataset.index;
      let sortItems = this.data.sortItems;

      // 横菜单默认选中取消 TODO
      /*
      this.setData({
      	sortMenusDefaultIndex: -1
      });*/

      // 换了下拉菜单
      let sortItemIndex = (sortIndex != this.data.sortIndex) ? -1 : this.data.sortItemIndex;

      if (sortIndex < 5) {
        let pulldownMaskShow = this.data.pulldownMaskShow;

        // 有下拉
        for (let i = 0; i < sortItems.length; i++) {
          if (i != sortIndex)
            sortItems[i].show = false;
          else {
            sortItems[i].show = !sortItems[i].show;
            pulldownMaskShow = sortItems[i].show;
          }

        }
        this.setData({
          pulldownMaskShow, //遮罩

          sortItems,
          sortIndex,
          sortItemIndex
        });
      } else {
        //无下拉
        for (let i = 0; i < sortItems.length; i++) {
          sortItems[i].show = false;
        }
        this.setData({
          pulldownMaskShow: false,
          sortItems,
          sortIndex,
          sortItemIndex
        });

        this._getSortKey();
      }
    },

    /**
     * 下拉菜单选择
     */
    bindSortItemTap: function (e) {
      let sortItemIndex = e.target.dataset.idx;
      if (!sortItemIndex) sortItemIndex = 0; // #46
      let sortItems = this.data.sortItems;
      for (let i = 0; i < sortItems.length; i++) {
        sortItems[i].show = false;
      }
      this.setData({
        pulldownMaskShow: false,
        sortItemIndex,
        sortItems
      });
      this._getSortKey();

    },

    // 获得排序关键字
    _getSortKey: function () {
      let sortVal = '';
      let sortType = '';

      let oldSortVal = this.data.sortVal;
      let oldSortType = this.data.sortType;

      if (this.data.sortIndex < 5) {
        sortVal = this.data.sortItems[this.data.sortIndex].items[this.data.sortItemIndex].value;
        sortType = this.data.sortItems[this.data.sortIndex].items[this.data.sortItemIndex].type;
      } else {
        sortVal = this.data.sortMenus[this.data.sortIndex - 5].value;
        sortType = this.data.sortMenus[this.data.sortIndex - 5].type;
      }
      this.setData({
        sortVal,
        sortType
      });

      if (sortVal != oldSortVal || sortType != oldSortType) {
        // 点击分类 

        if (this.data.startDate || this.data.endDate) {
          this.setData({
            startDate: '',
            endDate: ''
          });
        }
        if (this.data.search) {
          //清空搜索
          this.triggerEvent('list', {
            search: ''
          });
        } else
          this._getList(1);

      }

    },

    // 搜索跳转
    bindSearchTap: function (e) {
      wx.navigateTo({
        url: pageHelper.fmtURLByPID('/pages/search/search?source=' + this.data.source + '&type=' + this.data.type + '&returnUrl=' + this.data.returnUrl)
      });
    },

    getSortIndex: function () { //获得横向菜单
      return this.data.sortIndex;
    },
    setSortIndex: function (sortIndex) { //设置横向菜单
      this.setData({
        sortIndex
      });
    },

    bindDateStartChange(e) {
      this.setData({
        startDate: e.detail.value,
      });
    },
    bindDateEndChange(e) {
      this.setData({
        endDate: e.detail.value,
      });
    },
    bindDateSearchTap: function (e) {
      if (!this.data.startDate.includes('-')) return pageHelper.showNoneToast('请选择开始日期');
      if (!this.data.endDate.includes('-')) return pageHelper.showNoneToast('请选择结束日期');

      let search = this.data.startDate + '#' + this.data.endDate;
      this.setData({
        search
      })
      this._getList(1);
    },
    bindDateClearTap: function (e) {
      this.setData({
        startDate: '',
        endDate: '',
      });
      if (this.data.search) {
        this.setData({
          search: ''
        });
      }

    }

  }
})