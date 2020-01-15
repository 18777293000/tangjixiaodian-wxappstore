module.exports = {
    currentPage: null,
    shoppingCart: null,
    init: function(t, r) {
        var a = this;
        a.currentPage = t, a.shoppingCart = r, void 0 === t.showDialogBtn && (t.showDialogBtn = function(t) {
            a.showDialogBtn(t);
        }), void 0 === t.attrClick && (t.attrClick = function(t) {
            a.attrClick(t);
        }), void 0 === t.onConfirm && (t.onConfirm = function(t) {
            a.onConfirm(t);
        }), void 0 === t.guigejian && (t.guigejian = function(t) {
            a.guigejian(t);
        });
    },
    showDialogBtn: function(t) {
        var r = this.currentPage, a = this, i = t.currentTarget.dataset;
        getApp().request({
            url: getApp().api.default.goods,
            data: {
                id: i.id
            },
            success: function(t) {
                0 == t.code && (r.setData({
                    currentGood: t.data,
                    goods_name: t.data.name,
                    attr_group_list: t.data.attr_group_list,
                    showModal: !0
                }), a.resetData(), a.updateData(), a.checkAttrNum());
            }
        });
    },
    resetData: function() {
        this.currentPage.setData({
            checked_attr: [],
            check_num: 0,
            check_goods_price: 0,
            temporaryGood: {
                price: "0.00",
                num: 0
            }
        });
    },
    updateData: function() {
        var t = this.currentPage, r = t.data.currentGood, a = t.data.carGoods, i = JSON.parse(r.attr), o = r.attr_group_list;
        for (var e in i) {
            var n = [];
            for (var s in i[e].attr_list) n.push([ i[e].attr_list[s].attr_id, r.id ]);
            for (var c in a) {
                var d = [];
                for (var u in a[c].attr) d.push([ a[c].attr[u].attr_id, a[c].goods_id ]);
                if (n.sort().join() === d.sort().join()) {
                    for (var _ in o) for (var p in o[_].attr_list) for (var g in n) {
                        if (parseInt(o[_].attr_list[p].attr_id) === parseInt(n[g])) {
                            o[_].attr_list[p].checked = !0;
                            break;
                        }
                        o[_].attr_list[p].checked = !1;
                    }
                    var h = {
                        price: a[c].price
                    };
                    return void t.setData({
                        attr_group_list: o,
                        check_num: a[c].num,
                        check_goods_price: a[c].goods_price,
                        checked_attr: n,
                        temporaryGood: h
                    });
                }
            }
        }
    },
    checkUpdateData: function(t) {
        var r = this.currentPage, a = r.data.carGoods;
        for (var i in a) {
            var o = [];
            for (var e in a[i].attr) o.push([ a[i].attr[e].attr_id, a[i].goods_id ]);
            o.sort().join() === t.sort().join() && r.setData({
                check_num: a[i].num,
                check_goods_price: a[i].goods_price
            });
        }
    },
    attrClick: function(t) {
        var r = this.currentPage, a = this, i = parseInt(t.target.dataset.groupId), o = parseInt(t.target.dataset.id), e = r.data.attr_group_list, n = r.data.currentGood;
        for (var s in e) if (e[s].attr_group_id == i) for (var c in e[s].attr_list) {
            (u = e[s].attr_list[c]).attr_id == o && !0 !== u.checked ? u.checked = !0 : u.checked = !1;
        }
        var d = [];
        for (var s in e) for (var c in e[s].attr_list) {
            var u;
            !0 === (u = e[s].attr_list[c]).checked && d.push([ u.attr_id, n.id ]);
        }
        var _ = JSON.parse(n.attr), p = r.data.temporaryGood;
        for (var g in _) {
            var h = [];
            for (var v in _[g].attr_list) h.push([ _[g].attr_list[v].attr_id, n.id ]);
            if (h.sort().join() === d.sort().join()) {
                if (0 === parseInt(_[g].num)) return;
                p = parseFloat(_[g].price) ? {
                    price: _[g].price.toFixed(2),
                    num: _[g].num
                } : {
                    price: n.price.toFixed(2),
                    num: _[g].num
                };
            }
        }
        a.resetData(), a.checkUpdateData(d), r.setData({
            attr_group_list: e,
            temporaryGood: p,
            checked_attr: d
        }), a.checkAttrNum();
    },
    checkAttrNum: function() {
        var t = this.currentPage, r = t.data.attr_group_list, a = JSON.parse(t.data.currentGood.attr), i = t.data.checked_attr, o = [];
        for (var e in i) for (var n in a) {
            var s = [];
            for (var c in a[n].attr_list) s.push(a[n].attr_list[c].attr_id);
            if (getApp().helper.inArray(i[e][0], s) && 0 === a[n].num) for (var d in s) s[d] !== i[e][0] && o.push(s[d]);
        }
        for (var u in r) for (var _ in r[u].attr_list) {
            var p = r[u].attr_list[_];
            p.is_attr_num = !1, getApp().helper.inArray(p.attr_id, o) && (p.is_attr_num = !0);
        }
        t.setData({
            attr_group_list: r
        });
    },
    onConfirm: function(t) {
        var r = this.currentPage, a = r.data.attr_group_list, i = r.data.checked_attr, o = r.data.currentGood;
        if (i.length === a.length) {
            var e = r.data.check_num ? r.data.check_num + 1 : 1, n = JSON.parse(o.attr);
            for (var s in n) {
                var c = [];
                for (var d in n[s].attr_list) if (c.push([ n[s].attr_list[d].attr_id, o.id ]), c.sort().join() === i.sort().join()) {
                    var u = n[s].price ? n[s].price : o.price, _ = n[s].attr_list;
                    if (e > n[s].num) return void wx.showToast({
                        title: "商品库存不足",
                        image: "/images/icon-warning.png"
                    });
                }
            }
            var p = r.data.carGoods, g = 1, h = (parseFloat(u) * e).toFixed(2);
            for (var v in p) {
                var f = [];
                for (var l in p[v].attr) f.push([ p[v].attr[l].attr_id, p[v].goods_id ]);
                if (f.sort().join() === i.sort().join()) {
                    g = 0, p[v].num = p[v].num + 1, p[v].goods_price = (parseFloat(u) * p[v].num).toFixed(2);
                    break;
                }
            }
            1 !== g && 0 !== p.length || p.push({
                goods_id: o.id,
                attr: _,
                goods_name: o.name,
                goods_price: u,
                num: 1,
                price: u
            }), r.setData({
                carGoods: p,
                check_goods_price: h,
                check_num: e
            }), this.shoppingCart.carStatistics(r), this.attrGoodStatistics(), this.shoppingCart.updateGoodNum();
        } else wx.showToast({
            title: "请选择规格",
            image: "/images/icon-warning.png"
        });
    },
    guigejian: function(t) {
        var r = this.currentPage, a = r.data.checked_attr, i = r.data.carGoods, o = r.data.check_num ? --r.data.check_num : 1;
        r.data.currentGood;
        for (var e in i) {
            var n = [];
            for (var s in i[e].attr) n.push([ i[e].attr[s].attr_id, i[e].goods_id ]);
            if (n.sort().join() === a.sort().join()) return 0 < i[e].num && (i[e].num -= 1, 
            i[e].goods_price = (i[e].num * parseFloat(i[e].price)).toFixed(2)), r.setData({
                carGoods: i,
                check_goods_price: i[e].goods_price,
                check_num: o
            }), this.shoppingCart.carStatistics(r), this.attrGoodStatistics(), void this.shoppingCart.updateGoodNum();
        }
    },
    attrGoodStatistics: function() {
        var t = this.currentPage, r = t.data.currentGood, a = t.data.carGoods, i = t.data.quick_list, o = t.data.quick_hot_goods_lists, e = 0;
        for (var n in a) a[n].goods_id === r.id && (e += a[n].num);
        for (var n in i) for (var s in i[n].goods) parseInt(i[n].goods[s].id) === r.id && (i[n].goods[s].num = e);
        for (var n in o) parseInt(o[n].id) === r.id && (o[n].num = e);
        t.setData({
            quick_list: i,
            quick_hot_goods_lists: o
        });
    }
};