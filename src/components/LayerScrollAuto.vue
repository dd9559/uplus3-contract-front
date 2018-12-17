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
        }
    },
    mounted() {
        window.onresize = this.winSizeFn;
    },
    updated() {
        let that = this;
        setTimeout(()=>{
            that.winSizeFn()
        },0)
    },
    computed:{
        comHeight(){
            let h = this.winHeight - (80+80+65+62);
            if(!this.$refs.layer){
                return ''
            }
            if(this.$refs.layer.children[0].clientHeight > h){
                return `height:${h}px`
            }else{
                return ''
            }
        }
    },
    methods:{
        winSizeFn(){
            this.winHeight = document.documentElement.clientHeight;
        }
    },
}
</script>

<style lang="less" scoped>
.layer{
    overflow-y: auto;
}
</style>
