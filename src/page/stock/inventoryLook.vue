<template>
  <div id="app">
    <div class="goodsList commonSearchPage">
      <section v-loading="loading"
               element-loading-text="拼命加载中">
        <div class="section-content">
          <div class="el-table-diy filterQuery">
            <el-row class="table-header">
              <el-col :span="24" class="pointer text-r">
                <el-button type="text" class="btn-text" @click="resetData()">重置</el-button>
                <el-button type="primary" class="btn-normal self-btn-blue" @click="getData()">查询
                </el-button>
              </el-col>
            </el-row>
            <el-row class="table-content collapse-el">
              <el-collapse-transition>
                <el-form :inline="true" :model="formInline" class="demo-form-inline"
                         label-width="100px">
                  <el-form-item label="商品名称：">
                    <el-input v-model="formInline.goodsName" placeholder="输入商品名称"
                              size="small"></el-input>
                  </el-form-item>

                  <el-form-item label="仓库名称：" prop="respId">
                    <el-select filterable v-model="formInline.repoId" placeholder="全部"
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
                </el-form>
              </el-collapse-transition>

            </el-row>
          </div>
          <div class="el-table-diy box-content" style="margin-top:0 ">
            <el-row>
              <el-table
                :data="tableData"
                border
                ref="table" @selection-change="selsChange">
                <div>
                  <el-table-column
                    prop="No"
                    label="序号"
                    width="60"
                  >
                    <template slot-scope="scope">
                      <span class="text-grey"> {{ scope.$index + 1 }}</span>
                    </template>
                  </el-table-column>
                </div>

                <el-table-column
                  prop="goodsName"
                  label="商品名称"
                  min-width="80"
                >
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.goodsName }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="goodsCode"
                  label="商品编码"
                  min-width="50"
                >
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.goodsCode }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="goodsType"
                  label="商品类别"
                  min-width="120">
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.goodsType }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="goodsStandard"
                  label="规格"
                  min-width="100">
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.goodsStandard }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="storageName"
                  label="仓库名称"
                  min-width="50">
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.storageName }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="totalcount"
                  label="库存数量"
                  min-width="50">
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.totalcount }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="salecount"
                  label="销售数量"
                  min-width="50">
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.salecount }}</span>
                  </template>
                </el-table-column>


                <el-table-column
                  prop="buyprice"
                  label="上次进价"
                  min-width="50">
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.buyprice }}</span>
                  </template>
                </el-table-column>


                <el-table-column
                  prop="avgbuyprice"
                  label="平均进价"
                  min-width="50">
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.avgbuyprice }}</span>
                  </template>
                </el-table-column>


                <el-table-column
                  prop="saleprice"
                  label="预设售价"
                  min-width="50">
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.saleprice }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="totalbuyprice"
                  label="库存总值"
                  min-width="50">
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.totalbuyprice }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="totalsaleprice"
                  label="销售总值"
                  min-width="50">
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.totalsaleprice }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  fixed="right"
                  prop="address"
                  label="操作"
                  width="180">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      class="text-theme"
                      @click="formChangePrice(scope.row.id)">改价
                    </el-button>
                    <el-button
                      type="text"
                      class="text-theme"
                      @click="formAllot(scope.row.id)">调拨
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
      <el-alert class="topAlert"
                v-if="elAlertShow"
                :title="elAlertTitle"
                :type="elAlertType"
                :closable="false"
                show-icon>
      </el-alert>
      <el-dialog title="价格修改" :visible.sync="changePricedialogFormVisible" size="tiny" class="auditDialog">
        <el-form :model="changePriceformInDialog" label-width="100px">

          <el-form-item label="平均进价">
            <el-input v-model="changePriceformInDialog.avgBuyPrice"></el-input>
          </el-form-item>

          <el-form-item label="销售价格">
            <el-input v-model="changePriceformInDialog.salePrice"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="changePricedialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="changePriceOrder()">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="库存调拨" :visible.sync="allotdialogFormVisible" size="tiny" class="auditDialog">
        <el-form :model="allotformInDialog" label-width="100px">

          <el-form-item label="调拨数量：">
            <el-input v-model="allotformInDialog.allotNum"></el-input>
          </el-form-item>

          <el-form-item label="调拨仓库：">
            <el-select class="self-select" filterable v-model="allotformInDialog.toStorageId"
                       placeholder="请选择调拨仓库" size="small"
                       @change="getData()">
              <el-option label="全部" value="全部"></el-option>
              <el-option
                v-for="item in storageArr"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="allotdialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotOrder()">确 定</el-button>
        </div>
      </el-dialog>
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
        respoArr: [], // 仓库下拉框
        formInline: {
          goodsName: '',
          repoId: '',
        },
        changePriceformInDialog: {
          avgBuyPrice: '',
          salePrice: '',
        },
        allotformInDialog: {
          allotNum: '',
          toStorageId: '',
        },
        changePricedialogFormVisible: false,
        allotdialogFormVisible: false,
        changePriceId: '',
        allotId: '',
        storageArr: [],
        elAlertShow: false, // 提示框是否可显示
        elAlertTitle: 'fqwefq', // 提示框文字
        elAlertType: 'success', // 提示框类型
        loading: false, // 正在加载提示
        hasClick: false, // 重复提交增加点击校验标记
        rules: {},
        sels: [],
        status: '',
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
          goodsName: this.formInline.goodsName,
          repoId: this.formInline.repoId,
        }
        http.axiosGet(api.stock.getStockListByPage, params,
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
      formChangePrice(id) {//改价
        var self = this;
        self.changePricedialogFormVisible = true
        self.changePriceId = id
      },
      changePriceOrder() {//修改价格
        var self = this;
        let params = {
          id: self.changePriceId,
          avgBuyPrice: self.changePriceformInDialog.avgBuyPrice,
          salePrice: self.changePriceformInDialog.salePrice
        }
        http.axiosPost(api.stock.modifyPrice, params,
          response => {
            if (response.data.rc === 200) {
              self.controlElAlert('改价成功', 'success');
              self.changePriceformInDialog.avgBuyPrice = '';
              self.changePriceformInDialog.salePrice = '';
              self.getData();
              self.changePricedialogFormVisible = false
            } else {
              self.changePricedialogFormVisible = false
              self.controlElAlert(response.data.des, 'warning');
            }

          });

      },
      formAllot(id) {//调拨
        var self = this;
        self.allotdialogFormVisible = true
        self.allotId = id
      },
      allotOrder() {//调拨
        var self = this;
        let params = {
          id: self.changePriceId,
          avgBuyPrice: self.changePriceformInDialog.avgBuyPrice,
          salePrice: self.changePriceformInDialog.salePrice
        }
        http.axiosPost(api.stock.allot, params,
          response => {
            if (response.data.rc === 200) {
              self.controlElAlert('调拨成功', 'success');
              self.changePriceformInDialog.avgBuyPrice = '';
              self.changePriceformInDialog.salePrice = '';
              self.getData();
              self.changePricedialogFormVisible = false
            } else {
              self.changePricedialogFormVisible = false
              self.controlElAlert(response.data.des, 'warning');
            }

          });

      },
      formDelete(id) {//删除
        var self = this;
        let params = {
          id: id,
        }
        this.showCancelMessage(
          () => {
            http.axiosPost(api.storage.deleteStorage, params,
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
      setParamsLocalStorage() { // 查询条件存入缓存
        var pageParam = {
          pageName: 'inventoryLookList',
          page: this.pageIdx,
          limit: this.pageSize,
          goodsName: this.formInline.goodsName,
          repoId: this.formInline.repoId
        }
        localStorage.pageParam = JSON.stringify(pageParam);
      },
      getParamsLocalStorage() {//读取缓存查询条件
        var pageParam = localStorage.pageParam;
        if (pageParam) {
          pageParam = eval("(" + pageParam + ")");
          if (pageParam.pageName == 'inventoryLookList') {
            this.pageIdx = pageParam.page;
            this.pageSize = pageParam.limit;
            this.formInline.goodsName = pageParam.goodsName;
            this.formInline.repoId = pageParam.repoId;
          }
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
        this.formInline.goodsName = '';
        this.formInline.repoId = '';
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

    }

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
</style>
