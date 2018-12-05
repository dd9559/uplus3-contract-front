<template>
    <div id="layersettle">

        <!-- 结算审核弹框 -->
        <el-dialog title="发起结算" :visible="getSettleDialog" width="820px" class="layer-audit" @close='close'>
            <div class="audit-box"  :style="{ height: clientHeight() }">
                <div class="audit-col">
                    <div class="col-li col-li2">
                        <p>合同编号：<span class="blue">{{layerAudit.contractCode}}</span></p>
                        <p>发起日期：<span>{{layerAudit.applicationDate | getDate}}</span></p>
                        <p>发起人：<span>{{layerAudit.initiatorDepName + '-' + layerAudit.initiatorName}}</span></p>
                        
                    </div>
                    <div class="col-li">
                        <p>物业地址：<span>{{layerAudit.propertyAddr}}</span></p>
                    
                    </div>
                    <div class="col-li col-li2">
                        <p>合同类型：<span>{{layerAudit.contarctType.label}}</span></p>
                        <p>后期状态：<span>{{layerAudit.laterStageStatus.label}}</span></p>
                        <p>合同总实收：<span>{{layerAudit.receivablesSum}}元</span></p>
                        
                        
                    </div>
                    <div class="col-li col-li2">
                        <p>已结算：<span>{{layerAudit.alreadysettlement}}元</span></p>
                        <p>当期实收：<span>{{layerAudit.thissettlement}}元</span></p>
                        <p>当期实际结算：<span>{{layerAudit.actualsettlement}}元</span></p>
                    </div>

                </div>

                <!-- 表格 -->
                <div class="audit-col">
                    <el-table :data="layerAudit.storeSettle" border style="width: 100%" class="table">
                        <el-table-column prop="level4" label="合作门店"></el-table-column>
                        <el-table-column prop="ratio" label="业绩分成比例"></el-table-column>
                        <el-table-column prop="serviceFee" label="当期刷卡手续费（元）"></el-table-column>
                        <el-table-column prop="storefrontReceipts" label="当期实收分成（元）"></el-table-column>
                    </el-table> 
                    <div class="zhushi">注：结算中的当期实收分成金额包含扣除的特许服务费，具体请结算通过后在分账记录列表中查看</div>             
                </div>

                <!-- 上传附件 -->
                <div class="audit-col">
                    <div class="uploadfile">
                        <div class="uploadtitle">结算凭证</div>
                        <ul class="ulData">
                            <li>
                                <file-up class="uploadSubject" @getUrl="uploadSubject" id="zhuti_">
                                    <i class="iconfont icon-shangchuan"></i>
                                    <p>点击上传</p>
                                </file-up>
                            </li>
                            <li v-for="(item,index) in uploadList" :key="item.index" @mouseover="moveIn(item.index+item.path)" @mouseout="moveOut(item.index+item.path)" @click="previewPhoto(uploadList,index)">
                                <div class="namePath">
                                    <upload-cell :type="item.fileType"></upload-cell>
                                    <p>{{item.name}}</p>
                                </div>
                                <i class="iconfont icon-tubiao-6" @click="ZTdelectData(index)" v-if="isDelete===item.index+item.path"></i>
                            </li>
                        </ul>
                    </div>     
                </div>

                <!-- 审核备注 -->
                <div class="audit-col bordernone">
                    <div class="textareabox2">
                        <span><em>*</em>结算备注</span>
                        <el-input type="textarea" :rows="6" class="textarea" maxlength=200  v-model="auditForm.textarea" placeholder="请填写审核备注"></el-input>
                    </div>
                </div>
                    

            </div>
            <div class="btnbox">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary"  @click="auditApply()">提交审核</el-button>  
            </div> 
            <!-- 图片放大 -->
            <preview :imgList="previewFiles" :start="previewIndex" v-if="preview" @close="preview=false"></preview>
        </el-dialog>
    </div>
</template>

