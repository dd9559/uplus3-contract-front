<!-- 意向详情金 -->
<template>
    <div class="newintention" id="intention" >
        <div class="detailbox" >
           <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="意向金详情" name="first" class="first-tab">
                    <div class="tab" :style="{ height: screenHeight }">
                        <ul class="ul1">
                            <li class="tabs-title">合同信息</li>
                            <li>
                                <div><span>签约日期：</span>2018/11/07</div>
                                <div><span>认购期限：</span>2018/11/07</div>
                            </li>
                            <li>
                                <div><span>合同类型：</span>意向金</div>
                                <div><span>认购总价：</span>10000元</div>
                            </li>
                            <li>
                                <div><span>意向金金额：</span>10000元<span>一万元整</span></div>
                            </li>
                        </ul>
                        <ul class="ul2">
                            <li class="tabs-title">房源信息</li>
                            <ul class="ul3">
                                <li>
                                    <div class="div1"><span>房源编号：</span>YGYH001163</div>
                                    <div class="div22"><span>物业地址：</span>当代国际花园当代国际花园</div>
                                </li>
                                <li>
                                    <div class="div1"><span>房源价格：</span>200000元</div>
                                    <div class="div2"><span>建筑面积：</span>155.21㎡</div>
                                    <div class="div3"><span>套内面积：</span>155.21㎡</div>
                                    <div class="div4"><span>用途：</span>住宅</div>
                                </li>
                                <li>
                                    <div class="div1"><span>房型：</span>3*2*2*1</div>
                                    <div class="div2"><span>朝向：</span>东南</div>
                                    <div class="div3"><span>装修：</span>简装</div>
                                    <div class="div4"><span>业主姓名：</span>夏雨田</div>
                                </li>
                                <li>
                                    <div class="div1"><span>手机：</span>15527279348</div>
                                    <div><span>产证地址：</span>当代国际花园当代国际花园</div>
                                </li>
                            </ul>
                        </ul>
                        <ul class="ul1">
                            <li class="tabs-title">客源信息</li>
                            <li>
                                <div><span>客源编号：</span>YGYH001163</div>
                                <div><span>业主姓名：</span>夏雨田</div>
                            </li>
                            <li>
                                <div><span>成交经纪人：</span>当代一店·夏雨田</div>
                                <div><span>手机：</span>15524245689</div>
                            </li>
                            <li>
                                <div><span>身份证号：</span>42112548775845221</div>
                            </li>
                        </ul>
                    </div>
                    <div class="fixed">
                        <div class="form-btn">
                            <div class="btnbox"> 
                                <div class="fl">
                                    <ul>
                                        <li>录入时间：<span>2018/09/11 12:00</span></li>
                                        <li>录入人：<span>当代一店·夏雨田</span></li>
                                        <li>最后修改：<span>2018/09/11 12:00</span></li>
                                    </ul>
                                </div>
                                <div class="fr">                  
                                    <el-button type="primary" plain round>预 览</el-button>
                                    <el-button type="primary" round class="mr30">保 存</el-button>                  
                                </div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="合同主体" name="second">合同主体</el-tab-pane>
                <el-tab-pane label="资料库" name="third">资料库</el-tab-pane>
            </el-tabs>


            
        </div>
       
            
    </div>
    
</template>

<script>

export default {

    data() {
        return {
            activeName: 'first',           
        }
    },
    components:{
       
    },
    computed: {
        
        screenHeight() {
            return document.documentElement.clientHeight - 285 + 'px'
        },
        
    },
   
        
    

    methods: {
       handleClick(tab, event) {
        console.log(tab, event);
       },
       
    },
    
}
</script>

<style lang="less">
#intention{
    overflow: hidden;
    background-color: #fff;
    .el-tabs__item{
        height: 50px;
        line-height: 50px;
        font-size: 16px;
    }
    .el-tabs__active-bar{
        height: 2px;
    }
    .el-tabs__nav-scroll{
        padding: 0 30px;
    }
    
    .detailbox{
        padding: 20px 0 0px;
        border-radius: 4px;
        height: 100%;
        .el-tabs--top{
            height: 100%;
            .el-tabs__content{
                height: 100%;
            }
        }
        .tab{
            padding: 10px 30px;
            overflow-y: auto;
            .ul1{
                    display: flex;
                    align-items: top; 
                    clear: both;
                    border-bottom: 1px solid #EDECF0;
                    margin:10px 0 30px 0;
                    padding-bottom: 10px;     
                }
            ul{
                                      
                li{
                    margin-right: 100px;
                    div{
                        font-size: 14px;
                        margin-bottom: 20px;
                        color:#233241;
                        span{
                            color: #6C7986;
                        }
                    }
                }
                li.tabs-title{
                    color: #233241;
                    font-size: 14px;
                    font-weight: bold;
                    margin-right: 30px;
                }
                &.ul2{
                    display: block;
                    overflow: hidden;
                    border-bottom: 1px solid #EDECF0;
                    margin:10px 0 30px 0;
                    padding-bottom: 10px;   
                    .ul3{
                        float: left;
                        overflow: hidden;
                        border-bottom: none;
                        li{
                            margin-right: 0;
                            overflow: hidden;
                            clear: both;
                            display: flex;
                            .div1{
                                width: 240px;
                            }
                            .div2{
                                width: 230px;
                            }
                            .div3{
                                width: 230px;
                            }
                            .div4{
                                width: 200px;
                            }
                        }
                    }
                    
                    li.tabs-title{
                        margin-right: 30px;
                        float: left;
                    }
                    
                }
            }
        }
        .fixed{
            width: 100%;
        }
        .form-btn{
            overflow: hidden;
            border-top: 1px solid #EDECF0;
            background-color: #fff;
            height: 80px;
            line-height: 80px;
            .btnbox{
                // position: fixed;
                bottom: 0;
                display: flex;
                justify-content: space-between;
                align-items: center;  
            }
            .fl{
                overflow: hidden;
                left: 20px;
                li{
                    &.first-child{
                        margin-left: 30px;
                    }
                    float: left;
                    margin-left: 20px;
                    font-size: 12px;
                    color: #6C7986;
                    span{
                        color: #32485F;
                    }
                }
            }
            .fr{
                right: 20px;
                .mr30{
                    margin-right: 30px;
                }
            }
        }
        
    }
}
    
</style>


