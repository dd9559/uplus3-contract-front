<template>
  <div class="view-container">
    <!-- 头部表单 -->
    <el-form :inline="true" :model="companyForm" min-width="1398px">
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
        <el-select v-model="companyForm.cooperationMode" size="mini">
          <el-option label="全部" value="全部"></el-option>
          <el-option label="加盟" value="加盟"></el-option>
          <el-option label="直营" value="直营"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="银行账户: ">
        <el-input v-model="companyForm.bankCard" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="添加时间: ">
        <el-date-picker type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="关键字: ">
        <el-input v-model="companyForm.keyWord" size="mini" maxlength=50></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" plain @click="onReset">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" plain @click="addCompany">添加公司信息</el-button>
      </el-form-item>
    </el-form>
    <!-- table表格 -->
    <el-table :data="tableData" style="width: 100%" class="company-list">
      <el-table-column label="城市" prop="cityName">
      </el-table-column>
      <el-table-column label="门店" prop="storeName">
      </el-table-column>
      <el-table-column label="开户行" prop="bankName">
      </el-table-column>
      <el-table-column label="开户名" prop="bankAccountName" min-width="120">
      </el-table-column>
      <el-table-column label="银行账户" prop="bankCard" min-width="115">
      </el-table-column>
      <el-table-column label="合作方式" prop="cooperationMode">
      </el-table-column>
      <el-table-column label="添加时间" prop="createTime" min-width="120">
      </el-table-column>
      <el-table-column label="添加人" prop="createName" min-width="130">
      </el-table-column>
      <el-table-column label="操作" min-width="111">
        <template slot-scope="scope">
          <el-button type="text" @click="viewCompany">查看</el-button>
          <el-button type="text" @click="editCompany">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加公司信息 弹出框 -->
    <el-dialog
    title="添加公司信息"
    :visible.sync="dialogAddVisible"
    class="dialog-info">
      <el-form>
        <div class="company-info">
          <p>添加企业信息</p>
          <div class="info-content">
            <el-form-item>
              <el-col :span="6">
                <el-form-item label="城市选择: ">
                  <el-select placeholder="请选择" size="mini">
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="门店选择: ">
                  <el-select placeholder="请选择" size="mini">
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="合作方式: ">
                  <el-select v-model="companyForm.cooperationMode" size="mini">
                    <el-option label="全部" value="全部"></el-option>
                    <el-option label="加盟" value="加盟"></el-option>
                    <el-option label="直营" value="直营"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="门店名称: ">
                  <el-input size="mini"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-col :span="6">
                <el-form-item label="法人姓名: ">
                  <el-input size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="证件类型: ">
                  <el-select placeholder="请选择" size="mini">
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="证件号: ">
                  <el-input size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="法人手机号码: ">
                  <el-input size="mini"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-col :span="6">
                <el-form-item label="企业证件: ">
                  <el-select placeholder="请选择" size="mini">
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="16" v-if="false">
                <el-form-item label="统一社会信用代码: ">
                  <el-input size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="true">
                <el-form-item label="工商注册号: ">
                  <el-input size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="true">
                <el-form-item label="组织机构代码: ">
                  <el-input size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="true">
                <el-form-item label="税务登记证: ">
                  <el-input size="mini"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
          </div>
        </div>
        <div class="company-info">
          <p>添加企业银行账户</p>
          <div class="info-content">
            <el-form-item>
              <el-col :span="6">
                <el-form-item label="开户名: ">
                  <el-input size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="银行账户: ">
                  <el-input size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="开户行: ">
                  <el-input size="mini"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
          </div>
        </div>
        <div class="company-info">
          <p>添加电子签章</p>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogAddVisible = false">确定并保存</el-button>
      </span>
    </el-dialog>
    <!-- 查看 弹出框 -->
    <el-dialog
    title="查看公司信息"
    :visible.sync="dialogViewVisible"
    class="dialog-info">
      <el-form>
        <div class="company-info">
          <p>企业信息</p>
          <div class="info-content">
          </div>
        </div>
        <div class="company-info">
          <p>企业银行账户</p>
          <div class="info-content">
          </div>
        </div>
        <div class="company-info">
          <p>电子签章</p>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios"
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
          keyWord: ""
        },
        tableData: [
          { cityName: "武汉", storeName: "汉街一店", bankName: "", bankAccountName: "", bankCard: "", cooperationMode: "加盟", createTime: "2018/09/03", createName: "东野圭吾" },
          { cityName: "武汉", storeName: "汉街一店", bankName: "", bankAccountName: "", bankCard: "", cooperationMode: "直营", createTime: "2018/09/03", createName: "东野圭吾" }
        ],
        dialogAddVisible: false, //添加公司信息
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
        let param = this.companyForm
        this.$ajax.get('/api/setting/company/list', param).then(res => {
          console.log(res)
        })
      },
      //搜索
      onSearch() {},
      //重置
      onReset() {},
      addCompany() {
        this.dialogAddVisible = true
      },
      viewCompany() {
        this.dialogViewVisible = true
      },
      editCompany() {
        this.dialogEditVisible = true
      }
    }
}
</script>

<style lang="less" scoped>
@import "~@/assets/common.less";

.view-container {
  padding: 30px;
  .company-list {
    background-color: @bg-grey;
  }
  .dialog-info {
    min-width: 770px;
    .company-info {
      > p {
        height: 40px;
        line-height: 40px;
        font-size: 20px;
        font-weight: bold;
        background-color: @bg-grey;
      }
    }
  }
}
</style>
