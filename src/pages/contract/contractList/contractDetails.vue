<template>
  <div class="view-container">
    <el-tabs v-model="activeName" @tab-click="handleClick" >
      <el-tab-pane label="合同详情" name="first">
        <div class="msg">
          <div class="title">合同信息</div>
          <div class="content">
            <div class="one_">
              <p><span class="tag">签约日期：</span><span class="text">{{contractDetail.signDate}}</span></p>
              <p>
                <span class="tag">合同类型：</span>
                <span class="text" v-if="contractDetail.contType.value===1">租赁</span>
                <span class="text" v-if="contractDetail.contType.value===2">买卖</span>
                <span class="text" v-if="contractDetail.contType.value===3">代办</span>
                <span class="text" v-if="contractDetail.contType.value===4">意向</span>
                <span class="text" v-if="contractDetail.contType.value===5">定金</span>
              </p>
              <p style="width:500px">
                <span class="tag">成交总价：</span>
                <span class="dealPrice">{{contractDetail.dealPrice}} 元
                  <i v-for="item in dictionary['507']" :key="item.key" v-if="item.key===contractDetail.timeUnit&&contractDetail.contType.value===1"> / {{item.value}}</i>
                  <i>{{contractDetail.dealPrice|moneyFormat}}</i>
                </span>
              </p>
            </div>
            <div class="one_">
              <p v-if="contType!='1'"><span class="tag">客户保证金：</span><span class="text">{{contractDetail.custEnsure}} 元</span></p>
              <p><span class="tag">客户佣金：</span><span class="text">{{contractDetail.custCommission}} 元</span></p>
              <p><span class="tag">业主佣金：</span><span class="text">{{contractDetail.ownerCommission}} 元</span></p>
              <p><span class="tag">佣金支付费：</span><span class="text">{{contractDetail.commissionPayment}} 元</span></p>
            </div>
            <div class="one_" v-if="contType!='1'">
              <p v-if="contType!='1'">
                <span class="tag">佣金合计：</span>
                <span class="text">{{contractDetail.custCommission+contractDetail.ownerCommission}} 元</span>
              </p>
              <p class="address">
                <span class="tag">交易流程：</span>
                <span class="text" v-for="item in transFlowList" :key="item.id" v-if="item.id===contractDetail.transFlowCode">{{item.name}}</span>
              </p>
              <!-- <p><span class="tag">按揭手续费：</span><span class="text">另外出-客户-300 元</span></p>
              <p><span class="tag">按揭员：</span><span class="text">夏雨天</span></p> -->
            </div>
          </div>
        </div>
        <div class="msg">
          <div class="title">房源信息</div>
          <div class="content">
            <div class="one_">
              <p><span class="tag">房源编号：</span><span class="serialNumber">{{contractDetail.houseinfoCode}}</span></p>
              <p class="address">
                <span class="tag">物业地址：</span>
                <span class="text">{{contractDetail.propertyAddr}}</span>
                <!-- <span class="text">{{contractDetail.houseInfo.EstateName}}</span>
                <span class="text">{{contractDetail.houseInfo.BuildingName}}</span>
                <span class="text">{{contractDetail.houseInfo.Unit}}</span>
                <span class="text">{{contractDetail.houseInfo.RoomNo}}</span> -->
              </p>
            </div>
            <div class="one_">
              <p><span class="tag">建筑面积：</span><span class="text">{{contractDetail.houseInfo.Square}} m²</span></p>
              <p><span class="tag">套内面积：</span><span class="text">{{contractDetail.houseInfo.SquareUse}} m²</span></p>
              <p><span class="tag">用 途：</span><span class="text">{{contractDetail.houseInfo.HousePurpose?contractDetail.houseInfo.HousePurpose:'--'}}</span></p>
            </div>
            <div class="one_">
              <p><span class="tag">房 型：</span><span class="text">{{contractDetail.houseInfo.HouseType?contractDetail.houseInfo.HouseType:'--'}}</span></p>
              <p><span class="tag">朝 向：</span><span class="text">{{contractDetail.houseInfo.Orientation?contractDetail.houseInfo.Orientation:'--'}}</span></p>
              <p><span class="tag">装 修：</span><span class="text">{{contractDetail.houseInfo.DecorateType?contractDetail.houseInfo.DecorateType:'--'}}</span></p>
            </div>
            <div class="one_" v-if="contType!='1'">
              <p>
                <span class="tag">产权状态：</span>
                <span class="text" v-for="item in dictionary['514']" :key="item.key" v-if="item.key===contractDetail.houseInfo.propertyRightStatus">{{item.value}}</span>
                <span class="text" v-if="contractDetail.houseInfo.propertyRightStatus===0">无</span>
              </p>
              <p><span class="tag">按揭银行：</span><span class="text">{{contractDetail.houseInfo.stagesBankName?contractDetail.houseInfo.stagesBankName:'--'}}</span></p>
              <p><span class="tag">房产证号：</span><span class="text">{{contractDetail.propertyCard?contractDetail.propertyCard:'--'}}</span></p>
              <p style="width:500px">
                <span class="tag">按揭欠款：</span>
                <span class="text dealPrice">{{contractDetail.houseInfo.stagesArrears}} 元 <i>{{contractDetail.houseInfo.stagesArrears|moneyFormat}}</i></span>
              </p>
            </div>
            <div class="one_">
              <p><span class="tag">房源方门店：</span><span class="text">{{contractDetail.houseInfo.HouseStoreName}}</span></p>
              <p><span class="tag">店 长：</span><span class="text">{{contractDetail.houseInfo.ShopOwnerName}}</span></p>
              <p><span class="tag">手 机：</span><span class="text">{{contractDetail.houseInfo.ShopOwnerMobile}}</span></p>
            </div>
            <div class="table">
              <template>
                <el-table :data="ownerData" border header-row-class-name="theader-bg">
                  <el-table-column prop="name" label="业主姓名"></el-table-column>
                  <el-table-column label="电话">
                    <template slot-scope="scope">
                      {{scope.row.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}} 
                      <i class="iconfont icon-tubiao_shiyong-16" @click="call(scope.row)" v-if="power['sign-ht-xq-ly-call'].state"></i>
                    </template>
                  </el-table-column>
                  <el-table-column prop="relation" label="关系"></el-table-column>
                  <el-table-column label="产权比" v-if="contType!='1'">
                    <template slot-scope="scope">
                      {{scope.row.propertyRightRatio+'%'}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="identifyCode" min-width="150" label="身份证号"></el-table-column>
                </el-table>
              </template>
            </div>
          </div>
        </div>
        <div class="msg">
          <div class="title">客源信息</div>
          <div class="content">
            <div class="one_">
              <p><span class="tag">客源编号：</span><span class="serialNumber">{{contractDetail.guestinfoCode}}</span></p>
              <p>
                <span class="tag">付款方式：</span>
                <span class="text" v-for="item in dictionary['556']" :key="item.key" v-if="contractDetail.guestInfo.paymentMethod===item.key">{{item.value}}</span>
              </p>
            </div>
            <div class="one_">
              <p><span class="tag">客源方门店：</span><span class="text">{{contractDetail.guestInfo.GuestStoreName}}</span></p>
              <p><span class="tag">店 长：</span><span class="text">{{contractDetail.guestInfo.ShopOwnerName}}</span></p>
              <p><span class="tag">手 机：</span><span class="text">{{contractDetail.guestInfo.ShopOwnerMobile}}</span></p>
            </div>
            <div class="table">
              <template>
                <el-table :data="clientrData" border header-row-class-name="theader-bg">
                  <el-table-column prop="name" label="客户姓名"></el-table-column>
                  <el-table-column label="电话">
                    <template slot-scope="scope">
                      {{scope.row.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}} 
                      <i class="iconfont icon-tubiao_shiyong-16" @click="call(scope.row)" v-if="power['sign-ht-xq-ly-call'].state"></i>
                    </template>
                  </el-table-column>
                  <el-table-column prop="relation" label="关系"></el-table-column>
                  <el-table-column label="产权比" v-if="contType!='1'">
                    <template slot-scope="scope">
                      {{scope.row.propertyRightRatio+'%'}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="identifyCode" min-width="150" label="身份证号"></el-table-column>
                </el-table>
              </template>
            </div>
          </div>
        </div>

        <div class="msg" v-if="contractDetail.isHaveCooperation">
          <div class="title">三方合作</div>
          <div class="content">
            <div class="one_">
              <p>
                <span class="tag">扣合作费：</span>
                <span class="text">{{contractDetail.otherCooperationCost}}元</span>
              </p>
              <p>
                <span class="tag">类型：</span>
                <span class="text" v-for="item in dictionary['517']" :key="item.key" v-if='item.key===contractDetail.otherCooperationInfo.type'>{{item.value}}</span>
                <span class="text" v-else>--</span>
              </p>
            </div>
            <div class="one_">
              <p>
                <span class="tag">合作方姓名：</span>
                <span class="text">{{contractDetail.otherCooperationInfo.name?contractDetail.otherCooperationInfo.name:'--'}}</span>
              </p>
              <p>
                <span class="tag">联系方式：</span>
                <span class="text">{{contractDetail.otherCooperationInfo.mobile?contractDetail.otherCooperationInfo.mobile:'--'}}</span>
              </p>
              <p>
                <span class="tag">身份证号：</span>
                <span class="text">{{contractDetail.otherCooperationInfo.identifyCode?contractDetail.otherCooperationInfo.identifyCode:'--'}}</span>
              </p>
            </div>
            <div class="remark">
              <span>备注：</span>
              <p v-if="contractDetail.otherCooperationInfo.remarks">{{contractDetail.otherCooperationInfo.remarks}}</p>
              <p v-else>暂无备注</p>
            </div>
          </div>
        </div>

        <div class="msg" v-if="contractDetail.extendParams">
          <div class="title">扩展参数</div>
          <div class="content">
            <div class="one_ extendParams">
              <p v-for="(item,index) in parameterList" :key="index" v-if="contractDetail.extendParams[item.name]">
                <span class="tag">{{item.name}}：</span><span class="text">{{contractDetail.extendParams[item.name]}} {{item.unit}}</span>
              </p>
            </div>
          </div>
        </div>

        <div class="msg">
          <div class="title">业绩分成</div>
          <div class="content">
            <div class="one_ performance">
              <p>(可分配业绩：<span class="orange">{{contractDetail.distributableAchievement}}</span>元)</p>
            </div>
            <div class="table">
              <p>房源方分成</p>
              <el-table :data="employeeData.houseAgents" border header-row-class-name="theader-bg">
                <el-table-column prop="roleName" label="角色类型">
                </el-table-column>
                <el-table-column prop="ratio" label="分成比例(%)"></el-table-column>
                <el-table-column prop="assignor" label="经纪人" min-width="100"></el-table-column>
                <el-table-column prop="isJob.label" label="在职状态"></el-table-column>
                <el-table-column prop="level3" label="门店"></el-table-column>
                <el-table-column prop="shopkeeper" label="店长"></el-table-column>
                <el-table-column prop="level4" label="单组"></el-table-column>
                <el-table-column prop="amaldar" label="区经"></el-table-column>
                <el-table-column prop="manager" label="区总"></el-table-column>
              </el-table>
            </div>
            <div class="table">
              <p>客源方分成</p>
              <el-table :data="employeeData.customerAgents" border header-row-class-name="theader-bg" >
                <el-table-column prop="roleName" label="角色类型">
                </el-table-column>
                <el-table-column prop="ratio" label="分成比例(%)"></el-table-column>
                <el-table-column prop="assignor" label="经纪人"></el-table-column>
                <el-table-column prop="isJob.label" label="在职状态"></el-table-column>
                <el-table-column prop="level3" label="门店"></el-table-column>
                <el-table-column prop="shopkeeper" label="店长"></el-table-column>
                <el-table-column prop="level4" label="单组"></el-table-column>
                <el-table-column prop="amaldar" label="区经"></el-table-column>
                <el-table-column prop="manager" label="区总"></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="footer">
          <div>
            <p><span>录入时间：</span>{{contractDetail.createTime|formatTime}}</p>
            <p><span>录入人：</span>{{contractDetail.recordDeptName}}-{{contractDetail.recordName}}</p>
            <p><span>最后修改：</span>{{contractDetail.updateTime|formatTime}}</p>
          </div>
          <div v-if="contractDetail.contChangeState.value!=2">
            <el-button round class="search_btn" v-if="power['sign-ht-info-view'].state" @click="goPreview">预览</el-button>
            <el-button round type="danger"  class="search_btn" v-if="power['sign-ht-xq-cancel'].state&&contractDetail.contState.value===3" @click="goChangeCancel(2)">解约</el-button>
            <el-button round type="danger"  class="search_btn" v-if="power['sign-ht-xq-void'].state&&contractDetail.contState.value!=3&&contractDetail.contState.value!=0" @click="invalid">撤单</el-button>
            <el-button round type="primary" class="search_btn" v-if="power['sign-ht-xq-modify'].state&&contractDetail.contState.value===3&&contractDetail.contChangeState.value!=1" @click="goChangeCancel(1)">变更</el-button>
            <el-button round type="primary" class="search_btn" v-if="power['sign-ht-info-edit'].state&&(contractDetail.toExamineState.value<0||contractDetail.toExamineState.value===2)" @click="goEdit">编辑</el-button>
            <el-button round type="primary" class="search_btn" v-if="power['sign-ht-view-toverify'].state&&contractDetail.toExamineState.value<0" @click="isSubmitAudit=true">提交审核</el-button>
          </div>
          <div v-else>
            <el-button round class="search_btn" v-if="power['sign-ht-info-view'].state" @click="goPreview">预览</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="合同主体" name="second">
        <div class="contractSubject" v-if="contractDetail.contState.value>1">
          <ul class="ulData">
            <!-- <li v-if="contractDetail.contState.value>1&&contractDetail.contChangeState.value!=2"> -->
            <li v-if="power['sign-ht-xq-main-add'].state&&contractDetail.contState.value>1">
              <file-up class="uploadSubject" @getUrl="uploadSubject" id="zhuti_">
                <i class="iconfont icon-shangchuan"></i>
                <p>点击上传</p>
              </file-up>
            </li>
            <li v-for="(item,index) in uploadList" :key="item.index" @mouseover="moveIn(item.index+item.path)" @mouseout="moveOut(item.index+item.path)">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="bottom">
                <div class="namePath" @click="previewPhoto(uploadList,index)">
                  <upload-cell :type="item.fileType"></upload-cell>
                  <p>{{item.name}}</p>
                </div>
              </el-tooltip>
              <i class="iconfont icon-tubiao-6" @click="ZTdelectData(index)" v-if="isDelete===item.title+item.path"></i>
            </li>
          </ul>
        </div>
      </el-tab-pane>
      <el-tab-pane label="资料库" name="third">
        <!-- <div class="dataBank" v-if="contractDetail.contChangeState.value!=2||contractDetail.isHaveData"> -->
        <div class="dataBank" v-if="power['sign-ht-xq-data-add'].state||contractDetail.isHaveData">
          <div class="classify" v-if="sellerList.length>0">
            <p class="title">卖方</p>
            <div class="one_" v-for="(item,index) in sellerList" :key="index" v-if="power['sign-ht-xq-data-add'].state||item.value.length>0">
              <p><i v-if="item.isrequire">*</i>{{item.title}}</p>
              <ul class="ulData">
                <li v-if="power['sign-ht-xq-data-add'].state">
                  <file-up class="uploadSubject" :id="'seller'+index" @getUrl="addSubject">
                    <i class="iconfont icon-shangchuan"></i>
                    <p>点击上传</p>
                  </file-up>
                </li>
                <li v-for="(item_,index_) in item.value" :key="item_.index" @mouseover="moveIn(item.title+item_.path)" @mouseout="moveOut(item.title+item_.path)">
                  <el-tooltip class="item" effect="dark" :content="item_.name" placement="bottom">
                    <div class="namePath" @click="previewPhoto(item.value,index_)">
                      <upload-cell :type="item_.fileType"></upload-cell>
                      <p>{{item_.name}}</p>
                    </div>
                  </el-tooltip>
                  <i class="iconfont icon-tubiao-6" @click="delectData(index,index_,'seller')" v-if="power['sign-ht-xq-data-add'].state&&isDelete===item.title+item_.path"></i>
                </li>
              </ul>
            </div>
          </div>
          <div class="classify" v-if="buyerList.length>0">
            <p class="title">买方</p>
            <div class="one_" v-for="(item,index) in buyerList" :key="index" v-if="power['sign-ht-xq-data-add'].state||item.value.length>0">
              <p><i v-if="item.isrequire">*</i>{{item.title}}</p>
              <ul class="ulData">
                <li v-if="power['sign-ht-xq-data-add'].state">
                  <file-up class="uploadSubject" :id="'buyer'+index" @getUrl="addSubject">
                    <i class="iconfont icon-shangchuan"></i>
                    <p>点击上传</p>
                  </file-up>
                </li>
                <li v-for="(item_,index_) in item.value" :key="item_.index" @mouseover="moveIn(item.title+item_.path)" @mouseout="moveOut(item.title+item_.path)">
                  <el-tooltip class="item" effect="dark" :content="item_.name" placement="bottom">
                    <div class="namePath" @click="previewPhoto(item.value,index_)">
                      <upload-cell :type="item_.fileType"></upload-cell>
                      <p>{{item_.name}}</p>
                    </div>
                  </el-tooltip>
                  <i class="iconfont icon-tubiao-6" @click="delectData(index,index_,'buyer')" v-if="power['sign-ht-xq-data-add'].state&&isDelete===item.title+item_.path"></i>
                </li>
              </ul>
            </div>
          </div>
          <div class="classify" v-if="otherList.length>0">
            <p class="title">其他</p>
            <div class="one_" v-for="(item,index) in otherList" :key="index" v-if="power['sign-ht-xq-data-add'].state||item.value.length>0">
              <p><i v-if="item.isrequire">*</i>{{item.title}}</p>
              <ul class="ulData">
                <li v-if="power['sign-ht-xq-data-add'].state">
                  <file-up class="uploadSubject" :id="'other'+index" @getUrl="addSubject">
                    <i class="iconfont icon-shangchuan"></i>
                    <p>点击上传</p>
                  </file-up>
                </li>
                <li v-for="(item_,index_) in item.value" :key="item_.index" @mouseover="moveIn(item.title+item_.path)" @mouseout="moveOut(item.title+item_.path)">
                  <el-tooltip class="item" effect="dark" :content="item_.name" placement="bottom">
                    <div class="namePath" @click="previewPhoto(item.value,index_)">
                      <upload-cell :type="item_.fileType"></upload-cell>
                      <p>{{item_.name}}</p>
                    </div>
                  </el-tooltip>
                  <i class="iconfont icon-tubiao-6" @click="delectData(index,index_,'other')" v-if="power['sign-ht-xq-data-add'].state&&isDelete===item.title+item_.path"></i>
                </li>
              </ul>
            </div>
          </div>
          <div class="classifyFoot" v-if="contractDetail.laterStageState.value===4">
            <p class="objection">拒绝理由: {{contractDetail.refuseReasons}}</p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="回访录音" name="fourth">
        <div class="type">
          <span :class="{'active':isActive===1}" @click="changeType(1)">房源</span>
          <span :class="{'active':isActive===2}" @click="changeType(2)">客源</span>
        </div>
        <div class="record">
          <el-table :data="recordData" border style="width: 100%" header-row-class-name="theader-bg">
            <el-table-column label="回访时间">
              <template slot-scope="scope">
                {{scope.row.startTime|formatTime}}
              </template>
            </el-table-column>
            <el-table-column label="回访人">
              <template slot-scope="scope">
                <p>{{scope.row.storeName}}</p>
                <p>{{scope.row.callerName}}</p>
              </template>
            </el-table-column>
            <el-table-column label="回访电话">
              <template slot-scope="scope">
                {{scope.row.calledMobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}}
              </template>
            </el-table-column>
            <el-table-column prop="recording" label="录音" width="200">
              <template slot-scope="scope">
                <div class="recordPlay" v-if="scope.row.recording">
                  <span class="playBtn" @click="playStop(scope.$index)">
                    <i class="iconfont icon-tubiao_shiyong-17" :class="{'icon-tubiao_shiyong-19':(recordKey===scope.$index)&&isPlay}"></i> 
                  </span>
                  <span class="duration">
                    <span>{{scope.row.talkTime|SecondFormat}}</span>
                    <el-progress :percentage="recordKey===scope.$index?playTime:0" :show-text="false"></el-progress>
                    <!-- <span class="totalTime" v-else>
                      <span class="playTime"></span>
                    </span> -->
                  </span>
                </div>
                <span v-else>--</span>
                <!-- <audio :src="scope.row.recording" :id="'audio'+scope.$index"></audio> -->
                <audio :src="scope.row.recording" :id="'audio'+scope.$index"></audio>
                <!-- ../../../../static/录音-001.MP3 -->
              </template>
            </el-table-column>
            <el-table-column label="备注" width="320">
              <template slot-scope="scope">
                <div v-if="scope.row.remarks">
                  <el-popover trigger="hover" placement="top" v-if="power['sign-ht-xq-ly-vmemo'].state">
                    <div style="width:300px">
                      {{scope.row.remarks}}
                    </div>
                    <div slot="reference" class="name-wrapper">
                      {{scope.row.remarks}}
                    </div>
                  </el-popover>
                  <div v-else class="noPower"><i class="iconfont icon-tubiao_shiyong-12"></i> 无权限浏览</div>
                </div>
                <p v-else class="iconfont icon-tubiao_shiyong-14 addRemarks" @click="showRemark(scope.row)"> 添加备注</p>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-if="recordData.length>0" class="pagination-info" @current-change="handleCurrentChange" :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
          <!-- <button @click="downloadRecord">下载</button> -->
          <!-- <audio src="http://192.168.1.6:28081/static/my.MP3" controls></audio> -->
        </div>
      </el-tab-pane>
      <el-tab-pane label="审核记录" name="fifth">
        <div class="record">
          <el-table :data="checkData" border style="width: 100%" header-row-class-name="theader-bg">
            <el-table-column label="时间">
              <template slot-scope="scope">
                {{scope.row.auditTime|formatTime}}
              </template>
            </el-table-column>
            <el-table-column prop="userName" label="姓名">
            </el-table-column>
            <el-table-column prop="roleName" label="职务">
            </el-table-column>
            <el-table-column prop="operate" label="操作">
            </el-table-column>
            <el-table-column label="备注" width="320">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top" v-if="scope.row.auditInfo!='-'">
                  <div style="width:300px">
                    {{scope.row.auditInfo}}
                  </div>
                  <div slot="reference" class="name-wrapper">
                    {{scope.row.auditInfo}}
                  </div>
                </el-popover>
                <span v-else>{{scope.row.auditInfo}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- <div class="functionTable" v-if="contractDetail.contChangeState.value!=2"> -->
    <div class="functionTable">
      <el-button round class="search_btn" v-if="power['sign-ht-xq-print'].state&&name==='first'" @click="printDemo">打印成交报告</el-button>  <!-- @click="printDemo" -->
      <!-- <el-button type="primary" round class="search_btn" @click="dialogSupervise = true">资金监管</el-button> -->
      <el-button type="primary" round class="search_btn" @click="fencheng" v-if="power['sign-ht-xq-yj'].state&&name==='first'&&contractDetail.contState.value===3">分成</el-button>
      <el-button type="primary" round class="search_btn" @click="uploading" v-if="power['sign-ht-xq-data-add'].state&&name==='third'">{{contractDetail.laterStageState.value===4?'提交审核':'上传'}}</el-button>  <!-- 合同资料库上传 -->
      <el-button type="primary" round class="search_btn" @click="saveFile" v-if="power['sign-ht-xq-main-add'].state&&name==='second'&&contractDetail.contState.value>1">上传</el-button>  <!-- 合同主体上传 -->
    </div>
    
    <!-- 拨号弹出框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="460px">
      <div>
        <div class="icon">
          <i class="el-icon-success"></i>
        </div>
        <div class="text">
          <p>号码绑定成功！ </p>
          <p>请拨打此号码 {{callNumber}} 联系客户</p>
        </div>
      </div>
    </el-dialog>

    <!-- 资金监管弹窗(暂缓) -->
    <!-- <el-dialog title="资金监管" :visible.sync="dialogSupervise" width="740px">
      <div class="download">
        <p>资金监管合同模板下载</p>
      </div>
      <div class="upload">
        <p>资金监管合同上传</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSupervise = false">取 消</el-button>
        <el-button type="primary" @click="dialogSupervise = false">确 定</el-button>
      </span>
    </el-dialog> -->

    <!-- 合同撤单弹窗 -->
    <el-dialog title="合同撤单" :visible.sync="dialogInvalid" width="740px" :closeOnClickModal="$tool.closeOnClickModal">
      <div class="top">
        <p class="form-label">合同撤单原因</p>
        <div class="reason">
          <el-input type="textarea" :rows="5" placeholder="请填写合同撤单原因，最多100字 " v-model="invalidReason" resize='none' style="width:597px" maxlength="100"></el-input>
          <span>{{invalidReason.length}}/100</span>
          <p v-if="contractDetail.toExamineState.value>-1&&contractDetail.contState.value!=2"><span>注：</span>您的合同正在审核中，是否确认要做撤单？撤单后，合同需要重新提审！</p>
          <p v-if="contractDetail.contState.value===2"><span>注：</span>您的合同已签章，是否确认要做撤单？撤单后，合同需要重新提审！</p>
          <p v-if="contractDetail.toExamineState.value<0"><span>注：</span>您的合同是否确认要做撤单？撤单后，合同需要重新提审！</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="dialogInvalid = false">取消</el-button>
        <el-button round type="primary" @click="setInvalid">保存</el-button>
      </span>
    </el-dialog>
    <!-- 回访录音添加备注弹窗 -->
    <el-dialog title="添加备注" :visible.sync="showRemarks" width="740px" :closeOnClickModal="$tool.closeOnClickModal">
      <div class="top">
        <div class="reason">
          <el-input type="textarea" :rows="5" placeholder="请填写备注，最多100字 " v-model="recordRemarks" resize='none' style="width:720px" maxlength="100"></el-input>
          <span>{{recordRemarks.length}}/100</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="showRemarks = false">取消</el-button>
        <el-button round type="primary" @click="addRemark">保存</el-button>
      </span>
    </el-dialog>
    <!-- 提审弹窗 -->
    <el-dialog title="提示" :visible.sync="isSubmitAudit" width="460px">
      <span>确定提审？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isSubmitAudit = false">取 消</el-button>
        <el-button type="primary" @click="submitAudit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 审核，编辑，反审核，业绩分成弹框 -->
    <achDialog :shows="shows" @close="closeAch" :achObj="achObj" :dialogType="dialogType" :contractCode="code2"></achDialog>
    <!-- 变更/解约编辑弹窗 -->
    <changeCancel :dialogType="canceldialogType" :cancelDialog="changeCancel_" :contId="changeCancelId" @closeChangeCancel="changeCancelDialog" v-if="changeCancel_"></changeCancel>
    <!-- 图片预览 -->
    <preview :imgList="previewFiles" :start="previewIndex" v-if="preview" @close="preview=false"></preview>
    <!-- 打印成交报告 -->
    <vue-easy-print tableShow ref="easyPrint" v-show="false" style="width:900px" class="easyPrint">
      <div class="printContent">
        <div class="printHeader">
          <div><span class="printTag">合同编号：</span><span class="printTxt">{{contractDetail.code}}</span></div>
        </div>
        <div class="printMsg">
          <div class="contTitle">合同信息</div>
          <div class="printItem">
            <p><span class="printTag">签约日期：</span><span class="printTxt">{{contractDetail.signDate}}</span></p>
            <p>
              <span class="printTag">合同类型：</span>
              <span class="printTxt" v-if="contractDetail.contType.value===1">租赁</span>
              <span class="printTxt" v-if="contractDetail.contType.value===2">买卖</span>
              <span class="printTxt" v-if="contractDetail.contType.value===3">代办</span>
              <span class="printTxt" v-if="contractDetail.contType.value===4">意向</span>
              <span class="printTxt" v-if="contractDetail.contType.value===5">定金</span>
            </p>
            <p><span class="printTag">客户保证金：</span><span class="printTxt">{{contractDetail.custEnsure}} 元</span></p>
          </div>
          <div class="printItem">
            <p class="p_width">
              <span class="printTag">成交总价：</span>
              <span class="dealPrice">{{contractDetail.dealPrice}} 元
                <i v-for="item in dictionary['507']" :key="item.key" v-if="item.key===contractDetail.timeUnit&&contractDetail.contType.value===1"> / {{item.value}}</i>
                <i>{{contractDetail.dealPrice|moneyFormat}}</i>
              </span>
            </p>
          </div>
          <div class="printItem">
            <p><span class="printTag">客户佣金：</span><span class="printTxt">{{contractDetail.custCommission}} 元</span></p>
            <p><span class="printTag">业主佣金：</span><span class="printTxt">{{contractDetail.ownerCommission}} 元</span></p>
            <p><span class="printTag">佣金支付费：</span><span class="printTxt">{{contractDetail.commissionPayment}} 元</span></p>
          </div>
        </div>
        <div class="printMsg">
          <div class="contTitle">房源信息</div>
          <div class="printItem">
            <p style="width:245px"><span class="printTag">房源编号：</span><span class="printCode">{{contractDetail.houseinfoCode}}</span></p>
            <p class="p_width">
              <span class="printTag">物业地址：</span>
              <span class="text">{{contractDetail.propertyAddr}}</span>
              <!-- <span class="printTxt">{{contractDetail.houseInfo.EstateName}}</span>
              <span class="printTxt">{{contractDetail.houseInfo.BuildingName}}</span>
              <span class="printTxt">{{contractDetail.houseInfo.Unit}}</span>
              <span class="printTxt">{{contractDetail.houseInfo.RoomNo}}</span> -->
            </p>
          </div>
          <div class="printItem">
            <p><span class="printTag">建筑面积：</span><span class="printTxt">{{contractDetail.houseInfo.Square}} m²</span></p>
            <p><span class="printTag">套内面积：</span><span class="printTxt">{{contractDetail.houseInfo.SquareUse}} m²</span></p>
            <p><span class="printTag">用 途：</span><span class="printTxt">{{contractDetail.houseInfo.HousePurpose?contractDetail.houseInfo.HousePurpose:'--'}}</span></p>
          </div>
          <div class="printItem">
            <p><span class="printTag">房 型：</span><span class="printTxt">{{contractDetail.houseInfo.HouseType?contractDetail.houseInfo.HouseType:'--'}}</span></p>
            <p><span class="printTag">朝 向：</span><span class="printTxt">{{contractDetail.houseInfo.Orientation?contractDetail.houseInfo.Orientation:'--'}}</span></p>
            <p><span class="printTag">装 修：</span><span class="printTxt">{{contractDetail.houseInfo.DecorateType?contractDetail.houseInfo.DecorateType:'--'}}</span></p>
          </div>
          <div class="printItem">
            <p><span class="printTag">房源方门店：</span><span class="printTxt">{{contractDetail.houseInfo.HouseStoreName}}</span></p>
            <p><span class="printTag">店 长：</span><span class="printTxt">{{contractDetail.houseInfo.ShopOwnerName}}</span></p>
            <p><span class="printTag">手 机：</span><span class="printTxt">{{contractDetail.houseInfo.ShopOwnerMobile}}</span></p>
          </div>
          <div class="printItem printItem_" style="width:840px;margin-top:5px">
            <el-table :data="ownerData" border header-row-class-name="theader-bg" style="width:100%">
              <el-table-column prop="name" label="业主姓名" width="200"></el-table-column>
              <el-table-column label="电话" min-width="200">
                <template slot-scope="scope">
                  {{scope.row.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}}
                </template>
              </el-table-column>
              <el-table-column prop="relation" label="关系" width="200"></el-table-column>
              <!-- <el-table-column label="产权比" v-if="contType!='1'" width="149">
                <template slot-scope="scope">
                  {{scope.row.propertyRightRatio+'%'}}
                </template>
              </el-table-column> -->
              <el-table-column prop="identifyCode" min-width="239" label="身份证号"></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="printMsg">
          <div class="contTitle">客源信息</div>
          <div class="printItem">
            <p><span class="printTag">客源编号：</span><span class="printCode">{{contractDetail.guestinfoCode}}</span></p>
            <p>
              <span class="printTag">付款方式：</span>
              <span class="printTxt" v-for="item in dictionary['556']" :key="item.key" v-if="contractDetail.guestInfo.paymentMethod===item.key">{{item.value}}</span>
            </p>
          </div>
          <div class="printItem">
              <p><span class="printTag">客源方门店：</span><span class="printTxt">{{contractDetail.guestInfo.GuestStoreName}}</span></p>
              <p><span class="printTag">店 长：</span><span class="printTxt">{{contractDetail.guestInfo.ShopOwnerName}}</span></p>
              <p><span class="printTag">手 机：</span><span class="printTxt">{{contractDetail.guestInfo.ShopOwnerMobile}}</span></p>
          </div>
          <div class="printItem printItem_" style="width:840px;margin-top:5px">
            <el-table :data="clientrData" border header-row-class-name="theader-bg">
              <el-table-column prop="name" label="客户姓名" width="200"></el-table-column>
              <el-table-column label="电话" min-width="200">
                <template slot-scope="scope">
                  {{scope.row.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}}
                </template>
              </el-table-column>
              <el-table-column prop="relation" label="关系" width="200"></el-table-column>
              <!-- <el-table-column label="产权比" v-if="contType!='1'" width="149">
                <template slot-scope="scope">
                  {{scope.row.propertyRightRatio+'%'}}
                </template>
              </el-table-column> -->
              <el-table-column prop="identifyCode" min-width="239" label="身份证号"></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="printMsg">
          <div class="contTitle">三方合作</div>
          <div class="printItem">
            <p><span class="printTag">扣合作费：</span><span class="printTxt">{{contractDetail.otherCooperationCost}}元</span></p>
            <p>
              <span class="printTag">类型：</span>
              <span class="printTxt" v-for="item in dictionary['517']" :key="item.key" v-if='item.key===contractDetail.otherCooperationInfo.type'>{{item.value}}</span>
              <span class="printTxt" v-else>--</span>
            </p>
          </div>
          <div class="printItem">
            <p>
              <span class="printTag">合作方姓名：</span>
              <span class="printTxt">{{contractDetail.otherCooperationInfo.name?contractDetail.otherCooperationInfo.name:"--"}}</span>
            </p>
            <p>
              <span class="printTag">联系方式：</span>
              <span class="printTxt">{{contractDetail.otherCooperationInfo.mobile?contractDetail.otherCooperationInfo.mobile:"--"}}</span>
            </p>
            <p class="p_idcard">
              <span class="printTag">身份证号：</span>
              <span class="printTxt">{{contractDetail.otherCooperationInfo.identifyCode?contractDetail.otherCooperationInfo.identifyCode:"--"}}</span>
            </p>
          </div>
          <div class="remark_">
            <div>
              <span class="printTag">备注：</span>
            </div>
            <div class="remarks">
              <p  v-if="contractDetail.otherCooperationInfo.remarks">{{contractDetail.otherCooperationInfo.remarks}}</p>
              <p v-else>暂无备注</p>
            </div>
          </div>
        </div>
      </div>
    </vue-easy-print>
  </div>
</template>
           
<script>
import achDialog from "./../../achievement/achDialog";
import changeCancel from "../contractDialog/changeCancel";
import { MIXINS } from "@/assets/js/mixins";
import { TOOL } from "@/assets/js/common";
import vueEasyPrint from "vue-easy-print";
export default {
  mixins: [MIXINS],
  components: {
    achDialog,
    changeCancel,
    vueEasyPrint,
  },
  data() {
    return {
      dialogVisible: false,
      dialogSupervise: false,
      //合同撤单弹窗内容
      dialogInvalid: false,
      invalidReason: "",
      activeName: "first",
      name:'first',
      //合同信息
      contractDetail: {
        contType: {},
        houseInfo: {},
        guestInfo: {
          paymentMethod: {}
        },
        otherCooperationInfo: {},
        contState: {},
        toExamineState: {},
        laterStageState:{},
        contChangeState:{}
      },
      //业主信息
      ownerData: [],
      //客户信息
      clientrData: [],
      //录音
      recordData: [],
      callNumber: "",
      //合同类型
      contType: 2,
      //合同id
      id: "",
      //变更解约id
      changeCancelId: "",
      //合同编号
      contCode: "",
      //分成
      shows: false,
      dialogType: 3,
      canceldialogType: "",
      changeCancel_: false,
      isActive: 1,
      dictionary: {
        //数据字典
        "514": "", //产权状态
        "517": "", //三方合作类型
        "556": "", //付款方式
        "507": "" //时间单位
      },
      //交易流程
      transFlowList: [],
      //分成人员
      employeeData: {
        houseAgents: [],
        customerAgents: []
      },
      //合同主体上传文件路径
      uploadList: [],
      //买方类型
      buyerList: [],
      //卖方类型
      sellerList: [],
      //其他类型
      otherList: [],
      code2: "", //合同编号,
      achObj:{},
      isDelete:'',
      //扩展参数
      parameterList:[],
      preview:false,
      start:'',
      //提审确认
      isSubmitAudit:false,
      //审核记录
      checkData:[],
      currentPage: 1,
      pageSize: 10,
      total:0,
      showRemarks:false,
      remarkId:'',
      recordRemarks:'',
      playTime:0,
      recordKey:'',
      isPlay:false,
      //权限
      power: {
        'sign-ht-xq-print': {
          state: false,
          name: '打印成交报告'
        },
        'sign-ht-info-view': {
          state: false,
          name: '预览'
        },
        'sign-ht-info-edit': {
          state: false,
          name: '编辑'
        },
        'sign-ht-xq-void': {
          state: false,
          name: '撤单'
        },
        'sign-ht-xq-cancel': {
          state: false,
          name: '解约'
        },
        'sign-ht-xq-modify': {
          state: false,
          name: '变更'
        },
        'sign-ht-view-toverify': {
          state: false,
          name: '提交审核'
        },
        'sign-ht-xq-yj': {
          state: false,
          name: '业绩分成'
        },
        'sign-ht-xq-main-add': {
          state: false,
          name: '编辑合同主体'
        },
        'sign-ht-xq-data-add': {
          state: false,
          name: '编辑资料库'
        },
        'sign-ht-xq-ly-wmemo': {
          state: false,
          name: '添加录音备注'
        },
        'sign-ht-xq-ly-call': {
          state: false,
          name: '拨打电话'
        },
        'sign-ht-xq-ly-play': {
          state: false,
          name: '听取录音'
        },
        'sign-ht-xq-ly-vmemo': {
          state: false,
          name: '查看备注'
        },
      }
    };
  },
  created() {
    this.contType = this.$route.query.contType.toString();
    this.id = this.$route.query.id;
    this.contCode = this.$route.query.code;
    if (this.$route.query.type === "dataBank") {
      this.activeName = "third";
      this.name="third";
    }
    this.getContractDetail();//合同详情
    this.getDictionary();//字典
    this.getTransFlow();//交易类型
    this.getAchievement();//业绩分成
    this.getContDataType();//获取合同集料库类型
    this.getExtendParams();//获取扩展参数
    this.getRecordList();//电话录音
  },
  methods: {
    printDemo(){
      this.$refs.easyPrint.print();
    },

    handleClick(tab, event) {
      console.log(tab.name);
      this.name=tab.name;
      if(tab.name==="second"){
        if(this.contractDetail.contState.value<2){
          this.$message({
            message:'合同未签章,不允许上传'
          })
        }
      }else if(tab.name==="fifth"){
        this.getAuditList();//合同审核信息
      }
    },
    //打电话
    call(value) {
      // this.dialogVisible = true;
      // this.callNumber = value.mobile;
      console.log(value);
      let param = {
        id:value.pid,
        contractCode:this.contCode,
        sourceType:value.personType.value===1?0:1
      };
      this.$ajax.get('/api/record/virtualNum',param).then(res=>{
        res=res.data;
        if(res.status===200){
          this.callNumber=res.data.virtualNum;
          this.dialogVisible = true;
        }
      }).catch(error=>{
        this.$message({
          message:error,
          type: "error"
        })
      })
    },
    //合同预览
    goPreview() {
      this.setPath(this.$tool.getRouter(['合同','合同列表','合同预览'],'contractList'));
      this.$router.replace({
        path: "/contractPreview",
        query: {
          id: this.id,
          code: this.contractDetail.code
        }
      });
    },
    // 分成弹窗
    fencheng() {
      if(this.contractDetail.achievementState.value===-1||this.contractDetail.achievementState.value===2||this.contractDetail.achievementState.value===-2){
        if(this.contractDetail.distributableAchievement>0){
          this.dialogType = 3;
          this.shows = true;
          this.code2 = this.$route.query.code;
          this.achObj={
            contractId:this.contractDetail.id,//合同id
            houseCode: this.contractDetail.houseinfoCode, //房源编号
            receivableComm: this.contractDetail.receivableCommission, //合同应收佣金
            signDate: this.contractDetail.signDate, //合同签约时间
            contractType: this.contractDetail.contType.value, //合同类型
            customerCode: this.contractDetail.guestinfoCode, //客源编号
            comm:this.contractDetail.distributableAchievement //可分配业绩
          }
        }else{
          this.$message({
            message:'无可分配业绩,无法分成'
          })
        }
      }else{
        this.$message({
          message:`当前业绩状态为${this.contractDetail.achievementState.label},无法分成`
        })
      }
    },
    closeAch(){
      this.shows=false;
      this.code2='';
      this.getAchievement();
    },
    // 合同编辑
    goEdit() {
      this.setPath(this.$tool.getRouter(['合同','合同列表','合同编辑'],'contractList'));
      this.$router.replace({
        path: "/addContract",
        query: {
          id: this.contractDetail.id,
          operateType: 2,
          type: this.contType
        }
      });
    },
     //提审
    submitAudit(){
      let param = {
        cityId:this.contractDetail.cityCode,
        flowType:3,
        bizCode:this.contractDetail.code
      }
      this.$ajax.get('/api/machine/submitAduit', param).then(res=>{
        this.isSubmitAudit=false;
        res=res.data;
        if(res.status===200){
          this.$message({
            message:"提审成功",
            type:'success'
          })
          // this.getContractList()
          this.getContractDetail()
        }else{
          this.$message({
            message:res.message
          })
        }
      }).catch(error => {
          this.$message({
            message:error,
            type: "error"
          })
        })
    },
    // 变更解约弹窗
    goChangeCancel(value) {
      this.changeCancelId = Number(this.id);
      if (value === 1) {
        this.canceldialogType = "changeEdit";
        this.changeCancel_ = true;
      } else if (value === 2) {
        this.canceldialogType = "cancelEdit";
        this.changeCancel_ = true;
      }
    },
    // 关闭变更解约弹窗
    changeCancelDialog() {
      this.changeCancel_ = false;
      this.canceldialogType = "";
      this.changeCancelId = "";
      this.getContractDetail();
    },
    //房源客源切换
    changeType(value) {
      this.isActive = value;
      this.currentPage=1;
      // console.log(type)
      this.getRecordList();
    },
    //查询录音
    getRecordList(){
      let param = {
        sourceType: this.isActive===1?0:1,
        contractCode: this.contCode,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      this.$ajax.get('/api/record/list', param).then(res=>{
        res=res.data;
        if(res.status===200){
          if(res.data.list.length>0){
            this.recordData=res.data.list;
          }
          this.total=res.data.total;
        }
      }).catch(error=>{
        this.$message({
          message:error,
          type: "error"
        })
      })
    },
    //翻页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getRecordList();
    },
    //添加备注弹窗
    showRemark(item){
      if(this.power['sign-ht-xq-ly-wmemo'].state){
        this.showRemarks=true;
        this.remarkId = item.id;
      }else{
        this.noPower('添加备注')
      }
    },
    //添加备注
    addRemark(){
      if(this.recordRemarks.length){
        let param = {
          remarks:this.recordRemarks,
          id:this.remarkId
        }
        this.$ajax.put('/api/record/update',param, 2).then(res=>{
          res=res.data;
          if(res.status===200){
            this.showRemarks=false;
            this.$message({
              message:'添加成功'
            });
            this.getRecordList();
          }
        }).catch(error=>{
          this.$message({
            message:error,
            type: "error"
          })
        })
      }
    },
    //播放录音
    playStop(index){
      // debugger
      console.log(index);
      let id = 'audio'+index;
      this.recordKey=index;
      let myAudios = document.getElementsByTagName('audio');
      // console.log(myAudios.length);
      let myAudio = document.getElementById(id);
      if (myAudio.paused){
        for(var i=0;i<myAudios.length;i++){
          myAudios[i].pause();
          // debugger
          if(myAudios[i]!=myAudio){
            if(myAudios[i].paused){
              this.playTime=0
            }
            myAudios[i].load();
          }
        }
        myAudio.play();
        this.isPlay=true;
      }else{
        myAudio.pause();
        this.isPlay=false;
      }
      var that=this
      myAudio.ontimeupdate = function (e) {
        // console.info('播放时间发生改变：'+myAudio.currentTime);
        let playTime_=(myAudio.currentTime/myAudio.duration)*100;
        if(playTime_){
          that.playTime=playTime_
        }
        // that.playTime=(myAudio.currentTime/myAudio.duration)*100?(myAudio.currentTime/myAudio.duration)*100;
      };
      myAudio.onended=function(e){
        that.playTime=0;
        that.isPlay=false;
      }

    },
    //下载录音
    downloadRecord(){
      let param = {
        recording:'82c17a1fe080c3043f7581bbcb97ca6a'
      }
      this.$ajax.get('/api/record/downloadRecord',param).then(res=>{
        res=res.data;
      })
    },
    //合同详情
    getContractDetail() {
      let param = {
        id: this.id
      };
      this.$ajax.get("/api/contract/detail", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.contractDetail = res.data;
          this.contractDetail.extendParams=JSON.parse(res.data.extendParams);
          this.contractDetail.signDate = res.data.signDate.substr(0, 10);
          this.ownerData=[];
          this.clientrData=[];
          for (var i = 0; i < this.contractDetail.contPersons.length; i++) {
            if (this.contractDetail.contPersons[i].personType.value === 1) {
              this.ownerData.push(this.contractDetail.contPersons[i]);
            } else if (
              this.contractDetail.contPersons[i].personType.value === 2
            ) {
              this.clientrData.push(this.contractDetail.contPersons[i]);
            }
          }
          if(res.data.isHaveData){
            this.getContData()
          }
          if(res.data.contState.value===3){
            this.getContractBody();//获取合同主体
          }
        }
      });
    },
     //获取合同扩展参数
    getExtendParams(){
      let param = {
        type:Number(this.contType)
      }
      this.$ajax.get('/api/contract/getExtendParamsByType', param).then(res=>{
        res=res.data;
        if(res.status===200){
          this.parameterList=res.data;
        }
      })
    },
    //获取所在城市的交易类型
    getTransFlow() {
      this.$ajax.get("/api/contract/getTransFlowListByCity").then(res => {
        res = res.data;
        if (res.status === 200) {
          console.log(res.data);
          this.transFlowList = res.data;
        }
      });
    },
    //业绩分成
    getAchievement() {
      let param = {
        contCode: this.contCode
      };
      this.$ajax.get("/api/achievement/getContDetailsAgents", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          if(res.data){
            this.employeeData = res.data;
          }
        }
      });
    },
    //获取合同主体信息
    getContractBody(){
      let param = {
        id:this.id
      }
      this.$ajax.get('/api/contract/getContractBodyById', param).then(res=>{
        res=res.data;
        if(res.status===200){
          let uploadList_ = res.data;
          uploadList_.forEach(element => {
            let fileType = this.$tool.get_suffix(element.name);
            element.fileType=fileType;
          });
          this.uploadList=uploadList_;
        }
      })
    },
    //合同主体获取文件路径数组
    uploadSubject(data) {
      let arr = data.param;
      arr.forEach(element => {
        let fileType = this.$tool.get_suffix(element.name);
        element.fileType = fileType;
      });
			this.uploadList=this.uploadList.concat(arr);
    },
    //合同主体的删除
    ZTdelectData(index){
      this.uploadList.splice(index,1)
    },
    //保存上传文件
    saveFile() {
      if(this.uploadList.length>0){
        this.uploadList.forEach(element => {
          delete element.fileType
        });
        let param = {
          contId:this.id,
          datas:this.uploadList
        }
        this.$ajax.postJSON("/api/contract/uploadContBody", param).then(res => {
          res=res.data;
          if(res.status===200){
            this.getContractBody();
            this.$message({
              message:'上传成功'
            })
          }
        })
      }else{
        this.$message({
          message:'请选合同主体'
        })
      }
    },
    //获取合同资料库类型列表
    getContDataType() {
      let param = {
        id: this.id
      };
      this.$ajax.get("/api/contract/getContDataTypeById", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          let dataType = JSON.parse(res.data);
          console.log(dataType);
          dataType.forEach(element => {
            if(element.type==='1'){
              let item={};
              item.value=[];
              item.kind=element.type;
              item.title=element.name;
              item.isrequire=element.isNecessary;
              this.buyerList.push(item);
            }else if(element.type==='2'){
              let item={};
              item.value=[];
              item.kind=element.type;
              item.title=element.name;
              item.isrequire=element.isNecessary;
              this.sellerList.push(item);
            }else if(element.type==='3'){
              let item={};
              item.value=[];
              item.kind=element.type;
              item.title=element.name;
              item.isrequire=element.isNecessary;
              this.otherList.push(item);
            }
          });
        }
      })
    },
    //获取合同资料库信息

    getContData() {
      let param = {
        id: this.id
      };
      this.$ajax.get("/api/contract/getContAttachmentById", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          let address = JSON.parse(res.data.address);
          console.log(address)
          address.forEach(element => {
            element.value.forEach(item => {
              let fileType = this.$tool.get_suffix(item.name);
              item.fileType=fileType
            });
            if(element.kind==="1"){
              this.buyerList.forEach(ele => {
                if(element.title===ele.title){
                  // let fileType = this.$tool.get_suffix(element.name)
                  ele.value=element.value
                }
              });
              // this.buyerDataList.push(element);
            }else if(element.kind==="2"){
              this.sellerList.forEach(ele => {
                if(element.title===ele.title){
                  ele.value=element.value
                }
              });
              // this.sellerDataList.push(element);
            }else if(element.kind==="3"){
              this.otherList.forEach(ele => {
                if(element.title===ele.title){
                  ele.value=element.value
                }
              });
              // this.otherDataList.push(element);
            }
          });
        }
      });
    },
    //合同资料库添加数据
    addSubject(data){
      console.log(data);
      let arr = data.param;
      let num = Number(data.btnId.substring(data.btnId.length-1));
      let typeId = data.btnId.substring(0,data.btnId.length-1);
      arr.forEach(element => {
        let fileType = this.$tool.get_suffix(element.name);
        element.fileType = fileType;
      });
      if(typeId==='seller'){
        // this.sellerList[num].value.push(arr[0]);
        this.sellerList[num].value=this.sellerList[num].value.concat(arr);
      }else if(typeId==='buyer'){
        // this.buyerList[num].value.push(arr[0]);
        this.buyerList[num].value=this.buyerList[num].value.concat(arr);
      }else if(typeId==='other'){
        // this.otherList[num].value.push(arr[0]);
        this.otherList[num].value=this.otherList[num].value.concat(arr);
      }
    },
    //显示删除按钮
    moveIn(value){
      this.isDelete=value
    },
    moveOut(value){
      if(this.isDelete===value){
        this.isDelete=''
      }
    },
    //上传合同资料库
    uploading(){
      let uploadContData = this.sellerList.concat(this.buyerList, this.otherList);
      console.log(uploadContData);
      let isOk;
      let arr_=[];
      for(let i=0;i<uploadContData.length;i++){
        isOk = false;
        if(uploadContData[i].isrequire&&uploadContData[i].value.length===0){
          this.$message({
            message:`${uploadContData[i].title}不能为空`
          });
          break
        }else if(uploadContData[i].isrequire&&uploadContData[i].value.length>0){
          uploadContData[i].value.forEach(element => {
            // delete element.fileType;
          });
          arr_.push(uploadContData[i]);
          isOk = true;
        }else if(!uploadContData[i].isrequire&&uploadContData[i].value.length>0){
          uploadContData[i].value.forEach(element => {
            // delete element.fileType;
          });
          arr_.push(uploadContData[i]);
          isOk = true;
        }else{
          isOk = true;
        }
      }
      if(isOk){
        if(this.contractDetail.laterStageState.value===4||this.contractDetail.laterStageState.value===1){
          var code = 1;
        }else{
          var code = 2;
        }
        let param = {
          datas: arr_,
          contId: this.id,
          operation:code
        }
        // console.log(param)
        this.$ajax.postJSON('/api/contract/uploadContData', param).then(res=>{
          res=res.data;
          if(res.status===200){
            this.$message({
              message:'上传成功'
            });
            this.getContData();
          }
        })
      }
    },
    delectData(index,index_,type){
      console.log(index,index_,type);
      if(type==="seller"){
        this.sellerList[index].value.splice(index_,1);
      }else if(type==="buyer"){
        this.buyerList[index].value.splice(index_,1);
      }else if(type==="other"){
        this.otherList[index].value.splice(index_,1);
      }
    },
    //合同撤单弹窗
    invalid(){
      this.dialogInvalid=true;
    },
    setInvalid(){
      if(this.invalidReason.length>0){
        let param = {
          id: this.id,
          reason: this.invalidReason
        };
        this.$ajax.post('/api/contract/invalid', param).then(res=>{
          res=res.data;
          if(res.status===200){
            this.getContractDetail();
            this.dialogInvalid=false;
            this.$message({
              message:'操作成功'
            })
          }
        }).catch(error=>{
          this.$message({
            message:error,
            type: "error"
          })
        })
      }else{
        this.$message({
          message:'请填写撤单原因'
        })
      }
    },
    //图片预览
    // getPicture(value,index){
    //   this.start=index;
    //   let arr=[];
    //   // console.log(value);
    //   value.forEach(item =>{
    //     arr.push(item.path)
    //   })
    //   this.fileSign(arr)
    // },
    //合同审核信息
    getAuditList(){
      let param = {
        flowType:3,
        bizCode:this.contCode
      };
      this.$ajax.get('/api/machine/getAuditList', param).then(res=>{
        res=res.data;
        if(res.status===200){
          this.checkData=res.data.data;
        }
      })
    }
  },
  filters: {
    moneyFormat: function(val) {
      if (!val) {
        return "零";
      } else {
        return TOOL.toChineseNumber(val);
      }
    },
    //秒转时分秒
    SecondFormat: function(result){
      var h = Math.floor(result / 3600) < 10 ? '0'+Math.floor(result / 3600) : Math.floor(result / 3600);
      var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
      var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
      return result = h + ":" + m + ":" + s;
    }
  }
};
</script>
 <style media="print">
  @page {
   size: auto;
   margin: 0mm;
  }
 </style>
