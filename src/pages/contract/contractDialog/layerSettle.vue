<template>
    <div id="layersettle">
        <!-- 结算审核申请 -->
        <el-button type="text" @click="dialogVisible = true">审核申请</el-button>

        <!-- 结算审核弹框 -->
        <el-dialog title="发起结算" :visible.sync="dialogVisible" width="820px" class="layer-audit">
        <div class="audit-box"  :style="{ height: clientHeight() }">
            <div class="audit-col">
            <div class="col-li">
                <p>合同编号：<span class="blue">YQYD001163</span></p>
                <p>物业地址：<span>当代国际花园当代国际花园当代国际花园当代国际花园当</span></p>
            </div>
            <div class="col-li col-li2">
                <p>申请日期：<span>2018/9/14</span></p>
                <p>发起人：<span>当代一店-夏雨天</span></p>
                <p>合同类型：<span>出租</span></p>
            </div>
            <div class="col-li col-li2">
                <p>成交总价：<span>3000元</span></p>
                <p>可分配业绩：<span>3000元</span></p>
                <p>已结算：<span>3000元</span></p>
            </div>
            <div class="col-li col-li2">
                <p>合同总实收：<span>3000元</span></p>
                <p>本次结算：<span>3000元</span></p>
                <p>实际结算：<span>3000元</span></p>
            </div>
            <div class="textareabox">
                <span class="tit">金融服务费：</span>
                <el-input maxlength="9"><i slot="suffix" class="i-slot">元（成本）</i></el-input>
            </div>
            </div>

            <!-- 表格 -->
            <div class="audit-col">
            <el-table :data="jiesuanData" border style="width: 100%" class="table">
            <el-table-column prop="a1" label="合作门店"></el-table-column>
            <el-table-column prop="a2" label="分成比例"></el-table-column>
            <el-table-column prop="a3" label="本次违约金"></el-table-column>
            <el-table-column prop="a4" label="本次特许服务费"></el-table-column>
            <el-table-column prop="a5" label="本次刷卡手续费"></el-table-column>
            <el-table-column prop="a6" label="本次实收分成"></el-table-column>
            </el-table>            
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
                <!-- <el-dialog :visible.sync="dialogVisible2">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog> -->
                </div>
            </div>     
            </div>
            

        </div>
        <div class="btnbox">
            <el-button @click="dialogVisible = true">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = true">提交审核</el-button>  
        </div> 
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            clientHei: document.documentElement.clientHeight, //窗体高度
             // 弹框里用到的
            dialogImageUrl: '',
            dialogVisible: false,
            jiesuanData:[{
                a1: '当代一店',
                a2: '20%',
                a3: '金额*分成比例',
                a4: '',
                a5: '',
                a6: '',

            },
            {
                a1: '当代二店',
                a2: '20%',
                a3: '金额*分成比例',
                a4: '400',
                a5: '300',
                a6: '1200',

            }],
        }
    },

    computed: {
        
    },

    methods: {
        // 控制弹框body内容高度，超过显示滚动条
      clientHeight() {        
          return this.clientHei - 265 + 'px'
      },
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
            .col-li2{
                p:nth-child(2n){
                width: 270px;
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
    }
</style>


