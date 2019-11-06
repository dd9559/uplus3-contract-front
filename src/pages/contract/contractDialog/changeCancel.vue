<template>
  <div class="info-dialog" @click="showInput('init')">
    <!-- 合同变更（编辑） -->
    <el-dialog :title="`合同${getDialogType}`" :visible="getCancelDialog" width="740px" @close='close'
               :closeOnClickModal="false">
      <div class="audit-box">
        <div class="textareabox">
          <p :class="{'form-label':!getContentHidden}">{{getDialogType}}原因：</p>
          <!-- <el-input type="textarea" :rows="3" placeholder="请填写合同变更原因，最多100字" class="textarea" maxlength=100></el-input> -->
          <div class="reason">
            <el-input type="textarea" :rows="4" :placeholder="`请填写合同${getDialogType}原因`" :disabled="getContentHidden" v-model="textarea" resize='none'
                      maxlength="100">
            </el-input>
            <span>{{textarea.length}}/100</span>
          </div>
        </div>
        <div class="box">
          <p>佣金金额：</p>
          <el-table
            :data="tableData"
            border
            header-row-class-name="theader-bg"
            style="width: 100%">
            <el-table-column align="center" prop="name"></el-table-column>
            <el-table-column align="center" label="业主佣金">
              <template slot-scope="scope">
                <div class="info-inputbox" v-if="scope.$index===1&&!getContentHidden">
                  <template v-if="!scope.row.ownerState">
                    <input type="text" class="el-input__inner" placeholder="请输入" @click.stop="" v-model="moneyData.owner"
                           @input="cutNum('owner')">
                    <span class="info-cell">元</span>
                  </template>
                  <span v-else class="info-cell">{{moneyData.owner}}元<i class="iconfont icon-xiugai1" @click.stop="showInput(scope.row,'ownerState')"></i></span>
                </div>
                <span v-else class="info-cell">{{commission.owner}}元</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="客户佣金">
              <template slot-scope="scope">
                <div class="info-inputbox" v-if="scope.$index===1&&!getContentHidden">
                  <template v-if="!scope.row.userState">
                    <input type="text" class="el-input__inner" placeholder="请输入" @click.stop="" v-model="moneyData.user"
                           @input="cutNum('user')">
                    <span class="info-cell">元</span>
                  </template>
                  <span v-else class="info-cell">{{moneyData.user}}元<i class="iconfont icon-xiugai1" @click.stop="showInput(scope.row,'userState')"></i></span>
                </div>
                <span v-else class="info-cell">{{commission.user}}元</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 上传附件 -->
        <div class="uploadfile">
          <div class="uploadtitle" :class="{'form-label':!getContentHidden}">{{getDialogType}}协议:
            <template v-if="!getContentHidden">
              <span><b>注：</b>协议支持所有格式</span>
              <span class="iconfont" @click="downloadFile" v-if="dialogType!=='bg'">
              <i class="el-icon-document"></i>下载解约协议</span>
            </template>
            <span v-if="uploadList.length===0&&getContentHidden">无</span>
          </div>
          <div class="uploadbtn">
            <ul>
              <li v-if="!getContentHidden">
                <file-up class="uploadSubject" :scane="cancelScane" @getUrl="uploadSubject" id="cancel_">
                  <i class="iconfont icon-shangchuan"></i>
                  <p>点击上传</p>
                </file-up>
              </li>
              <li v-for="(item,index) in uploadList" :key="item.index" @mouseover="moveIn(item.index+item.path)"
                  @mouseout="moveOut(item.index+item.path)">
                <el-tooltip class="item" effect="dark" :content="item.name" placement="bottom">
                  <div class="namePath" @click="previewPhoto(uploadList,index)">
                    <img class="signImage" :src="item.path|getSignImage(changeCancelFiles)" alt=""
                         v-if="isPictureFile(item.fileType)">
                    <upload-cell :type="item.fileType" v-else></upload-cell>
                    <p>{{item.name}}</p>
                  </div>
                </el-tooltip>
                <i class="iconfont icon-tubiao-6" @click="delectData(index)"
                   :class="{'deleteShow':isDelete===item.index+item.path}"></i>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="btnbox" slot="footer">
        <el-button round @click="close">取 消</el-button>
        <el-button round type="primary" @click="saveFile" :disabled="forbid">{{getContentHidden?'审 核':'保 存'}}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="审核" :visible="checkDialogState" width="560px" @close='close'
               :closeOnClickModal="false">
      <div class="audit-box">
        <div class="textareabox">
          <div class="reason">
            <el-input type="textarea" :rows="6" placeholder="请输入通过或者驳回原因" v-model.trim="checkDialogReasion" resize='none' maxlength="200">
            </el-input>
            <span>{{checkDialogReasion.length}}/200</span>
          </div>
        </div>
      </div>
      <div class="btnbox" slot="footer">
        <el-button round @click="toCheck(2)">驳 回</el-button>
        <el-button round type="primary" @click="toCheck(1)" :disabled="forbid">通 过</el-button>
      </div>
    </el-dialog>
    <preview :imgList="previewFiles" :start="previewIndex" v-if="preview" @close="preview=false"></preview>
    <checkPerson :show="checkPerson.state" :bizCode="checkPerson.code" :flowType="checkPerson.flowType" @close="checkPerson.state=false" @submit="checkPerson.state=false" v-if="checkPerson.state"></checkPerson>
  </div>
