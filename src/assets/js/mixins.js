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
      },
      //部门下拉筛选
      dep:{
        id:'',
        name:''
      },
      employePage:1,
      employeTotal:0
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
          this.employeTotal=res.data.total
        }
      })
    },
    clearSelect:function (type='dep') {
      if(type==='dep'){
        this.dep.id=''
        this.dep.name=''
        this.EmployeList=[]
        this.employePage=1
      }else {

      }
    },
    //部门树结构选择操作
    handleNodeClick(data) {
      this.getEmploye(data.depId)
      this.clearSelect()
      this.dep.id=data.depId
      this.dep.name=data.name
      if(data.subs.length===0){
        this.$refs.tree.blur()
      }
    },
    //员工滚动加载更多
    moreEmploye:function () {
      if(this.EmployeList.length>=this.employeTotal){
        return
      }else {
        this.getEmploye(this.dep.id,++this.employePage)
      }
    },
    /**
     * 合同信息操作
     * @param type
     */
    msgOpera:function ({contType,contId,contCode,operaType}) {
      if(operaType==='cont'){
        // this.setPath(this.getPath.concat({name:'合同详情'}))
        this.setPath(this.getPath.concat({name:'合同详情'}))
        this.$router.push({
          path:contType===this.$tool.contType['4']||contType===this.$tool.contType['5']?'detailIntention':'contractDetails',
          query:{
            contType:contType,
            id:contId,
            code:contCode,
            pageName:'合同详情'
          }
        })
      }
    },
    /**
     * 获取签名
     */
    fileSign:function (arr,type) {
      let param={urls:arr.join(',')}
      if(type==='download'){
        param.rct='application%2Foctet-stream'
      }
      this.$ajax.put('/api/load/generateAccessURLBatch',param,2).then(res=>{
        res=res.data
        if(res.status===200){
          if(type==='download'){
            var a = document.createElement('a');
            a.download = undefined;
            a.href = res.data[0];
            a.click();
          }else {
            this.previewFiles=res.data
            this.preview=true
          }
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
                if(this.imgBoolFn(this.$tool.get_suffix(e.path))){
                    if(e.path === arr[i].path){
                      this.previewIndex = arr2.length;
                    }
                    arr2.push(e.path);
                }
            })
            this.fileSign(arr2)
        }else{
            // 其他文件 下载
          this.fileSign([].concat(arr[i].path),'download')
            /*this.$ajax.get("/api/load/generateAccessURL",{
              url:arr[i].path
            }).then(res=>{
              res = res.data;
              if(res.status === 200){
                var a = document.createElement('a');
                a.download = undefined;
                a.href = res.data.url;
                // a.href = 'http://192.168.1.51:5500/%E6%B5%8B%E8%AF%95%E6%96%87%E4%BB%B6.txt';
                // a.href = 'data:text/plain;charset=utf-8,' + res.data.url;
                a.click();
                // window.location = res.data.url;
              }
            }).catch(err=>{
              console.log(err)
            })*/
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
            /*case '.avi':
                return true
                break;*/
            case '.mp4':
                return true
                break;
            default:
                return false
                break;
        }
    },
    ...mapMutations([
      'setPath'
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
