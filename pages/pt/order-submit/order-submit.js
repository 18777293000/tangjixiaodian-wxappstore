var longitude = "", latitude = "";

Page({
    data: {
        address: null,
        offline: 1,
        payment: -1,
        show_payment: !1
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t), getApp().core.removeStorageSync(getApp().const.INPUT_DATA);
        var e, a = t.goods_info, o = JSON.parse(a);
        e = 3 == o.deliver_type || 1 == o.deliver_type ? 1 : 2, this.setData({
            options: t,
            type: o.type,
            offline: e,
            parent_id: o.parent_id ? o.parent_id : 0
        });
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this);
        var e = this, a = getApp().core.getStorageSync(getApp().const.PICKER_ADDRESS);
        a && (e.setData({
            address: a,
            name: a.name,
            mobile: a.mobile
        }), getApp().core.removeStorageSync(getApp().const.PICKER_ADDRESS), e.getInputData()), 
        e.getOrderData(e.data.options);
    },
    onHide: function(t) {
        getApp().page.onHide(this), this.getInputData();
    },
    onUnload: function(t) {
        getApp().page.onUnload(this), getApp().core.removeStorageSync(getApp().const.INPUT_DATA);
    },
    onPullDownRefresh: function(t) {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function(t) {
        getApp().page.onReachBottom(this);
    },
    onShareAppMessage: function(t) {
        getApp().page.onShareAppMessage(this);
    },
    getOrderData: function(t) {
        var s = this, e = "";
        s.data.address && s.data.address.id && (e = s.data.address.id), t.goods_info && (getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.submit_preview,
            data: {
                goods_info: t.goods_info,
                group_id: t.group_id,
                address_id: e,
                type: s.data.type,
                longitude: longitude,
                latitude: latitude
            },
            success: function(t) {
                if (getApp().core.hideLoading(), 0 == t.code) {
                    if (2 == s.data.offline) var e = parseFloat(0 < t.data.total_price - t.data.colonel ? t.data.total_price - t.data.colonel : .01), a = 0; else e = parseFloat(0 < t.data.total_price - t.data.colonel ? t.data.total_price - t.data.colonel : .01) + t.data.express_price, 
                    a = parseFloat(t.data.express_price);
                    var o = getApp().core.getStorageSync(getApp().const.INPUT_DATA);
                    getApp().core.removeStorageSync(getApp().const.INPUT_DATA), console.log(o), o || (o = {
                        address: t.data.address,
                        name: t.data.address ? t.data.address.name : "",
                        mobile: t.data.address ? t.data.address.mobile : ""
                    }, 0 < t.data.pay_type_list.length && (o.payment = t.data.pay_type_list[0].payment, 
                    1 < t.data.pay_type_list.length && (o.payment = -1)), t.data.shop && (o.shop = t.data.shop), 
                    t.data.shop_list && 1 == t.data.shop_list.length && (o.shop = t.data.shop_list[0])), 
                    o.total_price = t.data.total_price, o.goods_list = t.data.list, o.goods_info = t.data.goods_info, 
                    o.express_price = a, o.send_type = t.data.send_type, o.total_price_1 = e.toFixed(2), 
                    o.colonel = t.data.colonel, o.pay_type_list = t.data.pay_type_list, o.shop_list = t.data.shop_list, 
                    o.res = t.data, o.is_area = t.data.is_area, s.setData(o), s.getInputData();
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
        }));
    },
    bindkeyinput: function(t) {
        this.setData({
            content: t.detail.value
        });
    },
    orderSubmit: function(t) {
        var e = this, a = {}, o = e.data.offline;
        if (1 == (a.offline = o)) {
            if (!e.data.address || !e.data.address.id) return void getApp().core.showToast({
                title: "请选择收货地址",
                image: "/images/icon-warning.png"
            });
            a.address_id = e.data.address.id;
        } else {
            if (a.address_name = e.data.name, a.address_mobile = e.data.mobile, !e.data.shop.id) return void getApp().core.showToast({
                title: "请选择核销门店",
                image: "/images/icon-warning.png"
            });
            if (a.shop_id = e.data.shop.id, !a.address_name || null == a.address_name) return void getApp().core.showToast({
                title: "请填写收货人",
                image: "/images/icon-warning.png"
            });
            if (!a.address_mobile || null == a.address_mobile) return void getApp().core.showToast({
                title: "请填写联系方式",
                image: "/images/icon-warning.png"
            });
            if (!/^\+?\d[\d -]{8,12}\d/.test(a.address_mobile)) return void getApp().core.showModal({
                title: "提示",
                content: "手机号格式不正确"
            });
        }
        if (-1 == e.data.payment) return e.setData({
            show_payment: !0
        }), !1;
        e.data.goods_info && (a.goods_info = JSON.stringify(e.data.goods_info)), e.data.picker_coupon && (a.user_coupon_id = e.data.picker_coupon.user_coupon_id), 
        e.data.content && (a.content = e.data.content), e.data.type && (a.type = e.data.type), 
        e.data.parent_id && (a.parent_id = e.data.parent_id), a.payment = e.data.payment, 
        a.formId = t.detail.formId, e.order_submit(a, "pt");
    },
    KeyName: function(t) {
        this.setData({
            name: t.detail.value
        });
    },
    KeyMobile: function(t) {
        this.setData({
            mobile: t.detail.value
        });
    },
    getOffline: function(t) {
        var e = this, a = t.target.dataset.index, o = parseFloat(0 < e.data.res.total_price - e.data.res.colonel ? e.data.res.total_price - e.data.res.colonel : .01) + e.data.res.express_price;
        if (1 == a) this.setData({
            offline: 1,
            express_price: e.data.res.express_price,
            total_price_1: o.toFixed(2)
        }); else {
            var s = (e.data.total_price_1 - e.data.express_price).toFixed(2);
            this.setData({
                offline: 2,
                express_price: 0,
                total_price_1: s
            });
        }
    },
    showShop: function(t) {
        var e = this;
        e.getInputData(), e.dingwei(), e.data.shop_list && 1 <= e.data.shop_list.length && e.setData({
            show_shop: !0
        });
    },
    dingwei: function() {
        var e = this;
        getApp().core.chooseLocation({
            success: function(t) {
                longitude = t.longitude, latitude = t.latitude, e.setData({
                    location: t.address
                });
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
    pickShop: function(t) {
        var e = getApp().core.getStorageSync(getApp().const.INPUT_DATA), a = t.currentTarget.dataset.index;
        e.show_shop = !1, e.shop = "-1" != a && -1 != a && this.data.shop_list[a], this.setData(e);
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
        var t = this, e = {
            address: t.data.address,
            name: t.data.name,
            mobile: t.data.mobile,
            payment: t.data.payment,
            content: t.data.content,
            shop: t.data.shop
        };
        getApp().core.setStorageSync(getApp().const.INPUT_DATA, e);
    }
});