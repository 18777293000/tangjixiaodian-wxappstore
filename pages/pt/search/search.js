var pageNum = 1;

Page({
    data: {
        history_show: !1,
        search_val: "",
        list: [],
        history_info: [],
        show_loading_bar: !1,
        emptyGoods: !1,
        newSearch: !0
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this);
        var e = this;
        getApp().core.getStorage({
            key: "history_info",
            success: function(t) {
                0 < t.data.length && e.setData({
                    history_info: t.data,
                    history_show: !0
                });
            }
        });
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
        var e = this;
        e.data.emptyGoods || (e.data.page_count <= pageNum && e.setData({
            emptyGoods: !0
        }), pageNum++, e.getSearchGoods());
    },
    onShareAppMessage: function(t) {
        getApp().page.onShareAppMessage(this);
    },
    toSearch: function(t) {
        var e = t.detail.value, a = this;
        if (e) {
            var o = a.data.history_info;
            for (var s in o.unshift(e), o) {
                if (o.length <= 20) break;
                o.splice(s, 1);
            }
            getApp().core.setStorageSync(getApp().const.HISTORY_INFO, o), a.setData({
                history_info: o,
                history_show: !1,
                keyword: e,
                list: []
            }), a.getSearchGoods();
        }
    },
    cancelSearchValue: function(t) {
        getApp().core.navigateBack({
            delta: 1
        });
    },
    newSearch: function(t) {
        var e = !1;
        0 < this.data.history_info.length && (e = !0), pageNum = 1, this.setData({
            history_show: e,
            list: [],
            newSearch: [],
            emptyGoods: !1
        });
    },
    clearHistoryInfo: function(t) {
        var e = [];
        getApp().core.setStorageSync(getApp().const.HISTORY_INFO, e), this.setData({
            history_info: e,
            history_show: !1
        });
    },
    getSearchGoods: function() {
        var a = this, t = a.data.keyword;
        t && (a.setData({
            show_loading_bar: !0
        }), getApp().request({
            url: getApp().api.group.search,
            data: {
                keyword: t,
                page: pageNum
            },
            success: function(t) {
                if (0 == t.code) {
                    if (a.data.newSearch) var e = t.data.list; else e = a.data.list.concat(t.data.list);
                    a.setData({
                        list: e,
                        page_count: t.data.page_count,
                        emptyGoods: !0,
                        show_loading_bar: !1
                    }), t.data.page_count > pageNum && a.setData({
                        newSearch: !1,
                        emptyGoods: !1
                    });
                }
            },
            complete: function() {}
        }));
    },
    historyItem: function(t) {
        var e = t.currentTarget.dataset.keyword;
        this.setData({
            keyword: e,
            history_show: !1
        }), this.getSearchGoods();
    }
});