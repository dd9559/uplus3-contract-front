<template>
    <!-- 弹层 -->
            <el-dialog
                :title="comTit"
                :visible.sync="comShow"
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
        },
        close:{
            type:Boolean,
            default:false
        },
        btn:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return {
            comShow:this.show,
            comMsg:this.msg,
            comTit:this.tit
        }
    },
    methods:{
        cloesFn(){
            if(this.close){
                this.$emit('propCloseFn')
            }else{
                this.comShow = false
            }
        },
        btnFn(){
            if(this.btn){
                this.$emit('propBtnFn')
            }else{
                this.comShow = false
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/lsx.less";
</style>
