<template>
    <!-- 弹层 -->
            <el-dialog
                :title="comTit"
                :visible.sync="comShow"
                :before-close="handleClose"
                class="layer-paper">
                <span>{{comMsg}}</span>
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
        }
    },
    methods:{
        cloesFn(){
            this.$emit('propCloseFn')
        },
        btnFn(){
            this.$emit('propBtnFn')
        },
        // 点击黑层与叉叉按钮
        handleClose(){
            
        }
    }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/lsx.less";
</style>
