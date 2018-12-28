<template>
    <div class="view-container">
        <div class="data-list gap">
            <span class='sjx'></span>
            <p class="title">
                <span>数据列表</span>
            </p>
            <el-table :data="tableData" ref='onetable'  @row-click="rowClick" class='onetable' :row-class-name='tableStyle' highlight-current-row>
                <el-table-column align="center" label="序号" type="index"></el-table-column>
                <el-table-column align="center" label="款类(大类)" prop="name"></el-table-column>
                <el-table-column align="center" label="是否启用系统收款">
                    <template slot-scope="scope">
                        <div v-if="scope.row.name=='代收代付'">
                            <el-switch
                            v-model="scope.row.status"
                            :active-value="0"
                            inactive-value="1"
                            active-color="rgba(71,141,227,1)"
                            inactive-color="rgba(141,144,148,1)"
                            @change="leftChange(scope.row)">
                            </el-switch>
                        </div>
                        <div v-else>--</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="commission gap">
            <p class="title">
                <span>{{this.bigName}}</span>
                 <el-button type="primary" class='paper-btn' round size="medium"  v-if="power['sign-set-kl-add'].state" @click='operation(null,1)'>新增</el-button> 
            </p>
            <el-table :data="moneyTypes" v-if="isMoney" max-height="500">
                <el-table-column align="center" label="序号" type="index"></el-table-column>
                <el-table-column align="center" label="款类(小类)" prop="name"></el-table-column>
                <el-table-column align="center" label="描述" prop="remark">
                    <template slot-scope="scope">
                        <span v-if="scope.row.remark.length>24">
                        <el-popover trigger="hover"  width="160" placement="top">
                            <div>
                            {{scope.row.remark}}
                            </div>
                            <div slot="reference" class="name-wrapper three-row" :class="{'isFlex':scope.row.remark.length<16}">
                            {{scope.row.remark}}
                            </div>
                        </el-popover>
                        </span>
                        <span v-else-if="scope.row.remark.length>0">{{scope.row.remark}}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="是否启用">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status==0?true:scope.row.status==1?true:false">
                            <el-switch
                                v-model="scope.row.status"
                                :active-value="0"
                                @change='smallChange(scope.row)'
                                active-color="rgba(71,141,227,1)"
                                inactive-color="rgba(141,144,148,1)"
                                >
                            </el-switch>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="收款账户" prop="accountType.label"></el-table-column>
                <el-table-column align="center" label="操作" :formatter="nullFormatter">
                    <template slot-scope="scope">
                        <div v-if="bigName =='代收代付'">--</div>
                        <div v-else>
                            <el-button type="text" size="medium" v-if="power['sign-set-kl-edit'].state"  @click='operation(scope.row,2)'>编辑</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
          <!-- 添加 -->
        <el-dialog :title="title" :visible.sync="addDialog" width="740px" :closeOnClickModal="$tool.closeOnClickModal">
            <el-form :model="addForm"  class="addform" size="small">
                <div class="input-group">
                    <label>小类名称：</label>
                    <el-input type="text" v-model="addForm.name"></el-input>
                </div>
                 <div class="input-group">
                    <label>小类描述：</label>
                    <el-input type="textarea" :rows="4" resize='none' v-model="addForm.remark" placeholder="无备注内容" :maxlength="inputMax"></el-input>
                     <span class="text-absolute">{{validInput}}/{{inputMax}}</span>
                </div>
                <div class="input-group">
                    <label>是否启用：</label>
                    <div>
                        <el-switch
                                v-model="addForm.status"
                                :active-value="0"
                                :inactive-value='1'
                                active-color="rgba(71,141,227,1)"
                                inactive-color="rgba(141,144,148,1)"
                                >
                        </el-switch>
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="submitForm" type="primary" class="confirmBtn" v-dbClick>确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import {FILTER} from "@/assets/js/filter";
  import {MIXINS} from "@/assets/js/mixins";
    export default {
        mixins: [FILTER,MIXINS],
        data() {
            return {
                tableData: [],
                value2:'',
                moneyTypes: [],
                cityName: "",
                // isSF:true,
                title:'',
                isMoney:true,
                smallId:'',
                addDialog:false,
                bigId:'',
                inputMax:200,
                bigName:'',
                addForm:{
                    parentId:'',
                    name:'',
                    status:'',
                    remark:''
                },//权限配置
                power: {
                    'sign-set-kl-add': {
                        state: false,
                        name: '新增'
                    },
                    'sign-set-kl-edit': {
                        state: false,
                        name: '编辑'
                    },
                    'sign-set-kl-query': {
                        state: false,
                        name: '查询'
                    },
                    
                }
            }
        },
        created(){
           this.initList()
        },
        computed: {
            validInput() {
                return this.addForm.remark.length
            }
        },
        methods: {
            // 初始化数据
            initList(){
                 if(this.power['sign-set-kl-query'].state){
                    this.$ajax.get('api/setting/moneyType/list',{id:this.bigId},).then((res)=>{
                    if(res.status==200){
                        if(this.bigId==''){
                            this.tableData=res.data.data
                            this.moneyTypes=res.data.data[0].moneyTypes
                            this.bigName=res.data.data[0].name
                        }else{
                            this.moneyTypes=res.data.data
                            console.log(this.moneyTypes);
                        }
                        this.moneyTypes.forEach(item=>{
                            this.value2=item.status==0?true:false
                        })
                        this.bigId=this.bigId==''?18:this.bigId
                    }
                })}else{
                         this.noPower(this.power['sign-set-kl-query'].name)
                }
            },
            tableRowClassName({row, rowIndex}){
                row.index = rowIndex;
            },
            operation(row,type){
                this.addDialog=true
                if(type==1){
                    this.title=`新增【${this.bigName}】小类`,
                    this.addForm.name=''
                    this.addForm.status=0
                    this.addForm.remark=''
                    this.addForm.parentId=this.bigId
                }else if(type==2){
                    this.title=`编辑【${this.bigName}】小类`,
                    this.smallId=row.id
                    this.addForm.name=row.name
                    this.addForm.status=row.status
                    this.addForm.remark=row.remark
                    this.addForm.parentId=row.parentId
                }
            },
            leftChange(row){
                let param={
                    id:row.id,
                    status:row.status,
                    name:row.name,
                }
                 this.statusOp(param,'转换成功')
            },
            smallChange(row){
                let status2 = row.status===false?1:0
                let param={
                    id:row.id,
                    status:status2,
                    name:row.name
                }
                this.statusOp(param,'转换成功')
            },
            trim(str){  
                 return str.replace(/(^\s*)|(\s*$)/g, "")
            },
            submitForm(){
                // this.addForm.status=this.addForm.status?1:0
                if(this.trim(this.addForm.name)==''){
                    this.$message({
                        type: 'error',
                        message: '小类名称不能为空'
                    })
                    return
                }
                if(this.trim(this.addForm.name).length>10){
                    this.$message({
                        type: 'error',
                        message: '小类名称长度必须在10位以内!'
                    })
                    return
                }
                if(this.title==`新增【${this.bigName}】小类`){
                    this.addForm.name=this.trim(this.addForm.name)
                    this.$ajax.post('api/setting/moneyType/insert',this.addForm).then((res)=>{
                    if(res.status==200){
                        this.$message({
                        type: 'success',
                        message: '添加成功!'
                        })
                        this.addDialog=false
                        this.initList()
                    }
                  }).catch(error=>{
                     this.$message({
                        type: 'error',
                        message: error
                        })
                })
                }else if(this.title==`编辑【${this.bigName}】小类`){
                    let param={
                        id:this.smallId,
                        status:this.addForm.status,
                        name:this.trim(this.addForm.name),
                        remark:this.addForm.remark
                    }
                    this.statusOp(param,'修改成功')
                }
                
            },
             /**
             * 弹框
             */
            // popMsg(msg,callback,row){
            //     this.$confirm(msg,'提示',{
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            //     type: 'warning'
            //     }).then(()=>{
            //     callback(row)
            //     }).catch(()=>{
            //     })
            // },
            statusOp(param,message){
                console.log(this.power['sign-set-kl-edit'],'edit')
                if(this.power['sign-set-kl-edit'].state){
                    this.$ajax.get('/api/setting/moneyType/update',param)
                   .then((res)=>{
                        if (res.status === 200) {
                            this.$message({
                            type: 'success',
                            message: message
                            })
                            this.initList()
                        }
                         this.addDialog=false
                   }).catch(error=>{
                     this.$message({
                        type: 'error',
                        message: error
                        })
                  })
                }else{
                    this.noPower(this.power['sign-set-kl-edit'].name)
                }
            },
            //表格第一行加样式
            tableStyle({row, rowIndex}){
                row.index = rowIndex;
                if(rowIndex==0){
                    return 'linestyle'
                }
            },
            //单击行事件
            rowClick(row, event, column) {
                this.isMoney=false
                this.bigName=row.name
                var index=row.index
                var top=115+index*34.6
                var sjx=document.getElementsByClassName('sjx')
                var paperBtn=document.getElementsByClassName('paper-btn')
                if(row.name=='代收代付'){
                    paperBtn[0].disabled=true
                    paperBtn[0].classList.add('grey')
                }else{
                     paperBtn[0].disabled=false
                     paperBtn[0].classList.remove('grey')
                }
                sjx[0].style.top=top+'px'
                this.$refs.onetable.$el.classList.remove('onetable')
                // this.moneyTypes=row.moneyTypes
                this.addForm.parentId=row.id
                this.bigId=row.id
                  this.$ajax.get('api/setting/moneyType/list',{id:this.bigId}).then((res)=>{
                    if(res.status==200){
                        this.moneyTypes=res.data.data
                        this.isMoney=true
                    }})
            }
        }
    }
