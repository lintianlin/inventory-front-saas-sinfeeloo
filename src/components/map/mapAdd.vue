<template>
    <div id="mapBox" >
        <div id="mapContainer" :class="{mapnormal:!TableEditData,mapbig:TableEditData}"></div>
        <div id="positionSearchBox" v-if="isShowSearchPositioin">
            <input type="text" placeholder="请输入关键词搜索" id="searchText">
        </div>
        <div id="pickerBox" v-if="TableEditData">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="formInline.name" placeholder="请输入门店名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="formInline.type" placeholder="选择客户渠道" @change="">
                        <el-option value="全部" label="全部"></el-option>
                        <el-option
                            v-for="item in customerArr"
                            :key="item.id"
                            :label="item.priceSysName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button class="btn-border" type="primary" @click.native="getData">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="searchBox" v-if="TableEditData">
            <el-row class="table-header">
                <el-col :span="21" class="header-title">
                    搜索结果
                </el-col>
                <el-col :span="3" class="packBtn" @click.native="packUp=!packUp">
                    {{packUp ? '展开':'收起'}}
                </el-col>

            </el-row>
        </div>
    </div>
</template>

<style lang="less">
    #mapBox{
        position: relative;
        #mapContainer {

            width:100%;
            overflow: hidden;
            position: relative;
            z-index: 990;
            &.mapbig{
                height: 700px;
            }
            &.mapnormal{
                height: 500px;
            }
        }
        #pickerBox{
            position: absolute;
            z-index: 991;
            top: 15px;
            left: 0px;
            width: 550px;
            .el-input__inner{
                box-shadow: 3px 3px 5px 1px rgba(0,0,0,0.4);
            }
            .el-button{
                box-shadow: 3px 3px 5px 1px rgba(0,0,0,0.4);
            }
            .btn-border{
                border:none;
            }
        }
        #positionSearchBox{
            position: absolute;
            z-index: 992;
            top: 15px;
            right: 20px;
            width: 260px;
            height:50px;
            input{
                width:200px;
                height:30px;
                line-height: 30px;
                border:solid 1px #e4e4e4;
                box-shadow: 3px 3px 5px 1px rgba(0,0,0,0.4);
            }
        }
        .searchBox{
            position: absolute;
            z-index: 991;
            top: 65px;
            left: 20px;
            width: 425px;
            max-height: 600px;
            overflow-y: auto;
            background: #fff;
            box-shadow: 3px 3px 5px 1px rgba(0,0,0,0.4);
            .packBtn{
                cursor:pointer;
            }
            .searchResult{
                margin-top: 1px;
                transform:translateY(-1px)
            }
        }
        .info {
            border: solid 1px silver;
            width:340px;
            overflow: hidden;
        }
        div.info-top {
            position: relative;
            background: none repeat scroll 0 0 #F9F9F9;
            border-bottom: 1px solid #CCC;
            border-radius: 5px 5px 0 0;
            text-align: left;
        }
        div.info-top div {
            display: inline-block;
            color: #666666;
            font-size: 14px;
            font-weight: normal;
            line-height: 31px;
            padding: 0 10px;
            span{
                color:#999999;
            }
        }
        div.info-top img {
            position: absolute;
            top: 10px;
            right: 10px;
            transition-duration: 0.25s;
        }
        div.info-top img:hover {
            box-shadow: 0px 0px 5px #000;
        }
        div.info-middle {
            font-size: 12px;
            padding: 6px;
            line-height: 20px;
            text-align: left;
            position:relative;
            min-height: 62px;
            img{
                width:60px;
                height: 60px;
            }
            a{
                position:absolute;
                bottom:10px;
                right:5px;
                color:#00a0e9;
                cursor:pointer;
            }
        }
        .info-middle img {
            float: left;
            margin-right: 6px;
        }
        .diyMarker{
            background: url(http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png) no-repeat;
            height: 31px;
            width: 19px;
            cursor: pointer;
            left: -1px;
            text-align: center;
            color: #fff;
            font: 11px arial,simsun,sans-serif;
            padding-top: 3px;
        }
        .amap-sug-result{
            z-index:3000 !important;
        }
        .el-table th{
            background:#E4EFFF;
        }
    }
    body{
        position: relative;
    }

</style>

