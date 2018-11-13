<template>
    <el-dialog title="开票信息填写" :visible.sync="comShow" width="1000px" class="layer-paper">
        <div class="layer-mesage">
            <ul class="ul">
                <li>
                    <span class="cl-1">合同编号：</span>
                    <span class="w-150">201809301289</span>
                </li>
                <li>
                    <span class="cl-1">物业地址：</span>
                    <span class="w-600">东湖开发区安逸小区12幢4单元806</span>
                </li>
            </ul>
            <ul class="ul">
                <li>
                    <span class="cl-1">交款单位：</span>
                    <span class="w-150">张小茹</span>
                </li>
                <li>
                    <span class="cl-1">合计金额：</span>
                    <span>110000元</span>
                </li>
            </ul>
            <ul class="ul-mesage">
                <li v-for="item in checked" :key="item.name">
                    <el-row>
                        <el-col :span="5">
                            <el-checkbox v-model="item.tab">
                                <span class="cl-1">物业地址：</span>
                                <span class="cl-2">{{item.name}}</span>
                            </el-checkbox>
                        </el-col>
                        <el-col :span="4">
                            <span class="cl-1">金额：</span>
                            <span class="cl-2">{{item.money}}元</span>
                        </el-col>
                        <el-col :span="7">
                            <span class="cl-1">开票项目：</span>
                            <el-select v-model="item.val" size="small" class="w150">
                                <el-option 
                                v-for="ite in item.rules" 
                                :key="ite.value" 
                                :label="ite.label" 
                                :value="ite.value"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            <el-checkbox v-model="item.hide">
                                <span class="cl-1">隐藏物业地址</span>
                            </el-checkbox>
                        </el-col>
                        <el-col :span="4">
                            <span class="cl-1">票据编号：</span>
                            <span class="cl-2">{{item.number}}</span>
                        </el-col>
                    </el-row>
                </li>
            </ul>
            <div class="sure-btn">
                <el-button class="paper-btn paper-btn-blue" type="primary" size="medium" @click="sureFn" round>确定开票</el-button>
            </div>
            <div class="preview">
                <div class="preview-tit">票据预览</div>
                <div class="preview-ul">
                    <ul>
                        <li 
                        v-for="(item,index) in previewTit" 
                        :key="item" 
                        :class="previewIndex === index ?'on':''"
                        @click="tabClickFn(index)">{{item}}</li>
                    </ul>
                </div>
                <LayerPaperInfo 
                v-for="(item,index) in perviewMain"
                :key="item.number"
                :number="item.number"
                :name="item.name"
                :collectionTime="item.collectionTime"
                :invoiceTime="item.invoiceTime"
                :paper="item.paper"
                :project="item.project"
                :hide="item.hide"
                :address="item.address"
                :money="item.money"
                :moneyZh="item.moneyZh"
                :create="item.create"
                :rules="item.rules"
                v-show="previewIndex === index"
                ></LayerPaperInfo>
            </div>
        </div>
        <span slot="footer">
            <el-button class="paper-btn" type size="medium" @click="propCloseFn" round>取消</el-button>
            <el-button class="paper-btn paper-btn-blue" type="primary" size="medium" @click="printFn" round>打印</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import LayerPaperInfo from '@/components/LayerPaperInfo';
    export default {
        props: {
            show: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                comShow: this.show,
                checked:[{
                    tab:true,
                    name:'房款',
                    money:100000,
                    val:'',
                    rules:[{
                        label:'区域1',
                        value:'选项1'
                    }],
                    hide:false,
                    number:10086
                }],
                previewTit:['房款','佣金'],
                previewIndex:0,
                perviewMain:[{
                    number:'201809301289',
                    name:'房款',
                    collectionTime:'',
                    invoiceTime:'',
                    paper:'',
                    project:'',
                    hide:false,
                    address:'',
                    money:1000.01,
                    moneyZh:'',
                    create:'',
                    rules:''
                }]
            }
        },
        watch: {
            show(oldVal, newVal) {
                if (newVal === this.comShow) {
                    this.comShow = !newVal
                } else {
                    this.comShow = newVal;
                }
            }
        },
        methods: {
            // 取消
            propCloseFn() {
                this.comShow = !this.comShow;
            },
            //打印
            printFn(){
                // 是否有印章
                let src = this.perviewMain[this.previewIndex].imgSrc;
                if(src == '' || src == undefined){
                    this.$message.error('请先设置财务专用电子签章！');
                }else{
                    console.log('打印')
                }
            },
            // 确定开票
            sureFn(){
                console.log('确定开票')
            },
            // tab切换
            tabClickFn(index){
                this.previewIndex = index;
            },
        },
        components:{
            LayerPaperInfo
        }
    }
</script>

<style lang="less" scoped>
    @import "~@/assets/common.less";
    // 按钮
    .paper-btn{
        width: 100px;
        text-align: center;
    }
    .paper-btn-blue{
        background-color: @color-blue;
        border-color: @color-blue;
    }
    
    // 开票信息填写
    .layer-mesage{
        .cl-1{
            color: #6C7986;
            margin-right: 8px;
        }
        .cl-2{
            color:#233241;
        }
       .ul{
           overflow: hidden;
           padding: 0 40px;
           >li{
               float: left;
               color:#233241;
               padding-top: 20px;
           }
            .w-150{
                width: 140px;
                padding-right: 10px;
                display: inline-block;
            }
            .w-600{
                width: 600px;
                display: inline-block;
            }
            .cl-1{
                float: left;
            }
       }
       .ul-mesage{
           padding: 10px 40px 0;
           >li{
               padding-top: 18px;
               line-height: 32px;
           }
           .w150{
               width: 150px;
           }
       }
       .sure-btn{
           text-align: right;
           padding: 30px 20px 0 0;
       }
    }
    // 开票预览
    .preview{
        margin:22px 55px 0;
        border-top: 1px solid #D8D8D8;
        .preview-tit{
            font-size: 24px;
            font-weight:400;
            color: #478DE3;
            padding-top: 36px;
            text-align: center;
        }
        .preview-ul{
            text-align: center;
            padding-top: 32px;
           >ul{
                line-height: 32px;
                border:2px solid #478DE3;
                display: inline-block;
                border-radius: 18px;
                overflow: hidden;
                >li{
                    width: 100px;
                    text-align: center;
                    color: #478DE3;
                    cursor: pointer;
                    float: left;
                    &.on{
                        color: #fff;
                        background-color: #478DE3;
                    }
                }
           }
        }
    }
</style>