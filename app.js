var platform = null;

"undefined" != typeof wx && (platform = "wx"), "undefined" != typeof my && (platform = "my");

var modules = [ {
    name: "helper",
    file: "./utils/helper.js"
}, {
    name: "const",
    file: "./core/const.js"
}, {
    name: "getConfig",
    file: "./core/config.js"
}, {
    name: "page",
    file: "./core/page.js"
}, {
    name: "request",
    file: "./core/request.js"
}, {
    name: "core",
    file: "./core/core.js"
}, {
    name: "api",
    file: "./core/api.js"
}, {
    name: "getUser",
    file: "./core/getUser.js"
}, {
    name: "setUser",
    file: "./core/setUser.js"
}, {
    name: "login",
    file: "./core/login.js"
}, {
    name: "trigger",
    file: "./core/trigger.js"
}, {
    name: "uploader",
    file: "./utils/uploader.js"
}, {
    name: "orderPay",
    file: "./core/order-pay.js"
} ], args = {
    _version: "2.8.9",
    platform: platform,
    query: null,
    onLaunch: function() {
        this.getStoreData();
    },
    onShow: function(e) {
        e.scene && (this.onShowData = e), e && e.query && (this.query = e.query);
    },
    is_login: !1
};

for (var i in modules) args[modules[i].name] = require("" + modules[i].file);

var _web_root = args.api.index.substr(0, args.api.index.indexOf("/index.php"));

args.webRoot = _web_root, args.getauth = function(t) {
    var o = this;
    o.core.showModal({
        title: "是否打开设置页面重新授权",
        content: t.content,
        confirmText: "去设置",
        success: function(e) {
            e.confirm ? o.hj.openSetting({
                success: function(e) {
                    t.success && t.success(e);
                },
                fail: function(e) {
                    t.fail && t.fail(e);
                },
                complete: function(e) {
                    t.complete && t.complete(e);
                }
            }) : t.cancel && o.getauth(t);
        }
    });
}, args.getStoreData = function() {
    var o = this, e = this.api, a = this.core;
    o.request({
        url: e.default.store,
        success: function(t) {
            0 == t.code && (a.setStorageSync(o.const.STORE, t.data.store), a.setStorageSync(o.const.STORE_NAME, t.data.store_name), 
            a.setStorageSync(o.const.SHOW_CUSTOMER_SERVICE, t.data.show_customer_service), a.setStorageSync(o.const.CONTACT_TEL, t.data.contact_tel), 
            a.setStorageSync(o.const.SHARE_SETTING, t.data.share_setting), o.permission_list = t.data.permission_list, 
            a.setStorageSync(o.const.WXAPP_IMG, t.data.wxapp_img), a.setStorageSync(o.const.WX_BAR_TITLE, t.data.wx_bar_title), 
            a.setStorageSync(o.const.ALIPAY_MP_CONFIG, t.data.alipay_mp_config), a.setStorageSync(o.const.STORE_CONFIG, t.data), 
            setTimeout(function(e) {
                o.config = t.data, o.configReadyCall && o.configReadyCall(t.data);
            }, 1e3));
        },
        complete: function() {}
    });
};

var app = App(args);