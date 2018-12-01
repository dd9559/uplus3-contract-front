<template>
    <div class='view-container'>
      <p class='title'>
          <span>合同模板预览</span>
          <el-button type="primary paper-btn" @click="saveAll" v-if="saveBtn">保存</el-button>
      </p>
      <div class='bodycontainer'>
          <div class="ht-list listone"  ref='htlist'>
          <el-button type="primary paper-btn" @click="showPos" v-show='position'>签章位置</el-button>
          <div class='pagerUp'>
              <el-button ref='delBtn' class="el-icon-caret-top" @click="del(1)"></el-button>
              <div><span>{{count}}</span>/<span>{{total}}</span></div>
              <el-button  class="el-icon-caret-bottom paper-next" @click="add(1)"></el-button>
          </div>
          <img id='ht' src="" alt="">
          <div class='signature signatureone'  ref='dropBtn'  v-show='sigtureShow'>
             
          </div>
      </div>
       <div class="ht-list" v-show='showSed' ref='htlist'>
          <el-button type="primary paper-btn" @click="showPos" v-show='position2'>签章位置</el-button>
          <div class='pagerUp'>
              <el-button ref='delBtn' class="el-icon-caret-top" @click="del(2)"></el-button>
              <div><span>{{count2}}</span>/<span>{{total2}}</span></div>
              <el-button  class="el-icon-caret-bottom paper-next" @click="add(2)"></el-button>
          </div>
          <img id='ht2' src="" alt="">
          <div class='signature signaturetwo' ref='dropBtn' v-show='sigtureShow2'>
             
          </div>
        </div>
      </div>
      <el-dialog class='expand' title="请设置以下扩展参数" width="760px" :visible.sync="modalDialog" >
          <p class='tip'>系统暂不支持以下合同参数，需要进行设置</p>
          <div class="ex-body">
              <p>温馨提示：选项值之间请用英文下的逗号隔开！</p>
               <el-table :data='tableDate' style="width: 100%" header-row-class-name="theader-bg">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column align="center" label="参数名称" prop="name"></el-table-column>
                    <el-table-column align="center" label="是否必填" min-width="150">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.isRequired" placeholder="请选择信息类型">
                                <el-option :value='1' label="是"></el-option>
                                <el-option :value='0' label="否"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="输入格式" min-width="150">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.inputType">
                                <el-option :value='2' label="下拉框"></el-option>
                                <el-option :value='1' label="输入框"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="选项值" min-width="150">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.options"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="单位" min-width="150">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.unit"></el-input>
                        </template>
                    </el-table-column>
               </el-table>
                <div class="footer">
                    <el-button type="primary paper-btn" @click="numSave">保存</el-button>
                </div>
          </div>
      </el-dialog>
    </div>
</template>
           
