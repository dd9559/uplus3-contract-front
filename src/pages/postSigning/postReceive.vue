<template>
    <div class="paper-set">
        <!-- 筛选 -->
        <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
            <!-- 筛选条件 -->
            <el-form :inline="true" ref="propForm" :model="propForm" class="prop-form" size="small">
                <el-form-item label="关键字" prop="search">
                    <el-autocomplete class="w322" v-model="propForm.search" :fetch-suggestions="querySearch" placeholder="合同编号/物业地址/业主/客户/房产证号/手机号" :trigger-on-focus="false" @select="handleSelect" clearable></el-autocomplete>
                </el-form-item>
                <el-form-item label="查询时间" prop="dateMo">
                    <el-date-picker v-model="propForm.dateMo" class="w330" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="交易流程" prop="time">
                    <el-select v-model="propForm.time" class="w300">
                        <el-option v-for="item in rules.time" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="贷款银行" prop="paper">
                    <el-select 
                    v-model="propForm.paper" 
                    class="w262"
                    :remote-method="remoteMethodFn"
                    remote 
                    clearable
                    filterable>
                        <el-option 
                        v-for="item in rules.paper" 
                        :key="item.bankId" 
                        :label="item.bankName" 
                        :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <div class="in-block">
                    <el-form-item label="部门" prop="region" class="mr">
                        <el-select 
                        v-model="propForm.region" 
                        class="w200" 
                        clearable
                        :remote-method="regionMethodFn"
                        @change="regionChangeFn"
                        @clear="regionClearFn"
                        remote 
                        filterable>
                            <el-option 
                            v-for="item in rules.region" 
                            :key="item.id" 
                            :label="item.name" 
                            :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="regionName">
                        <el-select 
                        v-model="propForm.regionName" 
                        class="w100" 
                        clearable
                        filterable>
                            <el-option 
                            v-for="item in rules.regionName" 
                            :key="item.empId" 
                            :label="item.name" 
                            :value="item.empId"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item label="后期状态" prop="late" class="mr">
                    <el-select v-model="propForm.late" class="w180">
                        <el-option 
                        v-for="item in rules.late" 
                        :key="item.key" 
                        :label="item.label" 
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
            :data="tableData.list" 
            class="paper-table mt-20"
            :formatter="nullFormatter">
                <el-table-column label="合同编号" min-width="161">
                    <template slot-scope="scope">
                        <el-button class="blue" type="text" @click="contractFn">{{scope.row.code}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="signDate" label="签约日期" min-width="154">
                    <template slot-scope="scope">
                        {{dateFormat(scope.row.signDate)}}
                    </template>
                </el-table-column>
                <el-table-column prop="" label="后期状态" min-width="145">
                    <template slot-scope="scope">
                        {{statusLaterStageFn(scope.row.statusLaterStage.value)}}
                    </template>
                </el-table-column>
                <el-table-column prop="propertyAddr" label="物业地址" min-width="221">
                </el-table-column>
                <el-table-column prop="transFlowName" label="交易流程" min-width="290">
                </el-table-column>
                <el-table-column prop="owner" label="业主" min-width="154">
                </el-table-column>
                <el-table-column prop="customer" label="客户" min-width="125">
                </el-table-column>
                <el-table-column label="成交经纪人" min-width="230">
                    <template slot-scope="scope">
                        {{agentFn(scope.row.agent,scope.row.dealagentStoreName)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="70">
                    <template slot-scope="scope">
                        <el-button class="blue" type="text" @click="receiveFn(scope.row)">{{receiveComFn(scope.row.statusLaterStage.value,1)}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div>
            <el-pagination
                :current-page="tableData.pageNum"
                :page-size="tableData.pageSize"
                @current-change="currentChangeFn"
                layout="prev, next, jumper"
                :total="tableData.total">
            </el-pagination>
        </div>
        <!-- 拒绝弹层 -->
        <el-dialog :title="layer.tit" :visible.sync="layer.show" width="740px" :center="layer.center" class="layer-paper">
            <div class="layer-invalid layer-refused">
                <div class="input-box">
                    <span class="cl-1 mr-10"><span class="mr-5 red">*</span>拒绝原因：</span>
                    <div class="input">
                        <el-input type="textarea" resize="none" :maxlength="invalidMax" v-model="invalidInput" class="input">
                        </el-input>
                        <div class="text-absloute">{{invalidNumber}}/{{invalidMax}}</div>
                    </div>
                </div>
            </div>
            <span slot="footer">
                <el-button class="paper-btn" type size="medium" @click="propCloseFn" round>取消</el-button>
                <el-button class="paper-btn paper-btn-blue" type="primary" size="medium" @click="propCloseFn(layer.tit)" round>确定</el-button>
            </span>
        </el-dialog>
        <!-- 接收弹层 -->
        <el-dialog :title="receive.tit" :visible.sync="receive.show" width="1000px" :center="receive.center" class="layer-paper">
            <div class="layer-receive-tab">
                <el-tabs v-model="activeName" class="contract-tab">
                    <el-tab-pane label="交易流程指派">
                        <el-table :data="dealTable" border class="paper-table mt-20">
                            <el-table-column prop="transactionStepsType" align="center" label="步骤类型">
                            </el-table-column>
                            <el-table-column prop="transactionSteps" align="center" label="步骤名称">
                            </el-table-column>
                            <el-table-column prop="transactionStepsType" align="center" label="计划天数">
                            </el-table-column>
                            <el-table-column prop="a4" align="center" min-width="185" label="分配角色">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.a4.val" placeholder="分配角色" filterable size="small" @change="roleChangeFn" class="w185">
                                        <el-option v-for="item in scope.row.a4.rules" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" min-width="185" label="责任人">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.a5.val" placeholder="选择责任人" filterable size="small" class="w185">
                                        <el-option v-for="item in scope.row.a5.rules" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作">
                                <template slot-scope="scope">
                                    <el-button class="blue" type="text">同上</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="receive-label">
                            <span class="cl-1 mr-10">拒绝原因：</span>
                            <div class="receive-txt">{{receive.refuseReasons}}</div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="合同资料库">
                        <div class="contract-box">
                            <div class="contract-top" v-show="downloadState">
                                <el-button 
                                    class="paper-btn paper-btn-blue" 
                                    type="primary" 
                                    size="medium" 
                                    @click="downloadStateFn"
                                    round>批量下载</el-button>
                            </div>
                            <div class="contract-top" v-show="!downloadState">
                                <el-button 
                                    class="contract-btn contract-gray" 
                                    type="primary" 
                                    size="small" 
                                    @click="downloadStateFn"
                                    round>完成</el-button>
                                <el-button 
                                    class="contract-btn contract-gray" 
                                    type="primary" 
                                    size="small" 
                                    @click="downloadFn"
                                    round>下载</el-button>
                            </div>
                            <div class="contract-photo">
                                <el-checkbox-group v-model="checkList">
                                    <div class="tit mt-20">{{photoTit.txt1}}</div>
                                    <div class="contract-main" v-for="(items,i) in photoMain" :key="'photoMain' + items.txt">
                                        <div class="contract-tit"><span class="mr-5 red">*</span>{{items.txt}}</div>
                                        <ul class="contract-ul">
                                            <li v-for="(item,t) in items.children" :key="item">
                                                <el-checkbox :label="item" class="el-checkbox" v-show="!downloadState"></el-checkbox>
                                                <img :src="item" @click="photoZoomFn(photoMain,i,t)">
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="tit mt-50">{{photoTit.txt2}}</div>
                                     <div class="contract-main" v-for="(items,i) in photoMainB" :key="'photoMainB' + items.txt">
                                        <div class="contract-tit"><span class="mr-5 red">*</span>{{items.txt}}</div>
                                        <ul class="contract-ul">
                                            <li v-for="(item,t) in items.children" :key="item">
                                                <el-checkbox :label="item" class="el-checkbox" v-show="!downloadState"></el-checkbox>
                                                <img :src="item" @click="photoZoomFn(photoMainB,i,t)">
                                            </li>
                                        </ul>
                                    </div>
                                </el-checkbox-group>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <div class="fixed-zoom-box" v-show="zoomCarousel.show">
                    <el-carousel 
                    class="fixed-zoom"
                    arrow="always"
                    height="100%"
                    indicator-position="none"
                    :initial-index="zoomCarousel.index"
                    :autoplay="zoomCarousel.autoplay"
                    >
                        <el-carousel-item 
                        class="zoom-div"
                        v-for="item in zoomCarousel.children" 
                        :key="'zoomCarousel'+item">
                            <img :src="item">
                        </el-carousel-item>
                    </el-carousel>
                    <div @click="zoomCloseFn" class="fixed-zoom-close">关闭</div>
                </div>
            </div>
            <span slot="footer">
                <el-button class="paper-btn paper-btn-blue" type="primary" size="medium" round>保存</el-button>
                <el-button 
                class="paper-btn paper-btn-green" 
                type="primary" 
                size="medium" 
                v-show="receiveComFn(receive.receive,0)"
                round>接收</el-button>
                <el-button 
                class="paper-btn paper-btn-red" 
                type="primary" 
                size="medium" 
                @click="refusedFn" 
                v-show="receiveComFn(receive.receive,0)"
                round>拒绝</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import ScreeningTop from '@/components/ScreeningTop';
    import {FILTER} from '@/assets/js/filter';
    import {TOOL} from '@/assets/js/common';

    const RECEIVE = {
        receive:2,          //接收
        haveReceive:3       //已接收
    }

    export default {
        mixins: [FILTER],
        data() {
            return {
                cityId:1,
                // 列表数据
                tableData:{},
                // 列表请求的页数
                pageNum:1,
                pageSize:5,
                // 筛选条件
                propForm: {
                    region: '',
                    regionName: '',
                    search: '',
                    paper: '',
                    time: '',
                    late: '',
                    dateMo: '',
                },
                // 筛选选项
                rules: {
                    region: [{
                        name: "全部",
                        id: ""
                    }],
                    regionName: [{
                        name: "全部",
                        empId: ""
                    }],
                    paper: [{
                        bankName: "全部",
                        id: ""
                    }],
                    time: [{
                        name: "全部",
                        id: ""
                    }],
                    late:[{
                        label:'全部',
                        key:''
                    }]
                },
                // 搜索展示内容
                restaurants: [{
                    "value": "1111111",
                }],
                // 作废弹层输入框
                invalidMax: 200,
                invalidInput: '',
                // 弹层属性
                layer: {
                    show: false,
                },
                receive: {
                    show: false,
                    tit: '接收',
                    proWidth: '1000px',
                    rabbet: true,
                    center: false,
                    footer: true
                },
                // 弹层切换展示那个
                activeName: '0',
                // 交易流程 表格数据
                dealTable: [{
                    a1: '担保流程',
                    a2: '资料准备',
                    a3: '7',
                    a4: {
                        val: '',
                        rules: [{
                            label: "全部",
                            value: "选项21"
                        }]
                    },
                    a5: {
                        val: '',
                        rules: [{
                            label: "全部",
                            value: "选项21"
                        }]
                    }
                }],
                // 批量下载状态切换
                downloadState:true,
                // 多选数组
                checkList:[],
                // 相册
                photoTit:{
                    txt1:'卖方',
                    txt2:'买方',
                },
                photoMain:[{
                    txt:'身份证复印件',
                    children:['https://img.zcool.cn/community/0147cf5be2aaaba801209252bb0d56.jpg','https://img.zcool.cn/community/016a935be3dbd0a801209252ee8536.jpg@520w_390h_1c_1e_1o_100sh.jpg']
                }],
                photoMainB:[{
                    txt:'身份证复印件',
                    children:['https://img.zcool.cn/community/010e835be3d71aa801209252ea8f78.jpg@520w_390h_1c_1e_1o_100sh.jpg','https://img.zcool.cn/community/01a2a25be32deca80121ab5d542482.jpg@520w_390h_1c_1e_1o_100sh.jpg','https://img.zcool.cn/community/01945f5be38aefa80121ab5dad4e08.jpg@520w_390h_1c_1e_1o_100sh.jpg']
                },{
                    txt:'购房合同',
                    children:['https://img.zcool.cn/community/01fdf85be39d38a801209252edbf6c.jpg@520w_390h_1c_1e_1o_100sh.jpg']
                }],
                zoomCarousel:{
                    show:false,
                    autoplay:false,
                    index:0,
                    children:[],
                }
            }
        },
        computed: {
            invalidNumber() {
                return this.invalidInput.length
            }
        },
        methods: {
            // 接收状态显示
            receiveComFn(state,bol){
                if(bol){
                    if(state === RECEIVE.receive){
                        return '接收'
                    }else{
                        return '已接收'
                    }
                }else{
                    if(state === RECEIVE.receive){
                        return true
                    }else{
                        return false
                    }
                }
                
            },
            // 开始状态接收
            statusLaterStageFn(state){
                if(state === RECEIVE.receive){
                    return '未开始'
                }else{
                    return '已开始'
                }
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
            // 时间处理
            dateFormat(val){
                return TOOL.dateFormat(val);
            },
            // 分页
            currentChangeFn(e){
                this.pageNum = e;
                this.getListData();
            },
            // 接收
            receiveFn(e) {
                this.receive = {
                    show: true,
                    tit: '接收',
                    proWidth: '1000px',
                    rabbet: true,
                    center: false,
                    footer: true,
                    receive:e.statusLaterStage.value,
                    refuseReasons:e.refuseReasons
                }
                this.$ajax.get('/api/postSigning/clickReceive',{
                    contractCode:e.id,
                    transFlowCode:e.transFlowCode
                }).then(res=>{
                    res = res.data
                    if(res.status === 200){
                        let arr = res.data;
                        let rules;
                        this.$ajax.get("/api/roles").then(res=>{
                            console.log(res)
                        }).catch(err=>{
                            console.log(err)
                        })
                        // arr.forEach(e => {
                        //     e.a4 = {
                        //         val:'',
                        //         // rules:
                        //     }
                        // });
                        console.log(res,this.tableData)
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 拒绝后期
            refusedFn() {
                this.layer = {
                    show: true,
                    tit: '拒绝后期',
                    rabbet: true,
                    center: false
                }
            },
            // 拒绝后期 弹层事件
            propCloseFn() {
                this.layer.show = false
            },
            // 分配角色改变时候 数据联动
            roleChangeFn() {
                console.log(1)
            },
            // 合同编号
            contractFn() {
                console.log('合同编号')
            },
            // 重置
            resetFormFn() {
                this.$refs.propForm.resetFields();
                this.getListData();
            },
            // 查询
            queryFn() {
                this.getListData();
                console.log('查询');
            },
            // 部门筛选回调
            regionChangeFn(e) {
                // this.propForm.regionName = '';
                let tbox;
                if( e !=="" || !!e){
                    this.$ajax.get("/api/organize/employees",{
                    cityId:this.cityId,
                    depId:e,
                    }).then(res=>{
                        res = res.data
                        if(res.status === 200){
                            if(this.propForm.regionName === ''){
                                let arr = [];
                                if(res.data.length > 0){
                                     arr = [{
                                        name: "全部",
                                        empId: ""
                                    },...res.data]
                                }
                                this.rules.regionName = arr;
                               
                            }else{
                                this.rules.regionName = res.data
                            }
                        }
                    }).catch(err=>{
                        console.log(err)
                    })
                }else{
                    this.propForm.regionName = '';
                    this.rules.regionName = [{
                                        name: "全部",
                                        empId: ""
                                    }]
                }
                
            },
            // 部门下拉搜索
            regionMethodFn(e){
                this.$ajax.get("/api/access/deps",{
                    keyword:e
                }).then(res=>{
                    res = res.data
                    if(res.status === 200){
                        if(e==='' || !e){
                            this.rules.region = [{
                                name: "全部",
                                id: ""
                            },...res.data]
                        }else{
                            this.rules.region = res.data
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 清除部门搜索
            regionClearFn(){
                this.regionMethodFn('');
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
                            this.rules.paper = [{
                                bankName: "全部",
                                id: ""
                            },...res.data]
                        }else{
                            this.rules.paper = res.data
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 批量状态切换
            downloadStateFn(){
                this.downloadState = !this.downloadState
            },
            // 下载
            downloadFn(){
                console.log('下载',this.checkList);
            },
            // 图片放大
            photoZoomFn(arr,i,t){
                let j = {
                    show:true,
                    index:t,
                    children:arr[i].children
                };
                Object.assign(this.zoomCarousel,j)
            },
            // 图片放大关闭
            zoomCloseFn(){
                this.zoomCarousel.show = false;
            },
            // 获取数据
            getListData(){
               let signDateSta = '';
               let signDateEnd = '';
               if(this.propForm.dateMo.length === 2){
                   signDateSta = TOOL.dateFormat(this.propForm.dateMo[0]);
                   signDateEnd = TOOL.dateFormat(this.propForm.dateMo[1]);
               }

                this.$ajax.postJSON('/api/postSigning/getContract',{
                    keyword:this.propForm.search,
                    signDateSta,
                    signDateEnd,
                    stepInstanceCode:this.propForm.time,
                    stagesBankCode:this.propForm.paper,
                    dealDeptId:this.propForm.region,
                    dealBrokerName:this.propForm.regionName,
                    statusLaterStage:this.propForm.late,
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                }).then((res)=>{
                    res = res.data
                    if (res.status === 200) {
                        this.tableData = res.data;
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 交易流程获取数据
            getTransactionProcess(){
                this.$ajax.post('/api/flowmanage/selectFlowPageList',{
                    cityId:this.cityId
                }).then(res=>{
                    res = res.data
                    if (res.status === 200) {
                        this.rules.time = [{
                            name: "全部",
                            id: ""
                        },...res.data];
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 后期状态
            getLateState(){
                this.$ajax.get("/api/dictionary/query",{
                    parentId:43
                }).then(res=>{
                    res = res.data
                    if(res.status === 200){
                        let arr = [];
                        res.data.children.forEach(e => {
                            if(e.key === RECEIVE.receive || e.key === RECEIVE.haveReceive){
                                arr.push({
                                    key:e.key,
                                    label:this.statusLaterStageFn(e.key)
                                })
                            }
                        });
                        this.rules.late = [{
                            label:'全部',
                            key:''
                        },...arr]
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }
        },
        components: {
            ScreeningTop
        },
        mounted() {
            // 贷款银行
            this.remoteMethodFn();
            // 交易流程
            this.getTransactionProcess();
            // 部门搜索
            this.regionMethodFn('');
            // 后期状态
            this.getLateState();
            // 列表数据
            this.getListData();
        },
    }
</script>

<style lang="less" scoped>
    @import "~@/assets/less/lsx.less";
</style>