<template>
    <div class="data-list">
        <div class="table_head">
            <el-button type="primary" @click="addCon('添加合同资料')">添加</el-button>
        </div>
        <el-table :data="listData" style="width: 100%" class="contract-list">
            <el-table-column align="center" label="序号" type="index" width="90"></el-table-column>
            <el-table-column align="center" :label="item.name" :prop="item.prop" :formatter="item.prop==='isNecessary'?booleanFormatter:nullFormatter" v-for="item in tHeader" :key="item.id">
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button @click="rowOperation(scope.row,1,'编辑合同资料')" type="text" size="small">编辑</el-button>
                    <el-button @click="rowOperation(scope.row,2)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加合同资料 -->
        <el-dialog :title="contractTitle" :visible.sync="contractVisible" width="740px">
            <el-form v-model="contractForm" class="contract-form" size="small">
                <el-form-item label="信息类型">
                    <el-select v-model="contractForm.type" placeholder="请选择信息类型">
                        <el-option label="买方" value="买方"></el-option>
                        <el-option label="卖方" value="卖方"></el-option>
                        <el-option label="其它" value="其它"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资料名称">
                    <el-input v-model="contractForm.name" maxlength="15"></el-input>
                </el-form-item>
                <el-form-item label="是否必填">
                    <el-radio label="1" v-model="contractForm.isNecessary">是</el-radio>
                    <el-radio label="2" v-model="contractForm.isNecessary">否</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="modal-footer">
                <el-button @click="submitForm" class="confirmBtn">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
           
<script>
import { FILTER } from "@/assets/js/filter";
export default {
  mixins: [FILTER],
  data() {
    return {
      listData: [],
      pageSize: 10,
      pageNum: 1,
      contractTitle: "", //弹出框 标题
      //列表 表头
      tHeader: [
        {
          id: 1,
          prop: "name",
          name: "名称"
        },
        {
          id: 2,
          prop: "type",
          name: "信息类型"
        },
        {
          id: 3,
          prop: "isNecessary",
          name: "是否为必选项"
        }
      ],
      contractVisible: false,
      // 表单数据
      contractForm: {
        cityId: 1,
        type: "",
        name: "",
        isNecessary: ""
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 获取合同资料库列表
    getData: function() {
      let param = {
        cityId: 1,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      this.$ajax
        .postJSON("/api/flowmanage/selectConAttachPageList", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.listData = res.data;
          }
        });
    },
    // 点击添加
    addCon(title) {
      this.contractVisible = true;
      this.contractTitle = title;
      for (let key in this.contractForm) {
        if (key === "id") {
          delete this.contractForm[key];
        } else if (key === "cityId") {
          this.contractForm[key] = 1;
        } else {
          this.contractForm[key] = "";
        }
      }
    },
    // 编辑 删除 操作
    rowOperation(row, opera, title) {
      debugger;
      if (opera === 1) {
        this.contractVisible = true;
        this.contractTitle = title;
        this.contractForm = JSON.parse(JSON.stringify(row));
        this.contractForm.isNecessary = this.contractForm.isNecessary.toString();
        delete this.contractForm.isDel;
      } else if (opera === 2) {
        this.$ajax
          .post("/api/flowmanage/deleteConAttach", { id: row.id })
          .then(res => {
            res = res.data;
            if (res.status === 200) {
              this.$message(res.message);
              this.getData();
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    // 提交表单
    submitForm() {
      if (this.contractTitle === "添加合同资料") {
        debugger;
        const url = "/api/flowmanage/insertConAttach";
        this.conPost(url);
      } else if (this.contractTitle === "编辑合同资料") {
        const url = "/api/flowmanage/updateConAttach";
        this.conPost(url);
      }
    },
    // 添加 编辑 请求
    conPost(url, param) {
      this.$ajax
        .post(url, this.contractForm)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.$message(res.message);
            this.contractVisible = false;
            this.getData();
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style scoped lang="less">
.data-list {
  .table_head {
    padding: 13px 10px;
    display: flex;
    justify-content: flex-end;
    background-color: #fff;
    border-top: 1px solid rgba(237, 236, 240, 1);
    .el-button {
      width: 100px;
      height: 36px;
      border-radius: 18px;
    }
  }
  .contract-list {
    padding: 0 12px;
  }
  .contract-form {
    .el-form-item {
      display: flex;
      &:nth-child(-n + 2) {
        /deep/ .el-input {
          width: 278px;
        }
      }
    }
  }
}
</style>