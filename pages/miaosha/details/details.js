var utils = require("../../../utils/helper.js"), quickNavigation = require("../../../components/quick-navigation/quick-navigation.js"), goodsBanner = require("../../../components/goods/goods_banner.js"), gSpecificationsModel = require("../../../components/goods/specifications_model.js"), WxParse = require("../../../wxParse/wxParse.js"), p = 1, is_loading_comment = !1, is_more_comment = !0, share_count = 0;

Page({
    data: {
        pageType: "MIAOSHA",
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
        miaosha_end_time_over: {
            h: "--",
            m: "--",
            s: "--",
            type: 0
        }
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t), share_count = 0, is_more_comment = !(is_loading_comment = !(p = 1)), 
        quickNavigation.init(this);
        var a = t.user_id, e = decodeURIComponent(t.scene), o = 0;
        if (void 0 !== a) a; else if ("undefined" == typeof my) {
            if (void 0 !== t.scene) {
                o = 1;
                e = decodeURIComponent(t.scene);
                var i = utils.scene_decode(e);
                i.uid && i.gid ? (i.uid, t.id = i.gid) : e;
            }
        } else if (null !== getApp().query) {
            o = 1;
            var s = getApp().query;
            getApp().query = null, t.id = s.gid;
        }
        var n = this;
        n.setData({
            id: t.id,
            scene_type: o,
            goods_id: t.goods_id
        }), n.getGoods(), n.getCommentList();
    },
    getGoods: function() {
        var s = this, t = {};
        s.data.id && (t.id = s.data.id), s.data.goods_id && (t.goods_id = s.datat.goods_id), 
        t.scene_type = s.data.scene_type, getApp().request({
            url: getApp().api.miaosha.details,
            data: t,
            success: function(t) {
                if (0 == t.code) {
                    var a = t.data.detail;
                    WxParse.wxParse("detail", "html", a, s);
                    var e = t.data, o = [];
                    for (var i in e.pic_list) o.push(e.pic_list[i].pic_url);
                    e.pic_list = o, s.setData({
                        goods: e,
                        attr_group_list: t.data.attr_group_list,
                        miaosha_data: t.data.miaosha.miaosha_data
                    }), 1 == s.data.scene_type && s.setData({
                        id: t.data.miaosha.miaosha_goods_id
                    }), s.data.goods.miaosha && s.setMiaoshaTimeOver(), s.selectDefaultAttr();
                }
                1 == t.code && getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.redirectTo({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    },
    selectDefaultAttr: function() {
        var t = this;
        if (t.data.goods && 0 === t.data.goods.use_attr) {
            for (var a in t.data.attr_group_list) for (var e in t.data.attr_group_list[a].attr_list) 0 == a && 0 == e && (t.data.attr_group_list[a].attr_list[e].checked = !0);
            t.setData({
                attr_group_list: t.data.attr_group_list
            });
        }
    },
    getCommentList: function(a) {
        var e = this;
        a && "active" != e.data.tab_comment || is_loading_comment || is_more_comment && (is_loading_comment = !0, 
        getApp().request({
            url: getApp().api.miaosha.comment_list,
            data: {
                goods_id: e.data.id,
                page: p
            },
            success: function(t) {
                0 == t.code && (is_loading_comment = !1, p++, e.setData({
                    comment_count: t.data.comment_count,
                    comment_list: a ? e.data.comment_list.concat(t.data.list) : t.data.list
                }), 0 == t.data.list.length && (is_more_comment = !1));
            }
        }));
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
        var t = this, a = t.data.form.number;
        if (++a > t.data.goods.miaosha.buy_max && 0 != t.data.goods.miaosha.buy_max) return getApp().core.showToast({
            title: "一单限购" + t.data.goods.miaosha.buy_max,
            image: "/images/icon-warning.png"
        }), !0;
        t.setData({
            form: {
                number: a
            }
        });
    },
    numberBlur: function(t) {
        var a = this, e = t.detail.value;
        e = parseInt(e), isNaN(e) && (e = 1), e <= 0 && (e = 1), e > a.data.goods.miaosha.buy_max && 0 != a.data.goods.miaosha.buy_max && (getApp().core.showToast({
            title: "一单限购" + a.data.goods.miaosha.buy_max + "件",
            image: "/images/icon-warning.png"
        }), e = a.data.goods.miaosha.buy_max), a.setData({
            form: {
                number: e
            }
        });
    },
    addCart: function() {
        this.submit("ADD_CART");
    },
    buyNow: function() {
        this.data.goods.miaosha ? this.submit("BUY_NOW") : getApp().core.showModal({
            title: "提示",
            content: "秒杀商品当前时间暂无活动",
            showCancel: !1,
            success: function(t) {}
        });
    },
    submit: function(t) {
        var a = this;
        if (!a.data.show_attr_picker) return a.setData({
            show_attr_picker: !0
        }), !0;
        if (a.data.miaosha_data && 0 < a.data.miaosha_data.rest_num && a.data.form.number > a.data.miaosha_data.rest_num) return getApp().core.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        if (1e3 * this.data.goods.miaosha.begin_time > Date.parse(new Date())) return getApp().core.showToast({
            title: "活动未开始",
            image: "/images/icon-warning.png"
        }), !0;
        if (a.data.form.number > a.data.goods.num) return getApp().core.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        var e = a.data.attr_group_list, o = [];
        for (var i in e) {
            var s = !1;
            for (var n in e[i].attr_list) if (e[i].attr_list[n].checked) {
                s = {
                    attr_id: e[i].attr_list[n].attr_id,
                    attr_name: e[i].attr_list[n].attr_name
                };
                break;
            }
            if (!s) return getApp().core.showToast({
                title: "请选择" + e[i].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            o.push({
                attr_group_id: e[i].attr_group_id,
                attr_group_name: e[i].attr_group_name,
                attr_id: s.attr_id,
                attr_name: s.attr_name
            });
        }
        "ADD_CART" == t && (getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), getApp().request({
            url: getApp().api.cart.add_cart,
            method: "POST",
            data: {
                goods_id: a.data.id,
                attr: JSON.stringify(o),
                num: a.data.form.number
            },
            success: function(t) {
                getApp().core.showToast({
                    title: t.msg,
                    duration: 1500
                }), getApp().core.hideLoading(), a.setData({
                    show_attr_picker: !1
                });
            }
        })), "BUY_NOW" == t && (a.setData({
            show_attr_picker: !1
        }), getApp().core.redirectTo({
            url: "/pages/miaosha/order-submit/order-submit?goods_info=" + JSON.stringify({
                goods_id: a.data.id,
                attr: o,
                num: a.data.form.number
            })
        }));
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
    favoriteAdd: function() {
        var e = this;
        getApp().request({
            url: getApp().api.user.favorite_add,
            method: "post",
            data: {
                goods_id: e.data.goods.id
            },
            success: function(t) {
                if (0 == t.code) {
                    var a = e.data.goods;
                    a.is_favorite = 1, e.setData({
                        goods: a
                    });
                }
            }
        });
    },
    favoriteRemove: function() {
        var e = this;
        getApp().request({
            url: getApp().api.user.favorite_remove,
            method: "post",
            data: {
                goods_id: e.data.goods.id
            },
            success: function(t) {
                if (0 == t.code) {
                    var a = e.data.goods;
                    a.is_favorite = 0, e.setData({
                        goods: a
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
        var a = t.currentTarget.dataset.index, e = t.currentTarget.dataset.picIndex;
        getApp().core.previewImage({
            current: this.data.comment_list[a].pic_list[e],
            urls: this.data.comment_list[a].pic_list
        });
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this), goodsBanner.init(this), gSpecificationsModel.init(this);
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
        var a = this, e = getApp().getUser();
        return {
            path: "/pages/miaosha/details/details?id=" + this.data.id + "&user_id=" + e.id,
            success: function(t) {
                1 == ++share_count && getApp().shareSendCoupon(a);
            },
            title: a.data.goods.name,
            imageUrl: a.data.goods.pic_list[0].pic_url
        };
    },
    play: function(t) {
        var a = t.target.dataset.url;
        this.setData({
            url: a,
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
        var a = this;
        if (a.setData({
            goods_qrcode_active: "active",
            share_modal_active: ""
        }), a.data.goods_qrcode) return !0;
        getApp().request({
            url: getApp().api.miaosha.goods_qrcode,
            data: {
                goods_id: a.data.id
            },
            success: function(t) {
                0 == t.code && a.setData({
                    goods_qrcode: t.data.pic_url
                }), 1 == t.code && (a.goodsQrcodeClose(), getApp().core.showModal({
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
        var a = this;
        getApp().core.saveImageToPhotosAlbum ? (getApp().core.showLoading({
            title: "正在保存图片",
            mask: !1
        }), getApp().core.downloadFile({
            url: a.data.goods_qrcode,
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
                    content: t.errMsg + ";" + a.data.goods_qrcode,
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
    goodsQrcodeClick: function(t) {
        var a = t.currentTarget.dataset.src;
        getApp().core.previewImage({
            urls: [ a ]
        });
    },
    closeCouponBox: function(t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    setMiaoshaTimeOver: function() {
        var a = this;
        function t() {
            var t = a.data.goods.miaosha.end_time - a.data.goods.miaosha.now_time;
            t = t < 0 ? 0 : t, a.data.goods.miaosha.now_time++, a.setData({
                goods: a.data.goods,
                miaosha_end_time_over: function(t) {
                    var a = parseInt(t / 3600), e = parseInt(t % 3600 / 60), o = t % 60, i = 0;
                    1 <= a && (a -= 1, i = 1);
                    return {
                        h: a < 10 ? "0" + a : "" + a,
                        m: e < 10 ? "0" + e : "" + e,
                        s: o < 10 ? "0" + o : "" + o,
                        type: i
                    };
                }(t)
            });
        }
        t(), setInterval(function() {
            t();
        }, 1e3);
    },
    to_dial: function(t) {
        var a = this.data.store.contact_tel;
        getApp().core.makePhoneCall({
            phoneNumber: a
        });
    }
});