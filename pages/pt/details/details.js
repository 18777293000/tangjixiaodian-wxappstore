var _Page;

function _defineProperty(t, e, a) {
    return e in t ? Object.defineProperty(t, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = a, t;
}

var utils = require("../../../utils/helper.js"), WxParse = require("../../../wxParse/wxParse.js"), gSpecificationsModel = require("../../../components/goods/specifications_model.js"), goodsBanner = require("../../../components/goods/goods_banner.js"), quickNavigation = require("../../../components/quick-navigation/quick-navigation.js");

Page((_defineProperty(_Page = {
    data: {
        pageType: "PINTUAN",
        form: {
            number: 1,
            pt_detail: !1
        }
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t), quickNavigation.init(this);
        var e = t.user_id, a = decodeURIComponent(t.scene);
        if (void 0 !== e) e; else if (void 0 !== a) {
            var o = utils.scene_decode(a);
            o.uid && o.gid ? (o.uid, t.gid = o.gid) : a;
        } else if ("undefined" != typeof my && null !== getApp().query) {
            var i = getApp().query;
            getApp().query = null, t.id = i.gid;
        }
        this.setData({
            id: t.gid,
            oid: t.oid ? t.oid : 0,
            group_checked: t.group_id ? t.group_id : 0
        }), this.getGoodsInfo(t);
        var r = getApp().core.getStorageSync(getApp().const.STORE);
        this.setData({
            store: r
        });
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    onShow: function() {
        getApp().page.onShow(this), gSpecificationsModel.init(this), goodsBanner.init(this);
    },
    onHide: function() {
        getApp().page.onHide(this);
    },
    onUnload: function() {
        getApp().page.onUnload(this), getApp().core.removeStorageSync(getApp().const.PT_GROUP_DETAIL);
    },
    onPullDownRefresh: function() {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function() {
        getApp().page.onReachBottom(this);
    },
    onShareAppMessage: function() {
        getApp().page.onShareAppMessage(this);
        var t = this, e = getApp().core.getStorageSync(getApp().const.USER_INFO), a = "/pages/pt/details/details?gid=" + t.data.goods.id + "&user_id=" + e.id;
        return {
            title: t.data.goods.name,
            path: a,
            imageUrl: t.data.goods.cover_pic,
            success: function(t) {}
        };
    },
    getGoodsInfo: function(t) {
        var e = t.gid, o = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().core.showNavigationBarLoading(), getApp().request({
            url: getApp().api.group.details,
            method: "get",
            data: {
                gid: e
            },
            success: function(t) {
                if (0 == t.code) {
                    o.countDownRun(t.data.info.limit_time_ms);
                    var e = t.data.info.detail;
                    WxParse.wxParse("detail", "html", e, o), getApp().core.setNavigationBarTitle({
                        title: t.data.info.name
                    }), getApp().core.hideNavigationBarLoading();
                    var a = (t.data.info.original_price - t.data.info.price).toFixed(2);
                    o.setData({
                        group_checked: o.data.group_checked ? o.data.group_checked : 0,
                        goods: t.data.info,
                        attr_group_list: t.data.attr_group_list,
                        attr_group_num: t.data.attr_group_num,
                        limit_time: t.data.limit_time_res,
                        group_list: t.data.groupList,
                        group_num: t.data.groupList.length,
                        group_rule_id: t.data.groupRuleId,
                        comment: t.data.comment,
                        comment_num: t.data.commentNum,
                        reduce_price: a < 0 ? 0 : a
                    }), o.countDown(), o.selectDefaultAttr();
                } else getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.redirectTo({
                            url: "/pages/pt/index/index"
                        });
                    }
                });
            },
            complete: function(t) {
                getApp().core.hideLoading();
            }
        });
    },
    more: function() {
        this.setData({
            pt_detail: !0
        });
    },
    end_more: function() {
        this.setData({
            pt_detail: !1
        });
    },
    previewImage: function(t) {
        var e = t.currentTarget.dataset.url;
        getApp().core.previewImage({
            urls: [ e ]
        });
    },
    selectDefaultAttr: function() {
        var t = this;
        if (!t.data.goods || "0" === t.data.goods.use_attr) for (var e in t.data.attr_group_list) for (var a in t.data.attr_group_list[e].attr_list) 0 == e && 0 == a && (t.data.attr_group_list[e].attr_list[a].checked = !0);
        t.setData({
            attr_group_list: t.data.attr_group_list
        });
    },
    countDownRun: function(r) {
        var s = this;
        setInterval(function() {
            var t = new Date(r[0], r[1] - 1, r[2], r[3], r[4], r[5]) - new Date(), e = parseInt(t / 1e3 / 60 / 60 / 24, 10), a = parseInt(t / 1e3 / 60 / 60 % 24, 10), o = parseInt(t / 1e3 / 60 % 60, 10), i = parseInt(t / 1e3 % 60, 10);
            e = s.checkTime(e), a = s.checkTime(a), o = s.checkTime(o), i = s.checkTime(i), 
            s.setData({
                limit_time: {
                    days: e < 0 ? "00" : e,
                    hours: a < 0 ? "00" : a,
                    mins: o < 0 ? "00" : o,
                    secs: i < 0 ? "00" : i
                }
            });
        }, 1e3);
    },
    checkTime: function(t) {
        return t < 0 ? "00" : (t < 10 && (t = "0" + t), t);
    },
    goHome: function(t) {
        getApp().core.redirectTo({
            url: "/pages/pt/index/index"
        });
    },
    goToGroup: function(t) {
        getApp().core.navigateTo({
            url: "/pages/pt/group/details?oid=" + t.target.dataset.id
        });
    },
    goToComment: function(t) {
        getApp().core.navigateTo({
            url: "/pages/pt/comment/comment?id=" + this.data.goods.id
        });
    },
    goArticle: function(t) {
        this.data.group_rule_id && getApp().core.navigateTo({
            url: "/pages/article-detail/article-detail?id=" + this.data.group_rule_id
        });
    },
    hideAttrPicker: function() {
        this.setData({
            show_attr_picker: !1
        });
    },
    showAttrPicker: function() {
        this.setData({
            show_attr_picker: !0
        });
    },
    groupCheck: function() {
        var a = this, t = a.data.attr_group_num, e = a.data.attr_group_num.attr_list;
        for (var o in e) e[o].checked = !1;
        t.attr_list = e;
        a.data.goods;
        a.setData({
            group_checked: 0,
            attr_group_num: t
        });
        var i = a.data.attr_group_list, r = [], s = !0;
        for (var o in i) {
            var n = !1;
            for (var d in i[o].attr_list) if (i[o].attr_list[d].checked) {
                r.push(i[o].attr_list[d].attr_id), n = !0;
                break;
            }
            if (!n) {
                s = !1;
                break;
            }
        }
        s && (getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.goods_attr_info,
            data: {
                goods_id: a.data.goods.id,
                group_id: a.data.group_checked,
                attr_list: JSON.stringify(r)
            },
            success: function(t) {
                if (getApp().core.hideLoading(), 0 == t.code) {
                    var e = a.data.goods;
                    e.price = t.data.price, e.num = t.data.num, e.attr_pic = t.data.pic, e.original_price = t.data.single, 
                    a.setData({
                        goods: e
                    });
                }
            }
        }));
    },
    attrNumClick: function(t) {
        var a = this, e = t.target.dataset.id, o = a.data.attr_group_num, i = o.attr_list;
        for (var r in i) i[r].id == e ? i[r].checked = !0 : i[r].checked = !1;
        o.attr_list = i, a.setData({
            attr_group_num: o,
            group_checked: e
        });
        var s = a.data.attr_group_list, n = [], d = !0;
        for (var r in s) {
            var c = !1;
            for (var p in s[r].attr_list) if (s[r].attr_list[p].checked) {
                n.push(s[r].attr_list[p].attr_id), c = !0;
                break;
            }
            if (!c) {
                d = !1;
                break;
            }
        }
        d && (getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.goods_attr_info,
            data: {
                goods_id: a.data.goods.id,
                group_id: a.data.group_checked,
                attr_list: JSON.stringify(n)
            },
            success: function(t) {
                if (getApp().core.hideLoading(), 0 == t.code) {
                    var e = a.data.goods;
                    e.price = t.data.price, e.num = t.data.num, e.attr_pic = t.data.pic, e.original_price = t.data.single, 
                    a.setData({
                        goods: e
                    });
                }
            }
        }));
    },
    attrClick: function(t) {
        var a = this, e = t.target.dataset.groupId, o = t.target.dataset.id, i = a.data.attr_group_list;
        for (var r in i) if (i[r].attr_group_id == e) for (var s in i[r].attr_list) i[r].attr_list[s].attr_id == o ? i[r].attr_list[s].checked = !0 : i[r].attr_list[s].checked = !1;
        a.setData({
            attr_group_list: i
        });
        var n = [], d = !0;
        for (var r in i) {
            var c = !1;
            for (var s in i[r].attr_list) if (i[r].attr_list[s].checked) {
                n.push(i[r].attr_list[s].attr_id), c = !0;
                break;
            }
            if (!c) {
                d = !1;
                break;
            }
        }
        d && (getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.goods_attr_info,
            data: {
                goods_id: a.data.goods.id,
                group_id: a.data.group_checked,
                attr_list: JSON.stringify(n)
            },
            success: function(t) {
                if (getApp().core.hideLoading(), 0 == t.code) {
                    var e = a.data.goods;
                    e.price = t.data.price, e.num = t.data.num, e.attr_pic = t.data.pic, e.original_price = t.data.single, 
                    a.setData({
                        goods: e
                    });
                }
            }
        }));
    },
    buyNow: function() {
        this.submit("GROUP_BUY", this.data.group_checked);
    },
    onlyBuy: function() {
        this.submit("ONLY_BUY", 0);
    },
    submit: function(t, e) {
        var a = this, o = "GROUP_BUY" == t;
        if (!a.data.show_attr_picker || o != a.data.groupNum) return a.setData({
            show_attr_picker: !0,
            groupNum: o
        }), !0;
        if (a.data.form.number > a.data.goods.num) return getApp().core.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        var i = a.data.attr_group_list, r = [];
        for (var s in i) {
            var n = !1;
            for (var d in i[s].attr_list) if (i[s].attr_list[d].checked) {
                n = {
                    attr_id: i[s].attr_list[d].attr_id,
                    attr_name: i[s].attr_list[d].attr_name
                };
                break;
            }
            if (!n) return getApp().core.showToast({
                title: "请选择" + i[s].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            r.push({
                attr_group_id: i[s].attr_group_id,
                attr_group_name: i[s].attr_group_name,
                attr_id: n.attr_id,
                attr_name: n.attr_name
            });
        }
        a.setData({
            show_attr_picker: !1
        });
        var c = 0;
        a.data.oid && (t = "GROUP_BUY_C", c = a.data.oid), getApp().core.redirectTo({
            url: "/pages/pt/order-submit/order-submit?goods_info=" + JSON.stringify({
                goods_id: a.data.goods.id,
                attr: r,
                num: a.data.form.number,
                type: t,
                deliver_type: a.data.goods.type,
                group_id: e,
                parent_id: c
            })
        });
    },
    numberSub: function() {
        var t = this.data.form.number;
        if (t <= 1) return !0;
        t--, this.setData({
            form: {
                number: t
            }
        });
    },
    numberAdd: function() {
        var t = this.data.form.number;
        ++t > this.data.goods.one_buy_limit && 0 != this.data.goods.one_buy_limit ? getApp().core.showModal({
            title: "提示",
            content: "数量超过最大限购数",
            showCancel: !1,
            success: function(t) {}
        }) : this.setData({
            form: {
                number: t
            }
        });
    },
    numberBlur: function(t) {
        var e = t.detail.value;
        e = parseInt(e), isNaN(e) && (e = 1), e <= 0 && (e = 1), e > this.data.goods.one_buy_limit && 0 != this.data.goods.one_buy_limit && (getApp().core.showModal({
            title: "提示",
            content: "数量超过最大限购数",
            showCancel: !1,
            success: function(t) {}
        }), e = this.data.goods.one_buy_limit), this.setData({
            form: {
                number: e
            }
        });
    },
    countDown: function() {
        var n = this;
        setInterval(function() {
            var t = n.data.group_list;
            for (var e in t) {
                var a = new Date(t[e].limit_time_ms[0], t[e].limit_time_ms[1] - 1, t[e].limit_time_ms[2], t[e].limit_time_ms[3], t[e].limit_time_ms[4], t[e].limit_time_ms[5]) - new Date(), o = parseInt(a / 1e3 / 60 / 60 / 24, 10), i = parseInt(a / 1e3 / 60 / 60 % 24, 10), r = parseInt(a / 1e3 / 60 % 60, 10), s = parseInt(a / 1e3 % 60, 10);
                o = n.checkTime(o), i = n.checkTime(i), r = n.checkTime(r), s = n.checkTime(s), 
                t[e].limit_time = {
                    days: o,
                    hours: 0 < i ? i : "00",
                    mins: 0 < r ? r : "00",
                    secs: 0 < s ? s : "00"
                }, n.setData({
                    group_list: t
                });
            }
        }, 1e3);
    },
    bigToImage: function(t) {
        var e = this.data.comment[t.target.dataset.index].pic_list;
        getApp().core.previewImage({
            current: t.target.dataset.url,
            urls: e
        });
    },
    showShareModal: function() {
        this.setData({
            share_modal_active: "active",
            no_scroll: !0
        });
    },
    shareModalClose: function() {
        this.setData({
            share_modal_active: "",
            no_scroll: !1
        });
    },
    getGoodsQrcode: function() {
        var e = this;
        if (e.setData({
            goods_qrcode_active: "active",
            share_modal_active: ""
        }), e.data.goods_qrcode) return !0;
        getApp().request({
            url: getApp().api.group.goods_qrcode,
            data: {
                goods_id: e.data.id
            },
            success: function(t) {
                0 == t.code && e.setData({
                    goods_qrcode: t.data.pic_url
                }), 1 == t.code && (e.goodsQrcodeClose(), getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm;
                    }
                }));
            }
        });
    },
    goodsQrcodeClose: function() {
        this.setData({
            goods_qrcode_active: "",
            no_scroll: !1
        });
    }
}, "goodsQrcodeClose", function() {
    this.setData({
        goods_qrcode_active: "",
        no_scroll: !1
    });
}), _defineProperty(_Page, "saveGoodsQrcode", function() {
    var e = this;
    getApp().core.saveImageToPhotosAlbum ? (getApp().core.showLoading({
        title: "正在保存图片",
        mask: !1
    }), getApp().core.downloadFile({
        url: e.data.goods_qrcode,
        success: function(t) {
            getApp().core.showLoading({
                title: "正在保存图片",
                mask: !1
            }), getApp().core.saveImageToPhotosAlbum({
                filePath: t.tempFilePath,
                success: function() {
                    getApp().core.showModal({
                        title: "提示",
                        content: "商品海报保存成功",
                        showCancel: !1
                    });
                },
                fail: function(t) {
                    getApp().core.showModal({
                        title: "图片保存失败",
                        content: t.errMsg,
                        showCancel: !1
                    });
                },
                complete: function(t) {
                    getApp().core.hideLoading();
                }
            });
        },
        fail: function(t) {
            getApp().core.showModal({
                title: "图片下载失败",
                content: t.errMsg + ";" + e.data.goods_qrcode,
                showCancel: !1
            });
        },
        complete: function(t) {
            getApp().core.hideLoading();
        }
    })) : getApp().core.showModal({
        title: "提示",
        content: "当前版本过低，无法使用该功能，请升级到最新版本后重试。",
        showCancel: !1
    });
}), _defineProperty(_Page, "goodsQrcodeClick", function(t) {
    var e = t.currentTarget.dataset.src;
    getApp().core.previewImage({
        urls: [ e ]
    });
}), _defineProperty(_Page, "to_dial", function() {
    var t = this.data.store.contact_tel;
    getApp().core.makePhoneCall({
        phoneNumber: t
    });
}), _Page));