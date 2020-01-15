module.exports = {
    currentPage: null,
    init: function(t) {
        var a = this;
        void 0 === (a.currentPage = t).shoppingCartListModel && (t.shoppingCartListModel = function(t) {
            a.shoppingCartListModel(t);
        }), void 0 === t.hideShoppingCart && (t.hideShoppingCart = function(t) {
            a.hideShoppingCart(t);
        }), void 0 === t.clearShoppingCart && (t.clearShoppingCart = function(t) {
            a.clearShoppingCart(t);
        }), void 0 === t.jia && (t.jia = function(t) {
            a.jia(t);
        }), void 0 === t.jian && (t.jian = function(t) {
            a.jian(t);
        }), void 0 === t.goodNumChange && (t.goodNumChange = function(t) {
            a.goodNumChange(t);
        });
    },
    carStatistics: function(t) {
        var a = t.data.carGoods, o = 0, i = 0;
        for (var r in a) o += a[r].num, i = parseFloat(i) + parseFloat(a[r].goods_price);
        var s = {
            total_num: o,
            total_price: i.toFixed(2)
        };
        0 === o && this.hideShoppingCart(t), t.setData({
            total: s
        });
    },
    hideShoppingCart: function() {
        this.currentPage.setData({
            shoppingCartModel: !1
        });
    },
    shoppingCartListModel: function() {
        var t = this.currentPage, a = (t.data.carGoods, t.data.shoppingCartModel);
        console.log(a), a ? t.setData({
            shoppingCartModel: !1
        }) : t.setData({
            shoppingCartModel: !0
        });
    },
    clearShoppingCart: function(t) {
        var a = (t = this.currentPage).data.quick_hot_goods_lists, o = t.data.quick_list;
        for (var i in a) for (var r in a[i]) a[i].num = 0;
        for (var s in o) for (var n in o[s].goods) o[s].goods[n].num = 0;
        t.setData({
            goodsModel: !1,
            carGoods: [],
            total: {
                total_num: 0,
                total_price: 0
            },
            check_num: 0,
            quick_hot_goods_lists: a,
            quick_list: o,
            currentGood: [],
            checked_attr: [],
            check_goods_price: 0,
            temporaryGood: {},
            goodNumCount: 0,
            goods_num: 0
        }), t.shoppingCartListModel(), getApp().core.removeStorageSync(getApp().const.ITEM);
    },
    saveItemData: function(t) {
        var a = {
            quick_list: t.data.quick_list,
            carGoods: t.data.carGoods,
            total: t.data.total,
            quick_hot_goods_lists: t.data.quick_hot_goods_lists,
            checked_attr: t.data.checked_attr
        };
        getApp().core.setStorageSync(getApp().const.ITEM, a);
    },
    jia: function(t) {
        var a = this.currentPage, o = t.currentTarget.dataset, i = a.data.quick_list;
        for (var r in i) for (var s in i[r].goods) {
            var n = i[r].goods[s];
            if (parseInt(n.id) === parseInt(o.id)) {
                var e = n.num ? n.num + 1 : 1;
                if (e > JSON.parse(n.attr)[0].num) return void wx.showToast({
                    title: "商品库存不足",
                    image: "/images/icon-warning.png"
                });
                n.num = e;
                var d = a.data.carGoods, c = 1, u = o.price ? o.price : n.price;
                for (var g in d) {
                    if (parseInt(d[g].goods_id) === parseInt(n.id) && 1 === JSON.parse(n.attr).length) {
                        c = 0, d[g].num = e, d[g].goods_price = (d[g].num * d[g].price).toFixed(2);
                        break;
                    }
                    var p = o.index;
                    if (d[p]) {
                        c = 0, d[p].num = d[p].num + 1, d[p].goods_price = (d[p].num * d[p].price).toFixed(2);
                        break;
                    }
                }
                if (1 === c || 0 === d.length) {
                    var _ = JSON.parse(i[r].goods[s].attr);
                    d.push({
                        goods_id: parseInt(i[r].goods[s].id),
                        attr: _[0].attr_list,
                        goods_name: i[r].goods[s].name,
                        goods_price: u,
                        num: 1,
                        price: u
                    });
                }
            }
        }
        a.setData({
            carGoods: d,
            quick_list: i
        }), this.carStatistics(a), this.quickHotStatistics(), this.updateGoodNum();
    },
    jian: function(t) {
        var a = this.currentPage, o = t.currentTarget.dataset, i = a.data.quick_list;
        for (var r in i) for (var s in i[r].goods) {
            var n = i[r].goods[s];
            if (parseInt(n.id) === parseInt(o.id)) {
                var e = 0 < n.num ? n.num - 1 : n.num;
                n.num = e;
                var d = a.data.carGoods;
                for (var c in d) {
                    o.price ? o.price : n.price;
                    if (parseInt(d[c].goods_id) === parseInt(n.id) && 1 === JSON.parse(n.attr).length) {
                        d[c].num = e, d[c].goods_price = (d[c].num * d[c].price).toFixed(2);
                        break;
                    }
                    var u = o.index;
                    if (d[u] && 0 < d[u].num) {
                        d[u].num = d[u].num - 1, d[u].goods_price = (d[u].num * d[u].price).toFixed(2);
                        break;
                    }
                }
            }
        }
        a.setData({
            carGoods: d,
            quick_list: i
        }), this.carStatistics(a), this.quickHotStatistics(), this.updateGoodNum();
    },
    goodNumChange: function(t) {
        var a = this.currentPage, o = parseInt(t.detail.value) ? parseInt(t.detail.value) : 0, i = t.target.dataset.id ? parseInt(t.target.dataset.id) : a.data.currentGood.id, r = a.data.carGoods, s = a.data.quick_list, n = a.data.quick_hot_goods_lists, e = o, d = 0, c = "";
        for (var u in s) for (var g in s[u].goods) {
            var p = parseInt(s[u].goods[g].use_attr);
            if ((I = parseInt(s[u].goods[g].id)) === i && 0 === p) {
                var _ = parseInt(s[u].goods[g].goods_num);
                _ < o && (wx.showToast({
                    title: "商品库存不足",
                    image: "/images/icon-warning.png"
                }), e = _), s[u].goods[g].num = e, d = p;
            }
            if (I === i && 1 === p) {
                var h = a.data.temporaryGood;
                h.num < o && (wx.showToast({
                    title: "商品库存不足",
                    image: "/images/icon-warning.png"
                }), e = h.num), d = p, c = s[u].goods[g], a.setData({
                    check_goods_price: (e * h.price).toFixed(2)
                });
            }
        }
        var m = 0;
        for (var l in r) {
            if ((I = parseInt(r[l].goods_id)) === i && 0 === d && (r[l].num = e, r[l].goods_price = (e * r[l].price).toFixed(2)), 
            I === i && 1 === d) {
                var v = a.data.checked_attr, f = r[l].attr, k = [];
                for (var u in f) k.push([ f[u].attr_id, i ]);
                k.sort().join() === v.sort().join() && (r[l].num = e, r[l].goods_price = (e * r[l].price).toFixed(2));
            }
            I === i && (m += r[l].num);
        }
        for (var C in 1 === d && (c.num = m), n) {
            var I;
            (I = parseInt(n[C].id)) === i && 0 === d && (n[C].num = e), I === i && 1 === d && (n[C].num = m);
        }
        a.setData({
            carGoods: r,
            quick_list: s,
            quick_hot_goods_lists: n
        }), this.carStatistics(a);
    },
    quickHotStatistics: function() {
        var t = this.currentPage, a = t.data.quick_hot_goods_lists, o = t.data.quick_list;
        for (var i in a) for (var r in o) for (var s in o[r].goods) parseInt(o[r].goods[s].id) === parseInt(a[i].id) && (a[i].num = o[r].goods[s].num);
        t.setData({
            quick_hot_goods_lists: a
        });
    },
    updateGoodNum: function() {
        var t = this.currentPage, a = t.data.quick_list, o = t.data.goods;
        if (a && o) for (var i in a) for (var r in a[i].goods) if (parseInt(a[i].goods[r].id) === parseInt(o.id)) {
            var s = a[i].goods[r].num, n = a[i].goods[r].num;
            t.setData({
                goods_num: n,
                goodNumCount: s
            });
            break;
        }
    }
};