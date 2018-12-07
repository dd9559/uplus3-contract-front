<template>
  <div>
    <div class="dialog1">
      <el-dialog :visible.sync="shows" :before-close="handleClose" :close-on-click-modal="false" custom-class="base-dialog">
        <!-- 头部右边关闭按钮 -->
        <b class="el-icon-close" @click="closeDialog"></b>
        <!-- 头部左边业绩分成title -->
        <div class="ach-header">
          <h1 v-if="dialogType==0" class="f14">业绩审核</h1>
          <h1 v-if="dialogType==1">业绩编辑</h1>
          <h1 v-if="dialogType==2">业绩反审核</h1>
          <h1 v-if="dialogType==3" style="fontSize:20px;">业绩分成</h1>
          <p>
            可分配业绩：
            <span class="orange">{{comm}}元</span>
          </p>
        </div>

        <!-- 房源列表 -->
        <div class="ach-body">
          <div class="house-divide">
            <div class="house-left f_l">
              <h1 class="f14">房源方分成</h1>
            </div>
            <div class="house-right f_r">
              <el-button type="primary" @click="houseRelativeMans">相关人员</el-button>
              <el-button type="primary" @click="addMansHouse">添加分配人</el-button>
            </div>
          </div>

          <div class="ach-divide-list">
            <el-table :data="houseArr" style="width: 100%">
              <el-table-column label="角色类型" width="160">
                <template slot-scope="scope">
                  <!-- filterable -->
                  <el-select v-model="scope.row.roleType" placeholder="请选择">
                    <el-option
                      v-for="item in roleType0"
                      :key="item.id"
                      :label="item.description"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="分成比例" width="100">
                <template slot-scope="scope">
                  <el-input
                    v-model.number="scope.row.ratio"
                    placeholder="请输入数字"
                    @change="filterHouseNumber(scope.row.ratio,scope.$index)"
                  ></el-input>
                </template>
              </el-table-column>

              <el-table-column label="经纪人" width="140">
                <template slot-scope="scope">
                  <el-autocomplete
                    class="inline-input"
                    v-model="scope.row.assignor"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入内容"
                    :trigger-on-focus="false"
                    @select="((item)=>{ handleSelectDeal(item, scope.$index,1)}) "
                  ></el-autocomplete>
                </template>
              </el-table-column>

              <el-table-column label="在职状况" width="110">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.isJob.label" placeholder="请选择">
                    <el-option
                      v-for="item in dictionary['20']"
                      :key="item.value"
                      :label="item.label"
                      @select="handleSelect"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="门店" width="140">
                <template slot-scope="scope">
                  <el-autocomplete
                    class="inline-input"
                    v-model="scope.row.level3"
                    :fetch-suggestions="queryInfo(3)"
                    placeholder="请输入内容"
                    :trigger-on-focus="false"
                    @select="handleSelect"
                  ></el-autocomplete>
                </template>
              </el-table-column>

              <el-table-column label="店长" width="140">
                <template slot-scope="scope">
                  <el-autocomplete
                    class="inline-input"
                    v-model="scope.row.shopkeeper"
                    :fetch-suggestions="queryInfo(2)"
                    placeholder="请输入内容"
                    :trigger-on-focus="false"
                    @select="handleSelect"
                  ></el-autocomplete>
                </template>
              </el-table-column>

              <el-table-column label="单组" width="150">
                <template slot-scope="scope">
                  <el-autocomplete
                    class="inline-input"
                    v-model="scope.row.level4"
                    :fetch-suggestions="queryInfo(4)"
                    placeholder="请输入内容"
                    :trigger-on-focus="false"
                    @select="handleSelect"
                  ></el-autocomplete>
                </template>
              </el-table-column>

              <el-table-column label="区经" width="100">
                <template slot-scope="scope">
                  <el-autocomplete
                    class="inline-input"
                    v-model="scope.row.amaldar"
                    :fetch-suggestions="queryInfo(1)"
                    placeholder="请输入内容"
                    :trigger-on-focus="false"
                    @select="handleSelect"
                  ></el-autocomplete>
                </template>
              </el-table-column>

              <el-table-column label="区总" width="100">
                <template slot-scope="scope">
                  <el-autocomplete
                    class="inline-input"
                    v-model="scope.row.manager"
                    :fetch-suggestions="queryInfo(0)"
                    placeholder="请输入内容"
                    :trigger-on-focus="false"
                    @select="handleSelect"
                  ></el-autocomplete>
                </template>
              </el-table-column>

              <el-table-column label="门店/公司公共业绩" width="170">
                <template slot-scope="scope">
                  <el-radio-group v-model="scope.row.place">
                    <el-radio :label="0">门店</el-radio>
                    <el-radio :label="1">公司</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>

              <el-table-column prop="manager" label="操作" width="80">
                <template slot-scope="scope">
                  <a
                    class="delete"
                    style="color:#478de3;text-decoration:underline;"
                    @click="deleteHouse(scope.$index,houseArr,scope.row.id)"
                  >删除</a>
                  <!-- <a href="javascript:;" class="delete" style="color:#478de3;" @click="delete(index)">删除</a> -->
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="house-divide">
            <div class="house-left f_l">
              <h1 class="f14">客源方分成</h1>
            </div>
            <div class="house-right f_r">
              <el-button type="primary" @click="clientRelativeMans">相关人员</el-button>
              <el-button type="primary" @click="addMansClient">添加分配人</el-button>
            </div>
          </div>

          <div class="ach-divide-list">
            <el-table :data="clientArr" style="width: 100%">
              <el-table-column label="角色类型" width="160">
                <template slot-scope="scope">
                  <!-- filterable -->
                  <el-select v-model="scope.row.roleType" placeholder="请选择">
                    <el-option
                      v-for="item in roleType1"
                      :key="item.id"
                      :label="item.description"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="分成比例" width="100">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.ratio"
                    placeholder="请输入数字"
                    @change="filterClientNumber(scope.row.ratio,scope.$index)"
                  ></el-input>
                </template>
              </el-table-column>

              <el-table-column label="经纪人" width="140">
                <template slot-scope="scope">
                  <el-autocomplete
                    class="inline-input"
                    v-model="scope.row.assignor"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入内容"
                    :trigger-on-focus="false"
                    @select="((item)=>{ handleSelectDeal(item, scope.$index,2)})"
                  ></el-autocomplete>
                </template>
              </el-table-column>

              <el-table-column label="在职状况" width="110">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.isJob.label" placeholder="请选择">
                    <el-option
                      v-for="item in dictionary['20']"
                      :key="item.value"
                      :label="item.label"
                      @select="handleSelect"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="门店" width="140">
                <template slot-scope="scope">
                  <el-autocomplete
                    class="inline-input"
                    v-model="scope.row.level3"
                    :fetch-suggestions="queryInfo(3)"
                    placeholder="请输入内容"
                    :trigger-on-focus="false"
                    @select="handleSelect"
                  ></el-autocomplete>
                </template>
              </el-table-column>

              <el-table-column label="店长" width="140">
                <template slot-scope="scope">
                  <el-autocomplete
                    class="inline-input"
                    v-model="scope.row.shopkeeper"
                    :fetch-suggestions="queryInfo(2)"
                    placeholder="请输入内容"
                    :trigger-on-focus="false"
                    @select="handleSelect"
                  ></el-autocomplete>
                </template>
              </el-table-column>

              <el-table-column label="单组" width="150">
                <template slot-scope="scope">
                  <el-autocomplete
                    class="inline-input"
                    v-model="scope.row.level4"
                    :fetch-suggestions="queryInfo(4)"
                    placeholder="请输入内容"
                    :trigger-on-focus="false"
                    @select="handleSelect"
                  ></el-autocomplete>
                </template>
              </el-table-column>

              <el-table-column label="区经" width="100">
                <template slot-scope="scope">
                  <el-autocomplete
                    class="inline-input"
                    v-model="scope.row.amaldar"
                    :fetch-suggestions="queryInfo(1)"
                    placeholder="请输入内容"
                    :trigger-on-focus="false"
                    @select="handleSelect"
                  ></el-autocomplete>
                </template>
              </el-table-column>

              <el-table-column label="区总" width="100">
                <template slot-scope="scope">
                  <el-autocomplete
                    class="inline-input"
                    v-model="scope.row.manager"
                    :fetch-suggestions="queryInfo(0)"
                    placeholder="请输入内容"
                    :trigger-on-focus="false"
                    @select="handleSelect"
                  ></el-autocomplete>
                </template>
              </el-table-column>

              <el-table-column label="门店/公司公共业绩" width="170">
                <template slot-scope="scope">
                  <el-radio-group v-model="scope.row.place">
                    <el-radio :label="0">门店</el-radio>
                    <el-radio :label="1">公司</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>

              <el-table-column prop="manager" label="操作" width="80">
                <template slot-scope="scope">
                  <a
                    class="delete"
                    style="color:#478de3;text-decoration:underline;"
                    @click="deleteClient(scope.$index,clientArr,scope.row.id)"
                  >删除</a>
                  <!-- <a href="javascript:;" class="delete" style="color:#478de3;" @click="delete(index)">删除</a> -->
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 业绩审核底部 -->
        <div class="ach-footer" v-if="dialogType==0">
          <p>备注：
            <el-input type="textarea" :rows="2" placeholder="请输入内容" class="f_l" v-model="remark"></el-input>
          </p>
          <div class="footer-btn-layout f_r">
            <el-button type="primary" round @click="passAch" class="color-green">通过</el-button>
            <el-button type="primary" round @click="rejectAch" class="color-red">驳回</el-button>
          </div>
        </div>

        <!-- 业绩编辑底部 -->
        <div class="ach-footer" v-if="dialogType==1">
          <div class="footer-btn-layout f_r">
              <el-button type="primary" round @click="closeDialog" class="color-white">保存</el-button>
              <el-button type="primary" round @click="keepAchDivide" class="color-blue">保存并提交</el-button>
          </div>
        </div>
        <!-- 业绩反审核底部 -->
        <div class="ach-footer" v-if="dialogType==2">
          <p class="f_l">审核日期：
            <el-date-picker
              v-model="examineDate"
              type="date"
              placeholder="选择日期"
              value-format="timestamp"
            ></el-date-picker>
          </p>
          <div class="footer-btn-layout f_r">
            <el-button
              type="primary"
              round
              @click="keepAch(1)"
              class="color-blue"
              style="margin-top:20px;"
            >保存</el-button>
          </div>
        </div>

        <!-- 业绩分成底部      -->
        <div class="ach-footer" v-if="dialogType==3">
          <div class="footer-btn-layout f_r">
            <el-button type="primary" round @click="closeDialog" class="color-white">保存</el-button>
            <el-button type="primary" round @click="keepAchDivide" class="color-blue">保存并提交</el-button>
          </div>
        </div>

        <div class="dialog2" :close-on-click-modal="false">
          <el-dialog :visible.sync="showTips" append-to-body custom-class="dialog2In">
            <h1>选择相关人员</h1>
            <div class="mansList">
              <el-table
                :data="mansList"
                style="width: 100%"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="70"></el-table-column>

                <el-table-column label="经纪人" width="90">
                  <template slot-scope="scope">
                    <p>{{scope.row.assignor}}</p>
                  </template>
                </el-table-column>

                <el-table-column label="门店" width="120">
                  <template slot-scope="scope">
                    <p>{{scope.row.level3}}</p>
                  </template>
                </el-table-column>

                <el-table-column label="角色类型" width="120">
                  <template slot-scope="scope">
                    <p>{{scope.row.roleName}}</p>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <div class="dialog2-btn f_r">
              <el-button type="primary" round @click="showTips = false">取消</el-button>
              <el-button type="primary" round @click="manSure(type)">确定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { MIXINS } from "@/assets/js/mixins";
