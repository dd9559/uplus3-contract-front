<template>
  <div>
    <div class="dialog1">
      <el-dialog
        :visible.sync="shows"
        @closed="handleClose"
        :close-on-click-modal="false"
        custom-class="base-dialog"
      >
        <!-- 头部右边关闭按钮 -->
        <b
          class="el-icon-close"
          @click="closeDialog"
        ></b>
        <!-- 头部左边业绩分成title -->
        <div class="ach-header">
          <h1
            v-if="dialogType==0"
            class="f14"
          >业绩审核</h1>
          <h1 v-if="dialogType==1">业绩编辑</h1>
          <h1 v-if="dialogType==2">业绩反审核</h1>
          <h1
            v-if="dialogType==3"
            style="fontSize:20px;"
          >业绩分成</h1>
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
            <div
              class="house-right f_r"
              v-if="!backAId"
            >
              <el-button
                type="primary"
                @click="houseRelativeMans"
              >相关人员</el-button>
              <el-button
                type="primary"
                @click="addMansHouse"
              >添加分配人</el-button>
            </div>
          </div>

          <div class="ach-divide-list">
            <el-table
              :data="houseArr"
              style="width: 100%"
            >
              <!-- 角色类型 不可输入-->
              <el-table-column
                label="角色类型"
                width="160"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.roleType"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in roleType0"
                      :key="item.id"
                      :label="item.description"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <!-- 分成比例保留小数点后一位有效数字 可输入,不可下拉-->
              <el-table-column
                label="分成比例(%)"
                width="100"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model.number="scope.row.ratio"
                    placeholder="请输入数字"
                    @change="filterHouseNumber(scope.row.ratio,scope.$index)"
                  ></el-input>
                </template>
              </el-table-column>

              <!-- 经纪人,可输入,可下拉,搜索不到匹配项,失去焦点清空val -->
              <el-table-column
                label="经纪人"
                width="150"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.assignor"
                    filterable
                    remote
                    reserve-keyword
                    :clearable="true"
                    placeholder="请输入内容"
                    :remote-method="getAssignors"
                    :loading="loading1"
                    @change="changeAssignors(scope.row.assignor,scope.$index,0)"
                  >
                    <el-option
                      v-for="item in assignors"
                      :key="item.empId"
                      :label="item.name"
                      :value="item.empId"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <!-- 在职状况  可下拉,不可输入    0待入职,1在职,2离职 (通过枚举id=20查询)-->
              <el-table-column
                label="在职状况"
                width="110"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.isJob"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in dictionary['20']"
                      :key="item.key"
                      :label="item.value"
                      :value="{'label':item.value,'value':item.key}"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <!-- 门店，可输入，可下拉 -->
              <el-table-column
                label="门店"
                width="200"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.level3"
                    filterable
                    remote
                    reserve-keyword
                    :clearable="true"
                    placeholder="请输入内容"
                    :loading="loading1"
                    :remote-method="getLevel(3)"
                    @change="changeLevel3(scope.row.level3,scope.$index,0,0)"
                  >
                    <el-option
                      v-for="item in level3s"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id+'-'+item.name"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <!-- 店长，可输入，可下拉 -->
              <el-table-column
                label="店长"
                width="140"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.shopkeeper"
                    filterable
                    remote
                    reserve-keyword
                    :clearable="true"
                    :loading="loading1"
                    placeholder="请输入内容"
                    :remote-method="getShopInfo(2)"
                    @change="changeShopkeeper(scope.row.shopkeeper,scope.$index,0)"
                  >
                    <el-option
                      v-for="item in shopkeepers"
                      :key="item.empId"
                      :label="item.name"
                      :value="item.depId+'-'+item.name"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <!-- 单组，可输入，可下拉 -->
              <el-table-column
                label="单组"
                width="200"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.level4"
                    filterable
                    remote
                    reserve-keyword
                    :clearable="true"
                    :loading="loading1"
                    placeholder="请输入内容"
                    :remote-method="getLevel(4)"
                    @change="changeLevel3(scope.row.level4,scope.$index,0,1)"
                  >
                    <el-option
                      v-for="item in level4s"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id+'-'+item.name"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <!-- 区经，可输入，可下拉   changeAmaldar-->
              <el-table-column
                label="区经"
                width="140"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.amaldar"
                    filterable
                    remote
                    reserve-keyword
                    :clearable="true"
                    :loading="loading1"
                    placeholder="请输入内容"
                    :remote-method="getShopInfo(1)"
                    @change="changeAmaldar(scope.row.amaldar,scope.$index,0)"
                  >
                    <el-option
                      v-for="item in amaldars"
                      :key="item.empId"
                      :label="item.name"
                      :value="item.depId+'-'+item.name"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <!-- 区总，可输入，可下拉 changeManager-->
              <el-table-column
                label="区总"
                width="140"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.manager"
                    filterable
                    remote
                    reserve-keyword
                    :clearable="true"
                    :loading="loading1"
                    placeholder="请输入内容"
                    :remote-method="getShopInfo(0)"
                    @change="changeManager(scope.row.manager,scope.$index,0)"
                  >
                    <el-option
                      v-for="item in managers"
                      :key="item.empId"
                      :label="item.name"
                      :value="item.depId+'-'+item.name"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column
                label="门店/公司公共业绩"
                width="170"
              >
                <template slot-scope="scope">
                  <el-radio-group v-model="scope.row.place">
                     <el-radio :label="0" @click.native="selectRadio(scope.$index, $event,0)">门店</el-radio>
                     <el-radio :label="1" @click.native="selectRadio(scope.$index, $event,0)">公司</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>

              <el-table-column
                prop="manager"
                label="操作"
                width="80"
              >
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
            <div
              class="house-right f_r"
              v-if="!backAId"
            >
              <el-button
                type="primary"
                @click="clientRelativeMans"
              >相关人员</el-button>
              <el-button
                type="primary"
                @click="addMansClient"
              >添加分配人</el-button>
            </div>
          </div>

          <div class="ach-divide-list">
            <el-table
              :data="clientArr"
              style="width: 100%"
            >
              <el-table-column
                label="角色类型"
                width="160"
              >
                <template slot-scope="scope">
                  <!-- filterable -->
                  <el-select
                    v-model="scope.row.roleType"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in roleType1"
                      :key="item.id"
                      :label="item.description"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column
                label="分成比例(%)"
                width="100"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.ratio"
                    placeholder="请输入数字"
                    @change="filterClientNumber(scope.row.ratio,scope.$index)"
                  ></el-input>
                </template>
              </el-table-column>

              <el-table-column
                label="经纪人"
                width="150"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.assignor"
                    filterable
                    remote
                    reserve-keyword
                    :clearable="true"
                    placeholder="请输入内容"
                    :remote-method="getAssignors"
                    :loading="loading1"
                    @change="changeAssignors(scope.row.assignor,scope.$index,1)"
                  >
                    <el-option
                      v-for="item in assignors"
                      :key="item.empId"
                      :label="item.name"
                      :value="item.empId"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column
                label="在职状况"
                width="110"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.isJob"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in dictionary['20']"
                      :key="item.key"
                      :label="item.value"
                     :value="{'label':item.value,'value':item.key}"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <!-- 门店，可输入，可下拉 -->
              <el-table-column
                label="门店"
                width="200"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.level3"
                    filterable
                    remote
                    reserve-keyword
                    :clearable="true"
                    placeholder="请输入内容"
                    :loading="loading1"
                    :remote-method="getLevel(3)"
                    @change="changeLevel3(scope.row.level3,scope.$index,1,0)"
                  >
                    <el-option
                      v-for="item in level3s"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id+'-'+item.name"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <!-- 店长，可输入，可下拉 -->
              <el-table-column
                label="店长"
                width="140"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.shopkeeper"
                    filterable
                    remote
                    reserve-keyword
                    :clearable="true"
                    placeholder="请输入内容"
                    :loading="loading1"
                    :remote-method="getShopInfo(2)"
                    @change="changeShopkeeper(scope.row.shopkeeper,scope.$index,1)"
                  >
                    <el-option
                      v-for="item in shopkeepers"
                      :key="item.empId"
                      :label="item.name"
                      :value="item.depId+'-'+item.name"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <!-- 单组，可输入，可下拉 -->
              <el-table-column
                label="单组"
                width="200"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.level4"
                    filterable
                    remote
                    reserve-keyword
                    :clearable="true"
                    placeholder="请输入内容"
                    :loading="loading1"
                    :remote-method="getLevel(4)"
                    @change="changeLevel3(scope.row.level4,scope.$index,1,1)"
                  >
                    <el-option
                      v-for="item in level4s"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id+'-'+item.name"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <!-- 区经，可输入，可下拉 -->
              <el-table-column
                label="区经"
                width="140"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.amaldar"
                    filterable
                    remote
                    reserve-keyword
                    :clearable="true"
                    placeholder="请输入内容"
                    :loading="loading1"
                    :remote-method="getShopInfo(1)"
                    @change="changeAmaldar(scope.row.amaldar,scope.$index,1)"
                  >
                    <el-option
                      v-for="item in amaldars"
                      :key="item.empId"
                      :label="item.name"
                      :value="item.depId+'-'+item.name"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <!-- 区总，可输入，可下拉 -->
              <el-table-column
                label="区总"
                width="140"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.manager"
                    filterable
                    remote
                    reserve-keyword
                    :clearable="true"
                    placeholder="请输入内容"
                    :loading="loading1"
                    :remote-method="getShopInfo(0)"
                    @change="changeManager(scope.row.manager,scope.$index,1)"
                  >
                    <el-option
                      v-for="item in managers"
                      :key="item.empId"
                      :label="item.name"
                      :value="item.depId+'-'+item.name"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column
                label="门店/公司公共业绩"
                width="170"
              >
                <template slot-scope="scope">
                    <el-radio-group v-model="scope.row.place">
                         <el-radio :label="0" @click.native="selectRadio(scope.$index, $event,1)">门店</el-radio>
                         <el-radio :label="1" @click.native="selectRadio(scope.$index, $event,1)">公司</el-radio>
                    </el-radio-group>
                </template>
              </el-table-column>

              <el-table-column
                prop="manager"
                label="操作"
                width="80"
              >
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
        <div
          class="ach-footer"
          v-if="dialogType==0"
        >
          <p class="text-layout">备注：
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              class="f_l"
              v-model="remark"
              resize="none"
              maxlength=200
            ></el-input>
            <span class="textLength">{{remark.length}}/200</span>
          </p>
          <div class="footer-btn-layout f_r">
            <el-button
              type="primary"
              round
              @click="passAch"
              class="color-green"
              v-dbClick
            >通过</el-button>
            <el-button
              type="primary"
              round
              @click="rejectAch"
              class="color-red"
              v-dbClick
            >驳回</el-button>
          </div>
        </div>

        <!-- 业绩编辑底部 -->
        <div
          class="ach-footer"
          v-if="dialogType==1"
        >
          <div class="footer-btn-layout f_r">
            <el-button
              type="primary"
              round
              @click="keepAch(2,2)"
              class="color-white"
              v-dbClick
            >保存</el-button>
            <el-button
              type="primary"
              round
              @click="keepAch(2,1)"
              class="color-blue"
              v-dbClick
            >保存并提审</el-button>
          </div>
        </div>
        <!-- 业绩反审核底部 -->
        <div
          class="ach-footer"
          v-if="dialogType==2"
        >
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
              v-dbClick
            >保存</el-button>
          </div>
        </div>

        <!-- 业绩分成底部      -->
        <div
          class="ach-footer"
          v-if="dialogType==3&&!backAId"
        >
          <div class="footer-btn-layout f_r">
            <el-button
              type="primary"
              round
              @click=" keepAchDivide(2)"
              class="color-white"
              v-dbClick
            >保存</el-button>
            <el-button
              type="primary"
              round
              @click=" keepAchDivide(1)"
              class="color-blue"
              v-dbClick
            >保存并提审</el-button>
          </div>
        </div>

        <div class="dialog2">
          <el-dialog
            :visible.sync="showTips"
             append-to-body
             custom-class="dialog2In"
            :close-on-click-modal="false"
          >
            <h1 style="font-size:16px;" slot="title">选择相关人员</h1>
            <div class="mansList">
              <el-table
                :data="mansList"
                style="width: 100%"
                @selection-change="handleSelectionChange"
              >
                <el-table-column
                  type="selection"
                  width="70"
                ></el-table-column>

                <el-table-column
                  label="经纪人"
                  width="100"
                >
                  <template slot-scope="scope">
                    <p>{{scope.row.assignor}}</p>
                  </template>
                </el-table-column>

                <el-table-column
                  label="门店"
                  width="120"
                >
                  <template slot-scope="scope">
                    <p>{{scope.row.level3}}</p>
                  </template>
                </el-table-column>

                <el-table-column
                  label="角色类型"
                  width="100"
                >
                  <template slot-scope="scope">
                    <p>{{scope.row.roleName}}</p>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <div class="dialog2-btn f_r">
              <el-button
                type="primary"
                round
                @click="showTips = false"
              >取消</el-button>
              <el-button
                type="primary"
                round
                @click="manSure(type)"
                v-dbClick
              >确定</el-button>
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
      agendIds: [],  //存放 删除经纪人的流水id
      addArr: [],
      backAId: null,
      assignors: [],  //模糊搜索经纪人
      level3s: [],   //模糊搜索门店
      level4s: [],   //模糊搜索单组
      shopkeepers:[],  //模糊搜索店长
      amaldars:[],   //模糊搜索区经
      managers:[],    //模糊搜索区总
      loading1: false,
      radioFlag:3
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
      this.houseArr = [];
      this.clientArr = [];
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
    // 获取经纪人
    getAssignors(queryString) {
      if (queryString !== "") {
        this.loading1 = true;
        let list = [{}];
        let param = {
          keyword: queryString
        };
        this.$ajax.get("/api/organize/employees", param).then(res => {
          console.log(res.status);
          if (res.status === 200) {
            console.log(res.data.data);
            this.loading1 = false;
            this.assignors = res.data.data;
          }
        });
      }
    },
    // 改变经纪人
    changeAssignors(val, index, type) {
      if (val) {
        this.$ajax.get("/api/organize/employee/agent/" + val).then(res => {
          let data = res.data.data;
          if (type == 0) {
            this.houseArr[index].assignor = data.assignor;
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
            this.clientArr[index].assignor = data.assignor;
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
      } else {
        if (type == 0) {
          this.houseArr[index].isJob = "";
          this.houseArr[index].level3 = "";
          this.houseArr[index].shopkeeper = "";
          this.houseArr[index].level4 = "";
          this.houseArr[index].amaldar = "";
          this.houseArr[index].manager = "";
          this.houseArr[index].assignorId = "";
          this.houseArr[index].storefront3Id = "";
          this.houseArr[index].storefront4Id = "";
          this.houseArr[index].managerId = "";
          this.houseArr[index].amaldarId = "";
          this.houseArr[index].shopkeeperId = "";
          this.houseArr[index].platformFeeRatio = "";
        } else {
          this.clientArr[index].isJob = "";
          this.clientArr[index].level3 = "";
          this.clientArr[index].shopkeeper = "";
          this.clientArr[index].level4 = "";
          this.clientArr[index].amaldar = "";
          this.clientArr[index].manager = "";
          this.clientArr[index].assignorId = "";
          this.clientArr[index].storefront3Id = "";
          this.clientArr[index].storefront4Id = "";
          this.clientArr[index].managerId = "";
          this.clientArr[index].amaldarId = "";
          this.clientArr[index].shopkeeperId = "";
          this.clientArr[index].platformFeeRatio = "";
        }
      }
    },
    // 获取门店，单组信息  type=3(门店)  type=4(单组)
    getLevel(type) {
      return queryString => {
      if (queryString !== "") {
          this.loading1 = true;
           let param = {
             // type: type,
             keyword: queryString
           };
           this.$ajax.get("/api/organize/deps", param).then(res => {
              if (res.status === 200) {  
                 if (type == 3) {
                   this.level3s = res.data.data;
                 } else {
                   this.level4s = res.data.data;
                 }
                 this.loading1 = false;
              }
           
           });
       }
      };
    },
    // 改变门店,单组
    changeLevel3(val, index, type1, type2) {
      if (val) {
        let level3Arr = val.split("-");
        if (type1 == 0 && type2 == 0) {
          this.houseArr[index].storefront3Id = level3Arr[0];
          this.houseArr[index].level3 = level3Arr[1];
        } else if (type1 == 0 && type2 == 1) {
          this.houseArr[index].storefront4Id = level3Arr[0];
          this.houseArr[index].level4 = level3Arr[1];
        } else if (type1 == 1 && type2 == 0) {
          this.clientArr[index].storefront3Id = level3Arr[0];
          this.clientArr[index].level3 = level3Arr[1];
        } else {
          this.clientArr[index].storefront4Id = level3Arr[0];
          this.clientArr[index].level4 = level3Arr[1];
        }
      }
    },
    // 获取店长，区经,区总
    getShopInfo(roleId){
      return (queryString) => {
       if (queryString !== "") {
         this.loading1 = true;
         let list = [{}];
         let param = {
           // "roleId": roleId,
           "keyword": queryString
         };
         this.$ajax.get("/api/organize/employees", param).then(res => {
          if(roleId==2){
             this.shopkeepers = res.data.data;
          }else if(roleId==1){
             this.amaldars = res.data.data;
          }else if(roleId==0){
             this.managers = res.data.data;
          }
          this.loading1 = false;
         });
       } 
      };
    },
    // 改变店长
    changeShopkeeper(val, index, type1){
      if(val){
         let idName=val.split("-");
         console.log(idName);
        if (type1 == 0) {
          this.houseArr[index].shopkeeperId = idName[0]; 
          this.houseArr[index].shopkeeper = idName[1];
        }else if(type1 == 1){
          this.clientArr[index].shopkeeperId = idName[0];
          this.clientArr[index].shopkeeper = idName[1];
        }  
      }
    },
    // 改变区经
    changeAmaldar(val, index, type1){
       if(val){
            let idName=val.split("-");
            console.log(idName);
           if (type1 == 0) {
             this.houseArr[index].amaldar = idName[0]; 
             this.houseArr[index].amaldar = idName[1];
           }else if(type1 == 1){
             this.clientArr[index].amaldar = idName[0];
             this.clientArr[index].amaldar = idName[1];
           }  
         }
    },
    // 改变区总
    changeManager(val, index, type1){
       if(val){
            let idName=val.split("-");
            console.log(idName);
           if (type1 == 0) {
             this.houseArr[index].manager = idName[0]; 
             this.houseArr[index].manager = idName[1];
           }else if(type1 == 1){
             this.clientArr[index].manager = idName[0];
             this.clientArr[index].manager = idName[1];
           }  
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
        place: -1,
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
        place: -1,
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
    // 弹框通过操作
    passAch() {
      if (this.houseArr.length == 0 || this.clientArr.length == 0) {
        this.$message.error("分成人不满足最低人数要求");
        return false;
      }
      // 判断房源客源角色类型不一样
      // ====================================
      let arr = [],
        roleFlag = true,
        flag = true,
        sum = 0,
        sumFlag = false;
      for (var i = 0; i < this.houseArr.length; i++) {
        let hRoleType = this.houseArr[i].roleType;
        if (arr.indexOf(hRoleType) == -1&&this.houseArr[i].roleType!="") {
          arr.push(hRoleType);
        } else if(hRoleType){
          roleFlag = false;
          this.$message.error("房源不可有重复角色类型");
          return false;
        }
      }

      for (var i = 0; i < this.clientArr.length; i++) {
        let cRoleType = this.clientArr[i].roleType;
        if (arr.indexOf(cRoleType) == -1&&this.houseArr[i].roleType!="") {
          arr.push(cRoleType);
        } else if(cRoleType){
          roleFlag = false;
          this.$message.error("客源不可有重复角色类型");
          return false;
        }
      }

      // ==========================
      let resultArr = this.houseArr.concat(this.clientArr);
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
              this.$message({ message: "操作成功", type: "success" });
              this.$emit("adoptData", this.achIndex, resultArr, res.data.data);
            } 
          }).catch(error => {
               this.$message.error({message: error})
          });
      } else if (!sumFlag && flag) {
        this.$message.error("请输入正确的分成比例");
      } else {
        this.$message.error("请完善信息");
      }
    },
    //弹框驳回操作
    rejectAch() {
      if (this.houseArr.length == 0 || this.clientArr.length == 0) {
        this.$message.error("分成人不满足最低人数要求");
        return false;
      }

      // 判断房源客源角色类型不一样
      // ====================================
      let arr = [],
        roleFlag = true,
        flag = true,
        sum = 0,
        sumFlag = false;
      for (var i = 0; i < this.houseArr.length; i++) {
        let hRoleType = this.houseArr[i].roleType;
        if (arr.indexOf(hRoleType) == -1) {
          arr.push(hRoleType);
        } else if(hRoleType){
          roleFlag = false;
          this.$message.error("房源不可有重复角色类型");
          return false;
        }
      }

      for (var i = 0; i < this.clientArr.length; i++) {
        let cRoleType = this.clientArr[i].roleType;
        if (arr.indexOf(cRoleType) == -1) {
          arr.push(cRoleType);
        } else if(cRoleType){
          roleFlag = false;
          this.$message.error("客源不可有重复角色类型");
          return false;
        }
      }

      // ==========================
      let resultArr = this.houseArr.concat(this.clientArr);
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
              this.$message({ message: "操作成功", type: "success" });
              this.$emit("rejectData", this.achIndex, resultArr);
            } else if (res.data.status != 200) {
              this.$message.error(res.data.message);
            }
          }).catch(error => {
               this.$message.error({message: error})
          });;
      } else if (!sumFlag && flag) {
        this.$message.error("请输入正确的分成比例");
      } else if (this.remark == "") {
        this.$message.error("请填写备注");
      } else {
        this.$message.error("请完善信息");
      }
    },
    // 反审核，编辑的保存
    keepAch(type, status) {
      //resultArr表示房源客源加在一起之后组成的数组
      let resultArr = this.houseArr.concat(this.clientArr);
      let arr = [],
        roleFlag = true,
        flag = true,
        sum = 0,
        sumFlag = false;
      if (this.houseArr.length == 0 || this.clientArr.length == 0) {
        this.$message.error("分成人不满足最低人数要求");
        return false;
      }
      // 判断房源客源角色类型不一样
      // ====================================
      for (var i = 0; i < this.houseArr.length; i++) {
        let hRoleType = this.houseArr[i].roleType;
        if (arr.indexOf(hRoleType) == -1) {
          arr.push(hRoleType);
        } else if(hRoleType) {
          roleFlag = false;
          this.$message.error("房源不可有重复角色类型");
          return false;
        }
      }

      for (var i = 0; i < this.clientArr.length; i++) {
        let cRoleType = this.clientArr[i].roleType;
        if (arr.indexOf(cRoleType) == -1) {
          arr.push(cRoleType);
        } else if(cRoleType){
          roleFlag = false;
          this.$message.error("客源不可有重复角色类型");
          return false;
        }
      }

      // ==========================

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
            distributions: resultArr,
            agendIds: this.agendIds,
            status: status,
            contractId: this.achObj.contractId
          };
        }

        this.$ajax.postJSON("/api/achievement/examineSave", param).then(res => {
          if (res.data.status == 200) {
            let sendObj = {
              agendIds: this.agendIds
            };
            if (type == 1) {
              this.$emit("saveData", this.achIndex, resultArr);
            }
            if (type == 2 && status == 2) {
              this.$emit("saveData", this.achIndex, resultArr, -1);
            }
            if (type == 2 && status == 1) {
              this.$emit("saveData", this.achIndex, resultArr, 0);
            }
            this.$message({ message: "操作成功", type: "success" });
          }
        }).catch(error => {
               this.$message.error({message: error})
        });;
      } else if (!sumFlag && flag) {
        this.$message.error("请输入正确的分成比例");
      } else {
        this.$message.error("请完善信息");
      }
    },
    // 业绩分成的保存
    keepAchDivide(type) {
      // 判断房源客源角色类型不一样
      // ====================================
      let arr = [],
        roleFlag = true,
        flag = true,
        sum = 0,
        sumFlag = false;
      for (var i = 0; i < this.houseArr.length; i++) {
        let hRoleType = this.houseArr[i].roleType;
        if (arr.indexOf(hRoleType) == -1) {
          arr.push(hRoleType);
        } else if(hRoleType) {
          roleFlag = false;
          this.$message.error("房源不可有重复角色类型");
          return false;
        }
      }

      for (var i = 0; i < this.clientArr.length; i++) {
        let cRoleType = this.clientArr[i].roleType;
        if (arr.indexOf(cRoleType) == -1) {
          arr.push(cRoleType);
        } else if(cRoleType){
          roleFlag = false;
          this.$message.error("客源不可有重复角色类型");
          return false;
        }
      }

      // ==========================
      let resultArr = this.houseArr.concat(this.clientArr);
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

      console.log(sum);
      if (flag && sumFlag) {
        let param = {};
        if (type == 2) {
          param = {
            distributions: resultArr,
            contractCode: this.contractCode,
            contractId: this.achObj.contractId, //合同id需要详情页面带过来
            houseCode: this.achObj.houseCode, //房源编号需要详情页面带过来
            receivableComm: this.achObj.receivableComm, //合同应收佣金需要详情页面带过来
            signDate: this.achObj.signDate, //合同签约时间需要详情页面带过来
            contractType: this.achObj.contractType, //合同类型需要详情页面带过来
            customerCode: this.achObj.customerCode, //源编号需要详情页面带过来
            status: 2
          };
        }
        if (type == 1) {
          param = {
            distributions: resultArr,
            contractCode: this.contractCode,
            contractId: this.achObj.contractId, //合同id需要详情页面带过来
            houseCode: this.achObj.houseCode, //房源编号需要详情页面带过来
            receivableComm: this.achObj.receivableComm, //合同应收佣金需要详情页面带过来
            signDate: this.achObj.signDate, //合同签约时间需要详情页面带过来
            contractType: this.achObj.contractType, //合同类型需要详情页面带过来
            customerCode: this.achObj.customerCode, //源编号需要详情页面带过来
            status: 1
          };
        }

        this.$ajax
          .postJSON("/api/achievement/distributionSave", param)
          .then(res => {
            console.log(res.data.status);
            if (res.data.status == 200) {
              this.$message({ message: "操作成功", type: "success" });
            }
            this.$emit("close");
          }).catch(error => {
               this.$message.error({message: error})
          });;
      } else if (!sumFlag && flag) {
        this.$message.error("请输入正确的分成比例");
      } else {
        this.$message.error("请完善信息");
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
    // 相关人员确定按钮
    manSure(type) {
      let addhouseArr = [];
      if (this.type == 1) {
        addhouseArr = this.houseArr.concat(this.addManList);
      } else {
        addhouseArr = this.clientArr.concat(this.addManList);
      }
      let resultArr = [];
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
          this.$message.error("请勿重复添加");
        }
      }
      if (this.type == 1) {
        this.houseArr = resultArr;
      } else {
        this.clientArr = resultArr;
      }
      this.showTips = false;
    },
    selectRadio(index, event,type){
      if(type==0){
        if(event.target.checked){ 
             this.houseArr[index].place = -1;
        }
      }else{
         if(event.target.checked){ 
             this.clientArr[index].place = -1;
        }
      }       
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
              if (data.data.aId) {
                this.backAId = data.data.aId;
              }
            }
          });
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
// 相关人员弹框
/deep/ .dialog2In {
  width: 420px !important;
  background-color: #fff;
  margin-top: 20vh !important;
  padding-bottom: 30px;
  .is-checked {
    color: #478de3 !important;
  }
  /deep/ .el-dialog__header {
    padding: 0 !important;
  }
  /deep/ .el-dialog__body {
    padding: 0 !important;
    overflow-y: auto;
    min-height:200px;
    max-height: 400px;
    width: 420px !important;
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
  /deep/ .el-dialog.base-dialog {
    width: 1000px !important;
    margin: 13vh auto 0 !important;
    overflow: hidden;

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
      max-height: 500px;
      // background-color: pink;
      // padding: 0 20px;
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
      .text-layout{
        position: relative;
        .el-textarea {
            position: absolute;
            left: 70px;
            top: 0;
            padding-bottom: 80px;
            width: 60%;
          }
          textarea {
            width: 400px !important;
            height: 90px;
          }
          .textLength {
            position: absolute;
            right: 352px;
            top: 70px;
            color: #6c7986;
            text-align: right;
          }
      }
  
      .footer-btn-layout {
        height: 38px;
        text-align: right;
        padding-right: 30px;
        margin-top: 15px;
        button {
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
      padding: 0 !important;
      .el-dialog__headerbtn {
        right: 0;
        top: 0;
        display: none !important;
        padding: 0 !important;
      }
    }
    .el-dialog__headerbtn {
      right: 0;
      top: 0;
      display: none !important;
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
  .orange {
    color: #f56c6c;
  }
}
/deep/ .el-dialog.base-dialog .ach-body {
  padding: 0 20px !important;
}
/deep/ .el-dialog__header {
  padding: 0 !important;
}
</style>
