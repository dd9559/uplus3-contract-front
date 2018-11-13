<template>
    <div id="changecancel">
        <!-- 合同变更（操作弹框） -->
        <el-button type="text" @click="dialogVisible1 = true">合同变更（编辑）</el-button>
        <el-button type="text" @click="dialogVisible2 = true">合同变更（查看）</el-button>
        <el-button type="text" @click="dialogVisible3 = true">合同解约（编辑）</el-button>
        <el-button type="text" @click="dialogVisible4 = true">合同解约（查看）</el-button>
        <el-button type="text" @click="dialogVisible5 = true">上传合同主体弹层</el-button>

        <!-- 合同变更（编辑） -->
        <el-dialog title="合同变更" :visible.sync="dialogVisible1" width="740px" class="layer-changecancel mt80">
            <div class="audit-box"  :style="{ height: clientHei }">
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
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <!-- <el-dialog :visible.sync="dialogVisible2">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog> -->
                    </div>
                </div>     
            </div>
            <div class="btnbox">
                <el-button>取 消</el-button>
                <el-button type="primary">保 存</el-button>  
            </div>
        </el-dialog>

        <!-- 合同变更（查看） -->
        <el-dialog title="合同变更" :visible.sync="dialogVisible2" width="740px" class="layer-changecancel mt80">
            <div class="audit-box"  :style="{ height: clientHei }">
                <div class="textareabox">
                    <span>合同变更原因</span>
                    <el-input type="textarea" :rows="3" placeholder="请填写合同变更原因，最多100字"  class="textarea" maxlength=100 :disabled="true"></el-input>
                </div>
                <!-- 上传附件 -->
                <div class="uploadfile">
                    <div class="uploadtitle">上传变更协议<span><b>注：</b>协议支持jpg、png、docx、以及pdf格式</span></div>
                    <div class="uploadbtn">
                    
                    </div>
                </div>     
            </div>
            <div class="btnbox">
                <el-button>取 消</el-button>
                <el-button type="primary">保 存</el-button>  
            </div>
        </el-dialog>

        <!-- 合同解约（编辑） -->
        <el-dialog title="合同解除" :visible.sync="dialogVisible3" width="740px" class="layer-changecancel mt80">
            <div class="audit-box"  :style="{ height: clientHei }">
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
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <!-- <el-dialog :visible.sync="dialogVisible2">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog> -->
                    </div>
                </div>     
            </div>
            <div class="btnbox">
                <el-button>取 消</el-button>
                <el-button type="primary">保 存</el-button>  
            </div>
        </el-dialog>

        <!-- 合同解约（查看） -->
        <el-dialog title="合同解除" :visible.sync="dialogVisible4" width="740px" class="layer-changecancel mt80">
            <div class="audit-box"  :style="{ height: clientHei }">
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
            <div class="btnbox">
                <el-button>取 消</el-button>
                <el-button type="primary">保 存</el-button>  
            </div>
        </el-dialog>

        <!-- 上传合同主体 -->
        <el-dialog title="合同主体" :visible.sync="dialogVisible5" width="740px" class="layer-changecancel" top="16vh">
            <div class="audit-box" style=" height: 390px ">
                <!-- 上传附件 -->
                <div class="uploadfile uploadfile2">
                    <div class="uploadtitle">上传合同主体<span><b>注：</b>合同主体上传支持jpg、png、docx、以及pdf格式</span></div>
                    <div class="uploadbtn">
                    <el-upload
                        action="https://jsonplaceholder.typicode.com/posts/"
                        list-type="picture-card"
                        multiple
                        >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <!-- <el-dialog :visible.sync="dialogVisible2">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog> -->
                    </div>
                </div>         
            </div>
            <div class="btnbox">
                <el-button>取 消</el-button>
                <el-button type="primary">确 定</el-button>  
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogVisible1: false,
            dialogVisible2: false, 
            dialogVisible3: false,
            dialogVisible4: false,
            dialogVisible5: false,            
        }
    },

    computed: {
        clientHei() {
            return document.documentElement.clientHeight - 322 + 'px'
        }
    },
}
</script>

<style lang="less">
    #changecancel{
        .mt80{
            .el-dialog{
                margin: 80px auto 60px !important;
                margin-top: 0vh;
            }
        }
        .layer-changecancel{
            
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

            .audit-box{
                padding: 26px 20px 30px 20px;
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
                        margin: 0 0 0 100px;
                        .el-upload--picture-card{
                            background-color: #fff;
                            border: 2px dashed #DEDDE2;
                            border-radius: 6px;
                            width: 130px;
                            height: 130px;
                            line-height: 130px;
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


