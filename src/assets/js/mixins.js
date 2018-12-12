import {mapMutations,mapGetters} from 'vuex'

const MIXINS = {
  data(){
    return{
      userMsg:null,
      DepList:[],
      EmployeList:[],
      employeScroll:null,
      tree:true,
      Loading:true,
      preview:false,
      previewFiles:[],
      previewIndex:0,
      defaultProps: {
        children: 'subs',
        label: 'name'
      }
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
        // console.log(res);
        res = res.data
        if (res.status === 200) {
          // console.log(res.data)
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
      this.$ajax.get('/api/access/deps/tree',{keyword:val}).then(res=>{
        res=res.data
        if(res.status===200){
          this.DepList=[].concat(res.data)
          this.Loading=false
        }
      })
    },
    getEmploye:function (val,page=1) {
      this.$ajax.get('/api/organize/employees/pages',{depId:val,pageNum:page}).then(res=>{
        res=res.data
        if(res.status===200){
          this.EmployeList=this.EmployeList.concat(res.data.list)
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
    },
    // 图片放大
    // 这个方法的前提是你的图片json 格式是 是name ， path 分开的
    /**
     *
     * @param {图片数组} arr
     * @param {点击第几张图片} i
     */
    previewPhoto(arr,i){
        let type = this.$tool.get_suffix(arr[i].path)
        if(this.imgBoolFn(type)){
            // 图片 和 视频 预览
            let arr2 = [];
            arr.map(e=>{
                if(this.imgBoolFn(type)){
                    if(e.path === arr[i].path){
                      this.previewIndex = arr2.length;
                    }
                    arr2.push(e.path);
                }
            })
            this.fileSign(arr2)
        }else{
            // 其他文件 下载
            this.$ajax.get("/api/load/generateAccessURL",{
              url:arr[i].path
            }).then(res=>{
              res = res.data;
              if(res.status === 200){
                let a = document.createElement('a');
                a.download = undefined;
                a.href = res.data.url;
                a.click();
                // window.location = res.data.url;
              }
            }).catch(err=>{
              console.log(err)
            })
        }
    },
    // 判断图片类别
    imgBoolFn(type){
        switch (type.toLowerCase()) {
            case '.png':
                return true
                break;
            case '.gif':
                return true
                break;
            case '.jpg':
                return true
                break;
            case '.jpeg':
                return true
                break;
            case '.avi':
                return true
                break;
            case '.mp4':
                return true
                break;
            default:
                return false
                break;
        }
    },
    ...mapMutations([
      'setPath',
      'sliderRouter'
    ])
  },
  computed:{
    ...mapGetters([
      'getPath'
    ])
  }
}

export {
  MIXINS,
}
