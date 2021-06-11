<template>
	<div class="posDialog">
		<el-dialog
      title="开通POS收款"
      :closeOnClickModal="$tool.closeOnClickModal"
      :visible.sync="posDialog"
      width="1200px"
      class="dep-dialog">
			<div class="titleBox">
				<div class="title" v-for="item in titleList" :key="item+1">
					{{item.item}}
				</div>
			</div>
      <div class="posDialogBox">
				<div class="formBox">
					<el-form label-position="right" ref="form" size="mini" :model="form" label-width="140px">
						<el-form-item label="企业名称：">
							<span>北京小时谷拜科技有限公司</span>
						</el-form-item>
						<el-form-item label="企业地址：">
							<el-input v-model="form.name"></el-input>
						</el-form-item>
						<el-form-item label="统一社会信用代码：">
							<span>928887233222K</span>
						</el-form-item>
						<el-form-item label="法人姓名：">
							<el-input v-model="form.name"></el-input>
						</el-form-item>
						<el-form-item label="法人身份证号码：">
							<el-input v-model="form.name"></el-input>
						</el-form-item>
						<el-form-item label="法人手机号：">
							<el-input v-model="form.name"></el-input>
						</el-form-item>
						<el-form-item label="开户银行名称: ">
							<el-select size="small" v-model="form.bankName" filterable :disabled="fourthStoreNoEdit" class="bank-item">
								<el-option v-for="m in adminBanks" :key="m.id" :label="m.bankName" :value="JSON.stringify(m)"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="支行名称：">
							<el-input v-model="form.name"></el-input>
						</el-form-item>
						<el-form-item label="支付行号：">
							<el-input v-model="form.name"></el-input>
						</el-form-item>
						<el-form-item label="银行卡号：">
							<el-input v-model="form.name"></el-input>
						</el-form-item>
					</el-form>
				</div>
				<div style="margin-left: 115px;">
					<div class="tips">温馨提示：每次仅支持上传一张图片，大小不超过1M； 格式：jpg，png</div>
					<div style="display:flex;align-items: center;">
						
						<div class="idCard">
							<div style="margin-bottom: 15px;">法人身份证照片上传：</div>
							<div style="display:flex;align-items: center;">
								<fileUp id="idCard" class="up" :rules="['png','jpg']" @getUrl="upload" :more=false :picSize=true :scane="{path:'setting'}" :canvas="true">
									<img src="@/assets/img/idcard.png" alt="">
								</fileUp>
								<fileUp id="theotherside" class="up" :rules="['png','jpg']" @getUrl="upload" :more=false :picSize=true :scane="{path:'setting'}" :canvas="true">
									<img src="@/assets/img/theotherside.png" alt="" style="margin-left: 50px;">
								</fileUp>
							</div>
						</div>
					</div>
					<div class="businessLicense">
						<div style="margin:20px 0;">企业营业执照上传：</div>
						<div>
							<fileUp id="businessLicense" class="up" :rules="['png','jpg']" @getUrl="upload" :more=false :picSize=true :scane="{path:'setting'}" :canvas="true">
								<img src="@/assets/img/businessLicense.png" alt="">
							</fileUp>
						</div>
					</div>
				</div>
			</div>
      <div slot="footer">
        <el-button @click="clickBind" type="primary" round>提交信息</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
	import {MIXINS} from "@/assets/js/mixins";
	export default {
		mixins: [MIXINS],
		props:{
			posDialog:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				form:{
					bankName:''
				},
				titleList:[
					{item:'第一步：提交企业信息'},
					{item:'第二步：签约'},
					{item:'第三步：绑定手机号'},
					{item:'第四步：绑定银行卡'},
				],
				adminBanks:[],
				fourthStoreNoEdit:false
			}
		},
		mounted() {
			// 银行列表
      this.getBanks()
		},
		methods:{
			// 获取银行列表
      getBanks:function () {
        this.$ajax.get('/api/system/selectBankName').then(res=>{
          res=res.data
          if(res.status===200){
            this.adminBanks=res.data
          }
        }).catch(error=>{
          this.$message({message:error})
        })
      },
		}
			
	}
</script>

<style lang="less" scoped>
	.posDialog {
		.formBox {
			width: 410px;
		}
		.tips {
			position: absolute;
			top: 125px;
		}
		.dep-dialog {
			/deep/ .el-dialog {
				border-radius: 10px;
				.el-dialog__header {
					border: none !important;
				}
				.el-dialog__body {
					margin-top: 20px;
					padding: 0 40px;
				}
			}
		}
		.titleBox {
			text-align: center;
			display: flex;
			align-items: center;
			.title {
				width: 500px;
				height: 30px;
				line-height: 30px;
				border: 1px solid #333;
			}
			.title:nth-child(2){
				margin-left: 30px;
				margin-right: 15px;
			}
			.title:nth-child(3){
				margin-left: 15px;
				margin-right: 30px;
			}
			
		}
		.posDialogBox {
			margin-top: 20px;
			display: flex;
			align-items: center;
			
		}
	}
</style>