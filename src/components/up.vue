<template>
  <div :id="getId"><slot></slot></div>
</template>

<script>
  import {set_upload_param} from "@/assets/js/upload";

  // let uploader = null
  export default {
    props:{
      id:{
        type:String,
        default:'selectfiles'
      }
    },
    data(){
      return{
        filePath:[],//表单提交传给后台的文件路径
        uploader:null,
      }
    },
    mounted() {
      let that = this
      this.filePath = []
      this.$nextTick(()=>{
        this.uploader = new plupload.Uploader({
          runtimes: 'html5,flash,silverlight,html4',
          browse_button: that.getId, //选择文件按钮
          flash_swf_url: 'lib/plupload-2.1.2/js/Moxie.swf',
          silverlight_xap_url: 'lib/plupload-2.1.2/js/Moxie.xap',
          url: 'http://oss.aliyuncs.com',

          filters: {
            prevent_duplicates: true //不允许选取重复文件
          },
          init:{
            FilesAdded: function(up, files) {
              // 选择文件后执行
              that.up()
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
                  message:'上传成功'
                })
              }
            },
            Error: function(up, err) {
              console.log(err);
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
        if(this.uploader.files.length!==0){
          this.getUrl(path).then(res=>{
            this.filePath.push(`${res.host}/${path}${this.uploader.files[0].name}`)
            console.log(this.filePath)
            set_upload_param(this.uploader,res,this.uploader.files[0].name);
          })
        }
      },
      getUrl:function (file) {
        return new Promise((resolve,reject)=>{
          this.$ajax.get('/api/load/generateSignature',{dir:file}).then(res=>{
            if(res.status===200){
              resolve(res.data)
            }
          }).catch(error=>{
            reject()
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
