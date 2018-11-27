<template>
  <div class="paper-set">
    <ScreeningTop @propResetFormFn="reset" @propQueryFn="getData">
      <div class="content">
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
              v-for="item in dictionary['33']"
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
      </div>
    </ScreeningTop>
    <!-- 列表 -->
    <div class="paper-table-box">
      <div class="paper-set-tit">
        <div class="paper-tit-fl"><i class="iconfont icon-tubiao-11 mr-10 font-cl1"></i>数据列表</div>
      </div>
      <el-table :data="tableData" class="paper-table mt-20">
        <el-table-column fixed align="center" label="序号" min-width="70">
          <template slot-scope="scope">
            <p class="tc">{{scope.$index}}</p>
          </template>
        </el-table-column>
        <el-table-column fixed label="合同编号" min-width="124">
          <template slot-scope="scope">
            <el-button class="blue" type="text" @click="cellOpera('contract')">{{scope.row.contNo}}</el-button>
          </template>
        </el-table-column>
        <el-table-column fixed label="票据编号" min-width="137">
          <template slot-scope="scope">
            <el-button class="blue" type="text" @click="cellOpera('paper',scope.row)">{{scope.row.billCode}}</el-button>
          </template>
        </el-table-column>
        <el-table-column fixed label="收款ID" min-width="135">
          <template slot-scope="scope">
            <el-button class="blue" type="text" @click="cellOpera('bill')">{{scope.row.proceedsId}}</el-button>
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
        <el-table-column prop="createTime" label="开票日期" min-width="150">
        </el-table-column>
        <el-table-column prop="printTimes" label="打印次数" min-width="85">
        </el-table-column>
        <el-table-column prop="printByName" label="打印人" min-width="72">
        </el-table-column>
        <el-table-column prop="printTime" label="打印日期" min-width="152">
        </el-table-column>
        <el-table-column prop="recycleTime" label="回收日期" min-width="152">
        </el-table-column>
        <el-table-column prop="cavTime" label="核销日期" min-width="148">
        </el-table-column>
        <el-table-column prop="invalidTime" label="作废日期" min-width="152">
        </el-table-column>
        <el-table-column prop="invalidReason" label="作废原因" min-width="100">
        </el-table-column>
        <el-table-column label="操作人/时间" min-width="146">
          <template slot-scope="scope">
            <p>{{scope.row.updateByName}}</p>
            <p>{{scope.row.updateTime}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="148">
          <template slot-scope="scope">
            <!-- 已开票 -->
            <template v-if="scope.row.state.value===2">
              <el-button type="text" @click="btnOpera(scope.row,1)">核销</el-button>
              <el-button type="text" @click="btnOpera(scope.row,2)">回收</el-button>
              <el-button type="text" @click="btnOpera(scope.row,3)">作废</el-button>
            </template>
            <!-- 已作废 -->
            <template v-else-if="scope.row.state.value===4">
              <el-button type="text" @click="btnOpera(scope.row,4)">开票</el-button>
              <el-button type="text" @click="btnOpera(scope.row,2)">回收</el-button>
            </template>
            <!-- 已回收 和 已核销 -->
            <template v-else>--</template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹层 -->
    <el-dialog :title="layer.title" :visible.sync="layer.show" :width="layer.title==='票据作废'?'740px':'460px'" class="layer-paper" @close="propCloseFn">
      <div v-if="layer.title==='票据作废'" class="layer-invalid">
        <ul class="ul">
          <li>
            <span class="cl-1 mr-10">票据编号：</span>
            <span class="cl-2 mr-40">{{activeRow.billCode}}</span>
          </li>
          <li>
            <span class="cl-1 mr-10">合同编号：</span>
            <span class="cl-2 mr-40">{{activeRow.contNo}}</span>
          </li>
          <li>
            <span class="cl-1 mr-10">收款时间：</span>
            <span class="cl-2">--</span>
          </li>
        </ul>
        <div class="input-box">
          <span class="cl-1 mr-10">作废备注：</span>
          <div class="input">
            <el-input type="textarea" resize="none" placeholder="请输入核销理由" :maxlength="invalidMax" v-model="layer.reason"
                      class="input">
            </el-input>
            <div class="text-absloute">{{invalidNumber}}/{{invalidMax}}</div>
          </div>
        </div>
      </div>
      <div v-else class="txt">{{layer.msg}}</div>
      <p slot="footer" :class="[layer.title!=='票据作废'?'center':'']">
        <el-button round  size="medium" class="paper-btn" @click="layer.show=false">取消</el-button>
        <el-button round  size="medium" class="paper-btn paper-btn-blue" @click="submitForm">确定</el-button>
      </p>
    </el-dialog>
    <!-- 票据编号弹层 -->
    <el-dialog
      :title="!paperType?'票据详情':'开票信息填写'"
      :visible.sync="paperShow"
      width="1000px"
      class="layer-paper"
      @close="propCloseFn">
      <div class="paper-edit-box" v-if="paperType">
        <ul>
          <li>
            <p><label>合同编号:</label><span>{{paperInfoData.contCode}}</span></p>
            <p><label>物业地址:</label><span>{{paperInfoData.address}}</span></p>
          </li>
          <li>
            <p><label>交款单位:</label><span>{{paperInfoData.payer}}</span></p>
            <p><label>合计金额:</label><span>{{paperInfoData.proceedsAmount}}元</span></p>
          </li>
          <li v-for="(item,index) in moneyTypes" :key="index">
            <label class="checkbox-info iconfont" :class="[item.check?'active':'']" @click="item.check=!item.check"></label>
            <div class="type-list">
              <p><label>款类：</label><span>{{item.typeName}}</span></p>
              <p><label>金额：</label><span>{{item.amount}}</span></p>
              <div class="input-group">
                <label>开票项目：</label>
                <el-select class="w120" size="small" v-model="item.project" placeholder="请选择">
                  <el-option
                    v-for="item in dictionary['542']"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key">
                  </el-option>
                </el-select>
              </div>
              <p><label class="checkbox-info iconfont" :class="[item.addressHidden?'active':'']" @click="item.addressHidden=!item.addressHidden"></label><span>隐藏物业地址</span></p>
              <p><label>票据编号：</label><span>{{item.billCode}}</span></p>
            </div>
          </li>
        </ul>
        <el-button round  size="medium" class="paper-btn paper-btn-blue paper-btn-float" @click="billing">确定开票</el-button>
      </div>
      <div class="paper-watch-tab" v-if="paperType">
        <p>票据预览</p>
        <ul v-if="moneyTypes.length>1">
          <li v-for="(item,index) in moneyTypes" :key="index" :class="[index===activeType?'active':'']" @click="activeType=index">{{item.typeName}}</li>
        </ul>
      </div>
      <LayerPaperInfo
        :number="paperInfoData.contCode"
        :name="paperInfoData.payerName"
        :collectionTime="paperInfoData.paymentTime"
        :invoiceTime="paperInfoData.createTime"
        :paper="paperInfoData.billCode"
        :project="paperInfoData.type"
        :hide="paperInfoData.hide"
        :address="paperInfoData.address"
        :money="paperInfoData.amount"
        :moneyZh="paperInfoData.amountZh"
        :create="paperInfoData.createByName"
        :rules="paperInfoData.remark"
        :payerType="paperInfoData.payerType"
      ></LayerPaperInfo>
      <p slot="footer">
        <el-button round  size="medium" class="paper-btn">取消</el-button>
        <el-button round  size="medium" class="paper-btn paper-btn-blue" @click="printPaper">打印</el-button>
      </p>
    </el-dialog>
  </div>
</template>

<script>
  import {FILTER} from "@/assets/js/filter";
  import {MIXINS} from "@/assets/js/mixins";
  import ScreeningTop from '@/components/ScreeningTop';
  import LayerInvoice from '@/components/LayerInvoice';
  import LayerPaperInfo from '@/components/LayerPaperInfo';

  export default {
    mixins: [FILTER, MIXINS],
    data() {
      return {
        // 列表数据
        tableData: [],
        // 筛选条件
        propForm: {
          depId: '',
          empId: '',
          keyword: '',
          state: '',
          dateType: '',
          timeRange: '',
        },
        //分页
        pageSize: 10,
        pageNum: 1,
        total: 0,
        // 筛选选项
        dictionary: {
          '33': '',
          '542': ''
        },
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
        paperShow: false,
        paperType:false,//false预览 true开票
        paperInfoData: {},//票据对象
        moneyTypes:[],//临时存放勾选的款类
        activeType:0,//当前预览项
      }
    },
    computed: {
      invalidNumber() {
        return this.layer.reason.length
      }
    },
    created() {
      this.getData()
      this.getDictionary()
    },
    methods: {
      reset: function () {
        this.$tool.clearForm(this.propForm)
      },
      getData: function () {
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
            this.tableData = res.data.list
          }
        })
      },
      btnOpera: function (row,type) {
        this.activeRow = Object.assign({},row)
        if(type===4){
          this.paperShow = true
          this.paperType = true
          this.paperList()
          return
        }else {
          this.layer.show = true
        }
        switch (type) {
          case 1:
            this.layer.title = '票据核销'
            this.layer.msg = '确认要核销该票据吗?'
            break
          case 2:
            this.layer.title = '票据回收'
            this.layer.msg = '确认要收回该票据吗?'
            break
          case 3:
            this.layer.title = '票据作废'
            break
        }
      },
      // 编号操作
      cellOpera(type,row) {
        if (type === 'contract') {

        } else if (type === 'paper') {
          this.getPaperDetails(row)
        } else {

        }
      },
      // 获取开票列表
      paperList:function () {
        this.$ajax.get('/api/bills/tobe',{/*id:this.activeRow.proceedsId*/id:21}).then(res=>{
          res=res.data
          if(res.status===200){
            this.paperInfoData=Object.assign({},res.data)
            let obj = JSON.parse(JSON.stringify(res.data))
            this.moneyTypes=[].concat(obj.list)
            this.moneyTypes.forEach((item,index)=>{
              let obj = Object.assign({
                check:true,
                addressHidden:false,
                project:''
              },item)
              this.moneyTypes.splice(index,1,obj)
            })
          }
        })
      },
      // 弹层关闭
      propCloseFn() {
        this.$tool.clearForm(this.layer)
        this.paperType = false
      },
      // dialog确定
      submitForm:function () {
        debugger
        console.log(this.activeRow)
        let param = {
          id:this.activeRow.id
        }
        switch (this.layer.title){
          case '票据核销':
            param.state = 3
            break
          case '票据回收':
            param.state = 4
            break
          case '票据作废':
            param.state = 5
            param.reason = this.layer.reason
            break
        }
        this.$ajax.put('/api/bills/state',param).then(res=>{
          res=res.data
          if(res.status===200){
            this.layer.show=false
            this.getData()
          }
        })
      },
      /**
       * 票据详情
       * @param row
       */
      getPaperDetails:function (row) {
        this.$ajax.get(`/api/bills/${row.id}`).then(res=>{
          res=res.data
          if(res.status===200){
            this.paperInfoData=Object.assign({},res.data)
            this.paperShow = true
          }
        })
      },
      billing:function () {
        let param = this.moneyTypes[this.activeType]
        let obj = {
          createTime:'',
          billCode:param.billCode,
          hide:param.addressHidden,
          amount:param.amount,
          amountZh:param.amountZh,
          createByName:this.paperInfoData.createBy,
          remark:param.remark
        }
        this.dictionary['542'].find(item=>{
          if(item.key===param.project){
            obj.type=item.value
          }
        })
        this.paperInfoData=Object.assign({},this.paperInfoData,obj)
      },
      // 票据详情 打印
      printPaper() {
        let type = this.moneyTypes[this.activeType]
        let obj={
          code:this.activeRow.billCode,
          payId:this.activeRow.proceedsId,
          payDetailsId:type.payDetailsId,
          isHiddenAddress:type.addressHidden,
          billType:type.project
        }
        this.$ajax.post('/api/bills/print',obj).then(res=>{
          debugger
        })
      }
    },
    components: {
      ScreeningTop,
      LayerInvoice,
      LayerPaperInfo
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/less/lsx.less";
  .checkbox-info{
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid @border-e6;
    &.active{
      position: relative;
      color: @color-blue;
      &:after{
        content: '\e65d';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
      }
    }
  }

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
      font-size: @size-24;
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
