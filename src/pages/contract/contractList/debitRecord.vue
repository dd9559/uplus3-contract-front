<!-- 打款记录 -->
<template>
  <div class="view-container" id="debitRecord" ref="tableComView">
    <!-- 筛选查询 -->
    <ScreeningTop @propQueryFn="queryFn('search')" @propResetFormFn="resetFormFn" class="adjustbox">
      <el-form :inline="true" :model="adjustForm" class="adjust-form" size="mini" ref="adjustCheckForm">
        <el-form-item label="关键字">
          <el-tooltip effect="dark" content="打款人/备注/金额" placement="top">
            <el-input v-model="adjustForm.keyword" style="width:150px" clearable placeholder="请输入"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="打款日期">
          <el-date-picker v-model="adjustForm.signDate" type="daterange" unlink-panels start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="分账门店">
          <el-select v-model="adjustForm.outStoreAttr" placeholder="全部" class="width150" clearable @change="changeStoreAttr_out">
            <el-option v-for="item in dictionary['53']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="部门">
          <!-- <select-tree :data="DepList" :init="adjustForm.depName1" @checkCell="depHandleClick1" @clear="clearDep(1)" @search="searchDep1" class="fl"></select-tree> -->
          <el-select
            v-model="adjustForm.outStoreId"
            :multiple="false"
            filterable
            remote
            placeholder="全部"
            :remote-method="remoteMethod_out"
            v-loadmore.out="moreDeps"
            :clearable="true"
            @clear="clearOutList('out')"
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
          <el-select v-model="adjustForm.inStoreAttr" placeholder="全部" class="width150" clearable @change="changeStoreAttr_in">
            <el-option v-for="item in dictionary['53']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="部门">
          <!-- <select-tree :data="DepList" :init="adjustForm.depName2" @checkCell="depHandleClick2" @clear="clearDep(2)" @search="searchDep2" class="fl"></select-tree> -->
          <el-select
            v-model="adjustForm.inStoreId"
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

        <el-form-item label="支付状态">
          <el-select v-model="adjustForm.status.value" placeholder="全部" class="width150" clearable>
            <el-option v-for="item in statusList" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
    </ScreeningTop>

    <!-- 数据列表 -->
    <div class="contract-list">
      <div class="title-box">
        <el-button round type="primary" size="medium" @click="getExcel" v-if="power['sign-ht-dk-export'].state" style="padding:9px 15px;min-width: 80px;">导出</el-button>
      </div>
      <el-table :data="tableData.list" ref="tableCom" :max-height="tableNumberCom" style="width: 100%" v-loading="loadingTable" border>

        <el-table-column label="分账门店" :formatter="nullFormatter" min-width="80">
          <template slot-scope="scope">
            <p>{{scope.row.depName}}</p>
          </template>
        </el-table-column>

        <el-table-column label="分账门店账户" min-width="120">
          <span>伏尔甘平台账户</span>
        </el-table-column>

         <el-table-column label="收款门店" :formatter="nullFormatter" min-width="80">
          <template slot-scope="scope">
            <p>{{scope.row.toDepName}}</p>
          </template>
        </el-table-column>

        <el-table-column label="收款门店账户" min-width="120">
          <span>通联虚拟账户</span>
        </el-table-column>

        <el-table-column label="收款公司名称" min-width="100">
          <template slot-scope="scope">
            {{scope.row.status === 3 ? (scope.row.newCompany || '-') : (scope.row.companyName||'-')}}
          </template>
        </el-table-column>

         <el-table-column label="分账金额（元）" :formatter="nullFormatter" min-width="80">
          <template slot-scope="scope">
            <p>{{scope.row.amount}} 元</p>
          </template>
        </el-table-column>

        <el-table-column label="分账周期" min-width="100">
          <template slot-scope="scope">
            <p>{{scope.row.transRange}}</p>
          </template>
        </el-table-column>

        <el-table-column label="打款人" :formatter="nullFormatter" min-width="120">
          <template slot-scope="scope">
            <p>{{scope.row.createdByDep}}-{{scope.row.createdByName}}</p>
          </template>
        </el-table-column>

        <el-table-column label="打款日期" min-width="90">
          <template slot-scope="scope">
            <p>{{scope.row.updatedAt | getTime}}</p>
          </template>
        </el-table-column>

        <el-table-column label="支付状态" min-width="80">
          <template slot-scope="scope">
            <p v-if="scope.row.status&&(scope.row.status === 1 || scope.row.status === 2)">{{scope.row.status === 1 ? '支付成功' : '支付中'}}</p>
            <p v-else-if="scope.row.status&&scope.row.status === 3" class="red">
              <el-popover placement="top" width="200" trigger="click">
                <span>{{scope.row.reason}}</span>
                <el-button slot="reference" type="text" class="curPointer2">支付失败</el-button>
              </el-popover>
            </p>
            <p v-else>--</p>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" min-width="120">
          <template slot-scope="scope">
            <template v-if="scope.row.status && scope.row.status === 3 && power['sign-ht-fz-pay'].state">
              <el-button type="text" class="curPointer" @click="payAgain(scope.row)">重新打款</el-button>
            </template>
            <el-button type="text" class="curPointer" @click="payAgain(scope.row,'look')">查看详情</el-button>
          </template>

        </el-table-column>


      </el-table>
      <el-pagination
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      :current-page="pageNum"
      layout="total, prev, pager, next, jumper"
      :total="tableData.total"
      v-if="tableData.total > 0"
      >
     </el-pagination>
    </div>

    <!-- 确认收款 -->
    <el-dialog :title="title" :visible.sync="payVisiable" width="622px">
      <div class="receipt_one">
        <span class="tag">分账周期：<span class="text">{{payData.transRange}}</span></span>
        <p class="tag_block">收款门店：<span class="text">{{payData.toDepName}}</span></p>
      </div>
      <div class="receipt_two">
        <p class="tag">收款门店账户：<span class="text">公司对应通联虚拟账户</span></p>
      </div>
      <div class="receipt_two">
        <p class="tag">打款金额：<span class="text">{{parseFloat(payData.amount)|fomatFloat}}(分账金额+企业管理费)</span></p>
      </div>
      <div class="stamp">
        <span class="label">上传凭证：</span>
        <div class="upload">
          <ul>
            <li v-show="uploadData.length >= 5 && isLook" class="mask" @click="maxUpLoad"></li>
            <li class="up-content" v-if="isLook">
              <fileUp id="imgcontract" class="up" :rules="['png','jpg']" @getUrl="upload" :more="true" :picSize=true :maxNum="5" :getNum="uploadData.length" :maxSize="2" :scane="{path:'other'}"><i>+</i></fileUp>
              <p class="text">点击上传</p>
            </li>
            <template v-for="(item,index) in uploadData">
              <el-tooltip effect="dark" :content="item.contractName" placement="bottom" :key="index">
                <li>
                  <div @click="previewPhoto(uploadList,index,2)">
                    <img :src="item.preConFile" width="90px" height="80px">
                  </div>
                  <p class="pic-name">{{item.contractName}}</p>
                  <span class="del" @click="delStamp(index)" v-if="isLook"><i class="el-icon-close"></i></span>
                </li>
              </el-tooltip>
            </template>
            <span v-if="uploadData.length === 0 && !isLook">-</span>
          </ul>
        </div>
      </div>
      <div class="receipt_three" v-if="isLook">
        <span class="receiptReason">打款备注：</span>
        <el-input type="textarea" :rows="6" placeholder="请输入打款备注，最多200字 " v-model="payremark" resize='none' style="width:460px;overflow-y:hidden" maxlength="200"></el-input>
      </div>
      <div class="receipt_three" v-else :style="{'padding-bottom': isLook ? 0 : '20px'}">
        <span class="receiptReason">打款备注：</span>
        <span class="text">{{payremark !== '' ? payremark : '-'}}</span>
      </div>
      <span slot="footer" class="dialog-footer" v-if="isLook">
        <el-button round @click="payVisiable = false">取消</el-button>
        <el-button round type="primary" v-dbClick @click="payAgainSure">确定</el-button>
      </span>
    </el-dialog>
    <preview :imgList="previewFiles" :start="previewIndex" v-if="preview" @close="preview=false"></preview>
    

  </div>