<style scoped lang="less">
@import "~@/assets/common.less";

.view-container {
  /deep/.el-tabs__header {
    margin-bottom: 0;
  }
  /deep/.el-tabs__item {
    font-size: 18px;
    height: 60px;
    line-height: 60px;
  }
  padding-left: 20px;
  background: @bg-white;
  font-size: 14px;
  position: relative;
  //合同详情
  .msg {
    border-bottom: 1px solid @border-ED;
    display: flex;
    padding: 20px 0 20px 0;
    .title {
      width: 70px;
      font-weight: bold;
      color: @color-blank;
      white-space: nowrap;
    }
    .content {
      .one_ {
        margin-bottom: 10px;
        &:last-of-type {
          margin-bottom: 0;
        }
        > p {
          width: 270px;
          display: inline-block;
          .tag {
            display: inline-block;
            width: 100px;
            text-align: right;
            color: @color-6c;
          }
          .text {
            color: @color-blank;
          }
          .dealPrice {
            color: @color-yellow;
          }
          .serialNumber {
            color: @color-blue;
            font-weight: bold;
          }
        }
        .address {
          width: 600px;
        }
      }
      .extendParams{
        width: 820px;
        > p{
          width: 350px;
          padding: 4px 0;
          .tag{
            width: 200px;
          }
        }
      }
      .performance {
        > p {
          color: @color-6c;
          .orange {
            color: @color-orange;
          }
        }
      }
      .table {
        padding: 10px 0;
        width: 1050px;
        /deep/ .theader-bg {
          > th {
            background-color: @bg-th;
          }
        }
        i {
          font-size: 20px;
          padding-left: 5px;
          color: #54d384;
          cursor: pointer;
        }
        > p {
          color: @color-6c;
          padding-bottom: 10px;
        }
      }
      .remark {
        display: flex;
        padding-left: 15px;
        >span{
          color: @color-6c;
        }
        > p {
          color: @color-D6;
          width: 650px;
          height: 100px;
          padding: 10px;
          border-radius: 4px;
          border: 1px solid rgba(236, 239, 242, 1);
          background: @bg-FA;
        }
      }
    }
  }
  //合同主体
  .contractSubject {
    padding: 40px;
  }
  .uploadSubject {
    display: inline-block;
    text-align: center;
    width: 120px;
    height: 120px;
    box-sizing: border-box;
    padding-top: 28px;
    border: 1px dashed @border-DE;
    border-radius:1px;
     i {
      color: @bg-th;
      font-size: 50px;
    }
     p {
      padding-top: 10px;
      color: @color-324;
      font-size: 12px;
    }
  }
  .namePath{
    display: inline-block;
    text-align: center;
    width: 120px;
    height: 120px;
    padding-top: 20px;
    box-sizing: border-box;
    border-radius:4px;
    background: @color-F2;
    > p{
      padding-top: 5px;
      display: inline-block;
      width: 100px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
  //资料库
  .ulData{
    display: flex;
    flex-wrap:wrap;
    li{
      margin-right: 10px;
      position: relative;
      margin-bottom: 10px;
      > i{
        position: absolute;
        top: 5px;
        right: 5px;
        color: @color-warning;
        font-size: 20px;
        cursor: pointer;
      }
    }
  }
  .dataBank {
    padding: 0 30px 0 10px;
    height: 100%;
    .classify {
      padding-top: 20px;
      padding-bottom: 30px;
      border-bottom: 1px solid @border-ED;
      .title {
        font-size: 16px;
        color: @color-324;
      }
      .one_ {
        padding-left: 10px;
        > p {
          font-size: 14px;
          padding: 10px 0;
          color: @color-6c;
          > i {
            color: @color-FF;
          }
        }
      }
    }
    .classifyFoot{
      padding: 10px 10px;
      .objection{
        font-size: 14px;
        color: @color-FF;
      }
    }
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    p {
      color: @color-6c;
      display: inline-block;
      padding-right: 20px;
      font-size: 12px;
    }
    > div {
      &:last-of-type {
        padding-right: 20px;
        /deep/.el-button.is-round {
          padding: 10px 20px;
        }
      }
    }
  }
  /deep/.el-dialog__header {
    border-bottom: 1px solid @border-ED;
  }
  /deep/.el-dialog__body {
    .icon {
      text-align: center;
      font-size: 50px;
      padding-bottom: 15px;
      padding-top: 25px;
      color: #54d384;
    }
    .text {
      text-align: center;
      padding-bottom: 30px;
      p {
        line-height: 30px;
      }
    }
  }
  .functionTable {
    position: absolute;
    right: 0;
    top: 10px;
    padding-right: 20px;
    /deep/.el-button.is-round {
      padding: 10px 20px;
    }
  }
  .download,
  .upload {
    height: 200px;
  }
  .type {
    margin-top: 20px;
    width: 168px;
    height: 36px;
    align-items: center;
    box-sizing: border-box;
    border: 2px solid @color-blue;
    border-radius: 18px;
    overflow: hidden;
    display: flex;
    > span {
      width: 50%;
      height: 36px;
      line-height: 36px;
      text-align: center;
      font-size: 14px;
      color: @color-blue;
      cursor: pointer;
    }
    .active {
      background: @color-blue;
      color: @color-white;
    }
  }
  .record {
    width: 950px;
    padding-top: 20px;
    .name-wrapper {
      display: flex;
      display: -webkit-box;
      /*!autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
      -webkit-line-clamp: 1;
      overflow: hidden;
      text-overflow:ellipsis;
    }
    .noPower{
      width:300px;
      text-align:center
    }
    .addRemarks{
      font-size: 14px;
      color: @color-blue;
      cursor: pointer;
      display: inline-block;
      width: 299px;
      text-align: center;
    }
    .recordPlay{
      .playBtn{
        cursor: pointer;
        >i{
          font-size: 28px;
          color: #9BB3CB;
        }
      }
      .duration{
        display: inline-block;
        width: 140px;
        .totalTime{
          display: inline-block;
          width: 140px;
          height: 6px;
          background: #E8EAF6;
          position: relative;
          border-radius: 3px;
          .playTime{
            position: absolute;
            top: 0;
            left: 0;
            width: 10px;
            height: 8px;
            border-radius: 4px;
            background: @color-blue;
          }
        }
      }
    }
  }
  .top {
    display: flex;
    padding-top: 20px;
    > p {
      padding-right: 15px;
      font-size: 14px;
      width: 90px;
      color: @color-6c;
    }
    > .reason {
      position: relative;
      > span {
        position: absolute;
        top: 90px;
        right: 10px;
        color: @color-6c;
      }
      > p {
        padding-top: 10px;
        color: @color-6c;
        font-size: 12px;
        > span {
          color: @color-blank;
        }
      }
    }
  }
}
//打印模块
.printContent{
  // width: 1000px;
  font-size: 16px;
  box-sizing: border-box;
  padding: 40px 40px;
  p{
    display: inline-block;
    width: 240px;
    padding: 5px 0;
    >.dealPrice {
      color: @color-yellow;
    }
  }
  .p_width{
    width: 400px;
  }
  .p_idcard{
    width: 300px;
  }
  .printItem_{
    border-right: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
  }
  .printTag{
    padding-left: 0!important;
    display: inline-block;
    width: 96px;
    text-align: right;
    padding-left: 10px;
    color:@color-6c;
  }
  .printTxt{
    color: @color-233;
  }
  .contTitle{
    padding: 10px 0;
    color: @color-233;
    font-size: 20px;
    font-weight: bold;
  }
  .printCode{
    color: @color-blue;
    font-weight: bold;
  }
  .printHeader{
    padding: 16px 0;
    border-bottom: 1px solid @border-ED;
  }
  .printMsg{
    padding: 0 12px;
  }
  .remark_{
    margin-top: 10px;
    display: flex;
    .remarks{
      color: @color-233;
      padding: 10px;
      box-sizing: border-box;
      width: 750px;
      height: 200px;
      border: 1px solid #ebeef5;
      border-radius: 4px;
      >P{
        width: 770px;
      }
    }
  }
}
</style>