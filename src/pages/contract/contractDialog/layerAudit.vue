<template>
    <div id="layeraudit">
        <!-- 调佣审核申请 -->
    <!-- <el-button type="text" class="curPointer" @click="dialogVisible = true">审核申请</el-button> -->
    <el-dialog title="调佣申请" :visible="getDialogVisible" width="820px" class="layer-audit" @close='close' :closeOnClickModal="$tool.closeOnClickModal" :close-on-press-escape="$tool.closeOnClickModal">
      <div class="audit-box"  :style="{ height: clientHeight() }">
        <div class="audit-col">
          <div class="col-li">
            <p>合同编号：<span class="blue">{{layerAudit.contractCode}}</span></p>
            <p>物业地址：<span>{{layerAudit.propertyAddr}}</span></p>
          </div>
          <div class="col-li">
            <p>申请日期：<span>{{layerAudit.createTime | getDate}}</span></p>
            <p>申请人：<span>{{layerAudit.createByDepName + '-' + layerAudit.createByName}}</span></p>
          </div>
          <div class="col-li">
            <p>合同类型：<span>{{layerAudit.tradeType}}</span></p>
            <p class="mr100">成交总价：<span>{{layerAudit.dealPrice}}元</span></p>
            <p>可分配业绩：<span>{{layerAudit.money}}元</span></p>
          </div>
          <div class="col-li">
            <p>调整类型：<span>佣金调整</span></p>
            <p><el-checkbox v-model="checked">有解除协议</el-checkbox></p>
          </div>
          <div class="textareabox">
            <span><em>*</em>调整原因</span>
            <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="auditForm.textarea" class="textarea" maxlength=100></el-input>
          </div>
        </div>

        <div class="audit-col bordernone">
          <!-- 表格 -->
          <table class="table">
            <thead>
              <tr>
                <th></th>
                <th>业主佣金</th>
                <th>客户佣金</th>
                <!-- <th>按揭手续费</th> -->
                <th>合作费扣除</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>原金额</td>
                <td>{{layerAudit.ownerCommission}}元</td>
                <td>{{layerAudit.custCommission}}元</td>
                <!-- <td>另外出<span>;</span>客户<span>;</span>0元</td> -->
                <td>{{layerAudit.otherCooperationCost}}元</td>
              </tr>
              <tr>
                <td>调整为</td>
                <td>
                  <div>
                    <el-input v-model="auditForm.money1" placeholder="输入金额" class="width70" type="text" @input="cutNumber('money1')"></el-input>元
                  </div>
                </td>
                <td>
                  <div><el-input v-model="auditForm.money2" placeholder="输入金额" class="width70"  type="text" @input="cutNumber('money2')"></el-input>元</div>
                </td>
                <!-- <td class="flex">       
                    <div>
                      <el-select v-model="auditForm.item1" class="width70 mr10">
                        <el-option label="另外出" value="另外出"></el-option>
                        <el-option label="佣金扣" value="佣金扣"></el-option>
                        <el-option label="无" value="无"></el-option>
                      </el-select>
                    </div>
                    <div>
                      <el-select v-model="auditForm.item2" class="width70 mr10">
                        <el-option label="客户" value="客户"></el-option>
                        <el-option label="业主" value="业主"></el-option>
                        <el-option label="无" value="无"></el-option>
                      </el-select>
                    </div>
                    <div><el-input v-model="auditForm.money3" placeholder="输入金额" class="width70"></el-input>元</div>
                  
                </td> -->
                <td>
                  <div><el-input v-model="auditForm.money4" placeholder="输入金额" class="width70"  type="text" @input="cutNumber('money4')"></el-input>元</div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 上传附件 -->
          <div class="uploadfile">
            <div class="uploadtitle">上传附件</div>

            <ul class="ulData">
                <li>
                    <file-up class="uploadSubject" @getUrl="uploadSubject" id="zhuti_">
                        <i class="iconfont icon-shangchuan"></i>
                        <p>点击上传</p>
                    </file-up>
                </li>
                <li v-for="(item,index) in uploadList" :key="item.index" @mouseover="moveIn(item.index+item.path)" @mouseout="moveOut(item.index+item.path)">
                  <el-tooltip class="item" effect="dark" :content="item.name" placement="bottom">
                    <div class="namePath" @click="previewPhoto(uploadList,index)">
                        <upload-cell :type="item.fileType"></upload-cell>
                        <p>{{item.name}}</p>
                    </div>
                  </el-tooltip>
                    <i class="iconfont icon-tubiao-6" @click="ZTdelectData(index)" v-if="isDelete===item.index+item.path"></i>
                </li>
            </ul>

          </div>                  
        </div>

        <!-- 取消保存按钮 -->         
      </div>
      <div class="btnbox">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="auditApply()" v-loading.fullscreen.lock="fullscreenLoading">保 存</el-button>  
      </div> 
      <!-- 图片放大 -->
    <preview :imgList="previewFiles" :start="previewIndex" v-if="preview" @close="preview=false"></preview>
    </el-dialog>
    
    </div>
