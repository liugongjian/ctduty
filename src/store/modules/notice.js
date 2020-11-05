const notice = {
  state: {
    total: '',
    arr: [],
    hint: true
  },
  mutations: {
    SET_NOTICETOTAL: (state, num) => {
      state.total = num
    },
    SET_NOTICEARR: (state, arr) => {
      state.arr = arr
    },
    SET_HINT: (state, hint) => {
      state.hint = hint
    }
  }
}
export default notice

