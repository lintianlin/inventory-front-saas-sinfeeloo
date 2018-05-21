<template>
  <div id="app" class="self-main customerAdd">
    <header class="page-header">
      <div class="header-content">
        <div class="pageTitle">
          <i class="bg-theme"></i>{{addEdit}}商品
        </div>
        <div class="refresh">
          <el-button @click.native="goBack()" class="btn-border"><i class="el-icon-arrow-left"></i> 返回</el-button>
        </div>
      </div>
    </header>
    <section class="main-right-inner">
      <div class="top">
        <el-col :span="12">
          {{addEdit}}商品
        </el-col>
        <el-col :span="12" class="text-r p-r-10" v-if="cid">
          <el-button @click.native="dialogFormVisible=true" type="primary">设置提醒</el-button>
        </el-col>
      </div>
      <div class="main-cont">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px"
                 class="demo-ruleForm cover-form-style">
          <el-row>
            <el-col>
              <el-form-item label="商品名称：" prop="name">
                <el-input v-model="ruleForm.goodsName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="商品编码：" prop="code">
                <el-input v-model="ruleForm.goodsCode"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="商品类别：" prop="typeid">
                <el-select filterable v-model="ruleForm.typeId" placeholder="全部" class="selft-select-width"
                           style="display: block">
                  <el-option
                    v-for="item in goodsTypeArr"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="品牌：" prop="brandid">
                <el-select filterable v-model="ruleForm.brandId" placeholder="全部" class="selft-select-width"
                           style="display: block">
                  <el-option
                    v-for="item in goodsBrandArr"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="规格：" prop="standard">
                <el-input v-model="ruleForm.standard"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="预设进价：" prop="buyprice">
                <el-input v-model="ruleForm.buyPrice"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="预设售价：" prop="saleprice">
                <el-input v-model="ruleForm.sellPrice"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="商品描述：" prop="descs">
                <el-input v-model="ruleForm.desc"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="商品图片：" prop="picture">
                <el-upload
                  class="avatar-uploader align-left"
                  :action="upFileUrl"
                  :data="upfileParam"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="ruleForm.picture" :src="ruleForm.picture" class="avatar">
                  <i class="el-icon-plus avatar-uploader-icon" v-else></i>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，文件不能超过500kb</div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
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
  </div>
</template>