<script>
import {TOOL} from "@/assets/js/common"
export default{
        data(){
          return{
            saveBtn:true,
            position:true,
            position2:true,
            sigtureShow:false,
            sigtureShow2:false,
            id:'',
            contraName:'',
            mmaiAddress:'',
            jjianAddress:'',
            mbanAddress:'',
            modalDialog:false,
            tableDate:[],
            show:'', //展示形式 1:上传
            type:'',
            count:1,
            count2:1,
            flag:1,
            total:1,
            total2:1,
            imgSrc:'',
            imgSrc2:'',
            cityId:'',
            enableTemplateId:'',
            showSed:false,
            divWidth:'',
            divHeight:'',
            signPosition:{x:'',y:'',pageIndex:''},
          }
        },
        created(){
            this.cityId=this.$route.query.selectCity
            this.mmaiAddress = this.$route.query.mmaiAddress
            this.jjianAddress = this.$route.query.jjianAddress
            this.mbanAddress = this.$route.query.mbanAddress
            console.log(this.mbanAddress,'this.mbanAddress');
            this.type = this.$route.query.type
            this.contraName = this.$route.query.contraName
            this.show=this.$route.query.show
            this.id=this.$route.query.id
            this.enableTemplateId=this.$route.query.enableTemplateId
        },
        mounted(){
            this.divWidth=document.getElementsByClassName('listone')[0].offsetWidth
            this.divHeight=1163
            if(this.show==1){
                
               this.getImgAdd(this.count)
            }else{
                this.position=false
                this.position2=false
                this.saveBtn=false
                this.$ajax.get('/api/setting/contractTemplate/show',{enableTemplateId:this.enableTemplateId}).then((res)=>{
                     let resadd=res.data.data
                     if(resadd.businessImg && resadd.businessImg!==''){
                            
                            this.showSed=true 
                            this.imgSrc=res.data.data.businessImg.url
                            this.imgSrc2=res.data.data.residenceImg.url
                            this.total=res.data.data.businessImg.count
                            this.total2=res.data.data.residenceImg.count
                            this.signPosition=res.data.data.signPosition
                            if(this.count2==this.signPosition.pageIndex){
                                this.sigtureShow2=true
                                let dropbtn=document.getElementsByClassName('signaturetwo')[0]
                                dropbtn.style.left=(this.signPosition.x*this.divWidth)+'px'
                                dropbtn.style.top=(this.signPosition.y*this.divHeight)+'px'
                                console.log(dropbtn.style.left, dropbtn.style.top);
                            }else{
                               this.sigtureShow2=false
                           }
                            let htImg=document.getElementById('ht')
                            let htImg2=document.getElementById('ht2')
                            var newsrc=this.imgSrc.substr(0,this.imgSrc.lastIndexOf('.'))+this.count+this.imgSrc.substr(this.imgSrc.lastIndexOf('.'))
                            var newsrc2=this.imgSrc2.substr(0,this.imgSrc2.lastIndexOf('.'))+this.count2+this.imgSrc2.substr(this.imgSrc2.lastIndexOf('.'))
                            this.autograph(htImg,newsrc)
                            this.autograph(htImg2,newsrc2)
                     }else{
                           this.imgSrc=resadd.img.url
                           this.total=res.data.data.img.count
                           this.signPosition=res.data.data.signPosition
                           console.log(this.signPosition,'signPosition');
                           if(this.count==this.signPosition.pageIndex){
                             this.sigtureShow=true
                             let dropbtn=document.getElementsByClassName('signatureone')[0]
                             dropbtn.style.left=(this.signPosition.x*this.divWidth)+'px'
                             dropbtn.style.top=(this.signPosition.y*this.divHeight)+'px'
                             console.log(dropbtn.style.left, dropbtn.style.top);
                           }else{
                               this.sigtureShow=false
                           }
                           let htImg=document.getElementById('ht')
                           var newsrc=this.imgSrc.substr(0,this.imgSrc.lastIndexOf('.'))+this.count+this.imgSrc.substr(this.imgSrc.lastIndexOf('.'))
                           this.autograph(htImg,newsrc)
                     }
                })
            }
        },
        methods:{
            showPos(){
                if(this.showSed){
                    this.signPosition.pageIndex=this.count2
                }else{
                    alert(this.count)
                     this.signPosition.pageIndex=this.count
                }
                if(this.cityId==1 && this.type==2){
                    this.sigtureShow=false
                }else{
                    this.sigtureShow=!this.sigtureShow
                }
                // alert(this.sigtureShow)
                 this.sigtureShow2=!this.sigtureShow2
            
                 this.tuozhuai()
            },
            tuozhuai(){
                if(this.cityId==1 && this.type==2){
                    var oDiv=document.getElementsByClassName('signature')[1]
                }else{
                    var oDiv=document.getElementsByClassName('signature')[0]
                }
                    // var oDiv = this.$refs.dropBtn
                    var This =this 
                        oDiv.onmousedown = function(ev){
                            var disX = ev.clientX -oDiv.offsetLeft;
                            var disY = ev.clientY - oDiv.offsetTop;
                            document.onmousemove = function(ev){
                            var l = ev.clientX-disX;
                            var t = ev.clientY-disY;
                            console.log(This.divHeight,'divheight');
                            This.signPosition.x=(l/This.divWidth).toFixed(2)
                            This.signPosition.y=(t/This.divHeight).toFixed(2)
                            console.log(This.signPosition,'sign');
                            l > oDiv.parentNode.offsetWidth-100 ? l = oDiv.parentNode.offsetWidth-100 : l
                            l < 0 ? l = 0 : l
                            t < 0 ? t = 0 : t
                            t > oDiv.parentNode.offsetHeight-150 ? t = oDiv.parentNode.offsetWidth-150 : t
                            oDiv.style.left = l+'px';
                            oDiv.style.top = t+'px';
                            };
                            document.onmouseup = function(){
                            document.onmousemove=null;
                            document.onmouseup=null;
                            };
                        };
                },
            saveAll(){
                 this.signPosition.pageIndex=this.showSed?this.count2:this.count
                 let param={
                  address:{
                    address:this.mbanAddress==''?'':this.mbanAddress.path+'?'+this.mbanAddress.name,
                    business:this.mmaiAddress==''?'':this.mmaiAddress.path+'?'+this.mmaiAddress.name,
                    residence:this.jjianAddress==''?'':this.jjianAddress.path+'?'+this.jjianAddress.name
                  },
                  contractSeats:this.tableDate,
                  type:this.type,
                  name:this.contraName,
                  signPosition:this.signPosition,
                  imgAddress:{"business":this.cityId==1&&this.type==2?this.imgSrc:'', "residence":this.cityId==1&&this.type==2?this.imgSrc2:'',"address":!(this.cityId==1&&this.type==2)?this.imgSrc:''},
                  imgPage:{"business":this.showSed?this.total:0, "residence": this.showSed?this.total2:0,"count": !this.showSed?this.total:0},
                  cityId:1,
                  id:this.id
              }
              console.log(param,'zuizhong');
              this.$ajax.postJSON('/api/setting/contractTemplate/insert',param).then(res=>{
                  if(res.status==200){
                         this.$router.push({
                        path: "/contractTemplate",
                    });
                  }
                })
            },
            numSave(){
                // debugger
               
                for(let i=0;i<this.tableDate.length;i++){
                    if(this.tableDate[i].inputType==2){
                        if(this.tableDate[i].options==''){
                             this.$message({
                             type: 'error',
                             message: `第${i+1}行请输入选项值！`
                            })
                            this.modalDialog=true
                            break
                        }
                        else{
                             this.modalDialog=false
                        }
                    }
                }
                this.modalDialog=false
                console.log(this.tableDate,'tabledate');
            },
            del(type){
                if(type==1){
                    this.count--
                    this.flag=0
                    if(this.count<=0){
                        this.count=1
                    }
                    if(this.count==this.signPosition.pageIndex){
                             this.sigtureShow=true
                             let dropbtn=document.getElementsByClassName('signatureone')[0]
                             dropbtn.style.left=(this.signPosition.x*this.divWidth)+'px'
                             dropbtn.style.top=(this.signPosition.y*this.divHeight)+'px'
                             console.log(dropbtn.style.left, dropbtn.style.top);
                           }else{
                               this.sigtureShow=false
                    }
                    var htImg=document.getElementById('ht')
                    var newsrc=this.imgSrc.substr(0,this.imgSrc.lastIndexOf('.'))+this.count+this.imgSrc.substr(this.imgSrc.lastIndexOf('.'))
                    this.autograph(htImg,newsrc)
                }else if(type==2){
                    this.count2--
                    this.flag=0
                    if(this.count2<=0){
                        this.count2=1
                    }
                    if(this.count2==this.signPosition.pageIndex){
                                this.sigtureShow2=true
                                let dropbtn=document.getElementsByClassName('signaturetwo')[0]
                                dropbtn.style.left=(this.signPosition.x*this.divWidth)+'px'
                                dropbtn.style.top=(this.signPosition.y*this.divHeight)+'px'
                                console.log(dropbtn.style.left, dropbtn.style.top);
                            }else{
                               this.sigtureShow2=false
                           }
                    var htImg2=document.getElementById('ht2')
                    var newsrc=this.imgSrc2.substr(0,this.imgSrc2.lastIndexOf('.'))+this.count2+this.imgSrc2.substr(this.imgSrc2.lastIndexOf('.'))
                    this.autograph(htImg2,newsrc)
                }
            },
             add(type){
               if(type==1){
                    this.flag=0
                    this.count++
                    if(this.count>=this.total){
                        this.count=this.total
                    }
                    console.log(this.signPosition,'this.signPosition');
                    if(this.count==this.signPosition.pageIndex){
                             this.sigtureShow=true
                             let dropbtn=document.getElementsByClassName('signatureone')[0]
                             dropbtn.style.left=(this.signPosition.x*this.divWidth)+'px'
                             dropbtn.style.top=(this.signPosition.y*this.divHeight)+'px'
                             console.log(dropbtn.style.left, dropbtn.style.top);
                           }else{
                               this.sigtureShow=false
                    }
                    var htImg=document.getElementById('ht')
                    var newsrc=this.imgSrc.substr(0,this.imgSrc.lastIndexOf('.'))+this.count+this.imgSrc.substr(this.imgSrc.lastIndexOf('.'))
                    this.autograph(htImg,newsrc)
               }else if(type==2){
                    this.flag=0
                    this.count2++
                    if(this.count2>=this.total2){
                        this.count2=this.total2
                    }
                    if(this.count2==this.signPosition.pageIndex){
                                this.sigtureShow2=true
                                let dropbtn=document.getElementsByClassName('signaturetwo')[0]
                                dropbtn.style.left=(this.signPosition.x*this.divWidth)+'px'
                                dropbtn.style.top=(this.signPosition.y*this.divHeight)+'px'
                                console.log(dropbtn.style.left, dropbtn.style.top);
                            }else{
                               this.sigtureShow2=false
                    }
                    var htImg2=document.getElementById('ht2')
                    var newsrc=this.imgSrc2.substr(0,this.imgSrc2.lastIndexOf('.'))+this.count2+this.imgSrc2.substr(this.imgSrc2.lastIndexOf('.'))
                    this.autograph(htImg2,newsrc)
                }
            },
            autograph(obj,newsrc){
                  this.$ajax.get('/api/load/generateAccessURL',{url:newsrc}).then(res=>{
                      if(res.status==200){
                          console.log(res.data.data.url,'maimaires');
                          let newsrc=res.data.data.url
                          obj.src=newsrc
                      }
                  })
            },
            getImgAdd(count){
            let param={
                  templateAddress:{
                    address:this.mbanAddress==''?'':this.mbanAddress.path,
                    business:this.mmaiAddress==''?'':this.mmaiAddress.path,
                    residence:this.jjianAddress==''?'':this.jjianAddress.path
                  },
                  cityId:this.cityId,
                  type:this.type
              }
              console.log(param,'param');
              this.$ajax.get('/api/setting/contractTemplate/checkTemplate',param).then(res=>{
              if(res.status==200){
                //   alert(res.data.data.unPlaceholder)
                  if(res.data.data.unPlaceholder!==''){
                      this.tableDate=res.data.data.unPlaceholder
                  }else{
                        this.tableDate=null
                  }
                  var arr=[]
                  for(let i=0;i<this.tableDate.length;i++){
                      var obj={}
                      obj['name']=this.tableDate[i]
                      obj['isRequired']=1
                      obj['inputType']=1
                      obj['options']=''
                      obj['unit']=''
                      arr.push(obj)
                  }
                  this.tableDate=arr
                  console.log(this.tableDate,'tabledate');
                  if(this.tableDate.length!==0 && this.show==1 && this.flag==1){
                      this.modalDialog=true
                    }
                 if(this.cityId==1 && this.type==2){
                    this.showSed=true
                    this.position=false
                    // console.log(res.data.data.businessImg.url,'imgsrc');
                    // debugger
                    this.imgSrc=res.data.data.businessImg.url
                    this.imgSrc2=res.data.data.residenceImg.url
                    // console.log(this.imgSrc2,'imgsrc2');
                    this.total=res.data.data.businessImg.count
                    this.total2=res.data.data.residenceImg.count
                    let htImg=document.getElementById('ht')
                    let htImg2=document.getElementById('ht2')
                    // alert(htImg2)
                    var newsrc=this.imgSrc.substr(0,this.imgSrc.lastIndexOf('.'))+this.count+this.imgSrc.substr(this.imgSrc.lastIndexOf('.'))
                    var newsrc2=this.imgSrc2.substr(0,this.imgSrc2.lastIndexOf('.'))+this.count2+this.imgSrc2.substr(this.imgSrc2.lastIndexOf('.'))
                    console.log(this.newsrc,this.newsrc2);
                    this.autograph(htImg,newsrc)
                    this.autograph(htImg2,newsrc2)
                    
                 }else{
                  this.imgSrc=res.data.data.img.url  //一个的
                  this.total=res.data.data.img.count
                  let htImg=document.getElementById('ht')
                  var newsrc=this.imgSrc.substr(0,this.imgSrc.lastIndexOf('.'))+this.count+this.imgSrc.substr(this.imgSrc.lastIndexOf('.'))
                  this.autograph(htImg,newsrc)
                 }
              }
            })
            }
        }
        
}
</script>
<style lang='less' scoped>
.view-container{
    display: flex;
    flex-wrap: wrap;
    .title{
        height: 58px;
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        padding-left:12px;
        padding-right:12px;
        border-bottom: solid 1px rgba(206,225,246,1)
    }
    .ht-list{
        display: flex;
        flex: 1;
        justify-content: center;
        // width: 700px;
        // width: 800px;
        min-height: 500px;
        // background-color: grey;
        margin: 11px auto;
        position: relative;
        padding: 20px 80px 20px 30px;
        .signature{
            position: absolute;
            background-color:rgba(110,0,0,0.5);
            left:20px;
            width: 100px;
            height: 150px;
            top:0;
           
        }
        > button{
            position: absolute;
            right: 0px;
            top: 50px;
        }
        .pagerUp{
            width: 40px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 5px;
            > button{
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                box-sizing: border-box;
                justify-content: center;
                align-items: center;
                // background-color: oldlace
            }
            >div{
                margin: 10px auto;
                text-align: center;
            }
        }
        
    }
}
.expand{
    .tip{
        position: absolute;
        top: 30px;
        left: 250px;
        color:rgba(255,62,62,1);
        font-size: 14px
    }
    /deep/ .el-dialog__body{
        border-top: solid 1px rgba(237,236,240,1);
        padding-top:21px; 
        .ex-body{
            p:first-child{
                color:rgba(109,149,189,1);
                margin-bottom: 17px;
            }
            .footer{
                text-align: right;
                margin-top: 15px;
            }
        }
    }
}    
.paper-btn{
    width:100px;
    height:36px;
    background:rgba(71,141,227,1);
    border-radius:18px;
}
.bodycontainer{
    display: flex;
    width:100%;
    .ht-list{
        flex: 1;
        // box-sizing: content-box;
        width: 50%;
        img{
            width:530px
        }
    }
}
// .view-container .ht-list .pagerUp .paper-next{
//     background-color: #F5F5F5;
//     color:#ACA899;
//     border: 1px solid #DDD;
// }     
</style>