</template>

<script>
import {TOOL} from "@/assets/js/common";
import { MIXINS } from "@/assets/js/mixins";
import {FILTER} from "@/assets/js/filter";
import { Message } from 'element-ui';
export default {
    mixins: [FILTER, MIXINS],
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        contractCode: {
          type: String,
          default:''
        }
    },

    components: {
        Message
    },

    data() {
        return {
          clientHei: document.documentElement.clientHeight, //窗体高度
          fullscreenLoading:false,//创建按钮防抖
          auditForm: {
              textarea: '', //备注
              
              money1: '', //业主佣金
              money2: '', //客户佣金
              money3: '', //按揭收费
              money4: '', //合作费扣除
          },
          checked: false, //是否有解除协议
          layerAudit:{
            ownerCommission: '',
            custCommission: '',
            otherCooperationCost: ''
            
          },
          // preview:false,
          // start:'',
          //上传的协议
          uploadList: [],
          isDelete:'',
          // 弹框里用到的
          dialogImageUrl: '',
          //dialogVisible: false,
          // dialogVisible2: false,
          
          
        }
    },

    computed: {
        getDialogVisible: function () {
            return this.dialogVisible
        }
    },

    filters: {
       getDate(val) {
         return TOOL.dateFormat(val);
       }
    },

    methods: {

      //图片预览
      // getPicture(value,index){
      //     this.start=index;
      //     let arr=[];
      //     // console.log(value);
      //     value.forEach(item =>{
      //         arr.push(item.path)
      //     })
      //     this.fileSign(arr)
      // },

      cutNumber(val){
          // console.log(val)
          if(val==="money1"){
              this.$nextTick(()=>{
                  this.auditForm.money1=this.$tool.cutFloat({val:this.auditForm.money1,max:999999999.99})
              })
          }else if(val==="money2"){
              this.$nextTick(()=>{
                  this.auditForm.money2=this.$tool.cutFloat({val:this.auditForm.money2,max:999999999.99})
              })
          }else if(val==="money4"){
              this.$nextTick(()=>{
                  this.auditForm.money4=this.$tool.cutFloat({val:this.auditForm.money4,max:999999999.99})
              })
          }
      },

      //获取文件路径后缀名
      uploadSubject(data) {
          let arr = data.param;
          console.log(data)
          let fileType = this.$tool.get_suffix(arr[0].name);
          arr[0].fileType = fileType;
          this.uploadList.push(arr[0])
      }, 

      //合同主体的删除
      ZTdelectData(index){
          this.uploadList.splice(index,1)
      },

      //显示删除按钮
      moveIn(value){
          this.isDelete=value
      },
      moveOut(value){
          if(this.isDelete===value){
              this.isDelete=''
          }
      },


    // 控制弹框body内容高度，超过显示滚动条
      clientHeight() {        
          return this.clientHei - 265 + 'px'
      },

      close(){
          this.$emit('closeCentCommission')
      },

      //根据合同编号获取调佣申请弹框的内容
      getData(){
        let param = {
            contractCode: this.contractCode            
          }
          this.$ajax         
          .get("/api/commission/detail", param)
          .then(res => {
            console.log(res);
            let data = res.data;
            if (res.data.status === 200) {
              this.layerAudit = data.data
              this.auditForm.money1 = this.layerAudit.ownerCommission
              this.auditForm.money2 = this.layerAudit.custCommission
              this.auditForm.money4 = this.layerAudit.otherCooperationCost
            }
            

          }).catch(error => {
              this.$message({
                message: error
              })
          })
      },


      //发起调佣申请
      auditApply() {
        this.auditForm.money1=this.$tool.cutFloat({val:this.auditForm.money1,max:999999999.99})
        this.auditForm.money2=this.$tool.cutFloat({val:this.auditForm.money2,max:999999999.99})
        this.auditForm.money4=this.$tool.cutFloat({val:this.auditForm.money4,max:999999999.99})
        let param = {
          contractCode: this.contractCode,
          reason: this.auditForm.textarea,
          enclosure: this.uploadList,
          relieve: this.checked, 
          ownerCommission: this.layerAudit.ownerCommission,
          custCommission: this.layerAudit.custCommission,
          otherCooperationCost: this.layerAudit.otherCooperationCost,
          newOwnerCommission: this.auditForm.money1,
          newCustCommission: this.auditForm.money2,
          newOtherCooperationCost: this.auditForm.money4
        }
        if(this.auditForm.textarea !== ""){
          // if (this.auditForm.money1 !== null && this.auditForm.money2 !== null && this.auditForm.money3 !== null){            
            if(this.checked === true && this.uploadList.length <= 0){
              this.$message("请您上传协议或者去掉勾选'有解除协议'");           
            }
            else if(parseFloat(this.auditForm.money1) < 0 || parseFloat(this.auditForm.money2) < 0 || parseFloat(this.auditForm.money4) < 0){
              this.$message('请输入非负数的金额');
            }
            
            else{
              this.fullscreenLoading=true
              this.$ajax         
                .postJSON("/api/commission/waitUpdate", param)
                .then(res => {
                  this.fullscreenLoading=false
                          
                    if( this.auditForm.money1 == this.layerAudit.ownerCommission && this.auditForm.money2 == this.layerAudit.custCommission && this.auditForm.money4 == this.layerAudit.otherCooperationCost) {                             
                      this.$message('没有金额记录调整并且申请成功');
                        setTimeout(() => {
                        
                        this.$emit('closeCentCommission')
                      }, 1500); 
                    }
                    else if (res.data.status === 200) {
                      this.$message('已申请');
                      setTimeout(() => {
                        
                        this.$emit('closeCentCommission')
                      }, 1500); 
                      
                    }

                }).catch(error => {
                  this.fullscreenLoading=false
                    this.$message({
                      message: error
                    })
                })
            }
          // }else{
          //     this.$message('调整后的金额不能为空');
          // }
        }else if(this.auditForm.textarea === ""){
           this.$message('请填写调整原因'); 
        }
       
      }
    },

    created() {
      this.getData()
      console.log(this.uploadList)
    },

    mounted() {
      var _this = this;
       window.onresize = function(){
         _this.clientHei = document.documentElement.clientHeight;
       }
    },
}
</script>

