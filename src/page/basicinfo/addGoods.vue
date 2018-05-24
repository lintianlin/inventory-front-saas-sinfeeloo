<template>
  <div id="app" class="self-main customerAdd">
    <header class="page-header">
      <div class="header-content">
        <div class="pageTitle">
          <i class="bg-theme"></i>
          <span v-if="isview=='0'">{{addEdit}}商品</span>
          <span v-if="isview=='1'">商品详情</span>
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
              <el-form-item label="商品名称：" prop="name">
                <el-input v-model="ruleForm.goodsName" :readonly="isview=='1'"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="商品编码：" prop="code">
                <el-input v-model="ruleForm.goodsCode" :readonly="isview=='1'"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="商品类别：" prop="typeid">
                <el-select filterable v-model="ruleForm.typeId" placeholder="全部" :disabled="isview=='1'" class="selft-select-width"
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
                <el-select filterable v-model="ruleForm.brandId" placeholder="全部" :disabled="isview=='1'" class="selft-select-width"
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
                <el-input v-model="ruleForm.standard" :readonly="isview=='1'"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="预设进价：" prop="buyprice">
                <el-input v-model="ruleForm.buyPrice" :readonly="isview=='1'"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="预设售价：" prop="saleprice">
                <el-input v-model="ruleForm.sellPrice" :readonly="isview=='1'"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="商品描述：" prop="descs">
                <el-input v-model="ruleForm.desc" :readonly="isview=='1'"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="商品图片：" prop="picture">
                <el-upload
                  class="avatar-uploader align-left"
                  :headers="headers"
                  :action="upFileUrl"
                  :data="upfileParam"
                  :disabled="isview=='1'"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="ruleForm.picture" :src="'http://192.168.30.47:8087'+ruleForm.picture" class="avatar">
                  <i class="el-icon-plus avatar-uploader-icon" v-else></i>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，文件不能超过500kb</div>
                </el-upload>
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
        isview: this.$route.query.isview,
        addEdit: '',
        cid: this.$route.query.cid,
        mapDialogIsShow: false,//地图弹框
        isShowSearchPositioin: true,//是否显示地图的搜索框
        upFileUrl: api.pic.uploadPhoto,//客户图片上传 URL
        headers: {
          token: localStorage.token
        },//token
        upfileParam: {},
        ruleForm: {
          goodsName: '',
          goodsCode: '',
          typeId: '',
          brandId: '',
          unit: '',
          color: '',
          standard: '',
          material: '',
          buyPrice: '',
          sellPrice: '',
          desc: '',
          picture: '',
          pictureId: 0,
          updater: ''
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
      document.body.appendChild(script)
      this.getSelect();//获取下拉框
      if (this.$route.query.goodsid != null) {
        this.getGoodsInfo();
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
            if (this.$route.query.goodsid != null) {
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
      handleAvatarSuccess(res, file) {//图片上传成功回调
        console.log("@@@" + this.outputObj(file))
        console.log("@@@" + this.outputObj(res))
        this.ruleForm.picture = res.data.filePath;
        this.ruleForm.pictureId = res.data.id;
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
          picture: self.ruleForm.pictureId,
          updater: localStorage.userId
        }
        params = tools.fifterNull(params);
        http.axiosPost(api.goods.addGoods, params,
          response => {
            if (response.data.rc === 200) {
              self.controlElAlert('操作成功', 'success');
              self.$router.back();
            } else {
              self.controlElAlert(response.data.error, 'warning');
            }
          })
      },
      updateData() { //提交编辑数据
        var self = this;
        let params = {
          id: self.$route.query.goodsid,
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
          picture: self.ruleForm.pictureId,
          updater: localStorage.userId
        }
        params = tools.fifterNull(params);
        http.axiosPost(api.goods.modifyGoods, params,
          response => {
            if (response.data.rc === 200) {
              self.controlElAlert('操作成功', 'success');
              self.$router.back();
            } else {
              self.controlElAlert('操作失败，请重新提交', 'warning');
            }
          })
      },
      getSelect() {//获取页面所需下拉框
        var self = this;
        http.getGoodsType(//获取品类
          response => {
            self.goodsTypeArr = response.data.data.list;
          }
        )
        http.getBrand(//获取品牌
          response => {
            self.goodsBrandArr = response.data.data.list;
          }
        )
      },
      getGoodsInfo() {//根据id获取商品数据
        var self = this;
        var params = {
          id: self.$route.query.goodsid
        }
        http.axiosGet(api.goods.getGoodsDetail, params,
          response => {
            if (response.data.rc === 200) {
              var resData = response.data.data;
              self.ruleForm.goodsName = resData.name;
              self.ruleForm.goodsCode = resData.code;
              self.ruleForm.typeId = resData.typeid;
              self.ruleForm.brandId = resData.brandid;
              self.ruleForm.unit = resData.unit;
              self.ruleForm.color = resData.color;
              self.ruleForm.standard = resData.standard;
              self.ruleForm.material = resData.material;
              self.ruleForm.buyPrice = resData.buyprice;
              self.ruleForm.sellPrice = resData.saleprice;//
              self.ruleForm.desc = resData.descs;//
              self.ruleForm.picture = resData.pictureUrl;
              / /
              self.ruleForm.pictureId = resData.picture;
              / /
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
        this.$router.back();
      },
      outputObj(obj) {
        var description = "";
        for (var i in obj) {
          description += i + " = " + obj[i] + "\n";
        }
        return description
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
