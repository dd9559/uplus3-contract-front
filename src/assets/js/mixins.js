const MIXINS = {
  data(){
    return{
      userMsg:null,
      DepList:[],
      EmployeList:[],
      Loading:true,
      preview:false,
      previewFiles:[]
    }
  },
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
    },
    /**
     * 获取当前用户信息
     */
    getAdmin:function () {
      this.$ajax.get('/api/payInfo/selectLogined').then(res=>{
        res=res.data
        if(res.status===200){
          this.userMsg = res.data
        }
      })
    },
    /**
     * 获取部门
     */
    remoteMethod:function (val) {
      this.$ajax.get('/api/access/deps',{keyword:val}).then(res=>{
        res=res.data
        if(res.status===200){
          this.DepList=[].concat(res.data)
          this.Loading=false
        }
      })
    },
    getEmploye:function (val) {
      this.$ajax.get('/api/organize/employees',{depId:val}).then(res=>{
        res=res.data
        if(res.status===200){
          this.EmployeList=res.data
        }
      })
    },
    /**
     * 获取签名
     */
    fileSign:function (arr) {
      this.$ajax.put('/api/load/generateAccessURLBatch',{urls:arr.join(',')},2).then(res=>{
        res=res.data
        if(res.status===200){
          this.previewFiles=res.data
          this.preview=true
        }
      })
    }
  }
}

export {
  MIXINS,
}
