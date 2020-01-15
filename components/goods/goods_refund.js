var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
};

module.exports = {
    currentPage: null,
    init: function(t) {
        var e = this;
        void 0 === (e.currentPage = t).switchTab && (t.switchTab = function(t) {
            e.switchTab(t);
        }), void 0 === t.descInput && (t.descInput = function(t) {
            e.descInput(t);
        }), void 0 === t.chooseImage && (t.chooseImage = function(t) {
            e.chooseImage(t);
        }), void 0 === t.deleteImage && (t.deleteImage = function(t) {
            e.deleteImage(t);
        }), void 0 === t.refundSubmit && (t.refundSubmit = function(t) {
            e.refundSubmit(t);
        });
    },
    switchTab: function(t) {
        var e = this.currentPage;
        1 == t.currentTarget.dataset.id ? e.setData({
            switch_tab_1: "active",
            switch_tab_2: ""
        }) : e.setData({
            switch_tab_1: "",
            switch_tab_2: "active"
        });
    },
    descInput: function(t) {
        var e = this.currentPage, a = t.currentTarget.dataset.type, i = t.detail.value;
        if (1 == a) {
            var o = e.data.refund_data_1;
            o.desc = i, e.setData({
                refund_data_1: o
            });
        }
        if (2 == a) {
            var c = e.data.refund_data_2;
            c.desc = i, e.setData({
                refund_data_2: c
            });
        }
    },
    chooseImage: function(t) {
        var e = this.currentPage, a = t.currentTarget.dataset.type;
        if (1 == a) {
            var i = e.data.refund_data_1, o = 0;
            i.pic_list && (o = i.pic_list.length || 0);
            var c = 6 - o;
            getApp().core.chooseImage({
                count: c,
                success: function(t) {
                    i.pic_list || (i.pic_list = []), i.pic_list = i.pic_list.concat(t.tempFilePaths), 
                    e.setData({
                        refund_data_1: i
                    });
                }
            });
        }
        if (2 == a) {
            var n = e.data.refund_data_2;
            o = 0;
            n.pic_list && (o = n.pic_list.length || 0);
            c = 6 - o;
            getApp().core.chooseImage({
                count: c,
                success: function(t) {
                    n.pic_list || (n.pic_list = []), n.pic_list = n.pic_list.concat(t.tempFilePaths), 
                    e.setData({
                        refund_data_2: n
                    });
                }
            });
        }
    },
    deleteImage: function(t) {
        var e = this.currentPage, a = t.currentTarget.dataset.type, i = t.currentTarget.dataset.index;
        if (1 == a) {
            var o = e.data.refund_data_1;
            o.pic_list.splice(i, 1), e.setData({
                refund_data_1: o
            });
        }
        if (2 == a) {
            var c = e.data.refund_data_2;
            c.pic_list.splice(i, 1), e.setData({
                refund_data_2: c
            });
        }
    },
    refundSubmit: function(t) {
        var i = this.currentPage, e = t.currentTarget.dataset.type, o = t.detail.formId;
        if (1 == e) {
            var c, n, d, r, a = function() {
                var a = function() {
                    getApp().core.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), getApp().request({
                        url: n,
                        method: "post",
                        data: {
                            type: 1,
                            order_detail_id: i.data.goods.order_detail_id,
                            desc: s,
                            pic_list: JSON.stringify(p),
                            form_id: o,
                            orderType: r
                        },
                        success: function(t) {
                            getApp().core.hideLoading(), 0 == t.code && getApp().core.showModal({
                                title: "提示",
                                content: t.msg,
                                showCancel: !1,
                                success: function(t) {
                                    t.confirm && getApp().core.redirectTo({
                                        url: d
                                    });
                                }
                            }), 1 == t.code && getApp().core.showModal({
                                title: "提示",
                                content: t.msg,
                                showCancel: !1,
                                success: function(t) {
                                    t.confirm && getApp().core.navigateBack({
                                        delta: 2
                                    });
                                }
                            });
                        }
                    });
                };
                if (0 == (s = i.data.refund_data_1.desc || "").length) return getApp().core.showToast({
                    title: "请填写退款原因",
                    image: "/images/icon-warning.png"
                }), {
                    v: void 0
                };
                if (p = [], u = 0, c = i.data.pageType, n = getApp().api.order.refund, r = d = "", 
                "STORE" === c) d = "/pages/order/order?status=4", r = "STORE"; else if ("PINTUAN" === c) d = "/pages/pt/order/order?status=4", 
                r = "PINTUAN"; else {
                    if ("MIAOSHA" !== c) return getApp().core.showModal({
                        title: "提示",
                        content: "pageType变量未定义或变量值不是预期的"
                    }), {
                        v: void 0
                    };
                    d = "/pages/miaosha/order/order?status=4", r = "MIAOSHA";
                }
                if (i.data.refund_data_1.pic_list && 0 < i.data.refund_data_1.pic_list.length) for (l in getApp().core.showLoading({
                    title: "正在上传图片",
                    mask: !0
                }), i.data.refund_data_1.pic_list) !function(e) {
                    getApp().core.uploadFile({
                        url: getApp().api.default.upload_image,
                        filePath: i.data.refund_data_1.pic_list[e],
                        name: "image",
                        success: function(t) {},
                        complete: function(t) {
                            u++, 200 == t.statusCode && 0 == (t = JSON.parse(t.data)).code && (p[e] = t.data.url), 
                            u == i.data.refund_data_1.pic_list.length && (getApp().core.hideLoading(), a());
                        }
                    });
                }(l); else a();
            }();
            if ("object" === (void 0 === a ? "undefined" : _typeof(a))) return a.v;
        }
        if (2 == e) {
            var s, p, u, l, f = function() {
                var a = function() {
                    getApp().core.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), getApp().request({
                        url: n,
                        method: "post",
                        data: {
                            type: 2,
                            order_detail_id: i.data.goods.order_detail_id,
                            desc: s,
                            pic_list: JSON.stringify(p)
                        },
                        success: function(t) {
                            getApp().core.hideLoading(), 0 == t.code && getApp().core.showModal({
                                title: "提示",
                                content: t.msg,
                                showCancel: !1,
                                success: function(t) {
                                    t.confirm && getApp().core.redirectTo({
                                        url: d
                                    });
                                }
                            }), 1 == t.code && getApp().core.showModal({
                                title: "提示",
                                content: t.msg,
                                showCancel: !1,
                                success: function(t) {
                                    t.confirm && getApp().core.navigateBack({
                                        delta: 2
                                    });
                                }
                            });
                        }
                    });
                };
                if (0 == (s = i.data.refund_data_2.desc || "").length) return getApp().core.showToast({
                    title: "请填写换货说明",
                    image: "/images/icon-warning.png"
                }), {
                    v: void 0
                };
                if (p = [], u = 0, i.data.refund_data_2.pic_list && 0 < i.data.refund_data_2.pic_list.length) for (l in getApp().core.showLoading({
                    title: "正在上传图片",
                    mask: !0
                }), i.data.refund_data_2.pic_list) !function(e) {
                    getApp().core.uploadFile({
                        url: getApp().api.default.upload_image,
                        filePath: i.data.refund_data_2.pic_list[e],
                        name: "image",
                        success: function(t) {},
                        complete: function(t) {
                            u++, 200 == t.statusCode && 0 == (t = JSON.parse(t.data)).code && (p[e] = t.data.url), 
                            u == i.data.refund_data_2.pic_list.length && (getApp().core.hideLoading(), a());
                        }
                    });
                }(l); else a();
            }();
            if ("object" === (void 0 === f ? "undefined" : _typeof(f))) return f.v;
        }
    }
};