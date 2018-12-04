<template>
    <div class="paper-set">
        <!-- 筛选 -->
        <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
            <!-- 筛选条件 -->
            <el-form :inline="true" ref="propForm" :model="propForm" class="prop-form" size="small">
                <el-form-item label="关键字" prop="search">
                    <el-input class="w322" v-model="propForm.search" placeholder="合同编号/物业地址/业主/客户/房产证号/手机号" clearable></el-input>
                </el-form-item>
                <el-form-item label="签约日期" prop="dateMo">
                    <el-date-picker v-model="propForm.dateMo" class="w330" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="交易流程" prop="time">
                    <el-select v-model="propForm.time" class="w300">
                        <el-option v-for="item in rules.time" :key="'jy'+item.id" :label="item.name" :value="item.id"></el-option>
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
                        :key="'bank'+item.bankId" 
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
                        :loading="loading"
                        @change="regionChangeFn"
                        @clear="regionClearFn"
                        remote 
                        filterable>
                            <el-option 
                            v-for="(item,index) in rules.region" 
                            :key="'bk'+item.id + index" 
                            :label="item.name" 
                            :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="regionName">
                        <el-select 
                        v-model="propForm.regionName" 
                        class="w100" 
                        :loading="loading2"
                        clearable
                        filterable>
                            <el-option 
                            v-for="item in rules.regionName" 
                            :key="'bmName'+item.empId" 
                            :label="item.name" 
                            :value="item.empId"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item label="后期状态" prop="late" class="mr">
                    <el-select v-model="propForm.late" class="w180">
                        <el-option 
                        v-for="item in rules.late" 
                        :key="'state'+item.key" 
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
            v-loading="loadingList"
            class="paper-table mt-20">
                <el-table-column :formatter="nullFormatterData" label="合同编号" min-width="161">
                    <template slot-scope="scope">
                        <span class="blue" @click="contractFn(scope.row)">{{scope.row.code}}</span>
                    </template>
                </el-table-column>
                <el-table-column :formatter="nullFormatterData" prop="signDate" label="签约日期" min-width="154">
                    <template slot-scope="scope">
                        {{dateFormat(scope.row.signDate)}}
                    </template>
                </el-table-column>
                <el-table-column :formatter="nullFormatterData" label="后期状态" min-width="145">
                    <template slot-scope="scope">
                        {{statusLaterStageFn(scope.row.statusLaterStage.value)}}
                    </template>
                </el-table-column>
                <el-table-column :formatter="nullFormatterData" prop="propertyAddr" label="物业地址" min-width="221">
                </el-table-column>
                <el-table-column :formatter="nullFormatterData" prop="transFlowName" label="交易流程" min-width="290">
                </el-table-column>
                <el-table-column :formatter="nullFormatterData" prop="owner" label="业主" min-width="154">
                </el-table-column>
                <el-table-column :formatter="nullFormatterData" prop="customer" label="客户" min-width="125">
                </el-table-column>
                <el-table-column :formatter="nullFormatterData" label="成交经纪人" min-width="230">
                    <template slot-scope="scope">
                        {{agentFn(scope.row.dealagentStoreName,scope.row.agent)}}
                    </template>
                </el-table-column>
                <el-table-column :formatter="nullFormatterData" label="操作" min-width="70">
                    <template slot-scope="scope">
                        <el-button class="blue" type="text" @click="receiveFn(scope.row)">{{receiveComFn(scope.row.statusLaterStage.value,1)}}</el-button>
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
                layout=" total, prev, next, jumper"
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
                <el-button class="paper-btn" type size="medium" @click="propCloseFn(0)" round>取消</el-button>
                <el-button class="paper-btn paper-btn-blue" type="primary" size="medium" @click="propCloseFn(1)" round>确定</el-button>
            </span>
        </el-dialog>
        <!-- 接收弹层 -->
        <el-dialog :title="receive.tit" :visible.sync="receive.show" width="1000px" :center="receive.center" class="layer-paper">
            <div class="layer-receive-tab">
                <el-tabs 
                v-model="activeName" 
                class="contract-tab">
                    <el-tab-pane label="交易流程指派">
                        <el-table 
                        :data="dealTable" 
                        border 
                        v-loading="loadingdealTable"
                        class="paper-table mt-20">
                            <el-table-column :formatter="nullFormatterData" prop="transactionStepsType" align="center" label="步骤类型">
                            </el-table-column>
                            <el-table-column :formatter="nullFormatterData" prop="transactionSteps" align="center" label="步骤名称">
                            </el-table-column>
                            <el-table-column :formatter="nullFormatterData" prop="transactionStepsType" align="center" label="计划天数">
                            </el-table-column>
                            <el-table-column :formatter="nullFormatterData" prop="a4" align="center" min-width="185" label="分配角色">
                                <template slot-scope="scope">
                                    <!-- @change="roleChangeFn(scope.$index,$event)"  -->
                                    <el-select 
                                    v-model="scope.row.roleId" 
                                    placeholder="分配角色" 
                                    filterable 
                                    :loading="loading3"
                                    @change="roleChangeFn(scope.$index,$event)"
                                    size="small" 
                                    class="w185">
                                        <el-option 
                                        v-for="item in dealTableRule" 
                                        :key="'fp'+item.key + scope.$index" 
                                        :label="item.value" 
                                        :value="item.key"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column :formatter="nullFormatterData" align="center" min-width="185" label="责任人">
                                <template slot-scope="scope">
                                    <el-select 
                                    v-model="scope.row.personLiableCode" 
                                    :value="scope.row.value"
                                    @visible-change="roleRemoteFn(scope.$index,scope.row.roleId,$event)"
                                    placeholder="选择责任人" 
                                    filterable
                                    :loading="loading4"
                                    @change="roleRemoteChangeFn($event,scope.$index)"
                                    size="small" 
                                    class="w185">
                                        <el-option 
                                        v-for="item in scope.row.rules" 
                                        :key="'zrr'+item.empId + scope.$index" 
                                        :label="item.name" 
                                        :value="item.empId"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column :formatter="nullFormatterData" align="center" label="操作">
                                <template slot-scope="scope">
                                    <el-button 
                                    class="blue" 
                                    @click="dittoFn(scope.$index,scope.row)"
                                    type="text">同上</el-button>
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
                            <template v-if="ContractDatabase.length > 0">
                                <div v-for="items in ContractDatabase" :key="items.kind">
                                    <div class="contract-tit">{{items.kind}}</div>
                                    <div class="contract-main" v-for="item in items.children" :key="item.title">
                                        <p class="cl-1 mb-10"><span class="spna"><template v-if="item.isrequire">*</template></span>{{item.title}}</p>
                                        <ul class="steps-img">
                                            <li 
                                            v-for="(ies,i) in item.value"
                                            :key="ies.name"
                                            @click="previewPhoto(item.value,i)"
                                            >
                                                <div class="img"><uploadCell :type="stepsTypeImg(ies.path)"></uploadCell></div>
                                                <p class="p">{{ies.name}}</p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </template>
                            <div class="no-data-table" v-else>暂无数据</div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <!-- 预览 -->
                <preview :imgList="previewFiles" :start="previewIndex" v-if="preview" @close="preview=false"></preview>
            </div>
            <span slot="footer">
                <el-button 
                class="paper-btn paper-btn-blue" 
                type="primary" 
                size="medium" 
                @click="saveBtnFn" 
                round>保存</el-button>
                <el-button 
                class="paper-btn paper-btn-green" 
                type="primary" 
                size="medium" 
                v-show="receiveComFn(receive.receive,0)"
                @click="receiveBtnFn" 
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
    import {MIXINS} from '@/assets/js/mixins';
    import {TOOL} from '@/assets/js/common';

    const RECEIVE = {
        receive:2,          //接收
        haveReceive:3       //已接收
    }

    export default {
        mixins: [FILTER,MIXINS],
        data() {
            return {
                cityId:1,
                // 列表数据
                tableData:{},
                // 列表请求的页数
                pageNum:1,
                pageSize:5,
                // 加载
                loading:false,
                loading2:false,
                loading3:false,
                loading4:false,
                loadingList:false,
                loadingdealTable:false,
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
                dealTable: [],
                dealTableRule:[],
                // 合同资料库
                ContractDatabase:[],
            }
        },
        computed: {
            invalidNumber() {
                return this.invalidInput.length
            }
        },
        methods: {
            // 图片格式状态判定
            stepsTypeImg(type){
                return this.$tool.get_suffix(type)
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
                    refuseReasons:e.refuseReasons,
                    e,
                }
                // 获取角色
                this.loading4 = true;
                this.$ajax.get("/api/roles").then(res=>{
                    res = res.data;
                    if(res.status === 200){
                        this.dealTableRule = [...res.data];
                    }
                    this.loading4 = false;
                }).catch(err=>{
                    console.log(err)
                })
                // 获取列表数据
                this.loadingdealTable = true;
                this.$ajax.get('/api/postSigning/clickReceive',{
                    contractCode:e.id,
                    transFlowCode:e.transFlowCode
                }).then(res=>{
                    res = res.data
                    if(res.status === 200){
                        let arr = [...res.data];
                        arr.map(e => {
                           e.rules = [{
                               empId:e.personLiableCode,
                               name:e.personLiableName
                           }]
                           e.roleBool = true;
                        })
                        this.dealTable = arr;
                        this.loadingdealTable = false;
                    }
                }).catch(err=>{
                    console.log(err)
                })
                // 合同资料库数据
                this.$ajax.get("/api/postSigning/getDatabase",{
                    contractCode:e.id
                }).then(res=>{
                    res = res.data;
                    if(res.status === 200){
                        let arr = [];
                        if(!!res.data){
                            let j = JSON.parse(res.data.address)
                            arr = this.recursiveFn([...j]);
                        }
                        this.ContractDatabase = arr;
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            recursiveFn(n,arr=[]){
                if(n.length === 0){
                    return arr
                }
                let bool = n[0].kind;
                let children = [];
                let num = 0;
                let arr2 = [...n];
                arr2.map((e,i)=>{
                    if(e.kind === bool){
                        children.push(e);
                        n.splice(i-num,1);
                        num++;
                    }
                })
                arr.push({
                    kind:bool,
                    children,
                })
                return this.recursiveFn(n,arr)
            },
            // 分配角色改变时候 数据联动
            roleChangeFn(i,e) {
                this.loading4 = true;
                this.$ajax.get('/api/organize/employees',{
                    cityId:this.cityId,
                    roleId:e
                }).then(res=>{
                    res = res.data;
                    if(res.status === 200){
                        this.dealTable[i].personLiableCode = "";
                        this.dealTable[i].rules = [...res.data];
                        this.dealTable[i].personLiableName = '';
                        this.dealTable[i].roleBool = false;
                    }
                    this.loading4 = false;
                }).catch(err=>{
                    console.log(err)
                })
            },
            roleRemoteChangeFn(e,i){
                let arr = this.dealTable[i];
                arr.personLiableCode = e;
                this.$set(this.dealTable,i,arr)
            },
            // 展示下拉列表的时候执行
            roleRemoteFn(i,e,bool){
                if(bool && !!e && this.dealTable[i].roleBool){
                    this.loading4 = true;
                    this.$ajax.get('/api/organize/employees',{
                        cityId:this.cityId,
                        roleId:e
                    }).then(res=>{
                        res = res.data;
                        if(res.status === 200){
                            this.dealTable[i].rules = [...res.data];
                        }
                        this.loading4 = false;
                    }).catch(err=>{
                        console.log(err)
                    })
                }
            },
            // 保存
            saveBtnFn(){
                let arr = [...this.dealTable];
                arr.map(e=>{
                    e.contractCode = this.receive.e.id;
                    e.rules.map(i=>{
                        if(i.empId === e.personLiableCode){
                            e.personLiableName = i.name
                        }
                    })
                    // e.rules = [];
                })
                this.$ajax.postJSON('/api/postSigning/saveStepFlow',arr).then(res=>{
                    res = res.data;
                    if(res.status === 200){
                        this.successMeFn(res.message)
                        this.receive.show = false;
                        // 数据刷新
                        this.getListData();
                    }else{
                        this.errMeFn(res.message);
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 接收
            receiveBtnFn(){
                let arr = [...this.dealTable];
                let bool = true;
                arr.map(e=>{
                    e.contractCode = this.receive.e.id;
                    e.rules.map(i=>{
                        if(i.empId === e.personLiableCode){
                            e.personLiableName = i.name
                        }
                    })
                    if(!e.personLiableName){
                        bool = false;
                    }
                    // e.rules = [];
                })
                if(!bool){
                    this.errMeFn('请将交易步骤分配完，才能接收并开始办理后期');
                }else{
                    this.$ajax.postJSON('/api/postSigning/addStepFlow',arr).then(res=>{
                        res = res.data;
                        if(res.status === 200){
                            this.successMeFn(res.message);
                            this.receive.show = false;
                            // 数据刷新
                            this.getListData();
                        }else{
                            this.errMeFn(res.message);
                        }
                    }).catch(err=>{
                        console.log(err)
                    })
                }
            },
            // 拒绝后期
            refusedFn() {
                this.layer = {
                    show: true,
                    tit: '拒绝后期',
                    rabbet: true,
                    center: false
                }
                this.invalidInput = '';
            },
            // 拒绝后期 弹层事件
            propCloseFn(bool) {
                if(bool){
                    if(this.invalidInput.length < 1){
                        this.errMeFn('输入不能为空');
                    }else{
                        this.$ajax.post('/api/postSigning/refuseReceive',{
                            contractCode:this.receive.e.id,
                            refuseReasons:this.invalidInput
                        }).then(res=>{
                            res = res.data;
                            if(res.status === 200){
                                this.successMeFn(res.message);
                                this.receive.show = false;
                                this.layer.show = false;
                                // 数据刷新
                                this.getListData();
                            }else{
                                this.errMeFn(res.message);
                            }
                        }).catch(err=>{
                            console.log(err)
                        })
                    }
                }else{
                    this.layer.show = false
                }
            },
            // 同上
            dittoFn(i,data){
                if(i === 0){
                    this.errMeFn('本步骤没有上一步，请手动进行分配');
                }else{
                    let arr = this.dealTable[i-1];
                    let roleId = arr.roleId;
                    let personLiableCode = arr.personLiableCode;
                    let rules = arr.rules;
                    let obj = Object.assign(this.dealTable[i],{
                        roleId,
                        personLiableCode,
                        rules
                    })
                    this.$set(this.dealTable,i,obj)
                }
            },
            // 合同编号
            contractFn(value) {
                this.$router.push({
                    path: "/contractDetails",
                    query: {
                        id: value.id,//合同id
                        code: value.code,//合同编号
                        contType: value.tradeType.value//合同类型
                    }
                });
            },
            // 重置
            resetFormFn() {
                this.pageNum = 1;
                this.$refs.propForm.resetFields();
                this.getListData();
            },
            // 查询
            queryFn() {
                this.pageNum = 1;
                this.getListData();
                // console.log('查询');
            },
            // 部门筛选回调
            regionChangeFn(e) {
                if( e !=="" || !!e){
                    this.loading2 = true;
                    this.$ajax.get("/api/organize/employees",{
                    cityId:this.cityId,
                    depId:e,
                    }).then(res=>{
                        res = res.data
                        if(res.status === 200){
                            this.propForm.regionName = '';
                            let arr = [];
                            if(res.data.length > 0){
                                    arr = [{
                                    name: "全部",
                                    empId: ""
                                },...res.data]
                            }
                            this.rules.regionName = arr;
                            this.loading2 = false;
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
                this.loading = true;
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
                        this.loading = false;
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 清除部门搜索
            regionClearFn(){
                this.regionMethodFn('');
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
            // 获取数据
            getListData(){
                this.loadingList = true;
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
                        transFlowCode:this.propForm.time,
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
                        this.loadingList = false;
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