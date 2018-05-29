<template>
  <div id="app" class="self-main customerAdd">
    <header class="page-header">
      <div class="header-content">
        <div class="pageTitle">
          <i class="bg-theme"></i>
          <span v-if="isview=='0'">{{addEdit}}采购订单</span>
          <span v-if="isview=='1'">采购订单详情</span>
        </div>
        <div class="refresh">
          <el-button @click.native="goBack()" class="btn-border"><i class="el-icon-arrow-left"></i> 返回</el-button>
        </div>
      </div>
    </header>
    <section class="main-right-inner">
      <div class="main-cont">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px"
                 class="demo-ruleForm cover-form-style">
          <el-row>
            <el-col>
              <el-form-item label="商品名称：" prop="goodsName">
                <el-input
                  placeholder="请选择采购商品"
                  suffix-icon="el-icon-search"
                  readonly
                  @focus="selectGoods"
                  v-model="ruleForm.goodsName">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-if="isview=='0'">
              <el-form-item class="control-primary">
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              </el-form-item>
            </el-col>
          </el-row>


        </el-form>
      </div>
    </section>
    <el-alert class="topAlert"
              v-if="elAlertShow"
              :title="elAlertTitle"
              :type="elAlertType"
              :closable="false"
              show-icon>
    </el-alert>
    选择商品
    <el-dialog title="选择商品" :visible.sync="dialogImportGoods" size="large" custom-class="productDialog"
               :modal-append-to-body="false" class="dialogTitle">
      <div class="el-table-diy filterQuery">
        <el-row class="table-header">
          <el-col :span="21" class="header-title">
            <i class="el-icon-search"></i>
            筛选查询
          </el-col>
          <el-col :span="3" class="text-r">
            <el-button type="primary" class="btn-normal self-btn-blue" @click="getDataDialog()">查询结果
            </el-button>
          </el-col>
        </el-row>
        <el-row class="table-content collapse-el text-l p-l-20">
          <el-form :inline="true" :model="formInline2" class="demo-form-inline" style="margin-top: 20px">
            <el-form-item label="输入搜索">
              <el-input v-model="formInline2.goodsName" placeholder="商品名称"
                        style="width: 198px" size="small"></el-input>
            </el-form-item>
            <el-form-item label="商品品牌">
              <el-select filterable v-model="formInline2.brandId" placeholder="全部"
                         @change="getDataDialog()" size="small">
                <el-option label="全部" value="全部"></el-option>
                <el-option
                  v-for="item in brandArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="品类：">
              <el-select class="self-select" filterable v-model="formInline2.typeId"
                         placeholder="全部" size="small"
                         @change="getDataDialog()">
                <el-option label="全部" value="全部"></el-option>
                <el-option
                  v-for="item in goodsTypeArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-row>
      </div>
      <div class="el-table-diy box-content">
        <el-row class="table-header">
          <el-col :span="8" class="header-title">
            <i class="eliconfont elicon-list"></i>
            数据列表
          </el-col>
        </el-row>
        <el-row>
          <el-table
            :data="dialogTableData"
            border
            style="width: 100%"
            highlight-current-row
            @current-change="handleCurrentChange"
            ref="goodsTable"
          >
            <el-table-column
              label="序号"
              width="120">
              <template slot-scope="scope">
                <span class="text-grey"> {{ scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="商品主图"
              width="120">
              <template slot-scope="scope">
                <img v-if="scope.row.pictureUrl"
                     height="50"
                     width="50"
                     :src="'http://192.168.30.47:8087'+scope.row.pictureUrl+'?x-oss-process=image/resize,m_fill,h_50,w_50'"
                     alt="logo">
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="商品名称"
              min-width="120">
              <template slot-scope="scope">
                <span class="text-grey"> {{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="brandName"
              label="品牌"
              width="100">
              <template slot-scope="scope">
                <span class="text-grey"> {{ scope.row.brandName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="typeName"
              label="品类"
              width="120">
              <template slot-scope="scope">
                <span class="text-grey"> {{ scope.row.typeName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="standard"
              label="规格"
              width="100">
              <template slot-scope="scope">
                <span class="text-grey"> {{ scope.row.standard }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <div class="pageContent">
          <div></div>
          <el-pagination
            @current-change="handleCurrentChange2"
            @size-change="handleSizeChange2"
            :current-page="pageIdx2"
            :page-size="pageSize2"
            layout="total, prev, pager, next,jumper"
            :total="totalPage2">
          </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import api from '@/fetch/api'
  import tools from '@/fetch/tools'
  import http from '@/fetch/http'

  export default {
    components: {},
    data() {
      var checkName = (rule, value, callback) => {
        var self = this;
        if (!value) {
          return callback(new Error('采购订单名称不能为空'));
        }
        if (!(/^[\u4E00-\u9FA5A-Za-z0-9_]{2,50}$/.test(value))) {
          callback(new Error('请输入2~50个字符，可以是汉字、字母、数字和下划线'));
        } else {
          callback();
        }
      };

      return {
        isview: this.$route.query.isview,
        addEdit: '',
        orderid: this.$route.query.id,
        headers: {
          token: localStorage.token
        },//token
        ruleForm: {
          goodsId: '',
          goodsName: '',

        },
        formInline2: {
          goodsName: '',
          typeId: '',
          brandId: ''
        },
        editData: '',
        dialogTableData: [],//商品选择框数据
        brandArr: [], // 商品品牌下拉框
        goodsTypeArr: [], // 商品品类下拉框
        pageIdx2: 1,//当前页
        pageSize2: 20,
        totalPage2: 0,//总条数
        currentRow: '',
        rules: {
          name: [
            {validator: checkName, trigger: 'blur', required: true}
          ]
        },

        dialogFormVisible: false,//提醒框
        elAlertShow: false,//提示框是否可显示
        elAlertTitle: 'fqwefq',//提示框文字
        elAlertType: 'success',//提示框类型
        dialogImportGoods: false,//导入商品

      }
    },
    mounted() {
      if (this.$route.query.id != null) {
        this.getSupplierInfo();
        this.addEdit = '编辑';
      } else {
        this.addEdit = '添加';
      }
    },
    methods: {
      submitForm(formName) {
        var self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.$route.query.id != null) {
              self.updateData();
            } else {
              self.submitData();
            }
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      submitData() {//提交数据
        var self = this;
        let params = {
          name: self.ruleForm.name,
          linkman: self.ruleForm.linkman,
          mobile: self.ruleForm.mobile,
          address: self.ruleForm.address,
          desc: self.ruleForm.descs,
        }
        params = tools.fifterNull(params);
        http.axiosPost(api.supplier.addSupplier, params,
          response => {
            if (response.data.rc === 200) {
              self.controlElAlert('操作成功', 'success');
              self.$router.back();
            } else {
              self.controlElAlert(response.data.des, 'warning');
            }
          })
      },
      updateData() { //提交编辑数据
        var self = this;
        let params = {
          id: self.$route.query.id,
          name: self.ruleForm.name,
          linkman: self.ruleForm.linkman,
          mobile: self.ruleForm.mobile,
          address: self.ruleForm.address,
          desc: self.ruleForm.descs,
        }
        params = tools.fifterNull(params);
        http.axiosPost(api.supplier.modifySupplier, params,
          response => {
            if (response.data.rc === 200) {
              self.controlElAlert('操作成功', 'success');
              self.$router.back();
            } else {
              if (response.data.des == '') {
                self.controlElAlert('操作失败，请重新提交', 'warning');
              } else {
                self.controlElAlert(response.data.des, 'warning');
              }
            }
          })
      },
      getSupplierInfo() {//根据id获取采购订单数据
        var self = this;
        var params = {
          id: self.$route.query.id
        }
        http.axiosGet(api.supplier.getById, params,
          response => {
            if (response.data.rc === 200) {
              var resData = response.data.data;
              self.ruleForm.name = resData.name;
              self.ruleForm.linkman = resData.code;
              self.ruleForm.mobile = resData.mobile;
              self.ruleForm.descs = resData.descs;
              self.ruleForm.address = resData.address;
              self.editData = resData;
            } else {
              self.controlElAlert('请求数据失败，刷新重试', 'warning');
            }
          });
      },
      selectGoods() {//选择商品
        console.log("点击了我！")
        this.dialogImportGoods = true;
        this.formInline2.typeId = '';
        this.getDataDialog();
      },
       getDataDialog() {//获取导入商品
        var self = this
        let params = {
          page: this.pageIdx2,
          limit: this.pageSize2,
          goodsName: this.formInline2.goodsName,
          typeId: this.formInline2.typeId === '全部' ? '' : this.formInline2.typeId, // 品类
          brandId: this.formInline2.brandId === '全部' ? '' : this.formInline2.brandId, // 品牌
        }
        http.axiosGet(api.goods.getGoodsListByPage, params,
          response => {
            self.loading = false
            localStorage.removeItem('pageParam')
            if (response.data.rc === 200) {
              self.dialogTableData = response.data.data.list
              self.totalPage2 = response.data.data.total
            } else {
              self.controlElAlert('获取数据失败', 'error')
            }
          })
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
      goBack() {
        this.$router.back();
      },
      handleCurrentChange(val) {
        var self = this;
        console.log('商品id：'+val.id+'   商品名称：'+val.name)
        self.ruleForm.goodsId = val.id;
        self.ruleForm.goodsName = val.name;
        self.dialogImportGoods = false;
      },
      handleCurrentChange2(val) {
        this.loading = true;
        this.pageIdx2 = val;
        this.getDataDialog();
      },
      handleSizeChange2(val) {
        this.loading = true;
        this.pageSize2 = val;
        this.getDataDialog();
      },
      outputObj(obj) {
        var description = "";
        for (var i in obj) {
          description += i + " = " + obj[i] + "\n";
        }
        return description
      }
    },
    watch: {
      'dialogImportGoods': function (val, oldVal) {
        if (!val) {
          this.formInline2.goodsName = ''
          this.formInline2.brandId = ''
          this.formInline2.typeId = ''
        }

      }
    }
  }
</script>

<style lang="less">
  @header-bc-color: #f2f2f2;
  @formtop-bc-color: #f3f3f3;
  @formele-bc-color: #f7f8fc;

  @text-one-color: #666666;
  @text-two-color: #999999;
  @text-prompt-color: #cccccc;
  @border-color-grey: #E4E4E4;

  .customerAdd {
    header {
      background: @header-bc-color;
      display: flex;
      align-items: center;
      border-bottom: 1px solid @border-color-grey;
      .pageTitle {
        height: 49px;
        line-height: 49px;
        color: @text-two-color;
        font-size: 14px;
        display: flex;
        align-items: center;
        flex: 1;
        i {
          display: block;
          height: 1.2rem;
          width: 3px;
          margin-right: 0.2rem;
        }
      }
      .refresh {
        width: 5rem;
        .el-button {
          color: @text-two-color;
        }
      }
    }
    .main-right-inner {
      margin: 22px auto;
      border: 1px solid @border-color-grey;
      .top {
        height: 44px;
        line-height: 44px;
        text-align: left;
        background: @formtop-bc-color;
        color: @text-one-color;
        font-size: 14px;
        padding-left: 20px;
      }
      .main-cont {
        padding: 50px 0px;
        margin: 0 auto;
        background: #ffffff;
      }
      .main-cont form {
        width: 540px;
        margin: 0 auto;
        .setPosition-customerAdd {
          margin-left: -360px;
        }
      }
      .upload-demo {
        text-align: left;
      }
      .self-upload-album .self-upload-album {
        padding: 10px 15px;
        border-radius: 4px;
      }
    }

    .cover-form-style {
      .el-input__inner, .el-textarea__inner {
        background-color: @formele-bc-color;
      }
      .el-input {
        width: 228px;
        float: left;
      }
      .el-textarea {
        width: 428px;
        float: left;
      }
      .el-date-editor.el-input {
        width: 228px;
      }
      .selft-select-width {
        width: 228px;
      }
      .el-upload__tip {
        color: @text-two-color;
      }
      .el-form-item__label {
        font-size: 12px;
        color: @text-one-color;
      }
      .el-input__inner {
        color: @text-one-color;
      }
      ::-webkit-input-placeholder { /* WebKit browsers */
        color: @text-prompt-color !important;
      }
      :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: @text-prompt-color !important;
      }
      ::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: @text-prompt-color !important;
      }
      :-ms-input-placeholder { /* Internet Explorer 10+ */
        color: @text-prompt-color !important;
      }

    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #20a0ff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .control-primary .el-form-item__content {
      text-align: left;
    }
    .align-left {
      text-align: left;
    }
    .remindForm {
      text-align: left;
      .el-input {
        width: 50%;
      }
    }
    .mapDialog-mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2500;
      background: rgba(0, 0, 0, 0.3);
      .mapDialog {
        .mapDialog-top {
          text-align: right;
          color: #999;
          padding: 10px;
          cursor: pointer;
          span {
            text-align: center;
          }
        }
        width: 50%;
        min-width: 500px;
        position: absolute;
        top: 10%;
        left: 25%;
        z-index: 2501;
        padding: 0 10px 10px;
        border-radius: 3px;
        background: #fff;
      }
    }

  }

</style>