</template>

<script>
    import {MIXINS} from "@/assets/js/mixins";
    import checkPerson from '@/components/checkPerson';

    export default {
        mixins: [MIXINS],
        components:{
            checkPerson
        },
        props: {
            dialogType: {
                type: String,
                default: "bg"
            },
            dialogOperation:{
              type:String,
              default:"add"
            },
            contId: {
                type: Number,
                default: 0
            },
            code: {
                type: String,
                default: ""
            },
            cancelDialog: {//弹窗显示或关闭
                type: Boolean,
                default: false
            },
            commission:{//原佣金
                type:Object,
                default:function () {
                    return {owner:12,user:24}
                }
            }
        },
        data() {
            return {
                title: "",
                //上传文件的路径数组
                uploadList: [],
                isImg: false,
                textarea: '',
                isDelete: '',
                //保存按钮是否可点击
                forbid: false,
                cancelScane: {
                    path: "jieyue",
                    id: this.code
                },
                power: {
                    'sign-ht-xq-main-down': {
                        state: false,
                        name: '下载合同主体'
                    },
                },
                changeCancelFiles: [],//图片缩略图
                tableData: [
                    {name: '原金额'},
                    {name: '调整为',ownerState:true,userState:true}
                ],
                moneyData:{//调整佣金
                    owner:0,
                    user:0
                },
                checkDialogState:false,//详情审核弹窗
                checkDialogReasion:'',
                checkPerson: {
                    state:false,
                    type:3,
                    code:this.code,
                    flowType:this.dialogType==='bg'?9:10
                },
            };
        },

        computed: {
            getCancelDialog() {
                return this.cancelDialog;
            },
            getDialogType() {
                return this.dialogType === 'bg' ? '变更' : '解约';
            },
            getContId() {
                return this.contId;
            },
            getCode() {
                return this.code;
            },
            getContentHidden(){
                return this.dialogOperation==='details'
            }
        },

        methods: {
            cutNum:function (prop) {
                this.$set(this.moneyData,prop,this.$tool.cutFloat({val:this.moneyData[prop],max:999999999.99}))
            },
            showInput:function(row,state){//编辑佣金
                if(row==='init'){
                    this.tableData[1].ownerState=true
                    this.tableData[1].userState=true
                    return
                }
                //初始化
                row.ownerState=true
                row.userState=true
                row[state]=false
            },
            //下载解约协议操作--新增xu
            downloadFile: function () {
                this.excelCreate('/contract/getAttachment', {type: 2})
            },
            close(operation=1) {
                this.$emit(operation===1?"close":'success');
            },
            //获取文件路径数组
            uploadSubject(data) {
                let arr = data.param;
                arr.forEach(element => {
                    let fileType = this.$tool.get_suffix(element.name);
                    element.fileType = fileType;
                });
                this.uploadList = this.uploadList.concat(arr);
                let preloadList = []
                arr.forEach((item, index) => {//判断附件是否为图片，是则存入临时数组获取签名用于缩略图展示
                    if (this.isPictureFile(item.fileType)) {
                        preloadList.push(item.path)
                    }
                })
                this.fileSign(preloadList, 'preload').then(res => {
                    this.changeCancelFiles = this.changeCancelFiles.concat(res)
                })
            },
            moveIn(value) {
                this.isDelete = value
            },
            moveOut(value) {
                if (this.isDelete === value) {
                    this.isDelete = ''
                }
            },
            delectData(index) {//删除附件操作
                this.uploadList.splice(index, 1);
            },
            //提交变更解约
            subChangeCancel(url, param) {
                this.forbid = true;
                this.$ajax.postJSON(url, param).then(res => {
                    res = res.data;
                    if (res.status === 200) {
                        this.forbid = false;
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.close(2);
                    }
                }).catch(error => {
                    this.forbid = false;
                    this.$message({
                        message: error,
                        type: "error"
                    })
                })
            },
            //保存上传文件
            saveFile() {
                if(this.getContentHidden){
                    this.checkDialogState=true
                    return
                }
                let rule={
                    'reason':{
                        name:`${this.getDialogType}原因`
                    }
                }

                var url = this.getDialogType==='bg'?"/api/contract/change":"/api/contract/cancel";
                var param = {
                    id: this.contId,
                    reason: this.textarea,
                    address: this.uploadList,
                    type:this.getDialogType==='bg'?1:2,
                    newOwnerCommission:Number(this.moneyData.owner),
                    newCustCommission:Number(this.moneyData.user)
                }
                this.$tool.checkForm(param,rule).then(res=>{
                    if(this.uploadList.length===0){
                        this.$message({
                            message:`请上传${this.getDialogType}协议`
                        })
                    }else{
                        this.subChangeCancel(url, param);
                    }
                }).catch(error=>{
                    this.$message({
                        message:`${error.title}${error.msg}`
                    })
                })
            },
            //获取变更解约详情
            getChangeDetail(type) {
                // debugger
                let param = {
                    type: type,
                    id: this.contId
                };
                this.$ajax.get("/api/contract/changeDetail", param).then(res => {
                    res = res.data;
                    if (res.status === 200) {
                        this.textarea = res.data.changeReason;

                        let address_ = JSON.parse(res.data.changeAtta);
                        //console.log(address_);
                        // let fileType = this.$tool.get_suffix(arr[0].name);
                        address_.value.forEach(element => {
                            let fileType = this.$tool.get_suffix(element.name);
                            element.fileType = fileType;
                        });
                        this.uploadList = [].concat(address_.value);
                        let preloadList = []
                        address_.value.forEach((item, index) => {//判断附件是否为图片，是则存入临时数组获取签名用于缩略图展示
                            if (this.isPictureFile(item.fileType)) {
                                preloadList.push(item.path)
                            }
                        })
                        this.fileSign(preloadList, 'preload').then(res => {
                            this.changeCancelFiles = res
                        })
                    }
                })
            },
            //变更解约详情审核
            toCheck(type){
                if(type===2&&this.checkDialogReasion.length===0){
                    this.$message({
                        message:'请输入驳回原因'
                    })
                    return
                }
                let param = {
                    bizCode: this.getCode,
                    flowType: this.getDialogType==='bg'?9:10,
                    modularType: 0
                }
                param.ApprovalForm = {
                    result: type,
                    remark: this.checkDialogReasion
                }
                this.$ajax.postJSON('/api/machine/audit', param).then(res => {
                    res = res.data
                    if (res.status === 200) {
                        this.$message({
                            message: res.message
                        })
                        this.checkDialogState = false
                    }
                }).catch(error => {
                    if (error.message === '下一节点审批人不存在') {
                        this.checkPerson.state = true
                    } else {
                        this.$message({
                            message: error
                        })
                    }
                })
            }
        },
        created() {
            if(this.dialogOperation==='details'){
                this.getChangeDetail(this.getDialogType==='bg'?2:1)//获取详情 2变更 1解约
            }else{
                Object.assign(this.moneyData,{owner:this.commission.owner,user:this.commission.user})
            }
        },
        filters: {
            /**
             * 过滤显示图片缩略图
             * @param val后端返回的所有文件资源遍历的当前项
             * @param list图片资源获取签名后的临时数组
             */
            getSignImage(val, list) {
                if (list.length === 0) {
                    return '';
                } else {
                    return list.find(item => {
                        return item.includes(val)
                    })
                }
            }
        }
    };
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
  .info-cell{
    display: flex;
    align-items: center;
    justify-content: center;
    i.icon-xiugai1{
      font-size: 20px;
      margin-left: 3px;
      cursor: pointer;
    }
  }
  .info-inputbox{
    display: flex;
    justify-content: center;
    /deep/.el-input{
      max-width: 70px;
      margin-right: 3px;
    }
    .el-input__inner{
      max-width: 70px;
      margin-right: 3px;
      height: 30px;
      line-height: 30px;
    }
  }

  .info-dialog {
    /deep/ .el-dialog__body {
      padding: @margin-15 20px;
    }

    /deep/ .el-dialog__footer {
      border-top: 1px solid #edecf0;
      padding: @margin-10 20px;
    }
  }

  .box {
    margin-top: @margin-15;

    > p {
      margin-bottom: @margin-10;
      font-size: 14px;
      color: @color-6c;
    }
    /deep/.el-table__body .el-table__row{
      height: 44px;
      line-height: 44px;
    }
  }

  .uploadfile {
    margin-top: @margin-15;

    .uploadtitle {
      color: #6c7986;
      margin-bottom: @margin-10;

      span {
        margin-left: 16px;
        color: #8e8e8e;

        &.iconfont {
          color: @color-blue;
          font-size: @size-14;
          cursor: pointer;

          > i {
            font-size: @size-16;
          }
        }

        b {
          color: #6c7986;
        }
      }
    }

    .uploadbtn {
      .uploadSubject {
        display: inline-block;
        text-align: center;
        width: 120px;
        height: 120px;
        box-sizing: border-box;
        padding-top: 20px;
        border: 2px dashed @border-DE;

        i {
          color: @bg-th;
          font-size: 59px;
        }

        p {
          padding-top: 5px;
          color: @color-324;
          font-size: 14px;
        }
      }

      .dataPreview {
        display: inline-block;
        text-align: center;
        width: 130px;
        height: 130px;
        margin-right: 18px;
        box-sizing: border-box;
        background: skyblue;
        border: 2px solid @border-DE;
      }

      .deleteShow {
        display: block !important;
      }

      ul {
        display: flex;
        flex-wrap: nowrap;
        max-width: 100%;
        overflow-x: auto;

        li {
          margin-right: 10px;
          margin-bottom: 10px;
          position: relative;

          > i {
            display: none;
            position: absolute;
            top: 5px;
            right: 5px;
            color: @color-warning;
            font-size: 20px;
            cursor: pointer;
          }
        }
      }

      .namePath {
        display: inline-block;
        text-align: center;
        width: 120px;
        height: 120px;
        padding-top: 20px;
        box-sizing: border-box;
        border-radius: 4px;
        background: @color-F2;

        .signImage {
          width: 60px;
          height: 60px;
          margin: 1px 0;
        }

        > p {
          padding-top: 5px;
          display: inline-block;
          width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  .textareabox {
    display: flex;
    flex-direction: column;

    > p {
      margin-bottom: @margin-10;
      font-size: 14px;
      color: @color-6c;
    }

    .reason {
      position: relative;

      > span {
        position: absolute;
        bottom: 10px;
        right: 20px;
        color: @color-6c;
      }
    }
  }
</style>


