<template>
    <div class="container">
        <div class="box" :style="{ height: clientHei }">
        <div class="msg">
            <div class="title">合同信息</div>
            <div class="content">
                <div class="one_">
                    <p>
                        <span>合同编号：</span>
                        <span class="color-blue">{{defaultInfo.code}}</span>
                    </p>
                    <p>
                        <span>合同类型：</span>
                        <span v-if="defaultInfo.contType.value===2">买卖</span>
                        <span v-if="defaultInfo.contType.value===3">代办</span>
                    </p>
                </div>
                <div class="one_ input-val">
                    <p>
                        <span><i>*</i>签约时间：</span>
                        <el-date-picker
                        style="width:180px"
                        size="small"
                        v-model="signDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                        :picker-options="pickerOptions"
                        default-time="12:00:00">
                        </el-date-picker>
                    </p>
                    <p>
                        <span><i>*</i>交易服务费(元)：</span>
                        <el-input placeholder="请输入" size="small" class="w140" v-model="tradeFee" @input="cutNumber"></el-input>  
                    </p>
                </div>
            </div>
        </div>
        <div class="msg">
            <div class="title">房源信息</div>
            <div class="content">
                <div v-for="(item,i) in houseArr" :key="i" class="one_">
                    <p>
                        <span>{{i==0?'业主':'共有人'}}姓名：</span>
                        <span>{{item.name}}</span>
                    </p>
                    <p>
                        <span>{{i==0?'业主':'共有人'}}电话：</span>
                        <span>{{item.mobile}}</span>
                    </p>
                    <p>
                        <span>{{i==0?'':'共有人'}}证件号码：</span>
                        <span>{{item.encryptionCode}}</span>
                    </p>
                </div>
                <div class="one_">
                    <p>
                        <span>房源编号：</span>
                        <span class="color-blue">{{defaultInfo.houseinfoCode}}</span>
                    </p>
                    <p>
                        <span>建筑面积：</span>
                        <span>{{defaultInfo.houseInfo.Square}} m²</span>
                    </p>
                    <p>
                        <span>套内面积：</span>
                        <span>{{defaultInfo.houseInfo.SquareUse}} m²</span>
                    </p>
                </div>
                <div class="one_">
                    <p>
                        <span>物业地址：</span>
                        <span>{{defaultInfo.propertyAddr}}</span>
                    </p>
                    <p>
                        <span>产权地址：</span>
                        <span>{{defaultInfo.propertyRightAddr}}</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="msg">
            <div class="title">客源信息</div>
            <div class="content">
                <div v-for="(item,i) in guestArr" :key="i" class="one_">
                    <p>
                        <span>{{i==0?'客户':'共有人'}}姓名：</span>
                        <span>{{item.name}}</span>
                    </p>
                    <p>
                        <span>{{i==0?'客户':'共有人'}}电话：</span>
                        <span>{{item.mobile}}</span>
                    </p>
                    <p>
                        <span>{{i==0?'':'共有人'}}证件号码：</span>
                        <span>{{item.encryptionCode}}</span>
                    </p>
                </div>
                <div class="one_">
                    <p>
                        <span>客源编号：</span>
                        <span class="color-blue">{{defaultInfo.guestinfoCode}}</span>
                    </p>
                </div>
            </div>
        </div>
        </div>
        <div class="btn">
            <el-button type="primary" round @click="isSave" v-loading.fullscreen.lock="fullscreenLoading">保存并进入下一步</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        defaultInfo: {
            type: Object,
            default: function() {
                return {}
            }
        }
    },
    data() {
        return {
            clientHei: "",
            signDate: "",
            tradeFee: "",
            houseArr: [], //业主信息
            guestArr: [], //客户信息
            //日期选择器禁止选择未来时间
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            fullscreenLoading: false
        }
    },
    created() {
        this.clientHei= document.documentElement.clientHeight -190 + 'px'
        // let _date = this.defaultInfo.contractEntrust.signDate
        // if(_date){
        //     this.signDate = _date
        // }else{
        //     this.getNewData()
        // }
        // this.tradeFee = this.defaultInfo.contractEntrust.tradeFee
        this.houseArr = this.defaultInfo.contPersons.filter(item => item.personType.value === 1)
        this.guestArr = this.defaultInfo.contPersons.filter(item => item.personType.value === 2)
    },
    methods: {
        //获取当前日期
        getNewData(){
            let time = new Date()
            let y = time.getFullYear()
            let M = time.getMonth() + 1
            let D = time.getDate()
            let h = time.getHours()
            let m = time.getMinutes()
            let s = time.getSeconds()
            let _time = `${y}-${M > 9 ? M : '0' + M}-${D > 9 ? D : '0' + D} ${h > 9 ? h : '0' + h}:${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`;
            this.signDate = _time
        },
        cutNumber() {
            this.$nextTick(()=>{
                this.tradeFee = this.$tool.cutFloat({val:this.tradeFee,max:999999999.99})
            })
        },
        isSave() {
            if(!this.signDate){
                this.$message("签约时间不能为空")
                return
            }
            if(this.tradeFee == ''){
                this.$message("交易服务费不能为空")
                return
            }
            this.fullscreenLoading = true
            this.$ajax.post('/api/contract/entrust/addContract', {
                signDate: this.signDate,
                tradeFee: this.tradeFee,
                id: this.defaultInfo.id
            }).then(res => {
                res = res.data
                if(res.status === 200){
                    this.fullscreenLoading = false
                    let contractMsg = res.data
                    sessionStorage.setItem("contractMsg", JSON.stringify(contractMsg))
                    this.$router.push({
                        path: "/extendParams"
                    })
                }
            }).catch(error => {
                this.fullscreenLoading = false
                this.$message({
                    message:error,
                    type: "error"
                })
            })
        }
    }
}
</script>

<style lang="less" scoped>
    @import "~@/assets/common.less";
    .msg {
        display: flex;
        padding: 20px 0 20px 0;
        .title {
            width: 70px;
            font-weight: bold;
            color: @color-blank;
            white-space: nowrap;
        }
        .content {
            padding-left: 10px;
            .one_ {
                margin-bottom: 20px;
                &:last-of-type {
                    margin-bottom: 0;
                }
                > p {
                    width: 300px;
                    display: inline-block;
                }
                &.input-val {
                    display: flex;
                    align-items: center;
                    i {
                        color: red;
                    }
                }
            }
        }
        .color-blue {
            color: #478DE3;
            font-weight: bold;
        }
        &:nth-child(-n+2) {
            border-bottom: 1px solid @border-ED;
        }
    }
    .btn {
        text-align: right;
        padding-right: 10px;
    }
</style>