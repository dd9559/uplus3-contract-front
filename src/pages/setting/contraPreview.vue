<template>
    <div class='view-container'>
      <p class='title'>
          <span>合同模板预览</span>
          <el-button type="primary paper-btn">保存</el-button>
      </p>
      <div class="ht-list">
          <el-button type="primary paper-btn">签章位置</el-button>
          <div class='pagerUp'>
              <el-button class="el-icon-caret-top"></el-button>
              <div><span>1</span>/<span>8</span></div>
              <el-button  class="el-icon-caret-bottom paper-next"></el-button>
          </div>
      </div>
      <el-dialog class='expand' title="请设置以下扩展参数" width="760px" :visible.sync="modalDialog" >
          <p class='tip'>系统暂不支持以下合同参数，需要进行设置</p>
          <div class="ex-body">
              <p>温馨提示：选项值之间请用英文下的逗号隔开！</p>
               <el-table :data='tableDate' style="width: 100%" header-row-class-name="theader-bg">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column align="center" label="参数名称" prop="name"></el-table-column>
                    <el-table-column align="center" label="是否必填" min-width="150">
                        <template slot-scope="scope">
                            <el-select v-model="isNessary" placeholder="请选择信息类型">
                                <el-option value="1">是</el-option>
                                <el-option value="2">否</el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="输入格式" min-width="150">
                        <template slot-scope="scope">
                            <el-select v-model="format">
                                <el-option value="1">下拉框</el-option>
                                <el-option value="2">输入框</el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="选项值" min-width="150">
                        <template slot-scope="scope">
                            <el-input></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="单位" min-width="150">
                        <template slot-scope="scope">
                            <el-input></el-input>
                        </template>
                    </el-table-column>
               </el-table>
                <div class="footer">
                    <el-button type="primary paper-btn">保存</el-button>
                </div>
          </div>
      </el-dialog>
    </div>
</template>
           
<script>
export default{
        data(){
          return{
            enableTemplateId:'',
            modalDialog:true,
            isNessary:'',
            format:'',
            tableDate:[],
            showType:'',
          }
        },
        created(){
            this.enableTemplateId = this.$route.query.enableTemplateId
            // this.showType=this.$route.query.showType
            // if(this.showType==1){
            //     this.modalDialog=false
            // }else{
            //     this.modalDialog=true
            // }
            this.$ajax.get('/api/setting/contractTemplate/checkTemplate',{url:'http://jjw-test.oss-cn-shenzhen.aliyuncs.com/test/20181120/zb.docx'}).then(res=>{
              console.log(res)
              this.tableDate=res.data.data.unPlaceholders
              console.log(this.tableDate);
            })
            this.initList()
        },
        methods:{
            initList(){
              this.$ajax.get('/api/setting/contractTemplate/show',{enableTemplateId:this.enableTemplateId}).then(res=>{
              console.log(res)
              })
            }
        }
        
}
</script>
<style lang='less' scoped>
.view-container{
    .title{
        height: 58px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left:12px;
        padding-right:12px;
        border-bottom: solid 1px rgba(206,225,246,1)
    }
    .ht-list{
        width: 600px;
        height: 800px;
        background-color: grey;
        margin: 11px auto;
        position: relative;
        padding: 20px 80px 20px 30px;
        > button{
            position: absolute;
            right: -40px;
            top: 50px;
        }
        .pagerUp{
            width: 40px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 5px;
            > button{
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                box-sizing: border-box;
                justify-content: center;
                align-items: center;
            }
            >div{
                margin: 10px auto;
                text-align: center;
            }
        }
        
    }
}
.expand{
    .tip{
        position: absolute;
        top: 30px;
        left: 250px;
        color:rgba(255,62,62,1);
        font-size: 14px
    }
    /deep/ .el-dialog__body{
        border-top: solid 1px rgba(237,236,240,1);
        padding-top:21px; 
        .ex-body{
            p:first-child{
                color:rgba(109,149,189,1);
                margin-bottom: 17px;
            }
            .footer{
                text-align: right;
                margin-top: 15px;
            }
        }
    }
}    
.paper-btn{
    width:100px;
    height:36px;
    background:rgba(71,141,227,1);
    border-radius:18px;
}
.paper-next{
    color: lightblue;
    background-color: lavenderblush;
}     
</style>