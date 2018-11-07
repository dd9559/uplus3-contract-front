<template>
    <!-- 弹层 -->
            <el-dialog
                :title="comTit"
                :visible.sync="comShow"
                :before-close="handleClose"
                :width="comWidth"
                :center="comCenter"
                class="layer-paper">
                <slot v-if="comRabbet"></slot>
                <div v-else class="txt">{{comMsg}}</div>
                <span slot="footer">
                    <el-button 
                        class="paper-btn" 
                        type size="medium"
                        @click="cloesFn" 
                        round>取消</el-button>
                    <el-button 
                        class="paper-btn paper-btn-blue" 
                        type="primary" 
                        size="medium"
                        @click="btnFn" 
                        round>确定</el-button>
                </span>
            </el-dialog>
</template>

<script>
export default {
    props:{
        show:{
            type:Boolean,
            default:false
        },
        msg:{
            type:String,
            default:'弹层内容'
        },
        tit:{
            type:String,
            default:'弹层标题'
        },
        rabbet:{
            type:Boolean,
            default:false
        },
        proWidth:{
            type:String,
            default:'460px'
        },
        center:{
            type:Boolean,
            default:true
        },
        type:{
            type:String,
            default:''
        }
    },
    computed:{
        comShow(){
            return this.show
        },
        comMsg(){
            return this.msg
        },
        comTit(){
            return this.tit
        },
        comRabbet(){
            return this.rabbet
        },
        comWidth(){
            return this.proWidth
        },
        comCenter(){
            return this.center
        }
    },
    methods:{
        cloesFn(){
            this.$emit('propCloseFn',this.type)
        },
        btnFn(){
            this.$emit('propBtnFn',this.type)
        },
        // 点击黑层与叉叉按钮
        handleClose(){
            this.$emit('propHandFn',this.type)
        }
    },
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
// 弹层
.layer-paper{
    /deep/.el-dialog__header{
        text-align: left;
    }
    /deep/.el-dialog__footer{
        padding-bottom: 30px;
    }
    /deep/.el-dialog__body{
        padding:0;
    }
    /deep/.el-dialog__title{
        font-size: 20px;
    }
    /deep/.el-dialog__header{
        padding: 20px;
        border-bottom: 1px solid #EDECF0;
    }
    .txt{
        height: 140px;
        padding:0 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        color: #233241;
    }
}
</style>
