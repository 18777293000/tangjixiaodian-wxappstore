var _Page;

function _defineProperty(t, e, o) {
    return e in t ? Object.defineProperty(t, e, {
        value: o,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = o, t;
}

var utils = require("../../../utils/helper.js"), WxParse = require("../../../wxParse/wxParse.js"), gSpecificationsModel = require("../../../components/goods/specifications_model.js"), goodsBanner = require("../../../components/goods/goods_banner.js"), p = 1, is_loading_comment = !1, is_more_comment = !0;

Page((_defineProperty(_Page = {
    data: {
        pageType: "BOOK",
        form: {
            number: 1
        },
        tab_detail: "active",
        tab_comment: "",
        comment_list: [],
        comment_count: {
            score_all: 0,
            score_3: 0,
            score_2: 0,
            score_1: 0
        }
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = t.user_id, o = decodeURIComponent(t.scene);
        if (void 0 !== e) e; else if (void 0 !== o) {
            var a = utils.scene_decode(o);
            a.uid && a.gid ? (a.uid, t.id = a.gid) : o;
        } else if (null !== getApp().query) {
            var i = getApp().query;
            getApp().query = null, t.id = i.gid, i.uid;
        }
        this.setData({
            id: t.id
        }), p = 1, this.getGoodsInfo(t), this.getCommentList(!1);
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this), gSpecificationsModel.init(this), goodsBanner.init(this);
    },
    onHide: function(t) {
        getApp().page.onHide(this);
    },
    onUnload: function(t) {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function(t) {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function(t) {
        getApp().page.onReachBottom(this);
        this.getCommentList(!0);
    },
    onShareAppMessage: function(t) {
        getApp().page.onShareAppMessage(this);
        var e = this, o = getApp().core.getStorageSync(getApp().const.USER_INFO);
        return {
            title: e.data.goods.name,
            path: "/pages/book/details/details?id=" + e.data.goods.id + "&user_id=" + o.id,
            imageUrl: e.data.goods.cover_pic,
            success: function(t) {}
        };
    },
    getGoodsInfo: function(t) {
        var e = t.id, a = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.book.details,
            method: "get",
            data: {
                gid: e
            },
            success: function(t) {
                if (0 == t.code) {
                    var e = t.data.info.detail;
                    WxParse.wxParse("detail", "html", e, a);
                    var o = parseInt(t.data.info.virtual_sales) + parseInt(t.data.info.sales);
                    t.data.attr_group_list.length <= 0 && (t.data.attr_group_list = [ {
                        attr_group_name: "规格",
                        attr_list: [ {
                            attr_id: 0,
                            attr_name: "默认",
                            checked: !0
                        } ]
                    } ]), t.data.info.num = t.data.info.stock, a.setData({
                        goods: t.data.info,
                        shop: t.data.shopList,
                        sales: o,
                        attr_group_list: t.data.attr_group_list
                    }), a.selectDefaultAttr();
                } else getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.redirectTo({
                            url: "/pages/book/index/index"
                        });
                    }
                });
            },
            complete: function(t) {
                getApp().core.hideLoading();
            }
        });
    },
    onGoodsImageClick: function(t) {
        var e = [], o = t.currentTarget.dataset.index;
        for (var a in this.data.goods.pic_list) e.push(this.data.goods.pic_list[a]);
        getApp().core.previewImage({
            urls: e,
            current: e[o]
        });
    },
    selectDefaultAttr: function() {
        var t = this;
        if (t.data.goods && 0 == t.data.goods.use_attr) {
            for (var e in t.data.attr_group_list) for (var o in t.data.attr_group_list[e].attr_list) 0 == e && 0 == o && (t.data.attr_group_list[e].attr_list[o].checked = !0);
            t.setData({
                attr_group_list: t.data.attr_group_list
            });
        }
    },
    tabSwitch: function(t) {
        "detail" == t.currentTarget.dataset.tab ? this.setData({
            tab_detail: "active",
            tab_comment: ""
        }) : this.setData({
            tab_detail: "",
            tab_comment: "active"
        });
    },
    commentPicView: function(t) {
        var e = t.currentTarget.dataset.index, o = t.currentTarget.dataset.picIndex;
        getApp().core.previewImage({
            current: this.data.comment_list[e].pic_list[o],
            urls: this.data.comment_list[e].pic_list
        });
    },
    bespeakNow: function(t) {
        if (!this.data.show_attr_picker) return this.setData({
            show_attr_picker: !0
        }), !0;
        for (var e = [], o = !0, a = this.data.attr_group_list, i = 0; i < a.length; i++) {
            var s = a[i].attr_list;
            o = !0;
            for (var r = 0; r < s.length; r++) s[r].checked && (e.push({
                attr_group_id: a[i].attr_group_id,
                attr_id: s[r].attr_id,
                attr_group_name: a[i].attr_group_name,
                attr_name: s[r].attr_name
            }), o = !1);
            if (o) return void getApp().core.showModal({
                title: "提示",
                content: "请选择" + a[i].attr_group_name,
                showCancel: !1
            });
        }
        var n = [ {
            id: this.data.goods.id,
            attr: e
        } ];
        getApp().core.redirectTo({
            url: "/pages/book/submit/submit?goods_info=" + JSON.stringify(n)
        });
    },
    hideAttrPicker: function() {
        this.setData({
            show_attr_picker: !1
        });
    },
    attrGoodsClick: function(t) {
        var i = this, e = t.target.dataset.groupId, o = t.target.dataset.id, a = i.data.attr_group_list;
        for (var s in a) if (a[s].attr_group_id == e) for (var r in a[s].attr_list) a[s].attr_list[r].checked = a[s].attr_list[r].attr_id == o;
        i.setData({
            attr_group_list: a
        });
        var n = [], c = 0;
        for (s = 0; s < a.length; s++) {
            var d = a[s].attr_list;
            for (r = c = 0; r < d.length; r++) d[r].checked && (c = d[r].attr_id);
            if (!c) return;
            n.push(c);
        }
        var p = i.data.goods;
        p.attr.forEach(function(t, e, o) {
            var a = [];
            t.attr_list.forEach(function(t, e, o) {
                a.push(t.attr_id);
            }), n.sort().toString() == a.sort().toString() && (p.attr_pic = t.pic, p.stock = t.num, 
            p.price = t.price, i.setData({
                goods: p
            }));
        });
    },
    goToShopList: function(t) {
        getApp().core.navigateTo({
            url: "/pages/book/shop/shop?ids=" + this.data.goods.shop_id,
            success: function(t) {},
            fail: function(t) {},
            complete: function(t) {}
        });
    },
    getCommentList: function(e) {
        var o = this;
        e && "active" != o.data.tab_comment || is_loading_comment || is_more_comment && (is_loading_comment = !0, 
        getApp().request({
            url: getApp().api.book.goods_comment,
            data: {
                goods_id: o.data.id,
                page: p
            },
            success: function(t) {
                0 == t.code && (is_loading_comment = !1, p++, o.setData({
                    comment_count: t.data.comment_count,
                    comment_list: e ? o.data.comment_list.concat(t.data.list) : t.data.list
                }), 0 == t.data.list.length && (is_more_comment = !1));
            }
        }));
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
            url: getApp().api.book.goods_qrcode,
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
}), _defineProperty(_Page, "goHome", function(t) {
    getApp().core.redirectTo({
        url: "/pages/book/index/index",
        success: function(t) {},
        fail: function(t) {},
        complete: function(t) {}
    });
}), _Page));