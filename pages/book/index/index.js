var quickNavigation = require("../../../components/quick-navigation/quick-navigation.js");

Page({
    data: {
        cid: 0,
        scrollLeft: 600,
        scrollTop: 0,
        emptyGoods: 0,
        page: 1,
        pageCount: 0,
        cat_show: 1,
        cid_url: !1
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        if (quickNavigation.init(this), this.systemInfo = getApp().core.getSystemInfoSync(), 
        t.cid) {
            t.cid;
            return this.setData({
                cid_url: !1
            }), void this.switchNav({
                currentTarget: {
                    dataset: {
                        id: t.cid
                    }
                }
            });
        }
        this.setData({
            cid_url: !0
        }), this.loadIndexInfo(this);
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this);
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
    onShareAppMessage: function(t) {
        getApp().page.onShareAppMessage(this);
    },
    loadIndexInfo: function() {
        var a = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.book.index,
            method: "get",
            success: function(t) {
                0 == t.code && (getApp().core.hideLoading(), a.setData({
                    cat: t.data.cat,
                    goods: t.data.goods.list,
                    cat_show: t.data.cat_show,
                    page: t.data.goods.page,
                    pageCount: t.data.goods.page_count
                }), 0 < !t.data.goods.list.length && a.setData({
                    emptyGoods: 1
                }));
            }
        });
    },
    switchNav: function(t) {
        var e = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        });
        var a = 0;
        if (a != t.currentTarget.dataset.id || 0 == t.currentTarget.dataset.id) {
            if (a = t.currentTarget.dataset.id, "wx" == this.data.__platform) {
                var o = e.systemInfo.windowWidth, i = t.currentTarget.offsetLeft, s = e.data.scrollLeft;
                s = o / 2 < i ? i : 0, e.setData({
                    scrollLeft: s
                });
            }
            if ("my" == this.data.__platform) {
                for (var d = e.data.cat, n = !0, p = 0; p < d.length; ++p) if (d[p].id === t.currentTarget.id) {
                    n = !1, 1 <= p ? e.setData({
                        toView: d[p - 1].id
                    }) : e.setData({
                        toView: "0"
                    });
                    break;
                }
                n && e.setData({
                    toView: "0"
                });
            }
            e.setData({
                cid: a,
                page: 1,
                scrollTop: 0,
                emptyGoods: 0,
                goods: [],
                show_loading_bar: 1
            }), getApp().request({
                url: getApp().api.book.list,
                method: "get",
                data: {
                    cid: a
                },
                success: function(t) {
                    if (0 == t.code) {
                        getApp().core.hideLoading();
                        var a = t.data.list;
                        t.data.page_count >= t.data.page ? e.setData({
                            goods: a,
                            page: t.data.page,
                            pageCount: t.data.page_count,
                            show_loading_bar: 0
                        }) : e.setData({
                            emptyGoods: 1
                        });
                    }
                }
            });
        }
    },
    onReachBottom: function(t) {
        var e = this, a = e.data.page, o = e.data.pageCount, i = e.data.cid;
        e.setData({
            show_loading_bar: 1
        }), ++a > o ? e.setData({
            emptyGoods: 1,
            show_loading_bar: 0
        }) : getApp().request({
            url: getApp().api.book.list,
            method: "get",
            data: {
                page: a,
                cid: i
            },
            success: function(t) {
                if (0 == t.code) {
                    var a = e.data.goods;
                    Array.prototype.push.apply(a, t.data.list), e.setData({
                        show_loading_bar: 0,
                        goods: a,
                        page: t.data.page,
                        pageCount: t.data.page_count,
                        emptyGoods: 0
                    });
                }
            }
        });
    }
});