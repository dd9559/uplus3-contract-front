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
                    <el-select v-model="propForm.time" class="w300" filterable>
                        <el-option v-for="item in rules.time" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="贷款银行" prop="paper">
                    <el-select v-model="propForm.paper" class="w262" filterable>
                        <el-option v-for="item in rules.paper" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门" prop="region" class="mr">
                    <el-select v-model="propForm.region" @change="regionChangeFn" class="w200" filterable>
                        <el-option v-for="item in rules.region" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="regionName">
                    <el-select v-model="propForm.regionName" class="w100" filterable>
                        <el-option v-for="item in rules.regionName" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="后期状态" prop="late" class="mr">
                    <el-select v-model="propForm.late" class="w180" filterable>
                        <el-option v-for="item in rules.late" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </ScreeningTop>
        <!-- 列表 -->
        <div class="paper-table-box">
            <div class="paper-set-tit">
                <div class="paper-tit-fl"><i class="iconfont icon-tubiao-11 mr-10 font-cl1"></i>数据列表</div>
            </div>
            <el-table :data="tableData" class="paper-table mt-20">
                <el-table-column label="合同编号" min-width="161">
                    <template slot-scope="scope">
                        <el-button class="blue" type="text" @click="contractFn">{{scope.row.a1}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="a2" label="签约日期" min-width="154">
                </el-table-column>
                <el-table-column prop="a3" label="后期状态" min-width="145">
                </el-table-column>
                <el-table-column prop="a4" label="物业地址" min-width="221">
                </el-table-column>
                <el-table-column prop="a5" label="交易流程" min-width="290">
                </el-table-column>
                <el-table-column prop="a6" label="业主" min-width="154">
                </el-table-column>
                <el-table-column prop="a7" label="客户" min-width="125">
                </el-table-column>
                <el-table-column prop="a8" label="成交经纪人" min-width="230">
                </el-table-column>
                <el-table-column label="操作" min-width="70">
                    <template slot-scope="scope">
                        <el-button class="blue" type="text" @click="receiveFn(scope.row.receive)">{{receiveComFn(scope.row.receive,1)}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
                            <el-table-column prop="a1" align="center" label="步骤类型">
                            </el-table-column>
                            <el-table-column prop="a2" align="center" label="步骤名称">
                            </el-table-column>
                            <el-table-column prop="a3" align="center" label="计划天数">
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
                            <div class="receive-txt">原因是什么是什么？原因是什么是什么？原因是什么是什么？原因是什么是什么？原因是什么是什么？原因是什么是什么？原因是什么是什么？原因是什么是什么？原因是什么是什么？原因是什么是什么？原因是什么是什么？原因是什么是什么？原因是什么是什么？原因是什么是什么？原因是什么是什么？原因是什么是什么？原因是什么是什么？原因是什么是什么？原因是什么是什么？原因是什么是什么？原因是什么是什么？原因是什么是什么？原因是什么是什么？原因是什么是什么？</div>
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
                <el-button class="paper-btn paper-btn-red" type="primary" size="medium" @click="refusedFn" round>拒绝</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import ScreeningTop from '@/components/ScreeningTop';
    const RECEIVE = {
        receive:0,          //接收
        haveReceive:1       //已接收
    }

    export default {
        data() {
            return {
                // 列表数据
                tableData: [{
                    a1: '201809301289',
                    a2: '2018/09/30',
                    a3: '未开始',
                    a4: '安居苑10栋3单元1102',
                    a5: '一次性（业）+一次性',
                    a6: '张小龙',
                    a7: '张明明',
                    a8: '当代一店-夏雨田',
                    receive: 1,
                }, ],
                // 筛选条件
                propForm: {
                    region: '',
                    regionName: '',
                    search: '',
                    paper: '选项1',
                    time: '选项11',
                    late: '选项21',
                    dateMo: '',
                },
                // 筛选选项
                rules: {
                    region: [{
                        label: "区域一",
                        value: "shanghai"
                    },
                    {
                        label: "区域二",
                        value: "quyuer"
                    }],
                    regionName: [{
                        label: "区域一",
                        value: "shangha"
                    },
                    {
                        label: "区域二",
                        value: "quyue"
                    }, ],
                    paper: [{
                        label: "全部",
                        value: "选项1"
                    },
                    {
                        label: "区域二",
                        value: "选项2"
                    }],
                    time: [{
                        label: "全部",
                        value: "选项11"
                    },
                    {
                        label: "区域二",
                        value: "选项12"
                    }],
                    late: [{
                        label: "全部",
                        value: "选项21"
                    },
                    {
                        label: "区域二",
                        value: "选项22"
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
            // 接收
            receiveFn(e) {
                this.receive = {
                    show: true,
                    tit: '接收',
                    proWidth: '1000px',
                    rabbet: true,
                    center: false,
                    footer: true,
                    receive:e
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
                this.$refs.propForm.resetFields()
            },
            // 查询
            queryFn() {
                console.log('查询')
            },
            // 部门筛选回调
            regionChangeFn(e) {
                console.log(e)
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
        },
        components: {
            ScreeningTop
        }
    }
</script>

<style lang="less" scoped>
    @import "~@/assets/less/lsx.less";
</style>