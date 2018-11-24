<!-- 意向详情金 -->
<template>
    <div class="newintention" id="intention" >
        <div class="detailbox" >
           <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="意向金详情" name="first" class="first-tab">
                    <div class="tab" :style="{ height: clientHeight() }">
                        <ul class="ul2">
                            <li class="tabs-title">合同信息</li>
                            <ul class="ul3">
                                <li>
                                    <div class="div1"><span>签约日期：</span>{{detailData.signDate | getDate}}</div>
                                    <div class="div2"><span>认购期限：</span>{{detailData.subscriptionTerm | getDate}}</div>
                                </li>
                                <li>
                                    <div class="div1"><span>合同类型：</span>{{detailData.contType.label | nullData}}</div>
                                    <div class="div2"><span>认购总价：</span>{{detailData.subscriptionPrice | nullData}}元</div>
                                    <div v-if="this.detailData.contType.value == 4"><span>意向金金额：</span><span class="yellow mr12">{{detailData.dealPrice | nullData}}元</span><span class="chinesemoney yellow">{{detailData.dealPrice | moneyFormat}}</span></div>
                                    <div v-if="this.detailData.contType.value == 5"><span>定金金额：</span><span class="yellow mr12">{{detailData.dealPrice | nullData}}元</span><span class="chinesemoney yellow">{{detailData.dealPrice | moneyFormat}}</span></div>
                                </li>
                            </ul>
                        </ul>
                        <ul class="ul2">
                            <li class="tabs-title">房源信息</li>
                            <ul class="ul3">
                                <li>
                                    <div class="div1"><span>房源编号：</span><em class="blue">{{detailData.houseinfoCode | nullData}}</em></div>
                                    <div class="div22"><span>物业地址：</span>{{detailData.propertyAddr | nullData}}</div>
                                </li>
                                <li>
                                    <div class="div1"><span>房源价格：</span>{{detailData.houseInfo.price | nullData}}元</div>
                                    <div class="div2"><span>建筑面积：</span>{{detailData.houseInfo.architectureArea | nullData}}㎡</div>
                                    <div class="div3"><span>套内面积：</span>{{detailData.houseInfo.insideArea | nullData}}㎡</div>
                                    <div><span>用途：</span>{{detailData.houseinfoPurpose | nullData}}</div>
                                </li>
                                <li>
                                    <div class="div1"><span>房型：</span>{{detailData.houseInfo.houseType | nullData}}</div>
                                    <div class="div2"><span>朝向：</span>{{detailData.houseInfo.orientation | nullData}}</div>
                                    <div class="div3"><span>装修：</span>{{detailData.houseInfo.renovation | nullData}}</div>
                                    <div><span>业主姓名：</span>{{custInfo[0].name | nullData}}</div>
                                </li>
                                <li>
                                    <div class="div1"><span>手机：</span>{{custInfo[0].mobile | nullData}}</div>
                                    <div><span>产证地址：</span>{{detailData.houseInfo.propertyRightAddr | nullData}}</div>
                                </li>
                            </ul>
                        </ul>
                        <ul class="ul2">
                            <li class="tabs-title">客源信息</li>
                            <ul class="ul3">
                                <li>
                                    <div class="div1"><span>客源编号：</span><em class="blue">{{detailData.guestinfoCode | nullData}}</em></div>
                                    <div><span>成交经纪人：</span>{{detailData.dealAgentStoreName + '-' + detailData.dealAgentName | nullData}}</div>
                                    
                                </li>
                                <li>
                                    <div class="div1"><span>业主姓名：</span>{{ownerInfo[0].name | nullData}}</div>
                                    <div class="div2"><span>手机：</span>{{ownerInfo[0].mobile | nullData}}</div>
                                    <div><span>身份证号：</span>{{ownerInfo[0].identifyCode | nullData}}</div>
                                </li>
                            </ul>
                        </ul>
                        <div class="textbox" v-if="this.detailData.contType.value == 4">
                            <span>意向备注：</span>
                            <el-input type="textarea" class="textareawidth" :disabled="true" v-model="detailData.remarks"></el-input>
                        </div>
                    </div>
                    <div class="fixed">
                        <div class="form-btn">
                            <div class="btnbox"> 
                                <div class="fl">
                                    <ul>
                                        <li>录入时间：<span>{{detailData.createTime | getDate}}</span></li>
                                        <li>录入人：<span>{{detailData.recordName}}</span></li>
                                        <li>最后修改：<span>{{detailData.updateTime | getDate}}</span></li>
                                    </ul>
                                </div>
                                <div class="fr">                  
                                    <el-button type="primary" plain round class="btn1" @click="onPreview()">预 览</el-button>
                                    <el-button type="primary" round class="mr30 btn2" @click="onEdit(detailData.contType)">编 辑</el-button>                  
                                </div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="合同主体" name="second">
                    <div class="hetong">
                        <el-upload
                            action="https://jsonplaceholder.typicode.com/posts/"
                            list-type="picture-card"
                            multiple
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove">
                            <i class="iconfont icon-shangchuan"></i>
                            <span>点击上传</span>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="资料库" name="third" class="third-tab">
                    <div class="hetong2">
                        <div class="ht-col">
                            <div class="ht-title">卖方</div>
                            <div class="small-col">
                                <div class="small-title"><span>*</span>身份证复印件</div>
                                <div class="upbox">
                                    <el-upload
                                        action="https://jsonplaceholder.typicode.com/posts/"
                                        list-type="picture-card"
                                        multiple
                                        :on-preview="handlePictureCardPreview"
                                        :on-remove="handleRemove">
                                        <i class="iconfont icon-shangchuan"></i>
                                        <span>点击上传</span>
                                    </el-upload>
                                    <el-dialog :visible.sync="dialogVisible">
                                        <img width="100%" :src="dialogImageUrl" alt="">
                                    </el-dialog>
                                </div>
                            </div>
                            <div class="small-col">
                                <div class="small-title"><span>*</span>资料</div>
                                <div class="upbox">
                                    <el-upload
                                        action="https://jsonplaceholder.typicode.com/posts/"
                                        list-type="picture-card"
                                        multiple
                                        :on-preview="handlePictureCardPreview"
                                        :on-remove="handleRemove">
                                        <i class="iconfont icon-shangchuan"></i>
                                        <span>点击上传</span>
                                    </el-upload>
                                    <el-dialog :visible.sync="dialogVisible">
                                        <img width="100%" :src="dialogImageUrl" alt="">
                                    </el-dialog>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="hetong2">
                        <div class="ht-col">
                            <div class="ht-title">买方</div>
                            <div class="small-col">
                                <div class="small-title"><span>*</span>身份证复印件</div>
                                <div class="upbox">
                                    <el-upload
                                        action="https://jsonplaceholder.typicode.com/posts/"
                                        list-type="picture-card"
                                        multiple
                                        :on-preview="handlePictureCardPreview"
                                        :on-remove="handleRemove">
                                        <i class="iconfont icon-shangchuan"></i>
                                        <span>点击上传</span>
                                    </el-upload>
                                    <el-dialog :visible.sync="dialogVisible">
                                        <img width="100%" :src="dialogImageUrl" alt="">
                                    </el-dialog>
                                </div>
                            </div>
                            <div class="small-col">
                                <div class="small-title"><span>*</span>购房合同</div>
                                <div class="upbox">
                                    <el-upload
                                        action="https://jsonplaceholder.typicode.com/posts/"
                                        list-type="picture-card"
                                        multiple
                                        :on-preview="handlePictureCardPreview"
                                        :on-remove="handleRemove">
                                        <i class="iconfont icon-shangchuan"></i>
                                        <span>点击上传</span>
                                    </el-upload>
                                    <el-dialog :visible.sync="dialogVisible">
                                        <img width="100%" :src="dialogImageUrl" alt="">
                                    </el-dialog>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="hetong2">
                        <div class="ht-col">
                            <div class="ht-title">其他</div>
                            <div class="small-col">
                                <div class="upbox">
                                    <el-upload
                                        action="https://jsonplaceholder.typicode.com/posts/"
                                        list-type="picture-card"
                                        multiple
                                        :on-preview="handlePictureCardPreview"
                                        :on-remove="handleRemove">
                                        <i class="iconfont icon-shangchuan"></i>
                                        <span>点击上传</span>
                                    </el-upload>
                                    <el-dialog :visible.sync="dialogVisible">
                                        <img width="100%" :src="dialogImageUrl" alt="">
                                    </el-dialog>
                                </div>
                            </div>                           
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>


            
        </div>
       
            
    </div>
    
