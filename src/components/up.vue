<template>
  <div :id="getParentId">
    <div :id="getId"><slot></slot></div>
  </div>
</template>

<script>
  import {set_upload_param,get_suffix} from "@/assets/js/upload";

  let result = null
  let publicPath = ''
  let loading = null
  export default {
    props:{
      id:{
        type:String,
        default:'selectfiles'
      },
      pId:{
        type:String,
        default:'container'
      },
      rules:{
        type:Array,
        default:function () {
          return []
        }
      },
      more:{
        type:Boolean,
        default:true
      },
      picSize:{
        type:Boolean,
        default:false
      },
      scane:{
        type:Number,
        default:1
      }
    },
    data(){
      return{
        filePath:[],//表单提交传给后台的文件路径
        uploader:null,
        fileType:['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
        currentNum:0,//执行上传的次数
      }
    },
    mounted() {
      let that = this
      this.filePath = []
      this.$nextTick(()=>{
        this.uploader = new plupload.Uploader({
          runtimes: 'html5,flash,silverlight,html4',
          browse_button: that.getId, //选择文件按钮
          multi_selection: that.more,
          drop_element:document.getElementById(that.getParentId),
          /*flash_swf_url: 'lib/plupload-2.1.2/js/Moxie.swf',
          silverlight_xap_url: 'lib/plupload-2.1.2/js/Moxie.xap',
          url: 'http://oss.aliyuncs.com',*/

          filters: {
            mime_types:that.rules.length>0?[{extensions:that.rules.join(',')}]:[],
            prevent_duplicates : true //不允许选取重复文件
          },
          resize: {
            quality: 60,//压缩后图片的质量，只对jpg格式的图片有效，默认为90。quality可以跟width和height一起使用，但也可以单独使用，单独使用时，压缩后图片的宽高不会变化，但由于质量降低了，所以体积也会变小
          },
          init:{
            FilesAdded: function(up, files) {
              // 选择文件后执行
              loading = that.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });
              that.up()
              /*let fileType=get_suffix(files[0].name).toLowerCase();
              if(that.rules.length>0){
                if(that.rules.indexOf(fileType)>-1){
                  that.up()
                }else {
                  that.$message({
                    message:'上传文件格式不正确'
                  })
                  that.uploader.splice(0,up.files.length)
                }
              }else {
                that.up()
              }*/
            },
            BeforeUpload: function(up, file) {
              // 点击上传前执行
              let date = new Date()
              publicPath = `${date.getTime()}${get_suffix(file.name)}`
              set_upload_param(up,Object.assign({},result),publicPath,file.name);
            },
            UploadProgress: function(up, file) {
              // 上传操作进行中
              // console.log(file.percent)
            },
            FileUploaded: function(up, file, info) {
              // 响应
              if(info.status===200||info.status===203){
                /*that.$message({
                  message:'选择文件成功'
                })*/
                that.currentNum++
                // console.log(file)
                that.filePath=that.filePath.concat({
                  path:`${result.host}/${result.key}${publicPath}`,
                  name:file.name
                })
                if(that.currentNum===up.files.length){
                  // 向父组件传递监听函数，并初始化上传配置
                  loading.close()
                  that.$emit('getUrl',{param:that.filePath,btnId:that.getId})
                  that.uploader.splice(0,up.files.length)
                  that.currentNum=0
                  that.filePath=[]
                }
              }
            },
            Error: function(up, err) {
              // debugger
              loading.close()
              if(err.code===-601){
                that.$message({
                  message:`只允许上传${that.rules.join('、')}格式的文件`
                })
              }else {
                that.$message({
                  message:`上传失败，请稍后重试`
                })
              }
              // that.uploader.splice(0,up.files.length)
              // ...
            }
          }
        });
        this.uploader.init()
      })
    },
    methods:{
      /**
       * 上传操作
       */
      up:function () {
        // console.log(uploader)
        let path = ''
        switch (this.scane){
          case 1:
            path='picture/'
                break;
          case 2:
            path='template/html/'
                break;
        }
        let maxSize = 1024
        if(this.uploader.files.length!==0){
          let type=get_suffix(this.uploader.files[0].name)
          if(this.fileType.includes(type)){
            // maxSize=10



            if(this.picSize) {
              if(this.uploader.files[0].size>5*1024*1024){
                this.$message({
                  message:'上传图片不能超过5M'
                })
                loading.close()
                this.uploader.splice(0,this.uploader.files.length)
                this.currentNum=0
                this.filePath=[]
                return
              }
            }
          }
          this.getUrl(path,maxSize).then(res=>{
            result=JSON.parse(JSON.stringify(res))
            set_upload_param(this.uploader,Object.assign({},res),'');
          })
        }
      },
      getUrl:function (file,maxSize) {
        return new Promise((resolve,reject)=>{
          this.$ajax.get('/api/load/generateSignature',{dir:file,maxSize:maxSize}).then(res=>{
            res=res.data
            if(res.status===200){
              resolve(res.data)
            }
          }).catch(error=>{
            reject()
            this.uploader.splice(0,this.uploader.files.length)
            this.$message({
              message:'网络异常，稍后再试'
            })
          })
        })
      },
      /**
       * 请求判定文件是否上传成功
       * @param path
       */
      getFiles:function (path) {
        this.$http.get('/api/load/generateAccessURL',{url:path}).then(res=>{

        })
      }
    },
    computed:{
      getId:function () {
        // debugger
        return this.id
      },
      getParentId:function () {
        return this.pId
      }
    }
  }
</script>

<style scoped>

</style>

