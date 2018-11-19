import {set_upload_param} from "./upload";

let uploader = null

const UPLOAD={
  mounted() {
    uploader = new plupload.Uploader({
      runtimes: 'html5,flash,silverlight,html4',
      browse_button: 'selectfiles', //选择文件按钮
      flash_swf_url: 'lib/plupload-2.1.2/js/Moxie.swf',
      silverlight_xap_url: 'lib/plupload-2.1.2/js/Moxie.xap',
      url: 'http://oss.aliyuncs.com',

      filters: {
        prevent_duplicates: true //不允许选取重复文件
      }
    });
    uploader.init()
  },
  methods:{
    /**
     * 上传操作
     */
    up:function () {
      console.log(uploader)
      if(uploader.files.length!==0){
        this.getUrl('picture/').then(res=>{
          set_upload_param(uploader,res,uploader.files[0].name);
        })
      }
    },
    getUrl:function (file) {
      return new Promise((resolve,reject)=>{
        this.$ajax.get('/api/load/generateSignature',{dir:file}).then(res=>{
          if(res.status){
            resolve(res.data)
          }
        }).catch(error=>{
          reject()
        })
      })
    },
  }
}
export {
  UPLOAD
}
