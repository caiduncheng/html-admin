import { findIndex } from '@/utils/index.js'

export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    userType: 1,
    selections: [],
    rangeSelections: [],
    keys: {
      storage: {
        username: 'USER_NAME',
        lang: 'LANG'
      }
    }
  },
  getters: {
    watcherIds: state => {
      var watcherIds = state.selections.map(watcher => watcher.userId)
      return watcherIds
    },
    rangeWatcherIds: state => {
      var watcherIds = state.rangeSelections.map(watcher => watcher.userId)
      return watcherIds
    }
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateType (state, type) {
      state.userType = type
    },
    updateAccount (state, account) {
      state.account = account
    },
    UPDATE_SELECTIONS ({selections}, selection) {
      let index = findIndex(selections, selection)
      if (index === -1) {
        selections.push(selection)
      }
    },
    REMOVE_SELECTIONS ({selections}, selection) {
      // console.log(selections[0], selection)

      let index = findIndex(selections, selection)
      if (index > -1) {
        selections.splice(index, 1)
      }
    },
    CLEAR_SELECTIONS (state) {
      state.selections.splice(0, state.selections.length)
    },
    //
    UPDATE_RANGE_SELECTIONS ({rangeSelections}, selection) {
      let index = findIndex(rangeSelections, selection)
      if (index === -1) {
        rangeSelections.push(selection)
      }
    },
    REMOVE_RANGE_SELECTIONS ({rangeSelections}, selection) {
      // console.log(rangeSelections[0], selection)
      let index = findIndex(rangeSelections, selection)
      if (index > -1) {
        rangeSelections.splice(index, 1)
      }
    },
    CLEAR_RANGE_SELECTIONS (state) {
      state.rangeSelections.splice(0, state.rangeSelections.length)
    },
    // 从docConfig-company进入判断,表格多选时使用
    // UPDATE_RANGE_SELECTIONS_COMPANY ({rangeSelections}, selection) {
    //   let index = JSON.stringify(rangeSelections).indexOf(`"userId":${selection.userId}`)
    //   if (index === -1) {
    //     rangeSelections.push(selection)
    //   }
    // },
    // REMOVE_RANGE_SELECTIONS_COMPANY ({rangeSelections}, selection) {
    //   rangeSelections.forEach((item, index) => {
    //     if (item.userId === selection.userId) {
    //       rangeSelections.splice(index, 1)
    //     }
    //   })
    // },
    UPDATE_RANGE_SELECTIONS_COMPANY_RADIO ({rangeSelections}, selection) {
      rangeSelections.splice(0, rangeSelections.length)
      rangeSelections.push(selection)
    }
  }
}
