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
                    <div class="uploadtitle"><em>*</em>结算凭证<span><b>注：</b>协议支持jpg、png、docx、以及pdf格式</span></div>
                    <div class="uploadbtn">
                    <el-upload
                        action="https://jsonplaceholder.typicode.com/posts/"
                        list-type="picture-card"
                        multiple
                        >
                        <i class="iconfont icon-shangchuan"></i>
                    </el-upload>
                    
                    </div>
                </div>     
            </div>

            <!-- 审核备注 -->
            <div class="audit-col bordernone">
            <div class="textareabox2">
                <span><em>*</em>审核备注</span>
                <el-input type="textarea" :rows="6" class="textarea" maxlength=200  v-model="auditForm.textarea" placeholder="请填写审核备注"></el-input>
            </div>
            </div>
            

        </div>
        <div class="btnbox">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary"  @click="auditApply()">提交审核</el-button>  
        </div> 
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
            console.log(error)
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
              console.log(error)
            })
         
        }else if(this.auditForm.textarea === ""){
           this.$message('请填写审核备注'); 
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
                .uploadtitle{
                color: #6C7986;
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
                .uploadbtn{
                margin: 0 0 0 15px;
                .el-upload--picture-card{
                    background-color: #fff;
                    border: 2px dashed #DEDDE2;
                    border-radius: 6px;
                    width: 130px;
                    height: 130px;
                    line-height: 124px;
                    margin-top: 20px;
                    i{
                        color: #EEF2FB;
                        font-size: 56px;
                    }
                }
                .el-upload-list--picture-card .el-upload-list__item{
                    margin: 20px 20px 0 0;
                    width: 130px;
                    height: 130px;
                    &:nth-child(5n){
                    margin-right: 0;
                    }
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


