<template>
	<div id="changecancel">
		<!-- 合同变更（编辑） -->
		<el-dialog :title="title" :visible="getCancelDialog" width="740px" class="layer-changecancel mt80" @close='close'>
			<div class="audit-box" v-if="getDialogType==='changeEdit'">
				<div class="textareabox">
					<span>合同变更原因</span>
					<el-input type="textarea" :rows="3" placeholder="请填写合同变更原因，最多100字" class="textarea" maxlength=100></el-input>
				</div>
				<!-- 上传附件 -->
				<div class="uploadfile">
					<div class="uploadtitle">上传变更协议<span><b>注：</b>协议支持jpg、png、docx、以及pdf格式</span></div>
					<div class="uploadbtn">
						<file-up class="uploadSubject" @getUrl="uploadSubject" >
							<i class="iconfont icon-shangchuan"></i>
							<p>点击上传</p>
						</file-up>
					</div>
				</div>
			</div>

			<!-- 合同变更（查看） -->
			<div class="audit-box" v-if="getDialogType==='changeLook'">
				<div class="textareabox">
					<span>合同变更原因</span>
					<el-input type="textarea" :rows="4" placeholder="请填写合同变更原因，最多100字" class="textarea" maxlength=100 :disabled="true"></el-input>
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
					<el-input type="textarea" :rows="3" placeholder="请填写合同解除原因，最多100字" class="textarea" maxlength=100></el-input>
				</div>
				<!-- 上传附件 -->
				<div class="uploadfile">
					<div class="uploadtitle">上传解除协议<span><b>注：</b>协议支持jpg、png、docx、以及pdf格式</span></div>
					<div class="uploadbtn">
						<el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" multiple>
							<i class="iconfont icon-shangchuan"></i>
						</el-upload>
					</div>
				</div>
			</div>

			<!-- 合同解约（查看） -->
			<div class="audit-box" v-if="getDialogType==='cancelLook'">
				<div class="textareabox">
					<span>合同解除原因</span>
					<el-input type="textarea" :rows="3" placeholder="请填写合同变更，最多100字" class="textarea" maxlength=100 :disabled="true"></el-input>
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
						<file-up class="uploadSubject" @getUrl="uploadSubject" >
							<i class="iconfont icon-shangchuan"></i>
							<p>点击上传</p>
						</file-up>
						<!-- <span class="uploadSubject" v-for="item in uploadList" :key="item">
							<img :src="item?item:'#'" alt="">
						</span> -->
					</div>
				</div>
			</div>
			<div class="btnbox">
				<el-button @click="close">取 消</el-button>
				<el-button type="primary" @click="saveFile">保 存</el-button>
			</div>
		</el-dialog>
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
      default: ""
    },
    contId: {
      type: Number,
      default: ""
    },
    cancelDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
			title: "",
			//上传文件的路径数组
			uploadList:[],
			isImg:false
    };
  },

  computed: {
    getCancelDialog() {
      return this.cancelDialog;
    },
    getDialogType() {
      return this.dialogType;
    },
    getContId() {
      return this.contId;
    }
  },

  methods: {
    close() {
      this.$emit("closeChangeCancel");
		},
		//获取文件路径数组
		uploadSubject(data){
			//console.log(data.param[0]);
			this.uploadList.push(data.param[0]);
			//this.isImg=true
		},
		//保存上传文件
		saveFile(){
			if(this.dialogType==="upload"){
				var url = "/api/upload/contractBody";
				var param = {
					contractId:this.contId,
					vouchers:this.uploadList
				}
			}
			this.$ajax.postJSON(url,param).then(res=>{
				res=res.data;
				if(res.status===200){
					this.$message({
						message:'上传成功'
					});
					this.close();
				}
			})
		}
  },

  created() {
    console.log("222");
    if (this.dialogType === "changeEdit" || this.dialogType === "changeLook") {
      this.title = "合同变更";
    } else if (
      this.dialogType === "cancelEdit" ||
      this.dialogType === "cancelLook"
    ) {
      this.title = "合同解除";
    } else if (this.dialogType === "upload") {
      this.title = "合同主体";
    }
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/common.less";
#changecancel {
  .mt80 {
    .el-dialog {
      margin: 80px auto 60px !important;
      margin-top: 0vh;
    }
  }
  .layer-changecancel {
    /deep/.el-dialog__header {
      border-bottom: 1px solid #edecf0;
      padding: 16px 20px 15px;
      span {
        color: #233241;
        font-size: 20px;
      }
      .el-dialog__headerbtn {
        top: 16px;
        .el-dialog__close {
          font-size: 24px;
          color: #32485f;
        }
      }
    }
    /deep/.el-dialog__body {
      padding: 0;
    }

    .audit-box {
      padding: 26px 20px 10px 20px;
      max-height: 500px;
      overflow-y: auto;
      .textareabox {
        display: flex;
        align-items: flex-start;
        span {
          width: 120px;
          color: #6c7986;
        }
        .el-textarea__inner {
          background-color: #fafafb;
          height: 140px;
          padding: 15px;
        }
      }
      .uploadfile {
        margin: 40px 0 30px;
        min-height: 100px;
        .uploadtitle {
          color: #6c7986;
          span {
            margin-left: 16px;
            color: #8e8e8e;
            b {
              color: #6c7986;
            }
          }
        }
        .uploadbtn {
					margin: 10px 0 0 100px;
					img{
						width: 140px;
						height: 140px;
					}
          .uploadSubject{
						display: inline-block;
						text-align: center;
						width: 140px;
						height: 140px;
						box-sizing: border-box;
						padding-top: 28px;
						border: 2px dashed @border-DE;
						> i{
							color: @bg-th;
							font-size: 59px;
						}
						> p{
							padding-top: 10px;
							color:@color-324;
							font-size: 14px;
						}
						img{
							width: 140px;
							height: 140px;
						}
					}
        }
      }
      .uploadfile2 {
        margin: 0px 0 30px;
      }
    }

    .btnbox {
      display: flex;
      justify-content: flex-end;
      padding: 15px 20px 15px 0;
      border-top: 1px solid #edecf0;
      .el-button {
        width: 100px;
        height: 38px;
        border-radius: 18px;
        padding: 0;
      }
    }
  }
}
</style>


