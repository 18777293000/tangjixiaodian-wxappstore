var WxParse = require("../../wxParse/wxParse.js"), shoppingCart = require("../../components/shopping_cart/shopping_cart.js"), specificationsModel = require("../../components/specifications_model/specifications_model.js"), gSpecificationsModel = require("../../components/goods/specifications_model.js"), quickNavigation = require("../../components/quick-navigation/quick-navigation.js"), goodsBanner = require("../../components/goods/goods_banner.js"), p = 1, is_loading_comment = !1, is_more_comment = !0, share_count = 0;

Page({
    data: {
        pageType: "STORE",
        id: null,
        goods: {},
        show_attr_picker: !1,
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
        },
        autoplay: !1,
        hide: "hide",
        show: !1,
        x: getApp().core.getSystemInfoSync().windowWidth,
        y: getApp().core.getSystemInfoSync().windowHeight - 20,
        page: 1,
        drop: !1,
        goodsModel: !1,
        goods_num: 0,
        temporaryGood: {
            price: 0,
            num: 0,
            use_attr: 1
        },
        goodNumCount: 0
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t), quickNavigation.init(this);
        var e = this;
        share_count = 0, is_more_comment = !(is_loading_comment = !(p = 1));
        var o = t.quick;
        if (o) {
            var a = getApp().core.getStorageSync(getApp().const.ITEM);
            if (a) var i = a.total, s = a.carGoods; else i = {
                total_price: 0,
                total_num: 0
            }, s = [];
            e.setData({
                quick: o,
                quick_list: a.quick_list,
                total: i,
                carGoods: s,
                quick_hot_goods_lists: a.quick_hot_goods_lists
            });
        }
        if ("undefined" == typeof my) {
            var r = decodeURIComponent(t.scene);
            if (void 0 !== r) {
                var n = getApp().helper.scene_decode(r);
                n.uid && n.gid && (t.id = n.gid);
            }
        } else if (null !== getApp().query) {
            var d = app.query;
            getApp().query = null, t.id = d.gid;
        }
        e.setData({
            id: t.id
        }), e.getGoods(), e.getCommentList();
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    kfMessage: function() {
        getApp().core.getStorageSync(getApp().const.STORE).show_customer_service || getApp().core.showToast({
            title: "未启用客服功能"
        });
    },
    onShow: function() {
        getApp().page.onShow(this), shoppingCart.init(this), specificationsModel.init(this, shoppingCart), 
        gSpecificationsModel.init(this), goodsBanner.init(this);
        var t = getApp().core.getStorageSync(getApp().const.ITEM);
        if (t) var e = t.total, o = t.carGoods, a = this.data.goods_num; else e = {
            total_price: 0,
            total_num: 0
        }, o = [], a = 0;
        this.setData({
            total: e,
            carGoods: o,
            goods_num: a
        });
    },
    onHide: function() {
        getApp().page.onHide(this), shoppingCart.saveItemData(this);
    },
    onUnload: function() {
        getApp().page.onUnload(this), shoppingCart.saveItemData(this);
    },
    onPullDownRefresh: function() {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function() {
        getApp().page.onReachBottom(this);
        var t = this;
        "active" == t.data.tab_detail && t.data.drop ? (t.data.drop = !1, t.goods_recommend({
            goods_id: t.data.goods.id,
            loadmore: !0
        })) : "active" == t.data.tab_comment && t.getCommentList(!0);
    },
    onShareAppMessage: function() {
        getApp().page.onShareAppMessage(this);
        var e = this, t = getApp().getUser();
        return {
            path: "/pages/goods/goods?id=" + this.data.id + "&user_id=" + t.id,
            success: function(t) {
                1 == ++share_count && e.shareSendCoupon(e);
            },
            title: e.data.goods.name,
            imageUrl: e.data.goods.pic_list[0].pic_url
        };
    },
    play: function(t) {
        var e = t.target.dataset.url;
        this.setData({
            url: e,
            hide: "",
            show: !0
        }), getApp().core.createVideoContext("video").play();
    },
    close: function(t) {
        if ("video" == t.target.id) return !0;
        this.setData({
            hide: "hide",
            show: !1
        }), getApp().core.createVideoContext("video").pause();
    },
    hide: function(t) {
        0 == t.detail.current ? this.setData({
            img_hide: ""
        }) : this.setData({
            img_hide: "hide"
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
            url: getApp().api.default.goods_qrcode,
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
    },
    saveGoodsQrcode: function() {
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
    },
    closeCouponBox: function(t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    to_dial: function(t) {
        var e = this.data.store.contact_tel;
        getApp().core.makePhoneCall({
            phoneNumber: e
        });
    },
    goods_recommend: function(o) {
        var a = this;
        a.setData({
            is_loading: !0
        });
        var i = a.data.page || 2;
        getApp().request({
            url: getApp().api.default.goods_recommend,
            data: {
                goods_id: o.goods_id,
                page: i
            },
            success: function(t) {
                if (0 == t.code) {
                    if (o.reload) var e = t.data.list;
                    if (o.loadmore) e = a.data.goods_list.concat(t.data.list);
                    a.data.drop = !0, a.setData({
                        goods_list: e
                    }), a.setData({
                        page: i + 1
                    });
                }
            },
            complete: function() {
                a.setData({
                    is_loading: !1
                });
            }
        });
    },
    getGoods: function() {
        var r = this;
        if (r.data.quick) {
            var t = r.data.carGoods;
            if (t) {
                for (var e = t.length, o = 0, a = 0; a < e; a++) t[a].goods_id == r.data.id && (o += parseInt(t[a].num));
                r.setData({
                    goods_num: o
                });
            }
        }
        getApp().request({
            url: getApp().api.default.goods,
            data: {
                id: r.data.id
            },
            success: function(t) {
                if (0 == t.code) {
                    var e = t.data.detail;
                    WxParse.wxParse("detail", "html", e, r);
                    var o = t.data;
                    o.attr_pic = t.data.attr_pic, o.cover_pic = t.data.pic_list[0].pic_url;
                    var a = o.pic_list, i = [];
                    for (var s in a) i.push(a[s].pic_url);
                    o.pic_list = i, r.setData({
                        goods: o,
                        attr_group_list: t.data.attr_group_list,
                        btn: !0
                    }), r.goods_recommend({
                        goods_id: t.data.id,
                        reload: !0
                    }), r.selectDefaultAttr();
                }
                1 == t.code && getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.switchTab({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    },
    callPhone: function(t) {
        getApp().core.makePhoneCall({
            phoneNumber: t.target.dataset.info
        });
    },
    close_box: function(t) {
        this.setData({
            showModal: !1
        });
    },
    hideModal: function() {
        this.setData({
            showModal: !1
        });
    },
    buynow: function(t) {
        var e = this.data.carGoods;
        this.data.goodsModel;
        this.setData({
            goodsModel: !1
        });
        for (var o = e.length, a = [], i = [], s = 0; s < o; s++) 0 != e[s].num && (i = {
            goods_id: e[s].goods_id,
            num: e[s].num,
            attr: e[s].attr
        }, a.push(i));
        var r = [];
        r.push({
            mch_id: 0,
            goods_list: a
        }), getApp().core.navigateTo({
            url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(r)
        });
    },
    selectDefaultAttr: function() {
        var t = this;
        if (t.data.goods && 0 === t.data.goods.use_attr) {
            for (var e in t.data.attr_group_list) for (var o in t.data.attr_group_list[e].attr_list) 0 == e && 0 == o && (t.data.attr_group_list[e].attr_list[o].checked = !0);
            t.setData({
                attr_group_list: t.data.attr_group_list
            });
        }
    },
    getCommentList: function(e) {
        var o = this;
        e && "active" != o.data.tab_comment || is_loading_comment || is_more_comment && (is_loading_comment = !0, 
        getApp().request({
            url: getApp().api.default.comment_list,
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
    addCart: function() {
        this.data.btn && this.submit("ADD_CART");
    },
    buyNow: function() {
        this.data.btn && this.submit("BUY_NOW");
    },
    submit: function(t) {
        var e = this;
        if (!e.data.show_attr_picker) return e.setData({
            show_attr_picker: !0
        }), !0;
        if (e.data.miaosha_data && 0 < e.data.miaosha_data.rest_num && e.data.form.number > e.data.miaosha_data.rest_num) return getApp().core.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        if (e.data.form.number > e.data.goods.num) return getApp().core.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        var o = e.data.attr_group_list, a = [];
        for (var i in o) {
            var s = !1;
            for (var r in o[i].attr_list) if (o[i].attr_list[r].checked) {
                s = {
                    attr_id: o[i].attr_list[r].attr_id,
                    attr_name: o[i].attr_list[r].attr_name
                };
                break;
            }
            if (!s) return getApp().core.showToast({
                title: "请选择" + o[i].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            a.push({
                attr_group_id: o[i].attr_group_id,
                attr_group_name: o[i].attr_group_name,
                attr_id: s.attr_id,
                attr_name: s.attr_name
            });
        }
        if ("ADD_CART" == t && (getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), getApp().request({
            url: getApp().api.cart.add_cart,
            method: "POST",
            data: {
                goods_id: e.data.id,
                attr: JSON.stringify(a),
                num: e.data.form.number
            },
            success: function(t) {
                getApp().core.hideLoading(), getApp().core.showToast({
                    title: t.msg,
                    duration: 1500
                }), e.setData({
                    show_attr_picker: !1
                });
            }
        })), "BUY_NOW" == t) {
            e.setData({
                show_attr_picker: !1
            });
            var n = [];
            n.push({
                goods_id: e.data.id,
                num: e.data.form.number,
                attr: a
            });
            var d = e.data.goods, c = 0;
            null != d.mch && (c = d.mch.id);
            var p = [];
            p.push({
                mch_id: c,
                goods_list: n
            }), getApp().core.redirectTo({
                url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(p)
            });
        }
    },
    favoriteAdd: function() {
        var o = this;
        getApp().request({
            url: getApp().api.user.favorite_add,
            method: "post",
            data: {
                goods_id: o.data.goods.id
            },
            success: function(t) {
                if (0 == t.code) {
                    var e = o.data.goods;
                    e.is_favorite = 1, o.setData({
                        goods: e
                    });
                }
            }
        });
    },
    favoriteRemove: function() {
        var o = this;
        getApp().request({
            url: getApp().api.user.favorite_remove,
            method: "post",
            data: {
                goods_id: o.data.goods.id
            },
            success: function(t) {
                if (0 == t.code) {
                    var e = o.data.goods;
                    e.is_favorite = 0, o.setData({
                        goods: e
                    });
                }
            }
        });
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
    }
});