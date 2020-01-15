var app = getApp(), api = getApp().api, longitude = "", latitude = "", util = getApp().helper, is_loading_show = !1;

Page({
    data: {
        total_price: 0,
        address: null,
        express_price: 0,
        express_price_1: 0,
        integral_radio: 1,
        new_total_price: 0,
        show_card: !1,
        payment: -1,
        show_payment: !1,
        show_more: !1,
        index: -1,
        mch_offline: !0
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = util.formatData(new Date());
        getApp().core.removeStorageSync(getApp().const.INPUT_DATA), this.setData({
            options: t,
            time: e
        }), is_loading_show = !1;
    },
    bindContentInput: function(t) {
        this.data.mch_list[t.currentTarget.dataset.index].content = t.detail.value, this.setData({
            mch_list: this.data.mch_list
        });
    },
    KeyName: function(t) {
        var e = this.data.mch_list;
        e[t.currentTarget.dataset.index].offline_name = t.detail.value, this.setData({
            mch_list: e
        });
    },
    KeyMobile: function(t) {
        var e = this.data.mch_list;
        e[t.currentTarget.dataset.index].offline_mobile = t.detail.value, this.setData({
            mch_list: e
        });
    },
    getOffline: function(t) {
        var e = this, a = t.currentTarget.dataset.offline, i = t.currentTarget.dataset.index, s = e.data.mch_list;
        s[i].offline = a, e.setData({
            mch_list: s
        }), 1 == s.length && 0 == s[0].mch_id && 1 == s[0].offline ? e.setData({
            mch_offline: !1
        }) : e.setData({
            mch_offline: !0
        }), e.getPrice();
    },
    dingwei: function() {
        var e = this;
        getApp().core.chooseLocation({
            success: function(t) {
                longitude = t.longitude, latitude = t.latitude, e.setData({
                    location: t.address
                }), e.getOrderData(e.data.options);
            },
            fail: function(t) {
                getApp().getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权",
                    success: function(t) {
                        t && (t.authSetting["scope.userLocation"] ? e.dingwei() : getApp().core.showToast({
                            title: "您取消了授权",
                            image: "/images/icon-warning.png"
                        }));
                    }
                });
            }
        });
    },
    orderSubmit: function(t) {
        var e = this, a = {}, i = e.data.mch_list;
        for (var s in i) {
            var o = i[s].form;
            if (o && 1 == o.is_form && 0 == i[s].mch_id) {
                var n = o.list;
                for (var r in n) if (1 == n[r].required) if ("radio" == n[r].type || "checkbox" == n[r].type) {
                    var c = !1;
                    for (var d in n[r].default_list) 1 == n[r].default_list[d].is_selected && (c = !0);
                    if (!c) return getApp().core.showModal({
                        title: "提示",
                        content: "请填写" + o.name + "，加‘*’为必填项",
                        showCancel: !1
                    }), !1;
                } else if (!n[r].default || null == n[r].default) return getApp().core.showModal({
                    title: "提示",
                    content: "请填写" + o.name + "，加‘*’为必填项",
                    showCancel: !1
                }), !1;
            }
            if (1 == i.length && 0 == i[s].mch_id && 1 == i[s].offline) ; else {
                if (!e.data.address) return getApp().core.showModal({
                    title: "提示",
                    content: "请选择收货地址",
                    showCancel: !1
                }), !1;
                a.address_id = e.data.address.id;
            }
        }
        if (a.mch_list = JSON.stringify(i), 0 < e.data.pond_id) {
            if (0 < e.data.express_price && -1 == e.data.payment) return e.setData({
                show_payment: !0
            }), !1;
        } else if (-1 == e.data.payment) return e.setData({
            show_payment: !0
        }), !1;
        1 == e.data.integral_radio ? a.use_integral = 1 : a.use_integral = 2, a.payment = e.data.payment, 
        a.formId = t.detail.formId, e.order_submit(a, "s");
    },
    onReady: function() {},
    onShow: function(t) {
        if (!is_loading_show) {
            is_loading_show = !0, getApp().page.onShow(this);
            var e = this, a = getApp().core.getStorageSync(getApp().const.PICKER_ADDRESS);
            a && e.setData({
                address: a
            }), e.getOrderData(e.data.options);
        }
    },
    getOrderData: function(t) {
        var h = this, e = {}, a = "";
        h.data.address && h.data.address.id && (a = h.data.address.id), e.address_id = a, 
        e.longitude = longitude, e.latitude = latitude, getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), e.mch_list = t.mch_list, getApp().request({
            url: getApp().api.order.new_submit_preview,
            method: "POST",
            data: e,
            success: function(t) {
                if (getApp().core.hideLoading(), 0 == t.code) {
                    var e = getApp().core.getStorageSync(getApp().const.INPUT_DATA), a = t.data, i = -1, s = 1, o = a.mch_list, n = [];
                    for (var r in e && (n = e.mch_list, i = e.payment, s = e.integral_radio), a.integral_radio = s, 
                    a.pay_type_list) {
                        if (i == a.pay_type_list[r].payment) {
                            a.payment = i;
                            break;
                        }
                        if (1 == a.pay_type_list.length) {
                            a.payment = a.pay_type_list[r].payment;
                            break;
                        }
                    }
                    for (var r in o) {
                        var c = {}, d = {};
                        if (o[r].show = !1, o[r].show_length = o[r].goods_list.length - 1, 0 != n.length) for (var l in n) o[r].mch_id == n[l].mch_id && (o[r].content = n[l].content, 
                        o[r].form = n[l].form, c = n[l].shop, d = n[l].picker_coupon, o[r].offline_name = n[l].offline_name, 
                        o[r].offline_mobile = n[l].offline_mobile);
                        for (var l in o[r].shop_list) {
                            if (c && c.id == o[r].shop_list[l].id) {
                                o[r].shop = c;
                                break;
                            }
                            if (1 == o[r].shop_list.length) {
                                o[r].shop = o[r].shop_list[l];
                                break;
                            }
                            if (1 == o[r].shop_list[l].is_default) {
                                o[r].shop = o[r].shop_list[l];
                                break;
                            }
                        }
                        if (d) for (var l in o[r].coupon_list) if (d.id == o[r].coupon_list[l].id) {
                            o[r].picker_coupon = d;
                            break;
                        }
                        o[r].send_type && 2 == o[r].send_type ? (o[r].offline = 1, h.setData({
                            mch_offline: !1
                        })) : o[r].offline = 0;
                    }
                    a.mch_list = o;
                    var p = h.data.index;
                    -1 != p && o[p].shop_list && 0 < o[p].shop_list.length && h.setData({
                        show_shop: !0,
                        shop_list: o[p].shop_list
                    }), h.setData(a), h.getPrice();
                }
                1 == t.code && getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    confirmText: "返回",
                    success: function(t) {
                        t.confirm && getApp().core.navigateBack({
                            delta: 1
                        });
                    }
                });
            }
        });
    },
    showCouponPicker: function(t) {
        var e = t.currentTarget.dataset.index, a = this.data.mch_list;
        this.getInputData(), a[e].coupon_list && 0 < a[e].coupon_list.length && this.setData({
            show_coupon_picker: !0,
            coupon_list: a[e].coupon_list,
            index: e
        });
    },
    pickCoupon: function(t) {
        var e = t.currentTarget.dataset.index, a = this.data.index, i = getApp().core.getStorageSync(getApp().const.INPUT_DATA);
        getApp().core.removeStorageSync(getApp().const.INPUT_DATA);
        var s = i.mch_list;
        s[a].picker_coupon = "-1" != e && -1 != e && this.data.coupon_list[e], i.show_coupon_picker = !1, 
        i.mch_list = s, i.index = -1, this.setData(i), this.getPrice();
    },
    showShop: function(t) {
        var e = t.currentTarget.dataset.index;
        this.getInputData(), this.setData({
            index: e
        }), this.dingwei();
    },
    pickShop: function(t) {
        var e = t.currentTarget.dataset.index, a = this.data.index, i = getApp().core.getStorageSync(getApp().const.INPUT_DATA), s = i.mch_list;
        s[a].shop = "-1" != e && -1 != e && this.data.shop_list[e], i.show_shop = !1, i.mch_list = s, 
        i.index = -1, this.setData(i), this.getPrice();
    },
    integralSwitchChange: function(t) {
        0 != t.detail.value ? this.setData({
            integral_radio: 1
        }) : this.setData({
            integral_radio: 2
        }), this.getPrice();
    },
    integration: function(t) {
        var e = this.data.integral.integration;
        getApp().core.showModal({
            title: "积分使用规则",
            content: e,
            showCancel: !1,
            confirmText: "我知道了",
            confirmColor: "#ff4544",
            success: function(t) {
                t.confirm;
            }
        });
    },
    getPrice: function() {
        var t = this.data.mch_list, e = this.data.integral_radio, a = (this.data.integral, 
        0), i = 0, s = {};
        for (var o in t) {
            var n = t[o], r = (parseFloat(n.total_price), parseFloat(n.level_price));
            n.picker_coupon && 0 < n.picker_coupon.sub_price && (r -= n.picker_coupon.sub_price), 
            n.integral && 0 < n.integral.forehead && 1 == e && (r -= parseFloat(n.integral.forehead)), 
            0 == n.offline && (n.express_price && (r += n.express_price), n.offer_rule && 1 == n.offer_rule.is_allowed && (s = n.offer_rule), 
            1 == n.is_area && (i = 1)), a += parseFloat(r);
        }
        a = 0 <= a ? a : 0, this.setData({
            new_total_price: parseFloat(a.toFixed(2)),
            offer_rule: s,
            is_area: i
        });
    },
    cardDel: function() {
        this.setData({
            show_card: !1
        }), getApp().core.redirectTo({
            url: "/pages/order/order?status=1"
        });
    },
    cardTo: function() {
        this.setData({
            show_card: !1
        }), getApp().core.redirectTo({
            url: "/pages/card/card"
        });
    },
    formInput: function(t) {
        var e = t.currentTarget.dataset.index, a = t.currentTarget.dataset.formId, i = this.data.mch_list, s = i[e].form, o = s.list;
        o[a].default = t.detail.value, s.list = o, this.setData({
            mch_list: i
        });
    },
    selectForm: function(t) {
        var e = this.data.mch_list, a = t.currentTarget.dataset.index, i = t.currentTarget.dataset.formId, s = t.currentTarget.dataset.k, o = e[a].form, n = o.list, r = n[i].default_list;
        if ("radio" == n[i].type) {
            for (var c in r) c == s ? r[s].is_selected = 1 : r[c].is_selected = 0;
            n[i].default_list = r;
        }
        "checkbox" == n[i].type && (1 == r[s].is_selected ? r[s].is_selected = 0 : r[s].is_selected = 1, 
        n[i].default_list = r), o.list = n, e[a].form = o, this.setData({
            mch_list: e
        });
    },
    showPayment: function() {
        this.setData({
            show_payment: !0
        });
    },
    payPicker: function(t) {
        var e = t.currentTarget.dataset.index;
        this.setData({
            payment: e,
            show_payment: !1
        });
    },
    payClose: function() {
        this.setData({
            show_payment: !1
        });
    },
    getInputData: function() {
        var t = this.data.mch_list, e = {
            integral_radio: this.data.integral_radio,
            payment: this.data.payment,
            mch_list: t
        };
        getApp().core.setStorageSync(getApp().const.INPUT_DATA, e);
    },
    onHide: function() {
        getApp().page.onHide(this);
        this.getInputData();
    },
    onUnload: function() {
        getApp().page.onUnload(this), getApp().core.removeStorageSync(getApp().const.INPUT_DATA);
    },
    uploadImg: function(t) {
        var e = this, a = t.currentTarget.dataset.index, i = t.currentTarget.dataset.formId, s = e.data.mch_list, o = s[a].form;
        is_loading_show = !0, getApp().uploader.upload({
            start: function() {
                getApp().core.showLoading({
                    title: "正在上传",
                    mask: !0
                });
            },
            success: function(t) {
                0 == t.code ? (o.list[i].default = t.data.url, e.setData({
                    mch_list: s
                })) : e.showToast({
                    title: t.msg
                });
            },
            error: function(t) {
                e.showToast({
                    title: t
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    goToAddress: function() {
        is_loading_show = !1, getApp().core.navigateTo({
            url: "/pages/address-picker/address-picker"
        });
    },
    showMore: function(t) {
        var e = this.data.mch_list, a = t.currentTarget.dataset.index;
        e[a].show = !e[a].show, this.setData({
            mch_list: e
        });
    }
});