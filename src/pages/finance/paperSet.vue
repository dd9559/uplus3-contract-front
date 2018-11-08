<template>
    <div class="paper-set">
            <!-- 筛选 -->
            <!-- 
                * 参数     类型       默认值
                * min      Number    61    

                * 事件
                * propQueryFn           点击查询回调
                * propResetFormFn       点击重置回调
             -->
            <ScreeningTop
                @propQueryFn="queryFn"
                @propResetFormFn="resetFormFn"
            >
                <!-- 筛选条件 -->
                <el-form 
                :inline="true"
                ref="propForm"
                :model="propForm" 
                class="prop-form"
                size="small">
                    <el-form-item 
                    label="部门" 
                    prop="region"
                    class="mr">
                        <el-select v-model="propForm.region" @change="regionChangeFn" class="w200">
                            <el-option 
                            v-for="item in rules.region" 
                            :key="item.value"
                            :label="item.label" 
                            :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item 
                    prop="regionName">
                        <el-select v-model="propForm.regionName" class="w100">
                            <el-option 
                            v-for="item in rules.regionName" 
                            :key="item.value"
                            :label="item.label" 
                            :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键字" prop="search">
                        <el-autocomplete
                        class="w312"
                        v-model="propForm.search"
                        :fetch-suggestions="querySearch"
                        placeholder="开票人员/合同编号/票据编"
                        :trigger-on-focus="false"
                        @select="handleSelect"
                        clearable
                        ></el-autocomplete>
                    </el-form-item>
                    <el-form-item 
                    label="票据状态" 
                    prop="paper">
                        <el-select v-model="propForm.paper" class="w120">
                            <el-option 
                            v-for="item in rules.paper" 
                            :key="item.value"
                            :label="item.label" 
                            :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item 
                    label="查询时间" 
                    prop="time"
                    class="mr">
                        <el-select v-model="propForm.time" class="w120">
                        <el-option 
                            v-for="item in rules.time" 
                            :key="item.value"
                            :label="item.label" 
                            :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item 
                    prop="dateMo"
                    class="mr">
                        <el-date-picker
                            v-model="propForm.dateMo"
                            class="w330"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </ScreeningTop>
            <!-- 列表 -->
            <div class="paper-table-box">
                <div class="paper-set-tit">
                    <div class="paper-tit-fl">数据列表</div>
                </div>
                <el-table
                :data="tableData"
                class="paper-table mt-20"
                >
                    <el-table-column
                        fixed
                        align="center"
                        label="序号"
                        min-width="70">
                        <template slot-scope="scope">
                            <p class="tc">{{scope.row.a0}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed
                        label="合同编号"
                        min-width="124">
                        <template slot-scope="scope">
                            <el-button class="blue" type="text" @click="contractFn">{{scope.row.a1}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed
                        label="票据编号"
                        min-width="137">
                        <template slot-scope="scope">
                            <el-button class="blue" type="text" @click="paperFn">{{scope.row.a2}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed
                        label="收款ID"
                        min-width="135">
                        <template slot-scope="scope">
                            <el-button class="blue" type="text" @click="collectionFn">{{scope.row.a3}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed
                        prop="a4"
                        label="物业地址"
                        min-width="124">
                    </el-table-column>
                    <el-table-column
                        fixed
                        prop="a5"
                        label="客户姓名"
                        min-width="84">
                    </el-table-column>
                    <el-table-column
                        fixed
                        prop="a6"
                        label="票据状态"
                        min-width="84">
                    </el-table-column>
                    <el-table-column
                        prop="a7"
                        label="收款人"
                        min-width="71">
                    </el-table-column>
                    <el-table-column
                        prop="a8"
                        label="开票人员"
                        min-width="86">
                    </el-table-column>
                    <el-table-column
                        prop="a9"
                        label="门店"
                        min-width="85">
                    </el-table-column>
                    <el-table-column
                        prop="a10"
                        label="开盘金额（元）"
                        min-width="122">
                    </el-table-column>
                    <el-table-column
                        prop="a11"
                        label="开票日期"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        prop="a12"
                        label="打印次数"
                        min-width="85">
                    </el-table-column>
                    <el-table-column
                        prop="a13"
                        label="打印人"
                        min-width="72">
                    </el-table-column>
                    <el-table-column
                        prop="a14"
                        label="打印日期"
                        min-width="152">
                    </el-table-column>
                    <el-table-column
                        prop="a15"
                        label="回收日期"
                        min-width="152">
                    </el-table-column>
                    <el-table-column
                        prop="a16"
                        label="核销日期"
                        min-width="148">
                    </el-table-column>
                    <el-table-column
                        prop="a17"
                        label="作废日期"
                        min-width="152">
                    </el-table-column>
                    <el-table-column
                        prop="a18"
                        label="作废原因"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        label="操作人/时间"
                        min-width="146">
                        <template slot-scope="scope">
                                <p>{{scope.row.a19}}</p>
                                <p>{{scope.row.a20}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        min-width="148">
                        <template slot-scope="scope">
                            <!-- 已开票 -->
                            <template v-if="scope.row.paperState===STATE.start">
                                <!-- 门店 -->
                                <template v-if="loginState">
                                    <el-button class="blue" type="text" @click="invalidFn">作废</el-button>
                                </template>
                                <!-- 财务 -->
                                <template v-else>
                                    <el-button class="blue" type="text" @click="cancelFn">核销</el-button>
                                    <span class="line"></span>
                                    <el-button class="blue" type="text" @click="irecyclingFn">回收</el-button>
                                    <span class="line"></span>
                                    <el-button class="blue" type="text" @click="invalidFn">作废</el-button>
                                </template>
                            </template>
                            <!-- 已作废 -->
                            <template v-else-if="scope.row.paperState===STATE.invalid">
                                <!-- 门店 -->
                                <template v-if="loginState">
                                    <el-button class="blue" type="text" @click="startFn">开票</el-button>
                                </template>
                                <!-- 财务 -->
                                <template v-else>
                                    <el-button class="blue" type="text" @click="irecyclingFn">回收</el-button>
                                    <span class="line"></span>
                                    <el-button class="blue" type="text" @click="startFn">开票</el-button>
                                </template>
                            </template>
                            <!-- 已回收 和 已核销 -->
                            <template v-else>-</template>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 弹层 -->
            <el-dialog
                :title="layer.tit"
                :visible.sync="layer.show"
                :width="layer.proWidth"
                :center="layer.center"
                class="layer-paper">
                <div v-if="layer.rabbet" class="layer-invalid">
                    <ul class="ul">
                        <li>
                            <span class="cl-1 mr-10">票据编号：</span>
                            <span class="cl-2 mr-40">SJ201809301289</span>
                        </li>
                        <li>
                            <span class="cl-1 mr-10">合同编号：</span>
                            <span class="cl-2 mr-40">201809301289</span>
                        </li>
                        <li>
                            <span class="cl-1 mr-10">收款时间：</span>
                            <span class="cl-2">2018/09/30</span>
                        </li>
                    </ul>
                    <div class="input-box">
                        <span class="cl-1 mr-10">作废备注：</span>
                        <div class="input">
                            <el-input
                                type="textarea"
                                resize="none"
                                placeholder="请输入核销理由"
                                :maxlength="invalidMax"
                                v-model="invalidInput"
                                class="input">
                            </el-input>
                            <div class="text-absloute">{{invalidNumber}}/{{invalidMax}}</div>
                        </div>
                    </div>
                </div>
                <div v-else class="txt">{{layer.msg}}</div>
                <span slot="footer">
                        <el-button 
                        class="paper-btn" 
                        type size="medium"
                        @click="propCloseFn" 
                        round>取消</el-button>
                    <el-button 
                        class="paper-btn paper-btn-blue" 
                        type="primary" 
                        size="medium"
                        @click="propCloseFn(layer.tit)" 
                        round>确定</el-button>
                </span>
            </el-dialog>
    </div>
</template>

<script>
    import ScreeningTop from '@/components/ScreeningTop';
    const STATE = {
        start:0,        //已开票
        invalid:1,      //已作废
    }
    export default {
        mixins:[Mixin],
        data(){
            return {
                // loginState 登入角色
                loginState:false,  // true:门店 false:财务
                // 票据状态变量
                STATE,
                // 列表数据
                tableData: [{
                    a0:'1',
                    a1:'201809301289',
                    a2:'SK201809301289',
                    a3:'SJ201809301289',
                    a4:'汉街二路289号 1栋2单元',
                    a5:'陈晓东',
                    a6:'已开票',
                    a7:'张明明',
                    a8:'东野圭吾',
                    a9:'汉街二店',
                    a10:'5000',
                    a11:'2018/09/30 12:00',
                    a12:'2',
                    a13:'陈晓茹',
                    a14:'2018/09/30 12:00',
                    a15:'2018/09/30 12:00',
                    a16:'2018/09/30 12:00',
                    a17:'2018/09/30 12:00',
                    a18:'写错了抬头',
                    a19:'陈晓玲',
                    a20:'2018/08/09 17:22',
                    // state 票据状态
                    paperState:0,    // 0:已开票 1:已作废 2:已回收 3:已核销
                },],
                // 筛选条件
                propForm:{
                    region:'',
                    regionName:'',
                    search:'',
                    paper:'选项1',
                    time:'选项11',
                    dateMo:'',
                },
                // 筛选选项
                rules:{
                    region:[{
                        label:"区域一",
                        value:"shanghai"
                    },
                    {
                        label:"区域二",
                        value:"quyuer"
                    }],
                    regionName:[{
                        label:"区域一",
                        value:"shangha"
                    },
                    {
                        label:"区域二",
                        value:"quyue"
                    },],
                    paper:[{
                        label:"全部",
                        value:"选项1"
                    },
                    {
                        label:"区域二",
                        value:"选项2"
                    }],
                    time:[{
                        label:"开票日期",
                        value:"选项11"
                    },
                    {
                        label:"区域二",
                        value:"选项21"
                    }]
                },
                // 搜索展示内容
                restaurants:[{
                    "value": "1111111",
                }],
                // 作废弹层输入框
                invalidMax:150,
                invalidInput:'',
                // 弹层
                 layer:{
                    show:false,
                }
            }
        },
        computed:{
           invalidNumber(){
               return this.invalidInput.length
           } 
        },
        methods:{
            // 作废
            invalidFn(){
                this.layer = {
                    show:true,
                    tit:'票据作废',
                    proWidth:'740px',
                    rabbet:true,
                    center:false,
                }
            },
            // 回收
            irecyclingFn(){
                this.layer = {
                    show:true,
                    tit:'票据回收',
                    msg:'确认要收回该票据吗？'
                }
            },
            // 核销
            cancelFn(){
                this.layer = {
                    show:true,
                    tit:'票据核销',
                    msg:'确认要核销该票据吗？',
                }
            },
            // 开票
            startFn(){
                console.log('开票')
            },
            // 合同编号
            contractFn(){
                console.log('合同编号')
            },
            // 票据编号
            paperFn(){
                console.log('票据编号')
            },
            // 收款ID
            collectionFn(){
                console.log('收款ID')
            },
            // 重置
            resetFormFn() {
                this.$refs.propForm.resetFields()
            },
            // 查询
            queryFn(){
                console.log('查询')
            },
            // 部门筛选回调
            regionChangeFn(e){
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
            // 弹层关闭
            propCloseFn(){
                this.layer.show = !this.layer.show  
            }
        },
        components:{
            ScreeningTop
        }
    }
</script>

<style lang="less" scoped>
@import "~@/assets/less/lsx.less";
</style>