</template>

<script>
import {TOOL} from "@/assets/js/common";
// import {FILTER} from "@/assets/js/filter";
export default {

    data() {
        return {
            clientHei: document.documentElement.clientHeight, //窗体高度
            activeName: 'first',
            dialogImageUrl: '',
            dialogVisible: false,
            detailData: {
                contType: {
                    label: '',
                    value: ''
                },
                houseInfo: {},
                guestInfo: {},
                contPersons: [
                    {
                        name: '',
                        mobile: '',
                        identifyCode: '',
                        personType:{
                            label: '',
                            value: ''
                        }
                    }
                ],
                
            },
            ownerInfo:[
                {
                    name: '',
                    mobile: '',
                    identifyCode: '', 
                }
            ],
            custInfo: [
                {
                    name: '',
                    mobile: '',
                    identifyCode: '', 
                }
            ],
        }
    },
    
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },

        // 控制弹框body内容高度，超过显示滚动条
        clientHeight() {        
            return this.clientHei - 285 + 'px'
        },

        //预览事件
        onPreview() {
            this.$router.push({
                path:'/contractPreview',
                query:{
                    // contractCode: value.contractCode
                }
            })
        },

        //预览事件
        onEdit(e) {
            this.$router.push({
                path:'/editIntention',
                query:{
                    contType: e.value,
                    id: this.$route.query.id 
                }
            })
        },

        // 查询
       getDetail() {
          let param = {
            id: this.$route.query.id                        
          }
          //调整佣金审核列表
          this.$ajax         
          .get("/api/contract/getById", param)
          .then(res => {
           
            let data = res.data;
            if (res.status === 200) {
                this.detailData = data.data
                var contperson = this.detailData.contPersons
                if (contperson.length > 0) {
                    for (let i=0; i < contperson.length; i++){
                        if (contperson[i].personType.value == 1){
                            this.ownerInfo.unshift(contperson[i])
                        }else if(contperson[i].personType.value == 2){
                            this.custInfo.unshift(contperson[i])
                        }
                    }
                }
                // console.log(this.detailData)
                // console.log(this.ownerInfo)
                // console.log(this.custInfo)
            }
            
          }).catch(error => {
            console.log(error)
          })
      },
       
    },

    filters: {
        getDate(val) {
            return TOOL.dateFormat(val);
        },
        nullData(val) {
            return TOOL.nullFormat(val);
        },
        moneyFormat: function(val) {
            if (!val) {
                return "零";
            } else {
                return TOOL.toChineseNumber(val);
            }
        }
    },

    created() {
        this.getDetail()
    },

    mounted() {
      var _this = this;
       window.onresize = function(){
         _this.clientHei = document.documentElement.clientHeight;
       }
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
    .el-upload--picture-card{
        background-color: #fff;
        border: 2px dashed #DEDDE2;
        border-radius: 6px;
        line-height: 40px;
        padding-top: 32px;
        width: 140px;
        height: 140px;
        i{
            color: #EEF2FB;
            font-size: 56px;
        }
        span{
            display: block;
            text-align: center;
            color: #32485F;
        }
    }
    .el-upload-list--picture-card .el-upload-list__item{
        margin: 0 20px 20px 0;
        width: 140px;
        height: 140px;
    }
    
    .detailbox{
        padding: 20px 0 0px;
        border-radius: 4px;
        height: 100%;
        .el-tabs--top{
            height: 100%;
            .el-tabs__content{
                height: 100%;
                overflow-y: auto;
            }
        }
        .tab{
            padding: 10px 30px;
            overflow-y: auto;
            .textbox{
                display: flex;
                margin-bottom: 20px;
                span{
                    color: #6C7986;
                    font-size: 14px;
                    width: 70px;
                    white-space: nowrap;
                }
                .el-textarea{
                    width: 650px;
                    height: 80px;
                    margin-left: 15px;
                }
                .el-textarea.is-disabled .el-textarea__inner{
                    height: 80px;
                }
            }
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
                        em.blue{
                            color: #478DE3;
                            font-weight: 700;
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
                            span.yellow{
                                color: #FF9039;
                            }
                            span.mr12{
                                margin-right: 12px;
                            }
                            .div1{
                                width: 210px;
                            }
                            .div2{
                                width: 200px;
                            }
                            .div3{
                                width: 200px;
                            }
                        }
                    }
                    
                    li.tabs-title{
                        margin-right: 30px;
                        margin-bottom: 20px;
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
                .el-button.is-round{
                    padding: 11px 23px;
                    width: 100px;
                }
                .btn1{
                    background-color: #EAEFF5;
                    color: #32485F;
                    border: 1px solid #EAEFF5;
                } 
                .btn2{
                    background-color: #478DE3;
                } 
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
        // 合同主体
        .hetong{
            padding: 30px 30px 130px 40px;
            background-color: #fff;
            height: 100%;
        }
        .third-tab{
           padding: 20px 30px 130px 40px; 
        }
        .hetong2{
            margin-bottom: 30px;
            border-bottom: 1px solid #EDECF0;
            padding-bottom: 15px;
            .ht-title{
                color: #32485F;
                font-size: 16px;
                margin-bottom: 15px;               
            }
            .small-col{
                margin-bottom: 20px;
                .small-title{
                    font-size: 14px;
                    color: #6C7986;
                    margin-bottom: 15px;
                    span{
                        color: #FF3E3E;
                        
                    }
                }
            }
            
        }
        
    }
}
    
</style>


