<template>
    <div class="view-container" ref="tableComView">
        <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
            <el-form :inline="true" :model="searchForm" size="small">
                <el-form-item label="关键字">
                    <el-input v-model="searchForm.keyword" placeholder="附件名称/添加人"></el-input>
                </el-form-item>
                <el-form-item label="体系">
                    <el-select class="w240" v-model="searchForm.systemTag">
                        <el-option v-for="item in systemArr" v-if="item.isDel==0" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="添加时间">
                    <el-date-picker
                    v-model="addTime"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']"
                    format="yyyy-MM-dd"
                    value-format="yyyy/MM/dd">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </ScreeningTop>
        <!-- 表格 -->
        <div class="table-box">
            <p>
                <span><i class="iconfont icon-tubiao-11 mr-8"></i>数据列表</span>
                <el-button icon="el-icon-plus" @click="addFn" round type="primary">新增合同附件</el-button>
            </p>
            <el-table :data="attachData" border style="width: 100%" ref="tableCom" :max-height="tableNumberCom" header-row-class-name="theader-bg">
                <el-table-column align="center" label="体系"></el-table-column>
                <el-table-column align="center" label="附件名称"></el-table-column>
                <el-table-column align="center" label="添加时间"></el-table-column>
                <el-table-column align="center" label="添加人"></el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="medium">下载</el-button>
                        <el-button type="text" size="medium">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 新增合同附件 -->
        <el-dialog
        title="新增合同附件"
        :closeOnClickModal="$tool.closeOnClickModal"
        :close-on-press-escape="$tool.closeOnClickModal"
        :visible.sync="addVisible"
        width="740px">
        <div class="dialog-body" :style="{ height: clientHeight() }">
            <p class="item-title"><i>*</i>体系：</p>
            <el-select class="w400 item-title" v-model="addSystemTag" size="small">
                <el-option v-for="item in systemArr" v-if="item.isDel==0" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
            <p class="item-title"><i>*</i>附件：</p>
            <ul class="ulData">
                <li>
                    <file-up class="upload-box" :scane="dataScane" @getUrl="addSubject">
                        <i class="iconfont icon-shangchuan"></i>
                        <p>点击上传</p>
                    </file-up>
                </li>
                <li v-for="(item,i) in attachList" :key="i">
                    <el-tooltip class="item" effect="dark" :content="item.name" placement="bottom">
                        <div class="attach-box" @click="previewPhoto(attachList,i)">
                            <img :src="preloadFiles[getSrcIndex(item.path)]" alt="" v-if="isPictureFile(item.fileType)" width="70%" height="62px">
                            <upload-cell :type="item.fileType" v-else></upload-cell>
                            <p>{{item.name}}</p>
                        </div>
                    </el-tooltip>
                    <i class="iconfont icon-tubiao-6" @click="deleteFn(i)"></i>
                </li>
            </ul>
        </div>
        <div class="btn">
            <el-button @click="addVisible=false" round>取 消</el-button>
            <el-button type="primary" @click="saveFn" round>保 存</el-button>
        </div>
        <!-- 图片预览 -->
        <preview :imgList="previewFiles" v-if="preview" @close="preview=false"></preview>
        </el-dialog>
    </div>
</template>

<script>
    import {MIXINS} from "@/assets/js/mixins";
    export default {
        name: "conAttachment",
        mixins: [MIXINS],
        props: {
            systemArr: {
                type: Array,
                default: function() {
                    return []
                }
            }
        },
        data() {
            return {
                clientHei: document.documentElement.clientHeight, //窗体高度
                searchForm: {
                    keyword: '',
                    systemTag: ''
                },
                addTime: [],
                attachData: [],
                addVisible: false,
                addSystemTag: '',
                attachList: [],
                dataScane:{
                    path:"ziliaoku",
                    id:''
                },
                preloadList: [],
                preloadFiles:[],
            }
        },
        created() {
            
        },
        mounted(){
            var _this = this
            window.onresize = function(){
                _this.clientHei = document.documentElement.clientHeight
            }
        },
        methods: {
            addFn() {
                this.addVisible = true
                this.addSystemTag = ''
                this.attachList = []
            },
            addSubject(data) {
                let arr = data.param
                arr.forEach(item => {
                    let fileType = this.$tool.get_suffix(item.name)
                    item.fileType = fileType
                })
                this.attachList = this.attachList.concat(arr)
                arr.forEach(item => {
                    if(this.isPictureFile(item.fileType)){
                        this.preloadList.push(item.path)
                    }
                })
                if(this.preloadList.length) {
                    this.fileSign(this.preloadList,'preload').then(res=>{
                        this.preloadFiles = res
                    }) 
                }
            },
            getSrcIndex(path) {
                let item = this.preloadList
                if(item.length) {
                    let index
                    item.find((e,i) => {
                        if(path == e) {
                            index = i
                        }
                    })
                    return index
                }
            },
            deleteFn(i) {
                if(this.attachList.length == 1) {
                    this.$message({
                        message:'至少保留一个，请勿删除',
                        type:'warning'
                    })
                    return
                }
                this.attachList.splice(i,1)
            },
            saveFn() {
                if(!this.addSystemTag) {
                    this.$message({message:'体系不能为空'})
                    return
                }
                if(!this.attachList.length) {
                    this.$message({message:'请上传附件'})
                    return
                }
            },
            queryFn() {
                
            },
            resetFormFn() {
                this.searchForm.keyword = ''
                this.searchForm.systemTag = ''
                this.addTime = []
            },
            // 控制弹框body内容高度，超过显示滚动条
            clientHeight() {        
                return this.clientHei - 550 + 'px'
            }
        }
    }
</script>

<style scoped lang="less">
    @import "~@/assets/common.less";
    .table-box {
        background-color: #fff;
        padding: 0 10px;
        margin-top: 20px;
        > p {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: @size-14;
            .mr-8 {
                margin-right: 8px;
            }
            > .el-button {
                width:120px;
                padding: 9px 15px;
                display: flex;
                justify-content: center;
                color: #fff;
            }
        }
    }
    .dialog-body {
        overflow-y: auto;
        padding: 20px;
        border-bottom: 1px solid #EDECF0;
        .item-title {
            margin-bottom: 10px;
            >i {
                color: @color-red;
            }
        }
        .ulData{
            display: flex;
            flex-wrap:wrap;
            li{
                margin-right: 10px;
                position: relative;
                margin-bottom: 10px;
                > i{
                    display: none;
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    color: @color-warning;
                    font-size: 20px;
                    cursor: pointer;
                }
                &:hover >i {
                    display: block;
                }
            }
        }
        .upload-box {
            display: inline-block;
            text-align: center;
            width: 120px;
            height: 120px;
            box-sizing: border-box;
            padding-top: 28px;
            border: 1px dashed @border-DE;
            border-radius:2px;
            i {
                color: @bg-th;
                font-size: 50px;
            }
            p {
                padding-top: 10px;
                color: @color-324;
                font-size: 12px;
            }
        }
        .attach-box{
            display: inline-block;
            text-align: center;
            width: 120px;
            height: 120px;
            padding-top: 20px;
            box-sizing: border-box;
            border-radius:4px;
            background: @color-F2;
            > p{
                padding-top: 5px;
                display: inline-block;
                width: 100px;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
        }
    }
    .btn {
        padding: 10px 20px 10px 0;
        text-align: right;
    }
    /deep/ .el-dialog__body {
        padding: 0;
    }
</style>