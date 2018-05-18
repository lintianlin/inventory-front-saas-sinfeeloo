<template>
  <div id="app">
    <div class="goodsList commonSearchPage">
      <section v-loading="loading"
               element-loading-text="拼命加载中">
        <div class="section-content">
          <div class="el-table-diy filterQuery">
            <el-row class="table-header">
              <el-col :span="24" class="pointer text-r">
                <el-button type="text" class="btn-text" @click="refreshData()">重置</el-button>
                <el-button type="primary" class="btn-normal self-btn-blue" @click="getData()">查询
                </el-button>
              </el-col>
            </el-row>
            <el-row class="table-content collapse-el">
              <el-collapse-transition>
                <div v-show="!packupSearch" style="box-sizing: border-box;">
                  <el-form :inline="true" :model="formInline" class="demo-form-inline"
                           label-width="100px">
                    <el-form-item label="输入搜索：">
                      <el-input v-model="formInline.goodsName" placeholder="商品名称"
                                size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="商品编号：">
                      <el-input v-model="formInline.goodsCode" placeholder="商品编号"
                                size="small"></el-input>
                    </el-form-item>

                    <el-form-item label="品类：">
                      <el-select class="self-select" filterable v-model="formInline.typeId"
                                 placeholder="全部" size="small"
                                 @change="getData()">
                        <el-option label="全部" value="全部"></el-option>
                        <el-option
                          v-for="item in goodsTypeArr"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="商品品牌：">
                      <el-select class="self-select" filterable v-model="formInline.brandId"
                                 placeholder="全部" size="small"
                                 @change="getData()">
                        <el-option label="全部" value="全部"></el-option>
                        <el-option
                          v-for="item in brandArr"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                </div>
              </el-collapse-transition>

            </el-row>
          </div>
          <div class="el-table-diy box-content" style="margin-top:0 ">
            <el-row class="box-content-header">
              <el-col :span="24" class="text-r">
                <el-button type="primary" class="btn-normal self-btn-blue" @click="formAdd()" >
                  添加
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
                ref="table" @selection-change="selsChange">
                <div v-for="(item,i) in testCol" v-if="item.name=='goodsPic'">
                  <el-table-column
                    prop="pictureUrl"
                    v-if="item.name=='goodsPic'"
                    label="商品主图"
                    min-width="120">
                    <template slot-scope="scope">
                      <img v-if="scope.row.pictureUrl"
                           height="70"
                           width="70"
                           :src="'http://192.168.30.47:8087'+scope.row.pictureUrl+'?x-oss-process=image/resize,m_fill,h_50,w_50'"
                           alt="logo">
                    </template>
                  </el-table-column>
                </div>
                <div>
                  <el-table-column
                    type="selection"
                  >
                  </el-table-column>
                </div>
                <div>
                  <el-table-column
                    prop="No"
                    label="序号"
                    width="70"
                  >
                    <template slot-scope="scope">
                      <span class="text-grey"> {{ scope.$index + 1 }}</span>
                    </template>
                  </el-table-column>
                </div>

                <div v-for="(item,i) in testCol" v-if="item.name=='goodsName'">
                  <el-table-column
                    prop="name"
                    v-if="item.name='goodsName'"
                    label="商品名称"
                    min-width="120"
                  >
                    <template slot-scope="scope">
                      <span class="text-grey"> {{ scope.row.name }}</span>
                    </template>
                  </el-table-column>
                </div>
                <div v-for="(item,i) in testCol" v-if="item.name=='goodsCode'">
                  <el-table-column
                    prop="code"
                    v-if="item.name='goodsCode'"
                    label="商品编码"
                    min-width="120"
                  >
                    <template slot-scope="scope">
                      <span class="text-grey"> {{ scope.row.code }}</span>
                    </template>
                  </el-table-column>
                </div>
                <div v-for="(item,i) in testCol" v-if="item.name=='goodsType'">
                  <el-table-column
                    prop="typeName"
                    v-if="item.name='goodsType'"
                    label="类别"
                    min-width="200">
                    <template slot-scope="scope">
                      <span class="text-grey"> {{ scope.row.typeName }}</span>
                    </template>
                  </el-table-column>
                </div>
                <div v-for="(item,i) in testCol" v-if="item.name=='goodsBrand'">
                  <el-table-column
                    prop="brandName"
                    v-if="item.name='goodsBrand'"
                    label="品牌"
                    min-width="120">
                    <template slot-scope="scope">
                      <span class="text-grey"> {{ scope.row.brandName }}</span>
                    </template>
                  </el-table-column>
                </div>
                <div v-for="(item,i) in testCol" v-if="item.name=='goodsBrand'">
                  <el-table-column
                    prop="standard"
                    v-if="item.name='goodsBrand'"
                    label="规格"
                    min-width="120">
                    <template slot-scope="scope">
                      <span class="text-grey"> {{ scope.row.standard }}</span>
                    </template>
                  </el-table-column>
                </div>
                <div v-for="(item,i) in testCol" v-if="item.name=='goodsBuyPrice'">
                  <el-table-column
                    prop="buyprice"
                    v-if="item.name='goodsBuyPrice'"
                    label="进货价格"
                    min-width="100"
                  >
                    <template slot-scope="scope">
                      <span class="text-grey"> {{ scope.row.buyprice?scope.row.buyprice:'0.00' }}</span>
                    </template>
                  </el-table-column>
                </div>
                <div v-for="(item,i) in testCol" v-if="item.name=='goodsSalesPrice'">
                  <el-table-column
                    prop="saleprice"
                    v-if="item.name='goodsSalesPrice'"
                    label="销售价格"
                    min-width="100"
                  >
                    <template slot-scope="scope">
                      <span class="text-grey"> {{ scope.row.saleprice ? scope.row.saleprice : '0.00'}}</span>
                    </template>
                  </el-table-column>
                </div>
                <div v-for="(item,i) in testCol" v-if="item.name=='goodsDesc'">
                  <el-table-column
                    prop="descs"
                    v-if="item.name='goodsDesc'"
                    label="商品描述"
                    min-width="100"
                  >
                    <template slot-scope="scope">
                      <span class="text-grey"> {{ scope.row.descs }}</span>
                    </template>
                  </el-table-column>
                </div>

                <el-table-column
                  prop="providerName"
                  label="商品状态"
                  min-width="100"
                  fixed="right"

                  v-if="premiss.enableHas"
                >
                </el-table-column>
                <el-table-column
                  fixed="right"
                  prop="address"
                  label="操作"
                  width="120">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      class="text-theme"
                      @click="formEdit(scope.row.id)">编辑
                    </el-button>
                    <el-button
                      type="text"
                      class="text-theme"
                      @click="formView(scope.row.id)">查看
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
    </div>
  </div>
