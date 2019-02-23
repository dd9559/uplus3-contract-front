<template>
    <div class="container">
        <div class="cont-info border-b">
            <p class="bold">合同基本信息</p>
            <div class="cont-content text">
                <p>签约日期：<span></span></p>
                <p>合同编号：<span style="color:#478DE3;font-weight:bold"></span></p>
                <p>交易类型：<span></span></p>
                <p>房屋总价：<span></span></p>
                <p>应收佣金：<span></span></p>
            </div>
        </div>
        <div class="house-info border-b">
            <p class="bold">房屋基本信息</p>
            <div class="house-content">
                <div class="item">
                    <div class="mark">
                        <span>两证情况：</span>
                        <el-select size="small">
                            <el-option>合同</el-option>
                            <el-option>两证</el-option>
                            <el-option>不动产</el-option>
                        </el-select>
                    </div>
                    <div class="mark">
                        <span>抵押情况：</span>
                        <el-select size="small">
                            <el-option></el-option>
                        </el-select>
                    </div>
                    <div class="mark">
                        <span>提前还款：</span>
                        <el-select size="small">
                            <el-option></el-option>
                        </el-select>
                    </div>
                    <div class="square mark">
                        <span class="text">建筑面积：<span></span></span>
                    </div>
                    <div class="position">
                        <span class="use">土地使用权面积：</span>
                        <el-input size="small"></el-input>
                        <i>㎡</i>
                    </div>
                    <div>
                        <span>土地性质：</span>
                        <el-select size="small">
                            <el-option></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <div class="text-long mark">
                        <span class="text">物业地址：<span></span></span>
                    </div>
                    <div class="number mark">
                        <span>权属证号：</span>
                        <el-input size="small"></el-input>
                    </div>
                </div>
                <div class="item">
                    <div class="position">
                        <span>缴纳税费：</span>
                        <el-input size="small"></el-input>
                        <i>万元</i>
                    </div>
                    <div class="position">
                        <span class="floor">房屋总楼层：</span>
                        <el-input size="small"></el-input>
                        <i>层</i>
                    </div>
                    <div>
                        <span>建筑结构：</span>
                        <el-input size="small"></el-input>
                    </div>
                    <div class="position">
                        <span>评估值：</span>
                        <el-input size="small"></el-input>
                        <i>万元</i>
                    </div>
                </div>
            </div>
        </div>
        <div class="house-from resource resource-info">
            <div>
                <p class="bold">客源方信息</p>
                <div class="info text">
                    <p>店长：<span></span></p>
                    <p>门店：<span></span></p>
                    <p>联系电话：<span></span></p>
                </div>
            </div>
            <div>
                <p class="bold">房源方信息</p>
                <div class="info text">
                    <p>店长：<span></span></p>
                    <p>门店：<span></span></p>
                    <p>联系电话：<span></span></p>
                </div>
            </div>
        </div>
        <div class="house-person resource resource-info">
            <div>
                <p class="bold">买方信息</p>
                <div class="guest msg info">
                    <div class="text">
                        <p>姓名：<span></span></p>
                        <p>身份证：<span></span></p>
                        <p>电话：<span></span></p>
                    </div>
                    <div class="text">
                        <p>共有人姓名：<span></span></p>
                        <p>电话：<span></span></p>
                    </div>
                    <div class="input">
                        <p>
                            <span>付款方式：</span>
                            <el-select size="small"></el-select>
                        </p>
                        <p>
                            <span>交易流程：</span>
                            <el-select size="small"></el-select>
                        </p>
                        <p>
                            <span>按揭银行：</span>
                            <el-select size="small"></el-select>
                        </p>
                    </div>
                    <div class="input">
                        <p>
                            <span>贷款金额：</span>
                            <el-input size="small"></el-input>
                            <span>万</span>
                        </p>
                        <p>
                            <span>贷款期限：</span>
                            <el-input size="small"></el-input>
                            <span>年</span>
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <p class="bold">卖方信息</p>
                <div class="owner msg info">
                    <div class="text">
                        <p>姓名：<span></span></p>
                        <p>身份证：<span></span></p>
                        <p>电话：<span></span></p>
                    </div>
                    <div class="text">
                        <p>共有人姓名：<span></span></p>
                        <p>电话：<span></span></p>
                    </div>
                    <div class="input">
                        <p class="mark" style="margin-right:10px;">
                            <span>是否析产（继承）：</span>
                            <el-select size="small"></el-select>
                        </p>
                        <p>
                            <span>婚姻状况：</span>
                            <el-select size="small"></el-select>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="agent resource">
            <div>
                <p class="bold">代理人信息</p>
                <div class="agent-info info">
                    <p>
                        <span>代理人姓名：</span>
                        <el-input size="small" class="w100"></el-input>
                        <el-select size="small" class="w100"></el-select>
                        <el-input size="small" class="w200"></el-input>
                    </p>
                    <p>
                        <span>电话：</span>
                        <el-input size="small" class="w200"></el-input>
                    </p>
                </div>
            </div>
            <div>
                <p class="bold">代理人信息</p>
                <div class="agent-info info">
                    <p>
                        <span>代理人姓名：</span>
                        <el-input size="small" class="w100"></el-input>
                        <el-select size="small" class="w100"></el-select>
                        <el-input size="small" class="w200"></el-input>
                    </p>
                    <p>
                        <span>电话：</span>
                        <el-input size="small" class="w200"></el-input>
                    </p>
                </div>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button class="confirmBtn">保存</el-button>
            <el-button class="cancelBtn">取消</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        contractDetail: Object,
        id: String
    },
    data() {
        return {

        }
    },
    created() {
    }
}
</script>

