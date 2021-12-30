<template>
  <div class="view-container" ref="tableComView">
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn" :min="45">
      <el-form :inline="true" :model="searchForm" class="prop-form" size="small">
        <el-form-item label="结算日期">
          <el-date-picker v-model="signDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy/MM/dd" :clearable="false" :picker-options="pickerBeginDateBefore" :default-value="timeDefaultShow" style="width:330px">
          </el-date-picker>

        </el-form-item>
        <el-form-item label="分账门店">
          <el-select v-model="searchForm.outStoreAttr" placeholder="全部" :clearable="true" style="width:150px" @change="changeStoreAttr_out">
            <el-option v-for="item in dictionary['53']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-select
            v-model="searchForm.outStoreId"
            :multiple="false"
            filterable
            remote
            placeholder="全部"
            :remote-method="remoteMethod_out"
            v-loadmore.out="moreDeps"
            :clearable="true"
            @clear="clearOutList('out')"
            @change="checkOut"
            :loading="loading">
            <el-option
              v-for="item in outStoreList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收款门店">
          <el-select v-model="searchForm.inStoreAttr" placeholder="全部" :clearable="true" style="width:150px" @change="changeStoreAttr_in">
            <el-option v-for="item in dictionary['53']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-select
            v-model="searchForm.inStoreId"
            :multiple="false"
            filterable
            remote
            placeholder="全部"
            :remote-method="remoteMethod_in"
            v-loadmore.in="moreDeps"
            :clearable="true"
            @clear="clearOutList('in')"
            @change="checkIn"
            :loading="loading">
            <el-option
              v-for="item in inStoreList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 2.6.2新增需求 打款状态 -->
        <el-form-item label="打款状态">
          <el-select v-model="searchForm.status" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in statusList" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </ScreeningTop>
    <!-- 列表 -->
    <div class="routing-list">
      <p>
        <span class="title"><i class="iconfont icon-tubiao-11"></i>数据列表</span>
        <el-button round type="primary" size="medium" @click="queryFn('getExcel')" v-dbClick v-if="power['sign-ht-fz-export'].state" style="padding:9px 15px;min-width: 80px;">导出</el-button>
      </p>
      <el-table :data="tableData" border @row-dblclick='toDetail' ref="tableCom" :max-height="tableNumberCom">
        <el-table-column prop="currDeptName">
          <template slot="header">分账门店
            <el-tooltip content="指收款门店" placement="top">
              <img class="icon-prompt" src="../../../assets/img/icon-commissionCounts-prompt.png" alt="说明">
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="分账门店账户">
          <span>伏尔甘账户</span>
        </el-table-column>
        <el-table-column prop="toDeptName">
          <template slot="header">收款门店
            <el-tooltip content="指分账收款门店" placement="top">
              <img class="icon-prompt" src="../../../assets/img/icon-commissionCounts-prompt.png" alt="说明">
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="收款门店账户">
          <span>通联虚拟账户</span>
        </el-table-column>
        <el-table-column>
          <template slot="header">收款公司名称
            <el-tooltip content="此分账期间收款门店对应公司" placement="top">
              <img class="icon-prompt" src="../../../assets/img/icon-commissionCounts-prompt.png" alt="说明">
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            {{scope.row.companyName||'-'}}
          </template>
        </el-table-column>
        <el-table-column label="分账周期">
          <template>
            <span>{{copySignDate[0]|timeFormat_}}</span> ~
            <span>{{copySignDate[1]|timeFormat_}}</span>
          </template>
        </el-table-column>
        <el-table-column label="分账金额" prop="currCost">
          <template slot-scope="scope">
            {{scope.row.currCost|fomatFloat}}
          </template>
        </el-table-column>
        <el-table-column label="企业管理费" prop="currCost">
          <template slot-scope="scope">
            {{scope.row.managerFee|fomatFloat}}
          </template>
        </el-table-column>
        <el-table-column label="打款状态">
          <template slot-scope="scope">
            <span>{{scope.row.isPay == 1 ? '已打款' : '未打款'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="medium" v-if="power['sign-ht-fz-pay'].state&&scope.row.isPay!=1" @click="toReceipt(scope.row,scope.$index)">确认打款</el-button>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 固定滚动条 -->
      <div class="pagination" v-if="tableData.length>0">
        <el-pagination
         class="pagination-info"
         @current-change="handleCurrentChange"
         :current-page="currentPage"
         :page-size="pageSize"
         layout="total, prev, pager, next, jumper"
         :total="total">
        </el-pagination>
      </div>
    </div>

    <!-- 确认收款 -->
    <el-dialog title="确认打款" :visible.sync="dialogReceipt" width="600px" :closeOnClickModal="$tool.closeOnClickModal" @close="closeReceipt">
      <div class="receipt_one">
        <span class="tag">分账周期：<span class="text">{{copySignDate[0]|timeFormat_}} ~ {{copySignDate[1]|timeFormat_}}</span></span>
        <p class="tag_block">收款门店：<span class="text">{{receiptData.toDeptName}}</span></p>
      </div>
      <div class="receipt_two">
        <p class="tag">收款门店账户：<span class="text">公司对应通联虚拟账户</span></p>
      </div>
      <div class="receipt_two">
        <p class="tag">打款金额：<span class="text">{{(parseFloat(receiptData.currCost)+parseFloat(receiptData.managerFee))|fomatFloat}}(分账金额+企业管理费)</span></p>
      </div>
      <div class="stamp">
        <span class="label">上传凭证：</span>
        <div class="upload">
          <ul>
            <li v-show="uploadData.length >= 5" class="mask" @click="maxUpLoad"></li>
            <li class="up-content">
              <fileUp id="imgcontract" class="up" :rules="['png','jpg']" @getUrl="upload" :more="true" :picSize="true" :maxNum="5" :getNum="uploadData.length" :maxSize="2" :scane="{path:'other'}"><i>+</i></fileUp>
              <p class="text">点击上传</p>
            </li>
            <template v-for="(item,index) in uploadData">
              <el-tooltip effect="dark" :content="item.contractName" placement="bottom" :key="index">
                <li>
                  <div @click="previewPhoto(uploadList,index,2)">
                    <img :src="item.preConFile" width="90px" height="80px">
                  </div>
                  <p class="pic-name">{{item.contractName}}</p>
                  <span class="del" @click="delStamp(index)"><i class="el-icon-close"></i></span>
                </li>
              </el-tooltip>
            </template>
          </ul>
        </div>
      </div>
      <div class="receipt_three">
        <span class="receiptReason">打款备注：</span>
        <el-input type="textarea" :rows="6" placeholder="请输入打款备注，最多200字 " v-model="receiptReason" resize='none' style="width:460px;overflow-y:hidden" maxlength="200"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="dialogReceipt = false">取消</el-button>
        <el-button round type="primary" v-dbClick @click="commit" v-loading.fullscreen.lock="fullscreenLoading">确定</el-button>
      </span>
    </el-dialog>
    <preview :imgList="previewFiles" :start="previewIndex" v-if="preview" @close="preview=false"></preview>
  </div>
</template>

<script>
import ScreeningTop from "@/components/ScreeningTop";
import { MIXINS } from "@/assets/js/mixins";
import { FILTER } from "@/assets/js/filter";
import { TOOL } from "@/assets/js/common";

export default {
  mixins: [FILTER,MIXINS],
  components: {
    ScreeningTop
  },
  data() {
    return {
      timeDefaultShow:'',//结算日期范围改为默认是前一个月和当月
      pickerBeginDateBefore: {
        disabledDate: (time) => {
          return time.getTime() >= Date.now()

          }
      },
      statusList: [
        {value: '全部',key: ''},
        {value: '未打款',key: 0},
        {value: '已打款',key: 1},
      ],
      searchForm: {
        outStoreId:'',//分账门店id
        outStoreAttr:'',//分账门店属性
        inStoreId:'',//收款门店id
        inStoreAttr:'',//收款门店属性
        status:'',//分账类型
      },
      outStoreList:[],//分账门店
      inStoreList:[],//收款门店
      checkOutDep:{
        id:'',
        name:''
      },
      checkInDep:{
        id:'',
        name:''
      },
      currentPage_out:1,//分账
      keyword_out: "",
      pageSize_:10,
      currentPage_in:1,//收款
      keyword_in: "",
      signDate: [],
      copySignDate: [],
      tableData:[],
      currentPage:1,
      pageSize:50,
      total:0,
      total_out:0,
      total_in:0,
      loading:false,
      //部门选择列表
      options:[],
      firstTotal:0,
      dictionary: {
        //数据字典
        "53": "", //合作方式
        "64": "",
      },
      dialogReceipt:false,
      isDisabled:false,
      fullscreenLoading: false,//防抖
      receiptData:{},
      uploadData: [],
      //上传的凭证
      uploadList: [],
      receiptReason:'',//备注
      radio:'',
      index:'',
      power: {
        'sign-ht-fz-query': {
          state: false,
          name: '分账查询'
        },
        'sign-ht-fz-pay': {
          state: false,
          name: '确认打款'
        },
        'sign-ht-fz-export': {
          state: false,
          name: '分账导出'
        },
      }
    };
  },
  created() {
    this.getDictionary();//字典
    this.initialTimeFn()
    // this.getDepList({
    //   // type:'G',
    //   pageNum:this.currentPage_,
    //   pageSize:this.pageSize_,
    // })
    let res=this.getDataList
    if(res&&(res.route===this.$route.path)){
      this.tableData = res.data.list
      this.total = res.data.total
      let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
      this.searchForm = Object.assign({},this.searchForm,session.query)
      delete this.searchForm.pageNum
      delete this.searchForm.startTime
      delete this.searchForm.endTime
      this.currentPage=session.query.pageNum

      if(this.searchForm.outStoreAttr){
        let param = {
          pageNum:this.currentPage_out,
          pageSize:this.pageSize_,
        }
        param.depAttr=this.searchForm.outStoreAttr===1?"DIRECT":"JOIN"
        this.getDepList(param,true,"out")
      }
      if(this.searchForm.inStoreAttr){
        let param = {
          pageNum:this.currentPage_in,
          pageSize:this.pageSize_,
        }
        param.depAttr=this.searchForm.inStoreAttr===1?"DIRECT":"JOIN"
        this.getDepList(param,true,"in")
      }
      if(!this.searchForm.outStoreAttr&&!this.searchForm.inStoreAttr){
        this.getDepList({
          // type:'G',
          pageNum:1,
          pageSize:this.pageSize_,
        })
      }
      if(this.searchForm.checkOutDep.id){
        this.outStoreList.unshift({
          id:this.searchForm.checkOutDep.id,
          name:this.searchForm.checkOutDep.name
        })
      }
      if(this.searchForm.checkInDep.id){
        this.inStoreList.unshift({
          id:this.searchForm.checkInDep.id,
          name:this.searchForm.checkInDep.name
        })
      }
      if(session.query.startTime){
        this.signDate=new Array(session.query.startTime.replace(/-/g,'/'),session.query.endTime.replace(/-/g,'/')) 
        // this.signDate[0]=session.query.startTime
        // this.signDate[1]=session.query.endTime
      }
    }else{
      this.getDepList({
        // type:'G',
        pageNum:1,
        pageSize:this.pageSize_,
    })
    }
    //结算日期的默认范围改为前月和当月
    let date = new Date();
    this.timeDefaultShow=new Date(date.getFullYear(),date.getMonth(),0)
    this.getProateNotes()
  },
  methods: {
    // 导出功能
    getExcel() {
        // this.queryFn();
        // let param = Object.assign({}, this.ajaxParam)
        this.excelCreate('/input/currencyListExcel', param)
    },
    // 删除电子签章
    delStamp(index) {
      this.$delete(this.uploadData,index)
      this.$delete(this.uploadList,index)
    },
    maxUpLoad() {
      if (this.uploadData.length >= 5) {
        return this.$message({
          message: '最多上传5张图片',
          type: 'warning'
        })
      }
    },
    // 电子签章上传成功 获取存储路径和文件名称
    upload(obj) {
      obj.param.map(item => {
        let addData = {}
        addData.contractSign = item.path+`?${item.name}`
        addData.contractName = item.name
        let preloadList = [item.path]
        this.fileSign(preloadList, 'preload').then(res => {
          addData.preConFile = res[0]
          this.uploadList.push({
            fileType: this.$tool.get_suffix(item.path),
            name: item.name,
            path: item.path
          })
          this.uploadData.push(addData)
        })
      })
    },
    // 初始时间
    initialTimeFn() {
      let now = new Date(); //当前日期 
      let nowMonth = now.getMonth(); //当前月 
      let nowYear = now.getFullYear(); //当前年 
      //本月的开始时间
      let data = [];
      data.push(new Date(nowYear, nowMonth, 1).toLocaleDateString()); 
      //本月的结束时间
      data.push(now.toLocaleDateString());
      console.log(data);
      this.$set(this,'signDate',data)
    },
    //获取分账记录列表
    getProateNotes(type="init"){
      let param = {
        pageNum:this.currentPage,
        pageSize:this.pageSize
      }
      param = Object.assign({}, param, this.searchForm);
      if (this.signDate&&this.signDate.length > 0) {
        param.startTime = this.signDate[0].replace(/\//g,'-');
        param.endTime = this.signDate[1].replace(/\//g,'-');
      };
      if (param.status === '') {
        delete param.status
      }
      if(type==="search"||type==="page"){
        sessionStorage.setItem('sessionQuery',JSON.stringify({
          path:'/routingRecord',
          url:'/separate/currency_list',
          query:Object.assign({},param,{checkOutDep:this.checkOutDep},{checkInDep:this.checkInDep}),
          methods:"get"
        }))
      }
      if (type === 'getExcel' && JSON.stringify(param) === JSON.stringify(this.ajaxParams)) {
        if (!this.total) {
          this.$message.warning('当前筛选条件结果无数据！')
        } else {
          this.excelCreate('/input/currencyListExcel', param)
        }
        return
      }
      this.$ajax.get('/api/separate/currency_list',param).then(res=>{
        res=res.data;
        if(res.status===200){
          this.tableData=res.data.list;
          this.total=res.data.total;
          this.copySignDate = this.signDate
          if (['init','search','getExcel'].includes(type)) {
            this.ajaxParams = JSON.parse(JSON.stringify(param))
          }
          if (type === 'getExcel') {
            if (!this.total) {
              this.$message.warning('当前筛选条件结果无数据！')
            } else {
              this.excelCreate('/input/currencyListExcel', param)
            }
          }
        }
      }).catch(error=>{
        this.$message({
          message:error,
          type:"error"
        })
      })
    },
    //记录选中的门店
    checkOut(data){//分账门店
      if(data){
        let cell = this.outStoreList.find(item=>item.id===data)
        this.checkOutDep=Object.assign({},this.checkOutDep,{
          id:cell.id,
          name:cell.name
        })
      }else{
        this.checkOutDep.id=''
        this.checkOutDep.name=''
      }
    },
    checkIn(data){//收款门店
      if(data){
        let cell = this.inStoreList.find(item=>item.id===data)
        this.checkInDep=Object.assign({},this.checkInDep,{
          id:cell.id,
          name:cell.name
        })
      }else{
        this.checkInDep.id=''
        this.checkInDep.name=''
      }
    },
    // 查询
    queryFn(type = 'search') {
      if(this.signDate&&this.signDate.length>1){
        this.pageNum=1
        this.getProateNotes(type);
      }else{
        this.$message({
          message:"请选择时间范围",
          type:'warning'
        })
      }
    },
    // 重置
    resetFormFn() {
      TOOL.clearForm(this.searchForm);
      // this.outStoreList=this.options//分账门店
      // this.inStoreList=this.options//收款门店
      this.currentPage_out=1//分账
      this.currentPage_in=1//收款
      // this.total_out=this.firstTotal
      // this.total_in=this.firstTotal
      this.initialTimeFn()
      this.outStoreList=[]
      this.inStoreList=[]
      this.getDepList({
        // type:'G',
        pageNum:this.currentPage_,
        pageSize:this.pageSize_,
      })
      this.checkOutDep.id=''
      this.checkOutDep.name=''
      this.checkInDep.id=''
      this.checkInDep.name=''
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getProateNotes("page");
    },
    getDepList(param,first=true,type='other'){
      this.$ajax.get('/api/organize/deps/pages',param,'nocode').then(res=>{
        res=res.data;
        if(res.status===200){
          let outList = [].concat(res.data.list)
          let inList = [].concat(res.data.list)
          if(this.searchForm.checkOutDep&&this.searchForm.checkOutDep.id){
            res.data.list.forEach((element,index) => {
              if(this.searchForm.checkOutDep&&this.searchForm.checkOutDep.id===element.id){
                outList.splice(index,1)
              }
            });
          }
          if(this.searchForm.checkInDep&&this.searchForm.checkInDep.id){
            res.data.list.forEach((element,index) => {
              if(this.searchForm.checkInDep&&this.searchForm.checkInDep.id===element.id){
                inList.splice(index,1)
              }
            });
          }
          if(first){
            if(type==="out"){
              this.outStoreList=this.outStoreList.concat(outList);
              this.total_out=res.data.total
            }else if(type==="in"){
              this.inStoreList=this.inStoreList.concat(inList);
              this.total_in=res.data.total
            }else{
              this.outStoreList=this.outStoreList.concat(outList);
              this.inStoreList=this.inStoreList.concat(inList);
              this.total_out=res.data.total
              this.total_in=res.data.total
            }
            // this.options=res.data.list;
            // this.firstTotal=res.data.total;
          }else{
            if(type==='out'){
              this.outStoreList=res.data.list;
              this.total_out=res.data.total
            }else if(type==='in'){
              this.inStoreList=res.data.list;
              this.total_in=res.data.total
            }
          }
        }
      })
    },
    //搜索
    remoteMethod_out(keyword){
      if(keyword!==''){
        this.currentPage_out=1;
        this.keyword_out = keyword
        let param = {
          // type:'G',
          keyword:keyword,
          pageSize:this.pageSize_,
          pageNum:this.currentPage_out,
          depAttr:''
        }
        if(this.searchForm.outStoreAttr===1){
          param.depAttr='DIRECT'
        }else if(this.searchForm.outStoreAttr===2){
          param.depAttr='JOIN'
        }
        this.getDepList(param,false,'out')
      }else {
        this.keyword_out = ''
      }
    },
    remoteMethod_in(keyword){
      if(keyword!==''){
        this.keyword_in = keyword
        this.currentPage_in=1;
        let param = {
          // type:'G',
          keyword:keyword,
          pageSize:this.pageSize_,
          pageNum:this.currentPage_in,
          depAttr:''
        }
        if(this.searchForm.inStoreAttr===1){
          param.depAttr='DIRECT'
        }else if(this.searchForm.inStoreAttr===2){
          param.depAttr='JOIN'
        }
        this.getDepList(param,false,'in')
      } else {
        this.keyword_in = ''
      }
    },
    //门店下拉加载更多
    moreDeps(type){
      if(type==='out'){
        if(this.total_out>this.outStoreList.length){
          this.currentPage_out++;
          let param = {
            // type:'G',
            pageNum:this.currentPage_out,
            pageSize:this.pageSize_
          }
          if (this.keyword_out !== '') {
            param.keyword = this.keyword_out
          }
          this.$ajax.get('/api/organize/deps/pages',param,'nocode').then(res=>{
            res=res.data;
            if(res.status===200){
              this.outStoreList=this.outStoreList.concat(res.data.list);
            }
          })
        }
      }else{
        if(this.total_in>this.inStoreList.length){
          this.currentPage_in++;
          let param = {
            // type:'G',
            pageNum:this.currentPage_in,
            pageSize:this.pageSize_
          }
          if (this.keyword_in !== '') {
            param.keyword = this.keyword_in
          }
          this.$ajax.get('/api/organize/deps/pages',param,'nocode').then(res=>{
            res=res.data;
            if(res.status===200){
              this.inStoreList=this.inStoreList.concat(res.data.list);
            }
          })
        }
      }
    },
    //改变门店类型
    changeStoreAttr_out(value){
      this.currentPage_out=1;
      this.searchForm.outStoreId='';
      let param = {
        // type:'G',
        pageNum:this.currentPage_out,
        pageSize:this.pageSize_,
        depAttr:''
      }
      this.checkOutDep.id=''
      this.checkOutDep.name=''
      if(value===1){
        param.depAttr='DIRECT'
      }else if(value===2){
        param.depAttr='JOIN'
      }
      this.getDepList(param,false,'out')
    },
    changeStoreAttr_in(value){
      this.currentPage_in=1;
      this.searchForm.inStoreId='';
      let param = {
        // type:'G',
        pageNum:this.currentPage_in,
        pageSize:this.pageSize_,
        depAttr:''
      }
      this.checkInDep.id=''
      this.checkInDep.name=''
      if(value===1){
        param.depAttr='DIRECT'
      }else if(value===2){
        param.depAttr='JOIN'
      }
      this.getDepList(param,false,'in')
    },
    //清空选择的门店
    clearOutList(type){
      if(type==='out'){
        this.currentPage_out=1;
        let param = {
          // type:'G',
          pageNum:this.currentPage_out,
          pageSize:this.pageSize_,
          depAttr:''
        }
        if(this.searchForm.outStoreAttr===1){
          param.depAttr='DIRECT'
        }else if(this.searchForm.outStoreAttr===2){
          param.depAttr='JOIN'
        }
        // this.getDepList(param,false,'out')
      }else{
        this.currentPage_in=1;
        let param = {
          // type:'G',
          pageNum:this.currentPage_in,
          pageSize:this.pageSize_,
          depAttr:''
        }
        if(this.searchForm.inStoreAttr===1){
          param.depAttr='DIRECT'
        }else if(this.searchForm.inStoreAttr===2){
          param.depAttr='JOIN'
        }
        // this.getDepList(param,false,'in')
        }
      },
    //确认收款
    toReceipt(item,index){
      this.dialogReceipt=true;
      this.receiptData=item;
      this.index = index;
    },
    commit(){
      let that = this
      TOOL.eventThrottle(function(){
        let param = {
        storeId: Number.parseInt(that.receiptData.currDeptId),
        fromId: that.receiptData.ids,
        toStoreId: Number.parseInt(that.receiptData.toDeptId),
        transRange: `${that.copySignDate[0].replace(/\//g,'-')}~${that.copySignDate[1].replace(/\//g,'-')}`,
        amount: Number.parseFloat(that.receiptData.amount),
        remark: that.receiptReason,
        depName: that.receiptData.currDeptName,
        toDepName: that.receiptData.toDeptName,
      }
      if (that.uploadData.length > 0) {
        param.signImg = that.uploadData.map(item => item.contractSign)
      }
      // that.isDisabled = true
      that.$ajax.postJSON("/api/separate/currency_pay", param)
      .then(res => {
        let data = res.data;
        if (res.data.status === 200) {
          that.dialogReceipt = false
          // that.isDisabled = false
            // 数据刷新
          that.queryFn();
          that.$message({
            message: data.message,
            type: 'success'
          });
        }
      }).catch(error => {
          that.dialogReceipt = false
          // that.isDisabled = false
          let str = error
          if (error === '用户不存在') {
            str = '该公司未开通POS收款'
          }
          that.$message({
            message: str
          })
        });
      })()
    },
    closeReceipt(){
      this.receiptReason='';
      this.radio='';
      this.uploadData = [];
      this.uploadList = []
    },
    //分账详情
    toDetail(value){
      let newPage = this.$router.resolve({
        path: '/routingRemitDetail',
        query:{
          ids:value.relationId,
          type:1
        }
      });
      window.open(newPage.href, '_blank');
    }
  },
  filters: {
    timeFormat_: function (val) {
      if (!val) {
        return '--'
      } else {
        let time = new Date(val)
        let y = time.getFullYear()
        let M = time.getMonth() + 1
        let D = time.getDate()
        let h = time.getHours()
        let m = time.getMinutes()
        let s = time.getSeconds()
        let time_ = `${y}-${M > 9 ? M : '0' + M}-${D > 9 ? D : '0' + D} ${h > 9 ? h : '0' + h}:${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`;
        return time_.substr(0, 10)
      }
    }
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";

.routing-list {
  // margin-top: 20px;
  background-color: #fff;
  padding: 0 10px;
  border-radius: 2px;
  // box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
  >p{
    display: flex;
    justify-content: space-between;
    padding: 10px 0 10px 0;
    .title{
      padding-left: 10px;
      i{
        padding-right: 10px;
      }
    }
  }
}
/deep/.paper-box {
  padding-top: 10px !important;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 2px;
  box-sizing: border-box;
  // box-shadow: 0px 1px 6px 0px rgba(7,
  .paper-set-tit {
    padding-bottom: 10px;
  }
}
/deep/ .el-table th {
  background: @bg-th;
}
//确认打款弹窗
/deep/.el-dialog__header{
  padding: 10px;
  border-bottom: 1px solid #edecf0;
  .el-dialog__headerbtn{
    top:10px;
    right: 10px;
  }
}
.bankAccountName{
  display: inline-block;
  padding-right: 10px;
  padding-left: 23px;
  padding-bottom: 5px;
}
.accountType{
  display: inline-block;
  width: 200px;
  padding-bottom: 5px;
}
.bankBranchName{
  display: inline-block;
  padding-bottom: 5px;
  padding-left: 23px;
}
.bankName{
  display: inline-block;
  padding-left: 23px;
  padding-bottom: 5px;
}
.tag{
  display: inline-block;
  width: 246px;
  color: @color-6c;
  padding-left: 20px;
}
.receiptReason{
  display: inline-block;
  color: @color-6c;
  padding-left: 20px;
}
.text{
  color: @color-blank;
}
.receipt_one{
  padding-top: 10px;
  .tag_block {
    display: block;
    padding-top: 18px;
    padding-left: 20px;
  }
}
.receipt_two{
  padding-top: 18px;
  .tag {
    padding-left: 20px;
    width: auto;
  }
  >ul{
    padding-left: 40px;
    >li{
      padding: 5px 0;
      color: @color-blank;
    }
  }
}
.stamp {
  display: flex;
  margin: 20px 0;
  .label {
    display: inline-block;
    width: 70px;
    padding-left: 20px;
    padding-right: 12px;
    font-size: 14px;
    font-weight: 500;
  }
  .upload {
    display: inline-block;
    width: 430px;
    vertical-align: text-top;
    ul {
      display: flex;
      flex-wrap: wrap;
      .mask {
        position: absolute;
        opacity: 0;
        z-index: 99;
      }
      li {
        width: 120px;
        height: 120px;
        border-radius: 7px;
        box-sizing: border-box;
        color: #8492a6;
        background-color: #f2f3f8;
        border: 1px dashed #dedde2;
        margin: 0 10px;
        margin-bottom: 10px;
        position: relative;
        cursor: pointer;
        text-align: center;
        div {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
        }
        p {
          position: absolute;
          font-size: 12px;
          bottom: -30px;
          color: #233241;
          width: 120px;
          height: 48px;
          text-align: center;
          z-index: 10;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-wrap: break-word;
        }
        .del {
            position: absolute;
            width: 20px;
            height: 20px;
            background-color: #f56c6c;
            border-radius: 50%;
            right: 8px;
            top: 8px;
            text-align: center;
            line-height: 20px;
            color: #fff;
            display: none;
        }
        &:hover {
          .del {
            display: block;
          }
        }
      }
      .up-content {
        width: 120px;
        height: 120px;
        padding: 28px 34px 20px 34px;
        border: 1px dashed #dedde2;
        background-color: #fff;
        border-radius: 7px;
        box-sizing: border-box;
        color: #8492a6;
        .up {
          width: 50px;
          height: 50px;
          line-height: 50px;
          margin-bottom: 10px;
          background: #eef2fb;
          border-radius: 4px;
          color: #fff;
          font-size: 40px;
          font-weight: bold;
          text-align: center;
        }
      }
      .text {
        color: #8492a6;
        font-size: 12px;
        text-align: left;
      }
    }
  }
}
.receipt_three{
  padding-top: 5px;
  display: flex;
}
.dialog-footer{
  /deep/.is-round{
    padding: 9px 15px;
  }
}
.icon-prompt {
  width: 14px;
  height: 14px;
  display: inline-block;
  position: relative;
  top: -1px;
  vertical-align: middle;
  margin-left: 4px;
}
</style>
