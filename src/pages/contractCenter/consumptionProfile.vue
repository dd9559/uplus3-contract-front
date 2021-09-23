<template>
  <div class="consumptionProfile">
    <!-- 筛选查询 -->
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn" class="adjustbox">
      <el-form :inline="true" :model="downLoadForm" class="prop-form" size="small">
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
          <el-select v-model="downLoadForm.systemTag" class="w100" placeholder="请选择" @change="changeSystem" :clearable="true">
            <el-option v-for="item in systemTagSelect" :key="item.deptSystemtag" :label="item.deptSystemtagName" :value="item.deptSystemtag">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预警">
          <el-select v-model="downLoadForm.warnType" class="w100" placeholder="请选择" @change="changeSystem" :clearable="true">
            <el-option v-for="item in warnTypeSelect" :key="item.id" :label="item.name" :value="item.id">
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
            v-if="power['sign-ht-htsh-export'].state"
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
          <el-table-column  label="城市" align="center" prop="cityName"></el-table-column>
          <el-table-column  label="体系" align="center" prop="deptSystemtagName"></el-table-column>
          <el-table-column  label="线上合同剩余（份）" align="center" prop="onLineQuantity" >
            <template slot-scope="scope">
              <span :class="[scope.row.onLineQuantity <= scope.row.warnQuantity ?'colorRed':'']">{{scope.row.onLineQuantity}}</span>
            </template>
          </el-table-column>
          <el-table-column  label="无纸化合同剩余（份）" align="center" prop="paperlessQuantity">
            <template slot-scope="scope">
              <span :class="[scope.row.paperlessQuantity <= scope.row.warnQuantity ?'colorRed':'']">{{scope.row.paperlessQuantity}}</span>
            </template>
          </el-table-column>
          <el-table-column  label="可透支份数" align="center" prop="overdrawQuantity"></el-table-column>
          <el-table-column  label="预警额度" align="center" prop="warnQuantity"></el-table-column>
          <el-table-column  label="城市联系人" align="center">
            <template slot-scope="scope">
              {{scope.row.cityContactsName&&scope.row.cityContactsMobile ? scope.row.cityContactsName + '('+scope.row.cityContactsMobile+')' :'-'}}
            </template>
          </el-table-column>
          <el-table-column  label="商务联系人" align="center">
            <template slot-scope="scope">
              {{scope.row.businessContactsName&&scope.row.businessContactsMobile ? scope.row.businessContactsName + '('+scope.row.businessContactsMobile+')' :'-'}}
            </template>
          </el-table-column>
          <el-table-column  label="操作" align="center">
            <template slot-scope="scope">
              <span class="btn" @click="recharge(scope.row)" style="margin-right:5px;">充 值</span>
              <span class="btn" @click="edit(scope.row)" style="margin-left:5px;">编 辑</span>
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
        title="充值"
        :visible.sync="rechargeDialog"
        width="550px"
        :closeOnClickModal="$tool.closeOnClickModal"
        @close="rechargeCancel('rechargeDialog')"
      >
        <div class="rechargeBox">
          <el-form :model="dialogForm" class="prop-form" size="mini" label-position="left" label-width="90px">
              <div style="display: flex;margin-top: 10px;">
                <el-form-item label="城市" label-width="90px" >
                  <el-input style="width:100px" :disabled="true" v-model="dialogForm.cityName"></el-input>
                </el-form-item>
                <el-form-item label="体系" label-width="40px" style="margin-left:80px">
                  <el-input style="width:100px;" :disabled="true" v-model="dialogForm.deptSystemtagName"></el-input>
                </el-form-item>
              </div>
              <el-form-item label="无纸化合同">
                <el-input v-model="dialogForm.paperless" placeholder="请输入" style="width:100px" @input="cutNumber('paperless')" :clearable="true" maxlength="5"></el-input> 份
              </el-form-item>
              <el-form-item label="线上合同">
                <el-input v-model="dialogForm.onLine" placeholder="请输入" style="width:100px" @input="cutNumber('onLine')" :clearable="true" maxlength="5"></el-input> 份
              </el-form-item>
              <el-form-item label="付款金额">
                <el-input v-model="dialogForm.money" placeholder="请输入" style="width:100px" @input="cutNumber('money')" :clearable="true"></el-input> 元
              </el-form-item>
              <div class="stamp">
                <span class="label">收款凭证</span> 
                <div class="upload">
                  <ul>
                    <li v-show="uploadData.length >= 3" class="mask" @click="maxUpLoad"></li>
                    <li class="up-content">
                      <fileUp id="imgcontract" class="up" :rules="['png','jpg']" @getUrl="upload" :more="true" :picSize="true" :maxNum="3" :getNum="uploadData.length" :maxSize="2" :scane="{path:'other'}"><i>+</i></fileUp>
                      <p class="text">点击上传</p>
                    </li>
                    <template v-for="(item,index) in uploadData">
                      <el-tooltip effect="dark" :content="item.contractName" placement="bottom" :key="index">
                        <li>this.;
                          <div @click="previewPhoto(uploadList,index)">
                            <img :src="item.preConFile" width="90px" height="80px">
                          </div>
                          <p class="pic-name">{{item.contractName}}</p>
                          <span class="del" @click="delStamp(index)"><i class="el-icon-close"></i></span>
                        </li>
                      </el-tooltip>
                    </template>
                  </ul>
                </div>
              </div>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button round @click="rechargeCancel('rechargeDialog')">取消</el-button>
          <el-button round type="primary" v-dbClick @click="commit('rechargeDialog')">确定</el-button>
        </span>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        title="城市配置-编辑"
        :visible.sync="editDialog"
        width="590px"
        :closeOnClickModal="$tool.closeOnClickModal"
        @close="rechargeCancel('editDialog')"
      >
      <div class="editBox">
        <el-form :model="editForm" class="prop-form" size="mini" label-position="left" label-width="90px">
          <div style="display: flex;margin-top: 10px;">
            <el-form-item label="城市" label-width="90px" >
              <el-input style="width:100px" :disabled="true" v-model="editForm.cityName"></el-input>
            </el-form-item>
            <el-form-item label="体系" label-width="40px" style="margin-left:80px">
              <el-input style="width:100px;" :disabled="true" v-model="editForm.deptSystemtagName"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="可透支份数">
            <el-input style="width:100px" v-model="editForm.overdrawQuantity"
            @input="cutNumber('overdrawQuantity')" placeholder="请输入" maxlength="5" :clearable="true"></el-input>
          </el-form-item>
          <el-form-item label="预警额度">
            <el-input style="width:100px" placeholder="请输入" v-model="editForm.warnQuantity" @input="cutNumber('warnQuantity')" maxlength="5" :clearable="true"></el-input>
            <span>*无纸化和线上合同分开计算可使用份数</span>
          </el-form-item>
          <div style="display: flex;margin-top: 10px;">
            <el-form-item label="城市联系人" label-width="90px" >
              <el-input style="width:100px" placeholder="请输入" v-model="editForm.cityContactsName" :clearable="true"></el-input>
            </el-form-item>
            <el-form-item label="联系方式（手机号）" label-width="140px" style="margin-left:80px">
              <el-input style="width:120px;" placeholder="请输入" maxlength="11" @input="cityphone" 
              onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" type="number" v-model="editForm.cityContactsMobile" :clearable="true"></el-input>
            </el-form-item>
          </div>
          <div style="display: flex">
            <el-form-item label="商务联系人" label-width="90px" >
              <el-input style="width:100px" placeholder="请输入" v-model="editForm.businessContactsName" :clearable="true"></el-input>
            </el-form-item>
            <el-form-item label="联系方式（手机号）" label-width="140px" style="margin-left:80px">
              <el-input style="width:120px;" placeholder="请输入" maxlength="11" @input="businessphone" 
              onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" type="number" v-model="editForm.businessContactsMobile" :clearable="true"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="rechargeCancel('editDialog')">取消</el-button>
        <el-button round type="primary" v-dbClick @click="commit('editDialog')">确定</el-button>
      </span>
      </el-dialog>
    </div>
    <preview :imgList="previewFiles" v-if="preview" @close="preview=false"></preview>
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
          city:'',
          systemTag: "", //体系id
          warnType:""
        },
        dialogForm:{
          cityName:"",
          cityId:"",
          deptSystemtagName:"",
          deptSystemtagId:"",
          paperless:"",
          onLine:"",
          money:"",
        },
        editForm:{
          cityName:"",
          cityContactsName:"",
          cityId:"",
          cityContactsMobile:"",
          deptSystemtagName:"",
          deptSystemtagId:"",
          paperless:"",
          onLine:"",
          money:"",
          businessContactsName:"",
          businessContactsMobile:"",
          overdrawQuantity:""
        },
        warnTypeSelect:[
          {id:1,name:'未达到预警'},
          {id:2,name:'达到预警'}
        ],
        tableData:[],
        cityList:[],
        systemTagSelect:[],
        uploadData:[],
        uploadList: [],
        rechargeDialog:false,
        editDialog:false,
        currentPage: 1,
        pageSize:10,
        total:0,
        //权限配置
        power: {
          "sign-ht-htsh-export": {
              state: false,
              name: "导出"
          }
        }
      }
    },
    mounted() {
      this.dataInfo()
      // this.getSystemTagSelect();
      this.cityInfo()
    },
    methods:{
      dataInfo() {
        let params = {
          cityId:this.downLoadForm.city,
          deptSystemtag:this.downLoadForm.systemTag,
          pageNum:this.currentPage,
          pageSize:this.pageSize,
          warnType:this.downLoadForm.warnType
        }
        this.$ajax.postJSON("/api/contract/copies/setting/pageList",params).then(res=>{
          res = res.data
          if(res.status == 200) {
            const { list,total} = res.data
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
      changeSystem() {

      },
      clear() {
        this.downLoadForm.systemTag = ''
        this.systemTagSelect = []
      },
      recharge(row) {
        this.rechargeDialog = true
        let data = row
        this.dialogForm.cityName = data.cityName
        this.dialogForm.cityId = data.cityId
        this.dialogForm.deptSystemtagName = data.deptSystemtagName
        this.dialogForm.deptSystemtagId = data.deptSystemtag
      },
      businessphone(e) {
        if(e.length >= 11) {
          this.editForm.businessContactsMobile = e.slice(0,11)
        }
      },
      cityphone(e) {
        if(e.length >= 11) {
          this.editForm.cityContactsMobile = e.slice(0,11)
        }
      },
      edit(row){
        this.editDialog = true
        let data = row
        console.log(data);
        this.editForm = Object.assign({},this.editForm,data)
        console.log(this.editForm);
        this.editForm.cityName = data.cityName
        this.editForm.cityId = data.cityId
        this.editForm.deptSystemtagName = data.deptSystemtagName
        this.editForm.deptSystemtagId = data.deptSystemtag
      },
      citySelect(i) {
        console.log(i.deptSystemTagList);
        this.systemTagSelect = i.deptSystemTagList
      },
      cutNumber(val) {
        switch(val) {
          case 'paperless':
            this.$nextTick(() => {
              this.dialogForm.paperless = this.$tool.numberInput(this.dialogForm.paperless);
            });
            break
          case 'onLine':
            this.$nextTick(() => {
              this.dialogForm.onLine = this.$tool.numberInput(this.dialogForm.onLine);
            });
            break
          case 'money' :
            this.$nextTick(() => {
              this.dialogForm.money = this.$tool.cutFloat({
                  val: this.dialogForm.money,
                  max: 99999.99
              });
            });
            break
          case 'overdrawQuantity':
            this.$nextTick(() => {
              this.editForm.overdrawQuantity = this.$tool.numberInput(this.editForm.overdrawQuantity);
            });
            break
          case 'warnQuantity':
            this.$nextTick(() => {
              this.editForm.warnQuantity = this.$tool.numberInput(this.editForm.warnQuantity);
            });
            break
          case 'businessContactsName':
            this.$nextTick(() => {
              this.editForm.businessContactsMobile = this.$tool.numberInput(this.editForm.businessContactsMobile);
            });
            break
        }
      },
      getExcel() {
        this.excelCreate('/contract/copies/setting/export')
      },
      maxUpLoad() {
        if (this.uploadData.length >= 3) {
          return this.$message({
            message: '最多上传3张图片',
            type: 'warning'
          })
        }
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.dataInfo();
      },
      // 电子签章上传成功 获取存储路径和文件名称
      upload(obj) {
        console.log(obj);
        obj.param.map(item => {
          let addData = {}
          addData.contractSign = item.path+`?${item.name}`
          addData.contractName = item.name
          let preloadList = [item.path]
          this.fileSign(preloadList, 'preload').then(res => {
            console.log(res);
            addData.preConFile = res[0]
            this.uploadList.push({
              fileType: this.$tool.get_suffix(item.path),
              name: item.name,
              path: item.path
            })
            this.uploadData.push(addData)
          })
          console.log(this.uploadList);
        })
      },
      // 删除电子签章
      delStamp(index) {
        this.$delete(this.uploadData,index)
        this.$delete(this.uploadList,index)
      },
      rechargeCancel(val) {
        if(val == 'rechargeDialog') {
          this.rechargeDialog = false
          TOOL.clearForm(this.dialogForm);
          this.uploadData = []
        }else if(val == 'editDialog') {
          this.editDialog = false
          TOOL.clearForm(this.editForm);
        }
        
      },
      commit(val) {
        if(val == 'rechargeDialog') {
          if(this.dialogForm.paperless.length <= 0 && Number(this.dialogForm.paperless) >= 0 ) {
            this.$message.error('无纸化合同不能为空！')
            return
          }else if(this.dialogForm.onLine.length <= 0) {
            this.$message.error('线上合同不能为空！')
            return
          }else if(!Number(this.dialogForm.money)) {
            this.$message.error('付款金额不能为0元或者不能为空！')
            return
          }else if(this.uploadData.length == 0){
            this.$message.error('收款凭证不能为空！')
            return
          }
          let params = {
            cityId:this.dialogForm.cityId,
            deptSystemtag:this.dialogForm.deptSystemtagId,
            money:this.dialogForm.money,
            onLineQuantity:this.dialogForm.onLine,
            paperlessQuantity:this.dialogForm.paperless
          }
          if (this.uploadData.length > 0) {
            params.annex = this.uploadData.map(item => item.contractSign)
          }
          this.$ajax.postJSON('/api/contract/copies/recharge/save',params).then(res =>{
            res  = res.data
            if(res.status == 200) {
              this.$message.success('充值成功')
              this.dataInfo()
              this.rechargeCancel('rechargeDialog')
              // this.rechargeDialog = false
              // TOOL.clearForm(this.dialogForm);
            }
          }).catch(err => {
            this.$message.error(err)
          })
        }else if(val == 'editDialog') {
          let reg = /^1[0-9]{10}$/
          if(this.editForm.overdrawQuantity.length <= 0) {
            this.$message.error('可透支份数不能为空！')
            return
          }else if(this.editForm.warnQuantity.length <= 0) {
            this.$message.error('预警额度不能为空！')
            return
          }else if(!this.editForm.cityContactsName) {
            this.$message.error('城市联系人不能为空！')
            return
          }else if(!this.editForm.businessContactsName) {
            this.$message.error('商务联系人不能为空！')
            return
          }else if(!reg.test(this.editForm.businessContactsMobile) || !reg.test(this.editForm.cityContactsMobile) ) {
            this.$message.error('电话号码格式不正确或者不能为空！')
            return
          }
          let params = {
            businessContactsMobile:this.editForm.businessContactsMobile,
            businessContactsName:this.editForm.businessContactsName,
            cityContactsMobile:this.editForm.cityContactsMobile,
            cityContactsName:this.editForm.cityContactsName,
            cityId:this.editForm.cityId,
            deptSystemtag:this.editForm.deptSystemtagId,
            overdrawQuantity:this.editForm.overdrawQuantity,
            warnQuantity:this.editForm.warnQuantity,
          }
          this.$ajax.postJSON('/api/contract/copies/setting/update',params).then(res=>{
            console.log(res);
            res  = res.data
            if(res.status == 200) {
              this.$message.success('编辑成功')
              this.dataInfo()
              this.rechargeCancel('editDialog')
            }
          }).catch(err => {
            this.$message.error(err)
          })
        }
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
  .consumptionProfile {
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
      .colorRed {
        color: red;
      }
    }
    /deep/.el-dialog__body {
      .rechargeBox {
        .stamp {
          display: flex;
          margin: 20px 0;
          .label {
            display: inline-block;
            width: 70px;
            // padding-left: 20px;
            padding-right: 12px;
            font-size: 14px;
            font-weight: 500;
          }
          .upload {
            display: inline-block;
            width: 430px;
            vertical-align: text-top;
            ul {
              display: flex;
              flex-wrap: wrap;
              .mask {
                position: absolute;
                opacity: 0;
                z-index: 99;
              }
              li {
                width: 120px;
                height: 120px;
                border-radius: 7px;
                box-sizing: border-box;
                color: #8492a6;
                background-color: #f2f3f8;
                border: 1px dashed #dedde2;
                margin: 0 10px;
                margin-bottom: 10px;
                position: relative;
                cursor: pointer;
                text-align: center;
                div {
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%,-50%);
                }
                p {
                  position: absolute;
                  font-size: 12px;
                  bottom: -30px;
                  color: #233241;
                  width: 120px;
                  height: 48px;
                  text-align: center;
                  z-index: 10;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  word-wrap: break-word;
                }
                .del {
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    background-color: #f56c6c;
                    border-radius: 50%;
                    right: 8px;
                    top: 8px;
                    text-align: center;
                    line-height: 20px;
                    color: #fff;
                    display: none;
                }
                &:hover {
                  .del {
                    display: block;
                  }
                }
              }
              .up-content {
                width: 120px;
                height: 120px;
                padding: 28px 34px 20px 34px;
                border: 1px dashed #dedde2;
                background-color: #fff;
                border-radius: 7px;
                box-sizing: border-box;
                color: #8492a6;
                .up {
                  width: 50px;
                  height: 50px;
                  line-height: 50px;
                  margin-bottom: 10px;
                  background: #eef2fb;
                  border-radius: 4px;
                  color: #fff;
                  font-size: 40px;
                  font-weight: bold;
                  text-align: center;
                }
              }
              .text {
                color: #8492a6;
                font-size: 12px;
                text-align: left;
              }
            }
          }
        }
      }
    }
    /deep/.el-dialog__footer {
      .dialog-footer {
        /deep/.is-round{
          padding: 9px 15px;
        }
      }
    }
  }
</style>