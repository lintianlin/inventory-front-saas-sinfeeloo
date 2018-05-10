/**
 * Created by sinfeeloo on 2017/9/16 0016.
 * 工具类
 */

export default {
    fifterNull(param) {//
        var newParam = {}
        $.each(param, function (name, value) {
            /*	newParam[name]=value ? value : '';*/
            newParam[name] = (value == null || value == undefined) ? '' : value;
        });
        return newParam;
    },
    moneyToCny(num) {//金额转换为汉字金额
        var capUnit = ['万', '亿', '万', '圆', ''];
        var capDigit = {2: ['角', '分', ''], 4: ['仟', '佰', '拾', '']};
        var capNum = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
        if (((num.toString()).indexOf('.') > 16) || (isNaN(num)))
            return '';
        num = (Math.round(num * 100) / 100).toString();
        num = ((Math.pow(10, 19 - num.length)).toString()).substring(1) + num;
        var i, ret, j, nodeNum, k, subret, len, subChr, CurChr = [];
        for (i = 0, ret = ''; i < 5; i++, j = i * 4 + Math.floor(i / 4)) {
            nodeNum = num.substring(j, j + 4);
            for (k = 0, subret = '', len = nodeNum.length; ((k < len) && (parseInt(nodeNum.substring(k)) != 0)); k++) {
                CurChr[k % 2] = capNum[nodeNum.charAt(k)] + ((nodeNum.charAt(k) == 0) ? '' : capDigit[len][k]);
                if (!((CurChr[0] == CurChr[1]) && (CurChr[0] == capNum[0])))
                    if (!((CurChr[k % 2] == capNum[0]) && (subret == '') && (ret == '')))
                        subret += CurChr[k % 2];
            }
            subChr = subret + ((subret == '') ? '' : capUnit[i]);
            if (!((subChr == capNum[0]) && (ret == '')))
                ret += subChr;
        }
        ret = (ret == '') ? capNum[0] + capUnit[3] : ret;
        return ret;
    },
    ToMoneyregexNum(str) {//数字转换成金额模式
        var str = str.toString();
        if (str.indexOf('.') == -1) {
            console.log(str)
            str = str + '.00';
            console.log(str)
            return str

        } else {
            var newStr = str.split('.');
            var str_2 = newStr[0];

            if (newStr[1].length <= 1) {
                //小数点后只有一位时
                str_2 = str_2 + '.' + newStr[1] + '0';
                return str_2

            } else if (newStr[1].length > 1) {
                //小数点后两位以上时
                var decimals = newStr[1].substr(0, 2);
                var srt_3 = str_2 + '.' + decimals;
                return srt_3
            }
        }
    },
    getCurrentDate(type) {//获取当前时间日期
        var date = new Date();
        var yy = date.getFullYear();
        var mm = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1));
        var dd = date.getDate() > 9 ? (date.getDate()) : ('0' + date.getDate());
        var hh = date.getHours() > 9 ? (date.getDate()) : ('0' + date.getHours());
        var min = date.getMinutes() > 9 ? (date.getDate()) : ('0' + date.getMinutes());
        var ss = date.getSeconds() > 9 ? (date.getDate()) : ('0' + date.getSeconds());
        if (type == 'date') {//yy-mm-dd
            return yy + '-' + mm + '-' + dd;
        }
        if (type == 'datetime') {//yy-mm-dd
            return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss;
        }
        if (type == 'time') {//yy-mm-dd
            return hh + ':' + min + ':' + ss;
        }
        if (type == 'datemonth1') {//yy-mm-dd  当月1号
            return yy + '-' + mm + '-01';
        }
        if (type == 'date30') {//yy-mm-dd  30天前
            var day7 = new Date(date - 30 * 24 * 3600 * 1000);
            var yy7 = day7.getFullYear()
            var mm7 = day7.getMonth() + 1
            var dd7 = day7.getDate()
            return yy7 + '-' + mm7 + '-' + dd7;
        }
        if (type == 'date7') {//yy-mm-dd  7天前
            var day7 = new Date(date - 7 * 24 * 3600 * 1000);
            var yy7 = day7.getFullYear()
            var mm7 = (day7.getMonth() + 1) > 9 ? (day7.getMonth() + 1) : ('0' + (day7.getMonth() + 1))
            var dd7 = day7.getDate() > 9 ? (day7.getDate()) : ('0' + day7.getDate());
            return yy7 + '-' + mm7 + '-' + dd7;
        }
        if (type == 'date1') {//yy-mm-dd  1天前
            var day1 = new Date(date - 24 * 3600 * 1000);
            var yy7 = day1.getFullYear()
            var mm7 = (day1.getMonth() + 1) > 9 ? (day1.getMonth() + 1) : ('0' + (day1.getMonth() + 1))
            var dd7 = day1.getDate() > 9 ? (day1.getDate()) : ('0' + day1.getDate());
            return yy7 + '-' + mm7 + '-' + dd7;
        }

    },
    getWindowSize(type) {
        var w = document.documentElement.clientWidth;
        var h = document.documentElement.clientHeight;
        if (type == 'w') {
            return w
        }
        if (type == 'h') {
            return h
        }
    }

}
