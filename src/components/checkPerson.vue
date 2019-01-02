<template>
  <el-dialog
    title="选择审核人"
    :visible="show"
    :closeOnClickModal="$tool.closeOnClickModal"
    @close="close"
    width="740px">
    <div class="dialog-container">
      <p v-if="type==='set'">下一审核节点无审核人，请先设置下一节点审核人</p>
      <div class="chose-box">
        <span>{{type==='set'?'设置':'转交'}}审核人</span>
        <div class="box-content">
          <div class="box-content-input">
            <el-select :clearable="true" size="small" v-model="choseItem.depId" placeholder="部门" @change="getOption('dep')" @clear="clearDep">
              <el-option
                v-for="item in deps"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select :clearable="true" filterable remote :remote-method="searchEmp" class="w140" size="small" v-model="choseItem.empId" placeholder="人员" @visible-change="initEmp"  @change="getOption('emp')">
              <el-option
                v-for="item in emps"
                :key="item.emp_id"
                :label="item.name"
                :value="item.emp_id">
              </el-option>
            </el-select>
          </div>
          <p>（在人员处搜索姓名并选择后可自动带出人员所在部门）</p>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button size="small" class="btn-info" round @click="opera('close')">返 回</el-button>
    <el-button size="small" class="btn-info" round type="primary" @click="opera('submit')">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
  export default {
    name: "check-person",
    props:{
      show:{
        type:Boolean,
        // default:false
      },
      type:{
        type:String,
        default:'init'
      },
      bizCode:{
        type:String,
        default:''
      },
      flowType:{
        type:Number,
      }
    },
    data(){
      return{
        deps:[],
        emps:[],
        choseItem:{
          depId:'',
          empId:''
        },
        inputEmp:false,//是否手动搜索
      }
    },
    created(){
      this.searchDep()
    },
    methods:{
      opera:function (type) {
        if(type==='close'){
          this.$emit('close')
        }else {
          let param = {
            bizCode:this.bizCode,
            flowType:this.flowType,
            userId:this.choseItem.empId,
          }
          this.emps.forEach(item=>{
            if(item.emp_id===this.choseItem.empId){
              param.userName=item.name
            }
          })
          this.$ajax.post('/api/machine/changeAuditorNext',param).then(res=>{
            res=res.data
            if(res.status===200){
              this.$emit('submit',this.choseItem)
            }
          })
        }
      },
      close:function () {
        this.$emit('close')
      },
      clearDep:function () {
        this.searchDep()
      },
      //获取部门
      searchDep:function () {
        this.inputEmp=false
        let param={
          keyword:'',
          type:this.type==='init'?0:1,
          bizCode:this.bizCode,
          flowType:this.flowType
        }
        this.$ajax.get('/api/machine/selectDept',param).then(res=>{
          res=res.data
          if(res.status===200){
            this.deps=[].concat(res.data)
          }
        })
      },
      //搜索人员
      searchEmp:function (val) {
        let param={
          keyword:val,
          type:this.type==='init'?0:1,
          depId:this.choseItem.depId,
          bizCode:this.bizCode,
          flowType:this.flowType
        }
        if(val&&val.length>0){
          this.inputEmp=true
          param.depId=''
        }
        this.$ajax.get('/api/machine/selectEmp',param).then(res=>{
          res=res.data
          if(res.status===200){
            this.emps=[].concat(res.data)
          }
        })
      },
      initEmp:function (val) {
        if(!val&&this.choseItem.empId===''&&this.inputEmp){
          this.searchEmp()
          this.inputEmp=false
        }
      },
      //下拉选择
      getOption:function (type) {
        if(type==='dep'){
          // debugger
          this.choseItem.empId=''
          this.emps = []
          if(this.choseItem.depId!==''){
            this.searchEmp()
          }
        }else {
          if(this.inputEmp){
            this.emps.find(item=>{
              if(item.emp_id===this.choseItem.empId){
                this.deps=[].concat({name:item.dep_name,id:item.dep_id})
                this.choseItem.depId=item.dep_id
                this.searchEmp()
                this.inputEmp=false
              }
            })
          }
        }
      }
    },
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
  .btn-info{
    width: 100px;
  }
.dialog-container{
  padding: 20px 50px 20px 10px;
  >p{
    margin-bottom: 30px;
    &:first-of-type{
      color: red;
      position: relative;
      &:before{
        content: '*';
        display: inline-block;
        width: 10px;
      }
    }
  }
  .chose-box{
    display: flex;
    >span{
      height: 32px;
      line-height: 32px;
      margin-right: @margin-10;
    }
    .box-content{
      >p{
        margin-top: @margin-15;
        color: @color-99A;
      }
    }
  }
}
</style>
