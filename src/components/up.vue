<template>
  <div :id="getParentId">
    <div :id="getId">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import {set_upload_param, get_suffix} from "@/assets/js/upload";

  let result = null
  let publicPath = ''
  let loading = null
  let timer=null
  export default {
    props: {
      id: {
        type: String,
        default: 'selectfiles'
      },
      pId: {
        type: String,
        default: 'container'
      },
      rules: {
        type: Array,
        default: function () {
          return []
        }
      },
      more: {
        type: Boolean,
        default: true
      },
      picSize: {
        type: Boolean,
        default: false
      },
      maxSize: {
        type: Number,
        default() {
          return 5
        }
      },
      getNum: {
        type: Number,
        default() {
          return 0
        }
      },
      maxNum: {
        type: Number,
        default() {
          return 20
        }
      },
      scane: {
        type: Object,
        default: function () {
          return {path: 'other'}
        }
      },
      canvas:{//图片转成透明背景色
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
        filePath: [],//表单提交传给后台的文件路径
        uploader: null,
        fileType: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
        currentNum: 0,//执行上传的次数
        canvasBlobState:false,//图片转成透明背景色是否已经执行过
        fileLeng:0,
        // flag: false,
        maxNumFlag: false,
        maxSizeFlag: false,
        maxNameFlag: false,
      }
    },
    mounted() {
      let that = this
      this.filePath = []
      // this.flag = false
      this.maxNumFlag = false
      this.maxSizeFlag = false
      this.maxNameFlag = false
      this.$nextTick(() => {
        this.uploader = new plupload.Uploader({
          runtimes: 'html5',
          browse_button: that.getId, //选择文件按钮
          multi_selection: that.more,
          drop_element: document.getElementById(that.getParentId),
          // flash_swf_url: 'http://sign2.ujakn.com:28879/js/Moxie.swf',
          // silverlight_xap_url: 'http://sign2.ujakn.com:28879/js/Moxie.xap',
          // url: 'http://oss.aliyuncs.com',
          filters: {
            mime_types: that.rules.length > 0 ? [{extensions: that.rules.join(',')}] : [],
            prevent_duplicates: true //不允许选取重复文件
          },
          resize: {
            quality: 60,//压缩后图片的质量，只对jpg格式的图片有效，默认为90。quality可以跟width和height一起使用，但也可以单独使用，单独使用时，压缩后图片的宽高不会变化，但由于质量降低了，所以体积也会变小
          },
          init: {
            FilesAdded: function (up, files) {
              // that.flag = false
              that.maxNumFlag = false
              that.maxSizeFlag = false
              that.maxNameFlag = false
              files.map((item,index) => {
                if (that.getNum + index + 1 > that.maxNum) {
                  that.uploader.removeFile(item)
                  that.maxNumFlag = true
                }
                if (item.size > that.maxSize * 1024 *1024) {
                  that.uploader.removeFile(item)
                  that.maxSizeFlag = true
                }
                if (item.name.length > 100) {
                  that.uploader.removeFile(item)
                  that.maxNameFlag = true
                }
              });
              this.fileLeng=up.files.length
              // 选择文件后执行
              if(up.files.length===0){
                if (that.maxNumFlag || that.maxSizeFlag || that.maxNameFlag) {
                  let msg = ''
                  if (that.maxSizeFlag) {
                    msg += `上传文件大小不能超过${that.maxSize}M`
                  }
                  if (that.maxNumFlag) {
                    msg += `最多上传${that.maxNum}张`
                  }
                  if (that.maxNameFlag) {
                    msg += `上传文件名长度不能超过100字符`
                  }
                  return that.$message(msg);
                }
                return
              }
              loading = that.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });
              // debugger
              if(that.canvas&&!that.canvasBlobState){
                up.files.forEach(item=>{
                  var reader = new FileReader()
                  reader.onload = function () {
                    var picture = new Image()
                    picture.src = this.result
                    picture.onload = function (e) {
                      var config = e.target
                      let {width, height} = config
                      let mix = 0.5//默认图片缩放比例
                      let canvas=document.createElement('canvas')
                      let img=canvas.getContext('2d')
                      let imgData=null
                      canvas.width = width * mix
                      canvas.height = height * mix
                      img.drawImage(this, 0, 0, width * mix, height * mix)
                      imgData = img.getImageData(0, 0, width * mix, height * mix)
                      img.putImageData(that.sepiaFilter(imgData), 0, 0)
                      //压缩图片返回url
                      canvas.toBlob(function (blob) {
                        let picture_qz =new File([blob],`${item.name.split('.')[0]}.png`)
                        that.canvasBlobState=true
                        that.uploader.splice(0,1)
                        that.uploader.addFile(picture_qz, `${item.name.split('.')[0]}.png`)
                      },'image/png',0.5)
                    }
                  }
                  reader.readAsDataURL(item.getNative())
                })
              }else{
                up.files.forEach((item,index)=>{
                  if(item.type!=='image/png'&&item.type!=='image/bmp'){
                    return
                  }else if(item.size<=3*1024*1024){
                    return
                  }else{
                    var reader = new FileReader()
                    reader.onload = function () {
                      var picture = new Image()
                      picture.src = this.result
                      picture.onload = function (e) {
                        var config = e.target
                        let {width, height} = config
                        let mix = 1//默认图片缩放比例
                        let canvas=document.createElement('canvas')
                        let img=canvas.getContext('2d')
                        canvas.width = width * mix
                        canvas.height = height * mix
                        img.drawImage(this, 0, 0, width * mix, height * mix)
                        //压缩图片返回url
                        if(item.type=='image/bmp'){
                          canvas.toBlob(function (blob) {
                            let picture_qz =new File([blob],`${item.name.split('.')[0]}.bmp`)
                            that.uploader.removeFile(item)//这个触发了一次+开始触发的一次，每触发一次，就会调签名的那个接口吗？嗯 
                            that.uploader.addFile(picture_qz, `${item.name.split('.')[0]}.bmp`)//这个触发了一次，这两个方法在什么时候调用，上传到oss之后，从uploader
                          },'image/jpeg',0.2)
                        }else{
                         canvas.toBlob(function (blob) {
                            let picture_qz =new File([blob],`${item.name.split('.')[0]}.png`)
                            that.uploader.removeFile(item)
                            that.uploader.addFile(picture_qz, `${item.name.split('.')[0]}.png`)
                          },'image/jpeg',0.2)
                        }                   
                      }
                    }
                    reader.readAsDataURL(item.getNative())
                  }
                })
              }
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
            BeforeUpload: function (up, file) {
              // 点击上传前执行
              let date = new Date()
              publicPath = `${date.getTime()}${get_suffix(file.name)}`
              set_upload_param(up, Object.assign({}, result), publicPath, file.name);
            },
            QueueChanged:function (uploader) {
              if(that.canvas){
                (this.files.length===1&&that.canvasBlobState)&&that.up()
              }else{
                if(timer)clearTimeout(timer)
                timer=setTimeout(()=>{
                 if(this.fileLeng===uploader.files.length){
                  that.up()
                 }
                },1500)                       
              }
            },
            UploadProgress: function (up, file) {
              // 上传操作进行中
              // console.log(file.percent)
            },
            FileUploaded: function (up, file, info) {
              // 响应
              if (info.status === 200 || info.status === 203) {
                /*that.$message({
                  message:'选择文件成功'
                })*/
                that.currentNum++
                // console.log(file)
                that.filePath = that.filePath.concat({
                  path: `${result.host}/${result.key}${publicPath}`,
                  name: file.name
                })
                if (that.currentNum === up.files.length) {
                  // 向父组件传递监听函数，并初始化上传配置
                  loading.close()
                  if (that.maxNumFlag || that.maxSizeFlag || that.maxNameFlag) {
                    let msg = ''
                    if (that.maxSizeFlag) {
                      msg += `上传文件大小不能超过${that.maxSize}M`
                    }
                    if (that.maxNumFlag) {
                      msg += `最多上传${that.maxNum}张`
                    }
                    if (that.maxNameFlag) {
                      msg += `上传文件名长度不能超过100字符`
                    }
                    that.$message(msg)
                  }
                  that.$emit('getUrl', {param: that.filePath, btnId: that.getId})
                  that.uploader.splice(0, up.files.length)
                  that.canvas&&(that.canvasBlobState=false)
                  that.currentNum = 0
                  that.filePath = []
                }
              }
            },
            Error: function (up, err) {
              loading.close()
              if (err.code === -601) {
                that.$message({
                  message: `只允许上传${that.rules.join('、')}格式的文件`
                })
              } else {
                that.$message({
                  message: `上传失败，请稍后重试`
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
    methods: {
      b64toBlob: function (b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          var slice = byteCharacters.slice(offset, offset + sliceSize);

          var byteNumbers = new Array(slice.length);
          for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          var byteArray = new Uint8Array(byteNumbers);

          byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
      },
      sepiaFilter:function (imgData) {
        // debugger
        let d = imgData.data
        let rgba = [255, 255, 255, 255]
        for (var index = 0; index < d.length; index += 4) {
          var r = d[index];
          var g = d[index + 1];
          var b = d[index + 2];

          /*if (Math.sqrt(
              (r - rgba[0]) * (r - rgba[0]) +
              (g - rgba[1]) * (g - rgba[1]) +
              (b - rgba[2]) * (b - rgba[2])) <= 50
          ) {
            d[index] = 0;
            d[index + 1] = 0;
            d[index + 2] = 0;
            d[index + 3] = 0;
          } else {
            d[index] = r;
            d[index + 1] = g;
            d[index + 2] = b;
            // imgDataResult.data[index + 3] = imgData.data[index + 3];
          }*/
          const color = Math.floor((62 / 100) * 255);//数值62为默认阈值
          // 色值在color-255之间都认为是白色，设置为透明
          if([r,g,b].every(v => v < 256 && v > color)) d[index+3] = 0
        }
        return imgData
      },
      /**
       * 上传操作
       */
      up: function () {
        let path = ''
        if(this.scane.id){
          let addrReg=/\\|\/|\@|\#|\%|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\&|\!|\~|\`|\|/g
          this.scane.id=this.scane.id.replace(addrReg,'')
        }
        switch (this.scane.path) {
          case 'ziliaoku':
            path = `contract/${this.scane.id}/${this.scane.path}`
            break;
          case 'zhuti':
            path = `contract/${this.scane.id}/${this.scane.path}`
            break;
          case 'WTzhuti':
            path = `contract/${this.scane.id}/${this.scane.path}`
            break;
          case 'jiesuan':
            path = `contract/${this.scane.id}/${this.scane.path}`
            break;
          case 'tiaoyong':
            path = `contract/${this.scane.id}/${this.scane.path}`
            break;
          case 'biangeng':
            path = `contract/${this.scane.id}/${this.scane.path}`
            break;
          case 'jieyue':
            path = `contract/${this.scane.id}/${this.scane.path}`
            break;
          case 'qianhou':
            path = `contract/${this.scane.id}/${this.scane.path}`
            break;
          case 'sk':
            path = `contract/${this.scane.id}/caiwu/${this.scane.path}`
            break;
          case 'fk':
            path = `contract/${this.scane.id}/caiwu/${this.scane.path}`
            break;
          case 'yj':
            path = `contract/${this.scane.id}/yj/${this.scane.path}`
            break;
          case 'setting':
            path = `${this.scane.path}`
            break;
          case 'template':
            path = `${this.scane.path}`
            break;
          default:
            path = 'other'
        }
        let maxSize = 1024
        if (this.uploader.files.length !== 0) {
          let type = get_suffix(this.uploader.files[0].name).toLowerCase()
          if (this.fileType.includes(type)) {
            // maxSize=10
            if (this.picSize) {
              if (this.uploader.files[0].size > 5 * 1024 * 1024) {
                this.$message({
                  message: '上传图片不能超过5M'
              })
              loading.close()
                this.uploader.splice(0, this.uploader.files.length)
                this.currentNum = 0
                this.filePath = []
                return
              }
            }
          }
          //这一串代码原来是放在，type外面的，后来我给包到type的判断去了
          this.getUrl(path, maxSize).then(res => {
            result = JSON.parse(JSON.stringify(res));//这是啥 没用到啊,这是签名后，java返的数据，请求oss资源的时候我是指result这个变量没用到
            // setTimeout(()=>{
               set_upload_param(this.uploader, Object.assign({}, res), '');
            // },3000)  
          })
   
        }
      },
      getUrl: function (file, maxSize) {
        return new Promise((resolve, reject) => {
          this.$ajax.get('/api/load/generateSignature', {dir: file, maxSize: maxSize,aclNum:1}).then(res => {
            res = res.data
            if (res.status === 200) {
              resolve(res.data)
            }
          }).catch(error => {
            reject()
            loading.close()
            this.uploader.splice(0, this.uploader.files.length)
            this.currentNum = 0
            this.filePath = []
            this.$message({
              message: '网络异常，稍后再试'
            })
          })
        })
      },
      /**
       * 请求判定文件是否上传成功
       * @param path
       */
      getFiles: function (path) {
        this.$http.get('/api/load/generateAccessURL', {url: path}).then(res => {

        })
      }
    },
    computed: {
      getId: function () {
        return this.id
      },
      getParentId: function () {
        return this.pId
      }
    }
  }
</script>

<style scoped>

</style>