<style scoped lang="less">
@import "~@/assets/common.less";

.container {
    color: @color-6c;
    .bold {
        font-weight: bold;
        color: @color-blank;
        margin-bottom: 10px;
    }
    .border-b {
        border-bottom: 1px solid #EDECF0;
    }
    .text {
        p {
            display: flex;
            align-items: center;
            &::before {
                content: "*";
                color: red;
                position: relative;
                top: 3px;
            }
        }
        span {
            color: @color-blank;
        }
    }
    .text-long {
        min-width: 410px;
    }
    .number {
        .el-input {
            min-width: 330px;
        }
    }
    .square {
        min-width: 120px;
    }
    .mark::before {
        content: "*";
        color: red;
        position: relative;
        top: 10px;
    }
    .position {
        i {
            min-width: 28px;
            line-height: 32px;
        }
    }
}

.cont-info {
    margin: 20px 0 10px 0;
    .cont-content {
        display: flex;
        margin-bottom: 10px;
        p {
            margin-right: 10px;
            min-width: 200px;
        }
    }
}

.house-info {
    margin-bottom: 10px;
    .house-content {
        margin-bottom: 10px;
        .item {
            display: flex;
            > div {
                display: flex;
                margin: 0 20px 5px 0;
                > span {
                    min-width: 70px;
                    line-height: 32px;
                    text-align: right;
                    &.use {
                        min-width: 112px;
                    }
                    &.floor {
                        min-width: 84px;
                    }
                }
                .el-select {
                    max-width: 120px;
                }
                .el-input {
                    max-width: 120px;
                }
            }
        }
    }
}

.resource {
    display: flex;
    > div {
        min-width: 35%;
        border: 1px solid #ebeef5;
        margin-right: 20px;
        > p {
            border-bottom: 1px solid #ebeef5;
            text-align: center;
            background-color: #EEF2FB;
            line-height: 30px;
        }
        .info {
            padding-left: 10px;
            margin-bottom: 10px;
        }
    }
    &-info {
        p {
            min-width: 33.33%;
        }
    }
}
.house-from {
    .info {
        display: flex;
    }
}
.house-person {
    margin: 10px 0;
    .guest,
    .owner {
        > div {
            display: flex;
            margin-bottom: 10px;
            > p {
                display: flex;
            }
        }
    }
    .guest {
        .input {
            span {
                min-width: 70px;
            }
        }
    }
    .msg {
        .input {
            span {
                line-height: 32px;
            }
            .el-select {
                max-width: 120px;
            }
            .el-input {
                max-width: 120px;
            }
        }
    }
}

.agent {
    .agent-info p {
        display: flex;
        margin-bottom: 10px;
        span {
            min-width: 84px;
            text-align: right;
            line-height: 32px;
        }
        .w100 {
            width: 100px;
            margin-right: 10px;
        }
        .w200 {
            width: 200px;
        }
    }
}

.dialog-footer {
    width: 70%;
    margin-top: 20px;
    text-align: center;
}
.confirmBtn {
    width: 100px;
    height: 38px;
    border-radius: 18px;
    background-color: #478DE3;
    color: #fff;
}
.cancelBtn {
    background-color: #fff;
    width: 100px;
    height: 38px;
    border-radius: 18px;
    border-color: #478DE3;
    color: #478DE3;
}
</style>