<script>
  export default {
        props: {
            centerPos: Array,  // 定义传值的类型---中心点坐标
            latitudePos: Number,// 定义传值的类型---定位位置
            longitudePos: Number, // 定义传值的类型---定位位置center:self.centerPos,
            TableEditData: Array,  //定义传值的类型---列表数据
            isShowSearchPositioin: Boolean,  //定义传值的类型---是否显示搜索框
            linePerson: [String, Number],  //定义传值的类型---线路负责人员
        },
        data(){
            return {
                map: {},
                mapTableData: [],
                formInline: {
                    name: '',
                    type: ''
                },
                pageIdx: 1,//当前页
                pageSize: 10,
                totalPage: 0,//总条数
                customerArr: [],
                packUp: false,//收起展开
                hasAddNum: 0,//已经添加的门店个数
                lineArr: [],//画线的点集合
                searchStore: [],//添加过的所有集合
                polyline: '',//折线
                markers: [],//marker点位
                showMarkers:[],//仅用于显示的marker
                infoWindow: new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)})//信息窗体
            }
        },
        mounted () {
            var self = this;
            if (!this.TableEditData) {
                self.initMap();
                this.setMarker();
            }
            if (this.TableEditData) {
                setTimeout(function () {

                }, 500)
                self.initMap();
            }
        },
        methods: {
            initMap(){//初始化地图
                var self = this;

                self.map = new AMap.Map('mapContainer', {
                    resizeEnable: true,
                    zoom: 12
                })
                if(self.isShowSearchPositioin){//显示搜索框时加载
                    self.loadSearch()
                }
                if (self.latitudePos && self.longitudePos) { //编辑时用定位
                    self.map.setZoomAndCenter(15, [self.longitudePos, self.latitudePos]);
                }
            },
            loadSearch(){//搜索框功能
                var self = this;
                //输入提示
                var auto = new AMap.Autocomplete({
                    input: "searchText"
                });
                var placeSearch = new AMap.PlaceSearch({
                    map: self.map
                });  //构造地点查询类
                AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
                $(".amap-sug-result").css({'z-index':'3000'})
                function select(e) {
                    placeSearch.setCity(e.poi.adcode);
                    placeSearch.search(e.poi.name);  //关键字查询查询
                    AMap.event.addListener(placeSearch, 'selectChanged', function(results) {
                        //获取当前选中的结果数据
//                        console.log(results.selected.data);
                        var selectedData=results.selected.data;
                        self.$emit('laglatChange', selectedData.location);
                        var geocoder = new AMap.Geocoder({
                            city: "010"//城市，默认：“全国”
                        });
                        geocoder.getAddress(selectedData.location, function (status, result) {//获取地址名
//                            console.log(status, result);
                            if (status == 'complete') {
                                self.$emit('addressChange', result.regeocode.formattedAddress);
                                self.$emit('regionDivide', result.regeocode.addressComponent);//区域划分
                            } else {
                                self.$emit('addressChange', '无法获取地址');
                                self.$emit('regionDivide', '');
                            }
                        })

                    });
                }
            },
            setMarker(){
                var self = this;
                var marker = new AMap.Marker({//TODO:构造点位
                    map: self.map,
                    bubble: true
                })
                AMap.plugin('AMap.Geocoder', function () {
                    var geocoder = new AMap.Geocoder({
                        city: "010"//城市，默认：“全国”
                    });
                    self.map.on('click', function (e) {//手动切换位置
                        self.$emit('laglatChange', e.lnglat);
                        marker.setPosition(e.lnglat);
                        geocoder.getAddress(e.lnglat, function (status, result) {//获取地址名
                            console.log(status, result);
                            if (status == 'complete') {
                                self.$emit('addressChange', result.regeocode.formattedAddress);
                                self.$emit('regionDivide', result.regeocode.addressComponent);//区域划分
                            } else {
                                self.$emit('addressChange', '无法获取地址');
                                self.$emit('regionDivide', '');
                            }
                        })
                    })
                });
                if (self.latitudePos && self.longitudePos) { //编辑时用定位
                    marker.setPosition([self.longitudePos, self.latitudePos]);
                }
            },
            handleCurrentChange(val){
                this.pageIdx = val;
                this.getData();
            },
            mapAdd(item, idx){
                var self = this;
                self.hasAddNum = 0;
                self.mapTableData[idx].isadd = true;
                self.lineArr = [];
                self.searchStore.push(item);
                self.searchStore.forEach(function (item) {
                    self.hasAddNum++;
                    item.addNum = self.hasAddNum;
                    self.lineArr.push([item.longitude, item.latitude])
                })
                self.mapTableData[idx].addNum = self.hasAddNum;
                self.$emit('changeData', self.searchStore);
            },
            createInfoWindow(title, content, removetext, item) {
                var self = this;
                var info = document.createElement("div");
                info.className = "info";

                //可以通过下面的方式修改自定义窗体的宽高
                //info.style.width = "400px";
                // 定义顶部标题
                var top = document.createElement("div");
                var titleD = document.createElement("div");
                var closeX = document.createElement("img");
                top.className = "info-top";
                titleD.innerHTML = title;
                closeX.src = "http://webapi.amap.com/images/close2.gif";
                closeX.onclick = this.closeInfoWindow;

                top.appendChild(titleD);
                top.appendChild(closeX);
                info.appendChild(top);

                // 定义中部内容
                var middle = document.createElement("div");
                middle.className = "info-middle";
                middle.style.backgroundColor = 'white';
                middle.innerHTML = content;

                var removeHtml = document.createElement("div")
                removeHtml.innerHTML = removetext;
                removeHtml.onclick = function () {
                    self.removePosition(item)
                };
                middle.appendChild(removeHtml)
                info.appendChild(middle);

                return info;
            },
            closeInfoWindow() {
                this.map.clearInfoWindow();
            },
            markerClick(e) {
                var item = e.target.content
                var self = this;
                var title = item.name + ' <span style="font-size:12px;margin-left:5px;">负责人：' + (item.cosLinkman == null ? '' : item.cosLinkman) + '</span>';
                var content = [];
                content.push("<img src='" + item.cosPhoto + "'>地址：" + item.address);
                content.push("电话：" + item.cosLinkphone);
                var removetext = "<a class='text-theme' id='" + item.id + "'>移出线路</a>"
                self.infoWindow = new AMap.InfoWindow({
                    isCustom: true,  //使用自定义窗体
                    content: self.createInfoWindow(title, content.join("<br/>"), removetext, item),
                    offset: new AMap.Pixel(16, -45)
                });
                self.infoWindow.open(self.map, e.target.getPosition());

            },
            removePosition(removeStr){
                console.log("fqwe4fqwe", removeStr.id)
                var self = this;
                var removeIdx = 0;
                self.searchStore.forEach(function (item, i) {
                    if (item.id == removeStr.id) {
                        removeIdx = i
                    }
                })
                self.searchStore.splice(removeIdx, 1);
                self.deleteInitTable(self.searchStore);
            },
            deleteInitTable(value){
                var self = this;
                self.searchStore = [];
                value.forEach(function (item, i) {
                    if (item.addNum) {
                        self.searchStore.push(item);
                    }
                })
                self.searchStore.forEach(function (item, i) {
                    item.addNum = i + 1;
                })

            },
            showShopPosition(item){
                var self = this;
                self.map.remove(self.showMarkers);
                var marker = new AMap.Marker({
                    map: self.map,
                    position: [item.longitude, item.latitude]
                })
                var infoWindowShow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
                marker.content = item.name;
                marker.on('click', markerClick);
                 marker.emit('click', {target: marker});
                function markerClick(e) {
                    infoWindowShow.setContent(e.target.content);
                    infoWindowShow.open(self.map, e.target.getPosition());
                }
                self.showMarkers.push(marker)
            }
        },
        watch: {
            TableEditData: {
                handler(curVal, oldVal){

                    var self = this;
                    setTimeout(function () {
                        self.searchStore = curVal;
                        self.lineArr = [];
                        self.map.remove(self.markers);
                        self.closeInfoWindow();
                        self.searchStore.forEach(function (item, i) {
                            if (item.isadd) {
                                self.lineArr.push([item.longitude, item.latitude])
                                var marker = new AMap.Marker({
                                    map: self.map,
                                    bubble: true,
//                                    icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b' + (item.addNum) + '.png',
                                    content:'<div class="diyMarker" >'+item.addNum+'</div>',
                                    position: [item.longitude, item.latitude]
                                })
                                marker.content = item;
                                marker.on('click', self.markerClick);
                                marker.emit('click', {target: marker});
                                self.markers.push(marker);
                            }
                        })
                        //function
                        self.mapTableData.forEach(function (mtabel, i) {
                            self.mapTableData[i].isadd = false;
                            self.searchStore.forEach(function (stable) {
                                if (mtabel.customerId == stable.customerId) {
                                    self.mapTableData[i].isadd = true;
                                }
                            })
                        })
                    }, 500)

                },
                deep: false
            },
            lineArr: {
                handler(curVal, oldVal){
                    var self = this;
                    self.map.remove(self.polyline);
                    self.polyline = new AMap.Polyline({
                        path: self.lineArr,          //设置线覆盖物路径
                        strokeColor: "red", //线颜色
                        strokeOpacity: 1,       //线透明度
                        strokeWeight: 5,        //线宽
                        strokeStyle: "solid",   //线样式
                        strokeDasharray: [10, 5] //补充线样式
                    });
                    self.polyline.setMap(self.map);
                },
                deep: true
            },
            linePerson:{
                handler(curVal,oldVal){
                    this.getData();
                    this.TableEditData.splice(0,this.TableEditData.length);
                    this.lineArr.splice(0,this.lineArr.length);
                },
                deep:true
            }
        },
    }
</script>