</template>



<script>
  import ScreeningTop from '@/components/ScreeningTop';
  import {FILTER} from "@/assets/js/filter";
  import {TOOL} from "@/assets/js/common";
  import { MIXINS } from "@/assets/js/mixins";

  export default {
    name: "debit-record",
    mixins: [FILTER,MIXINS],
    data(){
      return{
        payremark:'',
        payVisiable: false,
        loadingTable:false, //列表的加载loading
        // 列表分页
        pageNum: 1,
        pageSize: 50,
        total: 0,
        adjustForm:{
          signDate: '', //发起日期
          outStoreId: '', //分账门店id
          inStoreId: '', //分账门店属性
          outStoreAttr: '', //收款门店id
          inStoreAttr: '', //收款门店属性
          keyword: '',   //关键字
          status:{
            value:'',
            label: ''
          }, //支付状态
        },
        ajaxParam: {},
        payData: {},
        isLook: false,
        title: '',
        uploadData: [],
        statusList: [
          {value: '全部',key: ''},
          {value: '支付成功',key: 1},
          {value: '支付中',key: 2},
          {value: '支付失败',key: 3},
        ],

        // 部门搜索分页
        pageSize_:50,
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
        currentPage_in:1,//收款
        keyword_in: "",
        total_out:0,
        total_in:0,
        loading:false,
        //部门选择列表
        options:[],
        currentPage_:1,
        firstTotal:0,

        dictionary: {
          //数据字典
          "507": "", // 成交总价单位
          "53": "", //合作方式
          "26": ""  // 支付状态
        },
        //上传的凭证
        uploadList: [],

        auditForm: {
          textarea: '', //备注
        },
        tableData:[],
        power: {
          'sign-ht-maid-query': {
            state: false,
            name: '查询'
          },
          'sign-ht-maid-vdetail': {
            state: false,
            name: '打款明细'
          },
          'sign-com-htdetail':{
              name:'合同详情',
              state:false,
          },
          'sign-ht-fz-pay':{
              name:'重新打款',
              state:false,
          },
          'sign-ht-dk-export':{
              name:'重新打款',
              state:false,
          }
        }
      }
    },
    filters: {
       getDate(val) {
         return TOOL.dateFormat(val);
       },
       getTime(val) {
         if(val === ''){
           return '-'
         }
         return TOOL.timeFormat(val)
       }
    },

    methods:{
      // 导出功能
      getExcel() {
          // this.queryFn();
          let param = Object.assign({}, this.ajaxParam)
          this.excelCreate('/input/transferListExcel', param)
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
        this.$set(this.adjustForm,'signDate',data)
      },
      // 删除
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

      payAgain(e,type='pay') {
        if (type === 'pay' && !this.power['sign-ht-fz-pay'].state) {
          return this.$message({
            message:'没有重新打款权限',
            type:'warning'
          });
        }

        if (type === 'pay') {
          this.isLook = true
          this.title = '确认打款'
        } else {
          this.isLook = false
          this.title = '详情'
        }
        this.uploadData = []
        this.uploadList = []
        this.payremark = ''
        this.payData = e
        if (this.payData.signImgs === 'null') {
          this.uploadData = []
          this.payVisiable = true
        } else {
          let promiseAll = [],
              signImgs = JSON.parse(this.payData.signImgs);
          signImgs.forEach(item => {
            promiseAll.push(this.fileSign([item.split('?')[0]], 'preload'))
          })
          Promise.all(promiseAll).then(result => {
            this.uploadData = signImgs.map((item,index) => {
              this.uploadList.push({
                fileType: this.$tool.get_suffix(item),
                name: item.split('?')[1],
                path: item
              })
              return {
                contractSign: item,
                contractName: item.split('?')[1],
                preConFile: result[index]
              }
            })
            this.payremark = this.payData.remark
            this.payVisiable = true
          })
        }
    },

      payAgainSure(){
        let param = {
          id: this.payData.id,
          remark: this.payremark,
        }
        if (this.uploadData.length > 0) {
          param.signImg = this.uploadData.map(item => item.contractSign)
        }
        this.$ajax.postJSON("/api/separate/currency_sure_pay", param)
        .then(res => {
          let data = res.data;
          if (res.data.status === 200) {
            this.payVisiable = false
              // 数据刷新
            this.queryFn();
            setTimeout(() => {
              this.$message({
                message: data.message,
                type: "success"
              });
            }, 2000);
          }
        }).catch(error => {
          this.payVisiable = false
            this.$message({
            message: error
          })
        });
      },
      trim(str){
        return str.replace(/(^\s*)|(\s*$)/g, "")
      },


      // 重置
      resetFormFn() {
          TOOL.clearForm(this.adjustForm);
          this.initialTimeFn()
          this.adjustForm.status={
            value:'',
            label:''
          }
          this.pageNum = 1;
          this.outStoreList=this.options//分账门店
          this.inStoreList=this.options//收款门店
          this.currentPage_out=1//分账
          this.currentPage_in=1//收款
          this.total_out=this.firstTotal
          this.total_in=this.firstTotal
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

      // 查询
      queryFn(type="init") {
          if(type==="search"){
            this.pageNum=1
          }
        this.loadingTable = true;
            let startTime = '';
            let endTime = '';
            if(this.adjustForm.signDate && this.adjustForm.signDate.length === 2){
                startTime = TOOL.dateFormat(this.adjustForm.signDate[0]);
                endTime = TOOL.dateFormat(this.adjustForm.signDate[1]);
            }
            let param = {
              outStoreId:  this.adjustForm.outStoreId,
              outStoreAttr: this.adjustForm.outStoreAttr,
              inStoreId:  this.adjustForm.inStoreId,
              inStoreAttr: this.adjustForm.inStoreAttr,
              startTime,
              endTime,
              pageNum: this.pageNum,
              pageSize: this.pageSize,
              keyword: this.adjustForm.keyword,
            }
            if (this.adjustForm.status.value) {
              param.status = this.adjustForm.status.value
            }
            if(type==="search"||type==="page"){
              sessionStorage.setItem('sessionQuery',JSON.stringify({
                path:'/debitRecord',
                url:'/separate/pay_list',
                query:Object.assign({},param,{checkOutDep:this.checkOutDep},{checkInDep:this.checkInDep}),
                methods:"get"
              }))
            }
            //调整佣金审核列表
            this.$ajax
            .get("/api/separate/pay_list", param)
            .then(res => {
              this.$nextTick(() => {
                this.loadingTable = false;
              })
              let data = res.data;
              if (res.data.status === 200) {
                this.tableData = data.data
                this.ajaxParam = param
              }



            }).catch(error => {
              this.$nextTick(() => {
                this.loadingTable = false;
              })
              this.$message({
                message: error
              })
            })
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

      handleCurrentChange(e) {
        this.pageNum = e;
        this.queryFn("page");
      },


    getDepList(param,first=true,type='other'){
      this.$ajax.get('/api/organize/deps/pages',param,'nocode').then(res=>{
        res=res.data;
        if(res.status===200){
          let outList = [].concat(res.data.list)
          let inList = [].concat(res.data.list)
          if(this.adjustForm.checkOutDep&&this.adjustForm.checkOutDep.id){
            res.data.list.forEach((element,index) => {
              if(this.adjustForm.checkOutDep&&this.adjustForm.checkOutDep.id===element.id){
                outList.splice(index,1)
              }
            });
          }
          if(this.adjustForm.checkInDep&&this.adjustForm.checkInDep.id){
            res.data.list.forEach((element,index) => {
              if(this.adjustForm.checkInDep&&this.adjustForm.checkInDep.id===element.id){
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
          }else{
            if(type==='out'){
              this.outStoreList=res.data.list;
              this.total_out=res.data.total
            }else{
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
          type:'G',
          keyword:keyword,
          pageSize:this.pageSize_,
          pageNum:this.currentPage_out,
          depAttr:''
        }
        if(this.adjustForm.outStoreAttr===1){
          param.depAttr='DIRECT'
        }else if(this.adjustForm.outStoreAttr===2){
          param.depAttr='JOIN'
        }
        this.getDepList(param,false,'out')
      } else {
        this.keyword_out = ''
      }
    },
    remoteMethod_in(keyword){
      if(keyword!==''){
        this.keyword_in = keyword
        this.currentPage_in=1;
        let param = {
          type:'G',
          keyword:keyword,
          pageSize:this.pageSize_,
          pageNum:this.currentPage_in,
          depAttr:''
        }
        if(this.adjustForm.inStoreAttr===1){
          param.depAttr='DIRECT'
        }else if(this.adjustForm.inStoreAttr===2){
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
            type:'G',
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
            type:'G',
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
      this.adjustForm.outStoreId='';
      let param = {
        type:'G',
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
      this.adjustForm.inStoreId='';
      let param = {
        type:'G',
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
          type:'G',
          pageNum:this.currentPage_out,
          pageSize:this.pageSize_,
          depAttr:''
        }
        if(this.adjustForm.outStoreAttr===1){
          param.depAttr='DIRECT'
        }else if(this.adjustForm.outStoreAttr===2){
          param.depAttr='JOIN'
        }
      }else{
        this.currentPage_in=1;
        let param = {
          type:'G',
          pageNum:this.currentPage_in,
          pageSize:this.pageSize_,
          depAttr:''
        }
        if(this.adjustForm.inStoreAttr===1){
          param.depAttr='DIRECT'
        }else if(this.adjustForm.inStoreAttr===2){
          param.depAttr='JOIN'
        }
        }
      },
    },
    created() {
      let res=this.getDataList
      if(res&&(res.route===this.$route.path)){
        this.tableData = res.data
        let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
        this.adjustForm = Object.assign({},this.adjustForm,session.query)
        this.adjustForm.status={
          value:session.query.status ? session.query.status:'',
          label:''
        }
        if(session.query.startTime){
          this.adjustForm.signDate=[session.query.startTime,session.query.endTime]
        }
        delete this.adjustForm.pageNum
        delete this.adjustForm.startTime
        delete this.adjustForm.endTime
        this.pageNum=session.query.pageNum
        if(this.adjustForm.checkOutDep.id){
          this.outStoreList.unshift({
            id:this.adjustForm.checkOutDep.id,
            name:this.adjustForm.checkOutDep.name
          })
        }
        if(this.adjustForm.checkInDep.id){
          this.inStoreList.unshift({
            id:this.adjustForm.checkInDep.id,
            name:this.adjustForm.checkInDep.name
          })
        }

        if(this.adjustForm.outStoreAttr){
          let param = {
            pageNum:this.currentPage_out,
            pageSize:this.pageSize_,
          }
          param.depAttr=this.adjustForm.outStoreAttr===1?"DIRECT":"JOIN"
          this.getDepList(param,true,"out")
        }
        if(this.adjustForm.inStoreAttr){
          let param = {
            pageNum:this.currentPage_in,
            pageSize:this.pageSize_,
          }
          param.depAttr=this.adjustForm.inStoreAttr===1?"DIRECT":"JOIN"
          this.getDepList(param,true,"in")
        }
        if(!this.adjustForm.outStoreAttr&&!this.adjustForm.inStoreAttr){
          this.getDepList({
            // type:'G',
            pageNum:1,
            pageSize:this.pageSize_,
          })
        }
      }else{
        this.initialTimeFn()
        this.queryFn();
        this.getDepList({
          // type:'G',
          pageNum:1,
          pageSize:this.pageSize_,
        })
      }
      this.getDictionary();
    },

    components: {ScreeningTop,}
  };
</script>
<style lang="less">

@import "~@/assets/common.less";

#debitRecord{
  .paycontent{
    margin-top: 15px;
    clear: both;
    overflow: hidden;
    .paytitle{
      margin-bottom: 20px;
    }
    p{
      float: left;
      span{
        color: #333;
      }
      &:first-child{
        margin-right: 30px;
      }
    }

    .radio{
      margin-bottom: 8px;
      margin-left: 20px;
      display: flex;

    }
  }

  .textareabox{
    margin: 15px 0 20px;
    display: flex;
    align-items: flex-start;
    span{
      width: 80px;

    }
  }
  .btn-text-info{
    padding: 0;
    &.color-red{
      color: red;
    }
  }
  .el-dialog .el-dialog__body{
    padding: 0 20px;
  }
  .el-dialog__header{
      border-bottom: 1px solid #EDECF0;
      padding: 16px 20px 12px;
      span{
          color: #233241;
          font-size: 18px;


      }
      .el-dialog__headerbtn{
          top: 16px;
          .el-dialog__close{
              font-size: 20px;
              color: #32485F;
          }
      }
    }
  .el-textarea.is-disabled .el-textarea__inner{
        color:#233241;
    }
  .fl{
    float: left;
  }

  .mt20{
    margin-bottom: 20px;
  }
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
    margin-bottom: 10px;
  }
  .el-form-item--mini .el-form-item__content, .el-form-item--mini .el-form-item__label{
    line-height: 32px;
  }
  .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner{
    width: 330px;
    line-height: 32px;
    height: 32px;
  }
  .el-range-editor--mini.el-input__inner{
    height: 32px;
    font-size: 14px;
  }
  .el-range-editor--mini .el-range-input{
    font-size: 14px;
  }
  .el-input--mini .el-input__inner{
    height: 32px;
    line-height: 32px;
    font-size: 14px;
  }
  .el-pagination{
     text-align: right;
  }

  // .adjustbox{
  //   box-shadow:0px 1px 6px 0px rgba(7,47,116,0.1);
  // }

  .adjust-form {
    margin-bottom: 10px;
    background-color: #fff;
    border-radius:2px;
    box-sizing: border-box;
  }

  .contract-list {
      background-color: #fff;
      padding: 10px 12px 0;
      .title-box {
        display: flex;
        justify-content: flex-end;
      }
    .form-title-fl{
      font-size: 14px;
      color: #233241;
      padding: 6px 0;

      .mr8{
        margin-right: 8px;
      }
    }
    .el-table{
      margin-top: 10px;
      th{
        background-color: #EEF2FB;
        &:first-child{
          /*padding-left: 20px;*/
        }
      }
      tr{
        td{
          &:first-child{
            /*padding-left: 20px;*/
          }
        }
      }

    }
  }

  .blue{
    color: @color-blue;
  }
  .yellow{
    color: @color-yellow;
  }
  .green{
    color: @color-green;
  }
  .red{
    color: @color-warning;
  }
  .btn{
    color: @color-blue;
    cursor: pointer;
  }

  .width250{
    width: 250px;
  }
  .width200{
    width: 200px;
  }
  .width150{
    width: 150px;
  }
  .mb20{
    margin-bottom: 20px;
  }
  .width100{
    width: 100px;
  }
  .mr100{
    margin-right: 100px;
  }
  .curPointer{
    cursor: pointer;
    &:hover{
      text-decoration: underline;
    }
  }
  .curPointer2{
    cursor: pointer;
    color: @color-warning;
    font-size: 12px;
    &:hover{
      text-decoration: underline;
    }
  }
  // 调佣审核弹层样式
  .layer-audit{
    .el-dialog{
      margin: 80px auto 60px !important;
      margin-top: 0vh;
    }
    .el-dialog__header{
      border-bottom: 1px solid #EDECF0;
      padding: 16px 20px 15px;
      span{
          color: #233241;
          font-size: 20px;


      }
      .el-dialog__headerbtn{
          top: 16px;
          .el-dialog__close{
              font-size: 24px;
              color: #32485F;
          }
      }
    }
    .el-dialog__body{
          padding: 0;
      }
  }
  .audit-box{
    padding: 0 20px 0px 20px;
    overflow-y: auto;
    .audit-col{
      padding: 20px 0;
      .col-li{
        overflow: hidden;
        clear: left;
        margin-bottom: 18px;
        p{
          float: left;
          &:first-child{
            width: 250px;
            color: #6C7986;
            span{
              color: #233241;
              &.blue{
                color: #478DE3;
              }
            }
          }
        }
      }
      .textareabox{
        display: flex;
        align-items: flex-start;
        span{
          width: 80px;
          em{
            color:#FF3E3E;
            margin-right: 3px;
          }
        }
      }
      .table{
        width: 100%;
        border-collapse:collapse;
        border-spacing:1;
        border-top: 1px solid #E8EAF6;
        border-left: 1px solid #E8EAF6;
        text-align: center;
        .el-input__inner{
          height: 28px;
          line-height: 28px;
          padding: 0;
          text-align: center;
        }
        .el-input__icon{
          line-height: 28px;
        }
        .el-input__suffix{
          right: 0px;
        }
        tr th{
          background-color:#F2F3F8;
          border-right: 1px solid #E8EAF6;
          border-bottom: 1px solid #E8EAF6;
          line-height: 40px;
          height: 40px;
        }
        tr td{
          overflow: hidden;
          padding: 14px 10px;
          border-right: 1px solid #E8EAF6;
          border-bottom: 1px solid #E8EAF6;
          &.flex{
            display: flex;
            align-items: center;
            justify-content: center;

          }
          .width70{
            width: 72px;
            height: 28px;
            line-height: 28px;
            margin-right: 3px;

          }
          .mr10{
            margin-right: 10px;
            .el-input__inner{
              text-align: left;
              padding-left: 10px;
            }
          }
          .fl{
            float: left;
          }
        }
      }
      .table2{
        tr td{
          padding: 12px 0;
        }
      }
      .uploadfile{
        margin: 40px 0 0;
        display: flex;
        .uploadtitle{
          color: #6C7986;
          width: 78px;
          span{
            margin-left: 16px;
            color: #8E8E8E;
            b{
              color: #6C7986;
            }
          }
        }
        .ulData{

            width: 100%;
            overflow: hidden;
            li{
                margin-right: 20px;
                margin-bottom: 20px;
                position: relative;
                float: left;
                &:nth-child(5n){
                  margin-right: 0;
                }
                > i{
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    color: #F56C6C;
                    font-size: 20px;
                    cursor: pointer;
                }
            }
        }

        .namePath{
            display: inline-block;
            text-align: center;
            width: 120px;
            height: 120px;
            padding-top: 20px;
            box-sizing: border-box;
            border-radius:4px;
            background: #F2F3F8;
            > p{
              padding-top: 5px;
              display: inline-block;
              width: 100px;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
        }

      }

    }
    .bordernone{
      border-bottom: none;
    }
  }
  .textareabox2{
    display: flex;
    align-items: flex-start;
    margin-bottom: 30px;
    span{
      width: 76px;
    }
  }
  .btnbox{
    display: flex;
    justify-content: flex-end;
    padding: 15px 20px 15px 0;
    border-top: 1px solid #EDECF0;
    .el-button{
      width: 100px;
      height: 38px;
      border-radius: 18px;
      padding: 0;
      &.refuse{
        background-color: #EAEFF5;
      }
      &.recept{
        background-color: #54D384;
        border-color: #54D384;
      }

    }
  }
  .name-wrapper {
    min-width: 80px;
    max-height: 65px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: normal;
    word-break: break-all;
    word-wrap:break-word;
  }

  .isFlex{
    display: flex;
    align-items: center;
  }

  .radiodiv{
    overflow: hidden;
    .innerdiv{
      overflow: hidden;
      p{
        margin-bottom: 12px;
        clear: both;
        // display: flex;
        // align-items: top;
        span.blue{
          // display:block;
          display: inline-block;
          width: 278px;
          white-space: normal;
          vertical-align: top;
          // word-wrap: break-word;
          // word-break: break-all;
        }
        span.blue:nth-child(1){
          width: 230px;
          margin-right: 30px;

        }

      }

    }
    > .is-checked{
      .el-radio__label{
        p span.blue{
          color:#409EFF;
        }
      }
    }
  }

  .receipt_one{
    padding-top: 10px;
    .tag_block {
      display: block;
      padding-top: 18px;
    }
  }
  .receipt_two{
    padding-top: 18px;
    .tag {
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
    display: flex;
    .text {
      width: 420px;
      word-break: break-all;
    }
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
  .el-button+.el-button {
    margin-left: 0;
  }
}
</style>
