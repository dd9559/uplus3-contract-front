<template>
    <iframe v-show="showPdf" name="previewPdf" :src="'/static/pdf/web/viewer.html?file=' + getUrl"></iframe>
</template>

<script>
export default {
    props:{
        url:{
            type:String,
            default:'../../static/test.pdf',
        }
    },
    data(){
        return{
            showPdf:false,
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