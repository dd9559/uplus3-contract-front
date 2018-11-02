<template>
  <div class="view-container">
    <!-- 头部表单 -->
    <el-form :inline="true" :model="companyForm" class="company-form">
      <div class="form-title">
        <span>筛选查询11111</span>
        <div>
          <el-button @click="onReset" class="resetBtn">重置</el-button>
          <el-button type="primary" @click="onSearch" class="searchBth">查询</el-button>        
        </div>
      </div>
      <el-form-item label="城市: ">
        <el-select v-model="companyForm.cityId" placeholder="请选择">
          <el-option value="">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="门店选择: ">
        <el-autocomplete class="inline-input" v-model="companyForm.storeId" placeholder="请输入内容"></el-autocomplete>
      </el-form-item>
      <el-form-item label="合作方式: ">
        <el-select v-model="companyForm.cooperationMode">
          <el-option label="全部" value="全部"></el-option>
          <el-option label="加盟" value="加盟"></el-option>
          <el-option label="直营" value="直营"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="银行账户: ">
        <el-input v-model="companyForm.bankCard"></el-input>
      </el-form-item>
      <el-form-item label="添加时间: ">
        <el-date-picker v-model="addTime" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="关键字: ">
        <el-input v-model="companyForm.keyWord" maxlength=50></el-input>
      </el-form-item>
    </el-form>
    <!-- table表格 -->
    <div class="company-list">
      <p>
        <span>数据列表</span>
        <el-button type="primary" @click="addCompany" icon="el-icon-plus">公司信息</el-button>
      </p>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column align="center" label="城市" prop="cityName">
        </el-table-column>
        <el-table-column align="center" label="门店" prop="storeName">
        </el-table-column>
        <el-table-column align="center" label="开户行">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.companyBankList" :key="index">{{ item.bankBranchName }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="开户名">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.companyBankList" :key="index">{{ item.bankAccountName }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="银行账户">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.companyBankList" :key="index">{{ item.bankCard }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="合作方式" prop="cooperationMode">
        </el-table-column>
        <el-table-column align="center" label="添加时间" prop="createTime">
        </el-table-column>
        <el-table-column align="center" label="添加人" prop="createByName">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="viewCompany(scope.row)" size="medium">查看</el-button>
            <el-button type="text" @click="editCompany" size="medium">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加公司信息 弹出框 -->
    <el-dialog
    title="添加公司信息"
    :visible.sync="dialogAddVisible"
    class="dialog-info">
      <el-form :model="addForm">
        <div class="company-info">
          <p>添加企业信息</p>
          <div class="info-content">
            <el-form-item>
              <el-col :span="8">
                <el-form-item label="城市选择: ">
                  <el-select placeholder="请选择" size="mini" v-model="addForm.cityId">
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="门店选择: ">
                  <el-select placeholder="请选择" size="mini" v-model="addForm.storeId">
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合作方式: ">
                  <el-select v-model="companyForm.cooperationMode" size="mini">
                    <el-option label="全部" value="全部"></el-option>
                    <el-option label="加盟" value="加盟"></el-option>
                    <el-option label="直营" value="直营"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-col :span="8">
                <el-form-item label="门店名称: ">
                  <el-input size="mini" v-model="addForm.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="法人姓名: ">
                  <el-input size="mini" maxlength="15" v-model="addForm.lepName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="证件类型: ">
                  <el-select placeholder="请选择" size="mini" v-model="addForm.lepDocumentType">
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-col :span="8">
                <el-form-item label="证件号: ">
                  <el-input size="mini" v-model="addForm.lepDocumentCard"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="法人手机号码: ">
                  <el-input size="mini" v-model="addForm.lepPhone"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="企业证件: ">
                  <el-select placeholder="请选择" size="mini" v-model="addForm.documentType">
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-col :span="8" v-if="false">
                <el-form-item label="统一社会信用代码: ">
                  <el-input size="mini" v-model="addForm.documentCard.creditCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="true">
                <el-form-item label="工商注册号: ">
                  <el-input size="mini" v-model="addForm.documentCard.icRegisterCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="true">
                <el-form-item label="组织机构代码: ">
                  <el-input size="mini" v-model="addForm.documentCard.organizationCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="true">
                <el-form-item label="税务登记证: ">
                  <el-input size="mini" v-model="addForm.documentCard.taxRegisterCode"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
          </div>
        </div>
        <div class="company-info">
          <p>添加企业银行账户</p>
          <div class="info-content">
            <el-form-item>
              <el-col :span="8">
                <el-form-item label="开户名: ">
                  <el-input size="mini" maxlength="15" v-model="addForm.bankName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="银行账户: ">
                  <el-input size="mini" v-model="addForm.bankAccountName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="开户行: ">
                  <el-input size="mini" v-model="addForm.bankCard"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
          </div>
        </div>
        <div class="company-info">
          <p>添加电子签章</p>
          <div>
            <div class="stamp">
              <span>合同章上传</span>
              <div class="upload">
                <span>上传电子签章图片：</span>
                <ul>
                  <li v-if="false"><img src="@/assets/logo.png" alt=""></li>
                  <li @click="upload('imgcontract')"><span>+</span><input ref="imgcontract" type="file"  @change="uploadFile" style="display: none;"></li>
                </ul>
              </div>
            </div>
            <div class="stamp">
              <span>财务章上传</span>
              <div class="upload">
                <span>上传电子签章图片：</span>
                <ul>
                  <li v-if="false"><img src="@/assets/logo.png" alt=""></li>
                  <li @click="upload('imgfinance')"><span>+</span><input ref="imgfinance" type="file"  @change="uploadFile" style="display: none;"></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogAddVisible = false">确定并保存</el-button>
      </span>
    </el-dialog>
    <!-- 查看 弹出框 -->
    <el-dialog
    title="详情信息"
    :visible.sync="dialogViewVisible"
    width="30%"
    class="dialog-info">
    <div class="view-content">
      <p>汉街二店</p>
      <div>
        <span>法人信息</span>
        <p><span>法人姓名:</span><span>法人手机号码:</span></p>
        <p><span>证件类型:</span><span>证件号:</span></p>
      </div>
      <div>
        <span>营业执照信息</span>
        <p v-if="false">统一社会信用代码:</p>
        <p v-if="true"><span>工商注册号:</span><span>组织机构代码:</span></p>
        <p v-if="true">税务登记证:</p>
      </div>
      <div>
        <span>电子签章信息</span>
        <div class="stamp">
          <span>合同章</span>
          <div><img src="@/assets/logo.png" alt=""></div>
        </div>
        <div class="stamp">
          <span>财务章</span>
          <div><img src="@/assets/logo.png" alt=""></div>
        </div>
      </div>
    </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
    name: "company",
    data() {
      return {
        //表单中的数据
        companyForm: {
          cityId: "",
          storeId: "",
          cooperationMode: "",
          bankCard: "",
          keyWord: "",
          addTimeStart: "",
          addTimeEnd: ""
        },
        addTime: [],
        tableData: [],
        dialogAddVisible: false, //添加公司信息
        addForm: {
          cityId: "",
          storeId: "",
          cooperationMode: "",
          name: "",
          lepName: "",
          lepDocumentType: "",
          lepDocumentCard: "",
          lepPhone: "",
          documentType: "",
          documentCard: {
            creditCode: "",
            icRegisterCode: "",
            organizationCode: "",
            taxRegisterCode: ""
          },
          bankName: "",
          bankAccountName: "",
          bankCard: "",
          contractSign: "",
          financialSign: ""
        },
        dialogViewVisible: false,
        dialogEditVisible: false
      }
    },
    created() {
      this.getCompanyList()
    },
    methods: {
      /**
       * 获取公司设置列表
       */
      getCompanyList: function () {
        let param = {
          cityId: 1
        }
        this.$ajax.get('/api/setting/company/list', param).then(res => {
          res = res.data
          if(res.status === 200) {
            this.tableData = res.data
          }
        })
      },
      //搜索
      onSearch() {},
      //重置
      onReset() {},
      addCompany() {
        this.dialogAddVisible = true
      },
      viewCompany(row) {
        this.dialogViewVisible = true
        console.log(row)
      },
      editCompany() {
        this.dialogEditVisible = true
      },
      //新增银行账户
      addBankAccount() {
        // let oldItem = this.$refs.bankAccount.$el.children[0]
        // let newItem = oldItem.cloneNode(true)
        // this.$refs.bankAccount.$el.appendChild(newItem)
        // console.log(this.$refs.bankAccount.$el)
      },
      upload(type) {
        this.$refs[type].click()
      },
      uploadFile(e) {
        console.log(e.target.files,123)
        const file = e.target.files[0];
        if(!file) {
          return
        }
        let fileType = file.name.split('.')[1]
        if(fileType === 'jpg' || fileType === 'png') {
          
        } else {
          this.$message('请使用jpg或者png格式的图片')
          return
        }
      }
    }
}
</script>

