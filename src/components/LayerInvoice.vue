<template>
    <el-dialog
    :title="!paperType?'票据详情':'开票信息填写'" :close-on-click-modal="$tool.closeOnClickModal" :close-on-press-escape="$tool.closeOnClickModal"
    :visible.sync="paperShow"
    width="1000px"
    class="layer-paper"
    @close="propCloseFn">
        <div>
            <div class="paper-edit-box" v-if="paperType">
                <ul>
                    <li>
                        <p><label>合同编号:</label><span>{{paperInfoData.contCode}}</span></p>
                        <p><label>物业地址:</label><span>{{paperInfoData.address}}</span></p>
                    </li>
                    <li>
                        <p><label>交款单位:</label><span>{{paperInfoData.payerName}}</span></p>
                        <p><label>合计金额:</label><span>{{paperInfoData.proceedsAmount}}元</span></p>
                    </li>
                    <li v-for="(item,index) in moneyTypes" :key="index">
                        <label class="checkbox-info iconfont" :class="[item.check?'active':'']" @click="item.check=!item.check"></label>
                        <div class="type-list">
                            <p><label>款类：</label><span>{{item.typeName}}</span></p>
                            <p><label>金额：</label><span>{{item.amount}}元</span></p>
                            <div class="input-group">
                                <label>开票项目：</label>
                                <el-select class="w120" size="small" v-model="item.project" placeholder="请选择">
                                    <el-option v-for="item in dictionary['542']" :key="item.key" :label="item.value" :value="item.key">
                                    </el-option>
                                </el-select>
                            </div>
                            <p><label class="checkbox-info iconfont" :class="[item.addressHidden?'active':'']" @click="item.addressHidden=!item.addressHidden"></label><span>隐藏物业地址</span></p>
                            <p><label>票据编号：</label><span>{{item.billCode}}</span></p>
                        </div>
                    </li>
                </ul>
                <el-button round size="small" class="paper-btn paper-btn-blue paper-btn-float" @click="billing">确定开票</el-button>
            </div>
            <div class="paper-top" v-show="FooterShow">
                <div class="paper-watch-tab" v-if="paperType">
                    <p>票据预览</p>
                    <ul v-if="moneyTypes.length>1">
                        <li v-for="(item,index) in moneyTypes" :key="index" :class="[index===activeType?'active':'']" @click="activeType=index">{{item.typeName}}</li>
                    </ul>
                </div>
                <vue-easy-print tableShow ref="easyPrint">
                    <LayerPaperInfo
                    :number="paperInfoData.contCode"
                    :name="paperInfoData.payerName"
                    :collectionTime="paperInfoData.paymentTime"
                    :invoiceTime="paperInfoData.createTime"
                    :paper="paperInfoData.billCode"
                    :project="paperInfoData.type"
                    :hide="paperInfoData.hide"
                    :address="paperInfoData.address"
                    :money="paperInfoData.amount"
                    :moneyZh="paperInfoData.amountZh"
                    :create="paperInfoData.createByName"
                    :rules="paperInfoData.remark"
                    :imgSrc="imgUrl"
                    :time="paperInfoData.printDate"
                    :num="paperInfoData.printTimes"
                    :payerType="paperInfoData.payerType"></LayerPaperInfo>
                </vue-easy-print>
                <!-- :imgSrc="paperInfoData.signImg" -->
            </div>
            <!-- <PdfPrint :url="pdfUrl" ref="pdfPrint"></PdfPrint> -->
        </div>
        <p slot="footer" v-show="FooterShow">
            <el-button round size="small" class="paper-btn" @click="propCloseFn">取消</el-button>
            <el-button round size="small" class="paper-btn paper-btn-blue" @click="printPaper" v-if="!stateBoll">打印</el-button>
        </p>
    </el-dialog>
</template>

