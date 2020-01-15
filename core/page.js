module.exports = {
    currentPage: null,
    currentPageOptions: {},
    navbarPages: [ "pages/index/index", "pages/cat/cat", "pages/cart/cart", "pages/user/user", "pages/list/list", "pages/search/search", "pages/topic-list/topic-list", "pages/video/video-list", "pages/miaosha/miaosha", "pages/shop/shop", "pages/pt/index/index", "pages/book/index/index", "pages/share/index", "pages/quick-purchase/index/index", "mch/m/myshop/myshop", "mch/shop-list/shop-list", "pages/integral-mall/index/index", "pages/integral-mall/register/index", "pages/article-detail/article-detail", "pages/article-list/article-list" ],
    onLoad: function(t, e) {
        this.currentPage = t, this.currentPageOptions = e;
        var o = this;
        this.setUserInfo(), this.setWxappImg(), this.setStore(), this.setParentId(e), this.getNavigationBarColor(), 
        this.setDeviceInfo(), this.setPageClasses(), this.setPageNavbar(), this.setBarTitle(), 
        "function" == typeof t.onSelfLoad && t.onSelfLoad(e), o._setFormIdSubmit(), "undefined" != typeof my && "pages/login/login" != t.route && e && (t.options || (t.options = e), 
        getApp().core.setStorageSync("last_page_options", e)), t.navigatorClick = function(e) {
            o.navigatorClick(e, t);
        }, t.setData({
            __platform: getApp().platform,
            _navigation_bar_color: getApp().core.getStorageSync(getApp().const.NAVIGATION_BAR_COLOR)
        }), void 0 === t.showToast && (t.showToast = function(e) {
            o.showToast(e);
        }), getApp().shareSendCoupon = function(e) {
            o.shareSendCoupon(e);
        }, void 0 === t.setTimeList && (t.setTimeList = function(e) {
            return o.setTimeList(e);
        }), void 0 === t.showLoading && (t.showLoading = function(e) {
            o.showLoading(e);
        }), void 0 === t.hideLoading && (t.hideLoading = function(e) {
            o.hideLoading(e);
        }), void 0 === t.modalConfirm && (t.modalConfirm = function(e) {
            o.modalConfirm(e);
        }), void 0 === t.modalClose && (t.modalClose = function(e) {
            o.modalClose(e);
        }), void 0 === t.modalShow && (t.modalShow = function(e) {
            o.modalShow(e);
        }), void 0 === t.myLogin && (t.myLogin = function() {
            o.myLogin();
        }), void 0 === t.getUserInfo && (t.getUserInfo = function(e) {
            o.getUserInfo(e);
        }), void 0 === t.getPhoneNumber && (t.getPhoneNumber = function(e) {
            o.getPhoneNumber(e);
        }), void 0 === t.bindParent && (t.bindParent = function(e) {
            o.bindParent(e);
        });
    },
    onReady: function(e) {
        this.currentPage = e;
    },
    onShow: function(e) {
        this.currentPage = e, getApp().orderPay.init(e, getApp());
    },
    onHide: function(e) {
        this.currentPage = e;
    },
    onUnload: function(e) {
        this.currentPage = e;
    },
    onPullDownRefresh: function(e) {
        this.currentPage = e;
    },
    onReachBottom: function(e) {
        this.currentPage = e;
    },
    onShareAppMessage: function(e) {
        this.currentPage = e, getApp().shareSendCoupon(e);
    },
    imageClick: function(e) {
        console.log("image click", e);
    },
    textClick: function(e) {
        console.log("text click", e);
    },
    tap1: function(e) {
        console.log("tap1", e);
    },
    tap2: function(e) {
        console.log("tap2", e);
    },
    formSubmit_collect: function(e) {
        e.detail.formId;
        console.log("formSubmit_collect--\x3e", e);
    },
    setUserInfo: function() {
        var e = this.currentPage, t = getApp().getUser();
        t && e.setData({
            __user_info: t
        });
    },
    setWxappImg: function(e) {
        var t = this.currentPage;
        getApp().getConfig(function(e) {
            t.setData({
                __wxapp_img: e.wxapp_img,
                store: e.store
            });
        });
    },
    setStore: function(e) {
        var t = this.currentPage;
        getApp().getConfig(function(e) {
            e.store && t.setData({
                store: e.store,
                __is_comment: e.store ? e.store.is_comment : 1,
                __is_sales: e.store ? e.store.is_sales : 1
            });
        });
    },
    setParentId: function(e) {
        var t = this.currentPage;
        if (e) {
            var o = 0;
            if (e.user_id) o = e.user_id; else if (e.scene) if (isNaN(e.scene)) {
                var a = decodeURIComponent(e.scene);
                a && (a = getApp().helper.scene_decode(a)) && a.uid && (o = a.uid);
            } else o = e.scene; else if (null !== getApp().query) {
                var n = getApp().query;
                o = n.uid;
            }
            o && (getApp().core.setStorageSync(getApp().const.PARENT_ID, o), getApp().trigger.remove(getApp().trigger.events.login, "TRY_TO_BIND_PARENT"), 
            getApp().trigger.add(getApp().trigger.events.login, "TRY_TO_BIND_PARENT", function() {
                t.bindParent({
                    parent_id: o,
                    condition: 0
                });
            }));
        }
    },
    showToast: function(e) {
        var t = this.currentPage, o = e.duration || 2500, a = e.title || "", n = (e.success, 
        e.fail, e.complete || null);
        t._toast_timer && clearTimeout(t._toast_timer), t.setData({
            _toast: {
                title: a
            }
        }), t._toast_timer = setTimeout(function() {
            var e = t.data._toast;
            e.hide = !0, t.setData({
                _toast: e
            }), "function" == typeof n && n();
        }, o);
    },
    setDeviceInfo: function() {
        var e = this.currentPage, t = [ {
            id: "device_iphone_5",
            model: "iPhone 5"
        }, {
            id: "device_iphone_x",
            model: "iPhone X"
        } ], o = getApp().core.getSystemInfoSync();
        if (o.model) for (var a in 0 <= o.model.indexOf("iPhone X") && (o.model = "iPhone X"), 
        t) t[a].model == o.model && e.setData({
            __device: t[a].id
        });
    },
    setPageNavbar: function() {
        var t = this, n = this.currentPage, e = getApp().core.getStorageSync("_navbar");
        e && i(e);
        var o = !1;
        for (var a in t.navbarPages) if (n.route == t.navbarPages[a]) {
            o = !0;
            break;
        }
        function i(e) {
            var t = !1, o = n.route || n.__route__ || null;
            for (var a in e.navs) e.navs[a].url === "/" + o ? t = e.navs[a].active = !0 : e.navs[a].active = !1;
            t && n.setData({
                _navbar: e
            });
        }
        o && getApp().request({
            url: getApp().api.default.navbar,
            success: function(e) {
                0 == e.code && (i(e.data), getApp().core.setStorageSync("_navbar", e.data), t.setPageClasses());
            }
        });
    },
    setPageClasses: function() {
        var e = this.currentPage, t = e.data.__device;
        e.data._navbar && e.data._navbar.navs && 0 < e.data._navbar.navs.length && (t += " show_navbar"), 
        t && e.setData({
            __page_classes: t
        });
    },
    showLoading: function(e) {
        var t = t;
        t.setData({
            _loading: !0
        });
    },
    hideLoading: function(e) {
        this.currentPage.setData({
            _loading: !1
        });
    },
    setTimeList: function(e) {
        function t(e) {
            return e <= 0 && (e = 0), e < 10 ? "0" + e : e;
        }
        var o = "00", a = "00", n = "00", i = 0;
        return 86400 <= e && (i = parseInt(e / 86400), e %= 86400), e < 86400 && (n = parseInt(e / 3600), 
        e %= 3600), e < 3600 && (a = parseInt(e / 60), e %= 60), e < 60 && (o = e), {
            d: i,
            h: t(n),
            m: t(a),
            s: t(o)
        };
    },
    setBarTitle: function(e) {
        var t = this.currentPage.route, o = getApp().core.getStorageSync(getApp().const.WX_BAR_TITLE);
        for (var a in o) o[a].url === t && getApp().core.setNavigationBarTitle({
            title: o[a].title
        });
    },
    getNavigationBarColor: function() {
        var t = getApp(), o = this;
        t.request({
            url: t.api.default.navigation_bar_color,
            success: function(e) {
                0 == e.code && (t.core.setStorageSync(getApp().const.NAVIGATION_BAR_COLOR, e.data), 
                o.setNavigationBarColor(), t.navigateBarColorCall && "function" == typeof t.navigateBarColorCall && t.navigateBarColorCall(e));
            }
        });
    },
    setNavigationBarColor: function() {
        var e = getApp().core.getStorageSync(getApp().const.NAVIGATION_BAR_COLOR);
        e && getApp().core.setNavigationBarColor(e), getApp().navigateBarColorCall = function(e) {
            getApp().core.setNavigationBarColor(e.data);
        };
    },
    navigatorClick: function(e, t) {
        var o = e.currentTarget.dataset.open_type;
        if ("redirect" == o) return !0;
        if ("wxapp" != o) {
            if ("tel" == o) {
                var a = e.currentTarget.dataset.tel;
                getApp().core.makePhoneCall({
                    phoneNumber: a
                });
            }
            return !1;
        }
    },
    shareSendCoupon: function(o) {
        var a = getApp();
        a.core.showLoading({
            mask: !0
        }), o.hideGetCoupon || (o.hideGetCoupon = function(e) {
            var t = e.currentTarget.dataset.url || !1;
            o.setData({
                get_coupon_list: null
            }), t && a.core.navigateTo({
                url: t
            });
        }), a.request({
            url: a.api.coupon.share_send,
            success: function(e) {
                0 == e.code && o.setData({
                    get_coupon_list: e.data.list
                });
            },
            complete: function() {
                a.core.hideLoading();
            }
        });
    },
    bindParent: function(e) {
        var t = getApp();
        if ("undefined" != e.parent_id && 0 != e.parent_id) {
            var o = t.getUser();
            if (0 < t.core.getStorageSync(t.const.SHARE_SETTING).level) 0 != e.parent_id && t.request({
                url: t.api.share.bind_parent,
                data: {
                    parent_id: e.parent_id,
                    condition: e.condition
                },
                success: function(e) {
                    0 == e.code && (o.parent = e.data, t.setUser(o));
                }
            });
        }
    },
    _setFormIdSubmit: function(e) {
        var s = this.currentPage;
        s._formIdSubmit || (s._formIdSubmit = function(e) {
            console.log("_formIdSubmit e --\x3e", e);
            var t = e.currentTarget.dataset, o = e.detail.formId, a = t.bind || null, n = t.type || null, i = t.url || null, r = getApp().core.getStorageSync(getApp().const.FORM_ID_LIST);
            switch (r && r.length || (r = []), r.push({
                time: getApp().helper.time(),
                form_id: o
            }), getApp().core.setStorageSync(getApp().const.FORM_ID_LIST, r), console.log("self[bindtap]--\x3e", s[a]), 
            s[a] && "function" == typeof s[a] && s[a](e), n) {
              case "navigate":
                i && getApp().core.navigateTo({
                    url: i
                });
                break;

              case "redirect":
                i && getApp().core.redirectTo({
                    url: i
                });
                break;

              case "switchTab":
                i && getApp().core.switchTab({
                    url: i
                });
                break;

              case "reLaunch":
                i && getApp().core.reLaunch({
                    url: i
                });
                break;

              case "navigateBack":
                i && getApp().core.navigateBack({
                    url: i
                });
            }
        });
    },
    modalClose: function(e) {
        this.currentPage.setData({
            modal_show: !1
        }), console.log("你点击了关闭按钮");
    },
    modalConfirm: function(e) {
        this.currentPage.setData({
            modal_show: !1
        }), console.log("你点击了确定按钮");
    },
    modalShow: function(e) {
        this.currentPage.setData({
            modal_show: !0
        }), console.log("点击会弹出弹框");
    },
    getUserInfo: function(o) {
        var a = this;
        "getUserInfo:ok" == o.detail.errMsg && getApp().core.login({
            success: function(e) {
                var t = e.code;
                a.unionLogin({
                    code: t,
                    user_info: o.detail.rawData,
                    encrypted_data: o.detail.encryptedData,
                    iv: o.detail.iv,
                    signature: o.detail.signature
                });
            },
            fail: function(e) {}
        });
    },
    myLogin: function() {
        var t = this;
        "my" === getApp().platform && my.getAuthCode({
            scopes: "auth_user",
            success: function(e) {
                t.unionLogin({
                    code: e.authCode
                });
            }
        });
    },
    unionLogin: function(e) {
        var o = this.currentPage, a = this;
        getApp().core.showLoading({
            title: "正在登录",
            mask: !0
        }), getApp().request({
            url: getApp().api.passport.login,
            method: "POST",
            data: e,
            success: function(e) {
                if (0 == e.code) {
                    o.setData({
                        __user_info: e.data
                    }), getApp().setUser(e.data), getApp().core.setStorageSync(getApp().const.ACCESS_TOKEN, e.data.access_token), 
                    getApp().trigger.run(getApp().trigger.events.login);
                    var t = getApp().core.getStorageSync(getApp().const.STORE);
                    e.data.binding || !t.option.phone_auth || t.option.phone_auth && 0 == t.option.phone_auth ? getApp().core.redirectTo({
                        url: "/" + o.route + "?" + getApp().helper.objectToUrlParams(o.options)
                    }) : ("undefined" == typeof wx && getApp().core.redirectTo({
                        url: "/" + o.route + "?" + getApp().helper.objectToUrlParams(o.options)
                    }), a.setPhone(), a.setUserInfoShowFalse());
                } else getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    getPhoneNumber: function(o) {
        var a = this.currentPage;
        "getPhoneNumber:fail user deny" == o.detail.errMsg ? getApp().core.showModal({
            title: "提示",
            showCancel: !1,
            content: "未授权"
        }) : (getApp().core.showLoading({
            title: "授权中"
        }), getApp().core.login({
            success: function(e) {
                if (e.code) {
                    var t = e.code;
                    getApp().request({
                        url: getApp().api.user.user_binding,
                        method: "POST",
                        data: {
                            iv: o.detail.iv,
                            encryptedData: o.detail.encryptedData,
                            code: t
                        },
                        success: function(e) {
                            if (0 == e.code) {
                                var t = a.data.__user_info;
                                t.binding = e.data.dataObj, getApp().setUser(t), a.setData({
                                    PhoneNumber: e.data.dataObj,
                                    __user_info: t,
                                    binding: !0,
                                    binding_num: e.data.dataObj
                                }), getApp().core.redirectTo({
                                    url: "/" + a.route + "?" + getApp().helper.objectToUrlParams(a.options)
                                });
                            } else getApp().core.showToast({
                                title: "授权失败,请重试"
                            });
                        },
                        complete: function(e) {
                            getApp().core.hideLoading();
                        }
                    });
                } else getApp().core.showToast({
                    title: "获取用户登录态失败！" + e.errMsg
                });
            }
        }));
    },
    setUserInfoShow: function() {
        this.currentPage.setData({
            user_info_show: !0
        });
    },
    setPhone: function() {
        var e = this.currentPage;
        "undefined" == typeof my && e.setData({
            user_bind_show: !0
        });
    },
    setUserInfoShowFalse: function() {
        this.currentPage.setData({
            user_info_show: !1
        });
    }
};