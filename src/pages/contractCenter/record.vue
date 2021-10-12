<template>
  <div class="record">
     <!-- 筛选查询 -->
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn" class="adjustbox">
      <el-form :inline="true" :model="downLoadForm" class="prop-form" size="small">
        <el-form-item label="充值日期">
          <el-date-picker
            v-model="downLoadForm.signData"
            type="monthrange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            format="yyyy-MM"
            value-format="yyyy-MM"
            style="width:330px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="城市">
          <el-select v-model="downLoadForm.city" filterable placeholder="请选择" :clearable="true" @clear="clear">
            <el-option
              v-for="item in cityList"
              :key="item.cityId"
              :label="item.cityName"
              :value="item.cityId"
              @click.native=citySelect(item)
              >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="体系">
          <el-select v-model="downLoadForm.systemTag" class="w100" placeholder="请选择" :clearable="true">
            <el-option v-for="item in systemTagSelect" :key="item.deptSystemtag" :label="item.deptSystemtagName" :value="item.deptSystemtag">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </ScreeningTop>
    <div class="contract">
      <div class="listTitle">
        <div>
          <span class="title">
            <i class="iconfont icon-tubiao-11"></i>数据列表
          </span>
        </div>
        <div class="float-right">
          <el-button class="btn-info"
            round
            type="primary"
            size="small"
            v-dbClick
            @click="getExcel">导出</el-button>
        </div>
      </div>
      <div>
        <el-table
          :data="tableData"
          header-row-class-name="theader-bg"
          width="400px"
          class="submit-dialog"
          border>
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column  label="充值日期" align="center">
            <template slot-scope="scope">
              {{scope.row.createTime|formatDate}}
            </template>
          </el-table-column>
          <el-table-column label="城市" align="center" prop="cityName"></el-table-column>
          <el-table-column label="体系" align="center" prop="deptSystemtagName"></el-table-column>
          <el-table-column label="无纸化合同充值（份）" align="center" prop="paperlessQuantity"></el-table-column>
          <el-table-column  label="线上合同充值（份）" align="center" prop="onLineQuantity"></el-table-column>
          <el-table-column  label="付款金额（元）" align="center" prop="money"></el-table-column>
          <el-table-column  label="状态" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.status == 10?'正常':'已撤销'}}</span>
            </template>
          </el-table-column>
          <el-table-column  label="操作人" align="center" >
            <template slot-scope="scope">
              <!-- <span>{{scope.row.empDeptName&&scope.row.empName?scope.row.empDeptName+'-'+scope.row.empName:'-'}}</span> -->
              <span>{{`${scope.row.empDeptName?scope.row.empDeptName:''}`+`${scope.row.empDeptName&&scope.row.empName?'--':''}`+`${scope.row.empName?scope.row.empName:''}`}}</span>
            </template>
          </el-table-column>
          <el-table-column  label="撤销人" align="center">
            <template slot-scope="scope">
              <!-- <span>{{scope.row.revokeDeptName+'-'+scope.row.revokeEmpName}}</span> -->
              <span>{{`${scope.row.revokeDeptName?scope.row.revokeDeptName:''}`+`${scope.row.revokeDeptName&&scope.row.revokeEmpName?'--':''}`+`${scope.row.revokeEmpName?scope.row.revokeEmpName:''}`}}</span>
            </template>
          </el-table-column>
          <el-table-column  label="付款凭证" align="center">
            <template slot-scope="scope">
              <span class="btn" @click="check(scope.row)" style="margin-right:5px;" v-if="scope.row.annex !== 'null'">点击查看</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column  label="备注" align="center" prop="remarks"></el-table-column>
          <el-table-column  label="操作" align="center">
            <template slot-scope="scope">
              <span class="btn" @click="revoke(scope.row)" style="margin-right:5px;" v-if="scope.row.createTime + 8.64e7*2 >= new Date().getTime() && scope.row.status == 10">撤 销</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="tableData.length > 0">
          <el-pagination
            class="pagination-info"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <div>
      <el-dialog
        title="撤销"
        :visible.sync="revokeDialog"
        width="550px"
        :closeOnClickModal="$tool.closeOnClickModal"
        @close="rechargeCancel"
      >
      <div class="revokeBox">
        <el-form :model="editForm" class="prop-form" size="mini" label-position="right" label-width="100px">
          <el-form-item label="充值日期：" >
            <span>{{editForm.createTime | formatTime}}</span>
          </el-form-item>
          <el-form-item label="城市：">
            <span>{{editForm.cityName}}</span>
          </el-form-item>
          <el-form-item label="体系：">
            <span>{{editForm.deptSystemtagName}}</span>
          </el-form-item>
          <el-form-item label="无纸化合同：">
            <span>{{editForm.paperlessQuantity}}</span>
          </el-form-item>
          <el-form-item label="线上合同：">
            <span>{{editForm.onLineQuantity}}</span>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input type="textarea" resize="none"  placeholder="请输入内容" v-model="editForm.remark" maxlength="225" show-word-limit>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="rechargeCancel">取消</el-button>
        <el-button round type="primary" v-dbClick @click="commit">确定</el-button>
      </span>
      </el-dialog>
    </div>
    <preview :imgList="list" v-if="preview" @close="preview=false"></preview>
  </div>
