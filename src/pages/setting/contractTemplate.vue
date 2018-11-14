<template>
  <div class="view-container">
    <el-form ref="form" :model="flowForm" label-width="80px">
      <el-form-item label="城市选择" class="selectCity">
        <el-select v-model="flowForm.selectCity" placeholder="请选择">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="data-list">
      <el-table :data="list" style="width: 100%" @row-dblclick="getRowDetails" :default-sort = "{prop: 'uploadTime', order: 'descending'}">
        <el-table-column align="center" label="城市" prop="cityName" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="合同类型" prop="typeName" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="合同名称" prop="name" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="合同版本号" prop="version" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="上传人" prop="uploadByName" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="上传时间" :formatter="nullFormatter">
          <template slot-scope="scope">
            {{scope.row.uploadTime | formatDate}}
          </template>
        </el-table-column>
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
    <!-- 上传,预览,详情弹出框 -->
    <el-dialog class="modal" :title='titleStr' :visible.sync="modal" >
      <template v-if="template===1">
        <div class="">
          <div class="modal-context">
            <label>合同名称：</label>
            <el-input placeholder="限制15个字符" maxlength='15'></el-input>
          </div>
          <div class="file-upload">
            <label>上传：</label>
            <div class="file-upload-opera">
              <template v-if="uploadType">
                <p @click="upload('fileOne')">
                  <el-button>买卖</el-button>
                  <input type="file" ref="fileOne" @change="uploadFile" style="display: none;">
                </p>
                <p @click="upload('fileTwo')">
                   <el-button>居间</el-button>
                   <input type="file" ref="fileTwo" style="display: none;"><br>
                   <span class="upMsg">上传成功</span> 
                </p>
                <span class="wordtip">温馨提示：只支持Word格式</span>
                <el-button class="sureUp" @click='sureUp'>确定</el-button>  
              </template>
              <template v-else>
                <p @click="upload('fileOne')">
                  <el-button>模板</el-button><br>
                <input type="file" ref="fileOne" @change="uploadFile" style="display: none;">
                <span class="upMsg">上传成功</span>                  
                </p>
                <span class="wordtip">温馨提示：只支持Word格式</span> 
                <el-button class="sureUp" @click='sureUp'>确定</el-button>                  
              </template>
            </div>
          </div>
        </div>
      </template>
      <template v-if="template===2">
        sssssssssssss
      </template>
      <template v-if="template===3">
        <el-table :data="list" class="contractType">
          <el-table-column align="center" min-width="100px" label="合同版本号" prop="version"
                           :formatter="nullFormatter"></el-table-column>
          <el-table-column align="center" min-width="100px" label="合同名称" prop="name"
                           :formatter="nullFormatter"></el-table-column>
          <el-table-column align="center" min-width="100px" label="上传人" prop="uploadByName"
                           :formatter="nullFormatter"></el-table-column>
          <el-table-column align="center" min-width="100px" label="上传时间" 
                           :formatter="nullFormatter" prop="uploadTime"></el-table-column>
          <el-table-column align="center" min-width="100px" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="enable">启用</el-button>
              <el-button @click="rowOperation(scope.row,2)" type="text" size="small">预览</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import {FILTER} from "@/assets/js/filter";

  export default {
    name: "contract-template",
    mixins: [FILTER],
    data() {
      return {
        flowForm: {
        selectCity: '',
        },
        list: [],
        rowData: [],
        modal: false,
        template: '',//弹窗内容
        uploadType: false,//是否显示两个上传
        fileList3: [],
        titleStr:'',
      }
    },
    created() {
      this.getList()
    },

    methods: {
      /**
       * 弹框
       */
      popMsg(msg,callback){
        this.$confirm(msg,'提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
           callback()
        }).catch(()=>{

        })
      },
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
       * 上传
       */
      sureUp(){      
       this.popMsg('确定要上传此类型模板吗？',()=>{
         console.log('上传');
         this.modal=false
       })
      },
      /**
       * 启用
       */
      enable(){
        this.popMsg('确定要启用此类型模板吗？',()=>{
         console.log('启用');
         this.modal=false
       })
      },
      /**
       * 获取详情
       * @param row
       */
      getRowDetails: function (row, column, cell, event) {
          this.$ajax.get('/api/setting/contractTemplate/listByType', {id: row.id,cityName:row.cityName}).then(res => {
          res = res.data
          if (res.status === 200) {
            this.rowData = res.data
            this.modal = true
            this.titleStr='合同模板详情'
            this.template = 3
          }
        }).catch(error => {
          console.log(error)
        })
      },
      upload:function(type){
        this.$refs[type].click()
      },
      uploadFile:function (file,fileList) {
        let fileType= file.name.split('.')
        if(fileType[1]=='docx'){
          console.log('上传的是word文档');
          const file = e.target.files[0];
          console.log(file,'form数据');
           let da = new FormData()
           da.append("files",this.file)
           this.$ajax.post('/setting/contractTemplate/upload',this.da).then(()=>{

           })
        }
        },
      rowOperation: function (row, type) {
        console.log(type,"type");
        //上传
        this.modal = true
        this.template = type
        if(type===1){
            this.titleStr='上传合同模板'
            this.uploadType = (row.cityName==='武汉'&&row.typeName==='买卖')
        }
        //预览
        else if(type===2){
           this.titleStr='预览合同模板'
           this.$ajax.get('/api/setting/contractTemplate/show',{enableTemplateId:row.enableTemplateId}).then(res=>{
            console.log(res)
            })
        }
      }
    },
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
.view-container{
  /deep/
  .el-form {
    background:rgba(255,255,255,1);
    box-shadow:0px 1px 6px 0px rgba(7,47,116,0.1);
    border-radius:4px;
    border: 1px solid transparent;
    .selectCity {
      margin-top: 24px;
      line-height: 32px;
      height: 32px;
      .el-form-item__content, 
      .el-form-item__label {
        line-height: 32px;
      }
    }
    .el-select {
      width: 150px;
      height: 32px;
      .el-input {
        height: 100%;
        .el-input__inner {
          height: 100%;
          padding-left: 8px;
        }
        .el-input__icon {
          line-height: 32px;
        }
      }
    }
  } 
} 
  .data-list {
    /deep/ 
    .has-gutter {
        tr {
          border-radius: 4px;
          th {
            background: rgba(238, 242, 251, 1) !important;
            .cell{
              font-size:14px;
              font-family:MicrosoftYaHei;
              font-weight:400;
              color:rgba(108,121,134,1);
            }
          }
        }
      }
      /deep/
    .el-table__body-wrapper{
      tbody{
         .el-table__row{
          td{
            .cell{
              font-weight:400;
              color:rgba(35,50,65,1);
            }
          }
        }
        .el-table__row{
          td:nth-child(2){
            .cell{
              color:#409EFF;
            }
          }
        }
      }
    }
  }
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
    > p {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding-left: 21px;
      height: 50px;
      display: flex;
      justify-content: left;
      align-items: center;
      border-bottom: solid 1px rgba(237,236,240,1); 
    }
    .modal-context {
      display: flex;
      align-items: center;
      > label {
        min-width: 100px;
      }
    }
    .file-upload{
      margin-top: 30px;
      display: flex;
      >label {
        min-width: 100px;
      }
      &-opera{
        display: flex;
        flex-direction: column;
        >p{
          /deep/
          .el-button{
            width:86px;
            height:32px;
            line-height: 7px;
            background:rgba(71,141,227,1);
            border-radius:16px;
            color: white;
            text-align: center;
          }
        }
        >p:nth-child(2){
          margin-top: 30px;
        }
        span{
          font-size:14px;
          font-family:MicrosoftYaHei;
          font-weight:400;
          color:rgba(108,121,134,1);
          line-height:42px;
        }
         .sureUp{
            width:86px;
            height:32px;
            line-height: 7px;
            background:rgba(71,141,227,1);
            border-radius:16px;
            color: white;
            text-align: center;
            position: absolute;
            right: 21px;
            bottom: 10px;
        }
      }
    }
    .contractType{
      border:solid 1px rgba(237,236,240,1);
      /deep/
        .has-gutter{
          th{
             background:rgba(238,242,251,1);
            .cell{
            font-size:14px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(108,121,134,1);
            line-height:42px;
            }
          }
        }
    }
  }
</style>
