const notice = {
  state: {
    total: '',
    arr: []
  },
  mutations: {
    SET_NOTICETOTAL: (state, num) => {
      state.total = num
    },
    SET_NOTICEARR: (state, arr) => {
      state.arr = arr
    }
  }
}
export default notice

