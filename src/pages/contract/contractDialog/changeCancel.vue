<template>
    <div id="changecancel">
        <!-- 合同变更（操作弹框） -->
        <!-- <el-button type="text" @click="dialogVisible1 = true">合同变更（编辑）</el-button>
        <el-button type="text" @click="dialogVisible2 = true">合同变更（查看）</el-button>
        <el-button type="text" @click="dialogVisible3 = true">合同解约（编辑）</el-button>
        <el-button type="text" @click="dialogVisible4 = true">合同解约（查看）</el-button>
        <el-button type="text" @click="dialogVisible5 = true">上传合同主体弹层</el-button> -->

        <!-- 合同变更（编辑） -->
        <el-dialog :title="title" :visible="getCancelDialog" width="740px" class="layer-changecancel mt80" @close='close'>
            <div class="audit-box" v-if="getDialogType==='changeEdit'">
                <div class="textareabox">
                    <span>合同变更原因</span>
                    <el-input type="textarea" :rows="3" placeholder="请填写合同变更原因，最多100字"  class="textarea" maxlength=100></el-input>
                </div>
                <!-- 上传附件 -->
                <div class="uploadfile">
                    <div class="uploadtitle">上传变更协议<span><b>注：</b>协议支持jpg、png、docx、以及pdf格式</span></div>
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

            <!-- 合同变更（查看） -->
            <div class="audit-box" v-if="getDialogType==='changeLook'">
                <div class="textareabox">
                    <span>合同变更原因</span>
                    <el-input type="textarea" :rows="4" placeholder="请填写合同变更原因，最多100字"  class="textarea" maxlength=100 :disabled="true"></el-input>
                </div>
                <!-- 上传附件 -->
                <div class="uploadfile">
                    <div class="uploadtitle">上传变更协议<span><b>注：</b>协议支持jpg、png、docx、以及pdf格式</span></div>
                    <div class="uploadbtn">
                    
                    </div>
                </div>     
            </div>

            <!-- 合同解约（编辑） -->
            <div class="audit-box" v-if="getDialogType==='cancelEdit'">
                <div class="textareabox">
                    <span>合同解除原因</span>
                    <el-input type="textarea" :rows="3" placeholder="请填写合同解除原因，最多100字"  class="textarea" maxlength=100></el-input>
                </div>
                <!-- 上传附件 -->
                <div class="uploadfile">
                    <div class="uploadtitle">上传解除协议<span><b>注：</b>协议支持jpg、png、docx、以及pdf格式</span></div>
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

            <!-- 合同解约（查看） -->
            <div class="audit-box" v-if="getDialogType==='cancelLook'">
                <div class="textareabox">
                    <span>合同解除原因</span>
                    <el-input type="textarea" :rows="3" placeholder="请填写合同变更，最多100字"  class="textarea" maxlength=100  :disabled="true"></el-input>
                </div>
                <!-- 上传附件 -->
                <div class="uploadfile">
                    <div class="uploadtitle">上传解除协议<span><b>注：</b>协议支持jpg、png、docx、以及pdf格式</span></div>
                    <div class="uploadbtn">
                    
                    </div>
                </div>     
            </div>

            <!-- 上传合同主体 -->
            <div class="audit-box" style=" height: 390px " v-if="getDialogType==='upload'">
                <!-- 上传附件 -->
                <div class="uploadfile uploadfile2">
                    <div class="uploadtitle">上传合同主体<span><b>注：</b>合同主体上传支持jpg、png、docx、以及pdf格式</span></div>
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
            <div class="btnbox">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary">保 存</el-button>  
            </div>
        </el-dialog>

        <!-- 合同变更（查看） -->
        <!-- <el-dialog title="合同变更" :visible="getDialogType==='changeLook'" width="740px" class="layer-changecancel mt80" @close="close">
            <div class="audit-box"  :style="{ height: clientHeight2() }">
                <div class="textareabox">
                    <span>合同变更原因</span>
                    <el-input type="textarea" :rows="3" placeholder="请填写合同变更原因，最多100字"  class="textarea" maxlength=100 :disabled="true"></el-input>
                </div> -->
                <!-- 上传附件 -->
                <!-- <div class="uploadfile">
                    <div class="uploadtitle">上传变更协议<span><b>注：</b>协议支持jpg、png、docx、以及pdf格式</span></div>
                    <div class="uploadbtn">
                    
                    </div>
                </div>     
            </div>
            
        </el-dialog> -->

        <!-- 合同解约（编辑） -->
        <!-- <el-dialog title="合同解除" :visible="getDialogType==='cancelEdit'" width="740px" class="layer-changecancel mt80" @close='close'>
            <div class="audit-box"  :style="{ height: clientHeight() }">
                <div class="textareabox">
                    <span>合同解除原因</span>
                    <el-input type="textarea" :rows="3" placeholder="请填写合同解除原因，最多100字"  class="textarea" maxlength=100></el-input>
                </div> -->
                <!-- 上传附件 -->
                <!-- <div class="uploadfile">
                    <div class="uploadtitle">上传解除协议<span><b>注：</b>协议支持jpg、png、docx、以及pdf格式</span></div>
                    <div class="uploadbtn">
                    <el-upload
                        action="https://jsonplaceholder.typicode.com/posts/"
                        list-type="picture-card"
                        multiple
                        >
                        <i class="iconfont icon-shangchuan"></i>
                    </el-upload> -->
                    <!-- <el-dialog :visible.sync="dialogVisible2">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog> -->
                    <!-- </div>
                </div>     
            </div>
            <div class="btnbox">
                <el-button>取 消</el-button>
                <el-button type="primary">保 存</el-button>  
            </div>
        </el-dialog> -->

        <!-- 合同解约（查看） -->
        <!-- <el-dialog title="合同解除" :visible="getDialogType==='cancelLook'" width="740px" class="layer-changecancel mt80" @close='close'>
            <div class="audit-box"  :style="{ height: clientHeight2() }">
                <div class="textareabox">
                    <span>合同解除原因</span>
                    <el-input type="textarea" :rows="3" placeholder="请填写合同变更，最多100字"  class="textarea" maxlength=100  :disabled="true"></el-input>
                </div> -->
                <!-- 上传附件 -->
                <!-- <div class="uploadfile">
                    <div class="uploadtitle">上传解除协议<span><b>注：</b>协议支持jpg、png、docx、以及pdf格式</span></div>
                    <div class="uploadbtn">
                    
                    </div>
                </div>     
            </div>
            
        </el-dialog> -->

        <!-- 上传合同主体 -->
        <!-- <el-dialog title="合同主体" :visible="getDialogType==='upload'" width="740px" class="layer-changecancel" top="16vh">
            <div class="audit-box" style=" height: 390px "> -->
                <!-- 上传附件 -->
                <!-- <div class="uploadfile uploadfile2">
                    <div class="uploadtitle">上传合同主体<span><b>注：</b>合同主体上传支持jpg、png、docx、以及pdf格式</span></div>
                    <div class="uploadbtn">
                    <el-upload
                        action="https://jsonplaceholder.typicode.com/posts/"
                        list-type="picture-card"
                        multiple
                        >
                        <i class="iconfont icon-shangchuan"></i>
                    </el-upload> -->
                    <!-- <el-dialog :visible.sync="dialogVisible2">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog> -->
                    <!-- </div>
                </div>         
            </div>
            <div class="btnbox">
                <el-button>取 消</el-button>
                <el-button type="primary">确 定</el-button>  
            </div>
        </el-dialog> -->
    </div>
