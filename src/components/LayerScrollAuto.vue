<template>
    <div class="layer" ref="layer" :style="comHeight">
        <slot></slot>
    </div>
</template>

<script>
export default {
    data(){
        return{
            winHeight:0,
            comHeight:'auto',
        }
    },
    mounted() {
        window.onresize = this.winSizeFn;
    },
    updated() {
        // setTimeout(()=>{
            this.winSizeFn();
            this.comHeightFn();
        // },100)
    },
    methods:{
        winSizeFn(){
            this.winHeight = document.documentElement.clientHeight;
        },
        comHeightFn(){
            let h = this.winHeight - (80+80+65+62);
            if(!this.$refs.layer){
                this.comHeight = ''
            }
            if(this.$refs.layer.children[0].clientHeight > h){
                this.comHeight = `height:${h}px`
            }else{
                this.comHeight = ''
            }
        }
    },
}
</script>

<style lang="less" scoped>
.layer{
    overflow-y: auto;
}
</style>
