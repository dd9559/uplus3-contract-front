<template>
    <div ref="tableComView">
        <!-- 筛选 -->
        <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
            <el-form :inline="true" ref="propForm" :model="propForm" class="prop-form" size="small">
                <el-form-item label="关键字" prop="search">
                    <el-tooltip content="合同编号/物业地址/业主/客户/房产证号/手机号" placement="top">
                        <el-input class="w200" v-model="propForm.search" placeholder="请输入" clearable></el-input>
                    </el-tooltip>
                </el-form-item>
                <div class="in-block">
                    <el-form-item prop="region" class="mr">
                        <el-select 
                        v-model="propForm.region" 
                        @change="receivingdateChangeFn"
                        class="w110">
                            <el-option v-for="item in rules.region" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item 
                    v-show="propForm.region === RECEIVINGDATE.end"
                    class="mr"
                    prop="steps">
                        <el-select 
                        v-model="propForm.steps" 
                        placeholder="交易步骤"
                        class="w110">
                            <el-option v-for="item in rules.steps" 
                            :key="'regionSteps'+item.id" 
                            :label="item.name" 
                            :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item 
                    prop="dateMo">
                        <el-date-picker v-model="propForm.dateMo" class="w284" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </div>
                <div class="in-block">
                    <el-form-item 
                    label="交易步骤"
                    prop="steps" 
                    class="mr">
                        <el-select 
                        v-model="propForm.steps" 
                        placeholder="交易步骤"
                        class="w110">
                            <el-option v-for="item in rules.steps" 
                            :key="'steps'+item.id" 
                            :label="item.name" 
                            :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="stepsMo">
                        <el-select 
                        v-model="propForm.stepsMo" 
                        class="w110" 
                        placeholder="状态">
                            <el-option 
                            v-for="item in rules.stepsMo" 
                            :key="'stepsMo'+item.key" 
                            :label="item.value" 
                            :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item 
                    label="交易流程"
                    prop="process">
                        <el-select 
                        v-model="propForm.process" 
                        class="w270">
                            <el-option 
                            v-for="item in rules.process" 
                            :key="'jy'+item.id" 
                            :label="item.name" 
                            :value="item.id"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item 
                    label="是否超时"
                    prop="timeout">
                        <el-select 
                        v-model="propForm.timeout" 
                        class="w110">
                            <el-option 
                            v-for="item in rules.timeout" 
                            :key="'timeout'+item.key"
                            :label="item.value" 
                            :value="item.key"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item 
                    label="贷款银行"
                    prop="bank">
                        <el-select 
                        v-model="propForm.bank" 
                        :remote-method="remoteMethodFn"
                        remote 
                        clearable
                        filterable
                        class="w262">
                            <el-option 
                            v-for="item in rules.bank" 
                            :key="'bank'+item.bankId" 
                            :label="item.bankName" 
                            :value="item.id"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item 
                    label="数据范围"
                    prop="range">
                        <el-select 
                        v-model="propForm.range" 
                        class="w180">
                            <el-option 
                            v-for="item in rules.range" 
                            :key="'range'+item.key" 
                            :label="item.value" 
                            :value="item.key"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item 
                    label="变更/解约"
                    prop="termination">
                        <el-select 
                        v-model="propForm.termination" 
                        class="w120">
                            <el-option 
                            v-for="item in rules.termination" 
                            :key="'termination'+item.key" 
                            :label="item.value" 
                            :value="item.key"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item 
                    label="后期状态"
                    prop="lateState">
                        <el-select 
                        v-model="propForm.lateState" 
                        class="w100">
                            <el-option 
                            v-for="item in rules.lateState" 
                            :key="'lateState' + item.key" 
                            :label="item.value" 
                            :value="item.key"></el-option>
                        </el-select>
                </el-form-item>
                <div class="in-block">
                    <el-form-item 
                    label="合同来源部门"
                    prop="departmentS" 
                    class="mr">
                        <!-- <el-select 
                        ref="tree" 
                        size="small" 
                        :loading="Loading" 
                        :remote-method="remoteMethod"
                        v-model="propForm.departmentS" 
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
                        </el-select> -->
                        <select-tree :data="DepList" :init="propForm.departmentS" @checkCell="depHandleClick" @clear="clearDep" @search="searchDep"></select-tree>
                    </el-form-item>
                    <el-form-item prop="departmentMo">
                        <el-select 
                        v-model="propForm.departmentMo" 
                         v-loadmore="moreEmploye"
                        clearable
                        class="w100">
                            <el-option 
                            v-for="item in EmployeList" 
                            :key="'departmentMo'+item.empId" 
                            :label="item.name"
                            :value="item.empId"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item 
                    label="收佣状态"
                    prop="commission">
                        <el-select 
                        v-model="propForm.commission" 
                        class="w100">
                            <el-option 
                            v-for="item in rules.commission" 
                            :key="'commission'+item.key" 
                            :label="item.value" 
                            :value="item.key"></el-option>
                        </el-select>
                </el-form-item>
            </el-form>
        </ScreeningTop>
        <!-- 列表 -->
        <div class="paper-table-box">
            <div class="paper-set-tit">
                <div class="paper-tit-fl"><i class="iconfont icon-tubiao-11 mr-10 font-cl1"></i>数据列表</div>
            </div>
            <el-table 
            border
            ref="tableCom" 
            :max-height="tableNumberCom"
            :data="tableData.list" 
            v-loading="loadingList"
            @cell-dblclick="dblclickFn"
            :formatter="nullFormatterData"
            class="paper-table mt-20">
                <el-table-column prop="code" label="合同编号" min-width="130">
                    <template slot-scope="scope">
                        <span class="blue" @click="contractFn(scope.row)" >{{scope.row.code}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="statusLaterStage.label" label="后期状态" min-width="90">
                </el-table-column>
                <el-table-column label="变更/解约" min-width="90">
                    <template slot-scope="scope">
                        {{statusChangeFn(scope.row.statusChange)}}
                    </template>
                </el-table-column>
                <el-table-column prop="propertyAddr" label="物业地址" min-width="170">
                </el-table-column>
                <el-table-column prop="transFlowName" label="交易流程" min-width="235">
                </el-table-column>
                <el-table-column prop="owner" label="业主" min-width="70">
                </el-table-column>
                <el-table-column prop="customer" label="客户" min-width="70">
                </el-table-column>
                <el-table-column label="成交经纪人" min-width="146">
                    <template slot-scope="scope">
                        {{agentFn(scope.row.dealagentStoreName,scope.row.dealAgentName)}}
                    </template>
                </el-table-column>
                <el-table-column label="接收日期" min-width="114">
                    <template slot-scope="scope">
                        {{dateFormat(scope.row.receiveTime)}}
                    </template>
                </el-table-column>
                <el-table-column prop="a10" label="实收/应收" min-width="105">
                    <template slot-scope="scope">
                        {{scope.row.receivedCommission}}/{{scope.row.receivableCommission}}
                    </template>
                </el-table-column>
                <el-table-column prop="statusReceiveAmount.label" label="收佣状态" min-width="121">
                </el-table-column>
                <el-table-column prop="stepInstanceName" label="后期进度" min-width="182">
                    <template slot-scope="scope">
                        <template v-if="scope.row.statusLaterStage.label === STATE.start">
                            <el-button class="blue" type="text" @click="progressFn(scope.row)">查看交易流程</el-button>
                        </template>
                        <template v-else>
                            <p>当前步骤：<el-button class="blue" type="text" @click="transactionFn(scope.row.stepInstanceid)">{{scope.row.stepInstanceName}}</el-button></p>
                            <p>{{nextStepFn(scope.row.nextStepName)}}</p>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="isOvertime.label" label="当前步骤是否超时" min-width="140">
                </el-table-column>
                <el-table-column prop="personLiableName" label="当前步骤责任人" min-width="120">
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
        <!-- 后期进度弹层 -->
        <el-dialog title="后期进度" :close-on-click-modal="$tool.closeOnClickModal" :close-on-press-escape="$tool.closeOnClickModal" :visible.sync="layerShow" width="1000px"  class="layer-paper layer-scroll-auto">
            <LayerScrollAuto>
                <div class="layer-progress">
                    <ul class="ul" :class="layerBtn?'ul-line':''">
                        <li class="mr-30" v-if="layerBtn" v-show="layerBtnShowFn(power['sign-qh-mgr-jd-modify'].state,power['sign-qh-mgr-jd-smgr'].state)">
                            <el-button
                                v-if="power['sign-qh-mgr-jd-modify'].state"
                                class="management-btn paper-btn-blue"
                                type="primary"
                                size="small"
                                @click="replaceFn"
                                round>更换交易流程
                            </el-button>
                            <el-button
                                v-if="power['sign-qh-mgr-jd-smgr'].state"
                                class="paper-btn paper-btn-blue"
                                type="primary"
                                size="small"
                                @click="managementFn"
                                round>步骤管理
                            </el-button>
                        </li>
                        <li>
                            <span class="cl-2 mr-30">{{layerShowData.transFlowName}}</span>
                        </li>
                        <li>
                            <span class="cl-1 mr-10">收佣状态：</span>
                            <span class="cl-2">{{layerShowData.statusReceiveAmount.label}}</span>
                        </li>
                    </ul>
                    <el-table 
                    border
                    :data="tableProgress" 
                    v-loading="loadingProgress"
                    class="paper-table mt-20">
                        <el-table-column 
                        min-width="120px"
                        label="步骤类型" 
                        align="center">
                            <template slot-scope="scope">
                            <span :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'">{{getDataVal(scope.row.transactionStepsType)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column 
                        min-width="120px"
                        label="步骤名称" 
                        align="center">
                            <template slot-scope="scope">
                            <span :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'">{{getDataVal(scope.row.transactionSteps)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column 
                        label="结算百分比" 
                        align="center">
                            <template slot-scope="scope">
                            <span :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'">{{percentageFn(scope.row.settlePercent)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column 
                        label="操作人" 
                        align="center">
                            <template slot-scope="scope">
                            <span :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'">{{getDataVal(scope.row.operatorName)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column 
                        label="操作日期" 
                        align="center">
                            <template slot-scope="scope">
                            <span :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'">{{dateFormat(scope.row.operationTime)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column 
                        label="责任人" 
                        align="center">
                            <template slot-scope="scope">
                            <span :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'">{{getDataVal(scope.row.personLiableName)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column 
                        label="确定日期" 
                        align="center">
                            <template slot-scope="scope">
                            <span :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'">{{dateFormat(scope.row.endDatetime)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column 
                        label="办理天数" 
                        align="center">
                            <template slot-scope="scope">
                            <span :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'">{{getDataVal(scope.row.actualDay)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column 
                        label="规定天数" 
                        align="center">
                            <template slot-scope="scope">
                            <span :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'">{{getDataVal(scope.row.specifiedDay)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column 
                        label="操作" 
                        min-width="120px"
                        align="center">
                            <template slot-scope="scope">
                                <template v-if="scope.row.stepState.value === OPERATION.start">
                                    <el-button class="blue" type="text" @click="operationFn(scope.row.id)">查看</el-button>
                                </template>
                                <template v-else-if="scope.row.stepState.value === OPERATION.backlog && layerShowData.statusLaterStage.label !== STATE.start">
                                    <el-button class="blue" type="text" @click="transactionFn(scope.row.id)">办理</el-button><el-button class="blue" type="text" v-if="scope.$index !== tableProgress.length-1 && power['sign-qh-mgr-jd-move'].state" @click="downFn(scope)">下</el-button>
                                </template>
                                <template v-else-if="scope.row.stepState.value === OPERATION.sure && layerShowData.statusLaterStage.label !== STATE.start">
                                    <el-button class="blue" type="text" @click="sureFn(scope.row.id)">确认</el-button>
                                </template>
                                <template v-else-if="scope.row.stepState.value === OPERATION.not && layerShowData.statusLaterStage.label !== STATE.start">
                                    <el-button class="blue" v-if="isUpBtnFn(scope.$index) && power['sign-qh-mgr-jd-move'].state" type="text" @click="upFn(scope)">上</el-button><el-button v-if="scope.$index !== tableProgress.length-1 && power['sign-qh-mgr-jd-move'].state" class="blue" type="text" @click="downFn(scope)">下</el-button>
                                    <template v-if="!power['sign-qh-mgr-jd-move'].state">--</template>
                                </template>
                                <template v-else-if="scope.row.stepState.value === OPERATION.amend && layerShowData.statusLaterStage.label !== STATE.start">
                                    <el-button class="blue" type="text" @click="amendFn(scope.row.id)">修改</el-button>
                                </template>
                                <template v-else>--</template>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </LayerScrollAuto>
        </el-dialog>
        <!-- 更换交易流程弹层 -->
        <el-dialog title="选择交易流程" :close-on-click-modal="$tool.closeOnClickModal" :close-on-press-escape="$tool.closeOnClickModal" :visible.sync="replaceShow" width="740px" class="layer-paper">
            <div class="replace-box" v-loading="loadingReplace">
                <div>
                    <div class="tit">交易流程</div>
                    <ul class="ul">
                        <li 
                        v-for="item in replaceData.tit" 
                        :class="replaceData.index === item.id ?'on':''"
                        @click="replaceTabFn(item.id)"
                        :key="'jylc'+item.id">{{item.name}}</li>
                    </ul>
                </div>
                <div>
                    <div class="tit">交易步骤</div>
                    <ul class="ul-box pr">
                        <li 
                        v-for="item in replaceData.children"
                        :key="'jybz'+item.id">
                            <span v-show="replaceData.index === replaceData.transFlowCode">
                                {{item.transactionSteps}}
                            </span>
                            <span v-show="replaceData.index !== replaceData.transFlowCode">
                                {{item.stepsName}}
                            </span>
                        </li>
                        <li v-show="replaceData.children.length === 0" class="no-data">
                            <div class="cl-1">暂无数据</div>
                        </li>
                    </ul>
                </div>
            </div>
            <span slot="footer">
                <el-button class="paper-btn" type size="small" @click="replaceCloseFn" round>返回</el-button>
                <el-button class="paper-btn paper-btn-blue" type="primary" size="small" @click="replaceBtnFn" round>确定</el-button>
            </span>
        </el-dialog>
        <!-- 办理 -->
        <el-dialog :title="stepsData.tit" :close-on-click-modal="$tool.closeOnClickModal" :close-on-press-escape="$tool.closeOnClickModal" :visible.sync="stepsData.show" width="740px"  class="layer-paper layer-scroll-auto">
            <LayerScrollAuto>
                <div class="steps-from">
                        <el-form 
                        ref="stepsFrom"
                        :model="stepsFrom"
                        v-loading.fullscreen.lock="LookStepLoad"
                        label-width="150px">
                            <el-form-item
                                v-for="(item,index) in stepsFrom.list"
                                :prop="'list.' + index + '.val'"
                                :key="'bl'+item.id + index"
                                :label="item.title+ '：'"
                                :rules="item.rules"
                            >
                                <!-- 办理 编辑 -->
                                <template v-if="stepsData.tit !== STEPS.end">
                                    <template v-if="item.type === STEPSINPUT.start">
                                        <el-input 
                                        v-model="item.val"
                                        size="small"
                                        ></el-input>
                                    </template>
                                    <template v-if="item.type === STEPSINPUT.num">
                                        <el-input 
                                        v-model="item.val"
                                        size="small"
                                        @input="numberChange(index)"
                                        ></el-input>
                                    </template>
                                    <template v-else-if="item.type === STEPSINPUT.time">
                                        <el-date-picker
                                        v-model="item.val"
                                        size="small"
                                        type="date"
                                        class="w160"
                                        placeholder="选择日期">
                                        </el-date-picker>
                                    </template>
                                    <template v-else-if="item.type === STEPSINPUT.textarea">
                                        <div class="steps-input">
                                            <el-input 
                                            type="textarea" 
                                            resize="none" 
                                            :maxlength="invalidMax" 
                                            v-model="item.val" 
                                            class="input">
                                            </el-input>
                                            <div class="text-absloute">{{item.val.length}}/{{invalidMax}}</div>
                                        </div>
                                    </template>
                                    <template v-else-if="item.type === STEPSINPUT.img || item.type === STEPSINPUT.mp4 || item.type === STEPSINPUT.pdf || item.type === STEPSINPUT.excel || item.type === STEPSINPUT.word">
                                        <div>
                                            <fileUp 
                                            :id="'fileUp'+index"
                                            :rules="stepsTypeImg(item.type,1)"
                                            @getUrl="imgBtnFn"
                                            class="fileUp">
                                                <el-button 
                                                class="paper-btn paper-btn-blue" 
                                                round
                                                type="primary" 
                                                size="small">{{stepsTypeImg(item.type,2)}}</el-button>
                                            </fileUp>
                                        </div>
                                        <ul class="steps-img">
                                            <el-tooltip class="item" 
                                            effect="dark" 
                                            :content="i.name" 
                                            placement="bottom" 
                                            v-for="(i,n) in item.val"
                                            :key="i.name">
                                                <li 
                                                @click="previewPhoto(item.val,n)"
                                                >
                                                    <i @click.stop="clearFn(index,n)" class="iconfont icon-tubiao-6"></i>
                                                    <div class="img"><uploadCell :type="stepsTypeImg(item.type)"></uploadCell></div>
                                                    <p class="p">{{i.name}}</p>
                                                </li>
                                            </el-tooltip>
                                        </ul>
                                    </template>
                                    <!-- <template v-else>
                                        <div>
                                            <template v-if="item.type === STEPSINPUT.mp4">
                                                <el-button class="paper-btn paper-btn-blue" round type="primary" size="small" @click="imgBtnFn">上传视频</el-button>
                                            </template>
                                            <template v-if="item.type === STEPSINPUT.excel">
                                                <el-button class="paper-btn paper-btn-blue" round type="primary" size="small" @click="imgBtnFn">上传Word</el-button>
                                            </template>
                                            <template v-if="item.type === STEPSINPUT.word">
                                                <el-button class="paper-btn paper-btn-blue" round type="primary" size="small" @click="imgBtnFn">上传Excel</el-button>
                                            </template>
                                            <template v-if="item.type === STEPSINPUT.pdf">
                                                <el-button class="paper-btn paper-btn-blue" round type="primary" size="small" @click="imgBtnFn">上传PDF</el-button>
                                            </template>
                                        </div>
                                        <ul class="steps-img">
                                            <li 
                                            v-for="(i,n) in item.val"
                                            @click="clearFn(index,n)"
                                            :key="i.name"
                                            >  
                                                <img 
                                                class="icon-steps" 
                                                v-if="item.type === STEPSINPUT.mp4"
                                                src="../../assets/img/icon-steps01.png">
                                                <img 
                                                class="icon-steps" 
                                                v-if="item.type === STEPSINPUT.excel"
                                                src="../../assets/img/icon-steps02.png">
                                                <img 
                                                class="icon-steps" 
                                                v-if="item.type === STEPSINPUT.word"
                                                src="../../assets/img/icon-steps03.png">
                                                <img 
                                                class="icon-steps" 
                                                v-if="item.type === STEPSINPUT.pdf"
                                                src="../../assets/img/icon-steps04.png">
                                                <span class="fl">{{i.name}}</span>
                                                <i class="iconfont icon-tubiao-7"></i>
                                            </li>
                                        </ul>
                                    </template> -->
                                </template>
                                <!-- 查看 -->
                                <template v-else>
                                    <template v-if="item.type === STEPSINPUT.start || item.type === STEPSINPUT.time || item.type === STEPSINPUT.textarea || item.type === STEPSINPUT.num">
                                        <div class="steps-see">{{item.val}}</div>
                                    </template>
                                    <template v-else>
                                        <!-- <ul class="steps-img">
                                            <li 
                                            class="steps-mp4-li"
                                            v-for="(i,n) in item.val"
                                            @click="clearFn(index,n)"
                                            :key="i.name"
                                            >  
                                                <img 
                                                class="icon-steps" 
                                                v-if="item.type === STEPSINPUT.mp4"
                                                src="../../assets/img/icon-steps01.png">
                                                <img 
                                                class="icon-steps" 
                                                v-if="item.type === STEPSINPUT.excel"
                                                src="../../assets/img/icon-steps02.png">
                                                <img 
                                                class="icon-steps" 
                                                v-if="item.type === STEPSINPUT.word"
                                                src="../../assets/img/icon-steps03.png">
                                                <img 
                                                class="icon-steps" 
                                                v-if="item.type === STEPSINPUT.pdf"
                                                src="../../assets/img/icon-steps04.png">
                                                <span class="fl">{{i.name}}</span>
                                            </li>
                                        </ul> -->
                                        <ul class="steps-img">
                                            <el-tooltip class="item" effect="dark" :content="i.name" placement="bottom" 
                                                v-for="(i,n) in item.val"
                                                :key="i.name">
                                                <li 
                                                @click="previewPhoto(item.val,n)"
                                                >
                                                    <div class="img"><uploadCell :type="stepsTypeImg(item.type)"></uploadCell></div>
                                                    <p class="p">{{i.name}}</p>
                                                </li>
                                            </el-tooltip>
                                        </ul>
                                    </template>
                                </template>
                            </el-form-item>
                        </el-form>
                        <!-- 预览 -->
                        <preview :imgList="previewFiles" :start="previewIndex" v-if="preview" @close="preview=false"></preview>
                </div>
            </LayerScrollAuto>
            <span slot="footer">
                <!-- 办理 -->
                <template v-if="stepsData.tit === STEPS.start">
                    <el-button class="paper-btn" type size="small" @click="handleCloseFn" round>取消</el-button>
                    <el-button class="paper-btn paper-btn-blue" type="primary" size="small" @click="handleBtnFn" round>确定</el-button>
                </template>
                <!--  编辑 -->
                <template v-else-if="stepsData.tit === STEPS.sure">
                    <el-button class="paper-btn paper-btn-blue" type="primary" size="small" @click="editorBtnFn" round>确定</el-button>
                </template>
                <!--  确认 -->
                <template v-else-if="stepsData.tit === STEPS.affirm">
                    <el-button class="paper-btn paper-btn-blue" type="primary" size="small" @click="handleBtnFn" round>确定</el-button>
                </template>
            </span>
        </el-dialog>
        <!-- 调整步骤 -->
        <el-dialog title="调整步骤"  :close-on-click-modal="$tool.closeOnClickModal" :close-on-press-escape="$tool.closeOnClickModal"
        :visible.sync="adjustShow" 
        width="740px"  
        class="layer-paper layer-scroll-auto">
            <LayerScrollAuto>
                <div class="layer-chekbox-box" v-loading="loadingAdjust">
                    <el-table
                    :data="adjustData"
                    class="paper-table" 
                    border>
                        <el-table-column
                            class="layer-all-chekbox" 
                            align="center"
                            width="250px"
                            label="标题">
                            <template slot-scope="scope">
                                <p class="check-all">
                                    <el-checkbox 
                                    v-model="scope.row.bool" 
                                    @change="adjustAllChange(scope.$index,$event)">{{scope.row.typeName}}</el-checkbox>
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            label="内容">
                            <template slot-scope="scope">
                                <el-checkbox-group 
                                class="layer-checkbox-p"
                                v-model="scope.row.list"
                                @change="adjustChange(scope.$index,$event)">
                                    <p 
                                    v-for="item in scope.row.stepsList" 
                                    :key="item.name">
                                        <el-checkbox 
                                        :disabled="item.disabled"
                                        :label="item">{{item.name}}</el-checkbox>
                                    </p>
                                </el-checkbox-group>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </LayerScrollAuto>
            <span slot="footer">
                <el-button class="paper-btn paper-btn-blue" type="primary" size="small" @click="adjustBtnFn" round>确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import ScreeningTop from '@/components/ScreeningTop';
    import {FILTER} from '@/assets/js/filter';
    import {TOOL} from '@/assets/js/common';
    import {MIXINS} from '@/assets/js/mixins';
    import LayerScrollAuto from '@/components/LayerScrollAuto';

    // 合同
    const STATE = {
        start:'已结束',    //已结束
        end:1,      //后期所有步骤办理完
        err:2,      //解约合同
    }
    // 操作状态
    const OPERATION = TOOL.OPERATION;
    // 办理状态
    const STEPS = {
        start:'办理',    //办理
        sure:'修改',    //修改
        end:'查看',      //查看
        affirm:'确认',      //确认
    }
    // 办理输入框
    const STEPSINPUT = {
        start:0,        //input 文本输入框
        num:1,        //input number类型
        time:2,         //时间选择
        img:3,          //图片
        mp4:4,          //视频
        pdf:5,          //pdf文件
        excel:6,        //表格
        word:7,         //文档
        textarea:8,      //文本框输入
    }
    // 变更节约状态
    const STATUSCHANGE = 3;
    // 接收日期切换
    const RECEIVINGDATE = {
        start:0,
        end:1,
    }
    // 是否超时
    const ISOVERTIME = 1;

    export default {
        mixins: [FILTER,MIXINS],
        data(){
            return{
                // 页面初始数据
                pageNum:1,
                pageSize:10,
                // 加载
                loading:false,
                loading2:false,
                LookStepLoad:false,
                loadingList:false,
                loadingProgress:false,
                loadingAdjust:false,
                loadingReplace:false,
                loadingBtn1:false,
                // 枚举数据
                dictionary:{
                    '6':'合同变更状态',
                    '13':'收佣状态',
                    '22':'是否超时',
                    '44':'后期状态',
                    '48':'数据范围',
                    '561':'步骤附属信息类型',
                    '570':'是否必填',
                },
                // 筛选结果
                propForm:{
                    search:'',
                    dateMo:'',
                    dateMoB:'',
                    region:0,
                    steps:'',
                    stepsMo:'',
                    process:'',
                    timeout:'',
                    bank:'',
                    range:'',
                    termination:'',
                    lateState:'',
                    commission:'',
                    department:'',
                    departmentS:'',
                    departmentMo:'',
                },
                // 筛选下拉
                rules:{
                    region: [{
                        label: "接收日期",
                        value: 0
                    },
                    {
                        label: "办理日期",
                        value: 1
                    }],
                    steps: [],
                    stepsMo: [{
                        key:1,
                        value:'已办理'
                    },{
                        key:2,
                        value:'未办理'
                    },{
                        key:3,
                        value:'超时未办理'
                    },{
                        key:4,
                        value:'超时已办理'
                    },],
                    process: [{
                        label: "全部",
                        value: ""
                    }],
                    timeout:[{
                        value: "全部",
                        key: ""
                    }],
                    bank:[{
                        label: "全部",
                        value: ""
                    }],
                    range:[{
                            value: "全部",
                            key: ""
                        }],
                    termination:[{
                        value: "全部",
                        key: ""
                    }],
                    lateState:[{
                        value: "全部",
                        key: ""
                    }],
                    commission:[{
                        label: "全部",
                        value: ""
                    }],
                    department:[{
                        name: "全部",
                        id: ""
                    }],
                    departmentMo:[{
                        name: "全部",
                        empId: ""
                    }],
                },
                // 列表数据
                tableData:{},
                // 状态
                STATE,
                // 接收日期切换
                RECEIVINGDATE,
                // 后期进度列表
                tableProgress:[],
                // 后期进度弹层
                layerShow:false,
                layerBtn:true,
                layerShowData:{
                    statusReceiveAmount:{
                        label:'',
                    }
                },
                // 步骤状态
                OPERATION,
                // 更换交易流程弹层
                replaceShow:false,
                // 更换交易流程数据
                replaceData:{
                    tit:{},
                    children:[],
                    index:0,
                    transFlowCode:0,
                    instances:[],
                },
                ISOVERTIME,
                // 步骤管理弹层数据
                stepsData:{
                    show:false,
                    tit:'办理'
                },
                stepsFrom:{
                    list:[],
                    id:'',
                },
                // 办理状态
                STEPS,
                // 办理输入形式
                STEPSINPUT,
                // 文本输入框最大数值
                invalidMax:200,
                // 调整步骤
                adjustShow:false,
                adjustData:[],
                // 权限
                power:{
                    // 'sign-qh-mgr-query':{
                    //     name:'查询',
                    //     state:false
                    // },
                    'sign-qh-mgr-jd-modify':{
                        name:'更换交易流程',
                        state:false
                    },
                    'sign-qh-mgr-jd-smgr':{
                        name:'步骤管理',
                        state:false
                    },
                    'sign-qh-mgr-jd-move':{
                        name:'上、下',
                        state:false
                    },
                    'sign-com-htdetail':{
                        name:'合同详情',
                        state:false,
                    },
                }
            }
        },
        computed:{
            // 城市
            cityId(){
                if(!!this.userMsg){
                    return this.userMsg.cityId
                }else{
                    return ''
                }
            }
        },
        methods:{
            // 百分比转换
            percentageFn(val){
                if(val > 0){
                    return `${val}%`
                }else{
                    return '--'
                }
            },
            // 如果按钮都隐藏
            layerBtnShowFn(b,i){
                if(!i&&!b){
                    return false
                }else{
                    return true
                }
            },
            // 是否显示上的按钮
            isUpBtnFn(index){
                if(!this.tableProgress[index-1]){
                    return true
                }
                if(this.tableProgress[index-1].stepState.value === OPERATION.sure){
                    return false
                }else{
                    return true
                }
            },
            // 是否必选
            isRequiredFn(bool){
                if(bool){
                    return true;
                }else{
                    return false;
                }
            },
            // 时间处理
            dateFormat(val){
                return TOOL.dateFormat(val);
            },
            // 经纪人
            agentFn(s,t){
                if(!!s && !!t){
                    return `${s}-${t}`
                }else if(!!s){
                    return s
                }else if(!!t){
                    return t
                }else{
                    return '--'
                }
            },
            // 变更节约状态
            statusChangeFn(e){
                if(!e || e.value === STATUSCHANGE){
                    return '--'
                }else{
                    return e.label
                }
            },
            // 成功提示
            successMeFn(e){
                this.$message({
                    message: e,
                    type: 'success'
                });
            },
            // 错误提示
            errMeFn(e){
                this.$message.error(e);
            },
            // 重置
            resetFormFn() {
                this.propForm.department='';
                this.pageNum = 1;
                this.$refs.propForm.resetFields()
                // this.pageNum = 1;
                // this.getDataList();
            },
            // 查询
            queryFn() {
                this.pageNum = 1;
                this.getDataList();
            },
            // 部门回调
            // departmentChangeFn(){
            //     console.log('部门回调')
            // },
            // 合同编号
            contractFn(value){
                if(!this.power['sign-com-htdetail'].state){
                    this.noPower(this.power['sign-com-htdetail'].name);
                    return false
                }
                this.$router.push({
                    path: "/contractDetails",
                    query: {
                        id: value.id,//合同id
                        code: value.code,//合同编号
                        contType: this.power['sign-com-htdetail'].state?1:0//合同类型
                    }
                });
            },
            // 办理
            transactionFn(id){
                // this.stepsData = {
                //     show:true,
                //     tit:'办理'
                // }
                this.getLookStepFn(id,'办理');
            },
            getLookStepFn(id,tit){
                this.LookStepLoad = true;
                this.$ajax.get('/api/postSigning/lookStep',{
                    id,
                }).then(res=>{
                    res = res.data;
                    if(res.status === 200){
                        let resData = res.data;
                        let arr = [...resData.transAtepsAttach];
                        let arr2 = [{
                                    val:this.dateFormat(resData.handleDatetime),
                                    title:'办理日期',
                                    isRequired:true,
                                    type:2,
                                    id:'bj'+resData.id + 1,
                                    rules:{
                                        required: true, 
                                        message: `请输入办理日期`
                                    }
                                },{
                                    val:resData.remarks,
                                    title:'备注',
                                    isRequired:false,
                                    type:8,
                                    id:'bj' + resData.id + 2,
                                    rules:{
                                        required: false 
                                    }
                                }]

                        arr.map(e=>{
                            let j = {};
                            if(e.type === STEPSINPUT.start || e.type === STEPSINPUT.time || e.type === STEPSINPUT.textarea || e.type === STEPSINPUT.num){
                                e.val = e.value;
                                j.message = `请输入${e.title}`;
                            }else{
                                if(e.value){
                                    e.val = this.$tool.cutFilePath(e.value.split(','))
                                }else{
                                    e.val = [];
                                }
                                j.message = `请上传${e.title}`;
                            }
                            if(e.isRequired){
                                j.required = true;
                                j.trigger= 'blur';
                            }else{
                                j.required = false;
                            }
                            e.rules = j;
                        })
                        this.stepsFrom = {
                            list:[...arr,...arr2],
                            id:resData.id
                        };
                        this.LookStepLoad = false;
                        let stepsKey = {
                            show:true
                        };
                        this.stepsData = {
                            show:true,
                            tit
                        }
                        this.$refs.stepsFrom.resetFields();
                    }
                }).catch(err=>{
                    this.LookStepLoad = false;
                    this.errMeFn(err);
                })
            },
            // 数字改变的时候
            numberChange(index){
                this.$nextTick(() => {
                    this.stepsFrom.list[index].val = this.stepsFrom.list[index].val.toString().replace(/[^0-9.]/g, '')
                });
            },
            // 后期进度
            progressFn(row){
                this.layerShow = true;
                this.layerBtn = false;  
                this.layerShowData = row;
                this.lateProgressFn();             
            },
            // 下一步骤显示
            nextStepFn(e){
                if(!e){
                    return ``
                }else{
                    return `下一步骤：${e}`
                }
            },
            // 双击事件
            dblclickFn(row, column, cell, event){
                if(column.property === 'code'){
                    console.log('点击的是合同编号')
                }else if(column.property === 'stepInstanceName'){
                    console.log('点击的是后期进度')
                }else{
                    this.layerShow = true;
                    if(row.statusLaterStage.label === STATE.start){
                        this.layerBtn = false;
                    }else{
                        this.layerBtn = true;
                    }
                    this.layerShowData = row;
                    this.lateProgressFn();
                }
            },
            // 查看
            operationFn(id){
                // this.stepsData = {
                //     show:true,
                //     tit:'查看'
                // }
                this.getLookStepFn(id,'查看');
            },
            // 更换交易流程
            replaceFn(){
                if(!this.power['sign-qh-mgr-jd-modify'].state){
                    this.noPower(this.power['sign-qh-mgr-jd-modify'].name);
                    return false
                }
                this.replaceShow = true;
                this.loadingReplace = true;
                this.loadingBtn1 = true;
                this.$ajax.get('/api/postSigning/getStepList',{
                    id:this.layerShowData.id
                }).then(res=>{
                    res = res.data;
                    if(res.status === 200){
                        let i = res.data.transFlowCode;
                        let n = res.data.instances;
                        this.replaceData.children = n;
                        this.replaceData.instances = n;
                        this.replaceData.transFlowCode = i;
                        this.replaceData.index = i;
                    }
                    this.loadingReplace = false;
                    this.loadingBtn1 = false;
                }).catch(err=>{
                    this.errMeFn(err);
                    this.loadingReplace = false;
                    this.loadingBtn1 = false;
                })
            },
            // 步骤管理
            managementFn(){
                if(!this.power['sign-qh-mgr-jd-smgr'].state){
                    this.noPower(this.power['sign-qh-mgr-jd-smgr'].name);
                    return false
                }
                // 显示弹层
                this.adjustShow = true;
                this.loadingAdjust = true;
                this.$ajax.post('/api/flowmanage/selectTypeStepsList',{
                    cityId:this.cityId
                }).then(res=>{
                    res = res.data;
                    if(res.status === 200){
                        let arr = [...res.data];
                        let arr2 = [];
                        arr.map(e=>{
                            let n = 0;
                            e.list = [];
                            e.disabledList = [];
                            e.stepsList.map(i=>{
                                this.tableProgress.forEach(t=>{
                                    if(t.transactionStepsCode === i.id){
                                        n++;
                                        e.list.push(i);
                                        arr2.push(i.id);
                                        if(t.stepState.value !== OPERATION.not && t.stepState.value !== OPERATION.backlog){
                                            i.disabled = true;
                                            e.disabledList.push(i);
                                        }
                                        if(n === e.stepsList.length){
                                            e.bool = true;
                                        }
                                    }
                                })
                            })
                        })
                        this.adjustData = [...arr];
                        this.copyAdjustData= arr2.join();
                    }
                    this.loadingAdjust = false;
                }).catch(err=>{
                    this.errMeFn(err);
                    this.loadingAdjust = false;
                })
            },
            // 确认
            sureFn(id){
                // this.stepsData = {
                //     show:true,
                //     tit:'确认'
                // }
                this.getLookStepFn(id,'确认');
            },
            // 上
            upFn(e){
                if(!this.power['sign-qh-mgr-jd-move'].state){
                    this.noPower(this.power['sign-qh-mgr-jd-move'].name);
                    return false
                }
                if(!this.loadingProgress){
                    this.loadingProgress = true;
                    let index = e.$index;
                    // if(bool){
                    let upId = e.row.id;
                    let downId = this.tableProgress[index-1].id;
                    this.oderStepFn(upId,downId);
                    this.getDataList();
                    // }
                }
            },
            // 下
            downFn(e){
                if(!this.power['sign-qh-mgr-jd-move'].state){
                    this.noPower(this.power['sign-qh-mgr-jd-move'].name);
                    return false
                }
                if(!this.loadingProgress){
                    this.loadingProgress = true;
                    let index = e.$index;
                    let n = e.row.length;
                    // if(index !== n){
                    let upId = this.tableProgress[index+1].id;
                    let downId = e.row.id;
                    this.oderStepFn(upId,downId);
                    this.getDataList();
                    // }
                }
            },
            oderStepFn(upId,downId){
                if(!this.power['sign-qh-mgr-jd-move'].state){
                    this.noPower(this.power['sign-qh-mgr-jd-move'].name);
                    return false
                }
                this.$ajax.post('/api/postSigning/oderStep',{
                    upId,
                    downId,
                }).then(res=>{
                    res = res.data;
                    if(res.status === 200){
                        this.successMeFn(res.message);
                        this.lateProgressFn();
                    }else{
                        this.errMeFn(res.message);
                    }
                }).catch(err=>{
                    this.errMeFn(err);
                })
            },
            // 修改
            amendFn(id){
                // this.stepsData = {
                //     show:true,
                //     tit:'修改'
                // }
                this.getLookStepFn(id,'修改');
            },
            // 选择交易流程 取消
            replaceCloseFn(){
                this.replaceShow = false;
            },
            // 选择交易流程 确定
            replaceBtnFn(){
                if(!this.power['sign-qh-mgr-jd-modify'].state){
                    this.noPower(this.power['sign-qh-mgr-jd-modify'].name);
                    return false
                }
                if(this.replaceData.transFlowCode===this.replaceData.index){
                    this.replaceShow = false;
                }else{
                    this.loadingReplace = true;
                    this.loadingBtn1 = true;
                    let name = '';
                    let arr = [...this.replaceData.tit];
                    arr.map(res=>{
                        if(res.id === this.replaceData.index){
                            name = res.name;
                        }
                    })
                    this.$ajax.post('/api/postSigning/updateTransFlow',{
                        contractCode:this.layerShowData.id,
                        transFlowCode:this.replaceData.index,
                    }).then(res=>{
                        res = res.data;
                        if(res.status === 200){
                            // 步骤名
                            this.layerShowData.transFlowName = name;
                            // 接收弹层列表数据刷新
                            this.lateProgressFn();
                            // 列表刷新
                            this.getDataList();
                            // 成功提示
                            this.successMeFn(res.message);
                            this.replaceShow = false;
                        }else{
                            this.errMeFn(res.message);
                            this.replaceShow = false;
                        }
                        this.loadingReplace = false;
                        this.loadingBtn1 = false;
                    }).catch(err=>{
                        this.errMeFn(err);
                        this.loadingReplace = false;
                        this.loadingBtn1 = false;
                    })
                }
            },
            // 选择交易切换
            replaceTabFn(i){
                this.replaceData.index = i;
                if(i === this.replaceData.transFlowCode){
                    this.replaceData.children = this.replaceData.instances;
                }else{
                    this.$ajax.post('/api/flowmanage/selectFlowStepsList',{
                        flowId:i
                    }).then(res=>{
                        res = res.data;
                        if(res.status === 200){
                            this.replaceData.children = res.data;
                        }
                    }).catch(err=>{
                        this.errMeFn(err);
                    })
                }
            },
            // 办理弹层取消
            handleCloseFn(){
                // console.log('办理弹层取消')
                this.stepsData.show = false;
            },
            // 图片格式状态判定
            stepsTypeImg(type,bool){
                if(bool === 1){
                    switch (type) {
                        case STEPSINPUT.img:
                            return ['png','jpg','jpeg'];
                            break;
                        case STEPSINPUT.mp4:
                            return ['mp4','avi'];
                            break;
                        case STEPSINPUT.excel:
                            return ['xlsx','xls'];
                            break;
                        case STEPSINPUT.word:
                            return ['doc','docx'];
                            break;
                        case STEPSINPUT.pdf:
                            return ['pdf'];
                            break;
                        default:
                            return []
                            break;
                    }
                }else if(bool === 2){
                    switch (type) {
                        case STEPSINPUT.img:
                            return '上传图片';
                            break;
                        case STEPSINPUT.mp4:
                            return '上传视频';
                            break;
                        case STEPSINPUT.excel:
                            return '上传Excel';
                            break;
                        case STEPSINPUT.word:
                            return '上传Word';
                            break;
                        case STEPSINPUT.pdf:
                            return '上传PDF';
                            break;
                        default:
                            return '错误状态'
                            break;
                    }
                }else{
                    switch (type) {
                        case STEPSINPUT.img:
                            return '.png'
                            break;
                        case STEPSINPUT.mp4:
                            return '.mp4'
                            break;
                        case STEPSINPUT.excel:
                            return '.xlsx'
                            break;
                        case STEPSINPUT.word:
                            return '.doc'
                            break;
                        case STEPSINPUT.pdf:
                            return '.pdf'
                            break;
                        default:
                            return ''
                            break;
                    }
                }
                
            },
            // 办理确定
            handleBtnFn(){
                this.confirmStepFn();
            },
            // 办理数据提交
            confirmStepFn(url='/api/postSigning/confirmStep'){
                this.$refs['stepsFrom'].validate((valid) => {
                    if (valid) {
                        let id = this.stepsFrom.id;
                        let transAtepsAttach = [...this.stepsFrom.list];
                        // 添加备注和时间
                        let handleDatetime = this.dateFormat(transAtepsAttach[transAtepsAttach.length-2].val);
                        let remarks = transAtepsAttach[transAtepsAttach.length-1].val;
                        // 删除多余的数组
                        transAtepsAttach.splice(-2,2);
                        transAtepsAttach.map(e=>{
                            if(e.type === STEPSINPUT.start || e.type === STEPSINPUT.time || e.type === STEPSINPUT.textarea || e.type === STEPSINPUT.num){
                                e.value = e.val;
                            }else{
                                if(e.val.length === 0){
                                    e.value = '';
                                }else{
                                    let arr = this.$tool.getFilePath(e.val);
                                    e.value = arr.join();
                                }
                            }
                        })
                        this.$ajax.postJSON(url,{
                            handleDatetime,
                            remarks,
                            transAtepsAttach,
                            id,
                        }).then(res=>{
                            res = res.data;
                            if(res.status === 200){
                                if(res.data){
                                    this.layerBtn = false;
                                }
                                this.successMeFn(res.message);
                                this.lateProgressFn();
                                this.getDataList();
                                this.stepsData.show = false;
                            }else{
                                this.errMeFn(res.message);
                            }
                        }).catch(err=>{
                            this.errMeFn(err);
                        })
                    }
                });
            },
            // 编辑确定
            editorBtnFn(){
                this.confirmStepFn('api/postSigning/updateStep');
            },
            // 选择第几个上传
            // stepsIndexBtnFn(i){
            //     this.stepsFrom.index = i;
            // },
            // 图片上传
            imgBtnFn(e){
                // console.log(e)
                // debugger
                let index = e.btnId.slice(6);
                let arr = e.param[e.param.length - 1];
                this.stepsFrom.list[index].val.push(arr);
                this.$refs['stepsFrom'].validate((bool)=>{});
            },
            // 删除
            clearFn(i,n){
                let arr = [...this.stepsFrom.list];
                arr[i].val.splice(n,1)
                this.stepsFrom.list = arr;
                this.$refs['stepsFrom'].validate((bool)=>{});
            },
            // 调整步骤确定
            adjustBtnFn(){
                if(!this.power['sign-qh-mgr-jd-smgr'].state){
                    this.noPower(this.power['sign-qh-mgr-jd-smgr'].name);
                    return false
                }
                let arr= [];
                let arr2 = [...this.adjustData];
                let steps = [];
                arr2.map(e=>{
                    e.list.map(i=>{
                        arr.push(i.id);
                        i.transStepsAttach = '';
                    })
                    steps = [...steps,...e.list];
                })
                // 是否修改了
                if(this.copyAdjustData === arr.join()){
                    // 没有修改
                    this.adjustShow = false;
                }else{
                    // 修改了
                    this.$ajax.postJSON('/api/postSigning/updateStepInstance',{
                        contractCode:this.layerShowData.id,
                        steps,
                    }).then(res=>{
                        res = res.data;
                        if(res.status === 200){
                            // 接收弹层列表数据刷新
                            this.lateProgressFn();
                            // 列表刷新
                            this.getDataList();
                            // 成功提示
                            this.successMeFn(res.message);
                            this.adjustShow = false;
                        }
                    }).catch(err=>{
                        this.errMeFn(err);
                    })
                }
            },
            // 多选
            adjustChange(i,arr){
                let adj = this.adjustData[i];
                let bool = adj.stepsList.length === arr.length;
                this.adjustData[i].bool = bool;
                this.$set(this.adjustData,i,this.adjustData[i])
            },
            // 全选
            adjustAllChange(i,bool){
                let arr = this.adjustData[i]
                if(bool){
                    let ar = []
                    arr.stepsList.forEach(e => {
                        ar.push(e)
                    });
                    arr.list = ar;
                }else{
                    arr.list = [...arr.disabledList];
                }
            },
            // 分页
            currentChangeFn(e){
                this.pageNum = e;
                this.getDataList();
            },
            // 接收日期改变的时候
            receivingdateChangeFn(){
                this.propForm.dateMo = '';
            },
            // 列表数据
            getDataList(){
                // if(!this.power['sign-qh-mgr-query'].state){
                //     this.noPower(this.power['sign-qh-mgr-query'].name);
                //     return false
                // }
                this.loadingList = true;
                let handleTimeEnd = '';
                let handleTimeStar = '';
                let receiveTimeEnd = '';
                let receiveTimeStar = '';
                let datamo = '';
                if(this.propForm.dateMo){
                   datamo = [...this.propForm.dateMo];
                }
                let dataMoBool = datamo.length === 2;
                // 办理日期
                if(this.propForm.region === RECEIVINGDATE.end && dataMoBool){
                    handleTimeStar = this.dateFormat(datamo[0]);
                    handleTimeEnd = this.dateFormat(datamo[1]);
                }
                // 接收日期
                if(this.propForm.region === RECEIVINGDATE.start && dataMoBool){
                    receiveTimeStar = this.dateFormat(datamo[0]);
                    receiveTimeEnd = this.dateFormat(datamo[1]);
                }
                this.$ajax.get('/api/postSigning/getAdminContract',{
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                    statusLaterStage:this.propForm.lateState,
                    statusChange:this.propForm.termination,
                    dataRange:this.propForm.range,
                    stagesBankCode:this.propForm.bank,
                    isOvertime:this.propForm.timeout,
                    handleTimeEnd,
                    handleTimeStar,
                    dealAgentId:this.propForm.departmentMo,
                    dealDeptId:this.propForm.department,
                    statusReceiveAmount:this.propForm.commission,
                    transFlowCode:this.propForm.process,
                    stepState:this.propForm.stepsMo,
                    stepInstanceCode:this.propForm.steps,
                    receiveTimeEnd,
                    receiveTimeStar,
                    keyword:this.propForm.search,
                }).then(res=>{
                    res = res.data;
                    if(res.status === 200){
                        this.tableData = res.data
                    }else{
                        this.tableData = {
                            list:[],
                            pageNum:1,
                            pageSize:1,
                            total:0,
                        };
                    }
                    this.loadingList = false;
                }).catch(err=>{
                    this.errMeFn(err);
                    this.loadingList = false;
                })
            },
            // 贷款银行搜索
            remoteMethodFn(e){
                let t;
                if(e === "全部"){
                    t = '';
                }else{
                    t = e;
                }
                this.$ajax.get('/api/system/selectBankName',{
                    keyWord:t
                }).then(res=>{
                    res = res.data
                    if (res.status === 200) {
                        if(t==='' || t==="全部" || !t){
                            this.rules.bank = [{
                                bankName: "全部",
                                id: ""
                            },...res.data]
                        }else{
                            this.rules.bank = res.data
                        }
                    }
                }).catch(err=>{
                    this.errMeFn(err);
                })
            },
            // 交易流程获取数据
            getTransactionProcess(){
                this.$ajax.post('/api/flowmanage/selectFlowPageList',{
                    cityId:this.cityId
                }).then(res=>{
                    res = res.data
                    if (res.status === 200) {
                        this.rules.process = [{
                            name: "全部",
                            id: ""
                        },...res.data];
                        this.replaceData.tit = [...res.data];
                    }
                }).catch(err=>{
                    this.errMeFn(err);
                })
            },
            // 部门第二版 选择部门
            depHandleClick(data){
                this.propForm.department=data.depId
                this.propForm.departmentS=data.name
                this.handleNodeClick(data);
            },
            // 部门第二版 删除
            clearDep(){
                this.propForm.department='';
                this.propForm.departmentMo='';
                this.clearSelect();
                this.remoteMethod();
            },
            // 部门第二版 下拉隐藏时 刷新数据清除上一次数据
            initDepList(val){
                if(!val){
                    this.remoteMethod()
                }
            },
            // 部门搜索
            searchDep:function (payload) {
                this.DepList=payload.list
                this.propForm.departmentS = payload.depName
            },
            // 后期进度获取数据
            lateProgressFn(){
                this.loadingProgress = true;
                this.$ajax.get('/api/postSigning/getLastStepList',{
                    id:this.layerShowData.id
                }).then(res=>{
                    res = res.data;
                    if(res.status === 200){
                        this.tableProgress = res.data;
                    }
                    this.loadingProgress = false;
                }).catch(err=>{
                    this.errMeFn(err);
                    this.loadingProgress = false;
                })
            },
            // 交易步骤获取数据
            getTradingSteps(){
                this.$ajax.get('/api/postSigning/getAllStepFlows').then(res=>{
                    res = res.data;
                    if(res.status === 200){
                        this.rules.steps = res.data;
                    }
                }).catch(err=>{
                    this.errMeFn(err);
                })
            },
        },
        components:{
            ScreeningTop,
            LayerScrollAuto
        },
        watch:{
           dictionary(newData,oldData){
                //是否超时    
                this.rules.timeout = [{
                            value: "全部",
                            key: ""
                        },...newData[22]];
                //后期状态    
                this.rules.lateState = [{
                            value: "全部",
                            key: ""
                        },...newData[44]];
                // 收佣状态
                this.rules.commission = [{
                            value: "全部",
                            key: ""
                        },...newData[13]];
                // 合同变更状态
                this.rules.termination = [{
                            value: "全部",
                            key: ""
                        },...newData[6]];
                // 数据范围
                this.rules.range = [{
                            value: "全部",
                            key: ""
                        },...newData[48]];
           },
           cityId(){
               // 交易流程
                this.getTransactionProcess();
           }
        },
        mounted() {
            // 获取城市id
            this.getAdmin();
            // 贷款银行
            this.remoteMethodFn();
            // 部门搜索
            this.remoteMethod();
            // 交易步骤
            this.getTradingSteps();
            // 枚举数据查询
            this.getDictionary();
            // 列表数据
            this.getDataList();
        },
    }
</script>
<style lang="less" scoped>
    @import "~@/assets/less/lsx.less";
</style>