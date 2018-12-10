<template>
  <div :id="getId"><slot></slot></div>
</template>

<script>
  import {set_upload_param,get_suffix} from "@/assets/js/upload";

  let result = null
  export default {
    props:{
      id:{
        type:String,
        default:'selectfiles'
      },
      rules:{
        type:Array,
        default:function () {
          return []
        }
      }
    },
    data(){
      return{
        filePath:[],//表单提交传给后台的文件路径
        uploader:null,
        fileType:['.png', '.jpg', '.jpeg', '.gif', '.bmp']
      }
    },
    mounted() {
      let that = this
      this.filePath = []
      this.$nextTick(()=>{
        this.uploader = new plupload.Uploader({
          runtimes: 'html5,flash,silverlight,html4',
          browse_button: that.getId, //选择文件按钮
          multi_selection: false,
          flash_swf_url: 'lib/plupload-2.1.2/js/Moxie.swf',
          silverlight_xap_url: 'lib/plupload-2.1.2/js/Moxie.xap',
          url: 'http://oss.aliyuncs.com',

          filters: {
            prevent_duplicates : true //不允许选取重复文件
          },
          init:{
            FilesAdded: function(up, files) {
              // 选择文件后执行
              let fileType=get_suffix(files[0].name)
              if(that.rules.length>0){
                if(that.rules.indexOf(fileType)>-1){
                  that.up()
                }else {
                  that.$message({
                    message:'上传文件格式不正确'
                  })
                  that.uploader.splice(0,1)
                }
              }else {
                that.up()
              }
            },
            BeforeUpload: function(up, file) {
              // 点击上传前执行
            },
            UploadProgress: function(up, file) {
              // 上传操作进行中
            },
            FileUploaded: function(up, file, info) {

              // 响应
              if(info.status===200||info.status===203){
                that.$message({
                  message:'选择文件成功'
                })
                // console.log(file)
                that.filePath=[].concat({
                  path:`${result.host}/${result.key}${get_suffix(file.name)}`,
                  name:file.name
                })
                console.log(that.filePath)
                that.$emit('getUrl',{param:that.filePath,btnId:that.getId})
                that.uploader.splice(0,1)
              }
            },
            Error: function(up, err) {
              if(err.code===-602){
                that.$message({
                  message:`${err.file.name}已经上传`
                })
              }
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
        let path = 'picture/'
        let maxSize = 1024
        if(this.uploader.files.length!==0){
          /*let type=get_suffix(this.uploader.files[0].name)
          if(this.fileType.includes(type)){
            maxSize=10
            if(this.uploader.files[0].size>10*1024*1024){
              this.$message({
                message:'上传图片不能超过10M'
              })
              return
            }
          }*/
          this.getUrl(path,maxSize).then(res=>{
            result=JSON.parse(JSON.stringify(res))
            set_upload_param(this.uploader,res,this.uploader.files[0].name);
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
            this.uploader.splice(0,1)
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
      }
    }
  }
</script>

<style scoped>

</style>

