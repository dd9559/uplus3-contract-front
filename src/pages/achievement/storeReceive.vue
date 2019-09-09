<template>
  <div class="layout" ref="tableComView" style="background-color: #f5f5f5">
    <!-- 筛选条件  -->
    <ScreeningTop
      @propQueryFn="tableShow?getDetails('search'):getData('search')"
      @propResetFormFn="resetFormFn">
      <el-form
        :inline="true"
        ref="propForm"
        :model="propForm"
        class="prop-form"
        size="small">

        <el-form-item
          label="签约日期"
          prop="dateMo"
          class="mr">
          <el-date-picker
            v-model="propForm.dateMo"
            class="w330"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <!-- 部门 -->
        <!--<el-form-item label="部门" style="margin-left:20px;">
          <select-tree
            :data="DepList"
            :init="propForm.department"
            @checkCell="depHandleClick"
            @clear="clearDep"
          ></select-tree>
        </el-form-item>-->
      </el-form>
    </ScreeningTop>
    <!-- 筛选条件 end -->
    <!-- 数据列表 -->
    <div class="data-layout">
      <!-- 头部 -->
      <div class="data-head" v-if="power['sign-yj-report-export'].state">
        <div class="data-head-left">
          <!--<div class="head-left">
            <el-button type="primary" size="small" :class="[activeItem===1?'active':'']"
                       :disabled="this.steps[0]==0?true:false" @click.native="intodetial(1)">大区汇总
            </el-button>
            <el-button type="primary" size="small" :class="[activeItem===2?'active':'']"
                       :disabled="this.steps[1]==0?true:false" @click="intodetial(2)">片区汇总
            </el-button>
            <el-button type="primary" size="small" :class="[activeItem===3?'active':'']"
                       :disabled="this.steps[2]==0?true:false" @click="intodetial(3)">门店汇总
            </el-button>
            <el-button type="primary" size="small" :class="[activeItem===4?'active':'']"
                       :disabled="this.steps[3]==0?true:false" @click="intodetial(4)">单组汇总
            </el-button>
          </div>-->
          <h4 class="f14"><i class="iconfont icon-tubiao-11"></i>数据列表</h4>
        </div>
        <el-button class="data-head-right" round type="primary" size="medium" @click="tableShow?getExcel('tableDraw_two','店内合同明细'):getAll()"
                   style="padding:9px 15px;min-width: 80px;">导出
        </el-button>
      </div>
      <!-- 头部 end -->
      <!-- 表格一 -->
      <div class="data-list" v-if="!tableShow">
        <el-table
          key="pTable"
          :data="tableData"
          ref="tableCom"
          v-loading="loading"
          :max-height="tableNumberCom"
          :span-method="elTabelMerge"
          style="width: 100%"
          border>
          <el-table-column label="上级部门" align="center" prop="areaName" min-width="80"></el-table-column>
          <el-table-column label="门店" align="center" width="80">
            <template slot-scope="scope">
              <span class="cursor-style" @click="toDetails(scope.row)">{{scope.row.depName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="门店状态" align="center" width="80" prop="depStatus.label" :formatter="nullFormatter"></el-table-column>

          <el-table-column label="店长" align="center" prop="depManagerName" :formatter="nullFormatter"></el-table-column>
          <el-table-column label="签约总单数" align="center">
            <el-table-column
              prop="leaseAmount"
              label="租赁"
              align="center"
              :formatter="nullFormatter"
              width="70">
            </el-table-column>
            <el-table-column
              prop="secondAmount"
              label="买卖"
              align="center"
              :formatter="nullFormatter"
              width="70">
            </el-table-column>
            <el-table-column
              prop="lowAmount"
              label="低佣"
              align="center"
              :formatter="nullFormatter"
              width="70">
            </el-table-column>
            <el-table-column
              prop="agencyAmount"
              label="代办"
              align="center"
              :formatter="nullFormatter"
              width="70">
            </el-table-column>
          </el-table-column>
          <el-table-column label="本月实收业绩（元）" align="center">
            <el-table-column
              prop="leaseActual"
              label="租赁"
              align="center"
              :formatter="nullFormatter"
              width="70">
            </el-table-column>
            <el-table-column
              prop="secondActual"
              label="买卖"
              align="center"
              :formatter="nullFormatter"
              width="70">
            </el-table-column>
            <el-table-column
              prop="lowActual"
              label="低佣"
              align="center"
              :formatter="nullFormatter"
              width="70">
            </el-table-column>
            <el-table-column
              prop="agencyActual"
              label="代办"
              align="center"
              :formatter="nullFormatter"
              width="70">
            </el-table-column>
            <el-table-column
              prop="damagesActual"
              label="违约金（元）"
              align="center"
              :formatter="nullFormatter"
              width="70">
            </el-table-column>
            <el-table-column
              prop="financialFeeActual"
              label="金融收入（元）"
              align="center"
              :formatter="nullFormatter"
              width="70">
            </el-table-column>
          </el-table-column>
          <el-table-column label="本月合同业绩（元）" align="center">
            <el-table-column
              prop="leaseShould"
              label="租赁"
              align="center"
              :formatter="nullFormatter"
              width="70">
            </el-table-column>
            <el-table-column
              prop="secondShould"
              label="买卖"
              align="center"
              :formatter="nullFormatter"
              width="70">
            </el-table-column>
            <el-table-column
              prop="lowShould"
              label="低佣"
              align="center"
              :formatter="nullFormatter"
              width="70">
            </el-table-column>
            <el-table-column
              prop="agencyShould"
              label="代办"
              align="center"
              :formatter="nullFormatter"
              width="70">
            </el-table-column>
            <el-table-column
              prop="damagesShould"
              label="违约金（元）"
              align="center"
              :formatter="nullFormatter"
              width="70">
            </el-table-column>
            <el-table-column
              prop="financialFeeShould"
              label="金融收入（元）"
              align="center"
              :formatter="nullFormatter"
              width="70">
            </el-table-column>
          </el-table-column>

          <el-table-column label="本月实收金额（元）" align="center" prop="totalActual"></el-table-column>

          <el-table-column label="本月合同金额（元）" align="center" prop="totalShould"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageNum"
          :page-size="3"
          layout="total, prev, pager, next, jumper"
          :total="total"
          v-if="total!=0">
        </el-pagination>
      </div>
      <div class="data-list" v-else>
        <el-table
          key="cTable"
          :data="tableData"
          ref="tableCom"
          v-loading="loading"
          :max-height="tableNumberCom"
          :span-method="elTabelMerge"
          style="width: 100%"
          border>
          <el-table-column label="门店" align="center" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.type==='total'">总计</span>
              <span v-else>{{storeName[scope.$index+1]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="合同内容" align="center">
            <el-table-column
              label="签约日期"
              align="center"
              width="70">
              <template slot-scope="scope">
                <span v-if="scope.row.contractContent" :class="{'txt-red':scope.row.type==='noAchievementEmp'}">{{scope.row.contractContent.signDate|formatTime}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="合同类型"
              align="center"
              width="70">
              <template slot-scope="scope">
                <span :class="{'txt-red':scope.row.type==='noAchievementEmp'}">{{scope.row.contractContent.tradeType|getLabel}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="签约方式"
              align="center"
              width="70">
              <template slot-scope="scope">
                <span :class="{'txt-red':scope.row.type==='noAchievementEmp'}">{{scope.row.contractContent.recordType|getLabel}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="contractContent.code"
              label="合同编号"
              align="center"
              :formatter="nullFormatter"
              width="70">
              <template slot-scope="scope">
                <span :class="{'txt-red':scope.row.type==='noAchievementEmp'}">{{scope.row.contractContent.code|getLabel}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="纸质编号"
              align="center"
              width="70">
              <template slot-scope="scope">
                <span :class="{'txt-red':scope.row.type==='noAchievementEmp'}">{{scope.row.contractContent.pCode|getLabel}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="合同地址"
              align="center"
              width="70">
              <template slot-scope="scope">
                <span :class="{'txt-red':scope.row.type==='noAchievementEmp'}">{{scope.row.contractContent.propertyAddr|getLabel}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="合同成交价（元）"
              align="center"
              width="70">
              <template slot-scope="scope">
                <span :class="{'txt-red':scope.row.type==='noAchievementEmp'}">{{scope.row.contractContent.dealPrice|getLabel}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="合同应收佣金（元）"
              align="center"
              width="70">
              <template slot-scope="scope">
                <span :class="{'txt-red':scope.row.type==='noAchievementEmp'}">{{scope.row.contractContent.receivableCommission|getLabel}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="单数" align="center">
            <template slot-scope="scope">
              <span :class="{'txt-red':scope.row.type==='noAchievementEmp'}">{{scope.row.singleNum|getLabel}}</span>
            </template>
          </el-table-column>
          <el-table-column label="本店收入" align="center">
            <el-table-column
              label="本店分成比例"
              align="center"
              width="70">
              <template slot-scope="scope">
                <span v-if="scope.row.localIncome.ratioSum" :class="{'txt-red':scope.row.type==='noAchievementEmp'}">{{scope.row.localIncome.ratioSum}}%</span>
                <span :class="{'txt-red':scope.row.type==='noAchievementEmp'}" v-else>0.00%</span>
              </template>
            </el-table-column>
            <el-table-column
              label="本店应收佣金（元）"
              align="center"
              width="70">
              <template slot-scope="scope">
                <span :class="{'txt-red':scope.row.type==='noAchievementEmp'}">{{scope.row.localIncome.receivableSum|getLabel}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="本月实收佣金（元）"
              align="center"
              width="70">
              <template slot-scope="scope">
                <span :class="{'txt-red':scope.row.type==='noAchievementEmp'}">{{scope.row.localIncome.localActual|getLabel}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="经纪人"
              align="center"
              class-name="info-cell"
              width="70">
              <template slot-scope="scope">
                <ul class="cell-list" :class="{'txt-red':scope.row.type==='noAchievementEmp'}">
                  <li :title="item.level4+item.assignor" v-for="item in scope.row.localIncome.localAgent">
                    {{item.level4}}-{{item.assignor}}
                  </li>
                  <template v-if="scope.row.localIncome.localAgent<scope.row.cooperateIncome.cooperateAgent">
                    <li v-for="item in (scope.row.cooperateIncome.cooperateAgent.length-scope.row.localIncome.localAgent.length)">--</li>
                  </template>
                </ul>
                <span v-if="scope.row.type==='total'&&scope.row.localIncome.localAgent&&scope.row.localIncome.localAgent.length===0">--</span>
              </template>
            </el-table-column>
            <el-table-column
              label="在职状态"
              align="center"
              class-name="info-cell"
              width="70">
              <template slot-scope="scope">
                <ul class="cell-list" :class="{'txt-red':scope.row.type==='noAchievementEmp'}">
                  <li v-for="item in scope.row.localIncome.localAgent">
                    {{item.isJob|getLabel}}
                  </li>
                  <template v-if="scope.row.localIncome.localAgent<scope.row.cooperateIncome.cooperateAgent">
                    <li v-for="item in (scope.row.cooperateIncome.cooperateAgent.length-scope.row.localIncome.localAgent.length)">--</li>
                  </template>
                </ul>
                <span v-if="scope.row.type==='total'&&scope.row.localIncome.localAgent&&scope.row.localIncome.localAgent.length===0">--</span>
              </template>
            </el-table-column>
            <el-table-column
              label="分成比例"
              align="center"
              class-name="info-cell"
              width="70">
              <template slot-scope="scope">
                <ul class="cell-list" :class="{'txt-red':scope.row.type==='noAchievementEmp'}">
                  <li v-for="item in scope.row.localIncome.localAgent">
                    <span v-if="item.ratio">{{item.ratio}}%</span>
                    <span v-else>0.00%</span>
                  </li>
                  <template v-if="scope.row.localIncome.localAgent<scope.row.cooperateIncome.cooperateAgent">
                    <li v-for="item in (scope.row.cooperateIncome.cooperateAgent.length-scope.row.localIncome.localAgent.length)">--</li>
                  </template>
                </ul>
                <span v-if="scope.row.type==='total'&&scope.row.localIncome.localAgent&&scope.row.localIncome.localAgent.length===0">--</span>
              </template>
            </el-table-column>
            <el-table-column
              label="本月实收分成金额（元）"
              align="center"
              class-name="info-cell"
              width="70">
              <template slot-scope="scope">
                <ul class="cell-list" :class="{'txt-red':scope.row.type==='noAchievementEmp'}">
                  <li v-for="item in scope.row.localIncome.localAgent">
                    {{item.singleActual|formatNull}}
                  </li>
                  <template v-if="scope.row.localIncome.localAgent<scope.row.cooperateIncome.cooperateAgent">
                    <li v-for="item in (scope.row.cooperateIncome.cooperateAgent.length-scope.row.localIncome.localAgent.length)">--</li>
                  </template>
                </ul>
                <span v-if="scope.row.type==='total'&&scope.row.localIncome.localAgent&&scope.row.localIncome.localAgent.length===0">--</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="合作门店收入" align="center">
            <el-table-column
              label="合作门店"
              align="center"
              class-name="info-cell"
              width="70">
              <template slot-scope="scope">
                <ul class="cell-list" v-if="scope.row.cooperateIncome" :class="{'txt-red':scope.row.type==='noAchievementEmp'}">
                  <li :title="item.level4" v-for="item in scope.row.cooperateIncome.cooperateAgent">
                    {{item.level4|formatNull}}
                  </li>
                  <template v-if="scope.row.localIncome.localAgent>scope.row.cooperateIncome.cooperateAgent">
                    <li v-for="item in (scope.row.localIncome.localAgent.length-scope.row.cooperateIncome.cooperateAgent.length)">--</li>
                  </template>
                </ul>
                <span v-if="!scope.row.cooperateIncome.cooperateAgent">--</span>
              </template>
            </el-table-column>
            <el-table-column
              label="合作经纪人"
              align="center"
              class-name="info-cell"
              width="70">
              <template slot-scope="scope">
                <ul class="cell-list" v-if="scope.row.cooperateIncome" :class="{'txt-red':scope.row.type==='noAchievementEmp'}">
                  <li :title="item.assignor" v-for="item in scope.row.cooperateIncome.cooperateAgent">
                    {{item.assignor|formatNull}}
                  </li>
                  <template v-if="scope.row.localIncome.localAgent>scope.row.cooperateIncome.cooperateAgent">
                    <li v-for="item in (scope.row.localIncome.localAgent.length-scope.row.cooperateIncome.cooperateAgent.length)">--</li>
                  </template>
                </ul>
                <span v-if="!scope.row.cooperateIncome.cooperateAgent">--</span>
              </template>
            </el-table-column>
            <el-table-column
              label="分成比例"
              align="center"
              class-name="info-cell"
              width="70">
              <template slot-scope="scope">
                <ul class="cell-list" v-if="scope.row.cooperateIncome" :class="{'txt-red':scope.row.type==='noAchievementEmp'}">
                  <li v-for="item in scope.row.cooperateIncome.cooperateAgent">
                    <span v-if="item.ratio">{{item.ratio}}%</span>
                    <span v-else>0.00%</span>
                  </li>
                  <template v-if="scope.row.localIncome.localAgent>scope.row.cooperateIncome.cooperateAgent">
                    <li v-for="item in (scope.row.localIncome.localAgent.length-scope.row.cooperateIncome.cooperateAgent.length)">--</li>
                  </template>
                </ul>
                <span v-if="!scope.row.cooperateIncome.cooperateAgent">--</span>
              </template>
            </el-table-column>
            <el-table-column
              label="本月实收分成金额（元）"
              align="center"
              class-name="info-cell"
              width="70">
              <template slot-scope="scope">
                <ul class="cell-list" v-if="scope.row.cooperateIncome" :class="{'txt-red':scope.row.type==='noAchievementEmp'}">
                  <li v-for="item in scope.row.cooperateIncome.cooperateAgent">
                    {{item.singleActual|formatNull}}
                  </li>
                  <template v-if="scope.row.localIncome.localAgent>scope.row.cooperateIncome.cooperateAgent">
                    <li v-for="item in (scope.row.localIncome.localAgent.length-scope.row.cooperateIncome.cooperateAgent.length)">--</li>
                  </template>
                </ul>
                <span v-if="!scope.row.cooperateIncome.cooperateAgent">--</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageNum"
          :page-size="3"
          layout="total, prev, pager, next, jumper"
          :total="total"
          v-if="total!=0">
        </el-pagination>
      </div>
    </div>
    <div class="print-table" style="display: none;">
      <table id="tableDraw_one" border="1" cellspacing="0" cellpadding="0" style="width:100%;border: solid;" v-if="!tableShow">
        <thead>
          <tr>
            <th rowspan="2">上级部门</th>
            <th rowspan="2">门店</th>
            <th rowspan="2">门店状态</th>
            <th rowspan="2">店长</th>
            <th colspan="4">签约总单数</th>
            <th colspan="6">本月实收业绩（元）</th>
            <th colspan="6">本月合同业绩（元）</th>
            <th rowspan="2">本月实收金额（元）</th>
            <th rowspan="2">本月合同金额（元）</th>
          </tr>
          <tr>
            <th>租赁</th>
            <th>买卖</th>
            <th>低佣</th>
            <th>代办</th>
            <th>租赁</th>
            <th>买卖</th>
            <th>低佣</th>
            <th>代办</th>
            <th>违约金（元）</th>
            <th>金融收入（元）</th>
            <th>租赁</th>
            <th>买卖</th>
            <th>低佣</th>
            <th>代办</th>
            <th>违约金（元）</th>
            <th>金融收入（元）</th>
          </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in reportData">
          <td v-if="rowspan_report[index+1]" :rowspan="rowspan_report[index+1]">{{item.areaName}}</td>
          <td>{{item.depName}}</td>
          <td>{{item.depStatus|getLabel}}</td>
          <td>{{item.depManagerName|formatNull}}</td>
          <td>{{item.leaseAmount}}</td>
          <td>{{item.secondAmount}}</td>
          <td>{{item.lowAmount}}</td>
          <td>{{item.agencyAmount}}</td>
          <td>{{item.leaseActual}}</td>
          <td>{{item.secondActual}}</td>
          <td>{{item.lowActual}}</td>
          <td>{{item.agencyActual}}</td>
          <td>{{item.damagesActual}}</td>
          <td>{{item.financialFeeActual}}</td>
          <td>{{item.leaseShould}}</td>
          <td>{{item.secondShould}}</td>
          <td>{{item.lowShould}}</td>
          <td>{{item.agencyShould}}</td>
          <td>{{item.damagesShould}}</td>
          <td>{{item.financialFeeShould}}</td>
          <td>{{item.totalActual}}</td>
          <td>{{item.totalShould}}</td>
        </tr>
        </tbody>
      </table>
      <table id="tableDraw_two" border="1" cellspacing="0" cellpadding="0" v-else style="width:100%;border: solid;">
        <thead>
        <tr>
          <th rowspan="2">门店</th>
          <th colspan="8">合同内容</th>
          <th rowspan="2">单数</th>
          <th colspan="7">本店收入</th>
          <th colspan="4">合作门店收入</th>
        </tr>
        <tr>
          <th>签约日期</th>
          <th>合同类型</th>
          <th>签约方式</th>
          <th>合同编号</th>
          <th>纸质编号</th>
          <th>合同地址</th>
          <th>合同成交价（元）</th>
          <th>合同应收佣金（元）</th>
          <th>本店分成比例</th>
          <th>本店应收佣金（元）</th>
          <th>本月实收佣金（元）</th>
          <th>经纪人</th>
          <th>在职状态</th>
          <th>分成比例</th>
          <th>本月实收分成金额（元）</th>
          <th>合作门店</th>
          <th>合作经纪人</th>
          <th>分成比例</th>
          <th>本月实收分成金额（元）</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in tableData">
          <td :rowspan="rowspan[index+1]" v-if="rowspan[index+1]">{{item.type==='total'?'总计':storeName[index+1]}}</td>
          <td :style="{'color':item.type==='noAchievementEmp'?'red':'inherit'}">{{item.contractContent&&item.contractContent.signDate|formatNull}}</td>
          <td :style="{'color':item.type==='noAchievementEmp'?'red':'inherit'}">{{item.contractContent&&item.contractContent.tradeType|getLabel}}</td>
          <td :style="{'color':item.type==='noAchievementEmp'?'red':'inherit'}">{{item.contractContent&&item.contractContent.recordType|getLabel}}</td>
          <td :style="{'color':item.type==='noAchievementEmp'?'red':'inherit'}">{{item.contractContent&&item.contractContent.code|formatNull}}</td>
          <td :style="{'color':item.type==='noAchievementEmp'?'red':'inherit'}">{{item.contractContent&&item.contractContent.pCode|formatNull}}</td>
          <td :style="{'color':item.type==='noAchievementEmp'?'red':'inherit'}">{{item.contractContent&&item.contractContent.propertyAddr|formatNull}}</td>
          <td :style="{'color':item.type==='noAchievementEmp'?'red':'inherit'}">{{item.contractContent&&item.contractContent.dealPrice|formatNull}}</td>
          <td :style="{'color':item.type==='noAchievementEmp'?'red':'inherit'}">{{item.contractContent&&item.contractContent.receivableCommission|formatNull}}</td>
          <td :style="{'color':item.type==='noAchievementEmp'?'red':'inherit'}">{{item.singleNum|formatNull}}</td>
          <td :style="{'color':item.type==='noAchievementEmp'?'red':'inherit'}">{{item.localIncome&&item.localIncome.ratioSum|formatNull}}</td>
          <td :style="{'color':item.type==='noAchievementEmp'?'red':'inherit'}">{{item.localIncome&&item.localIncome.receivableSum|formatNull}}</td>
          <td :style="{'color':item.type==='noAchievementEmp'?'red':'inherit'}">{{item.localIncome&&item.localIncome.localActual|formatNull}}</td>
          <td :style="{'color':item.type==='noAchievementEmp'?'red':'inherit'}">
            <template v-for="tip in item.localIncome.localAgent">
              <span v-if="tip.level4&&tip.assignor">{{tip.level4}}{{tip.assignor}}</span>
              <span v-else>--</span>
              <br/>
            </template>
            <template v-if="item.localIncome.localAgent<item.cooperateIncome.cooperateAgent">
              <span v-for="tip in (item.cooperateIncome.cooperateAgent.length-item.localIncome.localAgent.length)">--<br/></span>
            </template>
            <span v-if="item.type==='total'&&item.localIncome.localAgent&&item.localIncome.localAgent.length===0">--</span>
          </td>
          <td :style="{'color':item.type==='noAchievementEmp'?'red':'inherit'}">
            <template v-for="tip in item.localIncome.localAgent">
              {{tip.isJob|getLabel}}<br/>
            </template>
            <template v-if="item.localIncome.localAgent<item.cooperateIncome.cooperateAgent">
              <span v-for="tip in (item.cooperateIncome.cooperateAgent.length-item.localIncome.localAgent.length)">--<br/></span>
            </template>
            <span v-if="item.type==='total'&&item.localIncome.localAgent&&item.localIncome.localAgent.length===0">--</span>
          </td>
          <td :style="{'color':item.type==='noAchievementEmp'?'red':'inherit'}">
            <template v-for="tip in item.localIncome.localAgent">
              <span v-if="tip.ratio">{{tip.ratio}}%</span>
              <span v-else>--</span>
              <br/>
            </template>
            <template v-if="item.localIncome.localAgent<item.cooperateIncome.cooperateAgent">
              <span v-for="tip in (item.cooperateIncome.cooperateAgent.length-item.localIncome.localAgent.length)">--<br/></span>
            </template>
            <span v-if="item.type==='total'&&item.localIncome.localAgent&&item.localIncome.localAgent.length===0">--</span>
          </td>
          <td :style="{'color':item.type==='noAchievementEmp'?'red':'inherit'}"><!--本月实收分成金额-->
            <template v-for="tip in item.localIncome.localAgent">
              {{tip.singleActual|formatNull}}<br/>
            </template>
            <template v-if="item.localIncome.localAgent<item.cooperateIncome.cooperateAgent">
              <span v-for="tip in (item.cooperateIncome.cooperateAgent.length-item.localIncome.localAgent.length)">--<br/></span>
            </template>
            <span v-if="item.type==='total'&&item.localIncome.localAgent&&item.localIncome.localAgent.length===0">--</span>
          </td>
          <td :style="{'color':item.type==='noAchievementEmp'?'red':'inherit'}">
            <template v-for="tip in item.cooperateIncome.cooperateAgent">
              {{tip.level4|formatNull}}<br/>
            </template>
            <template v-if="item.localIncome.localAgent>item.cooperateIncome.cooperateAgent">
              <span v-for="tip in (item.localIncome.localAgent.length-item.cooperateIncome.cooperateAgent.length)">--<br/></span>
            </template>
            <template v-if="!item.cooperateIncome.cooperateAgent">--</template>
          </td>
          <td :style="{'color':item.type==='noAchievementEmp'?'red':'inherit'}">
            <template v-for="tip in item.cooperateIncome.cooperateAgent">
              {{tip.assignor|formatNull}}<br/>
            </template>
            <template v-if="item.localIncome.localAgent>item.cooperateIncome.cooperateAgent">
              <span v-for="tip in (item.localIncome.localAgent.length-item.cooperateIncome.cooperateAgent.length)">--<br/></span>
            </template>
            <template v-if="!item.cooperateIncome.cooperateAgent">--</template>
          </td>
          <td :style="{'color':item.type==='noAchievementEmp'?'red':'inherit'}">
            <template v-for="tip in item.cooperateIncome.cooperateAgent">
              <span v-if="tip.ratio">{{tip.ratio}}%</span>
              <span v-else>--</span>
              <br/>
            </template>
            <template v-if="item.localIncome.localAgent>item.cooperateIncome.cooperateAgent">
              <span v-for="tip in (item.localIncome.localAgent.length-item.cooperateIncome.cooperateAgent.length)">--<br/></span>
            </template>
            <template v-if="!item.cooperateIncome.cooperateAgent">--</template>
          </td>
          <td :style="{'color':item.type==='noAchievementEmp'?'red':'inherit'}">
            <template v-for="tip in item.cooperateIncome.cooperateAgent">
              {{tip.singleActual|formatNull}}<br/>
            </template>
            <template v-if="item.localIncome.localAgent>item.cooperateIncome.cooperateAgent">
              <span v-for="tip in (item.localIncome.localAgent.length-item.cooperateIncome.cooperateAgent.length)">--<br/></span>
            </template>
            <template v-if="!item.cooperateIncome.cooperateAgent">--</template>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import {FILTER} from "@/assets/js/filter";
  import {MIXINS} from "@/assets/js/mixins";

  export default {
    mixins: [MIXINS, FILTER],
    data() {
      return {
        tableData: [],
        reportData: [],//业绩报表所有数据，导出时候用
        propForm: {
          dateMo: "",//时间
        },
        total: 0,
        tableShow: false, //列表内容是否为店内合同明细
        storeTitle: "全公司",
        steps: [],
        level: 1,
        partStep: "副总",
        dpart: 1,
        pageSize: 10,
        pageNum: 1,
        loading: true,
        activeItem: '',
        rowspan:{},//合并行数
        rowspan_report:{},
        tabTotal:0,
        storeName:{},//合同明细的门店名称
        depIds:'',//请求合同明细参数
        power:{
          'sign-yj-report-export': {
            state: false,
            name: '导出'
          },
        }
      };
    },
    created() {
      var date = new Date();
      date = date.setDate(1);
      date = this.$tool.dateFormat(date)
      var date2 = this.$tool.dateFormat(Date.now())
      this.propForm.dateMo = [date, date2]

      //路由带参显示店内合同明细表
      if (this.$route.query.detail) {
        this.setPath(this.getPath.concat({name: '店内合同明细'}))
        this.depIds=this.$route.query.ids
        this.tableShow = true
        this.getDetails()
      }else {
        this.getData()
      }
      let list=[
        {id:1,arr:[1,2,48,4]},
        {id:2,arr:[4,5]},
        {id:3,arr:[6]},
        {id:4,arr:[7,8,9,10]}
      ]
      // this.mergeRow(list,'arr')
    },
    methods: {
      // 获取店内合同明细
      getDetails:function (type='init') {
        let param = {
          pageSize: 3,//定值
          pageNum: this.pageNum,
          depIds:this.depIds,
          cityId:1,
        };
        if (type !== 'init'||true) {
          param = Object.assign(param, {
            startTime: this.propForm.dateMo ? this.propForm.dateMo[0] : '', //开始时间
            endTime: this.propForm.dateMo ? this.propForm.dateMo[1] : '', //结束时间
          })
        }
        this.$ajax.get('/api/achievementSheet/getAchiSheetDetail',param).then(res=>{
          res=res.data
          if(res.status===200){
            this.tableData=[]
            let temporaryArr=[]//临时数组，生成符合mergeRow方法的数据结构
            let NameList=[]//临时存放门店名称
            res.data.data.forEach((item,index)=>{
              let chipArr=[...item.localContract,...item.noAchievementEmp]
              temporaryArr.push({list:chipArr})
              temporaryArr.push({list:item.totalData})
              this.tableData=this.tableData.concat(chipArr,item.totalData)

              NameList.push(item.storeName)
            })
            // console.log(temporaryArr)
            this.total=res.data.total
            this.loading=false
            this.rowspan=this.mergeRow(temporaryArr,'list')

            let privateObj=JSON.parse(JSON.stringify(this.rowspan))//克隆合并对象
            let obj={}
            Object.keys(privateObj).forEach((item,index)=>{
              if((index+1)%2!==0){//剔除合并对象中的总计项
                // delete privateObj[item]
                obj[item]=NameList[index/2]
              }
            })
            /*Object.keys(privateObj).forEach((item,index)=>{
              obj[item]=this.storeName[index]
            })*/
            this.storeName=Object.assign({},obj)
          }
        }).catch(error=>{
          this.$message({
            message:error
          })
        })
      },
      elTabelMerge:function ({ row, column, rowIndex, columnIndex }) {
        if(columnIndex===0){
          let loop=1
          let rowTotal=0
          for(let item in this.rowspan){
            rowTotal+=this.rowspan[item]
            if(rowIndex+1===Number(item)){
              return [this.rowspan[item],1]
            }else if(rowIndex+1<=rowTotal){
              return [0,0]
            }
            loop++
          }
        }
      },
      mergeRow:function (arr,param) {
        //{1:3,4:2,6:1,7:4}
        let cache=Object.create(null)//暂存区，存放最新获取的一组数据
        let res=Object.create(null)//数组的筛选结果
        let total=0
        if(param){
          for(let i=0;i<arr.length;i++){
            i===0&&(cache[1]=arr[i][param].length)//初始化暂存区
            res=Object.assign(res,cache)//数组每次循环都将暂存区的数据合并到res
            total+=arr[i][param].length
            if(i<arr.length-1){
              for(let item in cache){
                cache[Number(item)+cache[item]]=arr[i+1][param].length
                delete cache[item]
              }
            }
          }
        }else {
          for(let i=0;i<arr.length;i++){
            i===0&&(cache[1]=arr[i].length)//初始化暂存区
            res=Object.assign(res,cache)//数组每次循环都将暂存区的数据合并到res
            total+=arr[i].length
            if(i<arr.length-1){
              for(let item in cache){
                cache[Number(item)+cache[item]]=arr[i+1].length
                delete cache[item]
              }
            }
          }
        }
        return res
      },
      getData(type = 'init') {
        let param = {
          pageNum: this.pageNum,
        };
        if (type !== 'init'|true) {
          param = Object.assign(param, {
            startTime: this.propForm.dateMo ? this.propForm.dateMo[0] : '', //开始时间
            endTime: this.propForm.dateMo ? this.propForm.dateMo[1] : '', //结束时间
          })
        }
        this.tableData=[]
        this.$ajax.get('/api/achievementSheet/getAchievementDepSumList', param).then(res => {
          res=res.data
          if(res.status===200){
            // debugger
            let cell=res.data.list
            cell.forEach(item=>{
              this.tableData=this.tableData.concat([...item])
            })
            this.total=res.data.count
            this.loading=false
            this.rowspan = this.mergeRow(cell)
          }
        }).catch(err => {
          this.$message({message: err})
        })
      },
      //业绩报表请求导出所有数据
      getAll:function () {
        let param = {
          pageNum: this.pageNum,
        };
        if (true) {
          param = Object.assign(param, {
            startTime: this.propForm.dateMo ? this.propForm.dateMo[0] : '', //开始时间
            endTime: this.propForm.dateMo ? this.propForm.dateMo[1] : '', //结束时间
          })
        }
        this.reportData=[]
        this.$ajax.get('/api/achievementSheet/exportAchievementSheet', param).then(res => {
          res=res.data
          if(res.status===200){
            let cell=res.data.list
            cell.forEach(item=>{
              this.reportData=this.reportData.concat([...item])
            })
            this.rowspan_report=this.mergeRow(cell)
            this.$nextTick(()=>{//等待页面渲染完成
              this.getExcel('tableDraw_one','业绩报表')
            })
          }
        }).catch(err => {
          this.$message({message: err})
        })
      },
      //跳转店内合同明细
      toDetails(data) {
        if(data.depName==='合计'){
          return
        }
        let newPage = this.$router.resolve({
          path: "/storeReceive",
          query: {
            detail: true,
            ids:data.depIds.join(',')
          }
        });
        window.open(newPage.href, "_blank");
      },
      intodetial(type) {
        this.activeItem = type
        this.dpart = type
        this.propForm.depId = ''
        this.propForm.department = ''
        this.pageNum = 1
        let param = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          startTime: this.propForm.dateMo ? this.propForm.dateMo[0] : '', //开始时间
          endTime: this.propForm.dateMo ? this.propForm.dateMo[1] : '', //结束时间
          depLevel: type
        }
      },
      //前端导出
      getExcel:function (table,name) {
        var uri = 'data:application/vnd.ms-excel;base64,'
        var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
        var base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        var format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }

        if (!table.nodeType) table = document.getElementById(table)
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }

        var aLink=document.createElement('a')
        aLink.href = uri + base64(format(template, ctx));
        aLink.download = `${name}.xls`;
        aLink.click()
      },
      resetFormFn() {
        this.propForm.department = ''
        this.propForm.departmentDetail = ''
        this.propForm.dateMo = ''
      },
      clearDep: function () {
        this.propForm.department = "";
        this.propForm.depId = '';
      },
      //部门控件元素选择操作
      depHandleClick(data) {
        this.propForm.depId = data.depId;
        this.propForm.department = data.name;
      },
      //分页
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.tableShow?this.getDetails('page'):this.getData('page')
      },
    }
  };
</script>

<style scoped lang="less">
  @import "~@/assets/less/lsx.less";

  .cursor-style {
    cursor: pointer;
    color: @color-blue;
  }
  .cell-list{
    margin:0px;
    padding: 0px;
    list-style: none;
    >li{
      white-space: nowrap;
      border-bottom: 1px solid #EBEEF5;
      padding: 4px 0px;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      &:before{
        content: '';
        width: 1px;
        height: 100%;
        display: inline-block;
      }
      &:last-of-type{
        border-bottom: 0px;
      }
    }
  }
  .txt-red{
    color: @color-red;
  }
  /deep/ .info-cell{
    padding: 0px !important;
    .cell{
      padding: 0px;
    }
  }

  .layout {
    // background-color: #F2F3F8!important;
    .check-btn span {
      color: #478de3;
    }
    .check-btn span:first-of-type {
      margin-right: 8px;
    }
    .blue {
      color: #478de3;
      cursor: pointer;
      // text-decoration: underline
    }
    .orange {
      color: #f56c6c;
    }
    .green {
      color: #54d384;
    }
    //  筛选条件
    .filter-layout {
      // width: 1680px;
      background-color: #fff;
      padding-bottom: 0;
      position: relative;
      .btn {
        width: 56px;
        height: 17px;
        position: absolute;
        bottom: -17px;
        left: 50%;
        margin-left: -28px;
        z-index: 9;
        background: url(../../assets/img/icon-dowm.png) no-repeat center center;
        background-size: 56px auto;
        cursor: pointer;
      }
      .filter-left {
        h1 {
          font-size: 18px;
          color: #233241;
          position: relative;
          padding-left: 28px;
          b {
            position: absolute;
            width: 16px;
            height: 16px;
            // background-color: red;
            left: 0px;
            top: 50%;
            margin-top: -8px;
          }
        }
      }
      .filter-right {
        // margin-right: 30px;
        .el-button--primary {
          width: 100px;
          height: 36px;
          border-radius: 18px;
          line-height: 36px;
          padding: 0;
        }
        .el-button--primary:first-of-type {
          background-color: #fff;
          color: #32485f;
          border: 2px solid #e8eaf6;
        }
        .el-button--primary:nth-of-type(2) {
          background-color: #478de3;
          color: #fff;
          border: 0;
        }
      }
    }

    //数据列表
    .data-layout {
      // height: 1000px;
      margin-top: 20px;
      padding: 6px 10px 0px;
      background-color: #fff;
      /deep/ .el-table__header th {
        background-color: #eef2fb;
      }
      .data-head {
        // height: 100px;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0px 0px 6px;
      }
    }

    .head-left {
      margin-top: 10px;
      margin-bottom: 10px;
      .el-button {
        display: inline-block;
        background: white;
        text-align: center;
        color: #909399;
        border: solid 1px #909399;
        &.active {
          color: #fff;
          background-color: #409EFF;
          border-color: #409EFF
        }
      }

    }
    // 展示数据
    .data-list {
      width: 100%;
      /deep/ .el-table {
        // font-size: 14px !important;
        td,
        th {
          padding: 24px 0;
        }
        .el-table__header {
          th {
            padding: 6px 0;
            background-color: #eef2fb;
          }
        }
      }
    }

    /deep/ .el-pagination {
      text-align: right;
    }
    /deep/ .el-input__suffix {
      right: 12px;
    }
    /deep/ .el-table--border th {
      border-bottom: 2px solid #dadde4;
      border-right: 2px solid #dadde4;
    }
  }
</style>