export default {
  mixins: [MIXINS],
  name: "achDialog",
  data() {
    return {
      houseArr: [], //房源列表
      clientArr: [], //客源列表
      mansList: [], //人员列表
      houseMansArr: [], //相关人员房源列表
      clientMansArr: [], //相关人员客源列表
      examineDate: "", //审核时间
      showTips: false,
      roleType0: [], //房源角色类型
      roleType1: [], //客源角色类型
      comm: "", //可分配业绩
      addManList: [],
      dictionary: {
        //数据字典
        "20": "" //员工状态
      },
      type: "", //房源1 客源2
      remark: "",
      agendIds: [],
      addArr: []
    };
  },
  created() {},
  props: {
    shows: Boolean,
    dialogType: Number, //弹框类型
    contractCode: String, //合同编号
    aId: Number, //业绩Id
    achIndex: Number, //当前索引
    achObj: Object //合同详情传过来的对象（首次业绩录入需要用）
  },
  methods: {
    handleClose() {
      this.$emit("close");
      this.agendIds = [];
    },
    //判断分成比例只能输入1-100的正整数
    filterHouseNumber(val, index) {
      if (val > 100) {
        this.houseArr[index].ratio = 100;
      } else {
        val = val.toString().match(/^\d*\.?\d?/)[0];
        this.houseArr[index].ratio = val;
      }
    },
    filterClientNumber(val, index) {
      if (val > 100) {
        this.clientArr[index].ratio = 100;
      } else {
        val = val.toString().match(/^\d*\.?\d?/)[0];
        this.clientArr[index].ratio = val;
      }
    },
    //获取房源客源相关人员
    getMans(type) {
      let param = {
        contCode: this.contractCode
      };
      this.$ajax.get("/api/achievement/employees", param).then(res => {
        this.showTips = true;
        let data = res.data;
        if (data.status === 200) {
          if (type == 1) {
            this.mansList = data.data.houseAgents;
          } else {
            this.mansList = data.data.customerAgents;
          }
        }
      });
    },
    // 房源选择相关人
    houseRelativeMans() {
      this.type = 1;
      this.mansList = [];
      this.getMans(this.type);
    },
    // 客源选择相关人
    clientRelativeMans() {
      this.mansList = [];
      this.type = 2;
      this.getMans(this.type);
    },
    // 添加房源经纪人
    addMansHouse() {
      let obj = {
        amaldar: "",
        assignor: "",
        isJob: {
          label: "",
          value: ""
        },
        level3: "",
        level4: "",
        manager: "",
        place: "",
        ratio: "",
        roleType: "",
        shopkeeper: "",
        amaldarId: "",
        managerId: "",
        shopkeeperId: "",
        platformFeeRatio: "",
        contractId: this.achObj.contractId,
        contractCode: this.contractCode
      };
      this.houseArr.push(obj);
      this.addArr.push(obj);
    },
    // 添加客源经纪人
    addMansClient() {
      console.log(this.clientArr);
      let obj = {
        amaldar: "",
        assignor: "",
        isJob: {
          label: "",
          value: ""
        },
        level3: null,
        level4: "",
        manager: "",
        place: "",
        ratio: "",
        roleType: "",
        shopkeeper: "",
        amaldarId: "",
        managerId: "",
        shopkeeperId: "",
        platformFeeRatio: "",
        contractId: this.achObj.contractId,
        contractCode: this.contractCode
      };
      this.clientArr.push(obj);
      this.addArr.push(obj);
    },
    // 删除按钮
    deleteHouse(index, rows, id) {
      this.agendIds.push(id);
      rows.splice(index, 1);
    },
    deleteClient(index, rows, id) {
      this.agendIds.push(id);
      rows.splice(index, 1);
    },
    noData() {
      if (this.houseArr.length == 0 || this.clientArr.length == 0) {
        this.$message("分成人不满足最低人数要求");
        return false;
      }
    },
    // 弹框通过操作
    passAch() {
      if (this.houseArr.length == 0 || this.clientArr.length == 0) {
        this.$message("分成人不满足最低人数要求");
        return false;
      }
      let resultArr = this.houseArr.concat(this.clientArr);
      console.log(resultArr);
      let flag = true,
        sum = 0,
        sumFlag = false;
      for (var i = 0; i < resultArr.length; i++) {
        sum = parseFloat(sum) + parseFloat(resultArr[i].ratio);
        if (
          resultArr[i].roleName === "" ||
          resultArr[i].ratio === "" ||
          resultArr[i].assignor === "" ||
          resultArr[i].isJob.label === "" ||
          resultArr[i].level3 === "" ||
          resultArr[i].shopkeeper === "" ||
          resultArr[i].level4 === "" ||
          resultArr[i].amaldar === "" ||
          resultArr[i].manager === ""
        ) {
          flag = false;
        } else if (sum == 100) {
          sumFlag = true;
        } else {
          sumFlag = false;
        }
      }
      //flag=true代表信息都填完整，flag=false代表还有信息没有填
      // debugger;
      // console.log(sumFlag);

      if (flag && sumFlag) {
        // this.$emit("close", this.achIndex, 1);
        // this.$message("操作完成");
        let param = {
          id: this.aId,
          remark: this.remark,
          distributions: resultArr,
          agendIds: this.agendIds,
          contractId: this.achObj.contractId
        };
        this.$ajax
          .postJSON("/api/achievement/examineAdopt", param)
          .then(res => {
            console.log(res.data.status);
            if (res.data.status == 200) {
              this.$message("操作完成");
              this.$emit("close", this.achIndex, 7);
            } else if (res.data.status != 200) {
              this.$message(res.data.message);
            }
          });
      } else if (!sumFlag) {
        this.$message("请输入正确的分成比例");
      } else {
        this.$message("请完善信息");
      }
    },
    //弹框驳回操作
    rejectAch() {
      if (this.houseArr.length == 0 || this.clientArr.length == 0) {
        this.$message("分成人不满足最低人数要求");
        return false;
      }
      let resultArr = this.houseArr.concat(this.clientArr);
      let flag = true,
        sum = 0,
        sumFlag = false;
      for (var i = 0; i < resultArr.length; i++) {
        sum = parseFloat(sum) + parseFloat(resultArr[i].ratio);
        if (
          resultArr[i].roleName === "" ||
          resultArr[i].ratio === "" ||
          resultArr[i].assignor === "" ||
          resultArr[i].isJob.label === "" ||
          resultArr[i].level3 === "" ||
          resultArr[i].shopkeeper === "" ||
          resultArr[i].level4 === "" ||
          resultArr[i].amaldar === "" ||
          resultArr[i].manager === ""
        ) {
          flag = false;
        } else if (sum == 100) {
          sumFlag = true;
        } else {
          sumFlag = false;
        }
      }
      // debugger;
      console.log(sum);
      if (flag && sumFlag && this.remark != "") {
        let param = {
          id: this.aId,
          remark: this.remark,
          distributions: resultArr,
          agendIds: this.agendIds,
          contractId: this.achObj.contractId
        };
        this.$ajax
          .postJSON("/api/achievement/examineReject", param)
          .then(res => {
            console.log(res.data.status);
            if (res.data.status == 200) {
              this.$message("操作完成");
              this.$emit("close", this.achIndex, 8);
            } else if (res.data.status != 200) {
              this.$message(res.data.message);
            }
          });
      } else if (!sumFlag) {
        this.$message("请输入正确的分成比例");
      } else if (this.remark == "") {
        this.$message("请填写备注");
      } else {
        this.$message("请完善信息");
      }
    },
    // 反审核，编辑的保存
    keepAch(type) {
      if (this.houseArr.length == 0 || this.clientArr.length == 0) {
        this.$message("分成人不满足最低人数要求");
        return false;
      }
      let resultArr = this.houseArr.concat(this.clientArr);
      let flag = true,
        sum = 0,
        sumFlag = false;
      for (var i = 0; i < resultArr.length; i++) {
        sum = parseFloat(sum) + parseFloat(resultArr[i].ratio);
        if (
          resultArr[i].roleName === "" ||
          resultArr[i].ratio === "" ||
          resultArr[i].assignor === "" ||
          resultArr[i].isJob.label === "" ||
          resultArr[i].level3 === "" ||
          resultArr[i].shopkeeper === "" ||
          resultArr[i].level4 === "" ||
          resultArr[i].amaldar === "" ||
          resultArr[i].manager === ""
        ) {
          flag = false;
        } else if (sum == 100) {
          sumFlag = true;
        } else {
          sumFlag = false;
        }
      }
      //  debugger;
      // console.log(sumFlag);
      if (flag && sumFlag) {
        // this.$emit("close", this.achIndex);
        // this.$message("操作完成");
        console.log(this.examineDate);
        let param = {};
        if (type == 1) {
          param = {
            id: this.aId,
            examineDate: this.examineDate,
            distributions: resultArr,
            agendIds: this.agendIds,
            contractId: this.achObj.contractId
          };
        }
        if (type == 2) {
          param = {
            id: this.aId,
            distributions: resultArr
          };
        }
        this.$ajax.postJSON("/api/achievement/examineSave", param).then(res => {
          // console.log(res.data.status);
          if (res.data.status == 200) {
            let sendObj = {
              agendIds: this.agendIds
            };
            this.$emit("saveData",this.achIndex,resultArr);
            this.$message("操作完成");
          }
        });
      } else if (!sumFlag) {
        this.$message("请输入正确的分成比例");
      } else {
        this.$message("请完善信息");
      }
    },
    // 业绩分成的保存
    keepAchDivide() {
      let resultArr = this.houseArr.concat(this.clientArr);
      console.log(resultArr);
      let flag = true,
        sum = 0,
        sumFlag = false;
      for (var i = 0; i < resultArr.length; i++) {
        sum = parseFloat(sum) + parseFloat(resultArr[i].ratio);
        if (
          resultArr[i].roleName === "" ||
          resultArr[i].ratio === "" ||
          resultArr[i].assignor === "" ||
          resultArr[i].isJob.label === "" ||
          resultArr[i].level3 === "" ||
          resultArr[i].shopkeeper === "" ||
          resultArr[i].level4 === "" ||
          resultArr[i].amaldar === "" ||
          resultArr[i].manager === ""
        ) {
          flag = false;
        } else if (sum == 100) {
          sumFlag = true;
        } else {
          sumFlag = false;
        }
      }
      // debugger;
      // console.log(sum);
      if (flag && sumFlag) {
        // this.$emit("close", this.achIndex);
        // this.$message("操作完成");
        console.log("aaaaaaaaaaaaaaaaaa");
        console.log(this.achObj);
        let param = {
          distributions: resultArr,
          contractCode: this.contractCode,
          contractId: this.achObj.contractId, //合同id需要详情页面带过来
          houseCode: this.achObj.houseCode, //房源编号需要详情页面带过来
          receivableComm: this.achObj.receivableComm, //合同应收佣金需要详情页面带过来
          signDate: this.achObj.signDate, //合同签约时间需要详情页面带过来
          contractType: this.achObj.contractType, //合同类型需要详情页面带过来
          customerCode: this.achObj.customerCode //源编号需要详情页面带过来
        };
        this.$ajax
          .postJSON("/api/achievement/distributionSave", param)
          .then(res => {
            console.log(res.data.status);
            if (res.data.status == 200) {
              this.$message("操作完成");
              this.$emit("close", this.achIndex, 1);
            }
          });
      } else if (!sumFlag) {
        this.$message("请输入正确的分成比例");
      } else {
        this.$message("请完善信息");
      }
    },
    closeDialog() {
      this.$emit("close");
    },
    handleSelectionChange(val) {
      //返回的是选择当行的对象
      console.log(val);
      this.addManList = val;
      this.addArr.push(val);
    },
    // 审核，反审核，编辑点进去的房源，客源
    codeBaseInfo(contCode, entrance, aId) {
      let param = { contCode: contCode, entrance: entrance, aId: this.aId };
      this.$ajax
        .get("/api/achievement/selectAchievementByCode", param)
        .then(res => {
          if (res.status === 200) {
            this.houseArr = res.data.data.houseAgents;
            this.clientArr = res.data.data.customerAgents;
            this.comm = res.data.data.comm;
            if (res.data.data.examineDate) {
              console.log("ssssssssss");
              this.examineDate = res.data.data.examineDate;
            }
          }
        });
      // 角色类型
      this.$ajax.get("/api/role/types").then(res => {
        console.log(res.status);
        if (res.status === 200) {
          // console.log(res.data.data[0]);
          this.roleType0 = res.data.data[1]; //房源角色类型
          this.roleType1 = res.data.data[2]; //客源角色类型
        }
      });
    },
    handleSelectDeal(item, index, type) {
      console.log(item);
      console.log(item.empId);
      this.$ajax.get("/api/organize/employee/agent/" + item.empId).then(res => {
        let data = res.data.data;
        if (type == 1) {
          this.houseArr[index].isJob = data.isJob;
          this.houseArr[index].level3 = data.level3; //门店
          this.houseArr[index].shopkeeper = data.shopkeeper; //店长
          this.houseArr[index].level4 = data.level4; //单组
          this.houseArr[index].amaldar = data.amaldar; //区经
          this.houseArr[index].manager = data.manager; //区总
          this.houseArr[index].assignorId = data.assignorId; //经纪人id
          this.houseArr[index].storefront3Id = data.storefront3Id; //三级门店
          this.houseArr[index].storefront4Id = data.storefront4Id; //四级门店
          this.houseArr[index].managerId = data.managerId; //区总id
          this.houseArr[index].amaldarId = data.amaldarId; //区经id
          this.houseArr[index].shopkeeperId = data.shopkeeperId; //店长id
          this.houseArr[index].platformFeeRatio = data.platformFeeRatio; //平台费比率
        } else {
          this.clientArr[index].isJob = data.isJob;
          this.clientArr[index].level3 = data.level3; //门店
          this.clientArr[index].shopkeeper = data.shopkeeper; //店长
          this.clientArr[index].level4 = data.level4; //单组
          this.clientArr[index].amaldar = data.amaldar; //区经
          this.clientArr[index].manager = data.manager; //区总
          this.clientArr[index].assignorId = data.assignorId; //经纪人id
          this.clientArr[index].storefront3Id = data.storefront3Id; //三级门店
          this.clientArr[index].storefront4Id = data.storefront4Id; //四级门店
          this.clientArr[index].managerId = data.managerId; //区总id
          this.clientArr[index].amaldarId = data.amaldarId; //区经id
          this.clientArr[index].shopkeeperId = data.shopkeeperId; //店长id
          this.clientArr[index].platformFeeRatio = data.platformFeeRatio; //平台费比率
        }
      });
    },
    handleSelect(item) {
      console.log(item);
    },
    // 经纪人模糊查询
    querySearch(queryString, cb) {
      let list = [{}];
      let param = {
        keyword: queryString
      };
      this.$ajax.get("/api/organize/employee/agent", param).then(res => {
        console.log(res.status);
        if (res.status === 200) {
          console.log(res.data.data);
          for (let i of res.data.data) {
            i.value = i.name; //将想要展示的数据作为value
          }
          list = res.data.data;
          cb(list);
        }
      });
    },
    //门店，店长，单组，区经，区总模糊查询
    queryInfo(roleId) {
      return (queryString, cb) => {
        let list = [{}];
        let param = {
          roleId: roleId,
          keyword: queryString
        };
        this.$ajax.get("/api/organize/employees", param).then(res => {
          console.log(res.status);
          if (res.status === 200) {
            console.log(res.data.data);
            for (let i of res.data.data) {
              i.value = i.depName; //将想要展示的数据作为value
            }
            list = res.data.data;
            cb(list);
          }
        });
      };
    },
    // 相关人员确定按钮
    manSure(type) {
      let addhouseArr = [];
      if (this.type == 1) {
        addhouseArr = this.houseArr.concat(this.addManList);
      } else {
        addhouseArr = this.clientArr.concat(this.addManList);
      }
      let resultArr = [];
      console.log("eeeeeeeeeeeeeeeeeeeeeeeee");
      console.log(addhouseArr);
      // 相关人员和房源客源数组去重
      for (var i = 0; i < addhouseArr.length; i++) {
        var flag = true;
        for (var j = 0; j < resultArr.length; j++) {
          if (
            addhouseArr[i].assignorId == resultArr[j].assignorId &&
            addhouseArr[i].roleType == resultArr[j].roleType &&
            addhouseArr[i].id &&
            addhouseArr[i].id == resultArr[j].id
          ) {
            flag = false;
          }
        }
        if (flag) {
          resultArr.push(addhouseArr[i]);
        } else {
          this.$message("请勿重复添加");
        }
      }
      if (this.type == 1) {
        this.houseArr = resultArr;
      } else {
        this.clientArr = resultArr;
      }
      this.showTips = false;
    }
  },
  watch: {
    contractCode(val) {
      // 字典初始化
      this.getDictionary();
      this.remark = "";
      if (val) {
        this.code = val;
        // 审核编辑
        if (this.dialogType == 0 || this.dialogType == 1) {
          this.codeBaseInfo(this.code, 1);
          // 反审核
        } else if (this.dialogType == 2) {
          this.addArr = [];
          this.codeBaseInfo(this.code, 2);
          // 业绩录入分成
        } else if (this.dialogType == 3) {
          this.comm = this.achObj.comm; //合同详情传过来的可分配业绩
          // 角色类型
          this.$ajax.get("/api/role/types").then(res => {
            console.log(res.status);
            if (res.status === 200) {
              // console.log(res.data.data[0]);
              this.roleType0 = res.data.data[1]; //房源角色类型
              this.roleType1 = res.data.data[2]; //客源角色类型
            }
          });
          let param = {
            contCode: this.contractCode
          };
          this.$ajax.get("/api/achievement/employees", param).then(res => {
            let data = res.data;
            if (data.status === 200) {
              if (data.data.customerAgents) {
                this.clientArr = data.data.customerAgents;
              }
              if (data.data.houseAgents) {
                this.houseArr = data.data.houseAgents;
              }
              // 需要从页面带一个分配业绩,业绩id
            }
          });
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .dialog2In {
  width: 400px !important;
  height: 400px !important;
  background-color: #fff;
  margin-top: 30vh !important;
  overflow: auto;
  .is-checked {
    color: #478de3 !important;
  }
  /deep/ .el-dialog__header {
    padding: 0 !important;
  }
  /deep/ .el-dialog__body {
    padding: 0 !important;
  }
  h1 {
    height: 53px;
    line-height: 53px;
    // font-size: 20px;
    color: #233241;
    padding-left: 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #edecf0;
    // /deep/ .delete {
    //   color: #478de3 !important;
    // }
  }
  .mansList {
    margin-top: 25px;
  }
  /deep/ tr td:first-of-type,
  th:first-of-type {
    padding-left: 20px;
  }

  .dialog2-btn {
    margin-top: 40px;
    margin-right: 20px;
    button {
      width: 100px;
      height: 38px;
      border-radius: 19px;
    }
    button:first-of-type {
      background-color: #fff;
      color: #000;
      border: 1px solid #e8eaf6;
    }
  }
}

//业绩详情弹框改变样式
.dialog1 {
  /deep/ .el-dialog {
    max-width: 1000 !important;
    height: 666px;
    overflow: auto;

    /deep/ .el-input__suffix {
      right: 21px;
    }
    b {
      position: absolute;
      right: 30px;
      top: 30px;
      font-size: 30px;
    }
    .ach-header {
      min-height: 80px;
      min-width: 100%;
      background-color: #fff;
      border-bottom: 1px solid #edecf0;
      overflow: hidden;
      h1 {
        // font-size: 20px;
        color: #233241;
        margin: 20px 0 0 30px;
      }
      p {
        // font-size: 14px;
        color: #6c7986;
        margin: 12px 0 0 30px;
        line-height: 0;
      }
    }
    .ach-body {
      min-height: 585px;
      min-width: 1200;
      // background-color: pink;
      padding: 0 30px;
      box-sizing: border-box;
      overflow-y: auto;
      /deep/ .el-input__inner {
        border: 0;
        box-shadow: 0;
        padding: 0;
        padding-left: 5px;
        // padding-left: 10px;
      }
      .house-divide {
        width: 100%;
        //   background-color: pink;
        .house-left {
          margin-top: 30px;
          margin-bottom: 30px;
          h1 {
            // font-size: 16px !important;
            color: #233241 !important;
            margin: 0px !important;
          }
        }

        .house-right {
          margin-top: 20px;
          button {
            padding: 0 !important;
            border-radius: 0;
          }
          button:first-of-type {
            width: 90px;
            height: 36px;
            border-radius: 18px;
          }
          button:nth-of-type(2) {
            width: 105px;
            height: 36px;
            border-radius: 18px;
          }
          .el-button--primary {
            background-color: #409eff;
            border: 0;
          }
        }
      }
      /deep/ .el-table {
        // font-size: 14px !important;
        margin-top: 20px;
        td,
        th {
          padding: 24px 0;
        }
        .el-table__header {
          height: 55px;
          th {
            padding: 0;
            .cell {
              background-color: #eef2fb;
              // background-color: pink;
              height: 55px;
              line-height: 55px;
            }
          }
        }
      }
      //弹框审核信息
      h1 {
        // font-size: 16px;
        color: #233241;
        margin: 0px !important;
      }
    }

    .ach-footer {
      min-height: 100px;
      width: 100%;
      background-color: #fff;
      padding-left: 20px;
      box-sizing: border-box;
      position: relative;
      padding-bottom: 30px;
      p {
        margin-top: 30px;
      }
      .el-textarea {
        position: absolute;
        left: 70px;
        top: 0;
        padding-bottom: 80px;
        width: 60%;
      }
      textarea {
        width: 500px !important;
      }
      .footer-btn-layout {
        height: 38px;
        text-align: right;
        padding-right: 30px;
        margin-top: 15px;
        button:first-of-type{
          width: 100px;
          height: 38px;
          border-radius: 19px;
          border: 0;
        }
        .color-green {
          background-color: #54d384;
        }
        .color-red {
          background-color: #f56c6c;
          margin-left: 20px;
        }
        .color-blue {
          background-color: #478de3;
        }
        .color-white {
          background-color: #fff;
          color: #000;
          border: 1px solid #e8eaf6;
        }
      }
    }
    /deep/ .el-dialog__header,
    /deep/ .el-dialog__footer,
    /deep/ .el-dialog__body {
      padding: 0 !important;
    }
    /deep/ .el-dialog__header {
      .el-dialog__headerbtn {
        right: 0;
        top: 0;
        display: none;
      }
    }
  }
  input::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #c0c4cc;
  }
  input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #c0c4cc;
  }
  input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #c0c4cc;
  }
  input:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #c0c4cc;
  }
  .input-ratio {
    color: #606266;
  }
}
</style>
