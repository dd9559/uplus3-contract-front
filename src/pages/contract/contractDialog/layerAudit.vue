<template>
    <div id="layeraudit">
        <!-- 调佣审核申请 -->
    <!-- <el-button type="text" class="curPointer" @click="dialogVisible = true">审核申请</el-button> -->
    <el-dialog title="调佣申请" :visible="getDialogVisible" width="820px" class="layer-audit" @close='close'>
      <div class="audit-box"  :style="{ height: clientHei }">
        <div class="audit-col">
          <div class="col-li">
            <p>合同编号：<span class="blue">YQYD001163</span></p>
            <p>物业地址：<span>当代国际花园当代国际花园当代国际花园当代国际花园当</span></p>
          </div>
          <div class="col-li">
            <p>申请日期：<span>2018/9/14</span></p>
            <p>申请人：<span>当代一店-夏雨天</span></p>
          </div>
          <div class="col-li">
            <p>合同类型：<span>出租</span></p>
            <p class="mr100">成交总价：<span>3000元</span></p>
            <p>可分配业绩：<span>3500元</span></p>
          </div>
          <div class="col-li">
            <p>调整类型：<span>佣金调整</span></p>
            <p><el-checkbox v-model="checked">有解除协议</el-checkbox></p>
          </div>
          <div class="textareabox">
            <span>调整原因</span>
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
                <th>按揭手续费</th>
                <th>合作费扣除</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>原金额</td>
                <td>152365元</td>
                <td>152365元</td>
                <td>另外出<span>;</span>客户<span>;</span>0元</td>
                <td>0元</td>
              </tr>
              <tr>
                <td>调整为</td>
                <td>
                  <div><el-input v-model="auditForm.money1" placeholder="输入金额" class="width70"></el-input>元</div>
                </td>
                <td>
                  <div><el-input v-model="auditForm.money2" placeholder="输入金额" class="width70"></el-input>元</div>
                </td>
                <td class="flex">       
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
                  
                </td>
                <td>
                  <div><el-input v-model="auditForm.money4" placeholder="输入金额" class="width70"></el-input>元</div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 上传附件 -->
          <div class="uploadfile">
            <div class="uploadtitle">上传附件<span><b>注：</b>协议支持jpg、png、docx、以及pdf格式</span></div>
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
        <!-- 取消保存按钮 -->
           
      </div>
      <div class="btnbox">
        <el-button @click="dialogVisible = true">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = true">保 存</el-button>  
      </div> 
    </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            auditForm: {
                textarea: '', //备注
                item1: '', //另外出-佣金扣-无
                item2: '', //客户-业主-无
                money1: '', //业主佣金
                money2: '', //客户佣金
                money3: '', //按揭收费
                money4: '', //合作费扣除
            },
            // 弹框里用到的
            dialogImageUrl: '',
            //dialogVisible: false,
            // dialogVisible2: false,
            
            checked: false, //是否有解除协议
        }
    },

    computed: {
        clientHei() {
            return document.documentElement.clientHeight -266 + 'px'
        },
        getDialogVisible: function () {
            return this.dialogVisible
        }
    },

    methods: {
        
      // 弹层里上传附件
    //   handleRemove(file, fileList) {
    //     console.log(file, fileList);
    //   },
    //   handlePictureCardPreview(file) {
    //     this.dialogImageUrl = file.url;
    //     this.dialogVisible2 = true;
    //   }
        close(){
            //this.dialogTableVisible=false
            this.$emit('closeCentCommission')
        }
    }
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
          width: 76px;
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
          margin: 0 0 0 15px;
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
      
    }
  }
}
</style>


