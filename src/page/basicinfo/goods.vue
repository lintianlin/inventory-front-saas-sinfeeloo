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
                <el-button type="primary" class="btn-normal self-btn-blue" @click="formAdd()">
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
                    min-width="80">
                    <template slot-scope="scope">
                      <img v-if="scope.row.pictureUrl"
                           height="70"
                           width="70"
                           :src="'http://192.168.30.47:8087'+scope.row.pictureUrl+'?x-oss-process=image/resize,m_fill,h_50,w_50'"
                           @click="showPhoto(scope.row.pictureUrl)"
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
                    width="60"
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
                    min-width="60"
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
                    min-width="80">
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
                    min-width="80">
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
                    min-width="80">
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
                    min-width="80"
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
                    min-width="80"
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
                    min-width="120"
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
                  width="150">
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
      <el-dialog title="图片预览" :visible.sync="dialogFormVisible" size="small">
        <div style="overflow: auto">
          <img :src="showUrl" alt="">
        </div>
      </el-dialog>
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

  export default {
    components: {},
    data() {
      return {
        typeArr: [], // 商品类型下拉框
        tableData: [],
        valuePage: '', // 显示条数model
        valueSort: '', // 排序方式model
        pageIdx: 1, // 当前页
        pageSize: 20,
        totalPage: 0, // 总条数
        pageIdx2: 1, // 当前页
        pageSize2: 20,
        totalPage2: 0, // 总条数
        brandArr: [], // 商品品牌下拉框
        goodsTypeArr: [], // 商品品类下拉框
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
        multipleSelection: [], // 选中的值
        optionsLot: [ // 批量操作
          {label: '商品上架', value: '1'},
          {label: '商品下架', value: '2'}
        ],
        valueLot: '', // 批量操作
        elAlertShow: false, // 提示框是否可显示
        elAlertTitle: 'fqwefq', // 提示框文字
        elAlertType: 'success', // 提示框类型
        packupSearch: false, // 筛选区域是否展开，true是收起，false是展开
        loading: false, // 正在加载提示
        hasClick: false, // 重复提交增加点击校验标记
        dialogVisible: false, // 高级检索显示框
        dialogVisible2: false, // 表头设置
        dialogTitle: '高级检索',
        dialogImportGoods: false, // 导入商品
        dialogFormVisible: false,//查看图片
        showUrl: '',
        ruleForm: {
          name: '',
          description: ''
        },
        dialogForm: { // 选择导入商品
          selectDate: '',
          selectDateStart: '',
          selectDateEnd: '',
          supplier: '',
          state: ''
        },
        rules: {},
        sels: [],
        status: '',
        premiss: { // 页面显示权限
          addHas: false,
          editHas: false,
          detailHas: false,
          exportHas: false,
          enableHas: false
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
          col9: true
        },
        testCol: [{name: 'goodsPic'}, {name: 'goodsName'}, {name: 'goodsCode'}, {name: 'goodsType'}, {name: 'goodsBrand'}, {name: 'goodsStandard'}, {name: 'goodsBuyPrice'}, {name: 'goodsSalesPrice'}, {name: 'goodsDesc'}],
      }
    },
    created() {
      this.getParamsLocalStorage()
    },
    mounted() {
      this.getData()
      this.getSelectValue()
      var sh = tools.getWindowSize('h') - 468
      $(".box-content .el-table").css({'min-height': sh + 'px'})
    },
    methods: {
      showMessage() {
        this.controlElAlert('商品信息不完善，无法启用', 'error')
      },
      getSelectValue() { //
        var self = this;
        http.getGoodsType(//获取品类
          response => {
            self.goodsTypeArr = response.data.data.list
          }
        );
        http.getBrand(//获取品牌
          response => {
            self.brandArr = response.data.data.list
          }
        )
      },
      getData() { // 获取列表数据
        var self = this
        let params = {
          page: this.pageIdx,
          limit: this.pageSize,
          goodsName: this.formInline.goodsName,
          goodsCode: this.formInline.goodsCode, // 商品编码
          typeId: this.formInline.typeId === '全部' ? '' : this.formInline.typeId, // 品类
          brandId: this.formInline.brandId === '全部' ? '' : this.formInline.brandId, // 品牌
          standard: this.formInline.standard, // 规格
          material: this.formInline.material // 材质
        }
        http.axiosGet(api.goods.getGoodsListByPage, params,
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

      handleSelectionChange(val) { // 获取选中的
        this.multipleSelection = val
      },
      formAdd() {
        this.setParamsLocalStorage()
        this.$router.push({path: '/basicinfo/addGoods?isview=0'})
      },
      formSearch() { // 高级检索
        this.dialogVisible = true
      },
      formView(id) {
        this.setParamsLocalStorage()
        this.$router.push({path: '/basicinfo/addGoods?goodsid=' + id + '&isview=1'})
      },
      formEdit(id) {
        this.setParamsLocalStorage()
        this.$router.push({path: '/basicinfo/addGoods?goodsid=' + id + '&isview=0'})
      },
      formDelete(id) {//删除
        var self = this;
        let params = {
          id: id,
        }
        this.showCancelMessage(
          () => {
            http.axiosPost(api.goods.deleteGoods, params,
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
          pageName: 'goodsList',
          page: this.pageIdx,
          limit: this.pageSize,
          goodsName: this.formInline.goodsName,
          goodsCode: this.formInline.goodsCode, // 商品编码
          goodsType: this.formInline.goodsType, // 品类
          brand: this.formInline.brand === '全部' ? '' : this.formInline.brand, // 品牌
          color: this.formInline.color, // 颜色
          standard: this.formInline.standard, // 规格
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
      showPhoto(url) {
        this.dialogFormVisible = true;
        this.showUrl = 'http://192.168.30.47:8087' + url + '?x-oss-process=image/resize,m_fill,h_50,w_50'
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