<script>
    import LayerPaperInfo from '@/components/LayerPaperInfo';
    import vueEasyPrint from "vue-easy-print";
    import { MIXINS } from "@/assets/js/mixins";
    import { Loading } from 'element-ui';

    export default {
        props: {},
        mixins: [MIXINS],
        data() {
            return {
                dictionary: {
                    '542': '',
                },
                FooterShow:false,
                ID: '',
                paperShow: false,
                paperType: false, //false预览 true开票
                paperInfoData: {}, //票据对象
                moneyTypes: [], //临时存放勾选的款类
                activeType: 0, //当前预览项
                imgUrl:'',
                stateBoll:false,
                layerLoading:'',
            }
        },
        methods: {
            // 图片请求
            getImgFn(url){
                if(!!url){
                    url = url.split('?')[0];
                    this.$ajax.get('/api/load/generateAccessURL',{
                        url
                    }).then(res=>{
                        res = res.data;
                        if(res.status === 200){
                            this.imgUrl = res.data.url
                        }
                    }).catch(err=>{
                        this.$message.error(err);
                    })
                }
            },
            // 弹层关闭
            propCloseFn() {
                this.$tool.clearForm(this.layer)
                this.paperShow = false
            },
            /**
             * 票据详情
             * @param row
             */
            getPaperDetails: function(id) {
                this.$ajax.get(`/api/bills/details`,{
                    id
                }).then(res => {
                    res = res.data
                    if (res.status === 200) {
                        this.paperInfoData = Object.assign({}, res.data)
                        // this.paperShow = true
                        this.layerLoading.close();
                        this.paperShow = true;
                        this.FooterShow = true;
                        // this.printPaper();
                    }
                }).catch(err=>{
                    this.$message.error(err);
                    this.layerLoading.close();
                })
            },
            billing: function() {
                if(this.moneyTypes.length === 0){
                    this.$message.error('无法开票');
                    return false
                }
                if(!this.moneyTypes[this.activeType].project){
                    this.$message.error('请选择开票项目');
                    return false
                }
                if(this.moneyTypes[this.activeType].check){
                    this.FooterShow =  true
                }else{
                    this.FooterShow = false
                    this.$message.error('请勾选款类');
                    return false
                }
                let param = this.moneyTypes[this.activeType]
                let obj = {
                    createTime: '',
                    billCode: param.billCode,
                    hide: param.addressHidden,
                    amount: param.amount,
                    amountZh: param.amountZh,
                    createByName: this.paperInfoData.createBy,
                    remark: param.remark
                }
                this.dictionary['542'].find(item => {
                    if (item.key === param.project) {
                        obj.type = item.value
                    }
                })
                this.paperInfoData = Object.assign({}, this.paperInfoData, obj,{
                    createTime:this.$tool.dateFormat(new Date())
                })
                // this.printPaper();
            },
            // 票据详情 打印
            printPaper() {
                this.layerLoading = Loading.service({});
                let obj = {}
                if (!this.paperType) {
                    obj = {
                        code: this.paperInfoData.billCode,
                        isPrint:true
                    }
                } else {
                    let type = this.moneyTypes[this.activeType]
                    obj = {
                        code: type.billCode,
                        payId: this.ID,
                        payDetailsId: type.payDetailsId,
                        isHiddenAddress: type.addressHidden,
                        billType: type.project,
                        isPrint:true
                    }
                }
                if(!this.paperInfoData.signImg){
                    this.layerLoading.close();
                    this.$message.error('请先设置财务专用电子签章');
                    return false
                }
                
                this.$ajax.post('/api/bills/print', obj).then(res => {
                    res = res.data
                    if(res.status === 200){
                        let url = res.data;
                        this.$ajax.get("/api/load/generateAccessURL",{
                            url
                        }).then(res=>{
                            res = res.data
                            if(res.status ===200){
                                // this.pdfUrl = res.data.url;
                                // this.$refs.pdfPrint.print();
                                this.$emit("emitPaperSet");
                                this.$refs.easyPrint.print();
                            }
                            this.layerLoading.close();
                        }).catch(err=>{
                            this.$message.error(err)
                            this.layerLoading.close();
                        })
                    }
                }).catch(err=>{
                    this.$message.error(err)
                    this.layerLoading.close();
                })
            },
            printPaperFn(){
                // this.$refs.easyPrint.print();
                // return false
                if(!this.paperInfoData.signImg){
                    this.$message.error('请先设置财务专用电子签章');
                    return false
                }
                this.layerLoading = Loading.service({});
                this.$ajax.post('/api/bills/print', {
                    code:this.paperInfoData.billCode,
                    isPrint:true,
                }).then(res => {
                    res = res.data
                    this.layerLoading.close();
                    if(res.status === 200){
                        this.$emit("emitPaperSet");
                        // this.$refs.pdfPrint.print();
                    }
                }).catch(err=>{
                    this.$message.error(err)
                    this.layerLoading.close();
                })
            },
            // 获取开票列表
            paperList: function() {
                this.$ajax.get('/api/bills/tobe', {id:this.ID}).then(res => {
                    res = res.data
                    if (res.status === 200) {
                        this.paperInfoData = Object.assign({}, res.data)
                        let obj = JSON.parse(JSON.stringify(res.data))
                        this.moneyTypes = [].concat(obj.list)
                        this.moneyTypes.forEach((item, index) => {
                            let obj = Object.assign({
                                check: true,
                                addressHidden: false,
                                project: ''
                            }, item)
                            this.moneyTypes.splice(index, 1, obj)
                        })
                        this.layerLoading.close();
                        if(this.moneyTypes.length>0){
                            this.paperShow = true;
                        }
                    }
                }).catch(err=>{
                    this.$message.error(err);
                    this.layerLoading.close();
                })
            },
            // 打开
            show(id, bool = false,stateBoll = false) {
                this.layerLoading = Loading.service({});
                this.paperType = bool;
                // this.paperShow = true;
                this.FooterShow = false;
                this.stateBoll = stateBoll;
                this.pdfUrl= "";
                this.ID = id
                if (bool) {
                    this.paperList();
                }else{
                    this.getPaperDetails(id);
                }
            }
        },
        components: {
            LayerPaperInfo,
            vueEasyPrint
        },
        mounted() {
            // 枚举类型数据获取
            this.getDictionary();
        },
        watch:{
            paperInfoData(n,old){
                this.getImgFn(n.signImg)
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "~@/assets/common.less";

    // 按钮
    .paper-btn {
        width: 100px;
        text-align: center;
    }

    .paper-btn-blue {
        background-color: @color-blue;
        border-color: @color-blue;
        color: #fff;
    }

    // 开票信息填写
    .layer-mesage {
        .cl-1 {
            color: #6C7986;
            margin-right: 8px;
        }

        .cl-2 {
            color: #233241;
        }

        .ul {
            overflow: hidden;
            padding: 0 40px;

            >li {
                float: left;
                color: #233241;
                padding-top: 20px;
            }

            .w-150 {
                width: 140px;
                padding-right: 10px;
                display: inline-block;
            }

            .w-600 {
                width: 600px;
                display: inline-block;
            }

            .cl-1 {
                float: left;
            }
        }

        .ul-mesage {
            padding: 10px 40px 0;

            >li {
                padding-top: 18px;
                line-height: 32px;
            }

            .w150 {
                width: 150px;
            }
        }

        .sure-btn {
            text-align: right;
            padding: 30px 20px 0 0;
        }
    }
    .paper-top{
        padding-top: 20px;
        border-top: 1px solid @border-D8;
    }

    // 开票预览
    .preview {
        margin: 22px 55px 0;
        border-top: 1px solid #D8D8D8;

        .preview-tit {
            font-size: 24px;
            font-weight: 400;
            color: #478DE3;
            padding-top: 36px;
            text-align: center;
        }

        .preview-ul {
            text-align: center;
            padding-top: 32px;

            >ul {
                line-height: 32px;
                border: 2px solid #478DE3;
                display: inline-block;
                border-radius: 18px;
                overflow: hidden;

                >li {
                    width: 100px;
                    text-align: center;
                    color: #478DE3;
                    cursor: pointer;
                    float: left;

                    &.on {
                        color: #fff;
                        background-color: #478DE3;
                    }
                }
            }
        }
    }

    .paper-edit-box {
        margin: 0 40px;
        padding: 20px 0 80px;
        position: relative;

        .paper-btn-float{
            position: absolute;
            right: 0;
            bottom: 20px;
        }

        >ul {
            &:first-of-type {
                >li {
                    margin-bottom: 20px;
                    display: flex;
                    // align-items: center;

                    >label {
                        margin-right: 10px;
                        margin-top: 7px;
                    }

                    &:first-of-type,
                    &:nth-of-type(2) {
                        >p {
                            &:first-of-type {
                                width: 200px;
                            }
                        }
                    }

                    &:last-of-type {
                        margin-bottom: 0px;
                    }
                }
            }
        }

        .type-list {
            display: flex;
            flex-wrap: wrap;

            >p {
                min-width: 110px;
                margin-right: 20px;
                display: inherit;
                align-items: center;

                >label.checkbox-info {
                    margin-right: 10px;
                }

                &:last-child {
                    margin-right: 0;
                }
            }

            .input-group {
                margin-bottom: 0;
                margin-right: 20px;
            }
        }
    }

    .paper-watch-tab {
        font-size: 24px;

        >p {
            color: @color-blue;
            text-align: center;
            font-weight: bold;
            margin: 12px 32px 32px;
        }

        >ul {
            display: flex;
            justify-content: center;
            margin-bottom: 26px;

            >li {
                border-top: 2px solid @color-blue;
                border-bottom: 2px solid @color-blue;
                min-width: 100px;
                height: 36px;
                display: inherit;
                align-items: center;
                justify-content: center;

                &:first-of-type {
                    border-left: 2px solid @color-blue;
                    border-top-left-radius: 18px;
                    border-bottom-left-radius: 18px;
                }

                &:last-of-type {
                    border-right: 2px solid @color-blue;
                    border-top-right-radius: 18px;
                    border-bottom-right-radius: 18px;
                }

                &.active {
                    background-color: @color-blue;
                    color: @color-white;
                }
            }
        }
    }

    .checkbox-info {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 1px solid @border-e6;

        &.active {
            position: relative;
            color: @color-blue;

            &:after {
                content: '\e65d';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }
</style>
