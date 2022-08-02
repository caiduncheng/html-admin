export default {
	namespaced: true,
	getters: {
    // 0: 技术专员 1:客服专员
		departIssType: state => {
			let returnN = "";
			if (state.agentType === 0 || state.customerType === 0 || state.engineerType === 0) returnN = 0;
			if (state.agentType === 1 || state.customerType === 1 || state.engineerType === 1) returnN = 1;
			return returnN;
		}
	},
	state: {
    menuFunctionList: [],
    // 页面文档可视高度(随窗口改变大小)
		documentClientHeight: 0,
    // 导航条, 布局风格, defalut(默认) / inverse(反向)
		navbarLayoutType: "default",
    // 侧边栏, 布局皮肤, light(浅色) / dark(黑色)
		sidebarLayoutSkin: "light",
    // 侧边栏, 折叠状态
		sidebarFold: false,
    // 侧边栏, 菜单
		menuList: [],
		dynamicMenuRoutes: [],
		menuActiveName: "",
    // 主入口标签页
		mainTabs: [],
		mainTabsActiveName: "",
		langPick: "",
		currentTabName: "",
		infoiterationName: "",
		proManager: 0,
		loginUserId: 0,
		iterationUserId: "", // 迭代负责人
		valTxt: "",
    // 存储上一页的page
		page: {
			pageIndex: 1,
			pageSize: 10,
			classifyId: "",
			classifyName: ""
		},
		issueAdvancedSearch: {
			countryName: null,
			spName: null,
			customerIssue: null,
			engineerIssue: null,
			agentIssue: null,
			npiIssue: null,
			customerId: null,
			engineerId: null,
			agentId: null,
			npiId: null,
			proName: null,
			proId: null,
			iterName: null,
			iterId: null,
			tabIndex: "" // 切换tab时存储
		},
		issueCommonSearch: {
		},
		issuePageIndex: 1,
		issueTabIndex: 0,
		searchCondition: [],
		routeId: 0,
		gantt: { // 甘特图
			issId: "",
			noSelctTask: true,
			selectedTask: null,
			selectCurrentIssId: "" // 父级中区分选中迭代任务/一般任务
		},
    // 用户角色列表
		roleIdList: [],
		agentType: "", // 专员或专员master类型（只能二选其一）
		customerType: "", // 客户类型（可同时为其二）
		engineerType: "", // 工程师类型（可能只为普通工程师，npi/service =》engineer）
		spLevel: "", // 客户级别
		issueTabName: "",
		storePageSize: {},
		routePath: "",
		fileSize: {},
		fullPath: "",  // 完整路径，包括query
		linkIdList: [], // issue中关联问题idlist
		unReadCount: 0, // 未读消息数
		oaIds: [], // oa逐条处理时跳过的oaId
		homeToTask: { // 从首页跳转到我的任务时的状态和名字
			state: "",
			id: ""
		},
		wsDataList: [],
    // 项目配置页面page保存
		projectPage: {
			pageIndex: "",
			pageSize: "",
			proId: "",
			proName: "",
			memberName: "",
			savePage: false
		},
		issueHomeToIssue: {
			tabIndex: "",
			status: "",
			orgId: "",
			orgName: ""
		},
		envirVersion: "", // 用户所属部门角色：npi用户,product:产品平台用户
    // page保存
		historyPage: {
			pageIndex: "",
			pageSize: "",
			savePage: false,
			fromUrl: "" // 需要保存的url页面
		}
	},
	mutations: {
    updateMenuFunctionList (state, menuFunctionList) {
      state.menuFunctionList = menuFunctionList
    },
		updateDynamicMenuRoutes (state, menuRoutes) {
			state.dynamicMenuRoutes = menuRoutes;
		},
		saveSpLevel (state, spLevel) {
			state.spLevel = spLevel;
		},
		saveEngineerType (state, engType) {
			state.engineerType = engType;
		},
		saveCusType (state, cusType) {
			state.customerType = cusType;
		},
		saveAgentType (state, agentType) {
			state.agentType = agentType;
		},
		saveLinkIdlist (state, linkIdList) {
			state.linkIdList = linkIdList;
		},
		updateUnreadCount (state, unReadCount) {
      // debugger
			if (unReadCount || unReadCount === 0) {
				state.unReadCount = unReadCount;
			}
			if (!unReadCount && state.unReadCount > 0) {
				state.unReadCount -= 1;
			}
		},
		saveRoutePath (state, path) {
			state.routePath = path;
		},
		saveIssuePageTabIndex (state, obj) {
			state.issuePageIndex = obj.pageIndex;
			state.issueTabIndex = obj.tabIndex;
		},
		savePageSize (state, sizeObj) {
			state.storePageSize[sizeObj.path] = sizeObj.size;
		},
		updateDocumentClientHeight (state, height) {
			state.documentClientHeight = height;
		},
		updateNavbarLayoutType (state, type) {
			state.navbarLayoutType = type;
		},
		updateSidebarLayoutSkin (state, skin) {
			state.sidebarLayoutSkin = skin;
		},
		updateSidebarFold (state, fold) {
			state.sidebarFold = fold;
		},
		updateMenuList (state, list) {
      // debugger
			state.menuList = list;
		},
		updateMenuActiveName (state, name) {
			state.menuActiveName = name;
		},
		updateMainTabs (state, tabs) {
			state.mainTabs = tabs;
		},
		updateMainTabsActiveName (state, name) {
			state.mainTabsActiveName = name;
		},
		updateLang (state, lang) {
			state.langPick = lang;
		},
		updateTabName (state, tabName) {
			state.currentTabName = tabName;
		},
		updataInfoiterationName (state, issName) {
			state.infoiterationName = issName;
		},
    // 更新迭代负责人
		updataIterationUserId (state, issUserId) {
			state.iterationUserId = issUserId;
		},
		updateProManager (state, proManager) {
			state.proManager = proManager;
		},
		updateLoginUserId (state, loginUserId) {
			state.loginUserId = loginUserId;
		},
		updaValTxt (state, valTxt) {
			state.valTxt = valTxt;
		},
    // 保存pageIndex
		savePageIndex (state, page) {
      // state.page.pageIndex = page.pageIndex
      // state.page.pageSize = page.pageSize
      // state.page.classifyId = page.classifyId
      // state.page.classifyName = page.classifyName
			Object.keys(page).forEach(key => {
				state.page[key] = page[key];
			});
		},
		resetPageIndex (state) {
			Object.keys(state.page).forEach(key => {
				state.page[key] = "";
			});
		},
		saveIssueCommonSearch (state, issueCommonSearch) {
			state.issueCommonSearch = issueCommonSearch;
		},
    // 保存issue-advanced-search中的查询条件
		saveIssueAdvancedSearch (state, issueAdvancedSearch) {
			state.issueAdvancedSearch = issueAdvancedSearch;
			state.searchCondition = [issueAdvancedSearch.countryName, issueAdvancedSearch.spName, issueAdvancedSearch.customerIssue,
				issueAdvancedSearch.engineerIssue, issueAdvancedSearch.agentIssue, issueAdvancedSearch.npiIssue,
				issueAdvancedSearch.proName, issueAdvancedSearch.iterName].filter((item) => Boolean(item));
		},
		clearIssueAdvancedSearch (state) {
			state.issueAdvancedSearch.countryName = null;
			state.issueAdvancedSearch.spName = null;
			state.issueAdvancedSearch.customerIssue = null;
			state.issueAdvancedSearch.engineerIssue = null;
			state.issueAdvancedSearch.agentIssue = null;
			state.issueAdvancedSearch.customerId = null;
			state.issueAdvancedSearch.engineerId = null;
			state.issueAdvancedSearch.agentId = null;
			state.issueAdvancedSearch.npiIssue = null;
			state.issueAdvancedSearch.npiId = null;
			state.issueAdvancedSearch.proName = null;
			state.issueAdvancedSearch.proId = null;
			state.issueAdvancedSearch.iterName = null;
			state.issueAdvancedSearch.iterId = null;
			state.issueAdvancedSearch.tabIndex = ""; // 切换tab时存储
			state.searchCondition = [];
      // state.issueTabName = ''
		},
		saveRouteId (state, routeId) {
			state.routeId = routeId;
		},
    // 甘特图中的方法 // 存储迭代issId
		saveGanttIssId (state, issId) {
			state.gantt.issId = issId;
		},
    // 在总任务中区分选中迭代/任务
		disSelectCurrentIssId (state, selectCurrentIssId) {
			state.gantt.selectCurrentIssId = selectCurrentIssId;
		},
    // 选择甘特任务时 修改按钮可点击
		changeGanttNoSelctTask (state, noSelctTask) {
			state.gantt.noSelctTask = noSelctTask;
		},
    // 选择甘特任务时将task传到下方显示
		saveGanttSelectedTask (state, task) {
			state.gantt.selectedTask = task;
		},
    // 存储登录时获取到的用户信息角色
		saveRoleIdList (state, list) {
			state.roleIdList = list;
		},
		saveIssueTabName (state, issueTabName) {
			state.issueTabName = issueTabName;
		},
		saveFileSize (state, obj) {
			state.fileSize.issFileSize = obj.issFileSize;
			state.fileSize.resFileSize = obj.resFileSize;
		},
		fullPath (state, fullPath) {
			state.fullPath = fullPath;
		},
    // 保存oa逐条处理时跳过的oaIds
		updateOaIds (state, oaId) {
			if (oaId && state.oaIds.indexOf(oaId) === -1) {
				state.oaIds.push(oaId);
			}
		},
		clearOaIds (state) {
			state.oaIds.length = 0;
		},
		saveHomeToTask (state, task) {
			state.homeToTask.state = task.state;
			state.homeToTask.id = task.id;
		},
		clearHomeToTask (state) {
			state.homeToTask = {};
		},
		saveWsDataList (state, wsData) {
			state.wsDataList.push(wsData);
		},
		deleteWsDataList (state, wsKey) {
			state.wsDataList.forEach((item, index) => {
				if (item.id === wsKey) {
					state.wsDataList.splice(index, 1);
				}
			});
		},
		saveProjectPage (state, page) {
			state.projectPage.pageIndex = page.pageIndex;
			state.projectPage.pageSize = page.pageSize;
			state.projectPage.proId = page.proId;
			state.projectPage.proName = page.proName;
			state.projectPage.memberName = page.memberName;
			state.projectPage.savePage = page.savePage;
		},
		clearProjectPage (state) {
			state.projectPage = {
				pageIndex: "",
				pageSize: "",
				proId: "",
				proName: "",
				memberName: "",
				savePage: false
			};
		},
		saveIssueHomeToIssue (state, obj) {
			state.issueHomeToIssue = obj;
		},
    // 存储登录时获取到的用户部门角色
		saveEnvirVersion (state, envirVersion) {
			state.envirVersion = envirVersion;
		},
		saveHistoryPage (state, page) {
			state.historyPage = page;
		},
		clearHistoryPage (state) {
			state.historyPage = {
				pageIndex: "",
				pageSize: "",
				savePage: false,
				fromUrl: ""
			};
		}
	}
};
