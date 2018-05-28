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
                  <el-form-item label="参数名称：">
                    <el-input v-model="formInline.name" placeholder="输入参数名称"
                              size="small"></el-input>
                  </el-form-item>

                  <el-form-item label="参数类型：">
                    <el-select class="self-select" filterable v-model="formInline.parentId"
                               placeholder="全部" size="small"
                               @change="getData()">
                      <el-option label="全部" value="全部"></el-option>
                      <el-option
                        v-for="item in paramTypeArr"
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
                  prop="name"
                  label="参数名称"
                  min-width="80"
                >
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.name }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="descs"
                  label="描述"
                  min-width="120">
                  <template slot-scope="scope">
                    <span class="text-grey"> {{ scope.row.descs }}</span>
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

        paramTypeArr: [], // 商品品类下拉框
        formInline: {
          name: '',
          parentId: ''
        },
        elAlertShow: false, // 提示框是否可显示
        elAlertTitle: 'fqwefq', // 提示框文字
        elAlertType: 'success', // 提示框类型
        loading: false, // 正在加载提示
        hasClick: false, // 重复提交增加点击校验标记
        dialogVisible: false, // 高级检索显示框
        dialogVisible2: false, // 表头设置
        ruleForm: {
          name: '',
          parentId: ''
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
      getData() { // 获取列表数据
        var self = this
        let params = {
          page: this.pageIdx,
          limit: this.pageSize,
          name: this.formInline.name,
          parentId: this.formInline.parentId === '全部' ? '' : this.formInline.parentId
        }
        http.axiosGet(api.param.getParamListByPage, params,
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
      getSelectValue() { //
        var self = this;
        http.getParamType(//获取参数
          response => {
            self.paramTypeArr = response.data.data
          }
        )
      },
      formAdd() {
        this.setParamsLocalStorage()
        this.$router.push({path: '/basicinfo/addParam?isview=0'})
      },
      formView(id) {
        this.setParamsLocalStorage()
        this.$router.push({path: '/basicinfo/addParam?paramid=' + id + '&isview=1'})
      },
      formEdit(id) {
        this.setParamsLocalStorage()
        this.$router.push({path: '/basicinfo/addParam?paramid=' + id + '&isview=0'})
      },
      formDelete(id) {//删除
        var self = this;
        let params = {
          id: id,
        }
        this.showCancelMessage(
          () => {
            http.axiosPost(api.param.deleteParam, params,
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
          pageName: 'paramList',
          page: this.pageIdx,
          limit: this.pageSize,
          name: this.formInline.name,
          parentId: this.formInline.parentId === '全部' ? '' : this.formInline.parentId
        }
        localStorage.pageParam = JSON.stringify(pageParam);
      },
      getParamsLocalStorage() {//读取缓存查询条件
        var pageParam = localStorage.pageParam;
        if (pageParam) {
          pageParam = eval("(" + pageParam + ")");
          if (pageParam.pageName == 'paramList') {
            this.pageIdx = pageParam.page;
            this.pageSize = pageParam.limit;
            this.formInline.name = pageParam.name;
            this.formInline.parentId = pageParam.parentId;
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
        this.formInline.name = '';
        this.formInline.parentId = '';
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

