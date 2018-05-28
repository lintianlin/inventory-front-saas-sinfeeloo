<template>
  <div id="app" class="self-main customerAdd">
    <header class="page-header">
      <div class="header-content">
        <div class="pageTitle">
          <i class="bg-theme"></i>
          <span v-if="isview=='0'">{{addEdit}}员工</span>
          <span v-if="isview=='1'">员工详情</span>
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
              <el-form-item label="姓名：" prop="name">
                <el-input v-model="ruleForm.name" :readonly="isview=='1'"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="工号：" prop="code">
                <el-input v-model="ruleForm.code" :readonly="isview=='1'"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="身份证号：" prop="idCard">
                <el-input v-model="ruleForm.idCard" :readonly="isview=='1'"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="手机号：" prop="mobile">
                <el-input v-model="ruleForm.mobile" :readonly="isview=='1'"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="性别：" prop="sex">
                <el-select v-model="ruleForm.sex" placeholder="全部" :disabled="isview=='1'" class="selft-select-width" style="display: block">
                  <el-option value="1" label="男"></el-option>
                  <el-option value="2" label="女"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="出生日期" prop="birthday">
                <el-col >
                  <el-date-picker  type="date" placeholder="请选择日期" :disabled="isview=='1'" v-model="ruleForm.birthday" @change="changeDateBir"></el-date-picker>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="地址：" prop="address">
                <el-input v-model="ruleForm.address" :readonly="isview=='1'" placeholder="点击右侧按钮选择地址"></el-input>
                <el-tooltip class="item" effect="dark" content="点击打开地图选择地址" placement="right-start">
                  <el-button type="primary" class="setPosition-customerAdd" :disabled ="isview=='1'" @click="mapDialogIsShow=!mapDialogIsShow"><i
                    class="eliconfont elicon-position"></i></el-button>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="邮箱：" prop="email">
                <el-input v-model="ruleForm.email" :readonly="isview=='1'"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="职位类型：" prop="type" >
                <el-select filterable v-model="ruleForm.type" placeholder="无" class="selft-select-width" :disabled="isview=='1'" style="display: block">
                  <el-option
                    v-for="item in roleTypeArr"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
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
    <div class="mapDialog-mask" v-if="mapDialogIsShow" @click="mapDialogIsShow=!mapDialogIsShow">
      <div class="mapDialog" @click="mapDialogIsShow=!mapDialogIsShow">
        <div class="mapDialog-top"><i class="el-icon-close" @click="mapDialogIsShow=!mapDialogIsShow"></i></div>
        <amap class="smallAmap"
              :centerPos="centerPosition"
              :latitudePos="ruleForm.latitude"
              :longitudePos="ruleForm.longitude"
              :isShowSearchPositioin="isShowSearchPositioin"
              v-on:laglatChange="getLaglat"
              v-on:addressChange="getAddress"
              v-on:regionDivide="getRegion"></amap>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '@/fetch/api'
  import tools from '@/fetch/tools'
  import http from '@/fetch/http'
  import gdmap from '@/components/map/mapAdd.vue'

  export default {
    components: {
      'amap': gdmap
    },
    data() {
      var checkName = (rule, value, callback) => {
        var self = this;
        if (!value) {
          return callback(new Error('员工名称不能为空'));
        }
        if (!(/^[\u4E00-\u9FA5A-Za-z0-9_]{2,50}$/.test(value))) {
          callback(new Error('请输入2~50个字符，可以是汉字、字母、数字和下划线'));
        } else {
          callback();
        }
      };

      var checkCode = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('员工编码不能为空'));
        }
        if (!(/^[\u4E00-\u9FA5A-Za-z0-9_()-（）]{2,50}/.test(value))) {
          callback(new Error('请输入合法的员工编码，长度为2~50个字符'));
        } else {
          callback();
        }
      };

      return {
        isview: this.$route.query.isview,
        addEdit: '',
        employeeid: this.$route.query.employeeid,
        mapDialogIsShow: false,//地图弹框
        centerPosition: [119.117, 36.710],//打开地图中心点
        isShowSearchPositioin: true,//是否显示地图的搜索框
        upFileUrl: api.pic.uploadPhoto,//客户图片上传 URL
        headers: {
          token: localStorage.token
        },//token
        upfileParam: {},
        ruleForm: {
          name: '',
          code: '',
          idCard: '',
          sex: '',
          birthday: '',
          address: '',
          type: '',
          latitude: 0,
          longitude: 0,
          province: '',//省
          city: '',//市
          district: '',//区
          street: '',//街道
        },
        editData: '',
        roleTypeArr: [],
        rules: {
          name: [
            {validator: checkName, trigger: 'blur', required: true}
          ],
          code: [
            {validator: checkCode, trigger: 'change', required: true},
          ]
        },
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
      script.src = 'http://webapi.amap.com/maps?v=1.4.0&key=3ae9a5dc95e990f4a3508b56639cfab4&plugin=AMap.MouseTool,AMap.PolyEditor,AMap.DistrictSearch,AMap.MarkerClusterer,AMap.Autocomplete,AMap.PlaceSearch'   // 高德地图
      document.body.appendChild(script)
      if (this.$route.query.employeeid != null) {
        this.getEmployeeInfo();
        this.addEdit = '编辑';
      } else {
        this.addEdit = '添加';
      }
      this.getTypeSelect()
    },
    methods: {
      getLaglat(laglat) {//地图获取经纬度
        this.ruleForm.longitude = laglat.lng;
        this.ruleForm.latitude = laglat.lat;
      },
      getAddress(address) {//地图获取地址
        this.ruleForm.address = address;
      },
      getRegion(address) {//地图获取区域划分
        if (address) {
          this.ruleForm.province = address.province;
          this.ruleForm.city = address.city;
          this.ruleForm.district = address.district;
          this.ruleForm.street = address.township;
        }
      },
      getTypeSelect() {//获取职位类型
        var self = this;
        http.getEmployeeType(
          response => {
            if (response.data.rc === 200) {
              self.roleTypeArr = response.data.data.list
            }
          })
      },
      changeDateBir(date){//日期框更改值--生日
        this.ruleForm.birthday=date;
      },
      submitForm(formName) {
        var self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.$route.query.employeeid != null) {
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
          name: self.ruleForm.name,
          code: self.ruleForm.code,
          idCard: self.ruleForm.idCard,
          mobile: self.ruleForm.mobile,
          sex: self.ruleForm.sex,
          birthday: self.ruleForm.birthday,
          address: self.ruleForm.address,
          email: self.ruleForm.email,
          roleType: self.ruleForm.type,
        }
        params = tools.fifterNull(params);
        http.axiosPost(api.employee.addEmployee, params,
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
          id: self.$route.query.employeeid,
          name: self.ruleForm.name,
          code: self.ruleForm.code,
          idCard: self.ruleForm.idCard,
          mobile: self.ruleForm.mobile,
          sex: self.ruleForm.sex,
          birthday: self.ruleForm.birthday,
          address: self.ruleForm.address,
          email: self.ruleForm.email,
          roleType: self.ruleForm.type,
        }
        params = tools.fifterNull(params);
        http.axiosPost(api.employee.modifyEmployee, params,
          response => {
            if (response.data.rc === 200) {
              self.controlElAlert('操作成功', 'success');
              self.$router.back();
            } else {
              if(response.data.des==''){
                self.controlElAlert('操作失败，请重新提交', 'warning');
              }else{
                self.controlElAlert(response.data.des, 'warning');
              }
            }
          })
      },
      getEmployeeInfo() {//根据id获取员工数据
        var self = this;
        var params = {
          id: self.$route.query.employeeid
        }
        http.axiosGet(api.employee.getEmployeeDetail, params,
          response => {
            if (response.data.rc === 200) {
              var resData = response.data.data;
              self.ruleForm.name = resData.name;
              self.ruleForm.code = resData.code;
              self.ruleForm.idCard = resData.idcard;
              self.ruleForm.mobile = resData.mobile;
              self.ruleForm.sex = resData.sexStr;
              self.ruleForm.birthday = resData.birthdayStr;
              self.ruleForm.address = resData.address;
              self.ruleForm.email = resData.email;
              self.ruleForm.type = resData.type;
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
