<template>
  <div>
    <!-- u+转成交弹框 -->
    <el-dialog
      title="转成交"
      :visible.sync="uPlusIsShow"
      width="800px"
      class="uPluseDialog"
      :close-on-click-modal="$tool.closeOnClickModal"
      :close-on-press-escape="$tool.closeOnClickModal"
    >
      <div>
        <ul class="uPlus-class">
          <li class="li" style="width:30%;">
            <em class="cl-999">房源编号：</em>
            {{uPlusHouseDetail&&uPlusHouseDetail.PropertyNo}}
          </li>
          <li class="li" style="width:30%;">
            <em class="cl-999">建筑面积：</em>
            {{uPlusHouseDetail&&uPlusHouseDetail.Square}}㎡
          </li>
          <li class="li" style="width:30%;">
            <em class="cl-999">业主姓名：</em>
            {{uPlusHouseDetail&&uPlusHouseDetail.OwnerInfoList[0].OwnerName}}
          </li>
          <!-- <li class="li" style="width:100%;">
            <em class="cl-999">物业地址：</em>
            {{uPlusHouseDetail&&(uPlusHouseDetail.EstateName.replace(/\s/g,"")+' '+uPlusHouseDetail.BuildingName.replace(/\s/g,"")+uPlusHouseDetail.Unit.replace(/\s/g,"")+uPlusHouseDetail.RoomNo.replace(/\s/g,""))}}
          </li> -->
        </ul>
        <p style="margin-bottom:20px;overflow: hidden;margin-top:20px;margin-left:20px;">选择签约方式：</p>
        <el-select
          v-model="uPlusQianyueType"
          placeholder="签约方式"
          :clearable="true"
          style="width:600px;margin-left:20px;margin-bottom:20px;"
        >
          <el-option
            v-for="item in dictionary['64']"
            :key="item.key"
            :label="item.value=='线上'?item.value+` (剩余份数：${surplusOnLineQuantity})`:item.value=='无纸化'?item.value+` (剩余份数：${surplusPaperlessQuantity})`:item.value"
            :value="item.key"
          ></el-option>
        </el-select>
        <p style="margin-bottom:20px;margin-left:20px;">选择合同类型：</p>
        <el-select v-model="uPlusContType" :disabled="uPlusQianyueType==''" :placeholder="uPlusQianyueType=='' ? '请先选择签约方式' : '合同类型'" :clearable="true" style="width:600px;margin-left:20px;">
          <el-option
            v-for="item in uPlusQianyueType == 2 ? offlineContractList : onlineContractList"
            :key="item.type.value"
            :label="item.type.label"
            :value="item.type.value"
          ></el-option>
        </el-select>
        <p class="dialog-footer">
          <!-- <el-button round @click="uPlusIsShow = false">取 消</el-button> -->
          <el-button round type="primary" @click="skipAddCont()" style="width:150px;">确 定</el-button>
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { MIXINS } from "@/assets/js/mixins";
export default {
  name: "choseCont",
  mixins: [MIXINS],
  data() {
    return {
      uPlusContType: "",
      uPlusQianyueType: "",
      dictionary: {
        //数据字典
        "71": "", //合同类型（筛选条件）
        "64": "" //签约方式  线上线下,无纸化
      },
      // uPlusDictionary71: [],
      onlineContractList: [],
      offlineContractList: [],
      uPlusHouseDetail: null,
      uPlusIsShow:false,
      surplusOnLineQuantity:'',
      surplusPaperlessQuantity:''
    };
  },
  created() {
    this.uPlusIsShow=true;
    this.getDictionary(); //字典
    this.getUplusHouseDetail(this.$route.query.houseId);
    this.getSurplus()
    this.$parent.loadingState = false;
  },
  methods: {
    //获取U+房源详情
    getUplusHouseDetail(id) {
      let param = {
        houseId: id
      };
      this.$ajax
        .get("/api/resource/houses/one", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            console.log("获取房源详情");
            console.log(res);
            this.uPlusHouseDetail = res.data;
            console.log(this.uPlusHouseDetail);
            this.isDealType =
              this.uPlusHouseDetail.PropertyNo &&
              this.uPlusHouseDetail.PropertyNo.search("Z") === 0
                ? 1
                : 2;
            // this.uPlusDictionary71 = this.dictionary["71"];
            this.$ajax
              .get("/api/setting/contractTemplate/list", {
                cityId: this.getUser.user.cityId,
                systemTag: this.getUser.user.deptSystemtag,
              })
              .then((res) => {
                res = res.data;
                if (res.status === 200) {
                  res.data.map((item) => {
                    if (this.isDealType == 1) {
                      //房源编号为租赁
                      if (item.onLine === 0 && item.enableTemplateId != 0 && ![2,3,6].includes(item.type.value)) {
                        this.onlineContractList.push(item);// 线上/打印空白模板 判断 onLine === 0 
                      }
                      if (item.unLine === 0 && ![2,3,6].includes(item.type.value)) {
                        this.offlineContractList.push(item) // 线下 判断 unLine === 0
                      }
                    } else if (this.isDealType == 2) {
                      //房源编号为买卖
                      if (item.onLine === 0 && item.enableTemplateId != 0 && ![1,6].includes(item.type.value)) {
                        this.onlineContractList.push(item);// 线上/打印空白模板 判断 onLine === 0 
                      }
                      if (item.unLine === 0 && ![1,6].includes(item.type.value)) {
                        this.offlineContractList.push(item) // 线下 判断 unLine === 0
                      }
                    }


                    // if (item.onLine === 0 && item.enableTemplateId != 0 && item.type.value != 6) {
                    //   this.onlineContractList.push(item);// 线上/打印空白模板 判断 onLine === 0 
                    // }
                    // if (item.unLine === 0 && item.type.value != 6) {
                    //   this.offlineContractList.push(item) // 线下 判断 unLine === 0
                    // }
                  });
                }
              })
              .catch((error) => {
                console.log(error);
              });
            // if (this.isDealType == 1) {
            //   //房源编号为租赁
            //   this.dictionary["71"].map((item, index) => {
            //     if (item.key == 2 || item.key == 3) {
            //       return;
            //     } else {
            //       this.uPlusDictionary71.push(item);
            //     }
            //   });
            // } else if (this.isDealType == 2) {
            //   //房源编号为买卖
            //   this.dictionary["71"] &&
            //     this.dictionary["71"].map((item, index) => {
            //       if (item.key == 1) {
            //         return;
            //       } else {
            //         this.uPlusDictionary71.push(item);
            //       }
            //     });
            // }
            console.log("========");
            // console.log(this.uPlusDictionary71);
          }
        })
        .catch(error => {
          this.$message({
            message: error
          });
        });
    },
    //查看剩余
    getSurplus() {
      this.$ajax.get('/api/contract/copies/getSurplus').then(res =>{
        res = res.data
        if(res.status == 200) {
          let {surplusOnLineQuantity,surplusPaperlessQuantity} = res.data
          this.surplusOnLineQuantity =surplusOnLineQuantity
          this.surplusPaperlessQuantity = surplusPaperlessQuantity
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 跳转新增合同
    skipAddCont() {
      if(this.surplusOnLineQuantity <= 0) {
        this.$message.warning('当前权限未开放')
        return
      }
      if(this.surplusPaperlessQuantity <= 0) {
        this.$message.warning('当前权限未开放')
        return
      }
      if (this.uPlusContType == "") {
        this.$message({
          message: "请选择合同类型",
          type: "warning"
        });
        return;
      }
      if (this.uPlusQianyueType == "") {
        this.$message({
          message: "请选择签约方式",
          type: "warning"
        });
        return;
      }


      let param = {
          recordType: this.uPlusQianyueType,
          type: this.uPlusContType,
        };
      this.$ajax
        .get("/api/contract/checkContTemplate", param)
        .then((res) => {
          res = res.data;
          if (res.status === 200) {
            if ([1,2,3].includes(this.uPlusContType)) {
              this.$router.push({
                path: "/addContract",
                query: {
                  type: this.uPlusContType,
                  operateType: 1,
                  recordType: this.uPlusQianyueType,
                  houseId: this.$route.query.houseId,
                  turnDeal: 1
                }
              });
            } else if ([4,5].includes(this.uPlusContType)) {
              this.$router.push({
                path: "/newIntention",
                query: {
                  contType: this.uPlusContType,
                  operateType: 1,
                  recordType: this.uPlusQianyueType,
                  houseId: this.$route.query.houseId,
                  turnDeal: 1
                }
              });
            }
          } else {
            this.$message({
              message: "该类型合同模板未上传,请上传后再创建",
              type: "warning",
            });
          }
        })
        .catch((error) => {
          this.$message({
            message: error,
            type: "error",
          });
        });




      // if (
      //   this.uPlusContType === 1 ||
      //   this.uPlusContType === 2 ||
      //   this.uPlusContType === 3
      // ) {
      //   this.$router.push({
      //     path: "/addContract",
      //     query: {
      //       type: this.uPlusContType,
      //       operateType: 1,
      //       recordType: this.uPlusQianyueType,
      //       houseId: this.$route.query.houseId,
      //       turnDeal: 1
      //     }
      //   });
      // } else if (this.uPlusContType === 4 || this.uPlusContType === 5) {
      //   this.$router.push({
      //     path: "/newIntention",
      //     query: {
      //       contType: this.uPlusContType,
      //       operateType: 1,
      //       recordType: this.uPlusQianyueType,
      //       houseId: this.$route.query.houseId,
      //       turnDeal: 1
      //     }
      //   });
      // }
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/common.less";
.uPluseDialog {
  padding: 50px;
  // padding-bottom: 200px;
  .uPlus-class {
    width: 800px;
    padding: 20px;

    overflow: hidden;
    li {
      // width: 300px !important;
      height: 50px;
      float: left;
      // margin: 20px 0 0 100px;

      // &:first-of-type{
      //   margin-left: 0;
      // }
    }
  }
  .dialog-footer {
    text-align: right;
    padding: 50px 20px 50px 0;
  }
}
</style>
