<template>
  <el-dialog
    title="选择审核人"
    :visible="show"
    :closeOnClickModal="$tool.closeOnClickModal"
    @close="close"
    width="740px">
    <div class="dialog-container">
      <p>下一审核节点无审核人，请先设置下一节点审核人</p>
      <div class="chose-box">
        <span>{{type==='set'?'设置':'转交'}}审核人</span>
        <div class="box-content">
          <div class="box-content-input">
            <el-select :clearable="true" size="small" v-model="choseItem.depId" placeholder="部门" @change="getOption('dep')">
              <el-option
                v-for="item in deps"
                :key="item.key"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
            <el-select :clearable="true" filterable remote :remote-method="searchEmp" class="w140" size="small" v-model="choseItem.empId" placeholder="人员"  @change="getOption('emp')">
              <el-option
                v-for="item in emps"
                :key="item.key"
                :label="item.value"
                :value="item.key">
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
        depId:'init'
      }
    },
    data(){
      return{
        deps:[],
        emps:[],
        choseItem:{
          depId:'',
          empId:''
        }
      }
    },
    methods:{
      opera:function (type) {
        if(type==='close'){
          this.$emit('close')
        }else {
          this.$emit('submit',this.choseItem)
        }
      },
      close:function () {
        this.$emit('close')
      },
      //搜索人员
      searchEmp:function (val) {
        console.log(val)
      },
      //下拉选择
      getOption:function (type) {
        if(type==='dep'){

        }else {

        }
      }
    },
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
.dialog-container{
  padding: 20px 50px;
  >p{
    margin-bottom: @margin-15;
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
