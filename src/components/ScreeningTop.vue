<template>
    <!-- 筛选 -->
    <div class="paper-box">
        <div class="paper-set-tit">
            <div class="paper-tit-fl">筛选查询</div>
            <div>
                <el-button 
                class="paper-btn" 
                type size="medium" 
                @click="resetFormFn"
                round>重 置</el-button>
                <el-button 
                class="paper-btn paper-btn-blue" 
                type="primary" 
                size="medium" 
                @click="queryFn"
                round>查 询</el-button>
            </div>
        </div>
        <!-- 筛选条件 -->
        <div class="tit" :style="comStyle">
            <div ref="children">
                <slot></slot>
            </div>
        </div>
        <div class="btn" v-show="show" @click="touchBtn"></div>
    </div>
</template>

<script>
export default {
    props:{
        min:{
            type:Number,
            default:61
        }
    },
    data(){
        return {
            show:true,
            showHeight:true
        }
    },
    methods:{
        size(){
            window.onresize = this.showFn
            this.showFn();
        },
        showFn(){
            if(this.$refs.children.clientHeight>this.comMin){
                this.show = true
            }else{
                this.show =false
            }
        },
        // 点击展开
        touchBtn(){
            this.showHeight = !this.showHeight
        },
        // 点击查询
        queryFn(){
            this.$emit('propQueryFn')
        },
        // 点击重置
        resetFormFn(){
            this.$emit('propResetFormFn')
        },
    },
    computed:{
        comMin(){
            return this.min
        },
        comStyle(){
            if(this.showHeight){
                return `height:${this.comMin}px`
            }else{
                return ''
            }
        }
    },
    mounted() {
        this.size();
    },
}
</script>

<style  lang="less" scoped>
@import "~@/assets/common.less";
.paper-box{
    padding: 20px 20px 0;
    background-color: @bg-white;
    position: relative;
    .tit{
        overflow: hidden;
    }
    .btn{
        width: 50px;
        height: 12px;
        background-color: gray;
        position: absolute;
        bottom: -12px;
        left: 50%;
        margin-left: -25px;
    }
}
// 按钮
.paper-btn{
    width: 100px;
    text-align: center;
}
.paper-btn-blue{
    background-color: @color-blue;
    border-color: @color-blue;
}
// 头部
.paper-set-tit {
    display: flex;
    justify-content: space-between;
    .paper-tit-fl{
        font-size: 18px;
        line-height: 36px;
        color: #233241;
    }
}

</style>
