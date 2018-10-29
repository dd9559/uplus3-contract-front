<template>
  <div class="view-container">
    <div class="data-list">
      <el-table :data="list" style="width: 100%" @row-dblclick="getRowDetails">
        <el-table-column align="center" label="城市" prop="cityName" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="合同类型" prop="typeName" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="合同名称" prop="name" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="合同版本号" prop="version" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="上传人" prop="uploadByName" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="上传时间" prop="uploadTime" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="已使用份数" prop="useNum" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="rowOperation(scope.row,1)" type="text" size="small">上传</el-button>
            <el-button @click="rowOperation(scope.row,2)" type="text" size="small" v-if="scope.row.useNum>0">预览
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="modal" v-show="modal">
      <template v-if="template===1">
        <p>上传合同模板<span class="icon-font-close" @click="modal=false"></span></p>
        <div class="modal-context">
          <div class="input-group">
            <label>合同名称：</label>
            <el-input placeholder="限制15个字符"></el-input>
          </div>
          <div class="input-group file-upload">
            <label>上传：</label>
            <div class="file-upload-opera">
              <template v-if="uploadType">
                <p @click="upload('fileOne')">
                  <span>+</span>
                  <span>买卖</span>
                  <input type="file" ref="fileOne" @change="uploadFile" style="display: none;">
                </p>
                <p @click="upload('fileTwo')">
                  <span>+</span>
                  <span>居间</span>
                  <input type="file" ref="fileTwo" style="display: none;">
                </p>
              </template>
              <template v-else>
                <p @click="upload('fileOne')">
                  <span>+</span>
                  <input type="file" ref="fileOne" @change="uploadFile" style="display: none;">
                </p>
              </template>
            </div>
          </div>
        </div>
      </template>
      <template v-if="template===2">
        <p>预览合同模板<span class="icon-font-close" @click="modal=false"></span></p>
      </template>
      <template v-if="template===3">
        <p>合同类型详情<span class="icon-font-close" @click="modal=false"></span></p>
        <el-table :data="list">
          <el-table-column align="center" min-width="100px" label="合同版本号" prop="version"
                           :formatter="nullFormatter"></el-table-column>
          <el-table-column align="center" min-width="100px" label="合同名称" prop="name"
                           :formatter="nullFormatter"></el-table-column>
          <el-table-column align="center" min-width="100px" label="上传人" prop="uploadByName"
                           :formatter="nullFormatter"></el-table-column>
          <el-table-column align="center" min-width="100px" label="上传时间" prop="uploadTime"
                           :formatter="nullFormatter"></el-table-column>
          <el-table-column align="center" min-width="100px" label="操作">
            <template slot-scope="scope">
              <el-button @click="rowOperation(scope.row,1)" type="text" size="small">启用</el-button>
              <el-button @click="rowOperation(scope.row,2)" type="text" size="small">预览</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>

<script>
  import {FILTER} from "@/assets/js/filter";

  export default {
    name: "contract-template",
    mixins: [FILTER],
    data() {
      return {
        list: [],
        rowData: [],
        modal: false,
        template: 1,//弹窗内容
        uploadType: false,//是否显示两个上传
      }
    },
    created() {
      this.getList()
    },
    methods: {
      /**
       * 获取列表数据
       */
      getList: function () {
        let param = {
          cityId: 1
        }
        this.$ajax.get('/api/setting/contractTemplate/list', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.list = res.data
          }
        }).catch(error => {
          console.log(error)
        })
      },
      /**
       * 获取详情
       * @param row
       */
      getRowDetails: function (row) {
        this.$ajax.get('/api/setting/contractTemplate/listByType', {id: row.id}).then(res => {
          res = res.data
          if (res.status === 200) {
            this.rowData = res.data
            this.modal = true
            this.template = 3
          }
        }).catch(error => {
          console.log(error)
        })
      },
      upload:function(type){
        this.$refs[type].click()
      },
      uploadFile:function (e) {
        const file = e.target.files[0];
        let fileType = file.name.split('.')[1]
        if(fileType==='word'){

        }else {
          this.$message('只支持word格式')
        }
      },
      rowOperation: function (row, type = 1) {
        this.modal = true
        this.template = type
        if (type === 1) {
          this.uploadType = (row.cityName==='武汉'&&row.typeName==='买卖')
        }else {
          this.$ajax.get('/api/setting/contractTemplate/show',{enableTemplateId:row.enableTemplateId}).then(res=>{

          }).catch(error=>{
            console.log(error)
          })
        }
      }
    },
    watch: {
      modal: function (val) {
        if (!val) {
          this.template = 1
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";

  .icon-font-close {
    &:after {
      content: 'X';
      position: absolute;
      top: 50%;
      right: 20px;
      -webkit-transform: translateY(-50%);
      -moz-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      -o-transform: translateY(-50%);
      transform: translateY(-50%);
    }
  }

  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: @bg-white;
    min-width: 400px;
    min-height: 200px;
    z-index: 9;
    padding: 50px 20px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    > p {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background-color: @bg-grey;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .input-group {
      display: flex;
      align-items: center;
      > label {
        min-width: 100px;
      }
    }
    .file-upload{
      &-opera{
        display: flex;
        >p{
          display: inherit;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-right: 20px;
        }
      }
    }
  }
</style>