<style lang="less">
// 调佣申请弹层样式
#layeraudit{
  .layer-audit{
    .el-dialog{
      margin: 80px auto 60px !important;
      margin-top: 0vh;
    }
    .el-dialog__header{
      border-bottom: 1px solid #EDECF0;
      padding: 16px 20px 15px;
      span{
          color: #233241;
          font-size: 20px;
          
          
      }
      .el-dialog__headerbtn{
          top: 16px;
          .el-dialog__close{
              font-size: 24px;
              color: #32485F;
          }
      } 
    }
    .el-dialog__body{
        padding: 0;
    }
    
  }
  .audit-box{
    padding: 0 20px 0px 20px;
    overflow-y: auto;
    .audit-col{
      padding: 30px 0;
      border-bottom: 1px solid #EDECF0;
      .col-li{
        overflow: hidden;
        clear: left;
        margin-bottom: 18px;
        .mr100{
          margin-right: 100px;
        }
        p{
          float: left;
          &:first-child{
            width: 250px;
            color: #6C7986;
            span{
              color: #233241;
              &.blue{
                color: #478DE3;
              }
            }
          }
        }
      }
      .textareabox{
        display: flex;
        align-items: flex-start;
        span{
          width: 80px;
          em{
            color:#FF3E3E;
            margin-right: 3px;
          }
        }
      }
      .table{
        width: 100%;
        border-collapse:collapse;
        border-spacing:1;
        border-top: 1px solid #E8EAF6;
        border-left: 1px solid #E8EAF6;
        text-align: center;
        .el-input__inner{
          height: 28px;
          line-height: 28px;
          padding: 0;
          text-align: center;
        }
        .el-input__icon{
          line-height: 28px;
        }
        .el-input__suffix{
          right: 0px;
        }
        tr th{
          background-color:#F2F3F8;
          border-right: 1px solid #E8EAF6;
          border-bottom: 1px solid #E8EAF6;
          line-height: 40px;
          height: 40px;
        }
        tr td{
          overflow: hidden;
          padding: 14px 10px;
          border-right: 1px solid #E8EAF6;
          border-bottom: 1px solid #E8EAF6;
          &.flex{
            display: flex;
            align-items: center;
            justify-content: center;
  
          }
          .width70{
            width: 72px;
            height: 28px;
            line-height: 28px;
            margin-right: 3px;
           
          }
          .mr10{
            margin-right: 10px;
            .el-input__inner{
              text-align: left;
              padding-left: 10px;
            }
          }
          .fl{
            float: left;
          }
        }
      }
      .uploadfile{
        margin: 40px 0 30px;
        display: flex;
        .uploadtitle{
          color: #6C7986;
          width: 78px;
          span{
            margin-left: 16px;
            color: #8E8E8E;
            b{
              color: #6C7986;
            }
          }
        }       

        .ulData{
 
            width: 100%;
            overflow: hidden;
            li{
                margin-right: 20px;
                margin-bottom: 20px;
                position: relative;
                float: left;
                &:nth-child(5n){
                  margin-right: 0;
                }
                > i{
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    color: #F56C6C;
                    font-size: 20px;
                    cursor: pointer;
                }
            }
        }

        .uploadSubject {
            display: inline-block;
            text-align: center;
            width: 120px;
            height: 120px;
            box-sizing: border-box;
            padding-top: 28px;
            border: 1px dashed #EDECF0;
            border-radius:1px;
            i {
            color: #EEF2FB;
            font-size: 50px;
            }
            p {
            padding-top: 10px;
            color: #32485F;
            font-size: 12px;
            }
        }

        .namePath{
            display: inline-block;
            text-align: center;
            width: 120px;
            height: 120px;
            padding-top: 20px;
            box-sizing: border-box;
            border-radius:4px;
            background: #F2F3F8;
            > p{
            padding-top: 5px;
            display: inline-block;
            width: 100px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            }
        }

      }
      
    }   
    .bordernone{
      border-bottom: none;
    }
  }
  .btnbox{
    display: flex;
    justify-content: flex-end;
    padding: 15px 20px 15px 0;
    border-top: 1px solid #EDECF0;
    .el-button{
      width: 100px;
      height: 38px;
      border-radius: 18px;
      padding: 0;
      
    }
  }
}
</style>



