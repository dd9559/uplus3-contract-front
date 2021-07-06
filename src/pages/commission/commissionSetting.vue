<template>
  <div>
    <!-- <p class="brand-nav">财务>提成设置</p> -->
    <div ref="tableComView" v-if="power['sign-tcyw-set-query'].state">
      <!-- 查询组件 -->
      <!-- <uPlusScrollTop class="search-top" ref="topRef" :height="searchTop" @propResetFormFn="resetFormFn" @propQueryFn="queryFn" style="padding: 0 15px 15px"> -->
      <uPlusScrollTop @propResetFormFn="resetFormFn" @propQueryFn="queryFn" style="padding: 0 15px 15px">
        <el-form :inline="true" :model="searchForm" class="prop-form" size="small">
          <el-form-item>
            <el-input v-model="searchForm.bonusName" placeholder="提成规则名称" prefix-icon="el-icon-search"
              style="width:300px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchForm.systemTag" placeholder="体系" :clearable="true" @change="sysTagChange"
              style="width:150px">
              <el-option v-for="item in systemTagSelect" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchForm.positions" placeholder="职务名称" :clearable="true" multiple collapse-tags
              style="width:265px">
              <el-option v-for="item in searchPositionRanksList" :key="item.Value" :label="item.Text"
                :value="item.Value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <select-tree size="small" width="266" show ref="selectTreeRef" :data="searchDepList" :obj="obj" clearable
              collapseTags multiple expand-click-node checkStrictly @getValue="setTreeMenu"></select-tree>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchForm.timeType" placeholder="请选择" :clearable="true" style="width:150px">
              <el-option label="执行时间" value="1"></el-option>
              <el-option label="创建时间" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchForm.executionStartTime"
              :type="searchForm.timeType==='1'?'monthrange':'daterange'" range-separator="至"
              :start-placeholder="searchForm.timeType==='1'?'开始月份':'开始日期'"
              :end-placeholder="searchForm.timeType==='1'?'结束月份':'结束日期'"
              :format="searchForm.timeType==='1'?'yyyy-MM':'yyyy-MM-dd'"
              :value-format="searchForm.timeType==='1'?'yyyy-MM':'yyyy-MM-dd'" :disabled="this.searchForm.timeType===''"
              @focus="dataPickerFocus"></el-date-picker>
          </el-form-item>
        </el-form>
      </uPlusScrollTop>

      <div class="main">
        <div class="contract-list">
          <div class="listTitle">
            <span class="title">
              <!-- <i class="iconfont icon-tubiao-11"></i>数据列表 -->
              <!-- <i class="iconfont icon-tubiao-11"></i> -->
              <span>当前共找到【{{total}}】条数据</span>
            </span>
            <el-button v-if="power['sign-tcyw-set-add'].state" class="btn-info" type="warning" size="small"
              @click="add('add')">新增</el-button>
            <!-- >新增结算设置</el-button> -->
          </div>
          <el-table :data="tableData" border style="width: 100%" ref="tableCom" :max-height="tableNumberCom"
            header-row-class-name="theader-bg">
            <el-table-column label="体系" prop="systemName" min-width="120"></el-table-column>
            <el-table-column label="部门" prop="depName" min-width="250">
              <template slot-scope="scope">
                <p v-for="(item,index) in scope.row.depName.split(',')" :key="index">{{item}}</p>
              </template>
            </el-table-column>
            <el-table-column label="职务名称" prop="positionName" min-width="250">
              <template slot-scope="scope">
                <p v-for="(item,index) in scope.row.positionName.split(',')" :key="index">{{item}}</p>
              </template>
            </el-table-column>
            <el-table-column label="合同类型" prop="tradeType" min-width="120">
              <template slot-scope="scope">
                <p v-for="(item,index) in scope.row.tradeType.toString().split(',')" :key="index">{{item == 1 ? '租赁':item == 2 ?'买卖/代办':'新房'}}</p>
                <!-- <span>{{scope.row.tradeType === 1 ? '租赁':scope.row.tradeType === 2 ?'买卖/代办':'新房'}}</span> -->
              </template>
            </el-table-column>
            <el-table-column label="提成规则名称" prop="bonusName" min-width="120"></el-table-column>
            <el-table-column label="提成计算方法" min-width="120">
              <template slot-scope="scope">
                <span>{{scope.row.commissionCalculation === 1 ? '分级累进': scope.row.commissionCalculation === 2 ? '分级累进回溯' : '简单分级（通提）'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="执行时间" min-width="120">
              <template slot-scope="scope">
                <span>{{scope.row.executionStartTime.substr(0,7)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="业绩档次（元）" min-width="180">
              <template slot-scope="scope">
                <p v-for="(item,index) in scope.row.achievementGrade" :key="index">{{item.start}}-{{item.end}}</p>
              </template>
            </el-table-column>
            <el-table-column label="提成比例" min-width="120">
              <template slot-scope="scope">
                <p v-for="(item,index) in scope.row.commissionSchemes" :key="index">{{item.bonusProportion}}%</p>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" min-width="180">
              <template slot-scope="scope">{{scope.row.createTime|formatTime(false)}}</template>
            </el-table-column>
          </el-table>
          <!-- <el-pagination
            v-if="total"
            class="pagination-info"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination> -->
          <myPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
            :page-size="pageSize" :total="total"></myPagination>
        </div>
      </div>
      <!-- 添加 编辑 弹窗 -->
      <el-dialog class="deduct-dialog" :title="dialogTitle" :visible.sync="dialogAddDeduct" width="580px"
        @close="dialogAddDeduct = false" :closeOnClickModal="$tool.closeOnClickModal">
        <div class="deduct-content">
          <div class="row">
            <div class="dialog-item">
              <p class="form-label system">提成规则名称：</p>
              <el-input size="small" style="width:240px" v-model="deductData.bonusName" placeholder="请输入"
                maxlength="15"></el-input>
            </div>
            <div class="dialog-item">
              <p class="form-label system">体系：</p>
              <el-select size="small" v-model="deductData.system" style="width:240px" @change="changeSystemFn">
                <el-option v-for="item in systemTagSelect" :key="item.key" :label="item.value" :value="item">
                </el-option>
              </el-select>
            </div>
            <div class="dialog-item">
              <p class="form-label system">部门：</p>

              <select-tree size="small" width="240" ref="deductSelectTreeRef" :data="depList" show
                :defaultKeys="depDefaultCheckedKeys" :obj="obj" :filterable="deductFilterable" reserveKeyword clearable
                collapseTags multiple checkAll expandClickNode expand-on-click-node expand-click-node checkStrictly
                @getValue="setDeductTreeMenu" @cleanDefault="cleanDefault"></select-tree>
            </div>
            <div class="dialog-item">
              <p class="form-label system">职务：</p>
              <el-select size="small" v-model="deductData.position" @focus="showPositionRanksList" collapse-tags
                style="width:240px" multiple filterable @clear="clearPositionRank" @remove-tag="removeTagPositionRank"
                :clearable="true">
                <el-option v-for="item in positionRanksList" :key="item.Value" :label="item.Text" :value="item.Value"
                  @click.native="changePositionRanks(item)"></el-option>
              </el-select>
            </div>
            <!-- <div class="dialog-item">
              <p class="form-label system">等级：</p>
              <el-select size="small" v-model="deductData.level" style="width:240px" :disabled="true">
                <el-option
                  v-for="item in dictionary['73']"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                ></el-option>
              </el-select>
            </div>-->
            <div class="dialog-item">
              <p class="form-label system">合同类型：</p>
              <el-select size="small" v-model="deductData.tradeType" multiple collapse-tags placeholder="请选择" style="width:240px">
                <el-option label="租赁" value="1"></el-option>
                <el-option label="买卖/代办" value="2"></el-option>
                <el-option label="新房" value="3"></el-option>
              </el-select>
            </div>
            <div class="dialog-item">
              <p class="form-label system">提成计算方法：</p>
              <el-select size="small" v-model="deductData.commissionCalculation" style="width:240px">
                <el-option label="分级累进" value="1"></el-option>
                <el-option label="分级累进回溯" value="2"></el-option>
                <el-option label="简单分级（通提）" value="3"></el-option>
              </el-select>
            </div>
            <div class="dialog-item">
              <p class="form-label system">执行开始时间：</p>
              <el-date-picker v-model="deductData.executionStartTime" type="month" placeholder="年月份" format="yyyy-MM"
                value-format="yyyy-MM" style="width:240px"></el-date-picker>
            </div>
          </div>
          <div class="grade">
            <p class="title">提成方案设置</p>
            <div class="content">
              <div class="row" v-for="(item,index) in commissionScheme" :key="index">
                <div class="dialog-item">
                  <p class="form-label system">业绩档次（元）：</p>
                  <el-input size="small" type="number" disabled style="width:105px"
                    v-model="item.achievementGrade.resultsStart" placeholder=">某个值"></el-input>
                  <span>——</span>
                  <el-input size="small" v-if="commissionScheme.length - 1 !== index" type="number" style="width:105px"
                    v-model="item.achievementGrade.resultsEnd" placeholder=">某个值"
                    @input="inputResultEnd(item,index,'commissionScheme')" @blur="checkResultEnd(item,index)">
                  </el-input>
                  <el-autocomplete v-else size="small" style="width:105px" v-model="item.achievementGrade.resultsEnd"
                    :fetch-suggestions="querySearch" @input="inputResultEnd(item,index,'commissionScheme')"
                    @blur="checkResultEnd(item,index)" placeholder="≤某个值"></el-autocomplete>
                </div>
                <div class="dialog-item">
                  <p class="form-label system">提成比例（%）：</p>
                  <el-input size="small" style="width:125px" v-model="item.bonusProportion" placeholder="请输入提成比例"
                    @input="checkResultBonus(item,index)"></el-input>
                  <!-- <span
                    class="add circle"
                    v-if="(index === 0 && !infinity) || (commissionScheme.length !== 1 && commissionScheme.length - 1 === index && !infinity) || (commissionScheme.length - 1 !== index)"
                    @click="addCircle(item,index,'add')"
                  >-->
                  <span class="add circle" v-if="commissionScheme.length - 1 === index && !infinity"
                    @click="addCircle(item,index,'add')">
                    <i class="icon el-icon-plus"></i>
                  </span>
                  <span class="sub circle" v-if="commissionScheme.length - 1 === index"
                    @click="addCircle(item,index,'sub')">
                    <i class="icon el-icon-minus"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="info-box">
            <p>注：1.遵循右包含原则，例如业绩档次0-5000元，其中包含5000</p>
            <p>2.最后一档最大值为：99999999999</p>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAddDeduct = false" type="info" plain>取消</el-button>
          <el-button type="warning" @click="checkSave()">保 存</el-button>
        </div>
      </el-dialog>
      <!-- 保存提成设置方案确认框 -->
      <el-dialog title="确认保存" :visible.sync="dialogSave" class="ratioMsg" width="500px"
        :closeOnClickModal="$tool.closeOnClickModal">
        <div class="warning-box">
          <p>确认保存该提成设置？</p>
          <div class="warning-content">
            <p>
              <span>合同类型：</span>
              <span v-for="(item,index) in deductData.tradeType.toString().split(',')" :key="index">{{index>=1? ',':''}}{{item == 1 ? '租赁':item == 2 ?'买卖/代办':'新房'}}</span>
            <!-- {{deductData.tradeType === '1' ? '租赁':deductData.tradeType === '2' ?'买卖/代办':'新房'}}</p> -->
            <p>提成计算方法：{{deductData.commissionCalculation === '1' ? '分级累进': deductData.commissionCalculation === '2' ? '分级累进回溯' : '简单分级（通提）'}}</p>
            <p>执行时间：{{deductData.executionStartTime}}</p>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="info" plain @click="dialogSave = false">取消</el-button>
          <el-button type="warning" @click="addDeduct">确认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { MIXINS } from "@/assets/js/mixins";
import { TOOL } from "@/assets/js/common";
import elTree2 from "@/components/tree/src/tree.vue";
import selectTree from "./selectTree.vue";
import myPagination from "./myPagination";
export default {
  name: "deduct",
  mixins: [MIXINS],
  components: { elTree2, selectTree, myPagination },
  data() {
    return {
      power: {
        "sign-tcyw-set-query": {
          state: false,
          name: "查询",
        },
        "sign-tcyw-set-add": {
          state: false,
          name: "新增",
        },
      },
      // searchTop: null,
      searchForm: {
        systemTag: "",
        bonusName: "",
        positions: [],
        depId: [],
        timeType: "1",
        executionStartTime: [],
      },
      obj: {
        id: "depId",
        label: "name",
        children: "subs",
      },
      searchDepName: [],
      searchDepList: [],
      searchPositionRanksList: [],
      tableData: [],
      dialogTitle: "提成规则设置",
      dictionary: {
        // 字典
        659: "职级类型",
      },
      pageNum: 1,
      pageSize: 20,
      total: 0,
      dialogAddDeduct: false, // 提成规则弹窗,
      dialogSave: false,
      params: {},
      deductFilterable: true,
      deductData: {
        // 提成字段对象
        bonusName: "", // 规则名
        system: null, // 体系
        depId: "", //部门id
        position: "", //职务
        // levels: "", //等级
        tradeType: [], //合同类型 1、租赁  2、买卖/居间 3. 新房
        commissionCalculation: "", //提成计算方法 1.分级累进 2.分级累进回溯
        executionStartTime: "", //执行开始时间
      },
      commissionScheme: [
        {
          achievementGrade: { resultsStart: 0, resultsEnd: "" }, //业绩档次
          bonusProportion: "", //提成比例
        },
      ],
      searchDepList: [], // 搜索部门数据
      depList: [], // 体系对应部门列表
      depName: [],
      positionName: [],
      depKeyWords: "",
      defaultProps: {
        children: "subs",
        label: "name",
      },
      depDefaultCheckedKeys: [], //默认选中数组
      defaultCheckedKeys: [], //默认选中数组
      positionRanksList: [], // 体系对应职级列表
      levelsList: [], // 体系对应等级列表
      infinity: false, // 选择无穷大
    };
  },
  created() {
    //获取用户当前体系
    if (sessionStorage.getItem("userMsg")) {
      this.searchForm.systemTag =
        JSON.parse(sessionStorage.getItem("userMsg")).user.deptSystemtag || 0;
    }
    this.getSystemTag();
    this.getSystemTagSelect();
    this.getDictionary();
    this.getDep();
    this.getPosition("search");
    let res = this.getDataList;

    console.log(this.getDataList, 767);
    if (res && res.route === this.$route.path) {
      let session = JSON.parse(sessionStorage.getItem("sessionQuery"));
      let query = session.query;
      this.tableData = res.data.list;
      this.searchForm.systemTag = query.systemTag;
      this.searchForm.bonusName = query.bonusName;
      this.searchForm.positions = query.positions;
      this.searchForm.depId = query.depId;
      this.searchForm.timeType = query.timeType;
      this.searchForm.executionStartTime = query.executionStartTime;
      this.pageSize = query.pageSize;
      this.pageNum = query.pageNum;
    } else {
      // 列表
      this.getList();
    }
  },
  // mounted() {
  //   this.searchTop = this.$refs.topRef.$refs.content.firstChild.clientHeight
  //   window.onresize = () => {
  //     this.searchTop = this.$refs.topRef.$refs.content.firstChild.clientHeight
  //   }
  // },
  methods: {
    getList(type) {
      let params = {
        systemTag: this.searchForm.systemTag ? this.searchForm.systemTag : null,
        bonusName: this.searchForm.bonusName ? this.searchForm.bonusName : null,
        // executionStartTimeS: '',
        // executionStartTimeE: '',
        // createTimeS: '',
        // createTimeE: '',
        depId:
          this.searchForm.depId.length > 0
            ? this.searchForm.depId.toString()
            : null,
        position:
          this.searchForm.positions.length > 0
            ? this.searchForm.positions.toString()
            : null,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      };
      if (this.searchForm.timeType === "1") {
        params.executionStartTimeS =
          this.searchForm.executionStartTime.length > 0
            ? this.searchForm.executionStartTime[0] + '-1'
            : null;
        params.executionStartTimeE =
          this.searchForm.executionStartTime.length > 0
            ? this.searchForm.executionStartTime[1]
            : null;
      } else {
        params.createTimeS =
          this.searchForm.executionStartTime.length > 0
            ? this.searchForm.executionStartTime[0]
            : null;
        params.createTimeE =
          this.searchForm.executionStartTime.length > 0
            ? this.searchForm.executionStartTime[1]
            : null;
      }
      //点击查询时，缓存筛选条件
      if (type === "search" || type === "page") {
        sessionStorage.setItem(
          "sessionQuery",
          JSON.stringify({
            path: "/test",
            url: "/bonusSetting/listBonusSetting",
            query: params,
          })
        );
      }
      this.$ajax
        .postJSON("/api/bonusSetting/listBonusSetting", params)
        .then((res) => {
          res = res.data;
          if (res.status === 200) {
            this.tableData = res.data.list;
            over: for (let index = 0; index < this.tableData.length; index++) {
              const element = this.tableData[index];
              for (let i = 0; i < Object.keys(element).length; i++) {
                const key = Object.keys(element)[i];
                if (key !== "commissionSchemes") {
                  continue;
                } else {
                  element["achievementGrade"] = element[key].map(
                    (item, j, currentArray) => {
                      let achievementGrade = {
                        start: 0,
                        end: 0,
                      };
                      if (j === 0) {
                        achievementGrade.start = 0;
                        achievementGrade.end = Number.parseInt(
                          item.achievementGrade
                        );
                      } else {
                        for (let k = 0; k < j; k++) {
                          // console.log(Number.parseInt(currentArray[k].achievementGrade),k);
                          achievementGrade.start += Number.parseInt(
                            currentArray[k].achievementGrade
                          );
                        }
                        achievementGrade.end =
                          Number.parseInt(achievementGrade.start) +
                          Number.parseInt(item.achievementGrade);
                      }
                      return achievementGrade;
                    }
                  );
                  continue over;
                }
              }
            }
            // console.log(this.tableData,89888);
            this.total = res.data.total;
          }
        })
        .catch((error) => {
          this.$message({ message: error });
        });
    },
    // 判断筛选类型是否选择
    dataPickerFocus() {
      if (this.searchForm.timeType === "") {
        return this.$message({ message: "请先选择时间类型" });
      }
    },
    // 改变体系初始化节点数据
    changeSystemFn(val) {
      this.depKeyWords = "";
      this.defaultCheckedKeys = [];
      this.depName = [];
      this.getDepcopy();
      this.deductData.position = [];
      this.positionName = [];
      this.positionRanksList = [];
      this.getPosition();
    },
    getPosition(type) {
      let systemTag;
      if (type === "search") {
        systemTag = this.searchForm.systemTag;
      } else {
        systemTag = this.deductData.system.key;
      }
      this.$ajax
        .get("/api/employee/getPositionRank", {
          cityId: this.user.cityId,
          systemTag,
        })
        .then((res) => {
          res = res.data;
          if (res.status == 200) {
            if (type === "search") {
              this.searchPositionRanksList = res.data;
            } else {
              this.jobNameList = res.data;
              this.$set(this.positionRanksList, 0, {
                id: -1,
                Value: -1,
                parentId: -1,
                Text: "全部",
              });
              this.positionRanksList = this.positionRanksList.concat(res.data);
              if (type === "add") {
                this.deductData.position = [-1].concat(
                  res.data.map((item) => item.Value)
                );
                this.positionName = res.data.map((item) => item.Text);
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setDeductTreeMenu(keys, names) {
      console.log(keys, "传递了几次事件");
      this.defaultCheckedKeys = keys;
      this.depName = names;
    },
    cleanDefault() {
      this.depDefaultCheckedKeys = [];
    },
    setTreeMenu(key, data) {
      //获取子组件值
      this.searchForm.depId = key;
    },
    //搜索框体系变化时dep也随之变化
    sysTagChange(val) {
      console.log(val, 9090000);
      this.searchForm.depId = [];
      this.searchForm.positions = [];
      // this.$ajax.get('/api/organize/systemtag/deps', { systemTag: this.searchForm.systemTag }).then(res => {
      if (val) {
        this.$ajax
          .get("/api/access/systemtag/deps/tree", {
            systemTag: this.searchForm.systemTag,
          })
          .then((res) => {
            res = res.data;
            if (res.status == 200) {
              this.searchDepList = res.data;
              console.log(this.searchDepList);
            }
          });
        this.getPosition("search");
      } else {
        this.searchDepList = [];
        this.searchPositionRanksList = [];
      }
    },
    getDep() {
      // this.$ajax.get('/api/organize/systemtag/deps', { systemTag: this.searchForm.systemTag }).then(res => {
      this.$ajax
        .get("/api/access/systemtag/deps/tree", {
          systemTag: this.searchForm.systemTag,
        })
        .then((res) => {
          res = res.data;
          if (res.status == 200) {
            this.searchDepList = res.data;
            // console.log(this.searchDepList)
          }
        });
    },
    getDepcopy(type = "other") {
      if (!this.deductData.system || this.deductData.system.key == "") return;
      this.depList = [];
      let param = {
        systemTag: this.deductData.system.key,
        keyword: this.depKeyWords,
        isControl: true,
      };
      // let url = "";
      // if (this.depKeyWords) {
      //   url = "/api/access/systemtag/deps";
      // } else {
      let url = "/api/access/systemtag/deps/tree";
      // }
      this.$ajax.get(url, param).then((res) => {
        res = res.data;
        if (res.status === 200) {
          res.data.map((item, index) => {
            item.showCheckbox = true;
            if (!item.id) {
              item.id = item.depId;
            }
          });
          console.log(res.data, 888888);
          // if (this.depKeyWords) {
          //     this.depList = res.data.filter((v) => v.field2 === 0)
          // } else {
          // this.$set(this.depList, 0, {
          //   depId: -1,
          //   fiveLevelNum: 0,
          //   id: -1,
          //   level: -1,
          //   name: "全部",
          //   showCheckbox: true,
          //   subs: res.data
          // });
          this.depList = res.data;
          if (type === "add") {
            this.defaultCheckedKeys = [].concat(
              res.data.map((item) => item.id)
            );
            this.depDefaultCheckedKeys = [].concat(
              res.data.map((item) => item.id)
            );
            // this.depName = res.data.map(item => item.name)
          }
          // }
        }
      });
    },
    removeTagPositionRank(val) {
      let positionName = [];
      this.positionRanksList.forEach((item) => {
        if (!this.deductData.position.includes(item.Value)) return;
        if (
          item.Value !== -1 &&
          this.deductData.position.includes(item.Value)
        ) {
          positionName.push(item.Text);
        }
      });
      this.positionName = positionName;
    },
    clearPositionRank() {
      this.positionName = [];
    },
    changePositionRanks(val) {
      console.log(val, 787878878);
      let allRanks = [];
      let positionName = [];
      this.positionRanksList.forEach((item) => {
        if (item.Value !== -1) {
          allRanks.push(item.Value);
          positionName.push(item.Text);
        }
      });
      if (val.Value === -1) {
        if (
          this.deductData.position.length <= allRanks.length &&
          this.deductData.position.includes(-1)
        ) {
          allRanks.unshift(-1);
          this.deductData.position = allRanks;
          this.positionName = positionName;
        } else if (
          this.deductData.position.length === allRanks.length &&
          !this.deductData.position.includes(-1)
        ) {
          this.deductData.position = [];
          this.positionName = [];
        }
      } else if (
        this.deductData.position.length === allRanks.length &&
        !this.deductData.position.includes(-1)
      ) {
        allRanks.unshift(-1);
        this.deductData.position = allRanks;
        this.positionName = positionName;
      } else if (
        this.deductData.position.length === allRanks.length &&
        this.deductData.position.includes(-1)
      ) {
        this.deductData.position = this.deductData.position.filter((item) => {
          return item !== -1;
        });
        this.positionName = this.positionName.filter((item) => {
          return item !== val.Text;
        });
      } else {
        if (!this.deductData.position.includes(val.Value)) {
          this.positionName = this.positionName.filter((item) => {
            return item !== val.Text;
          });
        } else {
          this.positionName.push(val.Text);
        }
      }
    },
    showPositionRanksList() {
      if (!this.deductData.system || this.deductData.system.key == "") {
        return this.$message("请先选择体系");
      }
    },
    handleSelect(val) {
      this.infinity = true;
      console.log(val, 888);
    },
    querySearch(queryString, cb) {
      var restaurants = [{ value: "99999999999" }];
      var results = queryString ? [] : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    checkResultBonus(val, index) {
      val.bonusProportion = this.$tool.cutFloat({
        val: val.bonusProportion,
        max: 100,
      });

      // val.bonusProportion = val.bonusProportion.replace(/^([1-9]{1}\d{1}\.\d{2})$/,"")
      console.log(val.bonusProportion, 888);
    },
    checkResultEnd(val, index) {
      console.log(val, 333333);
      let len = this.commissionScheme.length;
      if (len - 1 > index) {
        let last = "";
        if (index === 0) {
          last = 0;
        } else {
          last = Number.parseInt(
            this.commissionScheme[index - 1].achievementGrade.resultsEnd
          );
        }
        let next = Number.parseInt(
          this.commissionScheme[index + 1].achievementGrade.resultsEnd
        );
        if (
          Number.parseInt(val.achievementGrade.resultsEnd) < last ||
          Number.parseInt(val.achievementGrade.resultsEnd) > next
        ) {
          val.achievementGrade.resultsEnd = "";
          return this.$message({
            type: "warning",
            message: `该值取值范围在${last}到${next}`,
          });
        } else {
          this.commissionScheme[index + 1].achievementGrade.resultsStart =
            val.achievementGrade.resultsEnd;
        }
      } else if (len === 1) {
        if (Number.parseInt(val.achievementGrade.resultsEnd) <= 0) {
          val.achievementGrade.resultsEnd = "";
          return this.$message({
            type: "warning",
            message: `该值取值大于0`,
          });
        }
      } else if (len - 1 === index) {
        let last = Number.parseInt(
          this.commissionScheme[index - 1].achievementGrade.resultsEnd
        );
        if (Number.parseInt(val.achievementGrade.resultsEnd) <= last) {
          val.achievementGrade.resultsEnd = "";
          return this.$message({
            type: "warning",
            message: `该值取值小于${last}`,
          });
        }
      }
    },
    inputResultEnd(val, index) {
      val.achievementGrade.resultsEnd = val.achievementGrade.resultsEnd.replace(
        /[^0-9]/gi,
        ""
      );
    },
    addCircle(val, index, type) {
      let len = this.commissionScheme.length;
      if (type === "add") {
        let findIndex = this.commissionScheme.findIndex((item) => {
          return item.achievementGrade.resultsEnd === "";
        });
        if (findIndex !== -1) {
          return this.$message({
            type: "warning",
            message: "请输入当前档次最大值",
          });
        }
        if (index === len - 1) {
          this.commissionScheme.push({
            achievementGrade: {
              resultsStart: val.achievementGrade.resultsEnd,
              resultsEnd: "",
            }, //业绩档次
            bonusProportion: "", //提成比例
          });
        }
        // 中间添加
        // else {
        //   this.commissionScheme.splice(index + 1, 0, {
        //     achievementGrade: {
        //       resultsStart: val.achievementGrade.resultsEnd + 1,
        //       resultsEnd: "",
        //     }, //业绩档次
        //     bonusProportion: "", //提成比例
        //   });
        // }
      } else {
        if (len === 1) return;
        this.commissionScheme.splice(index, 1);
      }
    },
    checkSave() {
      if (
        this.deductData.system === null ||
        this.deductData.bonusName === "" ||
        this.defaultCheckedKeys.length === 0 ||
        this.deductData.position.length === 0 ||
        this.deductData.tradeType.length === 0 ||
        this.deductData.commissionCalculation === "" ||
        !this.deductData.executionStartTime
      ) {
        return this.$message({
          type: "warning",
          message: "请把信息填写完整",
        });
      }
      let params = {
        systemTag: this.deductData.system.key,
        systemName: this.deductData.system.value,
        positionName: this.positionName.join(","),
        tradeType: this.deductData.tradeType.join(","),
        commissionCalculation: this.deductData.commissionCalculation,
        executionStartTime: this.deductData.executionStartTime + "-01",
        bonusName: this.deductData.bonusName,
        commissionScheme: [],
      };
      for (let index = 0; index < this.commissionScheme.length; index++) {
        const element = this.commissionScheme[index];
        if (!element.bonusProportion) {
          return this.$message({
            type: "warning",
            message: "请把信息填写完整",
          });
        }
        for (let i = 0; i < this.commissionScheme.length; i++) {
          const item = this.commissionScheme[i];
          if (
            this.commissionScheme.length === 1 &&
            element.achievementGrade.resultsEnd <= 0
          ) {
            return this.$message({
              type: "warning",
              message: "第一档次不得低于0",
            });
          } else if (
            this.commissionScheme.length - 1 === index &&
            element.achievementGrade.resultsEnd !== "99999999999"
          ) {
            return this.$message({
              type: "warning",
              message: "最后一档结束范围必须设置无穷大",
            });
          } else if (
            index > i &&
            Number.parseInt(element.achievementGrade.resultsEnd) <=
              Number.parseInt(item.achievementGrade.resultsEnd)
          ) {
            return this.$message({
              type: "warning",
              message: "不在正常范围内",
            });
          } else if (
            index < i &&
            Number.parseInt(element.achievementGrade.resultsEnd) >=
              Number.parseInt(item.achievementGrade.resultsEnd)
          ) {
            return this.$message({
              type: "warning",
              message: "不在正常范围内",
            });
          }
        }
        params.commissionScheme.push({
          grade: index + 1,
          achievementGrade:
            element.achievementGrade.resultsEnd -
            element.achievementGrade.resultsStart,
          bonusProportion: Number.parseFloat(element.bonusProportion),
        });
      }
      console.log(this.deductData, 999);
      let depId = this.defaultCheckedKeys.filter((item) => {
        return item !== -1;
      });
      let position = this.deductData.position.filter((item) => {
        return item !== -1;
      });
      params["depId"] = depId.join(",");
      params["depName"] = this.depName.join(",");
      params["position"] = position.join(",");
      this.params = params;
      this.dialogSave = true;
    },
    addDeduct() {
      this.$ajax
        .postJSON("/api/bonusSetting/insertBonusSetting", this.params)
        .then((res) => {
          res = res.data;
          if (res.status === 200) {
            this.$message({
              type: "success",
              message: res.message,
            });
            this.dialogSave = false;
            this.dialogAddDeduct = false;
            this.getList();
          }
        })
        .catch((error) => {
          this.$message({ message: error });
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList("page");
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getList("page");
    },
    queryFn() {
      this.getList("search");
    },
    resetFormFn() {
      this.$refs.selectTreeRef.clean();
      this.searchForm.systemTag = "";
      this.searchForm.bonusName = "";
      this.searchForm.positions = [];
      this.searchForm.depId = [];
      this.searchForm.timeType = "";
      this.searchForm.executionStartTime = [];
      this.searchDepList = [];
      this.searchPositionRanksList = [];
    },
    add(type) {
      let myDate = new Date();
      let tYear = myDate.getFullYear();
      let tMonth = myDate.getMonth();

      let m = tMonth + 1;
      if (m.toString().length == 1) {
        m = "0" + m;
      }
      (this.deductData = {
        bonusName: "", // 规则名
        system: this.systemTagSelect.filter(
          (item) => item.key === this.user.deptSystemtag
        )[0], // 体系
        depId: [], //部门id
        position: [], //职务
        tradeType: [], //合同类型 1、租赁  2、买卖/居间 3. 新房
        commissionCalculation: "", //提成计算方法 1.分级累进 2.分级累进回溯
        executionStartTime: tYear + "-" + m, //执行开始时间
      }),
        (this.commissionScheme = [
          {
            achievementGrade: { resultsStart: 0, resultsEnd: "" }, //业绩档次
            bonusProportion: "", //提成比例
          },
        ]);
      this.positionRanksList = [];
      this.defaultCheckedKeys = [];
      this.depName = [];
      this.getDepcopy("add");
      this.getPosition("add");
      // this.changePositionRanks(this.positionRanksList[0])
      this.dialogAddDeduct = true;
    },
  },
  watch: {
    "searchForm.timeType": function (val, old) {
      this.searchForm.executionStartTime = [];
    },
    lastCommissionSchemeResultsEnd: function (val, old) {
      val === "99999999999" ? (this.infinity = true) : (this.infinity = false);
    },
  },
  computed: {
    lastCommissionSchemeResultsEnd() {
      return this.commissionScheme[this.commissionScheme.length - 1]
        .achievementGrade.resultsEnd;
    },
    user() {
      return this.getUser.user;
    },
  },
};
</script>

<style scoped lang="less">
@import "~@/assets/common.less";
.commission-bgc {
  background-color: #ffa148;
}
.brand-nav {
  background-color: #f5f5f5;
  height: 50px;
  line-height: 50px;
  border: none;
  font-size: 16px;
  padding-left: 20px;
}
/deep/ .view-header {
  padding: 10px !important;
  .paper-box-content {
    margin-top: -30px !important;
  }
}
/deep/ .el-select .el-input.is-focus .el-input__inner {
  border-color: #ffa148;
}
/deep/ .is-active,
.el-range-editor.is-active:hover {
  border-color: #ffa148;
}
/deep/ .el-input__inner:focus {
  border-color: #ffa148 !important;
  outline: 0;
}
/deep/.el-table__body {
  .el-table__row {
    &.hover-row {
      background-color: #fff !important;
      td {
        background-color: #fff !important;
      }
    }
    &.collapseRow {
      .bgc {
        background-color: #ecf5ff !important;
      }
    }
  }
}
/deep/ .colorful {
  input::-webkit-input-placeholder {
    /* WebKit browsers */
    color: black !important;
    margin-left: 20px;
  }
  input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    margin-left: 20px;
    color: black !important;
  }
  input:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    margin-left: 20px;
    color: black !important;
  }
}
.contract-list {
  background-color: #fff;
  padding: 0 10px;
  border-radius: 2px;
  /deep/ .theader-bg {
    > th {
      background-color: #f5f5f9;
    }
  }
  .pagination-info {
    float: right;
    padding: 0 5px;
  }
  // box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
  .listTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
  }
}
/deep/ .el-dialog {
  border-radius: 12px;
  .el-dialog__header {
    background-color: #f0f3fa;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }
}
.deduct-dialog {
  /deep/ .el-dialog {
    .el-dialog__body {
      padding-left: 20px;
      border-bottom: 1px solid #edecf0;
    }
  }
  .deduct-content {
    padding: 10px;
    height: 500px;
    &::-webkit-scrollbar {
      display: none;
    }
    overflow-y: auto;
    .row {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding-bottom: 18px;
      margin-bottom: 10px;
      border-bottom: 1px solid #ccc;
      .dialog-item {
        flex: 0 0 50%;
        margin-top: 18px;
        .circle {
          display: inline-block;
          color: #fff;
          border-radius: 50%;
          font-size: 30px;
          vertical-align: middle;
          box-sizing: border-box;
          cursor: pointer;
        }
        .add {
          background-color: #ffa148;
          margin-left: 25px;
        }
        .sub {
          background-color: #8492a6;
          margin-left: 25px;
        }
      }
    }
    .grade {
      .row {
        padding-bottom: 0;
        border: none;
      }
    }
    .info-box {
      padding: 5px 10px;
      color: #e87058;
      background: rgba(232, 112, 88, 0.3);
      border-radius: 4px;
      p:nth-child(2) {
        text-indent: 28px;
      }
    }
  }
}
.warning-box {
  padding: 20px 50px;
  text-align: center;
  & > p:first-child {
    font-weight: bold;
  }
  .warning-content {
    margin-top: 10px;
    padding: 10px 30px;
    border-radius: 8px;
    background: #edeff5;
  }
}
</style>

