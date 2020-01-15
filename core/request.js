module.exports = function(e) {
    e.data || (e.data = {});
    var s = this.core, a = this.core.getStorageSync(this.const.ACCESS_TOKEN);
    a && (e.data.access_token = a), e.data._version = this._version, e.data._platform = this.platform, 
    !this.is_login && this.page.currentPage && (this.is_login = !0, this.login({}));
    var t = this;
    s.request({
        url: e.url,
        header: e.header || {
            "content-type": "application/x-www-form-urlencoded"
        },
        data: e.data || {},
        method: e.method || "GET",
        dataType: e.dataType || "json",
        success: function(a) {
            -1 == a.data.code ? (t.page.setUserInfoShow(), t.is_login = !1) : -2 == a.data.code ? s.redirectTo({
                url: "/pages/store-disabled/store-disabled"
            }) : e.success && e.success(a.data);
        },
        fail: function(a) {
            console.warn("--- request fail >>>"), console.warn("--- " + e.url + " ---"), console.warn(a), 
            console.warn("<<< request fail ---");
            var t = getApp();
            t.is_on_launch ? (t.is_on_launch = !1, s.showModal({
                title: "网络请求出错",
                content: a.errMsg || "",
                showCancel: !1,
                success: function(a) {
                    a.confirm && e.fail && e.fail(a);
                }
            })) : (s.showToast({
                title: a.errMsg,
                image: "/images/icon-warning.png"
            }), e.fail && e.fail(a));
        },
        complete: function(t) {
            if (200 != t.statusCode && t.data.code && 500 == t.data.code) {
                var a = t.data.data.message;
                s.showModal({
                    title: "系统错误",
                    content: a + ";\r\n请将错误内容复制发送给我们，以便进行问题追踪。",
                    cancelText: "关闭",
                    confirmText: "复制",
                    success: function(a) {
                        a.confirm && s.setClipboardData({
                            data: JSON.stringify({
                                data: t.data.data,
                                object: e
                            })
                        });
                    }
                });
            }
            e.complete && e.complete(t);
        }
    });
};