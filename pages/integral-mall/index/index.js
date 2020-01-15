var integral_catId = 0, integral_index = -1;

Page({
    data: {},
    onLoad: function(t) {
        getApp().page.onLoad(this, t), getApp().page.onLoad(this, t), getApp().core.showLoading({
            title: "加载中"
        });
    },
    onReady: function(t) {
        getApp().page.onReady(this), getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this), getApp().page.onShow(this);
        var p = this;
        getApp().request({
            url: getApp().api.integral.index,
            data: {
                page: 1
            },
            success: function(t) {
                if (0 == t.code) {
                    var e = [], a = t.data.goods_list, n = [];
                    if (a) for (var o in a) 0 < a[o].goods.length && n.push(a[o]);
                    if (0 < n.length) for (var i in n) {
                        var s = n[i].goods;
                        for (var r in s) 1 == s[r].is_index && e.push(s[r]);
                    }
                    if (t.data.today && p.setData({
                        register_day: 1
                    }), p.setData({
                        banner_list: t.data.banner_list,
                        coupon_list: t.data.coupon_list,
                        goods_list: n,
                        index_goods: e,
                        integral: t.data.user.integral
                    }), -1 != integral_index) {
                        var g = [];
                        g.index = integral_index, g.catId = integral_catId, p.catGoods({
                            currentTarget: {
                                dataset: g
                            }
                        });
                    }
                }
            },
            complete: function(t) {
                getApp().core.hideLoading();
            }
        });
    },
    exchangeCoupon: function(t) {
        var a = this, n = a.data.coupon_list, e = t.currentTarget.dataset.index, o = n[e], i = a.data.integral;
        if (parseInt(o.integral) > parseInt(i)) a.setData({
            showModel: !0,
            content: "当前积分不足",
            status: 1
        }); else {
            if (0 < parseFloat(o.price)) var s = "需要" + o.integral + "积分+￥" + parseFloat(o.price); else s = "需要" + o.integral + "积分";
            if (parseInt(o.total_num) <= 0) return void a.setData({
                showModel: !0,
                content: "已领完,来晚一步",
                status: 1
            });
            if (parseInt(o.num) >= parseInt(o.user_num)) return o.type = 1, void a.setData({
                showModel: !0,
                content: "兑换次数已达上限",
                status: 1,
                coupon_list: n
            });
            getApp().core.showModal({
                title: "确认兑换",
                content: s,
                success: function(t) {
                    t.confirm && (0 < parseFloat(o.price) ? (getApp().core.showLoading({
                        title: "提交中"
                    }), getApp().request({
                        url: getApp().integral.exchange_coupon,
                        data: {
                            id: o.id,
                            type: 2
                        },
                        success: function(e) {
                            0 == e.code && getApp().core.requestPayment({
                                _res: e,
                                timeStamp: e.data.timeStamp,
                                nonceStr: e.data.nonceStr,
                                package: e.data.package,
                                signType: e.data.signType,
                                paySign: e.data.paySign,
                                complete: function(t) {
                                    "requestPayment:fail" != t.errMsg && "requestPayment:fail cancel" != t.errMsg ? "requestPayment:ok" == t.errMsg && (o.num = parseInt(o.num), 
                                    o.num += 1, o.total_num = parseInt(o.total_num), o.total_num -= 1, i = parseInt(i), 
                                    i -= parseInt(o.integral), a.setData({
                                        showModel: !0,
                                        status: 4,
                                        content: e.msg,
                                        coupon_list: n,
                                        integral: i
                                    })) : getApp().core.showModal({
                                        title: "提示",
                                        content: "订单尚未支付",
                                        showCancel: !1,
                                        confirmText: "确认"
                                    });
                                }
                            });
                        },
                        complete: function() {
                            getApp().core.hideLoading();
                        }
                    })) : (getApp().core.showLoading({
                        title: "提交中"
                    }), getApp().request({
                        url: getApp().api.integral.exchange_coupon,
                        data: {
                            id: o.id,
                            type: 1
                        },
                        success: function(t) {
                            0 == t.code && (o.num = parseInt(o.num), o.num += 1, o.total_num = parseInt(o.total_num), 
                            o.total_num -= 1, i = parseInt(i), i -= parseInt(o.integral), a.setData({
                                showModel: !0,
                                status: 4,
                                content: t.msg,
                                coupon_list: n,
                                integral: i
                            }));
                        },
                        complete: function() {
                            getApp().core.hideLoading();
                        }
                    })));
                }
            });
        }
    },
    hideModal: function() {
        this.setData({
            showModel: !1
        });
    },
    couponInfo: function(t) {
        var e = t.currentTarget.dataset;
        getApp().core.navigateTo({
            url: "/pages/integral-mall/coupon-info/index?coupon_id=" + e.id
        });
    },
    goodsAll: function() {
        var t = this.data.goods_list, e = [];
        for (var a in t) {
            var n = t[a].goods;
            for (var o in t[a].cat_checked = !1, n) e.push(n[o]);
        }
        this.setData({
            index_goods: e,
            cat_checked: !0,
            goods_list: t
        });
    },
    catGoods: function(t) {
        var e = t.currentTarget.dataset, a = this.data.goods_list, n = a.find(function(t) {
            return t.id == e.catId;
        });
        integral_catId = e.catId, integral_index = e.index;
        var o = e.index;
        for (var i in a) a[i].id == a[o].id ? a[i].cat_checked = !0 : a[i].cat_checked = !1;
        this.setData({
            index_goods: n.goods,
            goods_list: a,
            cat_checked: !1
        });
    },
    goodsInfo: function(t) {
        var e = t.currentTarget.dataset.goodsId;
        getApp().core.navigateTo({
            url: "/pages/integral-mall/goods-info/index?goods_id=" + e + "&integral=" + this.data.integral
        });
    },
    onHide: function(t) {
        getApp().page.onHide(this), getApp().page.onHide(this);
    },
    onUnload: function(t) {
        getApp().page.onUnload(this), getApp().page.onUnload(this);
    },
    onPullDownRefresh: function(t) {
        getApp().page.onPullDownRefresh(this), getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function(t) {
        getApp().page.onReachBottom(this), getApp().page.onReachBottom(this);
    },
    shuoming: function() {
        getApp().core.navigateTo({
            url: "/pages/integral-mall/shuoming/index"
        });
    },
    detail: function() {
        getApp().core.navigateTo({
            url: "/pages/integral-mall/detail/index"
        });
    },
    exchange: function() {
        getApp().core.navigateTo({
            url: "/pages/integral-mall/exchange/index"
        });
    },
    register: function() {
        getApp().core.navigateTo({
            url: "/pages/integral-mall/register/index"
        });
    }
});