<style lang="less" scoped>
@import "~@/assets/common.less";

.company-form {
  padding: 10px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius:2px;
  box-sizing: border-box;
  box-shadow:0px 1px 6px 0px rgba(7,47,116,0.1);
  .form-title {
    margin-bottom: 10px;
    overflow: hidden;
    span {
      float: left;
    }
    div {
      float: right;
      > .el-button {
        width: 100px;
        height: 36px;
        border-radius:18px;
      }
    }
  }
}
.company-list {
  background-color: #fff;
  padding: 10px;
  > p {
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    > .el-button {
      width:119px;
      height:36px;
      border-radius:18px;
    }
  }
}
.dialog-info {
  min-width: 770px;
  .company-info {
    padding: 0 20px;
    border-top: 1px solid rgba(237,236,240,1);
    > p {
      height: 40px;
      display: flex;
      align-items: center;
      position: relative;
      font-size: 14px;
      font-weight: bold;
      color:rgba(35,50,65,1);
      .el-button {
        position: absolute;
        right: 20px;
      }
    }
    .info-content {
      .el-col {
        .el-form-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          /deep/.el-form-item__label {
            // min-width: 100px;
            text-align: left;
          }
        }
      }
    }
    &:last-child {
      > div {
        display: flex;
        > .stamp {
          display: inline-block;
          flex: 1;
          margin-top: 20px;
          > span {
            color:rgba(35,50,65,1);
          }
          > .upload {
            display: flex;
            margin-top: 50px;
            > ul {
              display: flex;
              li {
                width: 60px;
                height: 60px;
                background-color: #ccc;
                margin-right: 10px;
                position: relative;
                > img {
                  width: 100%;
                }
                > span {
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%,-50%);
                  font-size: 70px;
                  color: @bg-grey;
                }
              }
            }
          }
        }
      }
    }
  }
  .view-content {
    > p {
      text-align: center;
    }
    > div {
      overflow: hidden;
      > span {
        display: block;
        color: #333;
        font-weight: bold;
      }
      > p {
        display: flex;
        align-items: center;
        line-height: 3;
        > span {
          flex: 1;
        }
      }
      > .stamp {
        display: inline-block;
        width: 50%;
        float: left;
        text-align: center;
        > div {
          width: 60px;
          height: 60px;
          margin: 10px auto 0;
          background-color: #ccc;
          > img {
            width: 100%;
          }
        }
      }
    }
  }
}
/deep/ .el-dialog__header {
  background-color: @bg-grey;
}
/deep/ .el-table th {
  background:rgba(238,242,251,1);
}
/deep/ .el-dialog__body {
  padding: 0;
}
</style>