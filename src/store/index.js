import Vue from "vue";
import Vuex from "vuex";
import cloneDeep from "lodash/cloneDeep";
import common from "./modules/common";
import user from "./modules/user";
import issue from "./modules/issue";
import persistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		common,
		user,
		issue
	},
	mutations: {
    // 重置vuex本地储存状态
		resetStore (state) {
			Object.keys(state).forEach((key) => {
				state[key] = cloneDeep(window.SITE_CONFIG["storeState"][key]);
			});
		}
	},
	// plugins: [
	// 	persistedState({ storage: window.localStorage })
	// ],
	strict: process.env.NODE_ENV !== "production"
});
