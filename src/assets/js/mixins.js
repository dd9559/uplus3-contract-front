const MIXINS = {
  methods: {
    /**
     * 收取字典id，拼接字符串
     * @param obj
     * @returns {string}
     */
    getDictionaryIds: function (obj) {
      let arr = []
      for (let item in obj) {
        arr.push(item)
      }
      return arr.join(',')
    },
    /**
     * 获取筛选数据
     * dictionary必须在各自页面定义 例：dictionary:{'1':'','2':''}
     */
    getDictionary: function () {
      let param = {
        parentIds: this.getDictionaryIds(this.dictionary)
      }
      this.$ajax.get('/api/dictionary/batchQuery', param).then(res => {
        console.log(res);
        res = res.data
        if (res.status === 200) {
          console.log(res.data)
          this.dictionary = Object.assign({}, res.data)
        }
      })
    }
  }
}
export {
  MIXINS
}
