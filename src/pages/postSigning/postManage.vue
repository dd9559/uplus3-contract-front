<template>
    <div>
        <!-- 筛选 -->
        <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
            <el-form :inline="true" ref="propForm" :model="propForm" class="prop-form" size="small">
                <el-form-item label="关键字" prop="search">
                    <el-autocomplete class="w322" v-model="propForm.search" :fetch-suggestions="querySearch" placeholder="合同编号/物业地址/业主/客户/房产证号/手机号" :trigger-on-focus="false" @select="handleSelect" clearable></el-autocomplete>
                </el-form-item>
                <div class="in-block">
                    <el-form-item prop="region" class="mr">
                        <el-select v-model="propForm.region" class="w110">
                            <el-option v-for="item in rules.region" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="dateMo">
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
                        @change="stepsChangeFn"
                        class="w110">
                            <el-option v-for="item in rules.steps" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="stepsMo">
                        <el-select 
                        v-model="propForm.stepsMo" 
                        class="w110" 
                        placeholder="状态">
                            <el-option v-for="item in rules.stepsMo" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item 
                    label="交易流程"
                    prop="process">
                        <el-select 
                        v-model="propForm.process" 
                        class="w270">
                            <el-option v-for="item in rules.process" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item 
                    label="是否超时"
                    prop="timeout">
                        <el-select 
                        v-model="propForm.timeout" 
                        class="w110">
                            <el-option v-for="item in rules.timeout" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item 
                    label="贷款银行"
                    prop="bank">
                        <el-select 
                        v-model="propForm.bank" 
                        filterable
                        class="w262">
                            <el-option v-for="item in rules.bank" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item 
                    label="数据范围"
                    prop="range">
                        <el-select 
                        v-model="propForm.range" 
                        class="w160">
                            <el-option v-for="item in rules.range" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item 
                    label="变更/解约"
                    prop="termination">
                        <el-select 
                        v-model="propForm.termination" 
                        class="w120">
                            <el-option v-for="item in rules.termination" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item 
                    label="后期状态"
                    prop="lateState">
                        <el-select 
                        v-model="propForm.lateState" 
                        class="w100">
                            <el-option v-for="item in rules.lateState" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                </el-form-item>
                <div class="in-block">
                    <el-form-item 
                    label="合同来源部门"
                    prop="department" 
                    class="mr">
                        <el-select 
                        v-model="propForm.department" 
                        @change="departmentChangeFn"
                        filterable
                        class="w200">
                            <el-option v-for="item in rules.department" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="departmentMo">
                        <el-select 
                        v-model="propForm.departmentMo" 
                        filterable
                        class="w100">
                            <el-option v-for="item in rules.departmentMo" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item 
                    label="佣金结算状态"
                    prop="commission">
                        <el-select 
                        v-model="propForm.commission" 
                        class="w100">
                            <el-option v-for="item in rules.commission" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
            :data="tableData" 
            @cell-dblclick="dblclickFn"
            class="paper-table mt-20">
                <el-table-column  prop="a1" label="合同编号" min-width="130">
                    <template slot-scope="scope">
                        <el-button class="blue" type="text" @click="contractFn" >{{scope.row.a1}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="a2" label="后期状态" min-width="90">
                </el-table-column>
                <el-table-column prop="a3" label="变更/解约" min-width="90">
                </el-table-column>
                <el-table-column prop="a4" label="物业地址" min-width="170">
                </el-table-column>
                <el-table-column prop="a5" label="交易流程" min-width="235">
                </el-table-column>
                <el-table-column prop="a6" label="业主" min-width="70">
                </el-table-column>
                <el-table-column prop="a7" label="客户" min-width="70">
                </el-table-column>
                <el-table-column prop="a8" label="成交经纪人" min-width="146">
                </el-table-column>
                <el-table-column prop="a9" label="接收日期" min-width="114">
                </el-table-column>
                <el-table-column prop="a10" label="收佣状态" min-width="105">
                </el-table-column>
                <el-table-column prop="a11" label="佣金结算状态" min-width="121">
                </el-table-column>
                <el-table-column prop="state" label="后期进度" min-width="182">
                    <template slot-scope="scope">
                        <template v-if="scope.row.state === STATE.start">
                            <p>当前步骤：<el-button class="blue" type="text" @click="transactionFn">{{scope.row.txt2}}</el-button></p>
                            <p>{{nextStepFn(scope.row.txt)}}</p>
                        </template>
                        <template v-else>
                            <el-button class="blue" type="text" @click="progressFn">查看交易流程</el-button>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="a12" label="当前步骤是否超时" min-width="140">
                </el-table-column>
                <el-table-column prop="a13" label="当前步骤责任人" min-width="120">
                </el-table-column>
            </el-table>
        </div>
        <!-- 后期进度弹层 -->
        <el-dialog title="后期进度" :visible.sync="layerShow" width="1000px"  class="layer-paper">
            <div class="layer-progress">
                <ul class="ul" :class="layerBtn?'ul-line':''">
                    <li class="mr-30" v-if="layerBtn">
                        <el-button
                            class="management-btn paper-btn-blue"
                            type="primary"
                            size="medium"
                            @click="replaceFn"
                            round>更换交易流程
                        </el-button>
                        <el-button
                            class="paper-btn paper-btn-blue"
                            type="primary"
                            size="medium"
                            @click="managementFn"
                            round>步骤管理
                        </el-button>
                    </li>
                    <li>
                        <span class="cl-2 mr-30">一次性（业）+一次性（客）住宅</span>
                    </li>
                    <li>
                        <span class="cl-1 mr-10">佣金结算状态：</span>
                        <span class="cl-2">部分</span>
                    </li>
                </ul>
                <el-table 
                border
                :data="tableProgress" 
                class="paper-table mt-20">
                    <el-table-column 
                    label="步骤类型" 
                    align="center">
                        <template slot-scope="scope">
                           <span :class="scope.row.state?'red':'cl-2'">{{scope.row.a1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column 
                    label="步骤名称" 
                    align="center">
                        <template slot-scope="scope">
                           <span :class="scope.row.state?'red':'cl-2'">{{scope.row.a2}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column 
                    label="操作人" 
                    align="center">
                        <template slot-scope="scope">
                           <span :class="scope.row.state?'red':'cl-2'">{{scope.row.a3}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column 
                    label="操作日期" 
                    align="center">
                        <template slot-scope="scope">
                           <span :class="scope.row.state?'red':'cl-2'">{{scope.row.a4}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column 
                    label="责任人" 
                    align="center">
                        <template slot-scope="scope">
                           <span :class="scope.row.state?'red':'cl-2'">{{scope.row.a5}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column 
                    label="确定日期" 
                    align="center">
                        <template slot-scope="scope">
                           <span :class="scope.row.state?'red':'cl-2'">{{scope.row.a6}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column 
                    label="办理天数" 
                    align="center">
                        <template slot-scope="scope">
                           <span :class="scope.row.state?'red':'cl-2'">{{scope.row.a7}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column 
                    label="规定天数" 
                    align="center">
                        <template slot-scope="scope">
                           <span :class="scope.row.state?'red':'cl-2'">{{scope.row.a8}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column 
                    label="操作" 
                    min-width="120px"
                    align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.stepState === OPERATION.start">
                                <el-button class="blue" type="text" @click="operationFn">查看</el-button>
                            </template>
                            <template v-else-if="scope.row.stepState === OPERATION.backlog">
                                <el-button class="blue" type="text" @click="transactionFn">办理</el-button><el-button class="blue" type="text" @click="upFn(scope)">上</el-button><el-button class="blue" type="text" @click="downFn">下</el-button>
                            </template>
                            <template v-else-if="scope.row.stepState === OPERATION.sure">
                                <el-button class="blue" type="text" @click="sureFn">确认</el-button>
                            </template>
                            <template v-else-if="scope.row.stepState === OPERATION.not">
                                <el-button class="blue" type="text" @click="upFn(scope)">上</el-button><el-button class="blue" type="text" @click="downFn">下</el-button>
                            </template>
                            <template v-else-if="scope.row.stepState === OPERATION.amend">
                                <el-button class="blue" type="text" @click="amendFn">修改</el-button>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
        <!-- 更换交易流程弹层 -->
        <el-dialog title="选择交易流程" :visible.sync="replaceShow" width="740px"  class="layer-paper">
            <div class="replace-box">
                <div>
                    <div class="tit">交易流程</div>
                    <ul class="ul">
                        <li 
                        v-for="(item,index) in replaceData.tit" 
                        :class="replaceData.index===index ?'on':''"
                        @click="replaceTabFn(index)"
                        :key="item">{{item}}</li>
                    </ul>
                </div>
                <div>
                    <div class="tit">交易步骤</div>
                        <ul class="ul-box"
                        v-for="(items,index) in replaceData.children" 
                        :key="index +'1'"
                        v-show="replaceData.index===index"
                        >
                            <li 
                            v-for="item in items"
                            :key="item +'2'">{{item}}</li>
                        </ul>
                </div>
            </div>
            <span slot="footer">
                <el-button class="paper-btn" type size="medium" @click="replaceCloseFn" round>返回</el-button>
                <el-button class="paper-btn paper-btn-blue" type="primary" size="medium" @click="replaceBtnFn" round>确定</el-button>
            </span>
        </el-dialog>
        <!-- 办理 -->
        <el-dialog :title="stepsData.tit" :visible.sync="stepsData.show" width="740px"  class="layer-paper">
            <div class="steps-from">
                <div 
                v-for="(item,index) in stepsFrom"
                :key="item.tit"
                class="steps-li">
                    <div class="steps-li-fl">
                        <span class="steps-fl">{{item.tit}}：</span>
                        <div class="steps-mandatory" v-if="item.bool">*</div>
                    </div>
                    <div class="steps-fr">
                        <!-- 办理 编辑 -->
                        <template v-if="stepsData.tit !== STEPS.end">
                            <template v-if="item.type === STEPSINPUT.start">
                                <el-input 
                                v-model="item.val"
                                size="small"
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
                            <template v-else-if="item.type === STEPSINPUT.img">
                                <div><el-button class="paper-btn paper-btn-blue" type="primary" size="medium" @click="imgBtnFn">上传图片</el-button></div>
                                <ul class="steps-img">
                                    <li 
                                    class="steps-img-li"
                                    v-for="(i,n) in item.list"
                                    @click="clearFn(index,n)"
                                    :key="i.name"
                                    >
                                        <i class="iconfont icon-tubiao-6"></i>
                                        <img :src="i.src">
                                    </li>
                                </ul>
                            </template>
                            <template v-else>
                                <div>
                                    <template v-if="item.type === STEPSINPUT.mp4">
                                        <el-button class="paper-btn paper-btn-blue" type="primary" size="medium" @click="imgBtnFn">上传视频</el-button>
                                    </template>
                                    <template v-if="item.type === STEPSINPUT.excel">
                                        <el-button class="paper-btn paper-btn-blue" type="primary" size="medium" @click="imgBtnFn">上传Word</el-button>
                                    </template>
                                    <template v-if="item.type === STEPSINPUT.word">
                                        <el-button class="paper-btn paper-btn-blue" type="primary" size="medium" @click="imgBtnFn">上传Excel</el-button>
                                    </template>
                                    <template v-if="item.type === STEPSINPUT.pdf">
                                        <el-button class="paper-btn paper-btn-blue" type="primary" size="medium" @click="imgBtnFn">上传PDF</el-button>
                                    </template>
                                </div>
                                <ul class="steps-img">
                                    <li 
                                    class="steps-mp4-li"
                                    v-for="(i,n) in item.list"
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
                            </template>
                        </template>
                        <!-- 查看 -->
                        <template v-else>
                            <template v-if="item.type === STEPSINPUT.start || item.type === STEPSINPUT.time || item.type === STEPSINPUT.textarea">
                                <div class="steps-see">{{item.val}}</div>
                            </template>
                            <template v-else>
                                <ul class="steps-img">
                                    <li 
                                    class="steps-mp4-li"
                                    v-for="(i,n) in item.list"
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
                                </ul>
                            </template>
                        </template>
                    </div>
                </div>
            </div>
            <span slot="footer">
                <!-- 办理 -->
                <template v-if="stepsData.tit === STEPS.start">
                    <el-button class="paper-btn" type size="medium" @click="handleCloseFn" round>取消</el-button>
                    <el-button class="paper-btn paper-btn-blue" type="primary" size="medium" @click="handleBtnFn" round>确定</el-button>
                </template>
                <!--  编辑 -->
                <template v-else-if="stepsData.tit === STEPS.sure">
                    <el-button class="paper-btn paper-btn-blue" type="primary" size="medium" @click="editorBtnFn" round>确定</el-button>
                </template>
            </span>
        </el-dialog>
        <!-- 调整步骤 -->
        <el-dialog title="调整步骤" 
        :visible.sync="adjustShow" 
        width="740px"  
        class="layer-paper">
            <div class="layer-chekbox-box">
                <el-table
                :data="adjustData"
                class="paper-table" 
                border>
                    <el-table-column
                        prop="id"
                        class="layer-all-chekbox" 
                        align="center"
                        width="250px"
                        label="标题">
                        <template slot-scope="scope">
                            <p class="check-all">
                                <el-checkbox 
                                v-model="scope.row.bool" 
                                @change="adjustAllChange(scope.$index,$event)">{{scope.row.id}}</el-checkbox>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        align="center"
                        label="内容">
                        <template slot-scope="scope">
                            <el-checkbox-group 
                            class="layer-checkbox-p"
                            v-model="scope.row.list"
                            @change="adjustChange(scope.$index,$event)">
                                <p 
                                v-for="item in scope.row.children" 
                                :key="item.name">
                                    <el-checkbox 
                                    :label="item.name">{{item.name}}</el-checkbox>
                                </p>
                            </el-checkbox-group>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer">
                <el-button class="paper-btn paper-btn-blue" type="primary" size="medium" @click="adjustBtnFn" round>确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import ScreeningTop from '@/components/ScreeningTop';

    // 合同
    const STATE = {
        start:0,    //进行中的合同
        end:1,      //后期所有步骤办理完
        err:2,      //解约合同
    }
    // 操作状态
    const OPERATION = {
        start:0,    //已办理
        backlog:1,    //待办理
        sure:2,    //需确认（代办）
        not:3,    //不可办理
        amend:4,    //修改
        timeoutNot:5,    //超时未办
        timeoutStart:6,    //超时已办
    }
    // 办理状态
    const STEPS = {
        start:'办理',    //办理
        sure:'修改',    //修改
        end:'查看',      //查看
    }
    // 办理输入框
    const STEPSINPUT = {
        start:0,        //input 文本输入框
        time:1,         //时间选择
        textarea:2,      //文本框输入
        img:3,          //图片
        mp4:4,          //视频
        excel:5,        //表格
        word:6,         //文档
        pdf:7,          //pdf文件

    }
    export default {
        data(){
            return{
                // 筛选结果
                propForm:{
                    search:'',
                    dateMo:'',
                    region:'选项1',
                    steps:'选项1',
                    stepsMo:'',
                    process:'选项1',
                    timeout:'选项1',
                    bank:'选项1',
                    range:'选项1',
                    termination:'选项1',
                    lateState:'选项1',
                    commission:'选项1',
                    department:'选项1',
                    departmentMo:'选项1',
                },
                // 筛选下拉
                rules:{
                    region: [{
                        label: "区域一",
                        value: "选项1"
                    },
                    {
                        label: "区域二",
                        value: "选项2"
                    }],
                    steps: [{
                        label: "区域一",
                        value: "选项1"
                    },
                    {
                        label: "区域二",
                        value: "选项2"
                    }],
                    stepsMo: [{
                        label: "区域一",
                        value: "选项1"
                    },
                    {
                        label: "区域二",
                        value: "选项2"
                    }],
                    process: [{
                        label: "全部",
                        value: "选项1"
                    },
                    {
                        label: "区域二",
                        value: "选项2"
                    }],
                    timeout:[{
                        label: "全部",
                        value: "选项1"
                    },
                    {
                        label: "区域二",
                        value: "选项2"
                    }],
                    bank:[{
                        label: "全部",
                        value: "选项1"
                    },
                    {
                        label: "区域二",
                        value: "选项2"
                    }],
                    range:[{
                        label: "全部",
                        value: "选项1"
                    },
                    {
                        label: "区域二",
                        value: "选项2"
                    }],
                    termination:[{
                        label: "全部",
                        value: "选项1"
                    },
                    {
                        label: "区域二",
                        value: "选项2"
                    }],
                    lateState:[{
                        label: "全部",
                        value: "选项1"
                    },
                    {
                        label: "区域二",
                        value: "选项2"
                    }],
                    commission:[{
                        label: "全部",
                        value: "选项1"
                    },
                    {
                        label: "区域二",
                        value: "选项2"
                    }],
                    department:[{
                        label: "全部",
                        value: "选项1"
                    },
                    {
                        label: "区域二",
                        value: "选项2"
                    }],
                    departmentMo:[{
                        label: "全部",
                        value: "选项1"
                    },
                    {
                        label: "区域二",
                        value: "选项2"
                    }],
                },
                // 列表数据
                tableData:[{
                    a1:'201809301289',
                    a2:'已开始',
                    a3:'变更',
                    a4:'安居苑10栋3单元1102',
                    a5:'一次性（业）+一次性（客）住宅',
                    a6:'张三',
                    a7:'张三',
                    a8:'当代一店-夏雨田',
                    a9:'2018/08/29',
                    a10:'0/25000',
                    a11:'未收',
                    a12:'否',
                    a13:'张三',
                    state:0,
                    txt:'资料准备',
                    txt2:'评估送达银行'
                },{
                    a1:'201809301289',
                    a2:'已开始',
                    a3:'变更',
                    a4:'安居苑10栋3单元1102',
                    a5:'一次性（业）+一次性（客）住宅',
                    a6:'张三',
                    a7:'张三',
                    a8:'当代一店-夏雨田',
                    a9:'2018/08/29',
                    a10:'0/25000',
                    a11:'未收',
                    a12:'否',
                    a13:'张三',
                    state:1,
                    txt:'资料准备',
                    txt2:'评估送达银行'
                }],
                // 状态
                STATE,
                // 后期进度列表
                tableProgress:[{
                    state:false,
                    a1:'担保流程',
                    a2:'资料准备',
                    a3:'李四',
                    a4:'2018-09-08',
                    a5:'李四',
                    a6:'2018-09-08',
                    a7:'8',
                    a8:'7',
                    stepState:0
                },
                {
                    state:false,
                    a1:'担保流程',
                    a2:'资料准备',
                    a3:'李四',
                    a4:'2018-09-08',
                    a5:'李四',
                    a6:'2018-09-08',
                    a7:'8',
                    a8:'7',
                    stepState:1
                },
                {
                    state:false,
                    a1:'担保流程',
                    a2:'资料准备',
                    a3:'李四',
                    a4:'2018-09-08',
                    a5:'李四',
                    a6:'2018-09-08',
                    a7:'8',
                    a8:'7',
                    stepState:2
                },
                {
                    state:false,
                    a1:'担保流程',
                    a2:'资料准备',
                    a3:'李四',
                    a4:'2018-09-08',
                    a5:'李四',
                    a6:'2018-09-08',
                    a7:'8',
                    a8:'7',
                    stepState:3
                },
                {
                    state:false,
                    a1:'担保流程',
                    a2:'资料准备',
                    a3:'李四',
                    a4:'2018-09-08',
                    a5:'李四',
                    a6:'2018-09-08',
                    a7:'8',
                    a8:'7',
                    stepState:4
                }],
                // 后期进度弹层
                layerShow:false,
                layerBtn:true,
                // 步骤状态
                OPERATION,
                // 更换交易流程弹层
                replaceShow:false,
                // 更换交易流程数据
                replaceData:{
                    tit:['111','2222','444'],
                    children:[['555','666','7777','8888'],['1010','1012'],['11100']],
                    index:0,
                },
                // 步骤管理弹层数据
                stepsData:{
                    show:false,
                    tit:'办理'
                },
                stepsFrom:[{
                    // 默认input输入文字
                    val:'111',
                    //输入文字 
                    tit:'办理地址测试文件',
                    // 是否必填
                    bool:true,
                    //输入类型 
                    type:0,
                },{
                    val:'',
                    tit:'图片上传',
                    bool:true,
                    type:3,
                    list:[{
                        src:'https://img.zcool.cn/community/00deeb5bebe86ca80121ab5d829701.png@260w_195h_1c_1e_1o_100sh.jpg',
                        name:'图片名称',
                    }]
                },{
                    val:'',
                    tit:'视频上传',
                    bool:true,
                    type:4,
                    list:[{
                        name:'视频名称',
                    }]
                },{
                    val:'',
                    tit:'表格上传',
                    bool:true,
                    type:5,
                    list:[{
                        name:'表格名称',
                    }]
                },{
                    val:'',
                    tit:'文档上传',
                    bool:true,
                    type:6,
                    list:[{
                        name:'文档名称',
                    }]
                },{
                    val:'',
                    tit:'PDF上传',
                    bool:true,
                    type:7,
                    list:[{
                        name:'pdf名称',
                    }]
                },{
                    val:'',
                    tit:'办理日期',
                    bool:true,
                    type:1,
                },{
                    val:'',
                    tit:'备注',
                    bool:false,
                    type:2,
                }],
                // 办理状态
                STEPS,
                // 办理输入形式
                STEPSINPUT,
                // 文本输入框最大数值
                invalidMax:200,
                // 调整步骤
                adjustShow:false,
                adjustData:[{
                    id:"0001",
                    bool:false,
                    list:[],
                    children:[{
                        name:'测试'
                    },{
                        name:'柯南',
                    }]
                },{
                    id:"0002",
                    bool:false,
                    list:[],
                    children:[{
                        name:'路飞'
                    }]
                },{
                    id:"0003",
                    bool:true,
                    list:[],
                    children:[{
                        name:'基德',
                    },{
                        name:'猫咪老师',
                    },{
                        name:'香吉士',
                    }]
                }]
            }
        },
        methods:{
            // 重置
            resetFormFn() {
                this.$refs.propForm.resetFields()
            },
            // 查询
            queryFn() {
                console.log('查询')
            },
            // 筛选搜索
            querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect(item) {
                console.log(item);
            },
            // 交易步骤回调
            stepsChangeFn(){
                console.log('交易步骤回调')
            },
            // 部门回调
            departmentChangeFn(){
                console.log('部门回调')
            },
            // 合同编号
            contractFn(e){
                console.log('合同编号')
            },
            // 办理
            transactionFn(){
                console.log('办理')
            },
            // 后期进度
            progressFn(){
                this.layerShow = true;
                this.layerBtn = false;               
                console.log('后期进度')
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
                console.log(column.property)
                if(column.property === 'a1'){
                    console.log('点击的是合同编号')
                }else if(column.property === 'state'){
                    console.log('点击的是后期进度')
                }else{
                    this.layerShow = true;
                    if(row.state === STATE.start){
                        this.layerBtn = true;
                    }else{
                        this.layerBtn = false;
                    }
                    console.log('双击事件')
                }
            },
            // 查看
            operationFn(){
                console.log('查看')
            },
            // 更换交易流程
            replaceFn(){
                this.replaceShow = true;
                console.log('更换交易流程')
            },
            // 步骤管理
            managementFn(){
                this.adjustShow = true;
                console.log('步骤管理')
            },
            // 确认
            sureFn(){
                console.log('确认')
            },
            // 上
            upFn(e){
                let index = e.$index;
                console.log('上')
            },
            // 下
            downFn(){
                console.log('下')
            },
            // 修改
            amendFn(){
                console.log('修改')
            },
            // 选择交易流程 取消
            replaceCloseFn(){
                this.replaceShow = false;
                console.log('选择交易流程 取消')
            },
            // 选择交易流程 确定
            replaceBtnFn(){
                this.replaceShow = false;
                console.log('选择交易流程 确定')
            },
            // 选择交易切换
            replaceTabFn(i){
                this.replaceData.index = i;
            },
            // 根据文字计算宽度
            stepsWidthFn(txt){
                let n = (txt.length + 2) * 14 + 10;
                return `${n}px`
            },
            // 办理弹层取消
            handleCloseFn(){
                console.log('办理弹层取消')
                this.stepsData.show = false;
            },
            // 办理确定
            handleBtnFn(){
                console.log('办理确定')
                this.stepsData.show = false;
            },
            // 编辑确定
            editorBtnFn(){
                console.log('编辑确定')
                this.stepsData.show = false;
            },
            // 图片上传
            imgBtnFn(){
                console.log('图片上传')
            },
            // 视频上传
            mp4BtnFn(){
                console.log('视频上传')
            },
            // 表格上传
            excelBtnFn(){
                console.log('表格上传')
            },
            // 文档上传
            wordBtnFn(){
                console.log('文档上传')
            },
            // pdf上传
            pdfBtnFn(){
                console.log('pdf上传')
            },
            // 删除
            clearFn(i,n){
                let arr = [...this.stepsFrom];
                arr[i].list.splice(n,1)
                this.stepsFrom = arr;
            },
            // 调整步骤确定
            adjustBtnFn(){
                this.adjustShow = false;
                console.log('调整步骤确定')
            },
            // 多选
            adjustChange(i,arr){
                let adj = this.adjustData[i];
                let bool = adj.children.length === arr.length;
                adj.bool = bool;
            },
            // 全选
            adjustAllChange(i,bool){
                let arr = this.adjustData[i]
                if(bool){
                    let ar = []
                    arr.children.forEach(e => {
                        ar.push(e.name)
                    });
                    arr.list = ar;
                }else{
                    arr.list = [];
                }
            }
        },
        components:{
            ScreeningTop
        },
        mounted() {
            // let arr = [1,2,3,4,5];
            // let arr2 = [...arr];
            // let n = 2;
            // arr2[n] = arr[n+1]
            // arr2[n+1]= arr[n];
            // console.log(arr2)
        },
    }
</script>
<style lang="less" scoped>
    @import "~@/assets/less/lsx.less";
</style>