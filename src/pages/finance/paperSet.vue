<template>
  <div class="paper-set">
    <ScreeningTop @propResetFormFn="reset" @propQueryFn="getData">
      <!-- <div class="content">
        <div class="input-group">
          <label>部门:</label>
          <el-select size="small" v-model="propForm.depId" placeholder="请选择">
            <el-option
              v-for="item in 5"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select class="margin-left-10 w100" size="small" v-model="propForm.empId" placeholder="请选择">
            <el-option
              v-for="item in 5"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>关键字:</label>
          <el-input size="small" v-model="propForm.keyword" placeholder="合同编号/房源编号/客源编号/物业地址/客户/房产证号/手机号"></el-input>
        </div>
        <div class="input-group">
          <label>票据状态:</label>
          <el-select size="small" v-model="propForm.state" placeholder="请选择">
            <el-option
              v-for="item in dictionaryData"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>查询时间:</label>
          <div class="time-picker">
            <el-select class="w120" size="small" v-model="propForm.dateType" placeholder="请选择">
              <el-option
                v-for="item in $tool.dropdown.dateType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-date-picker
              class="margin-left-10"
              v-model="propForm.timeRange"
              type="daterange"
              size="small"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
      </div> -->
      <el-form :inline="true" ref="propForm" :model="propForm" class="prop-form" size="small">
        <div class="in-block">
            <el-form-item 
            label="部门"
            prop="depIdS" 
            class="mr">
                <el-select 
                ref="tree" 
                size="small" 
                :loading="Loading" 
                :remote-method="remoteMethod" 
                v-model="propForm.depIdS" 
                @clear="clearDep"
                @visible-change="initDepList" 
                clearable 
                filterable
                remote 
                placeholder="请选择">
                    <el-option 
                    class="drop-tree" 
                    value="">
                        <el-tree 
                        :data="DepList" 
                        :props="defaultProps" 
                        @node-click="depHandleClick"></el-tree> 
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="empId">
                <el-select 
                v-model="propForm.empId" 
                clearable
                class="w100">
                    <el-option 
                    v-for="item in EmployeList" 
                    :key="'empId'+item.empId" 
                    :label="item.name"
                    :value="item.empId"></el-option>
                </el-select>
            </el-form-item>
        </div>
        <el-form-item label="关键字" prop="keyword">
            <el-input class="w284" v-model="propForm.keyword" placeholder="开票人员/合同编号/票据编号/物业地址" clearable></el-input>
        </el-form-item>
        <el-form-item 
            label="票据状态"
            prop="state">
                <el-select 
                v-model="propForm.state" 
                class="w180">
                    <el-option 
                    v-for="item in dictionaryData" 
                    :key="'dictionaryData'+item.key" 
                    :label="item.value" 
                    :value="item.key"></el-option>
                </el-select>
        </el-form-item>
        <div class="in-block">
            <el-form-item label="查询时间" prop="dateType" class="mr">
                <el-select 
                v-model="propForm.dateType"
                class="w110">
                    <el-option 
                    v-for="item in $tool.dropdown.dateType" 
                    :key="item.value" 
                    :label="item.label" 
                    :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item 
            prop="timeRange">
                <el-date-picker 
                v-model="propForm.timeRange"
                class="w284" 
                type="daterange"
                value-format="yyyy-MM-dd" 
                range-separator="至" 
                start-placeholder="开始日期" 
                end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
        </div>
      </el-form>

    </ScreeningTop>
    <!-- 列表 -->
    <div class="paper-table-box">
      <div class="paper-set-tit">
        <div class="paper-tit-fl"><i class="iconfont icon-tubiao-11 mr-10 font-cl1"></i>数据列表</div>
      </div>
      <el-table :data="tableData.list" class="paper-table mt-20" v-loading="loadingList">
        <el-table-column fixed align="center" label="序号" min-width="70">
          <template slot-scope="scope">
            <p class="tc">{{scope.$index + 1}}</p>
          </template>
        </el-table-column>
        <el-table-column fixed label="合同编号" min-width="124">
          <template slot-scope="scope">
            <span class="blue" @click="cellOpera('contract',scope.row)">{{scope.row.contNo}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed label="票据编号" min-width="137">
          <template slot-scope="scope">
            <span class="blue" @click="cellOpera('paper',scope.row)">{{scope.row.billCode}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed label="收款ID" min-width="135">
          <template slot-scope="scope">
            <span class="blue" @click="cellOpera('bill',scope.row)">{{scope.row.proceedsCode}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed prop="address" label="物业地址" min-width="124">
        </el-table-column>
        <el-table-column fixed prop="cName" label="客户姓名" min-width="84">
        </el-table-column>
        <el-table-column fixed prop="state" label="票据状态" min-width="84" :formatter="nullFormatter">
        </el-table-column>
        <el-table-column prop="payeeName" label="收款人" min-width="71">
        </el-table-column>
        <el-table-column prop="drawerName" label="开票人员" min-width="86">
        </el-table-column>
        <el-table-column prop="drawerDepName" label="门店" min-width="85">
        </el-table-column>
        <el-table-column prop="amount" label="开票金额（元）" min-width="122">
        </el-table-column>
        <el-table-column label="开票日期" min-width="150">
          <template slot-scope="scope">
            {{dateFormat(scope.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column prop="printTimes" label="打印次数" min-width="85">
        </el-table-column>
        <el-table-column prop="printByName" label="打印人" min-width="72">
        </el-table-column>
        <el-table-column label="打印日期" min-width="152">
           <template slot-scope="scope">
            {{dateFormat(scope.row.printTime)}}
          </template>
        </el-table-column>
        <el-table-column label="回收日期" min-width="152">
          <template slot-scope="scope">
            {{dateFormat(scope.row.recycleTime)}}
          </template>
        </el-table-column>
        <el-table-column label="核销日期" min-width="148">
          <template slot-scope="scope">
            {{dateFormat(scope.row.cavTime)}}
          </template>
        </el-table-column>
        <el-table-column label="作废日期" min-width="152">
          <template slot-scope="scope">
            {{dateFormat(scope.row.invalidTime)}}
          </template>
        </el-table-column>
        <el-table-column prop="invalidReason" label="作废原因" min-width="100">
          <template slot-scope="scope">
             <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              popper-class="wordp"
              :content="scope.row.invalidReason">
              <p class="norwap" slot="reference">{{scope.row.invalidReason}}</p>
            </el-popover>
              <!-- <p class="norwap">{{scope.row.invalidReason}}</p> -->
          </template>
        </el-table-column>
        <el-table-column label="操作人/时间" min-width="146">
          <template slot-scope="scope">
            <p>{{scope.row.updateByName}}</p>
            <p>{{dateFormat(scope.row.updateTime)}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="148">
          <template slot-scope="scope">
            <!-- 已开票 -->
            <template v-if="scope.row.state.value===2">
              <el-button type="text" @click="btnOpera(scope.row,1)" v-if="power['sign-cw-bill-delete'].state">核销</el-button>
              <el-button type="text" @click="btnOpera(scope.row,2)" v-if="power['sign-cw-bill-trash'].state">回收</el-button>
              <el-button type="text" @click="btnOpera(scope.row,3)" v-if="power['sign-cw-bill-void'].state">作废</el-button>
            </template>
            <!-- 已作废 -->
            <template v-else-if="scope.row.state.value===4">
              <el-button type="text" @click="btnOpera(scope.row,4)" v-if="power['sign-cw-bill-invoice'].state && scope.row.invalidPrint">开票</el-button>
              <el-button type="text" @click="btnOpera(scope.row,2)" v-if="power['sign-cw-bill-trash'].state">回收</el-button>
            </template>
            <!-- 已回收 和 已核销 -->
            <template v-else>--</template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination" v-if="tableData.total">
        <el-pagination
            :current-page="tableData.pageNum"
            :page-size="tableData.pageSize"
            @current-change="currentChangeFn"
            layout=" total, prev, pager, next, jumper"
            :total="tableData.total">
        </el-pagination>
    </div>
    <!-- 弹层 -->
    <el-dialog :title="layer.title" :visible.sync="layer.show" :width="layer.title==='票据作废'?'740px':'460px'" class="layer-paper">
      <div v-if="layer.title==='票据作废'" class="layer-invalid">
        <ul class="ul">
          <li>
            <span class="cl-1 mr-10 pl-9">票据编号：</span>
            <span class="cl-2 mr-40">{{activeRow.billCode}}</span>
          </li>
          <li>
            <span class="cl-1 mr-10">合同编号：</span>
            <span class="cl-2 mr-40">{{activeRow.contNo}}</span>
          </li>
          <li>
            <span class="cl-1 mr-10">收款时间：</span>
            <span class="cl-2">{{comPaymentTime}}</span>
          </li>
        </ul>
        <div class="input-box">
          <span class="cl-1 mr-10"><span class="red mr-5">*</span>作废备注：</span>
          <div class="input">
            <el-input type="textarea" resize="none" placeholder="请输入作废理由" :maxlength="invalidMax" v-model="layer.reason" class="input">
            </el-input>
            <div class="text-absloute">{{invalidNumber}}/{{invalidMax}}</div>
          </div>
        </div>
      </div>
      <div v-else class="txt">{{layer.msg}}</div>
      <p slot="footer" :class="[layer.title!=='票据作废'?'center':'']">
        <el-button round size="medium" class="paper-btn" @click="layer.show=false">取消</el-button>
        <el-button round size="medium" class="paper-btn paper-btn-blue" type="primary" @click="submitForm">确定</el-button>
      </p>
    </el-dialog>
    <layer-invoice ref="layerInvoice" @emitPaperSet="emitPaperSetFn"></layer-invoice>
  </div>
</template>

<script>
  import {FILTER} from "@/assets/js/filter";
  import {MIXINS} from "@/assets/js/mixins";
  import ScreeningTop from '@/components/ScreeningTop';
  import LayerInvoice from '@/components/LayerInvoice';

  export default {
    mixins: [FILTER, MIXINS],
    data() {
      return {
        // 加载
        loading:false,
        loading2:false,
        loadingList:false,
        // 列表数据
        tableData: [],
        // 筛选条件
        propForm: {
          depId: '',
          empId: '',
          keyword: '',
          state: '',
          dateType: 1,
          timeRange: '',
        },
        // 筛选下拉
        rules:{
          depId:[{
                  name: "全部",
                  id: ""
              }],
          empId:[{
                  name: "全部",
                  empId: ""
              }],
        },
        //分页
        pageSize: 10,
        pageNum: 1,
        // 筛选选项
        dictionary: {
          '33': '',
        },
        dictionaryData:[],
        // 作废弹层输入框
        invalidMax: 150,
        // 弹层
        layer: {
          show: false,
          title: '',
          msg:'',
          reason:''
        },
        activeRow:{},
        paymentTime:'',
        // 权限
        power:{
            'sign-cw-bill-query':{
                name:'查询',
                state:false
            },
            'sign-cw-bill-delete':{
                name:'核销',
                state:false
            },
            'sign-cw-bill-trash':{
                name:'回收',
                state:false
            },
            'sign-cw-bill-void':{
                name:'作废',
                state:false
            },
            'sign-cw-bill-invoice':{
                name:'开票',
                state:false
            },
            'sign-cw-bill-print':{
                name:'打印',
                state:false
            },
            'sign-com-htdetail':{
                name:'合同详情',
                state:false
            },
            'sign-cw-bill-detail':{
                name:'票据详情',
                state:false
            },
            'sign-com-revdetail':{
                name:'收款详情',
                state:false
            },
        }
      }
    },
    computed: {
      invalidNumber() {
        return this.layer.reason.length
      },
      comPaymentTime(){
        return this.$tool.dateFormat(this.paymentTime)
      }
    },
    mounted() {
      // 枚举类型数据获取
      this.getDictionary();
      // 部门搜索
      this.remoteMethod();
      // 获取列表
      this.getData();
    },
    methods: {
      // 时间处理
      dateFormat(val){
          return this.$tool.dateFormat(val);
      },
      reset: function () {
        this.$refs.propForm.resetFields();
        this.$tool.clearForm(this.propForm)
      },
      // 错误提示
      errMeFn(e){
          this.$message.error(e);
      },
      // 列表数据
      getData: function () {
        if(!this.power['sign-cw-bill-query'].state){
            this.noPower(this.power['sign-cw-bill-query'].name);
            return false
        }
        this.loadingList = true;
        let param = Object.assign({}, this.propForm)
        param.pageNum = this.pageNum
        param.pageSize = this.pageSize
        if (param.timeRange) {
          param.startTime = param.timeRange[0]
          param.endTime = param.timeRange[1]
          delete param.timeRange
        }
        this.$ajax.get('/api/bills', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.tableData = res.data
          }
          this.loadingList = false;
        }).catch(err=>{
          this.loadingList = false;
        })
      },
      btnOpera: function (row,type) {
        this.activeRow = Object.assign({},row)
        if(type===4){
          if(!this.power['sign-cw-bill-invoice'].state){
              this.noPower(this.power['sign-cw-bill-invoice'].name);
              return false
          }
          if(!this.power['sign-cw-bill-print'].state){
              this.noPower(this.power['sign-cw-bill-print'].name);
              return false
          }
          this.$refs.layerInvoice.show(row.proceedsId,true);
          return
        }
        switch (type) {
          case 1:
            if(!this.power['sign-cw-bill-delete'].state){
                this.noPower(this.power['sign-cw-bill-delete'].name);
                return false
            }
            this.layer.title = '票据核销'
            this.layer.msg = '确认要核销该票据吗?'
            this.layer.show = true;
            break
          case 2:
            if(!this.power['sign-cw-bill-trash'].state){
                this.noPower(this.power['sign-cw-bill-trash'].name);
                return false
            }
            this.layer.title = '票据回收'
            this.layer.msg = '确认要收回该票据吗?'
            this.layer.show = true;
            break
          case 3:
            if(!this.power['sign-cw-bill-void'].state){
                this.noPower(this.power['sign-cw-bill-void'].name);
                return false
            }
            this.layer.title = '票据作废';
            this.layer.reason ='';
            this.layer.show = true;
            this.getPaperDetails(row.id)
            break
        }
      },
      getPaperDetails: function(id) {
        document.getElementById
        this.$ajax.get(`/api/bills/details`,{
            id
        }).then(res => {
          res = res.data
          if (res.status === 200) {
            this.paymentTime = res.data.paymentTime
          }
        }).catch(err=>{
          this.$message.error(err);
        })
      },
      // 分页
      currentChangeFn(e){
          this.pageNum = e;
          this.getData();
      },
      // 编号操作
      cellOpera(type,row) {
        if (type === 'contract') {
          if(!this.power['sign-com-htdetail'].state){
              this.noPower(this.power['sign-com-htdetail'].name);
              return false
          }
          this.$router.push({
              path: "/contractDetails",
              query: {
                  id: row.contId,//合同id
                  code: row.contNo,//合同编号
                  contType: row.contType//合同类型
              }
          });
        } else if (type === 'paper') {
          if(!this.power['sign-cw-bill-detail'].state){
              this.noPower(this.power['sign-cw-bill-detail'].name);
              return false
          }
          if(!this.power['sign-cw-bill-print'].state){
              this.noPower(this.power['sign-cw-bill-print'].name);
              return false
          }
          this.$refs.layerInvoice.show(row.id,false,row.state.value===4||row.state.value===5||row.state.value===3);
        } else {
          if(!this.power['sign-com-revdetail'].state){
              this.noPower(this.power['sign-com-revdetail'].name);
              return false
          }
          this.$router.push({
            path:'billDetails',
            query:{
              id:row.proceedsId,
              tab:'收款信息',
              power:true
            }
          })
        }
      },
      // dialog确定
      submitForm:function () {
        let param = {
          id:this.activeRow.id
        }
        let url = '';
        switch (this.layer.title){
          case '票据核销':
            // param.state = 3;
            url = 'bills/cav';
            break
          case '票据回收':
            // param.state = 4;
            url = 'bills/recycle'
            break
          case '票据作废':
            // param.state = 5;
            if(!this.layer.reason){
              this.errMeFn('作废原因不能为空');
              return false
            }
            param.reason = this.layer.reason;
            url = 'bills/invalid'
            break
        }
        this.$ajax.put(`/api/${url}`,param,0).then(res=>{
          res=res.data
          if(res.status===200){
            this.layer.show=false
            this.$message({
              message: `${this.layer.title}成功`,
              type: 'success'
            });
            this.getData()
          }
        }).catch(err=>{
          this.errMeFn(err);
        })
      },
      // 接收成功
      emitPaperSetFn(){
        // this.$refs.layerInvoice.propCloseFn();
        this.getData();
      },
      // 部门第二版 选择部门
      depHandleClick(data){
          this.propForm.depId=data.depId
          this.propForm.depIdS=data.name
          this.handleNodeClick(data);
      },
      // 部门第二版 删除
      clearDep(){
          this.propForm.depId='';
          this.propForm.empId='';
          this.clearSelect();
          this.remoteMethod();
      },
      // 部门第二版 下拉隐藏时 刷新数据清除上一次数据
      initDepList(val){
          if(!val){
              this.remoteMethod()
          }
      },
    },
    components: {
      ScreeningTop,
      LayerInvoice
    },
    watch:{
      dictionary(n,old){
        this.dictionaryData = [{
          key:'',
          value:'全部'
        },...n[33]];
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/less/lsx.less";
  .content {
    display: flex;
    flex-wrap: wrap;
    .input-group {
      margin-right: 10px;
      > label {
        text-align: center;
      }
      /*/deep/ .el-select, .el-input {
        width: 200px;
      }*/
    }
  }
  .layer-paper{
    .center{
      text-align: center;
    }
    .paper-btn-blue{
      color: @color-white;
    }
    .paper-btn-float{
      position: absolute;
      right: 0;
      bottom: 20px;
    }
  }
  .paper-edit-box{
    margin: 0 40px;
    padding: 20px 0 80px;
    border-bottom: 1px solid @border-D8;
    position: relative;
    >ul{
      &:first-of-type{
        >li{
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          >label{
            margin-right: 10px;
          }
          &:first-of-type,&:nth-of-type(2){
            >p{
              &:first-of-type{
                width: 200px;
              }
            }
          }
          &:last-of-type{
            margin-bottom: 0px;
          }
        }
      }
    }
    .type-list{
      display: flex;
      >p{
        min-width: 140px;
        margin-right: 20px;
        display: inherit;
        align-items: center;
        >label.checkbox-info{
          margin-right: 10px;
        }
      }
      .input-group{
        margin-bottom: 0;
        margin-right: 20px;
      }
    }
  }
  .paper-watch-tab{
    >p{
      color: @color-blue;
      text-align: center;
      font-weight: bold;
      margin: 32px;
    }
    >ul{
      display: flex;
      justify-content: center;
      margin-bottom: 26px;
      >li{
        border-top: 2px solid @color-blue;
        border-bottom: 2px solid @color-blue;
        min-width: 100px;
        height: 36px;
        display: inherit;
        align-items: center;
        justify-content: center;
        &:first-of-type{
          border-left: 2px solid @color-blue;
          border-top-left-radius: 18px;
          border-bottom-left-radius: 18px;
        }
        &:last-of-type{
          border-right: 2px solid @color-blue;
          border-top-right-radius: 18px;
          border-bottom-right-radius: 18px;
        }
        &.active{
          background-color: @color-blue;
          color: @color-white;
        }
      }
    }
  }

</style>

