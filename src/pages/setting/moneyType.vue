<template>
    <div class="view-container">
        <div class="data-list gap">
            <span class='sjx'></span>
            <p class="title">
                <span>数据列表</span>
            </p>
            <el-table :data="tableData" ref='onetable'  @row-click="rowClick" class='onetable' :row-class-name='tableStyle' highlight-current-row>
                <el-table-column align="center" label="序号" type="index" width="90"></el-table-column>
                <el-table-column align="center" label="款类(大类)" prop="name" width="120"></el-table-column>
                <el-table-column align="center" label="是否启用系统收款" width="150">
                    <template slot-scope="scope"  >
                        <div v-if="scope.row.name=='代收代付'">
                            <el-switch
                            v-model="scope.row.status==0?true:false"
                            active-color="rgba(71,141,227,1)"
                            inactive-color="rgba(141,144,148,1)">
                            </el-switch>
                        </div>
                        <div v-else>--</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="commission gap">
            <p class="title">
                <span>佣金</span>
                 <el-button type="primary" class='paper-btn' round size="medium"  @click='operation(null,1)'>新增</el-button> 
            </p>
            <el-table :data="moneyTypes">
                <el-table-column align="center" label="序号" type="index"></el-table-column>
                <el-table-column align="center" label="款类(小类)" prop="name"></el-table-column>
                <el-table-column align="center" label="描述" prop="remark"></el-table-column>
                <el-table-column align="center" label="是否启用">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status==0?true:scope.row.status==1?true:false">
                            <el-switch
                                v-model="scope.row.status==0?true:false"
                                active-color="rgba(71,141,227,1)"
                                inactive-color="rgba(141,144,148,1)">
                            </el-switch>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="收款账户" prop="accountType"></el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope" v-if="isSF">
                        <!-- <el-button type="text" size="medium" @click='operation(scpoe.row,1)'>新增</el-button> -->
                        <el-button type="text" size="medium" @click='operation(scope.row,2)'>编辑</el-button>
                        <el-button type="text" size="medium" @click="delYj(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
          <!-- 添加 -->
        <el-dialog :title="title" :visible.sync="addDialog" width="740px">
            <el-form :model="addForm"  class="addform" size="small">
                <div class="input-group">
                    <label>名称：</label>
                    <el-input type="text" v-model="addForm.name"></el-input>
                </div>
                 <div class="input-group">
                    <label>描述：</label>
                    <el-input type="text" v-model="addForm.remark"></el-input>
                </div>
                <div class="input-group">
                    <label>是否启用：</label>
                    <div>
                        <el-radio label="0" v-model="addForm.isUse">是</el-radio>
                        <el-radio label="1" v-model="addForm.isUse">否</el-radio>
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="submitForm" class="confirmBtn">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [
                    
                ],
                moneyTypes: [],
                cityName: "",
                isSF:true,
                title:'',
                addDialog:false,
                addForm:{
                    parentId:'',
                    name:'',
                    isUse:'',
                    remark:''
                }
            }
        },
        created(){
           this.initList()
         
        },
        methods: {
            // 初始化数据
            initList(){
                this.$ajax.get('api/setting/moneyType/list',{id:''},).then((res)=>{
                    if(res.status==200){
                        this.tableData=res.data.data
                        this.moneyTypes=res.data.data[0].moneyTypes
                        this.addForm.parentId=this.moneyTypes[0].parentId
                    }
                    console.log(res);
                })
            },
            //城市设置弹框 确定
            confirm() {

            },
            tableRowClassName({row, rowIndex}){
                row.index = rowIndex;
            },
            operation(row,type){
                this.addDialog=true
                if(type==1){
                    this.title='新增小类'
                }else{
                    this.title='编辑小类'
                    this.addForm.name=row.name
                    this.addForm.isUse=row.isUse
                    this.addForm.remark=row.remark
                    this.addForm.parentId=row.parentId
                }
            },
            submitForm(){
                // /setting/moneyType/insert
                console.log(this.addForm);
                this.$ajax.post('api/setting/moneyType/insert',this.addForm).then((res)=>{
                    if(res.status==200){
                        this.$message({
                        type: 'success',
                        message: '添加成功!'
                        })
                        this.initList()
                    }
                })
                console.log(this.addForm);
            },
             /**
             * 弹框
             */
            popMsg(msg,callback,row){
                this.$confirm(msg,'提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(()=>{
                callback(row)
                }).catch(()=>{

                })
            },
            delYj(row){
                // console.log(row,'删除记录');
                this.popMsg('确定删除此记录吗？',(row)=>{
                    console.log(row,'删除记录');
                   this.$ajax.get('/api/setting/moneyType/updateStatus',{id:row.id,status:2})
                   .then((res)=>{
                       console.log(res,'res');
                        if (res.status === 200) {
                            this.$message({
                            type: 'success',
                            message: '删除成功!'
                            })
                            this.initList()
                        }
                   })
                },row)
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
                var index=row.index
                // alert(index)
                // debugger
                var top=114+index*47.4
                var sjx=document.getElementsByClassName('sjx')
                console.log(sjx[0]);
                sjx[0].style.top=top+'px'
                // console.log(this.$refs.onetable,'代收代付');
                this.$refs.onetable.$el.classList.remove('onetable')
                if(row.name =='代收代付'){
                    this.isSF=false
                }else{
                    this.isSF=true
                }
                this.moneyTypes=row.moneyTypes

                // console.log(row.moneyTypes,'parentid');
                this.addForm.parentId=row.id
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
        min-width: 36%;
        margin-right: 1%;
        // padding: 15px 10px 0;
        background-color: #fff;
        box-shadow:0px 1px 6px 0px rgba(7,47,116,0.1);
        border-radius:4px;
        > .sjx{
                width:0;
                right:-14px;
                top: 114px;
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
        min-width: 63%;
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
        padding: 15px 10px 0;
        box-sizing: border-box;
    }
    .title {
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 18px;
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
/dppe/ .addform .el-input__inner{
    width: auto
}
.paper-btn{
    width: 100px;
}
</style>

