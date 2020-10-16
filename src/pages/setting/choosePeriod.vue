<template>
    <div class="choose_period">
        <div class="period-list">
            <div class="listTitle">
                <span class="title">结算周期</span>
            </div>
            <div class="operate listTitle">
                <el-select v-model="year" placeholder="请选择年份" @change="changeYear">
                    <el-option
                    v-for="item in yearOptions"
                    :key="item.value"
                    :label="item.lable"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-button class="btn-info" icon="el-icon-plus" round type="primary" size="small" @click="save('add')">保存</el-button>
            </div>
            <div class="content">
                <ul>
                    <li v-for="(item,index) of pickerData" :key="index">
                        <p class="title">{{Number(index)}}月</p>
                        <div class="picker-box">
                            <el-date-picker
                            :key="index"
                            popper-class="popper_class"
                            :editable="false"
                            :clearable="false"
                            v-model="pickerData[index].scope"
                            type="daterange"
                            :ref='`picker${index}`'
                            start-placeholder="年/月/日"
                            end-placeholder="年/月/日"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            :default-value='`${defaultYear}-0${index == 12? 11 : index}-01`'
                            :picker-options="pickerData[index].options"
                            ></el-date-picker>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { MIXINS } from "@/assets/js/mixins";
import { TOOL } from "@/assets/js/common";
export default {
    name: 'choosePeriod',
    mixins: [MIXINS],
    data () {
        let vm = this
        return {
            cityId: '',
            yearOptions: [],
            year: new Date().getFullYear(),
            pickerData: {
                1:{
                    scope: [],
                    options: {
                        disabledDate(time) {
                            if (vm.pickerData[2].scope.length === 2) {
                                return time.getTime() < new Date(`${vm.year}-01-01`)-8.64e7 || time.getTime() > new Date(vm.pickerData[2].scope[0]).getTime()-8.64e7;
                            } else {
                                return time.getTime() < new Date(`${vm.year}-01-01`)-8.64e7 || time.getTime() > new Date(`${vm.year}-03-01`).getTime()-8.64e7
                            }
                        },
                    }
                },
                2:{
                    scope: [],
                    options: {
                        disabledDate(time) {
                            // if (vm.pickerData[1].scope.length === 2) {
                            //     return time.getTime() < new Date(vm.pickerData[1].scope[1]);
                            // }
                            if (vm.pickerData[1].scope.length === 2 && vm.pickerData[3].scope.length === 2) {
                                return time.getTime() <= new Date(vm.pickerData[1].scope[1]).getTime() || time.getTime() > new Date(vm.pickerData[3].scope[0]).getTime()-8.64e7;
                            }
                            if (vm.pickerData[1].scope.length === 2) {
                                return time.getTime() > new Date(`${vm.year}-04-01`).getTime()-8.64e7 || time.getTime() <= new Date(vm.pickerData[1].scope[1]).getTime();
                            }
                            if (vm.pickerData[3].scope.length === 2) {
                                return time.getTime() < new Date(`${vm.year}-02-01`).getTime()-8.64e7 || time.getTime() > new Date(vm.pickerData[3].scope[0]).getTime()-8.64e7;
                            }
                            return time.getTime() < new Date(`${vm.year}-02-01`).getTime()-8.64e7 || time.getTime() > new Date(`${vm.year}-04-01`).getTime()-8.64e7
                        },
                    }
                },
                3:{
                    scope: [],
                    options: {
                        disabledDate(time) {
                            // if (vm.pickerData[2].scope.length === 2) {
                            //     return time.getTime() < new Date(vm.pickerData[2].scope[1]);
                            // }
                            if (vm.pickerData[2].scope.length === 2 && vm.pickerData[4].scope.length === 2) {
                                return time.getTime() <= new Date(vm.pickerData[2].scope[1]).getTime() || time.getTime() > new Date(vm.pickerData[4].scope[0]).getTime()-8.64e7;
                            }
                            if (vm.pickerData[2].scope.length === 2) {
                                return time.getTime() > new Date(`${vm.year}-05-01`).getTime()-8.64e7 || time.getTime() <= new Date(vm.pickerData[2].scope[1]).getTime();
                            }
                            if (vm.pickerData[4].scope.length === 2) {
                                return time.getTime() < new Date(`${vm.year}-03-01`).getTime()-8.64e7 || time.getTime() > new Date(vm.pickerData[4].scope[0]).getTime()-8.64e7;
                            }
                            return time.getTime() < new Date(`${vm.year}-03-01`).getTime()-8.64e7 || time.getTime() > new Date(`${vm.year}-05-01`).getTime()-8.64e7
                        },
                    }
                },
                4:{
                    scope: [],
                    options: {
                        disabledDate(time) {
                            // if (vm.pickerData[3].scope.length === 2) {
                            //     return time.getTime() < new Date(vm.pickerData[3].scope[1]);
                            // }
                            if (vm.pickerData[3].scope.length === 2 && vm.pickerData[5].scope.length === 2) {
                                return time.getTime() <= new Date(vm.pickerData[3].scope[1]).getTime() || time.getTime() > new Date(vm.pickerData[5].scope[0]).getTime()-8.64e7;
                            }
                            if (vm.pickerData[3].scope.length === 2) {
                                return time.getTime() > new Date(`${vm.year}-06-01`).getTime()-8.64e7 || time.getTime() <= new Date(vm.pickerData[3].scope[1]).getTime();
                            }
                            if (vm.pickerData[5].scope.length === 2) {
                                return time.getTime() < new Date(`${vm.year}-04-01`).getTime()-8.64e7 || time.getTime() > new Date(vm.pickerData[5].scope[0]).getTime()-8.64e7;
                            }
                            return time.getTime() < new Date(`${vm.year}-04-01`).getTime()-8.64e7 || time.getTime() > new Date(`${vm.year}-06-01`).getTime()-8.64e7
                        },
                    }
                },
                5:{
                    scope: [],
                    options: {
                        disabledDate(time) {
                            // if (vm.pickerData[4].scope.length === 2) {
                            //     return time.getTime() < new Date(vm.pickerData[4].scope[1]);
                            // }
                            if (vm.pickerData[4].scope.length === 2 && vm.pickerData[6].scope.length === 2) {
                                return time.getTime() <= new Date(vm.pickerData[4].scope[1]).getTime() || time.getTime() > new Date(vm.pickerData[6].scope[0]).getTime()-8.64e7;
                            }
                            if (vm.pickerData[4].scope.length === 2) {
                                return time.getTime() > new Date(`${vm.year}-07-01`).getTime()-8.64e7 || time.getTime() <= new Date(vm.pickerData[4].scope[1]).getTime();
                            }
                            if (vm.pickerData[6].scope.length === 2) {
                                return time.getTime() < new Date(`${vm.year}-05-01`).getTime()-8.64e7 || time.getTime() > new Date(vm.pickerData[6].scope[0]).getTime()-8.64e7;
                            }
                            return time.getTime() < new Date(`${vm.year}-05-01`).getTime()-8.64e7 || time.getTime() > new Date(`${vm.year}-07-01`).getTime()-8.64e7
                        },
                    }
                },
                6:{
                    scope: [],
                    options: {
                        disabledDate(time) {
                            // if (vm.pickerData[5].scope.length === 2) {
                            //     return time.getTime() < new Date(vm.pickerData[5].scope[1]);
                            // }
                            if (vm.pickerData[5].scope.length === 2 && vm.pickerData[7].scope.length === 2) {
                                return time.getTime() <= new Date(vm.pickerData[5].scope[1]).getTime() || time.getTime() > new Date(vm.pickerData[7].scope[0]).getTime()-8.64e7;
                            }
                            if (vm.pickerData[5].scope.length === 2) {
                                return time.getTime() > new Date(`${vm.year}-08-01`).getTime()-8.64e7 || time.getTime() <= new Date(vm.pickerData[5].scope[1]).getTime();
                            }
                            if (vm.pickerData[7].scope.length === 2) {
                                return time.getTime() < new Date(`${vm.year}-06-01`).getTime()-8.64e7 || time.getTime() > new Date(vm.pickerData[7].scope[0]).getTime()-8.64e7;
                            }
                            return time.getTime() < new Date(`${vm.year}-06-01`).getTime()-8.64e7 || time.getTime() > new Date(`${vm.year}-08-01`).getTime()-8.64e7
                        },
                    }
                },
                7:{
                    scope: [],
                    options: {
                        disabledDate(time) {
                            // if (vm.pickerData[6].scope.length === 2) {
                            //     return time.getTime() < new Date(vm.pickerData[6].scope[1]);
                            // }
                            if (vm.pickerData[6].scope.length === 2 && vm.pickerData[8].scope.length === 2) {
                                return time.getTime() <= new Date(vm.pickerData[6].scope[1]).getTime() || time.getTime() > new Date(vm.pickerData[8].scope[0]).getTime()-8.64e7;
                            }
                            if (vm.pickerData[6].scope.length === 2) {
                                return time.getTime() > new Date(`${vm.year}-09-01`).getTime()-8.64e7 || time.getTime() <= new Date(vm.pickerData[6].scope[1]).getTime();
                            }
                            if (vm.pickerData[8].scope.length === 2) {
                                return time.getTime() < new Date(`${vm.year}-07-01`).getTime()-8.64e7 || time.getTime() > new Date(vm.pickerData[8].scope[0]).getTime()-8.64e7;
                            }
                            return time.getTime() < new Date(`${vm.year}-07-01`).getTime()-8.64e7 || time.getTime() > new Date(`${vm.year}-09-01`).getTime()-8.64e7
                        },
                    }
                },
                8:{
                    scope: [],
                    options: {
                        disabledDate(time) {
                            // if (vm.pickerData[7].scope.length === 2) {
                            //     return time.getTime() < new Date(vm.pickerData[7].scope[1]);
                            // }
                            if (vm.pickerData[7].scope.length === 2 && vm.pickerData[9].scope.length === 2) {
                                return time.getTime() <= new Date(vm.pickerData[7].scope[1]).getTime() || time.getTime() > new Date(vm.pickerData[9].scope[0]).getTime()-8.64e7;
                            }
                            if (vm.pickerData[7].scope.length === 2) {
                                return time.getTime() > new Date(`${vm.year}-10-01`).getTime()-8.64e7 || time.getTime() <= new Date(vm.pickerData[7].scope[1]).getTime();
                            }
                            if (vm.pickerData[9].scope.length === 2) {
                                return time.getTime() < new Date(`${vm.year}-08-01`).getTime()-8.64e7 || time.getTime() > new Date(vm.pickerData[9].scope[0]).getTime()-8.64e7;
                            }
                            return time.getTime() < new Date(`${vm.year}-08-01`).getTime()-8.64e7 || time.getTime() > new Date(`${vm.year}-10-01`).getTime()-8.64e7
                        },
                    }
                },
                9:{
                    scope: [],
                    options: {
                        disabledDate(time) {
                            // if (vm.pickerData[8].scope.length === 2) {
                            //     return time.getTime() < new Date(vm.pickerData[8].scope[1]);
                            // }
                            if (vm.pickerData[8].scope.length === 2 && vm.pickerData[10].scope.length === 2) {
                                return time.getTime() <= new Date(vm.pickerData[8].scope[1]).getTime() || time.getTime() > new Date(vm.pickerData[10].scope[0]).getTime()-8.64e7;
                            }
                            if (vm.pickerData[8].scope.length === 2) {
                                return time.getTime() > new Date(`${vm.year}-11-01`).getTime()-8.64e7 || time.getTime() <= new Date(vm.pickerData[8].scope[1]).getTime();
                            }
                            if (vm.pickerData[10].scope.length === 2) {
                                return time.getTime() < new Date(`${vm.year}-09-01`).getTime()-8.64e7 || time.getTime() > new Date(vm.pickerData[10].scope[0]).getTime()-8.64e7;
                            }
                            return time.getTime() < new Date(`${vm.year}-09-01`).getTime()-8.64e7 || time.getTime() > new Date(`${vm.year}-11-01`).getTime()-8.64e7
                        },
                    }
                },
                10:{
                    scope: [],
                    options: {
                        disabledDate(time) {
                            // if (vm.pickerData[9].scope.length === 2) {
                            //     return time.getTime() < new Date(vm.pickerData[9].scope[1]);
                            // }
                            // if (vm.pickerData[9].scope.length === 2 && vm.pickerData[12].scope.length === 2) {
                            //     return time.getTime() < new Date(`${vm.year}-10-01`).getTime()-8.64e7 || time.getTime() > new Date(`${vm.year}-12-01`).getTime()-8.64e7 || time.getTime() < new Date(vm.pickerData[9].scope[1]).getTime() || time.getTime() < new Date(vm.pickerData[12].scope[0]).getTime()-8.64e7*2;
                            // }
                            if (vm.pickerData[9].scope.length === 2 && vm.pickerData[11].scope.length === 2) {
                                return time.getTime() <= new Date(vm.pickerData[9].scope[1]).getTime() || time.getTime() > new Date(vm.pickerData[11].scope[0]).getTime()-8.64e7;
                            }
                            if (vm.pickerData[9].scope.length === 2) {
                                return time.getTime() > new Date(`${vm.year}-12-01`).getTime()-8.64e7 || time.getTime() <= new Date(vm.pickerData[9].scope[1]).getTime();
                            }
                            if (vm.pickerData[11].scope.length === 2) {
                                return time.getTime() < new Date(`${vm.year}-10-01`).getTime()-8.64e7 || time.getTime() > new Date(vm.pickerData[11].scope[0]).getTime()-8.64e7;
                            }
                            // if (vm.pickerData[12].scope.length === 2) {
                            //     return time.getTime() < new Date(`${vm.year}-10-01`).getTime()-8.64e7 || time.getTime() > new Date(`${vm.year}-12-01`).getTime()-8.64e7 || time.getTime() > new Date(vm.pickerData[12].scope[0]).getTime()-8.64e7*2;
                            // }
                            return time.getTime() < new Date(`${vm.year}-10-01`).getTime()-8.64e7 || time.getTime() > new Date(`${vm.year}-12-01`).getTime()-8.64e7
                        },
                    }
                },
                11:{
                    scope: [],
                    options: {
                        disabledDate(time) {
                            // if (vm.pickerData[10].scope.length === 2) {
                            //     return time.getTime() > new Date(`${vm.year}-12-31`) || time.getTime() < new Date(vm.pickerData[10].scope[1]);
                            // } else {
                            //     return time.getTime() > new Date(`${vm.year}-12-31`)
                            // }
                            if (vm.pickerData[10].scope.length === 2 && vm.pickerData[12].scope.length === 2) {
                                return time.getTime() <= new Date(vm.pickerData[10].scope[1]).getTime() || time.getTime() > new Date(vm.pickerData[12].scope[0]).getTime()-8.64e7;
                            }
                            if (vm.pickerData[10].scope.length === 2) {
                                return time.getTime() > new Date(`${vm.year+1}-01-01`).getTime() || time.getTime() <= new Date(vm.pickerData[10].scope[1]).getTime();
                            }
                            if (vm.pickerData[12].scope.length === 2) {
                                return time.getTime() < new Date(`${vm.year}-11-01`).getTime()-8.64e7 || time.getTime() > new Date(vm.pickerData[12].scope[0]).getTime()-8.64e7;
                            }
                            return time.getTime() < new Date(`${vm.year}-11-01`).getTime()-8.64e7 || time.getTime() > new Date(`${vm.year+1}-01-01`).getTime()-8.64e7
                        },
                    }
                },
                12:{
                    scope: [],
                    options: {
                        disabledDate(time) {
                            // if (vm.pickerData[11].scope.length === 2) {
                            //     return time.getTime() > new Date(`${vm.year}-12-31`) || time.getTime() < new Date(vm.pickerData[11].scope[1]);
                            // } else {
                            //     return time.getTime() > new Date(`${vm.year}-12-31`)
                            // }
                            if (vm.pickerData[11].scope.length === 2) {
                                return time.getTime() > new Date(`${vm.year+1}-01-01`).getTime()-8.64e7 || time.getTime() <= new Date(vm.pickerData[11].scope[1]).getTime();
                            } else {
                                return time.getTime() < new Date(`${vm.year}-11-01`).getTime()-8.64e7 || time.getTime() > new Date(`${vm.year+1}-01-01`).getTime()-8.64e7
                            }
                        },
                    }
                },
            }
        }
    },
    mounted() {
      let currentYear = new Date().getFullYear()
      for (let i = 0; i < 7; i++) {
          if (i< 3) {
              this.yearOptions.unshift({lable:`${currentYear-i-1}年`,value:currentYear-i-1})
          } else {
              this.yearOptions.push({lable:`${currentYear+i-3}年`,value:currentYear+i-3})
          }
      }
      this.get()
    },
    created() {
        this.getDictionary()
    },
    computed: {
        defaultYear() {
            return this.year
        }
    },
    methods: {
        changeYear() {

            this.get()
            // this.$forceUpdate()
        },
        get() {
            let settleYear = this.year
            let reg=/\//g
            this.$ajax.get('/api/settlement/getSettleCycle',{settleYear}).then(res => {
                if (res.status === 200) {
                    if (res.data.data) {
                        console.log(res.data,8);
                        res.data.data.settleCycle.forEach((item,i) => {
                            console.log(new Date(item.starDate).toLocaleDateString().replace(reg,'-'),new Date(item.endDate).toLocaleDateString().replace(reg,'-'));
                            this.pickerData[i+1].scope= [new Date(item.starDate).toLocaleDateString().replace(reg,'-'),new Date(item.endDate).toLocaleDateString().replace(reg,'-')]
                        });
                        // this.$message({
                        //     type: "success",
                        //     message: '获取成功'
                        // })
                    }else {
                        for (const key in this.pickerData) {
                            if (this.pickerData.hasOwnProperty(key)) {
                                const element = this.pickerData[key];
                                console.log(`${settleYear}-${key}-1`,new Date(new Date(`${settleYear}-${Number(key)+1}-1`).getTime()-8.64e7).toLocaleDateString().replace(reg,'-'));
                                if (key == 12) {
                                    element.scope=[`${settleYear}-${key}-1`,new Date(new Date(`${settleYear+1}-1-1`).getTime()-8.64e7).toLocaleDateString().replace(reg,'-')]
                                } else {
                                    element.scope=[`${settleYear}-${key}-1`,new Date(new Date(`${settleYear}-${Number(key)+1}-1`).getTime()-8.64e7).toLocaleDateString().replace(reg,'-')]
                                }

                            }
                        }
                    }

                }
            }).catch(error => {
                this.$message({message:error})
            })
        },
        save() {
            let settleCycle = {
                settleYear: this.year,
                settleCycle: []
            }
            for (const key in this.pickerData) {
                if (this.pickerData.hasOwnProperty(key)) {
                    const element = this.pickerData[key];
                    if (!element.scope || element.scope.length <= 0) {
                        return this.$message({
                            type: "warning",
                            message: '请填写完整'
                        })
                    }
                }
            }
            settleCycle.settleCycle = Object.keys(this.pickerData).map(item => {
                return {
                    starDate: this.pickerData[item].scope[0],
                    endDate: this.pickerData[item].scope[1]
                }
            })
            this.$ajax.postJSON('/api/settlement/addSettleCycle',settleCycle).then(res => {
                if (res.status === 200) {
                    this.$message({
                        type: "success",
                        message: '保存成功'
                    })
                }
            }).catch(error => {
                this.$message({message:error})
            })
        }
    }
}
</script>

<style lang="less">
    // .popper_class {
    //     .el-picker-panel__icon-btn {
    //         display: none !important;
    //     }
    // }
</style>
<style scoped lang="less">
@import "~@/assets/common.less";
.choose_period {
    .period-list {
        .listTitle {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            .title {
                font-size: 16px;
                font-weight: bold;
            }
        }
        .operate {
            padding: 16px;
        }
        .content {
            margin: 0 16px;
            text-align: center;
            ul {
                display: flex;
                flex-wrap: wrap;
                li {
                    flex: 0 0 25%;
                    .title {
                        height: 38px;
                        line-height: 38px;
                        background-color: rgba(87,149,247,0.1);
                    }
                    .picker-box {
                        padding: 15px 9px;
                        .el-date-editor {
                            width: 100%;
                        }
                    }
                }
            }
        }
    }
}
</style>