<script>
  import api from '@/fetch/api'
  import tools from '@/fetch/tools'
  import http from '@/fetch/http'

  export default {
    components: {

    },
    data() {
      var checkName = (rule, value, callback) => {
        var self = this;
        if (!value) {
          return callback(new Error('商品名称不能为空'));
        }
        if (!(/^[\u4E00-\u9FA5A-Za-z0-9_]{2,50}$/.test(value))) {
          callback(new Error('请输入2~50个字符，可以是汉字、字母、数字和下划线'));
        }
      };

      var checkGoodsCode = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('商品编码不能为空'));
        }
        if (!(/^[\u4E00-\u9FA5A-Za-z0-9_()-（）]{2,50}/.test(value))) {
          callback(new Error('请输入合法的商品编码，长度为2~50个字符'));
        } else {
          callback();
        }
      };

      return {
        addEdit: '',
        cid: this.$route.query.cid,
        mapDialogIsShow: false,//地图弹框
        centerPosition: [119.117, 36.710],//打开地图中心点
        isShowSearchPositioin: true,//是否显示地图的搜索框
        upFileUrl: api.pic.uploadPhoto,//客户图片上传 URL
        upfileParam: {id: localStorage.companyID},
        ruleForm: {
          goodsName: '',
          goodsCode: '',
          typeId: 0,
          brandId: 0,
          unit: '',
          color: '',
          standard: '',
          material: '',
          buyPrice: '',
          sellPrice: '',
          desc: '',
          picture: '',
          updater: '',
        },
        editData: '',
        rules: {
          goodsName: [
            {validator: checkName, trigger: 'blur', required: true}
          ],
          goodsCode: [
            {validator: checkGoodsCode, trigger: 'change', required: true},
          ]
        },
        peopleArr: [],
        linesArr: [],
        goodsTypeArr: [],
        goodsBrandArr: [],
        dialogFormVisible: false,//提醒框
        formInline: {},
        elAlertShow: false,//提示框是否可显示
        elAlertTitle: 'fqwefq',//提示框文字
        elAlertType: 'success',//提示框类型

      }
    },
    mounted() {
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'http://webapi.amap.com/maps?v=1.4.0&key=5ed8865f5c083dad30ef1d50e7a91c86&plugin=AMap.MouseTool,AMap.PolyEditor,AMap.DistrictSearch,AMap.MarkerClusterer,AMap.Autocomplete,AMap.PlaceSearch'   // 高德地图
      document.body.appendChild(script)
      this.getSelect();//获取下拉框
      if (this.$route.query.cid != null) {
        this.getCustomerInfo();
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
            if (this.$route.query.cid != null) {
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
      handleAvatarSuccess(file) {//图片上传成功回调
        this.ruleForm.dialogImageUrl = file.result;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLtSize = file.size / 1024 / 1024 < 0.5;

        if (!isJPG && !isPNG) {
          this.$message.error('上传图片只能是 JPG/PNG 格式!');
        }
        if (!isLtSize) {
          this.$message.error('上传图片大小不能超过 500KB!');
        }
        return (isJPG || isPNG) && isLtSize;
      },
      submitData() {//提交数据
        var self = this;
        let params = {
          goodsName: self.ruleForm.goodsName,
          goodsCode: self.ruleForm.goodsCode,
          typeId: self.ruleForm.typeId,
          brandId: self.ruleForm.brandId,
          unit: self.ruleForm.unit,
          color: self.ruleForm.color,
          standard: self.ruleForm.standard,
          material: self.ruleForm.material,
          buyPrice: self.ruleForm.buyPrice,
          sellPrice: self.ruleForm.sellPrice,
          desc: self.ruleForm.desc,
          picture: self.ruleForm.picture,
          updater: localStorage.userId
        }
        params = tools.fifterNull(params);
        tools.axiosPost(api.customer.customer_save, params,
          response => {
            if (response.data.success) {
              self.controlElAlert('操作成功', 'success');
//                            self.$router.push({path: '/main/system/customer'});
              self.$router.back();
            } else {
              self.controlElAlert(response.data.error, 'warning');
            }
          })
      },
      updateData() { //提交编辑数据
        var self = this;
        let params = {
          id: self.$route.query.cid,
          goodsName: self.ruleForm.goodsName,
          goodsCode: self.ruleForm.goodsCode,
          typeId: self.ruleForm.typeId,
          brandId: self.ruleForm.brandId,
          unit: self.ruleForm.unit,
          color: self.ruleForm.color,
          standard: self.ruleForm.standard,
          material: self.ruleForm.material,
          buyPrice: self.ruleForm.buyPrice,
          sellPrice: self.ruleForm.sellPrice,
          desc: self.ruleForm.desc,
          picture: self.ruleForm.picture,
          updater: localStorage.userId
        }
        params = tools.fifterNull(params);
        tools.axiosPost(api.customer.customer_save, params,
          response => {
            if (response.data.success) {
              self.controlElAlert('操作成功', 'success');
//                            self.$router.push({path: '/main/system/customer'});
              self.$router.back();
            } else {
              self.controlElAlert('操作失败，请重新提交', 'warning');
            }
          })
      },
      getSelect() {//获取页面所需下拉框
        var self = this;
        tools.getPriceSysArr(//获取客户渠道
          response => {
            self.goodsTypeArr = response.data.result;
          }
        )
        tools.getLineArr(//获取线路
          response => {
            self.linesArr = response.data.result;
          }
        )
      },
      getCustomerInfo() {//根据id获取数据
        var self = this;
        var params = {
          id: self.$route.query.cid
        }
        tools.axiosGet(api.customer.get, params,
          response => {
            if (response.data.success) {
              var resData = response.data.result;
              self.ruleForm.goodsName = resData.name;
              self.ruleForm.goodsCode = resData.address;
              self.ruleForm.typeId = resData.latitude;
              self.ruleForm.brandId = resData.longitude;
              self.ruleForm.unit = resData.licenses;
              self.ruleForm.color = resData.pricingStructure;
              self.ruleForm.standard = resData.cosLinkman;
              self.ruleForm.material = resData.cosLinkphone;
              self.ruleForm.buyPrice = resData.visitlineId;
              self.ruleForm.sellPrice = resData.cosPhoto;//
              self.ruleForm.desc = resData.remindDate;//
              self.ruleForm.picture = resData.remindMoney;//
              self.ruleForm.remindUsable = resData.remindUsable;//
              self.ruleForm.updater = resData.province;//
              self.editData = resData;
            } else {
              self.controlElAlert('请求数据失败，刷新重试', 'warning');
            }
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
      goBack() {
//	            this.$router.go(-1);
        this.$router.back();
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
