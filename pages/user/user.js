Page({
    data: {
        contact_tel: "",
        show_customer_service: 0
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
    },
    loadData: function(e) {
        var t = this;
        t.setData({
            store: getApp().core.getStorageSync(getApp().const.STORE)
        }), getApp().request({
            url: getApp().api.user.index,
            success: function(o) {
                if (0 == o.code) {
                    if ("my" == t.data.__platform) o.data.menus.forEach(function(e, t, a) {
                        "bangding" === e.id && o.data.menus.splice(t, 1, 0);
                    });
                    t.setData(o.data), getApp().core.setStorageSync(getApp().const.PAGES_USER_USER, o.data), 
                    getApp().core.setStorageSync(getApp().const.SHARE_SETTING, o.data.share_setting), 
                    getApp().core.setStorageSync(getApp().const.USER_INFO, o.data.user_info);
                }
            }
        });
    },
    onReady: function(e) {
        getApp().page.onReady(this);
    },
    onShow: function(e) {
        getApp().page.onShow(this);
        this.loadData();
    },
    callTel: function(e) {
        var t = e.currentTarget.dataset.tel;
        getApp().core.makePhoneCall({
            phoneNumber: t
        });
    },
    apply: function(t) {
        var a = getApp().core.getStorageSync(getApp().const.SHARE_SETTING), o = getApp().getUser();
        1 == a.share_condition ? getApp().core.navigateTo({
            url: "/pages/add-share/index"
        }) : 0 != a.share_condition && 2 != a.share_condition || (0 == o.is_distributor ? getApp().core.showModal({
            title: "申请成为分销商",
            content: "是否申请？",
            success: function(e) {
                e.confirm && (getApp().core.showLoading({
                    title: "正在加载",
                    mask: !0
                }), getApp().request({
                    url: getApp().api.share.join,
                    method: "POST",
                    data: {
                        form_id: t.detail.formId
                    },
                    success: function(e) {
                        0 == e.code && (0 == a.share_condition ? (o.is_distributor = 2, getApp().core.navigateTo({
                            url: "/pages/add-share/index"
                        })) : (o.is_distributor = 1, getApp().core.navigateTo({
                            url: "/pages/share/index"
                        })), getApp().core.setStorageSync(getApp().const.USER_INFO, o));
                    },
                    complete: function() {
                        getApp().core.hideLoading();
                    }
                }));
            }
        }) : getApp().core.navigateTo({
            url: "/pages/add-share/index"
        }));
    },
    verify: function(e) {
        getApp().core.scanCode({
            onlyFromCamera: !1,
            success: function(e) {
                getApp().core.navigateTo({
                    url: "/" + e.path
                });
            },
            fail: function(e) {
                getApp().core.showToast({
                    title: "失败"
                });
            }
        });
    },
    member: function() {
        getApp().core.navigateTo({
            url: "/pages/member/member"
        });
    },
    integral_mall: function(e) {
        var t, a;
        getApp().permission_list && getApp().permission_list.length && (t = getApp().permission_list, 
        a = "integralmall", -1 != ("," + t.join(",") + ",").indexOf("," + a + ",")) && getApp().core.navigateTo({
            url: "/pages/integral-mall/index/index"
        });
    },
    getUserInfo: function(o) {
        var n = this;
        "getUserInfo:ok" == o.detail.errMsg && getApp().core.login({
            success: function(e) {
                var t = e.code;
                n.unionLogin({
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
        getApp().core.showLoading({
            title: "正在登录",
            mask: !0
        }), getApp().request({
            url: getApp().api.passport.login,
            method: "POST",
            data: e,
            success: function(e) {
                if (0 == e.code) {
                    getApp().setUser(e.data), getApp().core.setStorageSync(getApp().const.ACCESS_TOKEN, e.data.access_token), 
                    getApp().trigger.run(getApp().trigger.events.login);
                    var t = getApp().core.getStorageSync(getApp().const.LOGIN_PRE_PAGE);
                    t && t.route ? getApp().core.redirectTo({
                        url: "/" + t.route + "?" + getApp().helper.objectToUrlParams(t.options)
                    }) : getApp().core.redirectTo({
                        url: "/pages/index/index"
                    });
                } else getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1
                });
                this.onLoad();
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    }
});