</script>

<style lang="less" scoped>
.view-container {
    display: flex;
    background-color: #F5F5F5 !important;
    // height: calc(100% - 40px);
    .data-list {
        // flex: 1;
        // margin-right: 15px;
        position: relative;
        min-width: 26%;
        margin-right: 1%;
        // padding: 15px 10px 0;
        background-color: #fff;
        box-shadow:0px 1px 6px 0px rgba(7,47,116,0.1);
        border-radius:4px;
        > .sjx{
                width:0;
                right:-14px;
                top: 115px;
                position: absolute;
                border-width:7px;
                border-style:solid;
                border-color:transparent transparent transparent white; /* transparent 设置边框颜色透明 */
        
        }
        /deep/ .el-table th {
            background:rgba(242,243,248,1);
        }
        /deep/ .el-table th, 
        /deep/ .el-table td {
            &:nth-child(2) {
                border-left: 1px solid rgba(232, 234, 246, 1);
            }
            &:nth-child(3) {
                border-left: 1px solid rgba(232, 234, 246, 1);
                border-right: 1px solid rgba(232, 234, 246, 1);
            }
        }
        .el-table {
            border:1px solid rgba(232, 234, 246, 1);
            border-radius:4px 4px 0px 0px;
        }
    }
    .commission {
        // flex: 2;
        min-width: 72%;
        // padding: 15px 10px 0;
        background:rgba(254,252,247,1);
        box-shadow:0px 1px 6px 0px rgba(7,47,116,0.1);
        border-radius:4px;
        .el-table {
            background:rgba(254,252,247,1);
        }
        /deep/ .el-table th {
            background:rgba(242,243,248,1);
        }
    }
    .gap {
        padding: 0px 10px 0;
        box-sizing: border-box;
    }
    .title {
        padding: 6px 0;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 18px;
        > span{
            font-size: 14px;
        }
    }

    .citySettingContent {
        .tip {
            display: flex;
            color: #FF3E3E;
            span {
                margin-right: 5px;
            }
        }
        .cityList {
            margin: 20px 0 50px;
            .cityName {
                display: flex;
                flex-wrap: wrap;
                > .el-checkbox {
                    margin-right: 20px;
                    width: 120px;
                    &:first-child{
                        margin-left: 30px;
                    }
                }
            }
        }
        .dialog-footer {
            display: flex;
            justify-content: flex-end;
            .el-button {
                width:100px;
                height:36px;
                border-radius:18px;
            }
        }
    }
}
/deep/ .el-dialog__header {
    border: 1px solid rgba(232, 234, 246, 1);
}
/deep/ .onetable tr.linestyle{
    background-color: #ECF5FF;
}
/deep/ .addform .input-group{
      &:nth-child(1) label::before{
           content: "*";
           color: red;
           position: relative;
           margin-right: 2px;
           top: 3px;
      }
      .el-input__inner{
       width: auto
    }
     &:nth-child(2){
         align-items: flex-start;
         position: relative;
     }
}

.paper-btn{
    width: 100px;
}
.grey{
    background-color: #F5F5F5;
    color:#ACA899;
    border: 1px solid #DDD;
}
  .name-wrapper {
    min-width: 80px;
    max-height: 65px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: normal;
    word-break: break-all;
    word-wrap:break-word;
  }
.isFlex{
    display: flex;
    align-items: center;
  }
.text-absolute {
      position: absolute;
      right: 4px;
      color: #D6D6D6;
      bottom: 0;
    }
</style>