</template>

<script>
  import ScreeningTop from '@/components/ScreeningTop';
  import {TOOL} from "@/assets/js/common";
  import { MIXINS } from "@/assets/js/mixins";
  export default {
    mixins: [MIXINS],
    components:{
      ScreeningTop
    },
    data() {
      return {
        downLoadForm:{
          signData:"",
          city:"",
          systemTag: "", //体系id
        },
        tableData:[],
        cityList:[],
        systemTagSelect:[],
        revokeDialog:false,
        total:0,
        currentPage: 1,
        pageSize:10,
        editForm:{
          remark:'',
          id:''
        },
        list:[],
        //权限
        power: {
          "sign-ht-core-czinfo-revoke": {
            state: false,
            name: "撤销",
          },
          "sign-ht-core-czinfo-export": {
            state: false,
            name: "导出",
          },
        }
      }
    },
    mounted() {
      this.dataInfo()
      this.cityInfo()
    },
    methods:{
      dataInfo() {
        let years = "",months = ""
        if(!this.downLoadForm.signData) {
          this.downLoadForm.signData = []
        }
        let params = {
          cityId:this.downLoadForm.city,
          deptSystemtag:this.downLoadForm.systemTag,
          pageNum:this.currentPage,
          pageSize:this.pageSize
        }
        if(this.downLoadForm.signData.length) {
          years = this.downLoadForm.signData[1].split('-')[0]
          months = this.downLoadForm.signData[1].split('-')[1]
          params.beginDate=this.downLoadForm.signData[0]+'-1',
          params.endDate=this.downLoadForm.signData[1]+'-'+new Date(years,months,0).getDate()
        }
        this.$ajax.postJSON('/api/contract/copies/recharge/pageList',params).then(res=>{
          res = res.data
          if(res.status == 200) {
            const {list,total} = res.data
            this.tableData = list
            this.total = total
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      cityInfo() {
        this.$ajax.get('/api/contract/copies/recharge/cityList').then(res=>{
          res = res.data
          if(res.status == 200) {
            this.cityList = res.data
          }
        })
      },
      clear() {
        this.downLoadForm.systemTag = ''
        this.systemTagSelect = []
      },
      check(row) {
        let annex= JSON.parse(row.annex)
        this.fileSign(annex, "preload",false).then(res => {
          this.list = res
          this.preview = true
        });
        // console.log(a);
        // this.previewPhoto(a,0)
        // previewPhoto(item.value,index_,3)
      },
      commit() {
        if(!this.editForm.remark) {
          this.$message.error('请填写备注!')
          return
        }
        let params = {
          id:this.editForm.id,
          remarks:this.editForm.remark
        }
        this.$ajax.get('/api/contract/copies/recharge/revoke',params).then(res=>{
          res= res.data
          if(res.status == 200) {
            this.rechargeCancel()
            this.dataInfo()
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      //翻页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.dataInfo();
      },
      citySelect(i) {
        console.log(i.deptSystemTagList);
        this.systemTagSelect = i.deptSystemTagList
      },
      revoke(row) {
        this.revokeDialog = true
        let data = row
        this.editForm = Object.assign({},this.editForm,data)
        this.editForm.id = data.id
      },
      getExcel() {
        let years = "",months = ""
        let param = {
          cityId:this.downLoadForm.city,
          deptSystemtag:this.downLoadForm.systemTag,
        }
        if(this.downLoadForm.signData && this.downLoadForm.signData.length) {
          years = this.downLoadForm.signData[1].split('-')[0]
          months = this.downLoadForm.signData[1].split('-')[1]
          param.beginDate = this.downLoadForm.signData[0]+'-1',
          param.endDate = this.downLoadForm.signData[1]+'-'+new Date(years,months,0).getDate()
        }
        this.excelCreate('/contract/copies/recharge/export',param)
      },
      rechargeCancel() {
        this.revokeDialog = false
        this.editForm.remark = ''
        // TOOL.clearForm(this.editForm);
        // this.currentPage = 1;
      },
      //查询
      queryFn() {
        this.dataInfo()
      },
      //重置
      resetFormFn() {
        TOOL.clearForm(this.downLoadForm);
        this.currentPage = 1;
        // this.initTimePicker()
        // this.EmployeList = []
      },
    }
  }
</script>

<style lang="less" scoped>
@import "~@/assets/common.less";
.record {
  .contract {
      padding: 0 10px;
      border-radius: 2px;
      > .listTitle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
        .title {
          font-size: 14px;
          color: @color-blank;
          i {
            padding-right: 8px;
          }
        }
      }
      .btn {
        color: @color-blue;
        cursor: pointer;
      }
  }
  .revokeBox {
    /deep/ .el-form {
      .el-form-item  {
        margin-bottom: 12px;
      }
      .el-textarea {
        width: 200px;
        .el-textarea__inner {
          min-height: 200px !important;
        }
      }
    }
  }
}
</style>