<script>
  import {FILTER} from "@/assets/js/filter";
  import {TOOL} from "@/assets/js/common";
export default {
    props: {
        contId: {
            type: Number,
            default: ""
        },
        settleDialog: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            clientHei: document.documentElement.clientHeight, //窗体高度
             // 弹框里用到的
            dialogImageUrl: '',
            dialogVisible: false,
            
            layerAudit:{
                contarctType:{
                    label: ""
                },
                laterStageStatus: {
                    lable: ""
                }

            },

            auditForm: {
                textarea: '', //备注
            },

            //上传的协议
          uploadList: [],
          isDelete:'',
        }
    },

    computed: {
        getContId() {
            return this.contId;
        },
        getSettleDialog() {
            return this.settleDialog;
        },
    },

    filters: {
       getDate(val) {
         return TOOL.dateFormat(val);
       }
    },

    methods: {

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
          this.$emit('closeSettle')
      },

      //根据合同id获取结算申请弹框的内容
      getData(){
        let param = {
            id: this.contId         
          }
          this.$ajax         
          .get("/api/settlement/getSettlById", param)
          .then(res => {
            console.log(res);
            let data = res.data;
            if (res.data.status === 200) {
              this.layerAudit = data.data
             
            }
            

          }).catch(error => {
              this.$message({
                message:`${error.title}${error.msg}`
                })
          })
      },

      //发起调佣申请
      auditApply() {
        
        if(this.auditForm.textarea !== ""){
            let param = {
                id: 1,
                settlRemark: this.auditForm.textarea,
                voucher: ''
            }
            this.$ajax         
            .post("/api/settlement/applySettlement", param)
            .then(res => {
                if (res.data.status === 200) {
                this.$message('已申请');
                setTimeout(() => {
                    this.$emit('closeSettle')
                }, 1500); 
                
                }
            }).catch(error => {
                this.$message({
                    message:`${error.title}${error.msg}`
                })
            })
         
        }else if(this.auditForm.textarea === ""){
           this.$message('请填写结算备注'); 
        }
       
      }

    },

    created() {
      this.getData()
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
    #layersettle{
        // 调佣审核弹层样式
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
            .el-table th{
                background-color: #F2F3F8 !important;
            }
            
            .col-li{
                overflow: hidden;
                clear: left;
                margin-bottom: 18px;
                &:last-child{
                margin-bottom: 0;
                }
            
            }

            .col-li2{
                p:nth-child(2n){
                width: 250px;
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
                align-items: center;
                justify-content: flex-start;
                span.tit{
                width: 95px;
                line-height: 36px;
                color: #6C7986;
                }
                i.i-slot{
                width: 70px;
                color:#999;
                line-height: 36px;

                }
                .el-input{
                width: 160px;
                }
                .el-input__inner{
                width: 160px;
                height: 36px;
                padding: 0 15px 0 10px;
                }
            }
            
            .uploadfile{
                margin: 20px 0 30px;
                display: flex;
                .uploadtitle{
                    color: #6C7986;
                    width: 78px;
                    em{
                        color: #FF3E3E;
                        margin-right: 4px;
                    }
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
                    > i {
                    color: #EEF2FB;
                    font-size: 50px;
                    }
                    > p {
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
                    }
                }
                
            }
            
            }   
            .bordernone{
                border-bottom: none;
            }
        }

        .textareabox2{
            display: flex;
            align-items: flex-start;
            margin-bottom: 30px;
            &.mt0{
            margin-bottom: 0;
            }
            span{
            width: 84px;
            em{
                color: #FF3E3E;
                margin-right: 4px;
            }
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
            &.refuse{
                background-color: #EAEFF5;
            }
            &.recept{
                background-color: #54D384;
                border-color: #54D384;
            }
            
            }
        }
        .zhushi{
            margin-top: 20px;
            font-size: 12px;
            color: #6C7986;
        }
    }
</style>