</template>

<script>
  import api from '@/fetch/api'
  import http from '@/fetch/http'
  import tools from '@/fetch/tools'
  // import goodtypeSelect from '@/components/treeselect/GoodsTypeTreeSelectGoodsList.vue'
  // import goodtypeSelectCom from '@/components/GoodsTypeTreeSelectByCom'
  import * as types from '@/store/types'

  export default {
    components: {
      // 'goodtypeSelect': goodtypeSelect,
      // 'goodtypeSelectCom': goodtypeSelectCom
    },
    data() {
      return {
        typeArr: [],//商品类型下拉框
        props: {
          value: 'id',
          label: 'name',
          children: 'list'
        },
        tableData: [],
        optionsPage: ['10', '20', '50', '100'],//每页显示多少条
        optionsSort: [
          {label: '按名称排序', value: 'goods_name,desc'},
          {label: '按编码排序', value: 'goods_code,desc'},
          {label: '按品牌排序', value: 'brand_id,desc'},
          {label: '按分类排序', value: 'type_id,desc'},
          {label: '默认排序', value: 'id,desc'}
        ],//排序方式
        valuePage: '',//显示条数model
        valueSort: '',//排序方式model
        pageIdx: 1,//当前页
        pageSize: 20,
        totalPage: 0,//总条数

        pageIdx2: 1,//当前页
        pageSize2: 20,
        totalPage2: 0,//总条数
        providerArr: [],
        brandArr: [],//商品品牌下拉框
        goodsTypeArr: [],//商品品类下拉框
        formInline: {
          goodsName: '',
          goodsCode: '',
          typeId: '',
          brandId: '',
          color: '',
          standard: '',
          material: ''
        },
        formInline2: {
          goodsName: '',
          typeId: [],
          brandId: ''
        },
        goodsNameNew: '',
        goodsBrandId: '',
        goodTypeId: '',
        supplierArr: [],
        dialogTableData: [],//
        provider: '',
        statusnew: '',
        multipleSelection: [],//选中的值
        optionsLot: [//批量操作
          {label: '商品上架', value: '1'},
          {label: '商品下架', value: '2'},
        ],
//                optionsTab: [//批量操作
//                    {label: '全部商品', value: '1'},
//                    {label: '已上架', value: '2'},
//                    {label: '未上架', value: '3'},
//                ],
        valueLot: '',//批量操作
        elAlertShow: false,//提示框是否可显示
        elAlertTitle: 'fqwefq',//提示框文字
        elAlertType: 'success',//提示框类型
        packupSearch: false,//筛选区域是否展开，true是收起，false是展开
        loading: false,//正在加载提示
        hasClick: false,//重复提交增加点击校验标记
        dialogVisible: false,//高级检索显示框
        dialogVisible2: false,//表头设置
        dialogTitle: '高级检索',
        dialogImportGoods: false,//导入商品
        ruleForm: {
          name: '',
          description: ''
        },
        dialogForm: {//选择导入商品
          selectDate: '',
          selectDateStart: '',
          selectDateEnd: '',
          supplier: '',
          state: ''
        },
        rules: {},
        sels: [],
        status: '',
        optionsTab: 0,
        amountAll: 0,
        amountOn: 0,
        amountOff: 0,
        premiss: {//页面显示权限
          addHas: false,
          editHas: false,
          detailHas: false,
          exportHas: false,
          enableHas: false,
        },
        setting: {
          col1: true,
          col2: true,
          col3: true,
          col4: true,
          col5: true,
          col6: true,
          col7: true,
          col8: true,
          col9: true,
        },
        testCol: [{name: 'goodsPic'}, {name: 'goodsName'}, {name: 'goodsCode'}, {name: 'goodsType'}, {name: 'goodsBrand'}, {name: 'goodsStandard'}, {name: 'goodsBuyPrice'}, {name: 'goodsSalesPrice'}, {name: 'goodsDesc'}],
      }
    },
    created() {
      this.getParamsLocalStorage();
    },
    mounted() {
      this.getData();
      this.getBrand();
      this.getGoodsType();
      // this.getProvider();
      var sh = tools.getWindowSize('h') - 468;
      $(".box-content .el-table").css({'min-height': sh + 'px'})


    },
    methods: {
      showMessage() {
        this.controlElAlert('商品信息不完善，无法启用', 'error');
      },
      getSelectValue(val) {//商品类型组件回传
        console.log(val)
        if (val.id) {
          this.formInline.typeId = val.typeCode;
          this.formInline2.typeId = val.typeCode;
          this.goodTypeId = val.id;
        }
      },
      getData() {//获取列表数据
        var self = this;
        let params = {
          page: this.pageIdx,
          limit: this.pageSize,
          goodsName: this.formInline.goodsName,
          goodsCode: this.formInline.goodsCode,//商品编码
          typeId: this.formInline.typeId== '全部' ? '' : this.formInline.typeId, // 品类
          brandId: this.formInline.brandId == '全部' ? '' : this.formInline.brandId, // 品牌
          standard: this.formInline.standard,//规格
          material: this.formInline.material,//材质
        }
        http.axiosGet(api.goods.getGoodsListByPage, params,
          response => {
            self.loading = false;
            localStorage.removeItem('pageParam');
            if (response.data.rc==200) {
              self.tableData = response.data.data.list;
              self.totalPage = response.data.data.total;
            } else {
              self.controlElAlert('获取数据失败', 'error');
            }
          })
      },

      handleSelectionChange(val) {//获取选中的
        this.multipleSelection = val;
        /*
           var self = this;
           if(val){
               this.multipleSelection=val;
               var amounts=0;
               this.numberArr = [];
               val.forEach((item)=>{
                   amounts+=item.debtAmount
                   self.numberArr.push(item.number);//选中的编号

               })

               this.ruleForm4.amount=amounts;
               this.maxMoney=amounts;
           }else{
               this.ruleForm4.amount=0;
           }*/
      },
      getBrand() {//获取品牌信息
        var self = this;
        let params = {
          typeName: '品牌'
        }
        http.axiosGet(api.param.getParamListByPage, params,
          response => {
            self.brandArr = response.data.data.list;
          })
      },
      getGoodsType() {//获取品类信息
        var self = this;
        let params = {
          typeName: '品类'
        }
        http.axiosGet(api.param.getParamListByPage, params,
          response => {
            self.goodsTypeArr = response.data.data.list;
          })
      },

      formAdd(){
        this.setParamsLocalStorage()
        this.$router.push({path: '/basicinfo/addGoods'})
      },
      formSearch() {//高级检索
        this.dialogVisible = true;
      },
      formView(id) {
        this.setParamsLocalStorage();
        this.$router.push({path: '/main/goods/goodsListAdd?sid=' + id + '&isview=1'})
      },
      formEdit(id) {
        this.setParamsLocalStorage();
        this.$router.push({path: '/main/goods/goodsListAdd?sid=' + id + '&isview=0'})
      },
      setParamsLocalStorage() {//查询条件存入缓存
        var pageParam = {
          pageName: 'goodsList',
          page: this.pageIdx,
          limit: this.pageSize,
          goodsName: this.formInline.goodsName,
          goodsCode: this.formInline.goodsCode,//商品编码
          goodsType: this.formInline.goodsType,//品类
          brand: this.formInline.brand == '全部' ? '' : this.formInline.brand,//品牌
          color: this.formInline.color,//颜色
          standard: this.formInline.standard,//规格
          material: this.formInline.material,//材质
        }
        localStorage.pageParam = JSON.stringify(pageParam);
      },
      getParamsLocalStorage() {//读取缓存查询条件
        var pageParam = localStorage.pageParam;
        if (pageParam) {
          pageParam = eval("(" + pageParam + ")");
          if (pageParam.pageName == 'goodsList') {
            this.pageIdx = pageParam.page;
            this.pageSize = pageParam.limit;
            this.formInline.goodsName = pageParam.goodsName;
            this.formInline.goodsCode = pageParam.goodsCode;
            this.formInline.goodsType = pageParam.goodsType;
            this.formInline.brand = pageParam.brand;
            this.formInline.color = pageParam.color;
            this.formInline.standard = pageParam.standard;
            this.formInline.material = pageParam.material;
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
      refreshData() {
        this.loading = true;
        this.formInline.goodsName = '';
        this.formInline.brandId = '';
        this.formInline.typeId = '';
        this.formInline.status = '';
        this.getData();
      },
      batchDeal() {
        var self = this;
        if (this.valueLot == null || this.valueLot == "") {
          this.controlElAlert('请选择批量处理操作', 'success');
          return;
        }

        var ids = this.sels.map(item => item.id).join()
        if (ids == null || ids == "") {
          this.controlElAlert('请选择批量处理记录', 'success');
          return;
        }

        var status = 1;
        if (this.valueLot == 2) {
          status = 0;
        }
        let params = {
          ids: ids,
          status: status
        }
        http.axiosPost(api.goodsInfo.changeStatusBatch, params,
          response => {
            if (response.data.success) {
              if (status == 1) {
                self.controlElAlert('启用成功', 'success');
                this.getData();
              } else {
                self.controlElAlert('关闭成功', 'success');
                this.getData();
              }
            } else {
              if (status == 1) {
                self.controlElAlert('启用失败', 'warning');
              } else {
                self.controlElAlert('关闭失败', 'warning');
              }
            }
          });
      },
      changeStatus(id, val) {//改变是否启用的状态
        var self = this;
        let params = {
          id: id,
          status: val
        }
        http.axiosPost(api.goodsInfo.changeStatusSH, params,
          response => {
            if (response.data.success) {
              if (val == '1') {
                self.controlElAlert('启用成功', 'success');
              } else {
                self.controlElAlert('关闭成功', 'success');
              }
            } else {
              if (val == '1') {
                self.controlElAlert('启用失败', 'warning');
              } else {
                self.controlElAlert('关闭失败', 'warning');
              }
            }
          });
      },
      deleteData(id) {//删除
        var self = this;
        let params = {
          id: id
        }
        this.showCancelMessage(
          () => {
            http.axiosPost(api.goodsInfo.delete, params,
              response => {
                if (response.data.success) {
                  self.controlElAlert('删除成功', 'success');
                  self.getData();
                } else {
                  self.controlElAlert('删除失败', 'warning');
                }
              });
          }
        );

      },
      protectData(id, num) {
        var self = this;
        let params = {
          id: id,
          protectLock: num
        }
        http.axiosPost(api.goodsInfo.changeProtectLock, params,
          response => {
            if (response.data.success) {
              self.controlElAlert('锁定成功', 'success');
              self.getData();
            } else {
              self.controlElAlert('锁定失败', 'success');
            }
          });
      },
      getBrandList() { //获取商品品牌下拉框
        var self = this;
        let params = {
          companyId: localStorage.companyID
        }
        http.axiosGet(api.brand.list, params,
          response => {
            self.brandNamepArr = response.data.result;
          });
      },
      resetForm(formName) {
        this.dialogVisible = false;

        this.editID = '';
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
      changePackup() {//收起折叠搜索面板
        this.packupSearch = !this.packupSearch;
      },
      selsChange(sels) {
        this.sels = sels
      },
      delGroup() {
        var ids = this.sels.map(item => item.id).join()//获取所有选中行的id组成的字符串，以逗号分隔
      },
//            handleCurrentChange(row, event, column) {
//                this.$refs.table.toggleRowSelection(row)
//            },
      onTabClick() {
        if (this.optionsTab == "0") {
          this.status = "";
        } else if (this.optionsTab == "1") {
          this.status = "1";
        } else if (this.optionsTab == "2") {
          this.status = "0";
        }
        this.getData();
      },
      searchData() {
        var self = this;
        var sortCodeStr = 'id';//排序字段
        var sortRoleStr = 'desc';//排序方式
        let params = {
          companyId: localStorage.companyID,
          page: this.pageIdx,
          limit: this.pageSize,
          goodsName: this.goodsNameNew,
          typeId: this.goodTypeId,
          brandId: this.goodsBrandId,
          providerId: this.provider,
          status: this.statusnew,
          sortCode: sortCodeStr,
          sortRole: sortRoleStr
        }
        http.axiosGet(api.goodsInfo.selectAll, params,
          response => {
            self.loading = false;
            if (response.data.success) {
              self.tableData = response.data.result.data;
              self.totalPage = response.data.result.total;
            } else {
              self.controlElAlert('获取数据失败', 'error');
            }
          })
        this.dialogVisible = false;
        this.goodsNameNew = '';
        this.goodsBrandId = '';
        this.provider = '';
        this.statusnew = '';
        this.goodTypeId = '';
      }
    },
    watch: {
      'dialogImportGoods': function (val, oldVal) {
        if (!val) {
          this.formInline2.goodsName = ''
          this.formInline2.brandId = ''
          this.formInline2.typeId = ''
          this.formInline.typeId = ''
        }

      }
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
</style>
