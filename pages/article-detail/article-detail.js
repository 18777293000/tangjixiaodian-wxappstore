var WxParse = require("../../wxParse/wxParse.js");

Page({
    data: {},
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = this;
        getApp().request({
            url: getApp().api.default.article_detail,
            data: {
                id: t.id
            },
            success: function(t) {
                0 == t.code && (getApp().core.setNavigationBarTitle({
                    title: t.data.title
                }), WxParse.wxParse("content", "html", t.data.content, e)), 1 == t.code && getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    confirm: function(t) {
                        t.confirm && getApp().core.navigateBack();
                    }
                });
            }
        });
    }
});