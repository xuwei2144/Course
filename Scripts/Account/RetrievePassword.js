/**
 * 找回密码
 * Created by wangbin on 2016/10/3.
 */
var s = 60;
$(function ($) {
    //发送验证码
    $("#btnSendSMS").on("click", function () {
        if (s == 60) {
            GetSMSCode();
        }
    });

    //更换密码
    $("#btnReg").on("click", function () {
        ChangePwd();
    })
});
//获取验证码
function GetSMSCode() {
    var PhoneNum = $("#Phone").val();
    if (!PhoneNum) {
        layer.open({
            content: '请输入手机号',
            style: 'background-color:#fff; color:#000; border:none;width:60%',
            time: 2
        });
        return;
    }
    if (PhoneNum.length < 11) {
        layer.open({
            content: '请输入正确的手机号',
            style: 'background-color:#fff; color:#000; border:none;width:60%',
            time: 2
        });
        return;
    }
    layer.open({
        content: '发送成功',
        // style: 'background-color:#F24C4C; color:#fff; border:none;',
        time: 2
    });
    var param = {Phone: PhoneNum, Type: 2};
    var result = $Course.GetAjaxJson(param, ApiUrl + "Account/GetSMSCode");
    if (result.Msg == "OK") {
        var time = setInterval(function () {
            s--;
            $("#btnSendSMS").html(s + '秒');
            if (s == 0) {
                clearInterval(time);
                $("#btnSendSMS").html('发送验证码');
                s = 60;
            }
        }, 1000);
    }
}
// 更换密码
function ChangePwd() {
    var PhoneNum = $("#Phone").val();
    if (!PhoneNum) {
        layer.open({
            content: '请输入手机号',
            style: 'background-color:#fff; color:#000; border:none;width:60%',
            time: 2
        });
        return;
    }
    if (PhoneNum.length != 11) {
        layer.open({
            content: '请输入正确的手机号',
            style: 'background-color:#fff; color:#000; border:none;width:60%',
            time: 2
        });
        return;
    }
    var _VerificationCode = $("#VerificationCode").val();
    if (!_VerificationCode) {
        layer.open({
            content: '请输入验证码!',
            style: 'background-color:#fff; color:#000; border:none;width:60%',
            time: 2
        });
        return;
    }
    var Pwd = $("#Pwd").val();
    if (!Pwd) {
        layer.open({
            content: '请输入密码！',
            style: 'background-color:#fff; color:#000; border:none;width:60%',
            time: 2
        });
        return;
    }
    Pwd = $Course.MD5(Pwd);
    var param = {Account: PhoneNum, Pwd: Pwd, Code: _VerificationCode};
    var result = $Course.PostAjaxJson(param, ApiUrl + "Account/UserInfo_ChangePwd_ByPhone");
    if (result.Msg == "OK") {
        layer.open({
            content: "密码修改成功！",
            style: 'background-color:#fff; color:#000; border:none;width:60%',
            time: 2,
            end: function () {
                window.location.href = "Login.html";
            }
        });
    } else {
        layer.open({
            content: result.Msg,
            style: 'background-color:#fff; color:#000; border:none;width:60%',
            time: 2
        });
    }
}