<template>
  <div class="view-container" ref="tableComView">
    <div>
      <!-- 头部表单 -->
      <ScreeningTop
      @propQueryFn="queryFn"
      @propResetFormFn="resetFormFn">
        <el-form :inline="true" :model="searchForm" class="form-head" size="small">
          <el-form-item label="关键字">
            <el-input v-model="searchForm.keyword" style="width:220px" maxlength="50" placeholder="支持输入企业名称/银行卡号" :clearable="true"></el-input>
          </el-form-item>
          <el-form-item label="账户类型">
            <el-select v-model="searchForm.type" :clearable="true">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in bankType" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="认证状态">
            <el-select v-model="searchForm.verifyState" :clearable="true" class="w180">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in verifyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="授权状态">
          <el-select v-model="searchForm.warrantState" :clearable="true">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in warrantList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="门店选择">
            <el-select v-model="searchForm.dept" filterable collapse-tags remote placeholder="请输入" :clearable="true" @clear="homeStoreList = []" class="headerDep"  style="width:230px" :remote-method="remoteMethod1">
              <el-option v-for="item in homeStoreList" :key="item.id" :title="item.name" :label="item.name" :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </ScreeningTop>
      <!-- table表格 -->
      <div class="company-list">
        <p v-if="power['sign-set-gs'].state">
            <span><i class="iconfont icon-tubiao-11 mr-8"></i>数据列表</span>
            <span>
              <el-button @click="addDep" type="primary">绑定门店</el-button>
              <el-button @click="addCompany" icon="el-icon-plus" type="primary">公司信息</el-button>
            </span>
        </p>
        <el-table :data="tableData" style="width: 100%" border ref="tableCom" :max-height="tableNumberCom">
          <el-table-column label="企业名称" prop="name" min-width="90">
          </el-table-column>
          <el-table-column label="认证状态" min-width="50">
            <template slot-scope="scope">
              <p>{{verifyList.filter(item=>item.id == scope.row.verifyState).length>0?verifyList.filter(item=>item.id == scope.row.verifyState)[0].name:'-'}}</p>
            </template>
          </el-table-column>
          <el-table-column label="授权状态" min-width="50">
            <template slot-scope="scope">
              <p>{{warrantList.filter(item=>item.id == scope.row.warrantState).length>0?warrantList.filter(item=>item.id == scope.row.warrantState)[0].name:'-'}}</p>
            </template>
          </el-table-column>
          <el-table-column label="录入时间" prop="createTime" min-width="60">
            <template slot-scope="scope">
              <span>{{(scope.row.updateTime ? scope.row.updateTime : scope.row.createTime)|formatDate(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="录入人">
            <template slot-scope="scope">
              <span>{{scope.row.deptName + ' ' + scope.row.createByName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="viewEditCompany(scope.row,'init')" size="medium" v-if="power['sign-set-gs'].state">查看</el-button>
              <el-button type="text" class="edit-btn" @click="viewEditCompany(scope.row,'edit')" size="medium" v-if="power['sign-set-gs'].state && (scope.row.verifyState == 0 ||scope.row.verifyState == 2 ||scope.row.verifyState == 1)">认证</el-button>
              <el-button type="text" class="edit-btn" @click="viewEditCompany(scope.row,'edit')" size="medium" v-if="power['sign-set-gs'].state &&editBtnShow(scope.row) && scope.row.verifyState == 3">编辑</el-button>
              <el-button type="text" class="edit-btn" @click="listConfirm(scope.row)" size="medium" v-if="power['sign-set-gs'].state && (scope.row.warrantState == 0 ||scope.row.warrantState == 2 ||scope.row.warrantState == 1) && scope.row.verifyState == 3">授权</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-show="tableData.length"
          class="pagination-info"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="count">
        </el-pagination>
      </div>
      <!-- 查看 弹出框 -->
      <el-dialog
      :closeOnClickModal="$tool.closeOnClickModal"
      :close-on-press-escape="$tool.closeOnClickModal"
      :visible.sync="dialogViewVisible"
      width="740px"
      :before-close="handleClose"
      :destroy-on-close="true"
      class="dialog-info lock-dialog">
      <div slot="title" class="title-class-box">
        <span :class="tabTitleIndex ===1 ? 'current' : ''" @click="clickTitle(1)">公司信息</span>
        <span :class="tabTitleIndex ===2 ? 'current' : ''" @click="clickTitle(2)">门店信息</span>
      </div>
      <div v-show="tabTitleIndex ===1">
        <div class="view-content">
          <p class="title">企业信息</p>
          <ul class="content-box">
            <li class="content-item">
              <span>企业名称：</span>
              <span>{{companyForm.name}}</span>
            </li>
            <li class="content-item">
              <span>企业地址：</span>
              <span>{{companyForm.address}}</span>
            </li>
            <li class="content-item">
              <span>统一社会信用代码：</span>
              <span>{{companyForm.documentCard}}</span>
            </li>
          </ul>
          
          <p class="title">法人信息</p>
          <ul class="content-box">
            <li class="content-item">
              <span>法人姓名：</span>
              <span>{{companyForm.lepName}}</span>
            </li>
            <li class="content-item">
              <span>法人证件号码：</span>
              <span>{{companyForm.lepDocumentCard}}</span>
            </li>
            <li class="content-item">
              <span>法人手机号码：</span>
              <span>{{companyForm.lepPhone}}</span>
            </li>
          </ul>

          <p class="title">银行信息</p>
          <ul class="content-box">
            <li class="content-item margin" v-for="(item,index) of companyForm.entBankList" :key="index">
              <div class="bank-item">
                <span>账户类型:</span>
                <span>{{item.type == 0 ? '个人账户' : '企业账户'}}</span>
              </div>
              <div class="bank-item">
                <span>开户银行名称：</span>
                <span>{{item.bankName}}</span>
              </div>
              <div class="bank-item" v-if="item.type == 1">
                <span>支行名称：</span>
                <span>{{item.bankBranchName ? item.bankBranchName : '-'}}</span>
              </div>
              <div class="bank-item" v-if="item.type == 1">
                <span>支付行号：</span>
                <span>{{item.bankBranchCode ? item.bankBranchCode : '-'}}</span>
              </div>
              <div class="bank-item" v-if="item.type == 0">
                <span>开户名：</span>
                <span>{{item.bankAccountName ? item.bankAccountName : '-'}}</span>
              </div>
              <div class="bank-item">
                <span>银行卡号：</span>
                <span>{{item.bankCard}}</span>
              </div>
            </li>
          </ul>

          
          <p>{{companyForm.storeName}}</p>
          <div>
            <p class="title">其它信息</p>
            <div class="stamp">
              <span>合同章: </span>
              <div @click="getPicture(1)"><img :src="preConFile[0]" alt="" width="120px" height="120px"></div>
            </div>
            <div class="stamp">
              <span>财务章: </span>
              <div @click="getPicture(2)"><img :src="preFinFile[0]" alt="" width="120px" height="120px"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="dep-container" v-show="tabTitleIndex ===2">
        <div class="dep-search">
          <span>门店搜索</span>
           <el-input v-model="deptName" style="width:220px" placeholder="请输入" :clearable="true" @clear="deptName = ''"></el-input>
           <el-button @click="getSearchDepTableData('search')" type="primary">查询</el-button>
        </div>
        <div class="dep-content">
          <div class="title">
            <span>企业名称：</span>
            <span>{{companyForm.name}}</span>
          </div>
          <el-table :data="searchDepTableData" v-loadmore="lazyLoad" style="width: 100%" border :max-height="445">
          <el-table-column label="企业管理费" prop="platformFeeRatio" width="90">
            <template slot-scope="scope">
              <span>{{scope.row.platformFeeRatio}}%</span>
            </template>
          </el-table-column>
          <el-table-column label="门店名称" prop="name" width="300">
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button type="text" @click="clickOpen(scope.row)" size="medium" v-if="power['sign-set-gs'].state">解绑</el-button>
            </template>
          </el-table-column>
        </el-table>
        </div>
      </div>
      <preview :imgList="previewFiles" v-if="preview" @close="preview=false"></preview>
      </el-dialog>
      <el-dialog
      title="解除绑定"
      :closeOnClickModal="$tool.closeOnClickModal"
      :visible.sync="dialogRelieveVisible"
      width="460px"
      class="relieve-dialog">
      <div>确定是否解除与<span class="text">{{companyForm.name}}</span>的关系</div>
      <div slot="footer">
        <el-button type="primary" round @click="submitRelieve">确认</el-button>
      </div>
      </el-dialog>
      <el-dialog
      title="绑定门店"
      :closeOnClickModal="$tool.closeOnClickModal"
      :visible.sync="dialogRDepisible"
      width="740px"
      class="dep-dialog">
      <div class="dep-content">
        <div class="item">
          <span class="required">企业名称</span>
           <el-select v-model="bindForm.companyId" filterable remote :clearable="true" placeholder="请输入" @clear="companyList = []" loading-text="正在根据当前关键字搜索..." no-data-text="暂无匹配企业名称！" popper-class="hover-tip" class="headerDep" style="width:300px" :remote-method="filterMethod">
            <el-option v-for="item in companyList" :key="item.id" :title="item.name" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="item">
          <span class="required">企业管理费</span>
          <el-input style="width:120px;" type="number" size="mini" maxlength="15" v-model.trim="bindForm.platformFeeRatio" @input="inputOnly(100,'platformFeeRatio')"></el-input>
        </div>
        <div class="item">
          <span class="required">选择门店</span>
          <el-select v-model="bindDeptName" multiple filterable remote :clearable="true" @change="bindChange" placeholder="请输入" @clear="bdHomeStoreList = []" class="overflow headerDep" popper-class="select-popper"  style="width:300px" :remote-method="selectRemoteMethodDep">
            <el-option v-for="item in bdHomeStoreList" :key="item.depId" :title="item.name" :label="item.name" :value="JSON.stringify(item)">
            </el-option>
          </el-select>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="clickBind" type="primary" round>确认</el-button>
      </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {MIXINS} from "@/assets/js/mixins";
  import { mapMutations } from "vuex";
  let checkPhone = function (str) {
    return /^1[3456789]\d{9}$/.test(str)
  }
  let checkId = function (str) {
    return /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/.test(str)
  }
  let checkPassPort = function (str) {
    return /^1[45][0-9]{7}$|(^[P|p|S|s]\d{7}$)|(^[S|s|G|g|E|e]\d{8}$)|(^[Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|(^[H|h|M|m]\d{8,10}$)/.test(str)
  }
  let isHaveChinese = function (str) {
    return /[\u4E00-\u9FA5]/g.test(str)
  }
  export default {
    name: "company",
    mixins: [MIXINS],
    data() {
      return {
        cityId: "",
        cityName: "",
        deptName: '',
        bindDeptName: [],
        searchDepTableData: [],
        copySearchDepTableData: [],
        end: true,
        page: 1,
        relieveData: {},
        bindForm: {
          companyId: null,
          platformFeeRatio: null,
        },
        dialogRelieveVisible: false,
        dialogRDepisible: false,
        // 搜索表单中的数据
        searchForm: {
          dept: "",
          keyword: "",
          type: "",
          verifyState: "",
          warrantState: ""
        },
        verifyList: [ // 认证状态
          {
            id:0,
            name:"未认证"
          },
          {
            id:1,
            name:"认证中"
          },
          {
            id:3,
            name:"认证成功"
          },
        ],
        warrantList: [ // 授权状态
          {
            id:0,
            name:"未授权"
          },
          {
            id:1,
            name:"授权中"
          },
          {
            id:3,
            name:"授权成功"
          },
        ],
        homeStoreList: [],
        companyList: [],
        tableData: [], //公司设置列表
        pageSize: 50,
        pageNum: 1,
        count: 0,
        companyForm: {}, //新增和编辑表单
        delIds: [],
        dialogViewVisible: false, //查看弹出框
        tabTitleIndex: 1,
        dictionary: {
          '38':'企业证件',
          '39':'合作方式',
          '40':'证件类型'
        },
        contractName: "",
        financialName: "",
        bankType:[
          {
            label:'个人账户',
            value:'0'
          },
          {
            label:'企业账户',
            value:'1'
          }
        ],
        //权限配置
        power: {
          'sign-set-gs': {
            state: false,
            name: '添加公司信息'
          }
        },
        bdHomeStoreList:[],
        preConFile: [], //合同章缩略图
        preFinFile: [], //财务章缩略图
      }
    },
    mounted() {
      this.cityId = this.cityInfo.cityId
      this.cityName = this.cityInfo.cityName
      let res=this.getDataList
      if(res&&(res.route===this.$route.path)){
        this.tableData = res.data.list
        this.count = res.data.total
        let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
        this.searchForm = session.query
        delete this.searchForm.pageNum
        delete this.searchForm.pageSize
        this.pageNum = session.query.pageNum
      }else{
        // 列表查询
        this.getCompanyList()
      }
      // 枚举数据
      this.getDictionary()
    },
    directives: {
      loadmore: {
        bind(el, binding) {
          const selectWrap = el.querySelector('.el-table__body-wrapper')
          selectWrap.addEventListener('scroll', function() {
            let sign = 0
            const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
            if (scrollDistance <= sign) {
              binding.value()
            }
          })
        }
      }
    },
    watch: {
      deptName(val) {
        if (val === '') {
          this.page = 1
          this.end = true
          this.getSearchDepTableData()
        }
      }
    },
    methods: {
      filterMethod(val) {
        if(!val) return
        this.$ajax.get('/api/enterprise/all',{keyword: val}).then(res => {
          res = res.data
          if(res.status === 200) {
            this.companyList = res.data.list
          }
        }).catch(error =>{
          this.$message(res.message)
        })
      },
      // 绑定门店
      clickBind() {
        if (!this.bindForm.companyId || !this.bindForm.platformFeeRatio || this.bindDeptName.length === 0) {
          return this.$message({type:'warning',message:'请填写完整！'})
        }
        let param = {
          departmentList: this.bindDeptName.map(item => JSON.parse(item)),
          cityId:this.cityId.toString(),
          cityName:this.cityName
        }
        param = Object.assign(param,JSON.parse(JSON.stringify(this.bindForm)))
        
        this.$ajax.postJSON('/api/enterprise/dept_bind',param).then(res => {
          res = res.data
          if(res.status === 200) {
            this.$message({type:'success',message:res.message})
            this.dialogRDepisible = false
          }
        }).catch(error =>{
          this.$message(error)
        })
      },
      // 获取部门列表
      getDepList(keyword = '',type='bd') {
        if (!keyword) return
        let param = {keyword}
        this.$ajax.get('/api/enterprise/dept_all',param).then(res => {
          res = res.data
          if (res.status === 200) {
            if (type === 'search') {
              this.homeStoreList = res.data.list
            }
            this.bdHomeStoreList = res.data.list
          }
        }).catch(error => {
          this.$message(error)
        })
      },
      // 编辑按钮 显示隐藏
      editBtnShow(row) {
        if(row.version === 1) {
          // 旧版本四级门店不可编辑
          if(row.level != 4) {
            return true
          } else {
            return false
          }
        } else {
          // 新版本
          return true
        }
      },
      bindChange(data) {
        let copyData = JSON.parse(data[data.length-1])
        if (copyData.companyId) {
          this.$message(`${copyData.name}已被绑定`)
          this.bindDeptName.pop()
        }
      },
      selectRemoteMethodDep(query) {
        this.getDepList(query)
      },
      // 远程搜索
      remoteMethod1(query) {
        this.getDepList(query,'search')
      },
      // 初始化表单 数组集合
      initFormList() {
        this.companyForm = JSON.parse(JSON.stringify(obj1))
        this.companyForm.entBankList = new Array(JSON.parse(JSON.stringify(arr)))
      },
      // 获取公司设置列表
      getCompanyList: function (type="init") {
        let param = {
          pageSize: this.pageSize,
          pageNum: this.pageNum
        }
        param = Object.assign({},this.searchForm,param)

        //点击查询时，缓存筛选条件
        if(type==='search'||type==='pagination'){
          sessionStorage.setItem('sessionQuery',JSON.stringify({
            path:'/company',
            url:'/enterprise',
            query:Object.assign({},param),
            methods:"get"
          }))
        }

        this.$ajax.get('/api/enterprise', param).then(res => {
          res = res.data
          if(res.status === 200) {
            this.tableData = res.data.list
            this.count = res.data.total
          }
        }).catch(error => {
            this.$message({message:error})
        })
      },
      //关闭模态窗
      handleClose(done) {
        this.delIds = []
        this.searchDepTableData = []
        this.end = true
        this.page = 1
        done()
      },
      addDep() {
        this.bdHomeStoreList = []
        this.companyList = []
        this.dialogRDepisible = true
        this.bindForm.companyId = null 
        this.bindForm.platformFeeRatio = null 
        this.bindDeptName = []
      },
      addCompany() {
        this.$router.push({
          path: '/addCompany',
          query: {
            type: true
          }
        })
      },
      listConfirm(item){
        console.log(item);
        let param = {
          id: item.id,
          cityId: item.cityId,
          cityName: item.cityName,
          name: item.name,
          address: item.address,
          documentCard: item.documentCard,
          lepName: item.lepName,
          lepDocumentCard: item.lepDocumentCard,
          lepPhone: item.lepPhone,
          contractSign: item.contractSign,
          financialSign: item.financialSign,
          entBankList: item.entBankList,
          franchiseRatio: "",
          verifyState:item.verifyState,
          warrantState:item.warrantState
        }
        this.$ajax.put(`/api/enterprise`,param).then(res => {
          res = res.data
          if(res.status === 200) {
            this.$message("授权短信已发送，请及时授权！")
            this.getCompanyList()
            this.delIds = []
          }
        }).catch(error => {
            this.$message({message:error})
        })
      },
      clickOpen(data) {
        this.dialogRelieveVisible = true
        this.relieveData = data
      },
      submitRelieve () {
        this.$ajax.put(`/api/enterprise/dept_unbind`,{
          companyId: this.relieveData.entId,
          storeId: this.relieveData.depId
        }).then(res => {
          res = res.data
          if(res.status === 200) {
            this.searchDepTableData = this.searchDepTableData.filter(item => {
              return item.depId !== this.relieveData.depId
            })
            this.dialogRelieveVisible = false
            if (this.searchDepTableData.length === 0) {
              this.deptName = ''
            }
            this.$message({type:'success',message: res.message})
          }
        }).catch(error =>{
          this.$message(res.message)
        })
      },
      clickTitle(index) {
        this.tabTitleIndex = index
        if (index === 2) {
          this.end = true
        }
      },
      lazyLoad() {
        if(!this.end){
            return
        }
        if(this.page == 1){
            this.page++
        }
        this.$ajax.get('/api/enterprise/dept',{company_id: this.companyForm.id,keyword:this.deptName,pageNum:this.page}).then(res => {
          res = res.data
          if (res.status === 200) {
            if ((this.searchDepTableData.length + res.data.size) <= res.data.total) {
              this.page++
              this.searchDepTableData = this.searchDepTableData.concat(res.data.list)
            } else {
              this.end = false
            }
          }
        })
      },
      getSearchDepTableData(type = '') {
        if (type === 'search') {
          this.page = 1
          this.end = true
        }
        this.$ajax.get('/api/enterprise/dept',{company_id: this.companyForm.id,keyword:this.deptName,pageNum:this.page}).then(res => {
          res = res.data
          if (res.status === 200) {
            this.searchDepTableData = res.data.list
            this.dialogViewVisible = true
          }
        })
      },
      //点击查看和编辑
      viewEditCompany(row, type) {
        if(type === 'init') {
          this.searchDepTableData = []
          this.deptName = ''
          this.end = true
          this.page = 1
          this.tabTitleIndex = 1
        }
        let currentRow = JSON.parse(JSON.stringify(row))
        let newForm = {
          id: currentRow.id,
          cityId: currentRow.cityId,
          cityName: currentRow.cityName,
          name: currentRow.name,
          address: currentRow.address,
          documentCard: currentRow.documentCard,
          lepName: currentRow.lepName,
          lepDocumentCard: currentRow.lepDocumentCard,
          lepPhone: currentRow.lepPhone,
          contractSign: currentRow.contractSign,
          financialSign: currentRow.financialSign,
          entBankList: currentRow.entBankList,
          franchiseRatio: "",
          verifyState:currentRow.verifyState,
          warrantState:currentRow.warrantState
        }
        this.companyForm = newForm
        //获取电子章文件名和签名展示缩略图
        this.contractName = newForm.contractSign.split('?')[1]
        this.financialName = newForm.financialSign.split('?')[1]
        let arr1 = [newForm.contractSign.split('?')[0]]
        let arr2 = [newForm.financialSign.split('?')[0]]
        this.fileSign(arr1, 'preload').then(res => {
            this.preConFile = res
        })
        this.fileSign(arr2, 'preload').then(res => {
            this.preFinFile = res
        })
        if (type !== 'init') {
          this.setCompanyData(newForm)
          this.$router.push({
            path: '/addCompany',
            query: {
              type: false
            }
          })
        } else {
          this.getSearchDepTableData()
        }
      },
      // 合同章 财务章 点击预览
      getPicture(type) {
        let img_arr = []
        if(type === 1) {
          img_arr.push({path:this.companyForm.contractSign.split('?')[0],name:this.companyForm.contractSign.split('?')[1]})
        } else {
          img_arr.push({path:this.companyForm.financialSign.split('?')[0],name:this.companyForm.financialSign.split('?')[1]})
        }
        this.previewPhoto(img_arr,0)
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getCompanyList('pagination')
      },
      // 查询
      queryFn() {
        this.pageNum = 1
        this.getCompanyList('search')
      },
      // 筛选条件重置
      resetFormFn() {
        this.searchForm.type = ""
        this.searchForm.keyword = ""
        this.searchForm.dept = ""
        this.searchForm.verifyState = ""
        this.searchForm.warrantState = ""
        this.pageNum = 1
      },
      getInt(num,index) {
        if(num===1) {
          this.searchForm.bankCard = this.$tool.numberInput(this.searchForm.bankCard)
        } else if(num===2) {
          this.companyForm.lepPhone = this.$tool.numberInput(this.companyForm.lepPhone)
        } else if(num===3) {
          this.companyForm.entBankList[index].bankCard = this.$tool.numberInput(this.companyForm.entBankList[index].bankCard)
        }
      },
      inputOnly(index,type){
        if(type==='bankAccountName') {
          this.$nextTick(()=>{
            this.companyForm.entBankList[index].bankAccountName=this.$tool.textInput(this.companyForm.entBankList[index].bankAccountName,3)
          })
        }else if(type==='bankBranchName') {
          this.$nextTick(()=>{
            this.companyForm.entBankList[index].bankBranchName=this.$tool.textInput(this.companyForm.entBankList[index].bankBranchName,4)            
          })
        }else if(type==='bankBranchCode') {
          this.$nextTick(()=>{
            this.companyForm.entBankList[index].bankBranchCode=this.$tool.numberInput(this.companyForm.entBankList[index].bankBranchCode)            
          })
        } else if(type==='lepName') {
          this.$nextTick(()=>{
            this.companyForm.lepName=this.$tool.textInput(this.companyForm.lepName)            
          })
        } else if(type==='lepDocumentCard') {
          this.$nextTick(()=>{
            this.companyForm.lepDocumentCard=this.$tool.textInput(this.companyForm.lepDocumentCard,2)            
          })
        } else if(type==='name') {
          this.$nextTick(()=>{
            this.companyForm.name=this.$tool.textInput(this.companyForm.name)            
          })
        } else if (type === 'platformFeeRatio') {
          this.bindForm.platformFeeRatio = this.$tool.cutFloat({
              val: this.bindForm.platformFeeRatio,
              max: 100
          });
        } else if (type === 'companyId') {
          this.bindForm.companyId = this.$tool.textInput(this.bindForm.companyId)  
        }
      },
      cutNumber(val) {
        this.$nextTick(()=>{
          this.companyForm.franchiseRatio=this.$tool.cutFloat({val:this.companyForm.franchiseRatio,max:100})
        })
      },
      // 证件类型改变 清除证件号信息
      idTypeChange() {
        this.companyForm.lepDocumentCard = ""
      },
      ...mapMutations(["setCompanyData"]),
    },
    filters: {
      formatBankCard(val) {
        return val.replace(/[\s]/g, '').replace(/(\d{4})(?=\d)/g, "$1 ")
      }
    },
    computed: {
      cityInfo(){
        return this.getUser.user
      },
      version(){
        return this.getUser.version
      }
    }
}
</script>
<style lang="less">
.lock-dialog {
  .el-dialog__body {
    height: 600px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
.hover-tip {
  width: 300px;
}
.select-popper {
  width: 300px;
  .el-select-dropdown__item.selected::after {
    right: 12px!important;
  }
  // .selected {
  //   span::after {
  //     right: 12px;
  //   }
  // }
}
</style>
<style lang="less" scoped>
@import "~@/assets/common.less";
.required {
  &::before {
    content: "*";
    color: red;
    position: relative;
    top: 3px;
    margin-right: 1px;
  }
  &::after {
    display: none!important;
  }
}
.form-head {
  background-color: #fff;
  border-radius:2px;
  box-sizing: border-box;
  .el-form-item {
    margin-bottom: @margin-10;
    &:first-child,
    &:last-child {
      /deep/ .el-input {
        width: 180px;
      }
    }
  }
  .w140 {
    .el-input {
      width: 140px;
    }
  }
  .width350{
    width: 350px!important;
  }
  .w180 {
    margin-right: 40px;
    /deep/ .el-input {
      width: 180px;
    }
  }
}
.headerDep{
  /deep/.el-select__tags-text{
    display: inline-block;
    max-width: 100px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    vertical-align:middle
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
    > span .el-button {
      width:100px;
      padding: 9px 15px;
      border-radius:20px;
      display: inline-flex;
      justify-content: center;
      color: #fff;
    }
    > span .el-button:first-of-type {
      width:90px;
      padding: 9px 15px;
      border-radius:20px;
      display: inline-flex;
      justify-content: center;
      color: rgba(71,141,227,1);
      background-color: rgba(255,255,255,1);
    }
  }
  .edit-btn{
    margin-left: 0!important;
  }
}
.dialog-info {
  /deep/ .el-dialog__header {
    padding-left: 0!important;
    .title-class-box {
      .current {
        color: #478de3;
        border-bottom: 4px solid #478de3;
      }
      span {
        padding: 8px 22px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
      }
    }
  }
  .company-info {
    padding: 5px 20px 10px;
    /deep/ .el-form-item__label::before {
      content: "*";
      color: red;
      position: relative;
      top: 3px;
      margin-right: 1px;
    }
    > p {
      font-size: 14px;
      font-weight: bold;
      color:rgba(35,50,65,1);
    }
    .tip {
      display: flex;
      span {
        color: #333;
        font-weight: bold;
        margin-right: 10px;
      }
      .message>p:last-child {
        color: #CD6D6D;
        i { font-weight: bold; color: #D56868; }
      }
    }
    &:first-child {
      .info-content {
        > .item {
          display: flex;
          > .el-form-item {
            display: flex;
            margin-bottom: 0;
            &:nth-child(-n+2) {
              margin-right: 60px;
            }
            /deep/ .el-input {
              width: 200px;
              .el-input__inner {
                height: 28px!important;
              }
            }
          }
          &.shuiwu {
            /deep/ .el-input {
              width: 186px;
            }
          }
          .allow {
            /deep/ .el-input {
              width: 186px;
            }
          }
          .store-name {
            margin-left: -12px;
          }
          .id-card {
            margin-left: 14px;
          }
          .mobile {
            margin-left: -28px;
          }
          .tongyi {
            margin-left: -56px;
          }
          .gongshang {
            margin-left: -14px;
          }
          .zuzhi {
            margin-left: -28px;
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
      .addBankRow {
        position: relative;
        .row-item {
          display: flex;
          margin-top: 10px;
          >div label {
            margin-right: 8px;
            &::before {
              content: "*";
              color: red;
              position: relative;
              top: 3px;
              margin-right: 1px;
            }
          }
          >div:nth-child(-n+2) {
            margin-right: 20px;
          }
          &:nth-child(2) {
            padding-left: 28px;
          }
        }
        &:first-child {
          .button-box span:last-child {
            visibility: hidden;
          }
        }
        /deep/ .el-select, .el-input {
          width: 200px;
        }
        .zhi-hang {
          margin-left: 14px;
          /deep/ .el-input {
            width: 499px;
          }
        }
        .button-box {
          position: absolute;
          right: 25px;
          top: 25px;
        }
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
      }
    }
    &:last-child {
      border-top: 1px solid #edecf0;
      border-bottom: 1px solid #edecf0;
      > div {
        display: flex;
        margin-bottom: @margin-10;
        &.tip {
          margin-bottom: 0;
        }
        > .stamp {
          display: inline-block;
          flex: 1;
          > span {
            color:rgba(35,50,65,1);
          }
          > .upload {
            display: flex;
            margin-top: @margin-10;
            .point::before {
              content: "*";
              color: red;
              position: relative;
              top: 3px;
            }
            > ul {
              display: flex;
              li {
                width: 120px;
                height: 120px;
                border:1px dashed #DEDDE2;
                border-radius: 4px;
                margin-right: 10px;
                position: relative;
                cursor: pointer;
                text-align: center;
                .text {
                  position: absolute;
                  font-size: @size-base;
                  bottom: 10px;
                  left: 35px;
                  color: #233241;
                }
                .pic-name {
                  position: absolute;
                  font-size: @size-base;
                  bottom: -30px;
                  color: #233241;
                  width: 120px;
                  height: 48px;
                  text-align: center;
                  z-index: 10;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                  word-wrap: break-word;
                }
                .del {
                  position: absolute;
                  width: 20px;
                  height: 20px;
                  background-color: #F56C6C;
                  border-radius: 50%;
                  right: 8px;
                  top: 8px;
                  text-align: center;
                  line-height: 20px;
                  color: #fff;
                  display: none;
                }
                &:first-child {
                  .up {
                    width: 50px;
                    height: 50px;
                    background-color: #EEF2FB;
                    line-height: 50px;
                    text-align: center;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%,-50%);
                  }
                  i {
                    font-size: 56px;
                    color:#fff;
                  }
                }
                &:last-child {
                  >div {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%,-50%);
                  }
                  border: none;
                  background-color: #F2F3F8;
                  &:hover .del {
                    display: inline-block;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .view-content {
    padding: 30px;
    .title {
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: bold;
    }
    .content-box {
      .content-item {
        margin-bottom: 20px;
        &.margin {
          margin-bottom: 40px;
        }
        span {
          display: inline-block;
          max-width: 500px;
          vertical-align: text-top;
          font-size: 14px;
          font-weight: bold;
          color: #233241;
        }
        > span:first-of-type {
          display: inline-block;
          width: 140px;
          text-align: right;
          font-weight: 300;
          color: #8492A6;
        }
        .bank-item {
          margin-bottom: 20px;
          span {
            font-size: 14px;
            font-weight: bold;
            color: #233241;
          }
          > span:first-of-type {
            display: inline-block;
            width: 140px;
            text-align: right;
            font-weight: 300;
            color: #8492A6;
          }
        }
      }
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
        line-height: 2;
        > span {
          flex: 1;
        }
        .card-no {
          padding-left: 84px;
        }
      }
      > .stamp {
        width: 50%;
        display: flex;
        float: left;
        margin-top: 20px;
        span { margin-right: 5px; }
        > div {
          width: 120px;
          height: 120px;
          background-color: rgba(236,238,241,1);
          position: relative;
          border-radius: 8px;
          /deep/ .picture {
            position: absolute;
            top: -6px;
            font-size: 160px!important;
          }
          img {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
          }
        }
      }
    }
  }
  .dep-container {
    padding: 30px 20px;
    .dep-search {
      margin-bottom: 30px;
      span {
        padding-right: 8px;
        font-size: 14px;
        color: #233241;
      }
      .el-select {
        width: 300px;
      }
    }
    .dep-content {
      .title {
        margin-bottom: 6px;
        font-size: 14px;
        > span:first-of-type {
          color: #8492A6;
        }
      }
      td {
        border: none!important;
      }
    }
  }
  
  .dialog-footer {
    .el-button {
      width:100px;
      border-radius:20px;
    }
  }
}
.relieve-dialog {
  border-radius: 8px;
  .text {
    display: inline-block;
    padding: 0 3px;
    color: #478DE3;
  }
  /deep/ .el-dialog__header {
    border-radius: 8px 8px 0 0;
    font-weight: bold;
  }
  /deep/ .el-dialog__body {
    height: 164px;
    line-height: 164px;
    text-align: center;
    border-radius: 0 0 8px 8px;

  }
  /deep/ .el-dialog__close {
    font-weight: bold;
  }
  /deep/ .el-dialog__footer {
    text-align: center;
  }
}
.dep-dialog {
  .item {
    padding-bottom: 20px;
    .overflow {
      /deep/ .el-select__tags {
        max-height: 120px;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
    >span {
      display: inline-block;
      width: 78px;
      padding-right: 12px;
      text-align: right;
      color: #233241;
    }
    &:nth-of-type(2) {
      /deep/input {
        height: 40px;
      }
      /deep/::after{
        content: "%";
        display: inline-block;
        color: #ccc;
        position: absolute;
        top: 14px;
        right: 6px;
      }
    }
  }
  /deep/ .el-input {
    width: 300px;
  }
  /deep/ .el-dialog__header {
    border-radius: 8px 8px 0 0;
    font-weight: bold;
  }
  /deep/ .el-dialog__body {
    padding: 20px 30px 30px 70px;
    border-radius: 0 0 8px 8px;

  }
  /deep/ .el-dialog__close {
    font-weight: bold;
  }
}
/deep/ .el-dialog__header {
  border-bottom: 1px solid rgba(237,236,240,1);
}
/deep/ .el-dialog__footer {
  padding-top: 10px;
  padding-bottom: 10px;
}
/deep/ .el-table th {
  background:rgba(238,242,251,1);
}
/deep/ .el-dialog__body {
  padding: 0;
}
</style>
