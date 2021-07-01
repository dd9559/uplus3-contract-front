<template>
    <div id="layersettle">

        <!-- 结算审核弹框 -->
        <el-dialog title="发起结算" :visible="getSettleDialog" width="820px" class="layer-audit" @close='closeDireact' :closeOnClickModal="$tool.closeOnClickModal" :close-on-press-escape="$tool.closeOnClickModal">
            <div class="audit-box"  :style="{ height: clientHeight() }">
                <div class="audit-col">
                    <div class="col-li col-li2">
                        <p>合同编号：<span class="blue">{{layerAudit.contractCode}}</span></p>
                        <p>发起时间：<span>{{layerAudit.applicationDate | getDate}}</span></p>
                        <p>发起人：
                            <span>{{getUser.user.depName + '-' + getUser.user.name}}</span>
                        </p>
                    </div>
                    <div class="col-li col-li2">
                        <p>合同类型：<span>{{layerAudit.contarctType.label}}</span></p>
                        <p>后期状态：<span v-if="layerAudit.contarctType.value!==1">{{layerAudit.laterStageStatus.label}}</span><span v-else>--</span></p>
                        <p>应收佣金：<span>{{layerAudit.receivableComm}}元</span></p>
                        <!-- <p>合同总实收：<span>{{layerAudit.receivablesSum}}元</span></p> -->
                    </div>
                    <div class="col-li col-li2 col-li-between">
                        <p>合同总实收：<span>{{layerAudit.receivablesSum}}元</span></p>
                        <p>已结算：<span>{{layerAudit.alreadysettlement}}元</span></p>
                        <!-- <p>当期实收：<span>{{layerAudit.thissettlement}}元</span></p>
                        <p>应收佣金：<span>{{layerAudit.receivableComm}}元</span></p> -->
                    </div>
                    <div class="col-li">
                        <p>物业地址：<span>{{layerAudit.propertyAddr}}</span></p>                  
                    </div>
                    <div class="col-li col-li2">
                        <!-- <p>当期实际结算：<span>{{layerAudit.actualsettlement}}元（当期实收*结算比例-成本）</span></p> -->
                        <p style="color: red;">本次结算金额：<span>{{layerAudit.actualsettlement}}元</span></p>    
                        <p>
                            <span>本次结算留存：</span>
                            <span v-if="layerAudit.depositMoney">{{(layerAudit.depositMoney < 0 ? 0 : layerAudit.depositMoney)|fomatFloat}}</span>
                            <span v-else>0.00</span>
                            <span>元(扣{{layerAudit.depositRatio ? layerAudit.depositRatio : 0}}%)</span>  
                        </p>
                        <p>
                            <span>历史总结算留存：</span>
                            <span v-if="layerAudit.depositMoneyAmount">{{layerAudit.depositMoneyAmount|fomatFloat}}</span>
                            <span v-else>0.00</span>
                            <span>元</span>
                        </p>
                    </div>

                </div>

                <!-- 表格 -->
                <div class="audit-col">
                    <el-table :data="layerAudit.storeSettle" border style="width: 100%" class="table">
                        <el-table-column prop="level4" label="门店名称"></el-table-column>
                        <el-table-column prop="roleName" label="分成角色"></el-table-column>
                        <el-table-column label="分成人">
                            <template slot-scope="scope">
                                <p>{{scope.row.level4}}-{{scope.row.empName}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="业绩分成比例">
                            <template slot-scope="scope">
                                <p>{{scope.row.ratio}}%</p>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="serviceFee" label="当期刷卡手续费（元）"></el-table-column> -->
                        <el-table-column prop="storefrontReceipts" label="本次实收分成金额（元）"></el-table-column>
                    </el-table> 
                    <!-- <div class="zhushi">注：结算中的当期实收分成金额已扣除了特许服务费、刷卡手续费</div> -->
                </div>

                <!-- 上传附件 -->
                <div class="audit-col">
                    <div class="uploadfile">
                        <div class="uploadtitle">
                            <span>结算凭证:</span>
                            <span class="zhushi">注：支持所有格式</span>
                        </div>
                        <ul class="ulData">
                            <li>
                                <file-up class="uploadSubject" @getUrl="uploadSubject" id="zhuti_" :scane="scaneData">
                                    <i class="iconfont icon-shangchuan"></i>
                                    <p>点击上传</p>
                                </file-up>
                            </li>
                            <li v-for="(item,index) in uploadList" :key="item.index" @mouseover="moveIn(item.index+item.path)" @mouseout="moveOut(item.index+item.path)">
                                <el-tooltip class="item" effect="dark" :content="item.name" placement="bottom">
                                    <div class="namePath" @click="previewPhoto(uploadList,index)">
                                        <img style="width:90px;height:62px"
                                            :src="item.path|getSignImage(mainDataFiles)"
                                            alt=""
                                            v-if="isPictureFile(item.fileType)">
                                        <upload-cell :type="item.fileType" v-else></upload-cell>
                                        <p>{{item.name}}</p>
                                    </div>
                                </el-tooltip>
                                <i class="iconfont icon-tubiao-6" @click="ZTdelectData(index)" :class="{'deleteShow':isDelete===item.index+item.path}"></i>
                            </li>
                        </ul>
                    </div>     
                </div>

                <!-- 审核备注 -->
                <div class="audit-col bordernone">
                    <div class="textareabox2 textlengthbox">
                        <span>结算备注:</span>
                        <el-input type="textarea" :rows="5" class="textarea" maxlength=200  v-model="auditForm.textarea" placeholder="请输入备注信息"></el-input>
                        <span class="textLength">{{auditForm.textarea.length}}/200</span>
                    </div>
                </div>
                    

            </div>
            <div class="btnbox">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary"  @click="auditApply()" v-loading.fullscreen.lock="fullscreenLoading">提交审核</el-button>  
            </div> 
            <!-- 图片放大 -->
            <preview :imgList="previewFiles" :start="previewIndex" v-if="preview" @close="preview=false"></preview>
        </el-dialog>
        <checkPerson :show="checkPerson.state" :type="checkPerson.type" :showLabel="checkPerson.label" :bizCode="checkPerson.code" :flowType="checkPerson.flowType" @submit="personChose" @close="myclose" v-if="checkPerson.state"></checkPerson>
    </div>
</template>

<script>
  import {FILTER} from "@/assets/js/filter";
  import { MIXINS } from "@/assets/js/mixins";
  import {TOOL} from "@/assets/js/common";
  import checkPerson from '@/components/checkPerson'
export default {
    mixins: [FILTER,MIXINS],
    components: {
       checkPerson
    },
    props: {
        contId: {
            type: Number,
            default: ""
        },
        settleDialog: {
            type: Boolean,
            default: false
        },
        layerAudit: {
           contractCode:{
               type: String,
               default:""
           }
        }
    },
    data() {
        return {
            scaneData:{
                path: 'jiesuan',
                id: this.layerAudit.contractCode
            },
            checkPerson: {
                state:false,
                type:'init',
                code:'',
                flowType:0,
                label:false,
                current:false
            }, 
            clientHei: document.documentElement.clientHeight, //窗体高度
            fullscreenLoading:false,//创建按钮防抖
             // 弹框里用到的
            dialogImageUrl: '',
            dialogVisible: false,
            previewIndex:'',
            
            // layerAudit:{
            //     contarctType:{
            //         label: ""
            //     },
            //     laterStageStatus: {
            //         lable: ""
            //     }

            // },

            auditForm: {
                textarea: '', //备注
            },

            // preview:false,
            // start:'',

            //上传的协议
          uploadList: [],
          mainDataFiles:[],
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
         return TOOL.timeFormat(val,false);
       },
       /**
         * 过滤显示图片缩略图
         * @param val后端返回的所有文件资源遍历的当前项
         * @param list图片资源获取签名后的临时数组
         */
        getSignImage(val, list) {
            if (list.length === 0) {
                return "";
            } else {
                return list.find(item => {
                    return item.includes(val);
                });
            }
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

        //获取文件路径后缀名
        uploadSubject(data) {
          let arr = data.param;
          console.log(data)
          arr.forEach(element => {
                let fileType = this.$tool.get_suffix(element.name);
                element.fileType = fileType;
            });
			    this.uploadList=this.uploadList.concat(arr);
                let preloadList = [];
                arr.forEach((item, index) => {
                    //判断附件是否为图片，是则存入临时数组获取签名用于缩略图展示
                    if (this.isPictureFile(item.fileType)) {
                        preloadList.push(item.path);
                    }
                });
                this.fileSign(preloadList, "preload").then(res => {
                    this.mainDataFiles = this.mainDataFiles.concat(res);
                });
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
          let param = {
              id: this.contId,
              direction: 2
          }
          this.$ajax         
            .postJSON("/api/settlement/applySettlement", param)
            .then(res => {
                if (res.data.status === 200) {
                this.$message('已取消');
                setTimeout(() => {            
                    this.uploadList = []    
                    this.$emit('closeSettle')
                }, 1500); 
                
                }
            }).catch(error => {
                this.$message({
                    message: error
                })
            })
      },

      closeDireact(){
          this.uploadList = []
          this.$emit('closeSettle')
      },

      //根据合同id获取结算申请弹框的内容
    //   getData(){
    //     let param = {
    //         id: this.contId         
    //       }
    //       this.$ajax         
    //       .get("/api/settlement/getSettlById", param)
    //       .then(res => {
    //         console.log(res);
    //         let data = res.data;
    //         if (res.data.status === 200) {
    //           this.layerAudit = data.data          
    //         }
            

    //       }).catch(error => {
    //           this.$message({
    //             message: error
    //             })
    //       })
    //   },
      myclose: function() {
        this.checkPerson.state=false
        this.$message('已申请');
        setTimeout(() => {                      
          this.$emit('closeSettle')
        }, 1500); 
      },
      // 选择审核人
      choseCheckPerson:function (bizId) {
        this.checkPerson.flowType=5   //调佣的流程类型为4
        this.checkPerson.code=bizId  //业务编码为settlementId
        this.checkPerson.state=true
        this.checkPerson.type=1  
      },
      personChose:function () {
        this.checkPerson.state=false
        // this.$message({
        //   message:`成功${this.checkPerson.type==='init'?'转交审核人':'设置审核人'}`
        // })
        setTimeout(() => { 
            this.$message('已申请');                     
            this.$emit('closeSettle')
        }, 1500); 
      },

      trim(str){
        return str.replace(/(^\s*)|(\s*$)/g, "")
      },

      //发起结算申请
      auditApply() {
        if(this.uploadList.length > 10){
            this.$message('结算凭证数量上限10个'); 
        } else {
        // 结算设置修改为不必填
        // } else if((this.auditForm.textarea).trim() !== ""){
            this.fullscreenLoading=true   
            let param = {
                id: this.contId,
                settlRemark: this.auditForm.textarea,
                voucher: this.uploadList,
                direction: 1
            }
            this.$ajax         
            .postJSON("/api/settlement/applySettlement", param)
            .then(res => {
                this.fullscreenLoading=false
                if (res.data.status === 200) {
                    this.$message('已申请');
                    setTimeout(() => {                
                        this.$emit('closeSettle')
                    }, 1500);              
                }
                // else if (res.data.bizId) {
                //     setTimeout(() => {                     
                //     this.$emit('closeSettle')
                //     }, 1500);  
                //     this.choseCheckPerson(res.data.bizId,'init')
                // }
            }).catch(error => {
                this.fullscreenLoading=false
                if (error.status === 300 && error.data.bizId) {    
                    this.choseCheckPerson(error.data.bizId)                                    
                  } else{
                    this.$message({
                      message: error
                    })
                  }
            })
        }
        // 结算设置修改为不必填
        // else if((this.auditForm.textarea).trim() === ""){
        // this.$message('请填写结算备注'); 
        // }
      }

    },

    created() {
    //   this.getData()
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

            .col-li-between {
                display: flex;
                p:first-child {
                flex-basis: 65.66%;
                }
                p:last-child {
                color: red;
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
                flex-direction: column;
                .uploadtitle{
                    color: #6C7986;
                    // width: 78px;
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
                    .deleteShow{
                        display: block !important;
                    }
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
                            display: none;
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
        .textlengthbox{
            position: relative;
        }
        .textLength{
            position: absolute;
            bottom: 10px;
            right: 20px;
            color: #6C7986;
            text-align: right;
        }
    }
</style>


