<template>
  <div class="view">
    <ScreeningTop @propResetFormFn="reset" @propQueryFn="getData">
      <div class="content">
        <div class="input-group">
          <label>合同类型:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.contType" placeholder="请选择">
            <el-option
              v-for="item in dictionary['10']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>查询时间:</label>
          <div class="time-picker">
            <el-select :clearable="true" size="small" v-model="searchForm.timeType" placeholder="请选择">
              <el-option
                v-for="item in $tool.dropdown.dateType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-date-picker
              v-model="searchForm.timeRange"
              type="daterange"
              size="small"
              class="margin-left"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
        <div class="input-group">
          <label>部门:</label>
          <el-select
            :clearable="true"
            ref="tree"
            size="small"
            filterable remote
            :loading="Loading"
            :remote-method="remoteMethod"
            @visible-change="initDepList"
            @clear="clearDep"
            v-model="searchForm.depName"
            placeholder="请选择">
            <el-option class="drop-tree" value="">
              <el-tree :data="DepList" :props="defaultProps" @node-click="depHandleClick"></el-tree>
            </el-option>
          </el-select>
          <el-select :clearable="true" v-loadmore="moreEmploye" class="margin-left" size="small"
                     v-model="searchForm.empId" placeholder="请选择">
            <el-option
              v-for="item in EmployeList"
              :key="item.empId"
              :label="item.name"
              :value="item.empId">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>票据状态:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.billStatus" placeholder="请选择">
            <el-option
              v-for="item in dictionary['33']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>收款账户:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.proAccount" placeholder="请选择">
            <el-option
              v-for="item in dictionary['32']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>收付状态:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.checkStatus" placeholder="请选择">
            <el-option
              v-for="item in dictionary['23']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>收付款类:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.moneyType" placeholder="请选择">
            <el-option
              v-for="item in drop_MoneyType"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>收付方式:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.payMethod" placeholder="请选择">
            <el-option
              v-for="item in dictionary['24']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>关键字:</label>
          <el-input class="w394" :clearable="true" size="small" v-model="searchForm.keyword"
                    placeholder="合同编号/房源编号/客源编号/物业地址/业主/客户/手机号"></el-input>
        </div>
      </div>
    </ScreeningTop>
    <div class="view-context">
      <div class="table-tool">
        <div class="tool-left">
          <h4 class="f14"><i class="iconfont icon-tubiao-11"></i>数据列表</h4>
          <ul>
            <li>
              收款<span>{{tableTotal.ProceedsCount|zeroFormatter}}</span>笔，总额<span>{{tableTotal.ProceedsSum|zeroFormatter}}</span>元；
            </li>
            <li>
              付款<span>{{tableTotal.payMentCount|zeroFormatter}}</span>笔，总额<span>{{tableTotal.payMentSum|zeroFormatter}}</span>元；
            </li>
            <li>
              账户余额：<span>{{tableTotal.balance|zeroFormatter}}</span>元
            </li>
          </ul>
        </div>
        <p>
          <el-button class="btn-info" round type="primary" size="small">导出</el-button>
        </p>
      </div>
      <el-table border :data="list" style="width: 100%" header-row-class-name="theader-bg" @row-dblclick="toDetails">
        <el-table-column align="center" min-width="160" label="收付ID" prop="payCode"
                         :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="合同信息" min-width="200px" prop="cityName" :formatter="nullFormatter">
          <template slot-scope="scope">
            <ul class="contract-msglist">
              <li>合同编号:<span @click="toLink(scope.row,'cont')">{{scope.row.contCode}}</span></li>
              <li>房源编号:<span>{{scope.row.houseCode}}</span><span>{{scope.row.houseOwner}}</span></li>
              <li>客源编号:<span>{{scope.row.custCode}}</span><span>{{scope.row.custName}}</span></li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="160" label="物业地址" prop="address"
                         :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="合同类型" prop="contType" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="款类" prop="moneyType" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="收付方式" prop="method" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="对象">
          <template slot-scope="scope">
            <span>{{scope.row.type===1?scope.row.outObjType:scope.row.inObjType|getLabel}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款人" min-width="140">
          <template slot-scope="scope">
            <span>{{scope.row.store}}</span>
            <p>{{scope.row.type===1?scope.row.inObjName:scope.row.createByName}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="金额（元）" prop="amount" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="刷卡手续费" prop="fee" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="收付时间" prop="createTime" :formatter="nullFormatter" min-width="140">
          <template slot-scope="scope">
            <span>{{scope.row.createTime|formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="入账时间" prop="toAccountTime" :formatter="nullFormatter" min-width="140">
          <template slot-scope="scope">
            <span>{{scope.row.toAccountTime|formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收付状态" prop="payStatus"></el-table-column>
        <el-table-column align="center" label="结算信息">
          <template slot-scope="scope">
            <span>{{scope.row.moneyType}}{{scope.row.amount}}元</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="票据状态">
          <template slot-scope="scope">
            {{scope.row|billState}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" min-width="160">
          <template slot-scope="scope">
            <template v-if="scope.row.type===1&&((power['sign-cw-debt-invoice'].state&&(scope.row.payStatus==='已通过'||scope.row.payStatus==='已到账')&&scope.row.billStatus&&(scope.row.billStatus.value===1||scope.row.billStatus.value===4)||(scope.row.caozuo===1&&(power['sign-cw-debt-edit'].state||power['sign-cw-debt-void'].state))))">
              <el-button type="text" @click="btnOpera(scope.row,3)"
                         v-if="power['sign-cw-debt-invoice'].state&&(scope.row.payStatus==='已通过'||scope.row.payStatus==='已到账')&&scope.row.billStatus&&(scope.row.billStatus.value===1||scope.row.billStatus.value===4)">
                开票
              </el-button>
              <template v-if="scope.row.caozuo===1&&(power['sign-cw-debt-edit'].state||power['sign-cw-debt-void'].state)">
                <el-button type="text" @click="btnOpera(scope.row,1)" v-if="power['sign-cw-debt-edit'].state">修改</el-button>
                <el-button type="text" @click="btnOpera(scope.row,2)" v-if="power['sign-cw-debt-void'].state">作废</el-button>
              </template>
              <!--<span v-else>&#45;&#45;</span>-->
            </template>
            <template v-else-if="scope.row.type===2&&scope.row.caozuo===1&&(power['sign-cw-debt-edit'].state||power['sign-cw-debt-void'].state)">
              <el-button type="text" @click="btnOpera(scope.row,1)" v-if="power['sign-cw-debt-edit'].state">修改</el-button>
              <el-button type="text" @click="btnOpera(scope.row,2)" v-if="power['sign-cw-debt-void'].state">作废</el-button>
            </template>
            <template v-else>
              --
            </template>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="list.length>0"
        class="pagination-info"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!-- 票据编号弹层 -->
    <layer-invoice ref="layerInvoice" @emitPaperSet="emitPaperSetFn"></layer-invoice>
    <!--作废-->
    <el-dialog
      title="作废"
      :visible.sync="layer.show"
      :closeOnClickModal="$tool.closeOnClickModal"
      width="740px">
      <div class="delete-dialog" v-if="layer.content.length>0">
        <p>是否作废该{{layer.content[0].type===1?'收款单':'付款单'}}</p>
        <el-table border :data="layer.content" style="width: 100%" header-row-class-name="theader-bg" key="other">
          <el-table-column align="center" min-width="120" label="收付编号" prop="payCode"
                           :formatter="nullFormatter"></el-table-column>
          <el-table-column align="center" :label="layer.content[0].type===1?'收款金额':'付款金额'" prop="cityName"
                           :formatter="nullFormatter">
            <template slot-scope="scope">
              <span>{{scope.row.amount}}元</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="layer.content[0].type===1?'付款方':'收款方'" prop="cityName"
                           :formatter="nullFormatter">
            <template slot-scope="scope">
              <span>{{scope.row.type===1?scope.row.outObjType.label:scope.row.inObjType.label}}-{{scope.row.type===1?scope.row.outObjName:scope.row.inObjName}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button size="small" class="btn-info" round @click="layer.show = false">返 回</el-button>
    <el-button size="small" class="btn-info" round type="primary" @click="deleteBill">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {FILTER} from "@/assets/js/filter";
  import {MIXINS} from "@/assets/js/mixins";
  import LayerPaperInfo from '@/components/LayerPaperInfo';
  import LayerInvoice from '@/components/LayerInvoice'

  export default {
    mixins: [MIXINS, FILTER],
    components: {
      LayerPaperInfo,
      LayerInvoice
    },
    data() {
      return {
        activeView: '',
        searchForm: {
          contType: '',
          timeType: '',
          depName: '',
          depId: '',
          empId: '',
          billStatus: '',
          proAccount: '',
          checkStatus: '',
          moneyType: '',
          payMethod: '',
          keyword: '',
          timeRange: '',
        },
        tableTotal: {},
        list: [],
        dictionary: {
          '10': '',
          '33': '',
          '32': '',
          '23': '',
          '24': '',
          '25': '',
          '507': '',
          '542': ''
        },
        drop_MoneyType: [],
        //分页
        total: 0,
        currentPage: 1,
        pageSize: 10,
        //开票
        paperShow: false,
        paperInfoData: {},//票据对象
        moneyTypes: [],//临时存放勾选的款类
        activeType: 0,//当前预览项
        //作废
        layer: {
          show: false,
          content: []
        },
        //权限配置
        power: {
          'sign-cw-debt-query': {
            state: false,
            name: '查询'
          },
          'sign-cw-debt-export': {
            state: false,
            name: '导出'
          },
          'sign-cw-debt-invoice': {
            state: false,
            name: '开票'
          },
          'sign-cw-debt-edit': {
            state: false,
            name: '修改'
          },
          'sign-cw-debt-void': {
            state: false,
            name: '作废'
          },
          'sign-cw-debt-rev-verify': {
            state: false,
            name: '收款审核'
          },
          'sign-cw-debt-pay-verify': {
            state: false,
            name: '付款审核'
          },
          'sign-cw-debt-contract': {
            state: false,
            name: '合同详情'
          },
          'sign-cw-debt-house': {
            state: false,
            name: '房源详情'
          },
          'sign-cw-debt-cust': {
            state: false,
            name: '客源详情'
          }
        }
      }
    },
    created() {
      console.log(this.getUser)
      for (let item in this.power){
        if(this.getUser){
          if(this.getUser.privileges.indexOf(item)>-1){
            this.power[item].state=true
          }
        }
      }
      this.getData()
      this.getDictionary()
      this.getMoneyTypes()
      this.remoteMethod()
      // this.getAdmin()
    },
    methods: {
      reset: function () {
        this.$tool.clearForm(this.searchForm)
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val
        this.getData()
      },
      initDepList: function (val) {
        if (!val) {
          this.remoteMethod()
        }
      },
      clearDep: function () {
        this.searchForm.depId = ''
        this.searchForm.depName = ''
        // this.EmployeList=[]
        this.searchForm.empId = ''
        this.clearSelect()
      },
      depHandleClick(data) {
        // this.getEmploye(data.depId)
        this.searchForm.depId = data.depId
        this.searchForm.depName = data.name
        this.searchForm.empId = ''

        this.handleNodeClick(data)
      },
      getData: function () {
        debugger
        if(this.power['sign-cw-debt-query'].state){
          let param = JSON.parse(JSON.stringify(this.searchForm))
          if (typeof param.timeRange === 'object' && Object.prototype.toString.call(param.timeRange) === '[object Array]') {
            param.startTime = param.timeRange[0]
            param.endTime = param.timeRange[1]
          }
          delete param.timeRange
          param.pageNum = this.currentPage
          param.pageSize = this.pageSize
          this.$ajax.get('/api/payInfo/selectPayInfoList', param).then(res => {
            res = res.data
            if (res.status === 200) {
              this.list = res.data.page.list
              this.total = res.data.page.total
              this.tableTotal = Object.assign({}, res.data.payMentDataList, res.data.paymentDataList, {balance: res.data.balance})
            }
          }).catch(error => {
            console.log(error)
          })
        }else {
          this.noPower(this.power['sign-cw-debt-query'].name)
        }
      },
      /**
       * 跳转详情页
       * @param row
       */
      toDetails: function (row) {
        if (row.payStatus === '未付款') {
          this.btnOpera(row, 1)
        } else {
          this.setPath(this.getPath.concat({name: row.type === 1 ? '收款详情' : '付款详情'}))
          this.$router.push({
            path: 'billDetails',
            query: {
              id: row.id,
              tab: row.type === 1 ? '收款信息' : '付款信息',
              power: this.power[row.type===1?'sign-cw-debt-rev-verify':'sign-cw-debt-pay-verify'].state
            }
          })
        }
      },
      btnOpera: function (row, type) {
        if (type === 1) {
          this.setPath(this.getPath.concat({name: row.type === 1 ? '编辑收款' : '编辑付款'}))
          this.$router.push({
            path: row.type === 1 ? 'receiptBill' : 'payBill',
            query: {
              edit: row.type,
              id: row.id,
              type: row.type === 1 ? row.inAccountType : '-1',
              contId: row.contId
            }
          })
        } else if (type === 2) {
          this.layer.show = true
          this.layer.content = [].concat(row)
        } else if (type === 3) {
          this.$refs.layerInvoice.show(row.id, true)
        }
      },
      //作废
      deleteBill: function () {
        this.$ajax.put('/api/payInfo/updateCheckStatus', {payId: this.layer.content[0].id}, 2).then(res => {
          res = res.data
          if (res.status === 200) {
            this.getData()
            this.layer.show = false
            this.$message({
              message: '作废成功'
            })
          }
        }).catch(error => {
          this.$message({
            message: error
          })
        })
      },
      emitPaperSetFn: function (payload) {
        this.getData()
        // this.$refs.layerInvoice.propCloseFn()
      },
      /**
       * 合同信息操作
       * @param type
       */
      toLink:function (row,type) {
        let param={
          contType:row.contTypeId,
          contId:row.contId,
          contCode:row.contCode,
          operaType:type,
          power:type==='cont'?this.power['sign-cw-debt-contract']:type==='house'?this.power['sign-cw-debt-house']:type==='customer'?this.power['sign-cw-debt-cust']:''
        }
        this.msgOpera(param)
      },
      /*msgOpera: function (row, type) {
        if (type === 'cont'&&this.power['sign-cw-debt-contract'].state) {
          // this.setPath(this.getPath.concat({name:'合同详情'}))
          this.setPath(this.$tool.getRouter(['合同', '合同列表', '合同详情'], 'contractList'))
          this.$router.push({
            path: row.contTypeId === this.$tool.contType['4'] || row.contTypeId === this.$tool.contType['5'] ? 'detailIntention' : 'contractDetails',
            query: {
              contType: row.contTypeId,
              id: row.contId,
              code: row.contCode,
              pageName: '合同详情'
            }
          })
        }
      },*/
      // 获取收付款类
      getMoneyTypes: function () {
        this.$ajax.get('/api/payInfo/selectSmallMoneyType').then(res => {
          res = res.data
          if (res.status === 200) {
            this.drop_MoneyType = res.data
          }
        })
      },
    },
    filters: {
      zeroFormatter: function (val) {
        if (!val) {
          return 0
        } else {
          return val
        }
      },
      billState: function (val) {
        if (!val) {
          return '--'
        } else {
          if (val.type === 2) {
            return '--'
          } else {
            return val.billStatus.label
          }
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
  @import "~@/assets/less/lsx.less";

  .margin-left-10 {
    margin-left: 10px;
  }

  .checkbox-info {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid @border-e6;
    &.active {
      position: relative;
      color: @color-blue;
      &:after {
        content: '\e65d';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }

  .layer-paper {
    .center {
      text-align: center;
    }
    .paper-btn-blue {
      color: @color-white;
    }
    .paper-btn-float {
      position: absolute;
      right: 0;
      bottom: 20px;
    }
  }

  .paper-edit-box {
    margin: 0 40px;
    padding: 20px 0 80px;
    border-bottom: 1px solid @border-D8;
    position: relative;
    > ul {
      &:first-of-type {
        > li {
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          > label {
            margin-right: 10px;
          }
          &:first-of-type, &:nth-of-type(2) {
            > p {
              &:first-of-type {
                width: 200px;
              }
            }
          }
          &:last-of-type {
            margin-bottom: 0px;
          }
        }
      }
    }
    .type-list {
      display: flex;
      > p {
        min-width: 140px;
        margin-right: 20px;
        display: inherit;
        align-items: center;
        > label.checkbox-info {
          margin-right: 10px;
        }
      }
      .input-group {
        margin-bottom: 0;
        margin-right: 20px;
      }
    }
  }

  .paper-watch-tab {
    > p {
      color: @color-blue;
      text-align: center;
      font-weight: bold;
      margin: 32px;
    }
    > ul {
      display: flex;
      justify-content: center;
      margin-bottom: 26px;
      > li {
        border-top: 2px solid @color-blue;
        border-bottom: 2px solid @color-blue;
        min-width: 100px;
        height: 36px;
        display: inherit;
        align-items: center;
        justify-content: center;
        &:first-of-type {
          border-left: 2px solid @color-blue;
          border-top-left-radius: 18px;
          border-bottom-left-radius: 18px;
        }
        &:last-of-type {
          border-right: 2px solid @color-blue;
          border-top-right-radius: 18px;
          border-bottom-right-radius: 18px;
        }
        &.active {
          background-color: @color-blue;
          color: @color-white;
        }
      }
    }
  }

  .contract-msglist {
    > li {
      text-align: left;
      > span {
        &:first-of-type {
          color: @color-blue;
          margin-right: 10px;
          cursor: pointer;
        }
      }
    }
  }

  .delete-dialog {
    > p {
      text-align: center;
      margin-bottom: @margin-10;
      font-size: @size-16;
    }
  }

  .view-header {
    .title {
      position: relative;
      height: 60px;
      display: flex;
      align-items: center;
      > p {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
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
  }

  .view-context {
    background-color: @color-white;
    padding: 0 @margin-10 @margin-10;
    /deep/ .theader-bg {
      > th {
        background-color: @bg-th;
      }
    }
    .table-tool {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: @margin-base 0;
      .tool-left {
        display: inherit;
        align-items: center;
        > h4 {
          > i {
            margin-right: 8px;
          }
        }
        > ul {
          display: flex;
          margin-left: 20px;
          > li {
            color: @color-6c;
            > span {
              color: @color-red;
            }
          }
        }
      }
      /*>p{
        position: absolute;
        top: 50%;
        right: 0;
        transform:translateY(-50%);
      }*/
    }
  }
</style>

