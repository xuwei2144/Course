/**
 * Created by wangbin on 2016/11/15.
 */

$(function ($) {
    // 获取用户ID
    GetData();
    $("#imageFile").on("change", function(e){
        getFile(e);
        // var file = e.target.files[0];
        // console.log(file);
    });
    PersonalCenter_Show();
});

var UserInfo = $Course.parseJSON($.cookie("UserInfo"));
var UserID = UserInfo.UserID;
var HeaderImg = UserInfo.PhotoUrl || "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTAhA3KbPFFX6zi5VUdY6SDBXOo9y6xyDDzDuD4IMwDRVmZKap0fXUlCRQ";

function GetData() {
    UserInfo = $Course.parseJSON($.cookie("UserInfo"));
    var param = {UserID: UserInfo.UserID};
    console.log(UserInfo)
    var result = $Course.GetAjaxJson(param, ApiUrl + "User/GetUserInfoByUserID");
    //$.cookie("UserInfo", 1);
    result.Data.Ticket = UserInfo.Ticket;
    //将用户信息存入Cookie
    $.cookie("UserInfo", $Course.stringify(result.Data), {path: '/'});
    UserInfo = $Course.parseJSON($.cookie("UserInfo"));
    HeaderImg = UserInfo.PhotoUrl || "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTAhA3KbPFFX6zi5VUdY6SDBXOo9y6xyDDzDuD4IMwDRVmZKap0fXUlCRQ";
    $("#headerImg").attr("src", HeaderImg)
}

function PersonalCenter_Show() {
    var strHtml = "";
    strHtml += '<img src="../../Images/personCenter/backgroundImg.png" style="width: 100%"/>';
    strHtml += '<img src="' + HeaderImg + '" class="headerImg" id="headerImg">';
    strHtml += '<p class="name">名字</p>';
    strHtml += '<p class="integral">积分:无</p>';
    strHtml += '<img src="http://192.168.80.13:1217/Uploads/54e8537d-61df-4c75-b889-66b66c76baba.jpg" style="width: 50px;height: 50px;center">';
    $("#headerImg").html(strHtml);
}

function getFile(e) {
    var file = e.target.files[0];
    var maxSize = 200 * 1024;
    console.log(file);
    var reader = new FileReader();
    reader.onload = function () {
        var result = this.result;
        var img = new Image();
        img.src = result;

        if (result.length <= maxSize) {
            var param = {
                base64Str : result
            };
            var result = $Course.PostAjaxJson(param, ApiUrl + "File/FileUploadBase64");
            if (result.Msg == "OK") {
                console.log(result);
                ChangeHeaderImg(result.Data);
            }
            return;
        }

        if (img.complete) {
            callback();
        } else {
            img.onload = callback();
        }

        function callback() {
            var data = compress(img);
            var param = {
                base64Str : data
            };
            var result = $Course.PostAjaxJson(param, ApiUrl + "File/FileUploadBase64");
            if (result.Msg == "OK") {
                console.log(result);
                ChangeHeaderImg(result.Data);
            }
        }
        //
        // console.log(reader);
        // console.log(result);
    };
    reader.readAsDataURL(file);

}

function ChangeHeaderImg(PhotoUrl) {
    var param = {
        UserID: UserID,
        PhotoUrl: PhotoUrl
    };
    var result = $Course.PostAjaxJson(param, ApiUrl + "User/UserInfo_Photo_Upd");
    if (result.Msg == "OK") {
        console.log(result);
        GetData();
    }
}

// 瓦片绘制图形,进行压缩
function compress(img) {

//    用于压缩图片的canvas
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d');
    //    瓦片canvas
    var tCanvas = document.createElement("canvas");
    var tctx = tCanvas.getContext("2d");    var initSize = img.src.length;

    var width = img.width;
    var height = img.height;

    //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
    var ratio;
    if ((ratio = width * height / 4000000)>1) {
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
    }else {
        ratio = 1;
    }

    canvas.width = width;
    canvas.height = height;

//        铺底色
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //如果图片像素大于100万则使用瓦片绘制
    var count;
    if ((count = width * height / 1000000) > 1) {
        count = ~~(Math.sqrt(count)+1); //计算要分成多少块瓦片

//            计算每块瓦片的宽和高
        var nw = ~~(width / count);
        var nh = ~~(height / count);

        tCanvas.width = nw;
        tCanvas.height = nh;

        for (var i = 0; i < count; i++) {
            for (var j = 0; j < count; j++) {
                tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);

                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
            }
        }
    } else {
        ctx.drawImage(img, 0, 0, width, height);
    }

    //进行最小压缩
    var ndata = canvas.toDataURL('image/png', 0.1);

    console.log('压缩前：' + initSize);
    console.log('压缩后：' + ndata.length);
    console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");

    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;

    return ndata;
}