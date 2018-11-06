const Mixin ={
    data(){
        return{
            // 弹层
            layer:{
                show:false,
                msg:'',
                tit:''
            }
        }
    },
    methods:{
        propCloseFn(){
            this.layer.show = !this.layer.show  
        },
        propBtnFn(){
            this.layer.show = !this.layer.show  
        },
        propHandFn(){
            this.layer.show = !this.layer.show  
        },
    }
}

export {
    Mixin
}