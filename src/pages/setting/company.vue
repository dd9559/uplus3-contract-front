<template>
  <div class="view-container">
    <!-- 头部表单 -->
    <ScreeningTop
    @propQueryFn="queryFn"
    @propResetFormFn="resetFormFn">
      <el-form :inline="true" :model="searchForm" class="form-head" size="small">
        <el-form-item label="城市">
          <el-select v-model="searchForm.cityId" filterable @change="getStoreList" :clearable="true">
            <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.cityId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店选择">
          <el-select v-model="searchForm.storeId" filterable :clearable="true">
            <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合作方式">
          <el-select v-model="searchForm.cooperationMode" :clearable="true">
            <el-option v-for="item in dictionary['39']" :key="item.key" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="银行账户">
          <el-input v-model="searchForm.bankCard" :clearable="true" type="number" oninput="if(value.length>16)value=value.slice(0,16)" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
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
          <el-input v-model="searchForm.keyword" maxlength="50" placeholder="添加人/开户行/开户名" :clearable="true"></el-input>
        </el-form-item>
      </el-form>
    </ScreeningTop>
    <!-- table表格 -->
    <div class="company-list">
      <p>
        <span><i class="iconfont icon-tubiao-11 mr-8"></i>数据列表</span>
        <el-button @click="addCompany" icon="el-icon-plus">公司信息</el-button>
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
            <p v-for="(item,index) in scope.row.companyBankList" :key="index">{{ item.bankCard|formatBankCard }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="合作方式" prop="cooperationMode.label" width="150">
        </el-table-column>
        <el-table-column align="center" label="添加时间" prop="createTime" width="208">
          <template slot-scope="scope">
            <span>{{scope.row.createTime|formatDate(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="添加人" prop="createByName" width="150">
        </el-table-column>
        <el-table-column align="center" label="操作" width="260">
          <template slot-scope="scope">
            <el-button type="text" @click="viewEditCompany(scope.row,'init')" size="medium">查看</el-button>
            <el-button type="text" @click="viewEditCompany(scope.row,'edit')" size="medium">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="tableData.length"
        class="pagination-info"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="count">
      </el-pagination>
    </div>
    <!-- 添加和编辑公司信息 弹出框 -->
    <el-dialog
    :closeOnClickModal="$tool.closeOnClickModal"
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
                <el-input size="mini" type="number" oninput="if(value.length>18)value=value.slice(0,18)" v-model="companyForm.lepDocumentCard" :disabled="directSaleSelect" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
              </el-form-item>
              <el-form-item label="法人手机号码: ">
                <el-input size="mini" type="number" oninput="if(value.length>11)value=value.slice(0,11)" v-model="companyForm.lepPhone" :disabled="directSaleSelect" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
              </el-form-item>
              <el-form-item label="企业证件: ">
                <el-select placeholder="请选择" size="mini" v-model="companyForm.documentType" @change="documentTypeChange" :disabled="directSaleSelect">
                  <el-option v-for="item in dictionary['38']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item label="统一社会信用代码: " v-if="creditCodeShow">
                <el-input size="mini" v-model="documentCard.creditCode" :disabled="directSaleSelect"></el-input>
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
            <div class="tip tip-top">
              <span>温馨提示: </span>
              <div class="message">
                <p>1. 门店名称必须和营业执照证件上登记的名称一致；</p>
                <p>2. 如个体工商户在营业执照上无企业名称的，请填“经营者”名字；</p>
                <p>3. 三证合一企业证件，只需要填写“统一社会信用代码”；老三证，请分别填写工商注册号、组织机构代码、税务登记证</p>
              </div>
            </div>
          </div>
          <div class="notice" v-show="noticeShow"><i class="el-icon-info notice-icon"></i>门店信息已经录入，请选择其他门店</div>
        </div>
        <div class="company-info">
          <p>添加企业银行账户</p>
          <div class="info-content">
            <el-table style="width: 100%" :data="companyBankList" class="addBankRow">
              <el-table-column width="260px" align="center" label="">
                <template slot-scope="scope">
                  <el-form-item label="开户名: ">
                    <el-input size="mini" maxlength="15" v-model="companyBankList[scope.$index].bankAccountName" :disabled="directSaleSelect"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column width="270px" align="center" label="">
                <template slot-scope="scope">
                  <el-form-item label="银行账户: ">
                    <el-input size="mini" type="number" oninput="if(value.length>16)value=value.slice(0,16)" v-model="companyBankList[scope.$index].bankCard" :disabled="directSaleSelect" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column align="center" label="" width="365px">
                <template slot-scope="scope">
                  <el-form-item label="开户行: ">
                    <el-input size="mini" v-model="companyBankList[scope.$index].bankBranchName" placeholder="请精确到支行信息" :disabled="directSaleSelect"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="" width="65px">
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
                  <li><fileUp id="imgcontract" class="up" :rules="['.png']" @getUrl="upload"><i>+</i></fileUp><p class="text">点击上传</p></li>
                  <li v-show="companyForm.contractSign!==''"><div @click="getPicture(1)"><upload-cell type=".png"></upload-cell></div><p class="pic-name">{{contractName}}</p><span class="del" @click="delStamp(1)"><i class="el-icon-close"></i></span></li>
                </ul>
              </div>
            </div>
            <div class="stamp">
              <span>财务章上传</span>
              <div class="upload">
                <span>上传电子签章图片：</span>
                <ul>
                  <li><fileUp id="imgfinance" class="up" :rules="['.png']" @getUrl="upload"><i>+</i></fileUp><p class="text">点击上传</p></li>
                  <li v-show="companyForm.financialSign!==''"><div @click="getPicture(2)"><upload-cell type=".png"></upload-cell></div><p class="pic-name">{{financialName}}</p><span class="del" @click="delStamp(2)"><i class="el-icon-close"></i></span></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="tip">
            <span>温馨提示: </span>
            <div class="message">
              <p>请上传<span>png透明</span>格式的图片,大小不超过<span>5M</span>；</p>
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitConfirm">确定</el-button>
      </div>
      <preview :imgList="previewFiles" v-if="preview" @close="preview=false"></preview>
    </el-dialog>
    <!-- 查看 弹出框 -->
    <el-dialog
    :closeOnClickModal="$tool.closeOnClickModal"
    title="详情信息"
    :visible.sync="dialogViewVisible"
    width="740px"
    :before-close="handleClose"
    class="dialog-info">
    <div class="view-content">
      <p>{{companyForm.storeName}}</p>
      <div>
        <span>法人信息</span>
        <p><span>法人姓名: {{ companyForm.lepName }}</span><span>法人手机号码: {{ companyForm.lepPhone }}</span></p>
        <p><span>证件类型: {{ companyForm.lepDocumentType }}</span><span class="card-no">证件号: {{ companyForm.lepDocumentCard }}</span></p>
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
          <div @click="getPicture(1)"><upload-cell type=".png" class="picture" v-show="companyForm.contractSign!==''"></upload-cell></div>
        </div>
        <div class="stamp">
          <span>财务章: </span>
          <div @click="getPicture(2)"><upload-cell type=".png" class="picture" v-show="companyForm.financialSign!==''"></upload-cell></div>
        </div>
      </div>
    </div>
    <preview :imgList="previewFiles" v-if="preview" @close="preview=false"></preview>
    </el-dialog>
  </div>
</template>

<script>
  import {MIXINS} from "@/assets/js/mixins";
  const rule = {
    cityId: {
      name: "城市选择"
    },
    storeId: {
      name: "门店选择"
    },
    cooperationMode: {
      name: "合作方式"
    },
    name: {
      name: "门店名称"
    },
    lepName: {
      name: "法人姓名"
    },
    lepDocumentType: {
      name: "证件类型"
    },
    lepDocumentCard: {
      name: "证件号",
      type: "idCard"
    },
    lepPhone: {
      name: "法人手机号码",
      type: "mobile"
    },
    documentType: {
      name: "企业证件"
    },
    contractSign: {
      name: "合同章上传"
    },
    financialSign: {
      name: "财务章上传"
    }
  }
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
          cityId: "武汉",
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
        noticeShow: false,
        dictionary: {
          '38':'',
          '39':'',
          '40':''
        },
        contractName: "",
        financialName: "",
        imgList: []
      }
    },
    created() {
      this.getCompanyList()
      this.selectDirectInfo()
      this.initFormList()
      this.getCityList()
      this.getDictionary()
      this.getStoreList()
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
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          startTime: this.searchTime[0],
          endTime: this.searchTime[1]
        }
        param = Object.assign({},this.searchForm,param)
        param.cityId = param.cityId === "武汉" ? 1 : param.cityId
        this.$ajax.get('/api/setting/company/list', param).then(res => {
          res = res.data
          if(res.status === 200) {
            this.tableData = res.data.list
            this.count = res.data.total
          }
        }).catch(error => {
            this.$message({message:error})
        })
      },
      getCityList() {
        this.$ajax.get('/api/organize/cities').then(res => {
          res = res.data
          if(res.status === 200) {
            this.cityList = res.data
          }
        }).catch(error => {
          this.$message({message:error})
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
        }).catch(error => {
          this.$message({message:error})
        })
        this.cityList.find(item => {
          if(val === item.id) {
            this.companyForm.cityName = item.name
          }
        })
        this.companyForm.storeId = ""
      },
      storeSelect(val) {
        this.$ajax.get('/api/setting/company/checkStore', { storeId: val }).then(res => {
          res = res.data
          if(res.status === 200) {
            this.storeList.find(item => {
              if(item.id === val) {
                this.companyForm.storeName = item.name
              }
            })
          }
        }).catch(error => {
          this.noticeShow = true
          setTimeout(() => {
            this.noticeShow = false
          }, 2000)
        })
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
        }).catch(error => {
            this.$message({message:error})
        })
      },
      //合作方式选择
      cooModeChange(val) {
        if(val === 1) {
          this.directSaleSelect = true
          this.companyForm.lepName = this.directInfo.lepName
          this.companyForm.lepDocumentType = this.directInfo.lepDocumentType.value
          this.companyForm.lepDocumentCard = this.directInfo.lepDocumentCard
          this.companyForm.lepPhone = this.directInfo.lepPhone
          this.companyForm.documentType = this.directInfo.documentType.value
          if(this.companyForm.documentType === 2) {
            this.icRegisterShow = true
            this.creditCodeShow = false
          } else {
            this.creditCodeShow = true
            this.icRegisterShow = false
          }
          this.documentCard = this.directInfo.documentCard
          this.companyBankList = this.directInfo.companyBankList
        } else {
          this.directSaleSelect = false
          for(let key in this.companyForm)
          {
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
          this.creditCodeShow = false
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
      upload(obj) {
        if(obj.btnId === "imgcontract") {
          this.companyForm.contractSign = obj.param[0].path+`?${obj.param[0].name}`
          this.contractName = obj.param[0].name
        } else {
          this.companyForm.financialSign = obj.param[0].path+`?${obj.param[0].name}`
          this.financialName = obj.param[0].name
        }
      },
      delStamp(type) {
        type === 1 ? this.companyForm.contractSign = "" : this.companyForm.financialSign = ""
      },
      submitConfirm() {
        this.$tool.checkForm(this.companyForm,rule).then(() => {
          let isOk
          this.companyBankList.forEach(item => {
            isOk = false
            if(item.bankAccountName) {
              if(item.bankCard.length === 16) {
                if(item.bankBranchName) {
                  isOk = true
                } else {
                  this.$message({message: "开户行不能为空"})
                }
              } else {
                this.$message({message: "银行账户位数不正确"})
              }
            } else {
              this.$message({message: "开户名不能为空"})
            }
          })
          let obj = {
            companyBankList: this.companyBankList
          }
          let param = {
            documentCard: this.documentCard
          }
          param = Object.assign({},this.companyForm,obj,param)
          if(isOk) {
            if(this.companyFormTitle === "添加企业信息") {
              this.$ajax.postJSON('/api/setting/company/insert',param).then(res => {
                res = res.data
                if(res.status === 200) {
                  this.AddEditVisible = false
                  this.directSaleSelect = false
                  this.$message(res.message)
                  this.getCompanyList()
                }
              }).catch(error => {
                  this.$message({message:error})
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
                  this.$message({message:error})
              })
            }
          }
        }).catch(error => {
          this.$message({message:error})
        })
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
        this.contractName = currentRow.contractSign.split('?')[1]
        this.financialName = currentRow.financialSign.split('?')[1]
        let newForm = {
          id: currentRow.id,
          cityId: currentRow.cityId,
          cityName: currentRow.cityName,
          storeId: currentRow.storeId,
          storeName: currentRow.storeName,
          cooperationMode: currentRow.cooperationMode.value,
          name: currentRow.name,
          lepName: currentRow.lepName,
          lepDocumentType: type === 'init' ? currentRow.lepDocumentType.label :currentRow.lepDocumentType.value,
          lepDocumentCard: currentRow.lepDocumentCard,
          lepPhone: currentRow.lepPhone,
          documentType: currentRow.documentType.value,
          contractSign: currentRow.contractSign,
          financialSign: currentRow.financialSign
        }
        this.companyForm = newForm
      },
      getPicture(type) {
        this.imgList = []
        let pic1 = this.companyForm.contractSign
        let pic2 = this.companyForm.financialSign
        if(type === 1) {
          if(pic2 === "") {
            this.imgList.push(pic1.split('?')[0])
          } else {
            this.imgList.push(pic1.split('?')[0],pic2.split('?')[0])
          }
        } else if(type === 2) {
          if(pic1 === "") {
            this.imgList.push(pic2.split('?')[0])
          } else {
            this.imgList.push(pic2.split('?')[0],pic1.split('?')[0])
          }
        }
        console.log(this.imgList);
        this.fileSign(this.imgList)
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
        this.$tool.clearForm(this.searchForm)
        this.searchTime = []
      }
    },
    filters: {
      formatBankCard(val) {
        return val.replace(/[\s]/g, '').replace(/(\d{4})(?=\d)/g, "$1 ")
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
  .el-form-item {
    margin-bottom: @margin-10;
  }
  .el-form-item:nth-child(-n+3) {
    margin-right: 50px;
    /deep/ .el-input {
      width: 180px;
    }
  }
  .el-form-item:last-child {
    /deep/ .el-input {
      width: 226px;
    }
  }
}
.company-list {
  background-color: #fff;
  padding: 0 10px;
  margin-top: 20px;
  > p {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
    font-size: @size-14;
    .mr-8 {
      margin-right: 8px;
    }
    > .el-button {
      width:100px;
      padding: 9px 15px;
      border-radius:18px;
      display: flex;
      justify-content: center;
      background-color: #478DE3;
      color: #fff;
    }
  }
}
.dialog-info {
  .company-info {
    padding: 30px 20px;
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
      &-top {
        margin-top: 20px;
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
      /deep/ .notice {
        width: 342px;
        height: 56px;
        background-color: #000;
        position: fixed;
        left: 40%;
        top: 5%;
        border-radius: 4px;
        display: flex;
        align-items: center;
        color: #fff;
        justify-content: center;
        &-icon {
          margin-right: 10px;
          margin-top: 2px;
          &::before {
            color: red;
          }
        }
      }
    }
    &:nth-child(2) {
      border-top: 1px solid #edecf0;
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
        .direct-sale {
          display: none;
        }
        /deep/ .el-input {
          height: 32px;
          .el-input__inner {
            height: 32px;
          }
        }
        &.el-table {
          tr:first-child td:last-child {
            span:last-child {
              display: none;
            }
          }
          /deep/ .cell {
            padding: 0;
          }
          tr td:nth-child(3) {
            .el-form-item {
              box-sizing: border-box;
              .el-input {
                width: 300px;
              }
            }
          }
        }
      }
      /deep/ .el-table::before {
        display: none;
      }
      /deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
        background-color: #fff!important;
      }
      /deep/ .el-table td { border: 0; padding: 0; }
    }
    &:last-child {
      border-top: 1px solid #edecf0;
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
                width: 120px;
                height: 120px;
                border:1px dashed #DEDDE2;
                border-radius: 4px;
                margin-right: 10px;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                > img {
                  width: 60px;
                  height: 60px;
                  border-radius: 4px;
                }
                .text {
                  position: absolute;
                  font-size: @size-base;
                  bottom: 10px;
                  color: #233241;
                }
                .pic-name {
                  position: absolute;
                  font-size: @size-base;
                  bottom: -25px;
                  color: #233241;
                  width: 120px;
                  height: 48px;
                  text-align: center;
                  z-index: 10;
                  word-wrap: break-word;
                }
                .del {
                  position: absolute;
                  display: inline-block;
                  width: 20px;
                  height: 20px;
                  background-color: #F56C6C;
                  border-radius: 50%;
                  right: 8px;
                  top: 8px;
                  text-align: center;
                  line-height: 20px;
                  color: #fff;
                }
                &:first-child {
                  .up {
                    width: 50px;
                    height: 50px;
                    background-color: #EEF2FB;
                    line-height: 50px;
                    text-align: center;
                  }
                  i {
                    font-size: 56px;
                    color:#fff;
                  }
                }
                &:last-child {
                  border: none;
                  background-color: #F2F3F8;
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
        .card-no {
          padding-left: 84px;
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
          position: relative;
          border-radius: 8px;
          /deep/ .picture {
            position: absolute;
            top: -6px;
            font-size: 160px!important;
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
  border-bottom: 1px solid rgba(237,236,240,1);
}
/deep/ .el-table th {
  background:rgba(238,242,251,1);
}
/deep/ .el-dialog__body {
  padding: 0;
}
</style>
