<template>
  <div class="view-container">
    <!-- 头部表单 -->
    <ScreeningTop
    @propQueryFn="queryFn"
    @propResetFormFn="resetFormFn">
      <el-form :inline="true" :model="searchForm" class="form-head" size="small">
        <el-form-item label="城市">
          <el-select v-model="searchForm.cityId" filterable @change="getStoreList">
            <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.cityId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店选择">
          <el-select v-model="searchForm.storeId" filterable>
            <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合作方式">
          <el-select v-model="searchForm.cooperationMode">
            <el-option v-for="item in dictionary['39']" :key="item.key" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="银行账户">
          <el-input v-model="searchForm.bankCard"></el-input>
        </el-form-item>
        <el-form-item label="添加时间">
          <el-date-picker
          v-model="searchTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="searchForm.keyword" maxlength=50 placeholder="添加人/开户行/开户名"></el-input>
        </el-form-item>
      </el-form>
    </ScreeningTop>
    <!-- table表格 -->
    <div class="company-list">
      <p>
        <span>数据列表</span>
        <el-button type="primary" @click="addCompany" icon="el-icon-plus">公司信息</el-button>
      </p>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column align="center" label="城市" prop="cityName" width="90">
        </el-table-column>
        <el-table-column align="center" label="门店" prop="storeName" width="220">
        </el-table-column>
        <el-table-column align="center" label="开户行" width="220">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.companyBankList" :key="index">{{ item.bankBranchName }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="开户名" width="220">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.companyBankList" :key="index">{{ item.bankAccountName }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="银行账户" width="200">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.companyBankList" :key="index">{{ item.bankCard }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="合作方式" prop="cooperationMode.label" width="150">
        </el-table-column>
        <el-table-column align="center" label="添加时间" prop="createTime" width="208">
        </el-table-column>
        <el-table-column align="center" label="添加人" prop="createByName" width="150">
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="viewEditCompany(scope.row,'init')" size="medium">查看</el-button>
            <el-button type="text" @click="viewEditCompany(scope.row,'edit')" size="medium">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="prev, pager, next,  total, sizes, jumper"
      :total="count">
      </el-pagination>
    </div>
    <!-- 添加和编辑公司信息 弹出框 -->
    <el-dialog
    :title="companyFormTitle"
    :visible.sync="AddEditVisible"
    width="1000px"
    :before-close="handleClose"
    class="dialog-info">
      <el-form :model="companyForm" label-position='right'>
        <div class="company-info">
          <p>添加企业信息</p>
          <div class="info-content">
            <div class="item">
              <el-form-item label="城市选择: ">
                <el-select placeholder="请选择" size="mini" v-model="companyForm.cityId" filterable @change="getStoreList">
                  <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.cityId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="门店选择: ">
                <el-select placeholder="请选择" size="mini" v-model="companyForm.storeId" filterable @change="storeSelect">
                  <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="合作方式: ">
                <el-select v-model="companyForm.cooperationMode" size="mini" @change="cooModeChange" :disabled="directSaleOut">
                  <el-option v-for="item in dictionary['39']" :key="item.key" :label="item.value" :value="item.key"></el-option>                  
                </el-select>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item label="门店名称: ">
                <el-input size="mini" v-model="companyForm.name" placeholder="营业执照上的名字"></el-input>
              </el-form-item>
              <el-form-item label="法人姓名: ">
                <el-input size="mini" maxlength="15" v-model="companyForm.lepName" :disabled="directSaleSelect"></el-input>
              </el-form-item>
              <el-form-item label="证件类型: ">
                <el-select placeholder="请选择" size="mini" v-model="companyForm.lepDocumentType" :disabled="directSaleSelect">
                  <el-option v-for="item in dictionary['40']" :key="item.key" :label="item.value" :value="item.key"></el-option>                  
                </el-select>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item label="证件号: ">
                <el-input size="mini" v-model="companyForm.lepDocumentCard" :disabled="directSaleSelect"></el-input>
              </el-form-item>
              <el-form-item label="法人手机号码: ">
                <el-input size="mini" v-model="companyForm.lepPhone" :disabled="directSaleSelect"></el-input>
              </el-form-item>
              <el-form-item label="企业证件: ">
                <el-select placeholder="请选择" size="mini" v-model="companyForm.documentType" @change="documentTypeChange" :disabled="directSaleSelect">
                  <el-option v-for="item in dictionary['38']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item label="统一社会信用代码: " v-if="creditCodeShow">
                <el-input size="mini" v-model="documentCard.creditCode"></el-input>
              </el-form-item>
              <el-form-item label="工商注册号: " v-if="icRegisterShow">
                <el-input size="mini" v-model="documentCard.icRegisterCode" :disabled="directSaleSelect"></el-input>
              </el-form-item>
              <el-form-item label="组织机构代码: " v-if="icRegisterShow">
                <el-input size="mini" v-model="documentCard.organizationCode" :disabled="directSaleSelect"></el-input>
              </el-form-item>
              <el-form-item label="税务登记证: " v-if="icRegisterShow">
                <el-input size="mini" v-model="documentCard.taxRegisterCode" :disabled="directSaleSelect"></el-input>
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
            <el-table style="width: 100%" :data="companyBankList" class="addBankRow">
              <el-table-column width="270px" align="center" label="">
                <template slot-scope="scope">
                  <el-form-item label="开户名: ">
                    <el-input size="mini" maxlength="15" v-model="companyBankList[scope.$index].bankAccountName" :disabled="directSaleSelect"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column width="270px" align="center" label="">
                <template slot-scope="scope">
                  <el-form-item label="银行账户: ">
                    <el-input size="mini" v-model="companyBankList[scope.$index].bankCard" :disabled="directSaleSelect"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column align="center" label="" min-width="280px">
                <template slot-scope="scope">
                  <el-form-item label="开户行: ">
                    <el-input size="mini" v-model="companyBankList[scope.$index].bankBranchName" placeholder="请精确到支行信息" :disabled="directSaleSelect"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="" width="90px">
                <template slot-scope="scope">
                  <span @click="addRow" class="button" :class="{'direct-sale':directSaleSelect}"><i class="icon el-icon-plus"></i></span>
                  <span @click="removeRow(scope.$index)" class="button" :class="{'direct-sale':directSaleSelect}"><i class="icon el-icon-minus"></i></span>
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
          <div class="tip">
            <span>温馨提示: </span>
            <div class="message">
              <p>1. 上传前，请把图片处理成透明无底色,<span>不抠图</span>；</p>
              <p>2. 请使用<span>jpg</span>或者<span>png</span>格式的图片，大小不超过<span>5M</span>；</p>
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitConfirm">确定</el-button>
      </div>
    </el-dialog>
    <!-- 查看 弹出框 -->
    <el-dialog
    title="详情信息"
    :visible.sync="dialogViewVisible"
    width="740px"
    :before-close="handleClose"
    class="dialog-info">
    <div class="view-content">
      <p>汉街二店</p>
      <div>
        <span>法人信息</span>
        <p><span>法人姓名: {{ companyForm.lepName }}</span><span>法人手机号码: {{ companyForm.lepPhone }}</span></p>
        <p><span>证件类型: {{ companyForm.lepDocumentType }}</span><span>证件号: {{ companyForm.lepDocumentCard }}</span></p>
      </div>
      <div>
        <span>营业执照信息</span>
        <p v-if="creditCodeShow">统一社会信用代码: {{ documentCard.creditCode }}</p>
        <p v-if="icRegisterShow"><span>工商注册号: {{ documentCard.icRegisterCode }}</span><span>组织机构代码: {{ documentCard.organizationCode }}</span></p>
        <p v-if="icRegisterShow">税务登记证: {{ documentCard.taxRegisterCode }}</p>
      </div>
      <div>
        <span>电子签章信息</span>
        <div class="stamp">
          <span>合同章: </span>
          <div><img :src="companyForm.contractSign" alt=""></div>
        </div>
        <div class="stamp">
          <span>财务章: </span>
          <div><img :src="companyForm.financialSign" alt=""></div>
        </div>
      </div>
    </div>
    </el-dialog>
  </div>
</template>

<script>
  import ScreeningTop from '@/components/ScreeningTop';
  import {MIXINS} from "@/assets/js/mixins";
  let obj1 = {
    cityId: "",
    cityName: "",
    storeId: "",
    storeName: "",
    cooperationMode: "",
    name: "",
    lepName: "",
    lepDocumentType: "",
    lepDocumentCard: "",
    lepPhone: "",
    documentType: "",
    contractSign: "",
    financialSign: "",
  }
  let obj2 = {
    creditCode: "",
    icRegisterCode: "",
    organizationCode: "",
    taxRegisterCode: ""
  }
  let arr = [
    {
      bankBranchName: '',
      bankAccountName: '',
      bankCard: ''
    }
  ]
  export default {
    name: "company",
    mixins: [MIXINS],
    data() {
      return {
        // 搜索表单中的数据
        searchForm: {
          cityId: "",
          storeId: "",
          cooperationMode: "",
          bankCard: "",
          keyword: ""
        },
        cityList: [],
        storeList: [],
        searchTime: [],
        tableData: [], //公司设置列表
        pageSize: 5,
        pageNum: 1,
        count: 0,
        AddEditVisible: false, //新增编辑公司信息 弹出框
        companyFormTitle: "", //新增编辑弹出框 标题
        companyForm: {}, //新增和编辑表单
        documentCard: {}, //营业执照信息
        companyBankList: [], //银行账户集合
        delIds: [],
        directInfo: {}, //直营属性证件信息
        directSaleSelect: false,
        directSaleOut: false,
        dialogViewVisible: false, //查看弹出框
        creditCodeShow: false,
        icRegisterShow: false,
        dictionary: {
          '38':'',
          '39':'',
          '40':''
        }
      }
    },
    created() {
      this.getCompanyList()
      this.selectDirectInfo()
      this.initFormList()
      this.$ajax.get('/api/organize/cities').then(res => {
        res = res.data
        if(res.status === 200) {
          this.cityList = res.data
        }
      })
      this.getDictionary()
      console.log(this.dictionary['38'],this.dictionary['39'],this.dictionary['40']);
    },
    methods: {
      // 初始化表单 数组集合
      initFormList() {
        this.companyForm = JSON.parse(JSON.stringify(obj1))
        this.documentCard = JSON.parse(JSON.stringify(obj2))
        this.companyBankList = JSON.parse(JSON.stringify(arr))
      },
      /**
       * 获取公司设置列表
       */
      getCompanyList: function () {
        let param = {
          cityId: this.searchForm.cityId,
          keyword: this.searchForm.keyword,
          storeId: this.searchForm.storeId,
          cooperationMode: this.searchForm.cooperationMode,
          bankCard: this.searchForm.bankCard,
          startTime: this.searchTime[0],
          endTime: this.searchTime[1],
          pageSize: this.pageSize,
          pageNum: this.pageNum
        }
        this.$ajax.get('/api/setting/company/list', param).then(res => {
          res = res.data
          if(res.status === 200) {
            this.tableData = res.data.list
            this.count = res.data.total
          }
        }).catch(error => {
          console.log(error);
        })
      },
      getStoreList(val) {
        let param = {
          cityId: val,
          keyWord: ""
        }
        this.$ajax.get('/api/organize/deps', param).then(res => {
          res = res.data
          if(res.status === 200) {
            this.storeList = res.data
          }
        })
        this.companyForm.cityId = val
        this.cityList.forEach(item => {
          if(val === item.id) {
            this.companyForm.cityName = item.name
          }
        })
        this.companyForm.storeId = ""
      },
      storeSelect(val) {
        console.log(val,123);
      },
      //关闭模态窗
      handleClose(done) {
        this.creditCodeShow = false
        this.icRegisterShow = false
        done()
      },
      addCompany() {
        this.AddEditVisible = true
        this.companyFormTitle = "添加企业信息"
        this.initFormList()
        this.directSaleSelect = false
        this.directSaleOut = false
      },
      //切换到直营属性时,自动带出证件信息
      selectDirectInfo() {
        this.$ajax.get('/api/setting/company/selectDirectInfo').then(res => {
          res = res.data
          if(res.status === 200) {
            this.directInfo = res.data
          }
        })
      },
      //合作方式选择
      cooModeChange(val) {
        if(val === 1) {
          this.directSaleSelect = true
          this.companyForm.lepName = this.directInfo.lepName
          this.companyForm.lepDocumentType = this.directInfo.lepDocumentType.value.toString()
          this.companyForm.lepDocumentCard = this.directInfo.lepDocumentCard
          this.companyForm.lepPhone = this.directInfo.lepPhone
          this.companyForm.documentType = this.directInfo.documentType.value.toString()
          this.icRegisterShow = true
          this.documentCard = this.directInfo.documentCard
          this.companyBankList = this.directInfo.companyBankList
        } else {
          this.directSaleSelect = false
          for(let key in this.companyForm) {
            if(
              key === "lepName" || key === "lepDocumentType" ||
              key === "lepDocumentCard" || key === "lepPhone" ||
              key === "documentType"
              )
            {
              this.companyForm[key] = ""
            }
          }
          this.icRegisterShow = false
          this.documentCard = JSON.parse(JSON.stringify(obj2))
          this.companyBankList = JSON.parse(JSON.stringify(arr))
        }
      },
      //企业证件选择
      documentTypeChange(val) {
        if(val === 2) {
          this.creditCodeShow = false
          this.icRegisterShow = true
        } else {
          this.icRegisterShow = false
          this.creditCodeShow = true
        }
      },
      addRow() {
        let row = {
          bankName: '',
          bankAccountName: '',
          bankCard: ''
        }
        this.companyBankList.push(row)
      },
      removeRow(index) {
        this.delIds.push(JSON.stringify(this.companyBankList[index].id))
        this.companyBankList.splice(index,1)
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
      submitConfirm() {
        this.storeList.forEach(item => {
          if(this.companyForm.storeId === item.id) {
            this.companyForm.storeName = item.name
          }
        })
        let obj = {
          companyBankListStr: JSON.stringify({data: this.companyBankList})
        }
        let param = {
          documentCardStr: JSON.stringify(this.documentCard)
        }
        param = Object.assign({},this.companyForm,obj,param)
        if(this.companyFormTitle === "添加企业信息") {
          this.$ajax.post('/api/setting/company/insert',param).then(res => {
            res = res.data
            if(res.status === 200) {
              this.AddEditVisible = false
              this.directSaleSelect = false
              this.$message(res.message)
              this.getCompanyList()
            }
          }).catch(error => {
            console.log(error);
          })
        } else {
          let obj = {
            delIds: this.delIds
          }
          param = Object.assign({},param,obj)
          this.$ajax.put('/api/setting/company/update',param).then(res => {
            res = res.data
            if(res.status === 200) {
              this.AddEditVisible = false
              this.$message(res.message)
              this.getCompanyList()
            }
          }).catch(error => {
            console.log(error);
          })
        }
      },
      //点击查看和编辑
      viewEditCompany(row, type) {
        if(type === 'init') {
          this.dialogViewVisible = true
        } else {
          this.AddEditVisible = true
          this.companyFormTitle = "编辑企业信息"
          if(row.cooperationMode.value === 1) {
            this.directSaleSelect = true
            this.directSaleOut = true
          } else {
            this.directSaleSelect = false
            this.directSaleOut = false
          }
        }
        if(row.documentType.value === 2) {
          this.icRegisterShow = true
          this.creditCodeShow = false
        } else {
          this.icRegisterShow = false
          this.creditCodeShow = true
        }
        this.documentCard = JSON.parse(JSON.stringify(row.documentCard))
        this.companyBankList = JSON.parse(JSON.stringify(row.companyBankList))
        let currentRow = JSON.parse(JSON.stringify(row))
        let newForm = {
          id: currentRow.id,
          cityId: currentRow.cityId,
          cityName: currentRow.cityName,
          storeId: currentRow.storeId,
          storeName: currentRow.storeName,
          cooperationMode: currentRow.cooperationMode.value,
          name: currentRow.name,
          lepName: currentRow.lepName,
          lepDocumentType: currentRow.lepDocumentType.value,
          lepDocumentCard: currentRow.lepDocumentCard,
          lepPhone: currentRow.lepPhone,
          documentType: currentRow.documentType.value,
          contractSign: currentRow.contractSign ? currentRow.contractSign : "",
          financialSign: currentRow.financialSign ? currentRow.financialSign : "",
        }
        this.companyForm = newForm
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getCompanyList()
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getCompanyList()
      },
      queryFn() {
        this.getCompanyList()
      },
      resetFormFn() {
        for(let key in this.searchForm) {
          this.searchForm[key] = ""
        }
        this.searchTime = []
      }
    }
}
</script>

<style lang="less" scoped>
@import "~@/assets/common.less";
.form-head {
  padding: 10px 0;
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
  margin-top: 20px;
  > p {
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 18px;
    > .el-button {
      width:119px;
      height:36px;
      border-radius:18px;
    }
  }
  .el-pagination {
    height: 60px;
    padding-top: 15px;
    text-align: center;
  }
}
.dialog-info {
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
            margin-bottom: 5px;
            /deep/ .el-input {
              .el-input__inner {
                height: 32px!important;
              }
            }
          }
          &:nth-child(-n+3) {
            /deep/ .el-input {
              width: 230px;
            }
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
        .direct-sale { display: none; }
        &.el-table tr:first-child td:last-child {
          span:last-child {
            display: none;
          }
        }
      }
      /deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
        background-color: #fff!important;
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
            margin-top: 20px;
            > ul {
              display: flex;
              li {
                width: 160px;
                height: 160px;
                background-color: rgba(236,238,241,1);
                border:2px dashed rgba(198,203,209,1);
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
                  font-size: 117px;
                  color:rgba(217,219,221,1);
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
          width: 160px;
          height: 160px;
          background-color: rgba(236,238,241,1);
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