<template>
    <iframe class="preview-pdf" name="previewPdf" :src="'/static/pdf/web/viewer.html?file=' + getUrl"></iframe>
</template>

<script>
export default {
    props:{
        url:{
            type:String,
            default:'',
        }
    },
    computed:{
        getUrl(){
            let url = encodeURIComponent(`${this.url}`)
            return url
        }
    },
    methods:{
        print(){
            if(!this.getUrl){
                this.$message.error('打印失败，请重新打印');
            }else{
                window.frames["previewPdf"].document.getElementById("print").click();
            }
        }
    }
}
</script>
<style lang="less" scoped>
.preview-pdf{
    position: absolute;
    z-index: -99;
    width: 0;
    height: 0;
}
</style>
