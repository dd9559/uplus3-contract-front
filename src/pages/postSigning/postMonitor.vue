<template>
    <div class="paper-set">
        <!-- 筛选 -->
        <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
        </ScreeningTop>
    </div>
</template>

<script>
    import ScreeningTop from '@/components/ScreeningTop';

    export default {
        components:{
            ScreeningTop
        },
        methods:{
            // 重置
            resetFormFn() {
                this.$refs.propForm.resetFields()
            },
            // 查询
            queryFn() {
                console.log('查询')
            },
        }
    }
</script>

<style lang="less" scoped>
    @import "~@/assets/less/lsx.less";
</style>