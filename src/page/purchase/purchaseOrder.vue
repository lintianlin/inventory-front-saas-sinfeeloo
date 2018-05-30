<template>
  <div id="app">
    <div class="employeeList commonSearchPage">
      <section v-loading="loading"
               element-loading-text="拼命加载中">
        <div class="section-content">
          <div class="el-table-diy filterQuery">
            <el-row class="table-header">
              <el-col :span="16" class="header-title"></el-col>
              <el-col :span="8" class="pointer text-r">
                                <span class="text-small m-r-5" v-show="!packupSearch" @click="changePackup"><i
                                  class="el-icon-arrow-up"></i> 收起筛选</span>
                <span class="text-small m-r-5" v-show="packupSearch" @click="changePackup"><i
                  class="el-icon-arrow-down"></i> 展开筛选</span>
                <el-button type="text" class="btn-text" @click="resetData()">重置</el-button>
                <el-button type="primary" class="btn-normal self-btn-blue" @click="getData()">查询
                </el-button>
              </el-col>
            </el-row>

            <el-row class="table-content collapse-el">
              <el-collapse-transition>
                <div style="box-sizing: border-box;">
                  <el-form :inline="true" :model="formInline" class="demo-form-inline"
                           label-width="100px">
                    <el-form-item label="订单类型：" prop="type">
                      <el-select v-model="formInline.type" placeholder="全部"
                                 class="selft-select-width" size="small" style="display: block" @change="getData()">
                        <el-option value="全部" label="全部"></el-option>
                        <el-option value="1" label="进货单"></el-option>
                        <el-option value="2" label="退货单"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="订单号：">
                      <el-input v-model="formInline.orderNumber" placeholder="输入订单号关键字"
                                size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="商品名称：">
                      <el-input v-model="formInline.goodsName" placeholder="输入商品名称关键字"
                                size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="供应商名称：">
                      <el-input v-model="formInline.supplierName" placeholder="输入供应商名称关键字"
                                size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="仓库名称：" prop="respId">
                      <el-select filterable v-model="formInline.respId" placeholder="全部"
                                 class="selft-select-width" size="small" @change="getData()"
                                 style="display: block">
                        <el-option
                          v-for="item in respoArr"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="审核状态：" prop="checkState" :class="{height0:packupSearch}">
                      <el-select v-model="formInline.checkState" placeholder="全部" size="small"
                                 class="selft-select-width" style="display: block">
                        <el-option value="全部" label="全部"></el-option>
                        <el-option value="1" label="未审核"></el-option>
                        <el-option value="2" label="未通过"></el-option>
                        <el-option value="3" label="通过"></el-option>
                        <el-option value="4" label="审核中"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="开始日期：" :class="{height0:packupSearch}">
                      <el-date-picker
                        size="small"
                        v-model="formInline.startTime"
                        type="date"
                        @change="changeDateS"
                        value-format="yyyy-MM-dd"
                        placeholder="订单开始日期">
                      </el-date-picker>
                    </el-form-item>

                    <el-form-item label="结束日期：" :class="{height0:packupSearch}">
                      <el-date-picker
                        size="small"
                        v-model="formInline.endTime"
                        type="date"
                        @change="changeDateE"
                        value-format="yyyy-MM-dd"
                        placeholder="订单结束日期">
                      </el-date-picker>
                    </el-form-item>
                  </el-form>
                </div>
              </el-collapse-transition>
            </el-row>
          </div>
          <div class="el-table-diy box-content" style="margin-top:0 ">
            <el-row class="box-content-header">
              <el-col :span="24" class="text-r">
                <el-button type="primary" class="btn-normal self-btn-blue" @click="formBuy()">
                  采购
                </el-button>
                <el-button type="primary" class="btn-normal self-btn-blue" @click="formRefund()">
                  退货
                </el-button>
                <!--<el-button type="primary" class="btn-normal self-btn-green" @click="exportOut()" style="margin-left:0;"-->
                <!--&gt;导出-->
                <!--</el-button>-->
              </el-col>
            </el-row>
            <el-row>
              <el-table
                :data="tableData"
                border
                style="width: 100%"
                ref="table" @selection-change="selsChange">
                <div>
                  <el-table-column
                    prop="No"
                    fixed
                    label="序号"
                    width="60"
                  >
                    <template slot-scope="scope">
                      <span class="text-grey"> {{ scope.$index + 1 }}</span>
                    </template>
                  </el-table-column>
                </div>

                <el-table-column
                  prop="ordernumber"
                  label="订单号"
                  width="220"
                >
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.ordernumber }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="type"
                  label="订单类型"
                  width="120"
                >
                  <template slot-scope="scope">
                    <span class="text-grey" v-if="scope.row.type===1">进货单</span>
                    <span class="text-grey" v-if="scope.row.type===2">退货单</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="goodsName"
                  label="商品名称"
                  min-width="180"
                >
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.goodsName }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="suppliername"
                  label="经销商名称"
                  min-width="180"
                >
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.suppliername }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="count"
                  label="数量"
                  min-width="100">
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.count }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="unitprice"
                  label="单价"
                  min-width="100"
                >
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.unitprice }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="totalprice"
                  label="总价"
                  min-width="150"
                >
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.totalprice }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="storageName"
                  label="仓库"
                  min-width="120"
                >
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.storageName }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="operator"
                  label="业务员"
                  width="80"
                >
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.operator }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="taketimeStr"
                  label="入库时间"
                  width="180"
                >
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.taketimeStr }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="descs"
                  label="描述"
                  min-width="140"
                >
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.descs }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="checkresult"
                  label="审核状态"
                  width="100"
                >
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.checkresult }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  fixed="right"
                  prop="address"
                  label="操作"
                  width="200">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      class="text-theme"
                      @click="formEdit(scope.row.id,scope.row.type)">编辑
                    </el-button>
                    <el-button
                      type="text"
                      class="text-theme"
                      @click="formView(scope.row.id,scope.row.type)">查看
                    </el-button>
                    <el-button
                      type="text"
                      class="text-theme"
                      v-if="scope.row.checkstate===1||scope.row.checkstate===2"
                      @click="formAudit(scope.row.id)">审核
                    </el-button>
                    <el-button
                      type="text"
                      class="text-theme"
                      @click="formDelete(scope.row.id)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
            <div class="pageContent">
              <div class="operation">
              </div>
              <div style="display: flex">
                <div style="color:#48576a;line-height:32px;font-size:14px;">每页显示：</div>
                <el-pagination
                  @current-change="handleCurrentChange"
                  @size-change="handleSizeChange"
                  :current-page="pageIdx"
                  :page-size="pageSize"
                  layout="sizes,total, prev, pager, next,jumper"
                  :page-sizes="[10,20,50,100]"
                  :total="totalPage">
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  import api from '@/fetch/api'
  import http from '@/fetch/http'
  import tools from '@/fetch/tools'

  export default {
    components: {},
    data() {
      return {
        tableData: [],
        valuePage: '', // 显示条数model
        valueSort: '', // 排序方式model
        pageIdx: 1, // 当前页
        pageSize: 20,
        totalPage: 0, // 总条数
        pageIdx2: 1, // 当前页
        pageSize2: 20,
        totalPage2: 0, // 总条数

        formInline: {
          type: '',
          orderNumber: '',
          goodsName: '',
          supplierName: '',
          respId: '',
          checkState: '',
          startTime: '',
          endTime: '',
        },
        respoArr: [],//仓库列表
        elAlertShow: false, // 提示框是否可显示
        elAlertTitle: 'fqwefq', // 提示框文字
        elAlertType: 'success', // 提示框类型
        loading: false, // 正在加载提示
        hasClick: false, // 重复提交增加点击校验标记
        dialogVisible: false, // 高级检索显示框
        dialogVisible2: false, // 表头设置
        rules: {},
        sels: [],
        status: '',
        packupSearch: false, // 筛选区域是否展开，true是收起，false是展开
      }
    },
    created() {
      this.getParamsLocalStorage()
    },
    mounted() {
      this.getData()
      this.getRespoArr()
      var sh = tools.getWindowSize('h') - 468
      $(".box-content .el-table").css({'min-height': sh + 'px'})
    },
    methods: {
      getData() { // 获取列表数据
        var self = this
        let params = {
          page: this.pageIdx,
          limit: this.pageSize,
          type: this.formInline.type == '全部' ? '' : this.formInline.type,
          orderNumber: this.formInline.orderNumber,
          goodsName: this.formInline.goodsName,
          supplierName: this.formInline.supplierName,
          respId: this.formInline.respId,
          checkState: this.formInline.checkState == '全部' ? '' : this.formInline.checkState,
          startTime: this.formInline.startTime,
          endTime: this.formInline.endTime,
        }
        http.axiosGet(api.purchaseOrder.getOrderListByPage, params,
          response => {
            self.loading = false
            localStorage.removeItem('pageParam')
            if (response.data.rc === 200) {
              self.tableData = response.data.data.list
              self.totalPage = response.data.data.total
            } else {
              self.controlElAlert('获取数据失败', 'error')
            }
          })
      },
      getRespoArr() { // 获取仓库数据
        var self = this
        let params = {}
        http.axiosGet(api.storage.getStorageListByPage, params,
          response => {
            self.loading = false
            localStorage.removeItem('pageParam')
            if (response.data.rc === 200) {
              self.respoArr = response.data.data.list
            } else {
              self.controlElAlert('获取数据失败', 'error')
            }
          })
      },
      formBuy() {//添加采购单
        this.setParamsLocalStorage()
        this.$router.push({path: '/purchase/addPurchaseOrder?isview=0&ordertype=1'})
      },
      formRefund() {//添加退货单
        this.setParamsLocalStorage()
        this.$router.push({path: '/purchase/addPurchaseOrder?isview=0&ordertype=2'})
      },
      formView(id, type) {//查看订单详情
        this.setParamsLocalStorage()
        this.$router.push({path: '/purchase/addPurchaseOrder?id=' + id + '&isview=1&ordertype=' + type})
      },
      formEdit(id, type) {//修改
        this.setParamsLocalStorage()
        this.$router.push({path: '/purchase/addPurchaseOrder?id=' + id + '&isview=0&ordertype=' + type})
      },
      formDelete(id) {//删除
        var self = this;
        let params = {
          id: id,
        }
        this.showCancelMessage(
          () => {
            http.axiosPost(api.purchaseOrder.delete, params,
              response => {
                if (response.data.rc === 200) {
                  self.controlElAlert('删除成功', 'success');
                  self.getData();
                } else {
                  self.controlElAlert('删除失败', 'warning');
                }
              });
          }
        )

      },
      formAudit(id) {//审核
        var self = this;
        let params = {
          id: id,
          checkState: 4
        }
        this.showAuditMessage(
          () => {
            http.axiosPost(api.purchaseOrder.check, params,
              response => {
                if (response.data.rc === 200) {
                  self.controlElAlert('提交审核成功！', 'success');
                  self.getData();
                } else {
                  self.controlElAlert('提交审核失败！', 'warning');
                }
              });
          }
        )

      },
      setParamsLocalStorage() { // 查询条件存入缓存
        var pageParam = {
          pageName: 'supplierList',
          page: this.pageIdx,
          limit: this.pageSize,
          type: this.formInline.type == '全部' ? '' : this.formInline.type,
          orderNumber: this.formInline.orderNumber,
          goodsName: this.formInline.goodsName,
          supplierName: this.formInline.supplierName,
          respId: this.formInline.respId,
          checkState: this.formInline.checkState == '全部' ? '' : this.formInline.checkState,
          startTime: this.formInline.startTime,
          endTime: this.formInline.endTime,
        }
        localStorage.pageParam = JSON.stringify(pageParam);
      },
      getParamsLocalStorage() {//读取缓存查询条件
        var pageParam = localStorage.pageParam;
        if (pageParam) {
          pageParam = eval("(" + pageParam + ")");
          if (pageParam.pageName == 'supplierList') {
            this.pageIdx = pageParam.page;
            this.pageSize = pageParam.limit;
            this.formInline.type = pageParam.type;
            this.formInline.orderNumber = pageParam.orderNumber;
            this.formInline.goodsName = pageParam.goodsName;
            this.formInline.supplierName = pageParam.supplierName;
            this.formInline.respId = pageParam.respId;
            this.formInline.checkState = pageParam.checkState;
            this.formInline.startTime = pageParam.startTime;
            this.formInline.endTime = pageParam.endTime;
          }
        }
      },
      changeDateS(val) {
        if (val) {
          this.formInline.startTime = val
        } else {
          this.formInline.startTime = '';
        }
      },
      changeDateE(val) {
        if (val) {
          this.formInline.endTime = val
        } else {
          this.formInline.endTime = '';
        }
      },
      handleSizeChange(val) {
        this.loading = true;
        this.pageSize = val;
        this.getData();
      },
      handleSizeChange2(val) {
        this.loading = true;
        this.pageSize2 = val;
        this.getDataDialog();
      },
      handleCurrentChange(val) {
        this.loading = true;
        console.log(val)
        this.pageIdx = val;
        this.getData();
      },
      handleCurrentChange2(val) {
        this.loading = true;
        this.pageIdx2 = val;
        this.getDataDialog();
      },
      resetData() {//重置查询条件
        this.loading = true;
        this.formInline.type = '';
        this.formInline.orderNumber = '';
        this.formInline.goodsName = '';
        this.formInline.supplierName = '';
        this.formInline.respId = '';
        this.formInline.checkState = '';
        this.formInline.startTime = '';
        this.formInline.endTime = '';
        this.getData();
      },
      handleCurrentChangeDialog(val) {//分页
        this.dialogpageIdx = val;
        this.getDataDialog();
      },
      showCancelMessage(callback) {//确认取消提示框
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(callback).catch(() => {
          console.log("删除失败！")
        });
      },
      showAuditMessage(callback) {//确认提交审核提示框
        this.$confirm('确认提交审核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(callback).catch(() => {
          console.log("提交审核失败！")
        });
      },
      controlElAlert(text, type) {//控制提示框
        var self = this;
        self.elAlertShow = true;
        self.elAlertTitle = text;
        self.elAlertType = type;
        setTimeout(function () {
          self.elAlertShow = false;
        }, 2000)
      },
      selsChange(sels) {
        this.sels = sels
      },
      changePackup() {//收起折叠搜索面板
        this.packupSearch = !this.packupSearch;
      },
    },
  }
</script>

<style lang='less'>
  .goodsList {
    section {
      .section-content {

      }
    }
  }

  .settingTable {
    list-style: none;
    overflow: hidden;
    width: 450px;
    margin: 0 auto;
    li {
      display: block;
      width: 150px;
      float: left;
      height: 40px;
      line-height: 40px;
      text-align: left;
    }
  }

  .el-dialog--large {
    .box-content .el-table th {
      background: #E4EFFF;
    }
  }

  .productDialog {
    width: 70% !important;
  }

  .el-dialog--tiny {
    width: 500px;
  }

  .el-form-item {
    height: 37px;
    transition: all 0.4s
  }

  .height0 {
    height: 0;
    overflow: hidden;
  }
</style>