</template>

<script>
export default {
    // dialogType类型有四种：1.changeEdit 变更编辑
    //                      2.changeLook 变更查看
    //                      3.cancelEdit  解约编辑
    //                      4.cancelLook  解约查看
    //                      5.upload  上传合同主体
     props: {
        dialogType: {
            type: String,
            default: ''
        },
        cancelDialog: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            //clientHei: document.documentElement.clientHeight, //窗体高度
            title:''
        }
    },

    computed: {
       getCancelDialog(){
           return this.cancelDialog
       },
       getDialogType(){
           return this.dialogType
       }
    },
    
    methods: {
      // 控制弹框body内容高度，超过显示滚动条
    //   clientHeight() {        
    //       return this.clientHei - 321 + 'px'
    //   },
    //   clientHeight2() {        
    //       return this.clientHei - 252 + 'px'
    //   },
      close(){
          this.$emit('closeChangeCancel')
      }
    },

    created(){
        console.log('222')
        if(this.dialogType==="changeEdit"||this.dialogType==="changeLook"){
            this.title='合同变更'
        }else if(this.dialogType==="cancelEdit"||this.dialogType==="cancelLook"){
            this.title='合同解除'
        }else if(this.dialogType==="upload"){
            this.title='合同主体'
        }
    }
    // mounted() {
    //   var _this = this;
    //    window.onresize = function(){
    //      _this.clientHei = document.documentElement.clientHeight;
    //    }
    // },
}
</script>

<style scoped lang="less">
    #changecancel{
        .mt80{
            .el-dialog{
                margin: 80px auto 60px !important;
                margin-top: 0vh;
            }
        }
        .layer-changecancel{
            
            /deep/.el-dialog__header{
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
            /deep/.el-dialog__body{
                padding: 0;
            }

            .audit-box{
                padding: 26px 20px 10px 20px;
                max-height: 500px;
                overflow-y: auto;
                .textareabox{
                    display: flex;
                    align-items: flex-start;
                    span{
                        width: 120px;
                        color: #6C7986;
                    }
                    .el-textarea__inner{
                        background-color:#FAFAFB;
                        height: 140px;
                        padding: 15px;
                    }
                }
                .uploadfile{
                    margin: 40px 0 30px;
                    min-height: 100px;
                    .uploadtitle{
                        color: #6C7986;
                        span{
                            margin-left: 16px;
                            color: #8E8E8E;
                            b{
                            color: #6C7986;
                            }
                        }
                    }       
                    .uploadbtn{
                        margin: 10px 0 0 100px;
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
                            &:nth-child(4n){
                            margin-right: 0;
                            }
                        }
                    }
                }
                .uploadfile2{
                    margin: 0px 0 30px;
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
    }
</style>


