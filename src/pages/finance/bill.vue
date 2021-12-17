<template>
  <div class="view" ref="tableComView">
    <ScreeningTop @propResetFormFn="reset" @propQueryFn="getData('search')">
      <div class="content">
        <div class="input-group">
          <label>关键字:</label>
          <el-tooltip
            content="合同编号/纸质合同编号/房源编号/客源编号/物业地址/业主/客户/手机号/收付ID"
            placement="top"
          >
            <el-input
              class="w200"
              :clearable="true"
              size="small"
              v-model="searchForm.keyword"
              placeholder="请输入"
            >
            </el-input>
          </el-tooltip>
        </div>
        <div class="input-group">
          <label>合同类型:</label>
          <el-select
            :clearable="true"
            class="width200"
            :class="{ width325: searchForm.contType.length > 3 }"
            multiple
            size="small"
            v-model="searchForm.contType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in dictionary['10']"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>查询时间:</label>
          <div class="time-picker">
            <el-select
              :clearable="true"
              size="small"
              v-model="searchForm.timeType"
              placeholder="请选择"
            >
              <el-option
                v-for="item in $tool.dropdown.dateType_money"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-date-picker
              v-model="searchForm.timeRange"
              :disabled="!searchForm.timeType"
              type="daterange"
              size="small"
              class="margin-left"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </div>
        </div>
        <div class="input-group">
          <label>部门:</label>
          <div>
            <select-tree
              :data="DepList"
              :init="searchForm.depName"
              @checkCell="depHandleClick"
              @clear="clearDep"
              @search="searchDep"
            ></select-tree>
          </div>
          <!--<el-select
            class="w200"
            :clearable="true"
            ref="tree"
            size="small"
            :loading="Loading"
            :remote-method="remoteMethod"
            @visible-change="initDepList"
            @clear="clearDep"
            v-model="searchForm.depName"
            placeholder="请选择">
            <el-option class="drop-tree" value="">
              <el-tree :data="DepList" :props="defaultProps" @node-click="depHandleClick"></el-tree>
            </el-option>
          </el-select>-->
          <!-- <el-select
            :clearable="true"
            class="margin-left"
            size="small"
            v-loadmore="moreEmploye"
            v-model="searchForm.empId"
            @change="handleEmpNodeClick"
            placeholder="请选择"
          >-->
          <el-select
            :clearable="true"
            filterable
            remote
            :remote-method="test"
            v-loadmore="moreEmploye"
            @visible-change="empHandle"
            class="margin-left"
            size="small"
            v-model="searchForm.empName"
            placeholder="请选择"
            @change="empHandleAdd"
            @clear="clearDep"
          >
            <el-option
              v-for="item in EmployeList"
              :key="item.empId"
              :label="item.name"
              :value="item.empId + '/' + item.depName + '/' + item.depId"
            ></el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>票据状态:</label>
          <el-select
            :clearable="true"
            size="small"
            v-model="searchForm.billStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="item in dictionary['56']"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>收款账户:</label>
          <el-select
            :clearable="true"
            size="small"
            v-model="searchForm.proAccount"
            placeholder="请选择"
          >
            <el-option
              v-for="item in dictionary['32']"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>收付状态:</label>
          <el-select
            :clearable="true"
            size="small"
            v-model="searchForm.checkStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="item in dictionary['23']"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>收付款类:</label>
          <el-select
            :clearable="true"
            size="small"
            v-model="searchForm.moneyType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in drop_MoneyType"
              :key="item.id"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>收付方式:</label>
          <el-select
            :clearable="true"
            size="small"
            v-model="searchForm.payMethod"
            placeholder="请选择"
          >
            <el-option
              v-for="item in dictionary['24']"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>收付对象:</label>
          <el-select
            :clearable="true"
            size="small"
            v-model="searchForm.payObjType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in dictionary['57']"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>合作方式:</label>
          <el-select
            :clearable="true"
            size="small"
            v-model="searchForm.cooperation"
            placeholder="请选择"
          >
            <el-option
              v-for="item in dictionary['53']"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>签约方式:</label>
          <el-select
            :clearable="true"
            size="small"
            v-model="searchForm.recordType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in dictionary['64']"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>收款方式:</label>
          <el-select
            :clearable="true"
            size="small"
            v-model="searchForm.payway"
            placeholder="请选择"
          >
            <el-option
              v-for="item in dictionary['69']"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>有/无合同：</label>
          <el-select
            :clearable="true"
            size="small"
            v-model="searchForm.hasCont"
            placeholder="请选择"
          >
            <el-option
              v-for="item in dictionary['792']"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>转款审核状态：</label>
          <el-select
            :clearable="true"
            size="small"
            v-model="searchForm.zkAuditState"
            placeholder="请选择"
          >
            <el-option
              v-for="item in dictionary['77']"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>结算状态：</label>
          <el-select
            size="small"
            placeholder="请选择"
            v-model="searchForm.settleStatus"
          >
            <el-option
              v-for="item in settleStatusOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>结算时间：</label>
          <el-date-picker
            v-model="settleStatusTimeRange"
            type="daterange"
            size="small"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
      </div>
    </ScreeningTop>
    <div class="view-context" ref="box">
      <div class="table-tool">
        <div class="tool-left">
          <h4 class="f14"><i class="iconfont icon-tubiao-11"></i>数据列表</h4>
          <ul>
            <li>
              收款 <span>{{ tableTotal.ProceedsCount | zeroFormatter }}</span
              >笔，总额 <span>{{ tableTotal.ProceedsSum | zeroFormatter }}</span
              >元；
            </li>
            <li>
              付款 <span>{{ tableTotal.payMentCount | zeroFormatter }}</span
              >笔，总额 <span>{{ tableTotal.payMentSum | zeroFormatter }}</span
              >元；
            </li>
            <li>
              账户余额： <span>{{ tableTotal.balance | zeroFormatter }}</span
              >元；
            </li>
            <li>
              刷卡手续费总计：
              <span>{{ tableTotal.sumFees | zeroFormatter }}</span
              >元；
            </li>
          </ul>
        </div>
        <p>
          <el-button
            v-if="power['sign-cw-debt-whtfk'].state"
            class="btn-info"
            round
            type="primary"
            size="small"
            @click="toPayPages()"
            >付款</el-button
          >
          <el-button
            v-if="power['sign-cw-debt-whtsk'].state"
            class="btn-info"
            round
            type="primary"
            size="small"
            @click="getCollectMoney"
            >收款</el-button
          >
          <el-button
            class="btn-info"
            round
            type="primary"
            size="small"
            @click="getData('getExcel')"
            v-if="power['sign-cw-debt-export'].state"
            v-dbClick
            >导出</el-button
          >
        </p>
      </div>
      <el-table
        ref="tableCom"
        :max-height="tableNumberCom"
        border
        :data="list"
        header-row-class-name="theader-bg"
        class="info-scrollbar"
        style="width: 100%"
        @row-dblclick="toDetails"
      >
        <el-table-column
          min-width="120"
          label="收付ID"
          prop="payCode"
          :formatter="nullFormatter"
        ></el-table-column>
        <el-table-column
          label="合同信息"
          min-width="180"
          prop="cityName"
          :formatter="nullFormatter"
        >
          <template slot-scope="scope">
            <ul class="contract-msglist">
              <li>
                合同:
                <span @click="toLink(scope.row, 'cont')">{{
                  scope.row.contCode
                }}</span>
              </li>
              <li class="code-paper" v-if="scope.row.recordType.value === 2">
                纸质合同编号:
                <span @click="toLink(scope.row, 'cont')">{{
                  scope.row.paperCode | getLabel
                }}</span>
              </li>
              <li>
                房源: <span>{{ scope.row.houseCode }}</span>
                <span>{{ scope.row.houseOwner }}</span>
              </li>
              <li>
                客源: <span>{{ scope.row.custCode }}</span>
                <span>{{ scope.row.custName }}</span>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column
          min-width="140"
          label="票据编号"
          prop="billCode"
          :formatter="nullFormatter"
        ></el-table-column>
        <el-table-column min-width="160" label="物业地址">
          <template slot-scope="scope">
            <span v-if="scope.row.address.length === 0">--</span>
            <template v-else>
              <p>{{ scope.row.address.split(" ")[0] }}</p>
              <p>{{ scope.row.address.split(" ")[1] }}</p>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          min-width="60"
          label="合同类型"
          prop="contType"
          :formatter="nullFormatter"
        ></el-table-column>
        <el-table-column
          min-width="60"
          label="签约方式"
          prop="recordType.label"
          :formatter="nullFormatter"
        >
        </el-table-column>
        <el-table-column
          min-width="80"
          label="款类"
          prop="moneyType"
          :formatter="nullFormatter"
        ></el-table-column>
        <el-table-column min-width="100" label="收付方式">
          <template slot-scope="scope">
            <p v-if="scope.row.payway && scope.row.payway.value !== 4">
              收款-{{ scope.row.pay_type == 1 ? "手机扫码" : "pos刷卡支付" }}
            </p>
            <template v-else>
              <p v-for="(item, index) in scope.row.method" :key="index">
                {{ item }}
              </p>
            </template>
          </template>
        </el-table-column>
        <el-table-column min-width="80" label="收付状态" prop="payStatus">
          <template slot-scope="scope">
            <span v-if="scope.row.payStatusValue !== 10">{{
              scope.row.payStatus | getLabel
            }}</span>
            <span class="text-warning" v-else @click="getErrorMsg(scope.row)">{{
              scope.row.payStatus | getLabel
            }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="60" label="对象">
          <template slot-scope="scope">
            <span
              >{{
                scope.row.type === 1 || scope.row.type === 8
                  ? scope.row.outObjType
                  : scope.row.inObjType | getLabel
              }}-{{
                scope.row.type === 1 || scope.row.type === 8
                  ? scope.row.outObjName
                  : scope.row.inObjName
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="收/付/转款人" min-width="120">
          <template slot-scope="scope">
            <template
              v-if="scope.row.isZK && scope.row.isZK.toString() === 'true'"
            >
              {{ scope.row.store + "-" + scope.row.createByName }}
            </template>
            <template v-else>
              <span>{{
                scope.row.type === 1 || scope.row.type === 8
                  ? scope.row.inObjStore
                  : scope.row.store
              }}</span>
              <p>
                {{
                  scope.row.type === 1 || scope.row.type === 8
                    ? scope.row.inObjName
                    : scope.row.createByName
                }}
              </p>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          min-width="80"
          label="收款方式"
          prop="payway"
          :formatter="nullFormatter"
        ></el-table-column>
        <el-table-column min-width="80" label="金额（元）">
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.amoutList" :key="index">
              {{ item.amount }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          min-width="80"
          label="线上手续费（元）"
          prop="xsFee"
          :formatter="nullFormatter"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.payway && scope.row.payway.value !== 4">{{
              scope.row.xsFee
            }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column min-width="80" label="线下手续费（元）">
          <template slot-scope="scope">
            <template v-if="scope.row.payway && scope.row.payway.value === 4">
              <p v-for="(item, index) in scope.row.amoutList" :key="index">
                {{ item.fee }}
              </p>
            </template>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <!--        <el-table-column min-width="60" label="刷卡手续费" prop="systemFee" :formatter="nullFormatter"></el-table-column>-->
        <el-table-column
          label="创建时间"
          prop="createTime"
          :formatter="nullFormatter"
          min-width="90"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | formatTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="到账时间"
          prop="toAccountTime"
          :formatter="nullFormatter"
          min-width="90"
        >
          <template slot-scope="scope">
            <template
              v-if="
                scope.row.payStatus.value == 3 ||
                  scope.row.payStatus.value == 11
              "
            >
              <span>--</span>
            </template>
            <template v-else>
              <span>{{ scope.row.toAccountTime | formatTime }}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="退款时间"
          prop="refundDate"
          :formatter="nullFormatter"
          min-width="90"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.refundDate | formatTime }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column min-width="80" label="转款审核状态" prop="payStatus">
          <template slot-scope="scope">
            <span v-if="scope.row.payStatus.value===11">已驳回</span>
            <span v-else-if="scope.row.payStatus.value===3">审核中</span>
            <span v-else>已通过</span>
          </template>
        </el-table-column> -->
        <el-table-column min-width="90" label="结算信息">
          <template slot-scope="scope">
            <span>{{ scope.row.moneyType }}{{ scope.row.amount }}元</span>
          </template>
        </el-table-column>
        <el-table-column min-width="90" label="结算状态">
          <template slot-scope="scope">
            <span>{{ scope.row.settleStatusValue || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="90" label="结算时间">
          <template slot-scope="scope">
            <span>{{ scope.row.examineDate | formatTime }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="80" label="票据状态">
          <template slot-scope="scope">{{ scope.row | billState }}</template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          min-width="120"
          class-name="null-formatter operation-btns"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.status != 4">
              <template
                v-if="
                  power['sign-cw-bill-invoice'].state && scope.row.isDel === 1 //权限+未删除
                "
              >
                <!-- 线下收款 -->
                <el-button
                  type="text"
                  @click="btnOpera(scope.row, 3)"
                  v-if="
                    ((scope.row.type === 1 || scope.row.type === 8) && //支付状态等于(付款-已通过||付款-已通过-支付成功)
                    scope.row.billStatus &&
                    (scope.row.billStatus.value === 1 ||
                      scope.row.billStatus.value === 4) && //票据状态等于(未开票||已作废)
                      scope.row.payStatusValue !== 4 &&
                      scope.row.payStatusValue !== 11 &&
                      scope.row.payway &&
                      scope.row.payway.value === 4) || //收付状态不等于(收款-未付款&&收款-收款失败)+线下转款
                      (scope.row.isDeal == 3 &&
                        scope.row.billStatus.value != 2 &&
                        scope.row.payStatusValue !== 11 &&
                        scope.row.payway &&
                        scope.row.payway.value === 4 &&
                        scope.row.payStatus.value !== 11) //转入收款+未开票+线下转款
                  "
                  >开票
                </el-button>
                <!-- 线上收款,需判断收付+支付状态或转入收款+未开票 -->
                <el-button
                  type="text"
                  @click="btnOpera(scope.row, 3)"
                  v-else-if="
                    ((scope.row.type === 1 || scope.row.type === 8) && //支付状态等于(付款-已通过||付款-已通过-支付成功)
                    scope.row.billStatus &&
                    (scope.row.billStatus.value === 1 ||
                      scope.row.billStatus.value === 4) && //票据状态等于(未开票||已作废)
                      scope.row.payStatusValue !== 4 &&
                      scope.row.payStatusValue !== 11 &&
                      scope.row.payStatus.value !== 11) || //收付状态不等于(收款-未付款&&收款-收款失败)
                      (scope.row.isDeal == 3 &&
                        scope.row.billStatus.value != 2 &&
                        scope.row.payStatus.value !== 11) //转入收款+已开票+收付状态不等于(失败)
                  "
                  >开票
                </el-button>
              </template>
              <!-- <el-button type="text" @click="btnOpera(scope.row,3)" v-if="(power['sign-cw-bill-invoice'].state&&
                        (scope.row.type===1||scope.row.type===8)&&//支付状态等于(付款-已通过||付款-已通过-支付成功)
                        scope.row.isDel===1&&//未删除
                        scope.row.billStatus&&(scope.row.billStatus.value===1||scope.row.billStatus.value===4)&&//票据状态等于(未开票||已作废)
                        scope.row.payStatusValue!==4&&scope.row.payStatusValue!==11&&scope.row.payStatus.value!==3)||//收付状态不等于(收款-未付款&&收款-收款失败)
                        (scope.row.isDeal==3&&scope.row.billStatus.value!=2)//转入收款+已开票
                        ">开票
              </el-button> -->

              <template
                v-if="
                  scope.row.isZK === 'true' &&
                    (scope.row.payStatus.value === 3 ||
                      scope.row.payStatus.value === 11)
                "
              >
                <el-button
                  type="text"
                  @click="btnOpera(scope.row, 1)"
                  v-if="power['sign-cw-zk-edit'].state"
                  >编辑</el-button
                >
              </template>
              <template v-else>
                <el-button
                  type="text"
                  @click="btnOpera(scope.row, 1)"
                  v-if="
                    scope.row.payway &&
                      scope.row.payStatus &&
                      (scope.row.payway.value !== 4 ||
                        (scope.row.payway.value === 4 &&
                          scope.row.billStatus.value !== 2)) &&
                      scope.row.payStatus.value !== 5 &&
                      (scope.row.type === 1 || scope.row.type === 8) &&
                      scope.row.edit === 1 &&
                      power['sign-cw-rev-update'].state &&
                      scope.row.isDeal != 3
                  "
                >
                  编辑</el-button
                >
              </template>

              <!-- 新增转款按钮 &&power['sign-cw-bill-zk'].state-->
              <template
                v-if="
                  !scope.row.payway ||
                    (scope.row.payway &&
                      (scope.row.payway.value != 3 ||
                        (scope.row.payway.value == 3 && isBoxPay)))
                "
              >
                <template v-if="scope.row.contId != 0">
                  <el-button
                    type="text"
                    @click="btnTransfer(scope.row)"
                    v-if="
                      scope.row.payStatus.value == 5 &&
                        (scope.row.statusResult &&
                          scope.row.statusResult.value != 2) &&
                        (scope.row.statusResult &&
                          scope.row.statusResult.value != 3) &&
                        scope.row.isDeal != 3 &&
                        power['sign-cw-bill-zk'].state
                    "
                  >
                    转款</el-button
                  >
                </template>
                <template v-else>
                  <el-button
                    type="text"
                    @click="btnTransfer(scope.row)"
                    v-if="
                      scope.row.payStatus.value == 5 &&
                        scope.row.isDeal != 3 &&
                        power['sign-cw-bill-zk'].state
                    "
                    >转款</el-button
                  >
                </template>
              </template>

              <template
                v-if="
                  (((scope.row.type === 1 || scope.row.type === 8) &&
                    scope.row.billStatus &&
                    scope.row.billStatus.value === 1) ||
                    scope.row.type === 2) &&
                    scope.row.isDel === 1
                "
              >
                <!-- <el-button type="text"
                                  @click="btnOpera(scope.row,2)"
                                  v-if="power['sign-cw-debt-void'].state&&(scope.row.caozuo===1||scope.row.caozuo===2)">作废
                </el-button>-->
              </template>
              <div
                v-if="
                  power['sign-cw-bill-invoice'].state &&
                    scope.row.billStatus &&
                    scope.row.billStatus.value === 2 &&
                    scope.row.isDeal === 3
                "
              >
                <el-button type="text" @click="btnOpera(scope.row, 4)"
                  >打印客户联</el-button
                >
              </div>
              <!-- refundFlag 0不能退款  1可以退款 -->
              <template v-if="scope.row.refundFlag === 1">
                <el-button type="text" @click="btnOpera(scope.row, 5)"
                  >退款</el-button
                >
              </template>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="list.length > 0"
        class="pagination-info"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 票据编号弹层 -->
    <layer-invoice
      ref="layerInvoice"
      :contId="activeRow.contId"
      @emitPaperSet="emitPaperSetFn"
    ></layer-invoice>
    <!--作废-->
    <el-dialog
      title="作废"
      :visible.sync="layer.show"
      :closeOnClickModal="$tool.closeOnClickModal"
      width="740px"
    >
      <div class="delete-dialog" v-if="layer.content.length > 0">
        <p>
          是否作废该{{
            layer.content[0].type === 1 || layer.content[0].type === 8
              ? "收款单"
              : "付款单"
          }}
        </p>
        <el-table
          border
          :data="layer.content"
          style="width: 100%"
          header-row-class-name="theader-bg"
          key="other"
        >
          <el-table-column
            align="center"
            min-width="120"
            label="收付编号"
            prop="payCode"
            :formatter="nullFormatter"
          >
          </el-table-column>
          <el-table-column
            align="center"
            :label="
              layer.content[0].type === 1 || layer.content[0].type === 8
                ? '收款金额'
                : '付款金额'
            "
            prop="cityName"
            :formatter="nullFormatter"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.amount }}元</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="
              layer.content[0].type === 1 || layer.content[0].type === 8
                ? '付款方'
                : '收款方'
            "
            prop="cityName"
            :formatter="nullFormatter"
          >
            <template slot-scope="scope">
              <span
                >{{
                  scope.row.type === 1 || scope.row.type === 8
                    ? scope.row.outObjType.label
                    : scope.row.inObjType.label
                }}{{
                  scope.row.type === 1 || scope.row.type === 8
                    ? scope.row.outObjName
                      ? `-${scope.row.outObjName}`
                      : ""
                    : scope.row.inObjName
                    ? `-${scope.row.inObjName}`
                    : ""
                }}</span
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          class="btn-info"
          round
          @click="layer.show = false"
          >返 回</el-button
        >
        <el-button
          size="small"
          class="btn-info"
          round
          type="primary"
          @click="deleteBill"
          v-loading.fullscreen.lock="getLoading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 转款 -->
    <div v-show="transterShow">
      <el-dialog
        :title="zkTitle"
        :visible.sync="transterShow"
        :closeOnClickModal="$tool.closeOnClickModal"
        width="800px"
      >
        <div class="transter-detail">
          <p class="title">合同信息</p>
          <p class="info" v-if="!zkEdit">
            <span
              >合同编号：{{
                selectPayInfo && selectPayInfo.contCode
                  ? selectPayInfo.contCode
                  : "-"
              }}</span
            >&nbsp;&nbsp;&nbsp;
            <span>款类：{{ selectPayInfo && selectPayInfo.moneyType }}</span
            >&nbsp;&nbsp;&nbsp;
            <span
              >金额：{{ selectPayInfo && selectPayInfo.amount }}元&nbsp;&nbsp;
              {{ selectPayInfo && selectPayInfo.amount | moneyFormat }}</span
            >
          </p>
          <p class="info" v-else>
            <span
              >合同编号：{{
                transterInfoPerson && transterInfoPerson.outContractCode
                  ? transterInfoPerson.outContractCode
                  : "-"
              }}</span
            >&nbsp;&nbsp;&nbsp;
            <span
              >款类：{{
                transterInfoPerson && transterInfoPerson.outPayType
              }}</span
            >&nbsp;&nbsp;&nbsp;
            <span
              >金额：{{
                transterInfoPerson && transterInfoPerson.outMoney
              }}元&nbsp;&nbsp;
              {{
                transterInfoPerson && transterInfoPerson.outMoney | moneyFormat
              }}</span
            >
          </p>
          <p v-if="!zkEdit">
            物业地址：{{
              selectPayInfo && selectPayInfo.address
                ? selectPayInfo.address
                : "-"
            }}
          </p>
          <p v-else>
            物业地址：{{
              transterInfoPerson && transterInfoPerson.outPropertyAddr
                ? transterInfoPerson.outPropertyAddr
                : "-"
            }}
          </p>
          <p class="title">转款操作</p>
          <p>
            转入合同：
            <span v-if="transterInfoPerson.inContractId">{{
              transterInfoPerson && transterInfoPerson.inContractCode
                ? transterInfoPerson.inContractCode
                : "-"
            }}</span>
            <span
              class="select"
              style="margin:0 0 10px 0px;"
              @click="chooseCont()"
              v-else
              >{{
                transterInfoPerson && transterInfoPerson.inContractCode
                  ? transterInfoPerson.inContractCode
                  : "请选择合同"
              }}</span
            >
          </p>
          <p>
            物业地址：{{
              transterInfoPerson && transterInfoPerson.propertyAddr
                ? transterInfoPerson.propertyAddr
                : "-"
            }}
          </p>
          <div class="kuanlei clearfix">
            <label>选择款类：</label>
            <ul v-if="!zkEdit">
              <li v-for="(item, index) in kuanleiVal" :key="index">
                <moneyTypePop
                  style="display: inline-block;"
                  ref="moneyType"
                  :data="moneyType"
                  @checkCell="getCell"
                  :chooseIndex="index"
                  v-if="transterShow"
                ></moneyTypePop>
                <el-input
                  size="small"
                  class="w200"
                  placeholder="请输入金额"
                  v-model="item.outMoney"
                  @input="cutNum(index)"
                >
                </el-input>
                <span
                  class="icon"
                  @click.stop="addcommissionData"
                  v-if="index === 0"
                >
                  <i class="iconfont icon-tubiao_shiyong-14"></i>
                </span>
                <span
                  class="icon"
                  @click.stop="delPeople(index)"
                  v-if="!(index === 0)"
                >
                  <i class="iconfont icon-tubiao_shiyong-4"></i>
                </span>
              </li>
            </ul>
            <ul v-if="zkEdit">
              <li v-for="(item, index) in kuanleiVal" :key="index">
                <moneyTypePop
                  style="display: inline-block;"
                  ref="moneyType"
                  :data="moneyType"
                  @checkCell="getCell"
                  :chooseIndex="index"
                  v-if="transterShow"
                  :init="item.name"
                ></moneyTypePop>
                <el-input
                  size="small"
                  class="w200"
                  placeholder="请输入金额"
                  v-model="item.outMoney"
                  @input="cutNum(index)"
                >
                </el-input>
              </li>
            </ul>
          </div>
          <p style="color:#FF2711;">
            注：一旦转款成功，不同合同转款，实收金额相应增减；同一合同转款，实收金额不变
          </p>
          <p style="text-align:right;margin:50px 50px 0 0;">
            <el-button
              size="small"
              class="btn-info"
              round
              @click="transterShow = false"
              >取消</el-button
            >
            <el-button
              size="small"
              class="btn-info"
              round
              type="primary"
              @click="transterSave()"
              v-if="!zkEdit"
              >保存
            </el-button>
            <el-button
              size="small"
              class="btn-info"
              round
              type="primary"
              @click="transterSave()"
              v-else
              >提交审核
            </el-button>
          </p>
        </div>
        <el-dialog
          width="600px"
          title="选择合同"
          :visible.sync="chooseContShow"
          append-to-body
          :closeOnClickModal="$tool.closeOnClickModal"
          height="300"
          style="margin-top:-8vh;"
          v-show="chooseContShow"
        >
          <div>
            <p style="width:600px;height:40px;line-height:65px;">
              <span style="float:left;" class="clearfix">关键字：</span>
              <el-input
                v-model="contKeyWord"
                maxlength="100"
                class="w200"
                style="float:left;"
                placeholder="请输入合同编号"
              >
              </el-input>
              <el-button
                size="small"
                class="btn-info"
                round
                type="primary"
                style="float:right;margin:20px 20px 0 0;"
                @click="toContWord()"
                >查询</el-button
              >
            </p>
            <div style="padding:0 0 50px 0;" class="about-cont">
              <el-table
                border
                :data="contList"
                style="width: 100%"
                header-row-class-name="theader-bg"
                key="other"
                @row-click="selectItem"
              >
                <el-table-column width="40">
                  <template slot-scope="scope">
                    <span class="outSide">
                      <span
                        class="inLine"
                        :class="{ inLineBg: selectCode === scope.row.code }"
                      ></span>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  min-width="120"
                  label="合同编号"
                  prop="code"
                  :formatter="nullFormatter"
                >
                </el-table-column>
                <el-table-column
                  align="center"
                  min-width="120"
                  label="物业地址"
                  prop="propertyAddr"
                  :formatter="nullFormatter"
                ></el-table-column>
              </el-table>
              <el-pagination
                class="pagination-info"
                @current-change="handleCurrentChange2"
                :current-page="currentPage2"
                :page-size="pageSize2"
                layout="total, prev, pager, next, jumper"
                :total="contTotal"
                style="margin-top:30px;"
              ></el-pagination>

              <p style="text-align:right;margin:50px 50px 0 0;">
                <el-button
                  size="small"
                  class="btn-info"
                  round
                  @click="chooseContShow = false"
                  >取消</el-button
                >
                <el-button
                  size="small"
                  class="btn-info"
                  round
                  type="primary"
                  @click="sureCont()"
                  >确定</el-button
                >
              </p>
            </div>
          </div>
        </el-dialog>
        <el-dialog
          width="600px"
          title="确认保存"
          :visible.sync="sureSaveTransterShow"
          append-to-body
          :closeOnClickModal="$tool.closeOnClickModal"
          style="margin-top:8vh;"
        >
          <div class="sure-transter-dialog">
            <p>确认转款？</p>
            <p>转款成功后，不同合同转款，原合同实收金额会减掉，转入合同</p>
            <p>实收金额会增加；同一个合同转款，实收金额不变</p>
            <p style="text-align:right;margin:50px 50px 0 0;">
              <el-button
                size="small"
                class="btn-info"
                round
                @click="sureSaveTransterShow = false"
                >取消</el-button
              >
              <el-button
                size="small"
                class="btn-info"
                round
                type="primary"
                @click="transterSaveFinal()"
                v-dbClick
                >保存
              </el-button>
            </p>
          </div>
        </el-dialog>
      </el-dialog>
    </div>
    <!-- 退款 -->
    <el-dialog
      width="600px"
      title="退款审核"
      :visible.sync="refundTransterShow"
      append-to-body
    >
      <div class="refundBox">
        <el-row>
          <span class="row-left">合同编号:</span>
          <span class="row-right">{{ refundData.contCode || "" }}</span>
        </el-row>
        <el-row>
          <span class="row-left">收付ID:</span>
          <span class="row-right">{{ refundData.payCode }}</span>
        </el-row>
        <el-row>
          <span class="row-left">物业地址:</span>
          <span class="row-right">{{ refundData.address }}</span>
        </el-row>
        <el-row>
          <span class="row-left">收款方:</span>
          <span class="row-right">{{ refundData.inObjName }}</span>
          <span class="row-left" style="margin-left:30px;">收款方式:</span>
          <span class="row-right">{{
            refundData.payway && refundData.payway.label
          }}</span>
          <span class="row-left" style="margin-left:30px;">款类:</span>
          <span class="row-right">{{ refundData.moneyType }}</span>
        </el-row>
        <el-row>
          <span class="row-left">收款金额:</span>
          <span class="row-right">{{ refundData.amount }}元</span>
        </el-row>
        <el-row class="min-title"> 其他信息 </el-row>
        <el-row>
          <p>备注信息</p>
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请填写备注信息"
            v-model="refundRemark"
          >
          </el-input>
        </el-row>
        <el-row> 退款凭证 </el-row>
        <el-row>
          <ul class="upload-list">
            <li>
              <file-up
                class="upload-context"
                @getUrl="getFiles"
                :scane="uploadScane"
              >
                <i class="iconfont icon-shangchuan"></i> <span>点击上传</span>
              </file-up>
            </li>
            <li
              v-for="(item, index) in imgList"
              :key="index"
              @mouseenter="activeLi = index"
              @mouseleave="activeLi = ''"
              @click="previewPhoto(imgList, index)"
            >
              <img
                :src="item | getSignImage(preloadFiles, _self)"
                alt
                v-if="isPictureFile(item.type)"
                height="90px"
                :key="item.path"
                :width="item.width"
              />
              <upload-cell :type="item.type" v-else></upload-cell>
              <!--<span>{{item.name}}</span>-->
              <el-tooltip :content="item.name" placement="top">
                <div class="span">{{ item.name }}</div>
              </el-tooltip>
              <p v-show="activeLi === index" @click.stop="delFile">
                <i class="iconfont icon-tubiao-6"></i>
              </p>
            </li>
          </ul>
        </el-row>
        <el-row class="upload-text">
          * 退款申请通过后，本次收款金额会全额原路退还（含手续费）。
        </el-row>
        <el-row>
          <el-button type="primary" @click="refundHandleConfirm"
            >提交退款申请</el-button
          >
          <el-button @click="refundHandleClose">取消</el-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { FILTER } from "@/assets/js/filter";
import { MIXINS } from "@/assets/js/mixins";
import LayerPaperInfo from "@/components/LayerPaperInfo";
import LayerInvoice from "@/components/LayerInvoice";
import scrollBar from "@/components/scrollBar";
import moneyTypePop from "@/components/moneyTypePop";
import { TOOL } from "@/assets/js/common";
export default {
  mixins: [MIXINS, FILTER],
  components: {
    LayerPaperInfo,
    LayerInvoice,
    scrollBar,
    moneyTypePop
  },
  data() {
    return {
      tableBody: 0,
      scrollWidth: 0,
      scrollLeft: 0,
      tableBox: null,
      activeView: "",
      searchForm: {
        contType: [],
        timeType: "",
        depName: "",
        deptId: "",
        empId: "",
        billStatus: "",
        proAccount: "",
        checkStatus: "",
        moneyType: "",
        payMethod: "",
        keyword: "",
        timeRange: [],
        payObjType: "",
        cooperation: "",
        recordType: "",
        payway: "", //收款方式
        hasCont: "", //有/无合同
        zkAuditState: "",
        settleStatus: "", //结算状态
        startExamineDate: "", //结算起始时间
        endExamineDate: "" //结算截止时间
      },
      tableTotal: {},
      list: [],
      dictionary: {
        10: "",
        56: "",
        32: "",
        23: "",
        24: "",
        25: "",
        507: "",
        542: "",
        57: "",
        53: "",
        64: "",
        69: "",
        792: "",
        77: ""
      },
      drop_MoneyType: [],
      //分页
      total: 0,
      currentPage: 1,
      pageSize: 10,
      //开票
      paperShow: false,
      paperInfoData: {}, //票据对象
      moneyTypes: [], //临时存放勾选的款类
      activeType: 0, //当前预览项
      activeRow: {}, //当前操作项
      //作废
      layer: {
        show: false,
        content: []
      },
      //权限配置
      power: {
        /*'sign-cw-debt-query': {
                      state: false,
                      name: '查询'
                    },*/
        "sign-cw-debt-whtfk": {
          state: false,
          name: "付款"
        },
        "sign-cw-debt-whtsk": {
          state: false,
          name: "收款"
        },
        "sign-cw-debt-export": {
          state: false,
          name: "导出"
        },
        "sign-cw-bill-invoice": {
          state: false,
          name: "开票"
        },
        "sign-cw-debt-edit": {
          state: false,
          name: "修改"
        },
        "sign-cw-debt-void": {
          state: false,
          name: "作废"
        },
        /*'sign-cw-bill-print':{
                      state: false,
                      name: '打印'
                    },*/
        "sign-cw-debt-rev": {
          state: false,
          name: "收款详情"
        },
        "sign-cw-debt-pay": {
          state: false,
          name: "付款详情"
        },
        "sign-com-htdetail": {
          state: false,
          name: "合同详情"
        },
        "sign-com-house": {
          state: false,
          name: "房源详情"
        },
        "sign-com-cust": {
          state: false,
          name: "客源详情"
        },
        "sign-cw-rev-update": {
          state: false,
          name: "编辑"
        },
        "sign-cw-bill-zk": {
          state: false,
          name: "转款"
        },
        "sign-cw-zk-edit": {
          state: false,
          name: "转款编辑"
        }
      },
      transterShow: false,
      kuanleiVal: [
        {
          outType: "",
          outTypeId: "",
          outMoney: ""
        }
      ],
      chooseContShow: false, //控制选择合同弹框
      contKeyWord: "",
      contList: [], //合同数组
      contTotal: 1,
      selectCode: "", //选择合同编号
      selectCodeAll: "",
      currentPage2: 1,
      pageSize2: 5,
      sureSaveTransterShow: false,
      selectPayInfo: null,
      moneyType: [],
      transterInfoPerson: {},
      zkTitle: "转款信息填写",
      zkEdit: false,
      isBoxPay: false, // true 盒子支付
      settleStatusOption: [
        { value: 0, label: "未结算" },
        { value: 1, label: "已结算" }
      ],
      settleStatusTimeRange: [],

      refundTransterShow: false, //退款弹层
      refundData: {}, //退款信息
      refundRemark: "", //退款备注
      uploadScane: { path: "sk", id: "" }, //上传场景值
      imgList: [],
      files: [],
      preloadFiles: [],
      activeLi: ""
    };
  },
  mounted() {
    this.$nextTick(() => {
      let res = this.getDataList;
      if (res && res.route === this.$route.path) {
        this.list = res.data.page.list;
        this.total = res.data.page.total;
        this.tableTotal = Object.assign(
          {},
          res.data.payMentDataList,
          res.data.paymentDataList,
          { balance: res.data.balance },
          { sumFees: res.data.fees && res.data.fees.sumFees }
        );
        let session = JSON.parse(sessionStorage.getItem("sessionQuery"));
        this.searchForm = Object.assign({}, this.searchForm, session.query, {
          contType:
            session.query.contTypes.length > 0
              ? session.query.contTypes.split(",")
              : []
        });
        // this.$set(this.searchForm,'contType',session.query.contTypes.split(','))
        // this.$
        this.searchForm.contType = this.searchForm.contType.map(item => {
          return Number(item);
        });
        if (session.query.startTime) {
          this.searchForm.timeRange = [
            session.query.startTime,
            session.query.endTime
          ];
          delete this.searchForm.startTime;
          delete this.searchForm.endTime;
        } else {
          this.searchForm.timeRange = [];
        }
        if (this.searchForm.empId) {
          this.dep = Object.assign({}, this.dep, {
            id: this.searchForm.deptId,
            empId: this.searchForm.empId,
            empName: this.searchForm.empName
          });
          this.EmployeList.unshift({
            empId: this.searchForm.empId,
            name: this.searchForm.empName
          });
          this.getEmploye(this.searchForm.deptId);
        }
        this.currentPage = this.searchForm.pageNum;
      } else {
        this.getData();
      }
      this.getDictionary();
      this.getMoneyTypes();
      this.getMoneyType();
      let { user = {}, isProd = 0 } =
        JSON.parse(sessionStorage.getItem("userMsg")) || {};
      if (
        (isProd && [21, 25].includes(user.cityId)) ||
        (!isProd && [21, 25, 40].includes(user.cityId))
      ) {
        this.isBoxPay = true;
      }
    });
    // this.getAdmin()
  },
  watch: {
    //转款弹层清空合同搜索框
    chooseContShow(val) {
      this.contKeyWord = "";
    },
    "searchForm.timeType": {
      handler(val) {
        if (!val) {
          this.searchForm.timeRange = [];
        }
      }
    },
    settleStatusTimeRange(val) {
      [this.searchForm.startExamineDate, this.searchForm.endExamineDate] =
        val || [];
    }
  },
  /*watch:{
          getCollapse:function (val) {
            this.tableBody=this.$refs.table.$refs.bodyWrapper.clientWidth
            if(!val){
              this.scrollLeft=this.$refs.table.$el.offsetLeft+161
            }else {
              this.scrollLeft=this.$refs.table.$el.offsetLeft+65
            }
          }
        },*/
  methods: {
    //退款信息提交
    refundHandleConfirm() {
      if (this.refundData && this.refundData.inAccount) {
        let inAccount = JSON.parse(this.refundData.inAccount);
        //退款审核
        this.$ajax
          .postJSON("api/refund/saveOrder", {
            contId: this.refundData.contId, //合同ID
            remark: this.refundRemark, //退款备注
            inObj: this.refundData.inObjName, //收款人
            inObjId: this.refundData.inObjId, //收款ID
            inObjType: this.refundData.inObjType.value, //收款类型
            moneyType: this.refundData.moneyTypeId,
            moneyTypePid: this.refundData.moneyTypePid,
            sk_pay_id: this.refundData.id, //支付ID
            amount: this.refundData.amount, //退款金额
            accountProperties: 1,
            out_obj: this.refundData.outObjName, //付款人
            settleStatus: this.refundData.settleOldStatus, //已到账未结算状态
            type: this.refundData.type, // 收付款类别
            inAccountType: this.refundData.inAccountType, //线上下付款3线上 4线下
            status: this.refundData.status, // 订单状态
            inAccount, //收款账户
            filePath: this.files //凭证
          })
          .then(res => {
            let data = res.data;
            if (data.status === 200) {
              this.$message({
                message: data.data["200"]
              });
              this.refundHandleClose();
              this.getData();
            }
          })
          .catch(err => {
            this.refundHandleClose();
            this.$message({
              message: err
            });
          });
      }
    },
    //退款信息关闭
    refundHandleClose(done) {
      this.refundTransterShow = false;
      this.refundChean();
    },
    //清空退款信息
    refundChean() {
      this.refundData = {};
      this.refundRemark = "";
      this.uploadScane = { path: "sk", id: "" };
      this.imgList = [];
      this.files = [];
      this.preloadFiles = [];
      this.activeLi = "";
    },
    /**
     * 获取上传文件
     */
    getFiles: function(payload) {
      /*this.files = this.files.concat(this.$tool.getFilePath(payload.param))
                this.imgList = this.$tool.cutFilePath(this.files)*/

      if (payload) {
        this.files = this.files.concat(this.$tool.getFilePath(payload.param));
      }
      this.imgList = this.$tool.cutFilePath(this.files);
      // this.preloadFiles=[].concat()
      this.imgList.forEach(item => {
        if (this.isPictureFile(item.type)) {
          let hasImg = this.preloadFiles.find(imgData =>
            imgData.includes(item.path)
          );
          !hasImg &&
            this.fileSign([].concat(item.path), "preload").then(res => {
              this.preloadFiles.push(res[0]);
            });
        }
      });
    },
    delFile: function() {
      this.imgList.splice(this.activeLi, 1);
      this.files.splice(this.activeLi, 1);
    },
    // 收款
    getCollectMoney() {
      this.$router.push({
        path: "receiptBill",
        query: {
          collect: 5,
          contId: "0"
        }
      });
    },
    getExcel: function() {
      // this.getData("search");

      let param = JSON.parse(JSON.stringify(this.searchForm));
      if (
        typeof param.timeRange === "object" &&
        Object.prototype.toString.call(param.timeRange) === "[object Array]"
      ) {
        param.startTime = param.timeRange[0];
        param.endTime = param.timeRange[1];
      }
      param.contTypes = param.contType.join(",");
      delete param.contType;
      delete param.timeRange;
      this.excelCreate("/input/payInfoExcel", param);
    },
    test: function(val) {
      this.getEmployeByText(val);
    },
    reset: function() {
      this.$tool.clearForm(this.searchForm);
      this.EmployeList = [];
      this.settleStatusTimeRange = "";
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData("pagination");
    },
    clearDep: function() {
      // 部门
      this.searchForm.deptId = "";
      this.searchForm.depName = "";
      // 员工
      this.searchForm.empId = "";
      this.searchForm.empName = "";
      this.clearSelect();
    },
    searchDep: function(payload) {
      /*this.DepList=payload.list
                this.searchForm.depName=payload.depName*/
      this.searchForm.empId = "";
      this.clearSelect("emp");
    },
    depHandleClick(data) {
      // this.getEmploye(data.depId)
      this.searchForm.deptId = data.depId;
      this.searchForm.depName = data.name;
      this.searchForm.empId = "";

      this.handleNodeClick(data);
    },
    empHandle: function(val) {
      console.log(this.searchForm.empId);
      if (
        val &&
        this.EmployeInit !== this.employeTotal &&
        this.searchForm.deptId
      ) {
        this.getEmployeByText();
      }
    },
    empHandleAdd(val) {
      let depVal = val.split("/");
      this.searchForm.empId = depVal[0];
      this.searchForm.deptId = depVal[2];
      this.searchForm.depName = depVal[1];
      this.EmployeList = [];
      this.getEmploye(this.searchForm.deptId);
    },
    /**
     * 获取付款失败信息
     */
    getErrorMsg: function(data) {
      this.$ajax
        .get("/api/payInfo/selectRetMsg", { payId: data.id })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.$message({
              message: `付款失败：${res.data.msg}`
            });
          }
        })
        .catch(error => {
          this.$message({
            message: error,
            type: "warning"
          });
        });
    },
    getData: function(type = "init") {
      if (type === "search") {
        this.currentPage = 1;
      }
      let param = JSON.parse(JSON.stringify(this.searchForm));
      if (
        typeof param.timeRange === "object" &&
        Object.prototype.toString.call(param.timeRange) === "[object Array]"
      ) {
        param.startTime = param.timeRange[0];
        param.endTime = param.timeRange[1];
      }
      param.contTypes = param.contType.join(",");
      param.pageNum = this.currentPage;
      param.pageSize = this.pageSize;
      delete param.contType;
      delete param.timeRange;

      //点击查询时，缓存筛选条件
      if (type === "search" || type === "pagination") {
        sessionStorage.setItem(
          "sessionQuery",
          JSON.stringify({
            path: this.$route.fullPath,
            url: "/payInfo/selectPayInfoList",
            query: Object.assign({}, param, {
              empName: this.dep.empName
            })
          })
        );
      }
      if (type === "search") {
        param.empId = this.searchForm.empId.split("-")[0];
      }
      if (
        type === "getExcel" &&
        JSON.stringify(param) === JSON.stringify(this.ajaxParams)
      ) {
        if (!this.total) {
          this.$message.warning("当前筛选条件结果无数据！");
        } else {
          this.excelCreate("/input/payInfoExcel", param);
        }
        return;
      }
      this.$ajax
        .get("/api/payInfo/selectPayInfoList", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.list = res.data.page.list;
            this.total = res.data.page.total;
            this.tableTotal = Object.assign(
              {},
              res.data.payMentDataList,
              res.data.paymentDataList,
              { balance: res.data.balance },
              { sumFees: res.data.fees && res.data.fees.sumFees }
            );
            if (["init", "search", "getExcel"].includes(type)) {
              this.ajaxParams = JSON.parse(JSON.stringify(param));
            }
            if (type === "getExcel") {
              if (!this.total) {
                this.$message.warning("当前筛选条件结果无数据！");
              } else {
                this.excelCreate("/input/payInfoExcel", param);
              }
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 跳转详情页
     * @param row
     */
    toDetails: function(row) {
      if (
        !this.power["sign-cw-debt-rev"].state &&
        (row.type === 1 || row.type === 8)
      ) {
        this.$message({
          message: "无收款详情查看权限"
        });
        return;
      }
      if (!this.power["sign-cw-debt-pay"].state && row.type === 2) {
        this.$message({
          message: "无付款详情查看权限"
        });
        return;
      }
      /*if (row.payStatus === '未付款'&&this.power['sign-cw-debt-edit'].state&&row.caozuo===1&&row.isDel===1&&((row.type===1&&row.billStatus&&row.billStatus.value===1)||row.type===2)) {
                  this.btnOpera(row, 1)
                } else {*/

      // 判断收款/付款/转款
      let name,
        tab,
        isZk = false;

      if (row.isZK === "true") {
        // 转款
        name = "转款详情";
        tab = "转款信息";
        isZk = true;
      } else {
        //收款或付款
        (name = row.type === 1 || row.type === 8 ? "收款详情" : "付款详情"),
          (tab = row.type === 1 || row.type === 8 ? "收款信息" : "付款信息");
      }
      this.setPath(
        this.getPath.concat({
          name,
          tab
        })
      );
      this.$router.push({
        path: "billDetails",
        query: {
          id: row.id,
          tab,
          power: this.getUser.user.empId === row.auditBy,
          bill: this.power["sign-cw-bill-invoice"].state,
          contId: row.contId,
          listName: 1,
          detailType: true,
          isZk
        }
      });
      // }
    },
    btnOpera: function(row, type) {
      this.activeRow = Object.assign({}, row);
      if (type === 1) {
        if (row.isZK === "true") {
          this.transterShow = true;
          this.zkEdit = true;
          this.zkTitle = "编辑转款";
          this.selectPayInfo = row;
          this.kuanleiVal = [
            {
              outType: row.moneyTypeId,
              outTypeId: row.moneyTypePid,
              name: row.moneyType,
              outMoney: row.amount,
              payId: row.id
            }
          ];
          this.getTransterInfo(row.id);
        } else {
          if (row.contId) {
            this.$router.push({
              path: "receiptBill",
              query: {
                edit: 1,
                id: row.id,
                contId: row.contId,
                code: row.contCode,
                isentrust: row.type === 8 ? 1 : 0
              }
            });
          } else {
            this.$router.push({
              path: "receiptBill",
              query: {
                edit: 1,
                id: row.id,
                contId: row.contId,
                code: row.contCode,
                isentrust: row.type === 8 ? 1 : 0,
                collect: 1
              }
            });
          }
        }
      } else if (type === 2) {
        this.layer.show = true;
        this.layer.content = [].concat(row);
      } else if (type === 3) {
        if (row.contId) {
          this.$refs.layerInvoice.show(row.id, true, 1, row.contId);
        } else {
          this.$refs.layerInvoice.show(row.id, true, 1, 0);
        }
        // this.$refs.layerInvoice.contId=row.contId
      } else if (type === 4) {
        this.$refs.layerInvoice.show(row.billId);
      } else if (type === 5) {
        console.log(row);
        this.refundData = row;
        // let { payCode,address,inObjName,payway,moneyType,amount } = row
        // console.log([payCode,address,inObjName,payway,moneyType,amount])
        //退款信息
        this.refundTransterShow = true;
      }
    },
    //作废
    deleteBill: function() {
      let src =
        this.activeView === 1
          ? "/payInfo/updateProceedsIsDel"
          : "/payInfo/updatePaymentIsDel";
      this.setLoading(true);
      this.$ajax
        .put(`/api${src}`, { payId: this.layer.content[0].id }, 2)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.setLoading(false);
            this.getData();
            this.layer.show = false;
            this.$message({
              message: "作废成功"
            });
          }
        })
        .catch(error => {
          this.setLoading(false);
          this.$message({
            message: error
          });
        });
    },
    emitPaperSetFn: function(payload) {
      this.getData();
      // this.$refs.layerInvoice.propCloseFn()
    },
    /**
     * 合同信息操作
     * @param type
     */
    toLink: function(row, type) {
      let param = {
        contType: row.contTypeId,
        contId: row.contId,
        contCode: row.contCode,
        operaType: type,
        power:
          type === "cont"
            ? this.power["sign-com-htdetail"]
            : type === "house"
            ? this.power["sign-com-house"]
            : type === "customer"
            ? this.power["sign-com-cust"]
            : ""
      };
      this.msgOpera(param);
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
    getMoneyTypes: function() {
      this.$ajax.get("/api/payInfo/selectSmallMoneyType").then(res => {
        res = res.data;
        if (res.status === 200) {
          this.drop_MoneyType = res.data;
        }
      });
    },
    // 转款操作
    btnTransfer(val) {
      console.log(val);
      this.zkTitle = "转款信息填写";
      this.zkEdit = false;
      let param = {
        payId: val.id
      };
      this.$ajax
        .get("/api/payInfo/validateInOut", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            if (res.data) {
              this.kuanleiVal = [
                {
                  outType: "",
                  outTypeId: "",
                  outMoney: ""
                }
              ];
              // this.transterShow = true;修改弹框打开时机为接口数据返回后
              this.selectPayInfo = val;
              this.getTransterInfo(val.id);
            } else {
              this.$message({
                message: `${res.message}`
              });
            }
          }
        })
        .catch(error => {
          this.$message({
            message: `${error}`
          });
        });
    },
    getTransterInfo(id) {
      let param;
      if (this.zkEdit) {
        param = {
          payId: id,
          isEdit: true
        };
      } else {
        param = {
          payId: id
        };
      }
      this.$ajax
        .get("/api/payInfo/inOutContractInfo", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            if (!this.isEdit) {
              this.transterShow = true;
            }
            if (res.data.inContractCode) {
              this.transterInfoPerson = res.data;
            } else {
              this.transterInfoPerson = {};
            }
          }
        })
        .catch(error => {
          this.$message({
            message: `${error}`
          });
        });
    },
    addcommissionData() {
      this.kuanleiVal.push({
        outType: "",
        outTypeId: "",
        outMoney: ""
      });
    },
    delPeople(index) {
      this.kuanleiVal.splice(index, 1);
    },
    chooseCont() {
      this.chooseContShow = true;
      this.getContractList(1);
    },
    getContractList(pageNum, keyword) {
      let param = {
        pageNum: pageNum,
        pageSize: 5,
        keyword: keyword
      };
      this.$ajax.postJSON("/api/contract/contractList", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.contList = res.data.list;
          this.contTotal = res.data.count;
          console.log(`this.contTotal${this.contTotal}`);
        }
      });
    },
    //选择合同
    selectItem(val) {
      console.log(val);
      if (this.selectCode === val.code) {
        this.selectCode = "";
      } else {
        this.selectCode = val.code;
        this.selectCodeAll = val;
      }
    },
    handleCurrentChange2(val) {
      console.log(`当前页: ${val}`);
      this.selectCode = "";
      this.currentPage2 = val;
      this.getContractList(val, this.contKeyWord);
    },
    transterSave() {
      let hash = {};
      // 判断是否有重复款类
      let flagArr = this.kuanleiVal.reduce((pre, cur) => {
        hash[cur.outType] ? "" : (hash[cur.outType] = true && pre.push(cur));
        return pre;
      }, []);

      let allMoney = null,
        nullType = 1;
      this.kuanleiVal.map(item => {
        console.log(item.outMoney);
        if (!item.outMoney) {
          nullType = 2;
        }
        if (!item.outType) {
          nullType = 3;
        }
        allMoney += Number(item.outMoney);
      });
      if (!this.transterInfoPerson.inContractCode) {
        this.$message({
          message: "请选择转入合同"
        });
        // this.sureSaveTransterShow = false;
        return;
      }
      if (nullType == 2) {
        this.$message({
          message: "请输入转款金额"
        });
        // this.sureSaveTransterShow = false;
        return;
      } else if (nullType == 3) {
        this.$message({
          message: "请选择款类"
        });
        // this.sureSaveTransterShow = false;
        return;
      }
      if (this.zkEdit) {
        if (allMoney > this.transterInfoPerson.inMoney) {
          this.$message({
            message: "编辑金额不能超过申请金额！"
          });
          return;
        }
      } else {
        if (allMoney > this.selectPayInfo.amount) {
          this.$message({
            message: "转款金额合计不能超过已收款金额"
          });
          return;
        }
      }

      if (allMoney === 0) {
        this.$message({
          message: "转款金额不能为0"
        });
        // this.sureSaveTransterShow = false;
        return;
      }
      if (flagArr.length != this.kuanleiVal.length) {
        this.$message({
          message: "不能选择重复款类"
        });
        return;
      }
      if (!this.isBoxPay) {
        let param = {
          payId: this.selectPayInfo.id,
          contCode: this.transterInfoPerson.inContractCode
        };
        this.$ajax
          .get("/api/payInfo/validateInOut", param)
          .then(res => {
            res = res.data;
            if (res.status === 200) {
              if (res.data) {
                this.sureSaveTransterShow = true;
              } else {
                this.$message({
                  message: `${res.message}`
                });
              }
            }
          })
          .catch(error => {
            this.$message({
              message: `${error}`
            });
          });
      } else {
        this.sureSaveTransterShow = true;
      }
    },
    transterSaveFinal() {
      let param = {
        InOutFormList: JSON.parse(JSON.stringify(this.kuanleiVal)),
        outId: this.selectPayInfo.contId, //转出的合同ID
        outCode: this.selectPayInfo.contCode, //转出的合同编号
        outPayInfoId: this.selectPayInfo.id, //转出的款项id
        outType: this.selectPayInfo.moneyTypeId, //转出的款类key
        outTypeId: this.selectPayInfo.moneyTypePid, //转出的款类id
        outMoney:
          this.zkEdit && this.transterInfoPerson
            ? this.transterInfoPerson.outMoney
            : this.selectPayInfo.amount, //转出时款类金额
        inId: this.transterInfoPerson.inId
          ? this.transterInfoPerson.inId
          : this.transterInfoPerson.inContractId, //转入的合同ID
        inCode: this.transterInfoPerson.inContractCode
          ? this.transterInfoPerson.inContractCode
          : "" //转入的合同编号
      };
      let url;
      if (this.zkEdit) {
        param.payId = this.selectPayInfo.id; //转款编辑需要入参
        url = "/api/payInfo/editInOutPayInfo ";
      } else {
        if (param.payId) delete param.payId; //转款不需要入参
        url = "/api/payInfo/inOutPayInfo";
      }
      this.$ajax
        .postJSON(url, param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.transterShow = false;
            this.sureSaveTransterShow = false;
            this.getData();
          }
        })
        .catch(error => {
          this.$message({
            message: error,
            type: "error"
          });
        });
    },
    toContWord() {
      this.currentPage2 = 1;
      this.selectCode = "";
      this.getContractList(1, this.contKeyWord);
    },
    sureCont() {
      if (!this.selectCode) {
        this.$message({
          message: "请选择合同"
        });
        return;
      }
      this.$set(
        this.transterInfoPerson,
        "inContractCode",
        this.selectCodeAll.code
      );
      this.$set(
        this.transterInfoPerson,
        "propertyAddr",
        this.selectCodeAll.propertyAddr
      );
      this.$set(this.transterInfoPerson, "inId", this.selectCodeAll.id);
      this.chooseContShow = false;
      console.log(this.selectCodeAll);
      console.log(this.selectCodeAll.code);
      console.log(this.selectCodeAll.propertyAddr);
    },
    getMoneyType() {
      let param = {};
      this.$ajax.get("/api/payInfo/selectMoneyType", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.moneyType = this.moneyType.concat(res.data);
        }
      });
    },
    getCell: function(label, index) {
      this.kuanleiVal[index].outType = label.key;
      this.kuanleiVal[index].outTypeId = label.pId;
    },
    cutNum: function(index) {
      this.kuanleiVal[index].outMoney = this.$tool.cutFloat({
        val: this.kuanleiVal[index].outMoney,
        max: 999999999.99
      });
    },
    toPayPages() {
      this.$router.push({
        path: "payBill",
        query: {
          payBillNoCont: 1
        }
      });
    }
  },
  filters: {
    zeroFormatter: function(val) {
      if (!val) {
        return 0;
      } else {
        return val;
      }
    },
    billState: function(val) {
      if (!val) {
        return "--";
      } else {
        if (val.type === 2) {
          return "--";
        } else {
          return val.billStatus && val.billStatus.label
            ? val.billStatus.label
            : "--";
        }
      }
    },
    moneyFormat: function(val) {
      if (!val) {
        return "零";
      } else {
        return TOOL.toChineseNumber(val);
      }
    },
    /**
     * 过滤显示图片缩略图
     * @param val后端返回的所有文件资源遍历的当前项
     * @param list图片资源获取签名后的临时数组
     * @vm 接收vue实例通过this._self传递才有效
     */
    getSignImage(val, list, vm) {
      if (list.length === 0) {
        return "";
      } else {
        let imgDir = list.find(item => {
          return item.includes(val.path);
        });
        let img = new Image();
        img.src = imgDir;
        img.onload = function() {
          let persent = parseFloat((img.width / img.height).toFixed(2));
          let imgWidth = 0;
          // console.log(persent)
          if (img.width > 100) {
            imgWidth = 100;
            // picture.style.height=`${800/this.persent}px`
            if (img.height > 90) {
              // picture.style.height=`${window.innerHeight}px`
              if (persent > 1) {
                imgWidth = 90 * persent * 0.6;
              } else {
                imgWidth = 90 * persent;
              }
            }
          } else {
            if (img.height > 90) {
              // picture.style.height=`${window.innerHeight}px`
              imgWidth = 90 * persent;
            }
          }
          vm.$set(val, "width", `${imgWidth}px`);
        };
        return imgDir;
      }
    }
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/common.less";
@import "~@/assets/less/lsx.less";

/deep/ .null-formatter {
  .cell:empty {
    position: relative;

    &:before {
      content: "--";
      width: 30px;
      display: inline-block;
    }
  }
}
/deep/.operation-btns {
  .el-button:nth-of-type(3n) {
    margin-left: 0;
  }
}

.width200 {
  width: 200px !important;
}

.width325 {
  width: 325px !important;
}

/deep/ .theader-bg {
  > th > .cell {
    white-space: normal !important;
  }
}

.row-scroll {
  position: fixed;
  /*left: 0;
    right: 0;*/
  bottom: 0;
  z-index: 999;
  background-color: @bg-white;
  padding: 0 1px;

  &-box {
    width: 100%;
    overflow-x: auto;

    > p {
      height: 1px;
    }
  }
}

.text-warning {
  color: red;
  cursor: pointer;
}

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
      content: "\e65d";
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

        &:first-of-type,
        &:nth-of-type(2) {
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
        margin-right: 10px;
      }
    }

    &:first-of-type,
    &.code-paper {
      > span {
        &:first-of-type {
          color: @color-blue;
          margin-right: 10px;
          cursor: pointer;
        }
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
  padding: 0 @margin-10;

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

// 转款弹框
.transter-detail {
  padding: 20px 20px 50px 20px;
  .title {
    font-weight: bold;
  }
  .kuanlei {
    width: 100%;
    label {
      float: left;
      margin-top: 5px;
    }
    ul {
      li {
        float: right;
        margin: 10px 221px 0 0;
        &:first-of-type {
          margin-top: 0;
        }
      }
    }
  }
  > p {
    line-height: 40px;
    .select {
      display: inline-block;
      text-align: center;
      color: #fff;
      width: 140px;
      padding: 2px 0;
      background: #478de3;
      border-radius: 2px;
      cursor: pointer;
      height: 30px;
      line-height: 30px;
    }
  }
  .info {
    span {
      width: 33.3333%;
    }
  }
  .icon {
    display: inline-block;
    cursor: pointer;
    .icon-tubiao_shiyong-14 {
      font-size: 22px;
      color: @color-blue;
    }
    .icon-tubiao_shiyong-4 {
      font-size: 22px;
      color: @color-FF5;
    }
  }
}
.outSide {
  display: flex;
  justify-content: center;
  align-items: center;
  //box-sizing: border-box;
  //padding: 2px;
  width: 18px;
  height: 18px;
  border: 1px solid #ccc;
  border-radius: 50%;
  .inLine {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  .inLineBg {
    background: @color-blue;
  }
}
// /deep/ .pagination-info {
//   text-align: center;
//   margin-top: 30px;
// }
.about-cont {
  /deep/ .cell {
    line-height: 15px;
  }
}
.sure-transter-dialog {
  p {
    text-align: center;
    &:first-of-type {
      font-weight: bold;
      margin-top: 30px;
      font-size: 18px;
    }
    &:nth-of-type(2) {
      margin-top: 20px;
    }
    &:nth-of-type(2),
    &:nth-of-type(3) {
      color: #ff2711;
    }
  }
  padding-bottom: 20px;
  padding-block-start: 1.25vw;
}

.refundBox {
  padding: 15px;
  .el-row {
    margin-bottom: 10px;
    p {
      padding: 0 0 10px 0;
    }
  }
  .min-title {
    font-size: 16px;
    font-weight: bold;
    padding-top: 10px;
  }
  .row-left {
  }
}

.upload-list {
  display: flex;
  flex-wrap: nowrap;
  margin: @margin-base 0;
  width: 810px;
  overflow-x: auto;
  > li {
    border: 1px dashed @color-D6;
    width: 115px;
    min-width: 115px;
    height: 115px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .span {
      width: 100px;
      text-align: center;
      /*word-break: break-all;*/
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &:first-of-type {
      .iconfont {
        cursor: pointer;
        color: @bg-th;
        font-size: 58px;
        position: relative;
        display: flex;
        align-items: center;
      }
    }

    &:nth-of-type(n + 1) {
      margin-right: @margin-base;
      position: relative;

      > p {
        position: absolute;
        top: 0;
        right: 0;
        color: @color-red;

        .iconfont {
          font-size: 20px;
        }
      }
    }
  }
}

.upload-text {
  color: @color-red;
  padding: 0 @margin-base;
}
</style>
