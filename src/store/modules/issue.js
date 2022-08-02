export default {
	namespaced: true,
	state: {
		issueList: [],
		proSearchParams: {},
		iterSearchParams: {}
	},
	mutations: {
		saveProSearchParams (state, params) {
			state.proSearchParams = params;
		},
		saveIterSearchParams (state, params) {
			state.iterSearchParams = params;
		}
	}
};
