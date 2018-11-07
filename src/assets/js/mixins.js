const Mixin ={
    data(){
        return{
            // 弹层
            layer:{
                show:false,
            }
        }
    },
    methods:{
        propCloseFn(){
            this.layer.show = !this.layer.show  
        },
    }
}

export {
    Mixin
}