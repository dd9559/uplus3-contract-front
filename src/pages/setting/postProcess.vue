<template>
  <div class="view-container">
    <ul class="tabs">
      <li v-for="item in tabs" :class="[activeItem===item.id?'active':'']" @click="checkTab(item)">{{item.name}}</li>
    </ul>
    <div class="data-list">
      <el-table :data="listData" style="width: 100%" @row-dblclick="getRowDetails">
        <el-table-column align="center" :label="item.name" :prop="item.prop" :formatter="nullFormatter"
                         v-for="item in tHeader" :key="item.id"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="rowOperation(scope.row,1)" type="text" size="small">编辑</el-button>
            <el-button @click="rowOperation(scope.row,2)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" class="el-icon-plus" @click="showModal('添加步骤类型')">添加步骤类型</el-button>
    </div>
    <div class="data-list other">
      <el-table class="inner-table" :data="listData_other" border style="width: 100%" :span-method="arraySpanMethod">
        <el-table-column align="center" :label="item.name" :prop="item.prop" :formatter="nullFormatter"
                         v-for="item in tHeader_other" :key="item.id">
          <template slot-scope="scope">
            <template v-if="item.name==='步骤附属信息'">
              <!--{{JSON.parse(scope.row.transStepsAttach).transStepsAttach}}-->
              <el-table :data="JSON.parse(scope.row.transStepsAttach).transStepsAttach" style="width: 100%"
                        :show-header="false">
                <el-table-column align="center" label="步骤附属信息" prop="title"
                                 :formatter="nullFormatter"></el-table-column>
                <el-table-column align="center" label="信息类型" prop="type" :formatter="nullFormatter"></el-table-column>
                <el-table-column align="center" label="是否必填" prop="name" :formatter="nullFormatter"></el-table-column>
              </el-table>
            </template>
            <template v-else-if="item.name==='操作'">
              <el-button @click="rowOperation(scope.row,'edit','stepBusiness')" type="text" size="small">编辑</el-button>
              <el-button @click="rowOperation(scope.row,'delete','stepBusiness')" type="text" size="small">删除
              </el-button>
            </template>
            <template v-else>
              {{scope.row[item.prop]}}
            </template>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" class="el-icon-plus" @click="showModal('添加交易步骤')">添加交易步骤</el-button>
      <div class="drop-view" ref="dragWindow">
        <img :src="getImg('test.jpg')" width="1000px" :height="imgHeight" alt="">
        <span class="btn-drop" ref="dropBtn">盖章</span>
      </div>
    </div>
    <div class="modal">
      <el-dialog :title="modalTitle" :visible.sync="modal">
        <div class="modal-context">
          <template v-if="modalTitle==='添加步骤类型'">
            <div class="input-group">
              <label>步骤类型：</label>
              <el-input type="text" v-model="stepType.type"></el-input>
            </div>
            <div class="input-group">
              <label>负责角色：</label>
              <el-select v-model="stepType.role" placeholder="请选择">
                <el-option
                  v-for="item in roleListData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </template>
          <template v-else>
            <div class="input-group">
              <label>步骤名称：</label>
              <span>{{stepBusiness.stepsTypeName}}</span>
            </div>
            <div class="input-group">
              <label>步骤名称：</label>
              <el-input type="text" v-model="stepBusiness.name"></el-input>
            </div>
            <div class="input-group">
              <label>计划天数：</label>
              <el-input type="text" v-model="stepBusiness.planDays"></el-input>
            </div>
            <div class="input-group">
              <label>超时提醒：</label>
              <el-input type="text" v-model="stepBusiness.overTimeDays"></el-input>
            </div>
            <div class="input-group">
              <label>是否短信提醒：</label>
              <el-radio v-model="stepBusiness.isSms" label="1">是</el-radio>
              <el-radio v-model="stepBusiness.isSms" label="2">否</el-radio>
            </div>
            <div class="menu-table">
              <p>附属信息</p>
              <el-table border :data="tableForm" style="width: 100%">
                <el-table-column align="center" label="名称">
                  <template slot-scope="scope">
                    <el-input v-model="tableForm[scope.$index].title"></el-input>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="信息类型">
                  <template slot-scope="scope">
                    <!--<el-select v-model="tableForm[scope.$index].type" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>-->
                  </template>
                </el-table-column>
                <el-table-column align="center" label="是否必填" min-width="140px">
                  <template slot-scope="scope">
                    <el-radio v-model="tableForm[scope.$index].isRequired" label="1">是</el-radio>
                    <el-radio v-model="tableForm[scope.$index].isRequired" label="2">否</el-radio>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button @click="rowOperation(scope.row,'delete','info')" type="text" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <p>
                <el-button @click="addCell" class="el-icon-plus">添加</el-button>
              </p>
            </div>
          </template>
        </div>
        <div slot="footer" class="modal-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {FILTER} from "@/assets/js/filter";
  import {TOOL} from "../../assets/js/common";

  let stepTypeId = 1;
  let imgSize = 4 / 3;
  let mouseStart = {
    start: false
  }

  export default {
    name: "post-process",
    mixins: [FILTER],
    data() {
      return {
        tabs: [
          {
            id: 1,
            name: '交易步骤',
            url: '/flowmanage/selectTypeStepsList'
          },
          {
            id: 2,
            name: '交易流程',
            url: '/flowmanage/selectFlowList'
          },
          {
            id: 3,
            name: '合同资料库',
            url: '/flowmanage/selectDatabaseList'
          }
        ],
        tHeader: [
          {
            id: 1,
            prop: 'name',
            name: '步骤类型'
          },
          {
            id: 2,
            prop: 'dutyType',
            name: '负责角色'
          },
          {
            id: 3,
            prop: '',
            name: '步骤数量'
          }
        ],
        tHeader_other: [
          {
            id: 1,
            prop: 'stepsTypeName',
            name: '步骤类型'
          },
          {
            id: 2,
            prop: 'name',
            name: '步骤名称'
          },
          {
            id: 3,
            prop: 'planDays',
            name: '计划天数'
          },
          {
            id: 4,
            prop: 'overTimeDays',
            name: '超时提醒'
          },
          {
            id: 5,
            prop: 'isSms',
            name: '是否短信通知'
          },
          /*{
            id: 6,
            prop: 'test',
            name: ''
          }*/
          {
            id: 6,
            prop: '',
            name: '步骤附属信息'
          },
          {
            id: 7,
            prop: '',
            name: '信息类型'
          },
          {
            id: 8,
            prop: '',
            name: '是否必填'
          },
          {
            id: 9,
            prop: '',
            name: '操作'
          }
        ],
        activeItem: 1,//Tab当前项
        listData: [],
        listData_other: [],
        modal: false,
        modalTitle: '',
        //步骤类型
        stepType: {
          type: '',
          role: ''
        },
        //交易步骤
        stepBusiness: {
          stepsTypeId: '',
          stepsTypeName: '',
          name: '',
          planDays: '',
          overTimeDays: '',
          isSms: ''
        },
        roleListData: [],//负责角色
        tableForm: [
          {
            id: 1,
            isRequired: '',
            title: '',
            type: '',
          }
        ],
      }
    },
    created() {
      this.getData(this.tabs[0].url)
    },
    mounted() {
      let objX = 0
      let objY = 0
      let dragObj = this.$refs.dropBtn //拖拽对象

      dragObj.onmousedown = function () {
        mouseStart = Object.assign({start: true}, TOOL.getMousePos())
        // console.log(mouseStart)
        objX = !dragObj.style.left ? 0 : parseInt(dragObj.style.left.split('px')[0])
        objY = !dragObj.style.top ? 0 : parseInt(dragObj.style.top.split('px')[0])
      }

      document.onmousemove = function () {
        if (mouseStart.start) {
          let location = TOOL.getMousePos()
          dragObj.style.left = `${location.x - mouseStart.x + objX}px`;
          dragObj.style.top = `${location.y - mouseStart.y + objY}px`;
        }

      }

      document.onmouseup = function () {
        mouseStart = {start: false}
        let dragWindow = this.$refs.dragWindow
        let rateX = parseInt(dragObj.style.left.split('px')[0])/dragWindow.clientWidth
        console.log(rateX.toFixed(2))
      }.bind(this)
    },
    methods: {
      getImg: function (url) {
        return require('@/assets/img/' + url)
      },
      checkTab: function (item) {
        this.activeItem = item.id
        this.getData(item.url)
      },
      getData: function (type) {
        this.$ajax.get(`/api${type}`, {cityId: 1}).then(res => {
          res = res.data
          if (res.status === 200) {
            this.listData = res.data
          }
        })
      },
      /**
       * 获取步骤类型的交易步骤
       * @param row
       */
      getRowDetails: function (row) {
        this.stepBusiness.stepsTypeName = row.name
        this.stepBusiness.stepsTypeId = row.id
        this.$ajax.get('/api/flowmanage/selectStepsListByType', {stepsTypeId: row.id}).then(res => {
          res = res.data
          if (res.status === 200) {
            this.listData_other = res.data
          }
        }).catch(error => {
          console.log(error)
        })
      },
      showModal: function (title) {
        this.modalTitle = title
        this.modal = true
      },
      arraySpanMethod({row, column, rowIndex, columnIndex}) {
        // debugger
        if (columnIndex === 5) {
          return [1, 3];
        } else if (columnIndex === 6 || columnIndex === 7) {
          return [0, 0]
        }
      },
      addCell: function () {
        let cell = {
          id: ++stepTypeId,
          isRequired: '',
          title: '',
          type: '',
        }
        this.tableForm.push(cell)
        console.log(this.tableForm)
      },
      /**
       * 列表操作
       * @param row
       * @param type
       */
      rowOperation: function (row, opera, type) {
        if (opera === 'delete') {
          if (type === 'info') {
            this.tableForm.find((item, index) => {
              if (item.id === row.id) {
                this.tableForm.splice(index, 1)
                return true
              }
            })
          } else if (type === 'stepBusiness') {
            this.$ajax.post('/api/flowmanage/deleteSteps', {id: row.id}).then(res => {
              res = res.data
              if (res.status === 200) {
                this.$message('删除交易步骤成功')
              }
            }).catch(error => {
              console.log(error)
            })
          }
        }
      },
      /**
       * 提交表单
       */
      submitForm: function () {
        if (this.modalTitle === '添加交易步骤') {
          let obj = {
            transStepsAttach: this.tableForm
          }
          obj = Object.assign({}, this.stepBusiness, {transStepsAttach: JSON.stringify(obj)})
          console.log(obj)
          this.$ajax.post('/api/flowmanage/insertSteps', obj).then(res => {

          }).catch(error => {
            console.log(error)
          })
        }
      },
      mouseDown: function () {
        let target = this.$refs.dropBtn
        mouseStart = Object.assign({start: true}, TOOL.getMousePos())
        console.log(document)
        /*document.onmousemove = function (event) {
          let location = TOOL.getMousePos()
          console.log(location)
          if(mouseStart.start){
            target.style.left = `${location.x}px`
            target.style.top = `${location.y}px`
          }
        }
        document.onmouseup = function () {
          mouseStart = {start:false}
        }*/
      },
      mouseEnd: function () {
        /*debugger
        mouseStart = {start:false}*/
      }
    },
    computed: {
      imgHeight: function () {
        return `${1000 / imgSize}px`
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";

  .drop-view {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9;
    .btn-drop {
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  /deep/ .inner-table {
    padding: 0px;
    .el-table__row {
      > td {
        /*border: 0;*/
        &:nth-of-type(6) {
          padding: 0;
          > .cell {
            padding: 0;
          }
        }
      }
    }
  }

  .tabs {
    display: flex;
    > li {
      height: 50px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      border: 1px solid @color-grey;
      &.active {
        background-color: @color-blue;
        color: @color-white;
      }
      &:nth-of-type(n+2) {
        border-left: 0px;
      }
    }
  }
</style>
