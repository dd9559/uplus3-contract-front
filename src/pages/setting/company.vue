<template>
  <div class="view-container">
    <!-- 头部表单 -->
    <el-form :inline="true" :model="companyForm" class="company-form">
      <div class="form-title">
        <span>筛选查询</span>
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
        <el-date-picker v-model="companyForm.searchTime" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
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
        <el-table-column align="center" label="城市" prop="cityName" width="150">
        </el-table-column>
        <el-table-column align="center" label="门店" prop="storeName" width="200">
        </el-table-column>
        <el-table-column align="center" label="开户行" width="200">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.companyBankList" :key="index">{{ item.bankBranchName }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="开户名" width="190">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.companyBankList" :key="index">{{ item.bankAccountName }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="银行账户" width="200">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.companyBankList" :key="index">{{ item.bankCard }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="合作方式" prop="cooperationMode" width="150">
        </el-table-column>
        <el-table-column align="center" label="添加时间" prop="createTime" width="200">
        </el-table-column>
        <el-table-column align="center" label="添加人" prop="createByName" width="150">
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="viewCompany(scope.row)" size="medium">查看</el-button>
            <el-button type="text" @click="editCompany(scope.row)" size="medium">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加公司信息 弹出框 -->
    <el-dialog
    title="添加企业信息"
    :visible.sync="dialogAddVisible"
    class="dialog-info">
      <el-form :model="addForm">
        <div class="company-info">
          <p>添加企业信息</p>
          <div class="info-content">
            <div class="item">
              <el-form-item label="城市选择: ">
                <el-select placeholder="请选择" size="mini" v-model="addForm.cityId">
                </el-select>
              </el-form-item>
              <el-form-item label="门店选择: ">
                <el-select placeholder="请选择" size="mini" v-model="addForm.storeId">
                </el-select>
              </el-form-item>
              <el-form-item label="合作方式: ">
                <el-select v-model="addForm.cooperationMode" size="mini">
                  <el-option label="全部" value="全部"></el-option>
                  <el-option label="加盟" value="加盟"></el-option>
                  <el-option label="直营" value="直营"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item label="门店名称: ">
                <el-input size="mini" v-model="addForm.name"></el-input>
              </el-form-item>
              <el-form-item label="法人姓名: ">
                <el-input size="mini" maxlength="15" v-model="addForm.lepName"></el-input>
              </el-form-item>
              <el-form-item label="证件类型: ">
                <el-select placeholder="请选择" size="mini" v-model="addForm.lepDocumentType">
                  <el-option label="居民身份证" value="居民身份证"></el-option>
                  <el-option label="护照" value="护照"></el-option>
                  <el-option label="港澳居民来往大陆通行证" value="港澳居民来往大陆通行证"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item label="证件号: ">
                <el-input size="mini" v-model="addForm.lepDocumentCard"></el-input>
              </el-form-item>
              <el-form-item label="法人手机号码: ">
                <el-input size="mini" v-model="addForm.lepPhone"></el-input>
              </el-form-item>
              <el-form-item label="企业证件: ">
                <el-select placeholder="请选择" size="mini" v-model="addForm.documentType" @change="documentTypeChange">
                  <el-option label="三证合一" value="三证合一"></el-option>
                  <el-option label="老三证" value="老三证"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item label="统一社会信用代码: " v-if="creditCodeAppear">
                <el-input size="mini" v-model="addForm.documentCardStr.creditCode"></el-input>
              </el-form-item>
              <el-form-item label="工商注册号: " v-if="icRegisterAppear">
                <el-input size="mini" v-model="addForm.documentCardStr.icRegisterCode"></el-input>
              </el-form-item>
              <el-form-item label="组织机构代码: " v-if="icRegisterAppear">
                <el-input size="mini" v-model="addForm.documentCardStr.organizationCode"></el-input>
              </el-form-item>
              <el-form-item label="税务登记证: " v-if="icRegisterAppear">
                <el-input size="mini" v-model="addForm.documentCardStr.taxRegisterCode"></el-input>
              </el-form-item>
            </div>
            <div class="tip">
              <span>温馨提示: </span>
              <div class="message">
                <p>1. 门店名称必须和营业执照证件上登记的名称一致；</p>
                <p>2. 如个体工商户在营业执照上无企业名称的，请填“经营者”名字；</p>
                <p>3. 三证合一企业证件，只需要填写“统一社会信用代码”；老三证，请分别填写工商注册号、组织机构代码、税务登记证</p>
              </div>
            </div>
          </div>
        </div>
        <div class="company-info">
          <p>添加企业银行账户</p>
          <div class="info-content">
            <el-table style="width: 100%" :data="addForm.companyBankListStr.data" class="addBankRow">
              <el-table-column width="270px" align="center" label="">
                <template slot-scope="scope">
                  <el-form-item label="开户名: ">
                    <el-input size="mini" maxlength="15" v-model="addForm.companyBankListStr.data[scope.$index].bankAccountName"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column width="270px" align="center" label="">
                <template slot-scope="scope">
                  <el-form-item label="银行账户: ">
                    <el-input size="mini" v-model="addForm.companyBankListStr.data[scope.$index].bankCard"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column align="center" label="" min-width="280px">
                <template slot-scope="scope">
                  <el-form-item label="开户行: ">
                    <el-input size="mini" v-model="addForm.companyBankListStr.data[scope.$index].bankName"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="" width="90px">
                <template slot-scope="scope">
                  <span @click="addRow" class="button"><i class="icon el-icon-plus"></i></span>
                  <span @click="removeCell(scope.$index)" class="button"><i class="icon el-icon-minus"></i></span>
                </template>
              </el-table-column>
            </el-table>
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
                  <li><img src="@/assets/logo.png" alt=""></li>
                  <li @click="upload('imgcontract')"><span>+</span><input ref="imgcontract" type="file"  @change="uploadFile" style="display: none;"></li>
                </ul>
              </div>
            </div>
            <div class="stamp">
              <span>财务章上传</span>
              <div class="upload">
                <span>上传电子签章图片：</span>
                <ul>
                  <li><img src="@/assets/logo.png" alt=""></li>
                  <li @click="upload('imgfinance')"><span>+</span><input ref="imgfinance" type="file"  @change="uploadFile" style="display: none;"></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="tip">
            <span>温馨提示: </span>
            <div class="message">
              <p>1. 上传前，请把图片处理成透明无底色,<span>不抠图</span>；</p>
              <p>2. 请使用<span>jpg</span>或者<span>png</span>格式的图片，大小不超过<span>5M</span>；</p>
            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addConfirm">确定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑 弹出框 -->
    <el-dialog
    title="编辑企业信息"
    :visible.sync="dialogEditVisible"
    class="dialog-info">
      <el-form :model="editForm">
        <div class="company-info">
          <p>添加企业信息</p>
          <div class="info-content">
            <div class="item">
              <el-form-item label="城市选择: ">
                <el-select placeholder="请选择" size="mini" v-model="editForm.cityId">
                </el-select>
              </el-form-item>
              <el-form-item label="门店选择: ">
                <el-select placeholder="请选择" size="mini" v-model="editForm.storeId">
                </el-select>
              </el-form-item>
              <el-form-item label="合作方式: ">
                <el-select v-model="editForm.cooperationMode" size="mini">
                  <el-option label="全部" value="全部"></el-option>
                  <el-option label="加盟" value="加盟"></el-option>
                  <el-option label="直营" value="直营"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item label="门店名称: ">
                <el-input size="mini" v-model="editForm.name"></el-input>
              </el-form-item>
              <el-form-item label="法人姓名: ">
                <el-input size="mini" maxlength="15" v-model="editForm.lepName"></el-input>
              </el-form-item>
              <el-form-item label="证件类型: ">
                <el-select placeholder="请选择" size="mini" v-model="editForm.lepDocumentType">
                </el-select>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item label="证件号: ">
                <el-input size="mini" v-model="editForm.lepDocumentCard"></el-input>
              </el-form-item>
              <el-form-item label="法人手机号码: ">
                <el-input size="mini" v-model="editForm.lepPhone"></el-input>
              </el-form-item>
              <el-form-item label="企业证件: ">
                <el-select placeholder="请选择" size="mini" v-model="editForm.documentType">
                </el-select>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item label="统一社会信用代码: " v-if="creditCodeDisplay">
                <el-input size="mini" v-model="editForm.documentCard.creditCode"></el-input>
              </el-form-item>
              <el-form-item label="工商注册号: " v-if="icRegisterDisplay">
                <el-input size="mini" v-model="editForm.documentCard.icRegisterCode"></el-input>
              </el-form-item>
              <el-form-item label="组织机构代码: " v-if="icRegisterDisplay">
                <el-input size="mini" v-model="editForm.documentCard.organizationCode"></el-input>
              </el-form-item>
              <el-form-item label="税务登记证: " v-if="icRegisterDisplay">
                <el-input size="mini" v-model="editForm.documentCard.taxRegisterCode"></el-input>
              </el-form-item>
            </div>
            <div class="tip">
              <span>温馨提示: </span>
              <div class="message">
                <p>1. 门店名称必须和营业执照证件上登记的名称一致；</p>
                <p>2. 如个体工商户在营业执照上无企业名称的，请填“经营者”名字；</p>
                <p>3. 三证合一企业证件，只需要填写“统一社会信用代码”；老三证，请分别填写工商注册号、组织机构代码、税务登记证</p>
              </div>
            </div>
          </div>
        </div>
        <div class="company-info">
          <p>添加企业银行账户</p>
          <div class="info-content">
            <el-table style="width: 100%" :data="editCompanyBankList" class="addBankRow">
              <el-table-column width="270px" align="center" label="">
                <template slot-scope="scope">
                  <el-form-item label="开户名: ">
                    <el-input size="mini" maxlength="15" v-model="editCompanyBankList[scope.$index].bankName"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column width="270px" align="center" label="">
                <template slot-scope="scope">
                  <el-form-item label="银行账户: ">
                    <el-input size="mini" v-model="editCompanyBankList[scope.$index].bankAccountName"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column align="center" label="" min-width="280px">
                <template slot-scope="scope">
                  <el-form-item label="开户行: ">
                    <el-input size="mini" v-model="editCompanyBankList[scope.$index].bankCard"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="" width="90px">
                <template slot-scope="scope">
                  <span @click="addRow" class="button"><i class="icon el-icon-plus"></i></span>
                  <span @click="removeCell(scope.$index)" class="button"><i class="icon el-icon-minus"></i></span>
                </template>
              </el-table-column>
            </el-table>
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
                  <li><img :src="editForm.contractSign" alt=""></li>
                  <li @click="upload('imgcontract')"><span>+</span><input ref="imgcontract" type="file"  @change="uploadFile" style="display: none;"></li>
                </ul>
              </div>
            </div>
            <div class="stamp">
              <span>财务章上传</span>
              <div class="upload">
                <span>上传电子签章图片：</span>
                <ul>
                  <li><img :src="editForm.financialSign" alt=""></li>
                  <li @click="upload('imgfinance')"><span>+</span><input ref="imgfinance" type="file"  @change="uploadFile" style="display: none;"></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="tip">
            <span>温馨提示: </span>
            <div class="message">
              <p>1. 上传前，请把图片处理成透明无底色,<span>不抠图</span>；</p>
              <p>2. 请使用<span>jpg</span>或者<span>png</span>格式的图片，大小不超过<span>5M</span>；</p>
            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editConfirm">确定</el-button>
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
        <p><span>法人姓名: {{ RowDataList.lepName }}</span><span>法人手机号码: {{ RowDataList.lepPhone }}</span></p>
        <p><span>证件类型: {{ RowDataList.lepDocumentType }}</span><span>证件号: {{ RowDataList.lepDocumentCard }}</span></p>
      </div>
      <div>
        <span>营业执照信息</span>
        <p v-if="creditCodeShow">统一社会信用代码: {{ RowDataList.documentCard.creditCode }}</p>
        <p v-if="icRegisterShow"><span>工商注册号: {{ RowDataList.documentCard.icRegisterCode }}</span><span>组织机构代码: {{ RowDataList.documentCard.organizationCode }}</span></p>
        <p v-if="icRegisterShow">税务登记证: {{ RowDataList.documentCard.taxRegisterCode }}</p>
      </div>
      <div>
        <span>电子签章信息</span>
        <div class="stamp">
          <span>合同章: </span>
          <div><img :src="RowDataList.contractSign" alt=""></div>
        </div>
        <div class="stamp">
          <span>财务章: </span>
          <div><img :src="RowDataList.financialSign" alt=""></div>
        </div>
      </div>
    </div>
    </el-dialog>
  </div>
</template>

<script>
let stepTypeId = 1;
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
          searchTimeStart: "",
          searchTimeEnd: ""
        },
        searchTime: [],
        tableData: [],
        dialogAddVisible: false, //添加公司信息
        //新增表单
        addForm: {
          cityId: "",
          cityName: "武汉",
          storeId: "",
          storeName: "当代一店",
          cooperationMode: "",
          name: "",
          lepName: "",
          lepDocumentType: "",
          lepDocumentCard: "",
          lepPhone: "",
          documentType: "",
          documentCardStr: {
            creditCode: "",
            icRegisterCode: "",
            organizationCode: "",
            taxRegisterCode: "",
          },
          companyBankListStr: {
            data: [
              {
                id: 1,
                bankName: '',
                bankAccountName: '',
                bankCard: '',
              }
            ]
          },
          contractSign: "",
          financialSign: ""
        },
        dialogViewVisible: false, //查看弹出框
        RowDataList: {}, //当前行列表信息
        creditCodeShow: false,
        icRegisterShow: false,
        creditCodeAppear: false,
        icRegisterAppear: false,
        dialogEditVisible: false, //编辑弹出框
        //编辑表单
        editForm: {},
        editCompanyBankList: [],
        creditCodeDisplay: false,
        icRegisterDisplay: false
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
        }).catch(error => {
          console.log(error);
        })
      },
      //搜索
      onSearch() {},
      //重置
      onReset() {},
      //点击新增公司信息
      addCompany() {
        this.dialogAddVisible = true
      },
      //企业证件选择
      documentTypeChange(val) {
        if(val === '老三证') {
          this.creditCodeAppear = false
          this.icRegisterAppear = true
        } else {
          this.icRegisterAppear = false
          this.creditCodeAppear = true
        }
      },
      //新增银行账户
      addRow() {
        let row = {
          id: ++stepTypeId,
          bankName: '',
          bankAccountName: '',
          bankCard: '',
        }
        this.addForm.companyBankListStr.data.push(row)
      },
      removeCell(index) {
        this.addForm.companyBankListStr.data.splice(index,1)
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
      },
      //确定新增公司信息
      addConfirm() {
        this.addForm.cooperationMode = 1
        this.addForm.cityId = 1
        this.addForm.storeId = 1
        this.addForm.lepDocumentType = 1
        this.addForm.documentType = 1
        this.addForm.documentCardStr = JSON.stringify(this.addForm.documentCardStr)
        this.addForm.companyBankListStr = JSON.stringify(this.addForm.companyBankListStr)
        this.$ajax.post('/api/setting/company/insert', this.addForm).then(res => {
          console.log(res)
          res = res.data
          if(res.status === 200) {
            this.$message(res.message)
          }
          this.dialogAddVisible = false
          this.getCompanyList()
        }).catch(error => {
          console.log(error);
        })
        console.log(this.addForm,123)
      },
      //点击查看
      viewCompany(row) {
        this.dialogViewVisible = true
        if(row.documentType === 2) {
          this.icRegisterShow = true
          this.creditCodeShow = false
        } else {
          this.icRegisterShow = false
          this.creditCodeShow = true
        }
        this.RowDataList = row
      },
      //点击编辑
      editCompany(row) {
        this.dialogEditVisible = true
        if(row.documentType === 2) {
          this.icRegisterDisplay = true
          this.creditCodeDisplay = false
        } else {
          this.icRegisterDisplay = false
          this.creditCodeDisplay = true
        }
        this.editForm = row
        this.editCompanyBankList = row.companyBankList.length > 0 ? row.companyBankList : this.addForm.companyBankListStr.data
      },
      //确定编辑公司信息
      editConfirm() {
        console.log(this.editForm,123)
        this.editForm.documentCardStr = JSON.stringify(this.editForm.documentCard)
        this.editForm.documentCard = JSON.stringify(this.editForm.documentCard)
        this.editForm.companyBankListStr = JSON.stringify(this.editForm.companyBankList)
        this.editForm.companyBankList = JSON.stringify(this.editForm.companyBankList)
        this.$ajax.put('/api/setting/company/update',this.editForm).then(res => {
          console.log(res);
        }).catch(error => {
          console.log(error);
        })
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
    display: flex;
    justify-content: space-between;
    div {
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
    padding: 30px 20px;
    border-top: 1px solid rgba(237,236,240,1);
    > p {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 15px;
      color:rgba(35,50,65,1);
    }
    .tip {
      display: flex;
      span {
        color: #333;
        font-weight: bold;
        margin-right: 10px;
      }
      .message {
        color: #CD6D6D;
        p:nth-child(2) { margin: 10px 0; }
        span { font-weight: bold; color: #D56868; }
      }
    }
    &:first-child {
      .info-content {
        > .item {
          display: flex;
          justify-content: space-between;
          > .el-form-item {
            display: flex;
          }
        }
      }
    }
    &:nth-child(2) {
      /deep/ .el-table__header-wrapper {
        display: none;
      }
      .el-table__row {
        .el-form-item {
          display: flex;
          margin-bottom: 0;
        }
      }
      .addBankRow {
        .button {
          display: inline-block;
          padding: 0;
          width: 30px;
          height: 30px;
          line-height: 30px;
          background: #c8c8c8;
          border-radius: 50%;
          text-align: center;
          cursor: pointer;
          i {
            color: #fff;
            font-weight: bold;
          }
        }
        &.el-table tr:first-child td:last-child {
          span:last-child {
            display: none;
          }
        }
      }
      /deep/ .el-table td { border: 0; padding: 0; }
    }
    &:last-child {
      > div {
        display: flex;
        margin-bottom: 20px;
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
    padding: 20px 20px 50px;
    > p {
      text-align: center;
      font-size: 20px;
    }
    > div {
      overflow: hidden;
      margin-top: 20px;
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
        display: flex;
        float: left;
        margin-top: 20px;
        span { margin-right: 5px; }
        > div {
          width: 60px;
          height: 60px;
          background-color: #ccc;
          > img {
            width: 100%;
          }
        }
      }
    }
  }
  .dialog-footer {
    .el-button {
      width:100px;
      height:36px;
      border-radius:18px;
    }
  }
}
/deep/ .el-dialog__header {
  background-color: @bg-grey;
}
/deep/ .el-table th {
  background:rgba(238,242,251,1);
}
/deep/ .el-table::before {
  display: none;
}
/deep/ .el-dialog__body {
  padding: 0;
}
</style>